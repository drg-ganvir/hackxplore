import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { Team, TeamJoinRequest } from "@/types";

// ─── SUPABASE HELPERS ─────────────────────────────────────────────────────────

// Map DB row → Team type
function rowToTeam(row: any): Team {
  return {
    id: row.id,
    hackathonId: row.hackathon_id,
    name: row.name,
    description: row.description || "",
    leaderId: row.leader_id,
    members: row.members || [],
    skillsNeeded: row.skills_needed || [],
    maxMembers: row.max_members || 4,
    isOpen: row.is_open ?? true,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Map DB row → TeamJoinRequest type
function rowToRequest(row: any): TeamJoinRequest {
  return {
    id: row.id,
    teamId: row.team_id,
    userId: row.user_id,
    status: row.status,
    createdAt: row.created_at,
  };
}

// ─── HOOK ─────────────────────────────────────────────────────────────────────

export const useTeams = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["hackathon-teams"] });
    queryClient.invalidateQueries({ queryKey: ["user-teams"] });
    queryClient.invalidateQueries({ queryKey: ["all-teams"] });
  };

  // ── CREATE TEAM ──────────────────────────────────────────────────────────────
  const createTeam = async (
    teamData: Omit<Team, "id" | "members" | "createdAt" | "updatedAt" | "isOpen" | "leaderId">
  ) => {
    if (!user) return { success: false, error: "Please sign in to create a team" };

    const newTeam = {
      id: `team-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      hackathon_id: teamData.hackathonId,
      name: teamData.name,
      description: teamData.description,
      leader_id: user.id,
      members: [user.id],
      skills_needed: teamData.skillsNeeded || [],
      max_members: teamData.maxMembers || 4,
      is_open: true,
    };

    const { data, error } = await supabase
      .from("teams")
      .insert(newTeam)
      .select()
      .single();

    if (error) {
      console.error("createTeam error:", error);
      return { success: false, error: error.message };
    }

    invalidate();
    return { success: true, data: rowToTeam(data) };
  };

  // ── DELETE TEAM ──────────────────────────────────────────────────────────────
  const deleteTeam = async (teamId: string) => {
    if (!user) return { success: false, error: "Please sign in" };

    const { error } = await supabase
      .from("teams")
      .delete()
      .eq("id", teamId)
      .eq("leader_id", user.id);

    if (error) return { success: false, error: error.message };

    invalidate();
    return { success: true };
  };

  // ── GET TEAMS FOR A HACKATHON ─────────────────────────────────────────────────
  const useHackathonTeams = (hackathonId: string) => {
    return useQuery({
      queryKey: ["hackathon-teams", hackathonId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("teams")
          .select("*")
          .eq("hackathon_id", hackathonId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        return (data || []).map(rowToTeam);
      },
      staleTime: 10 * 1000,
      refetchInterval: 15 * 1000, // poll every 15s — teams appear in real-time
    });
  };

  // ── GET ALL TEAMS ─────────────────────────────────────────────────────────────
  const useAllTeams = () => {
    return useQuery({
      queryKey: ["all-teams"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("teams")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        return (data || []).map(rowToTeam);
      },
      staleTime: 10 * 1000,
      refetchInterval: 15 * 1000,
    });
  };

  // ── GET USER'S TEAMS ──────────────────────────────────────────────────────────
  const useUserTeams = () => {
    return useQuery({
      queryKey: ["user-teams", user?.id],
      queryFn: async () => {
        if (!user) return [];
        const { data, error } = await supabase
          .from("teams")
          .select("*")
          .contains("members", [user.id])
          .order("created_at", { ascending: false });

        if (error) throw error;
        return (data || []).map(rowToTeam);
      },
      enabled: !!user,
      staleTime: 10 * 1000,
      refetchInterval: 15 * 1000,
    });
  };

  // ── SEND JOIN REQUEST ─────────────────────────────────────────────────────────
  const sendJoinRequest = async (teamId: string) => {
    if (!user) return { success: false, error: "Please sign in to join a team" };

    // Check for existing request
    const { data: existing } = await supabase
      .from("join_requests")
      .select("id")
      .eq("team_id", teamId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) return { success: false, error: "You already sent a join request to this team" };

    // Check if already a member
    const { data: team } = await supabase
      .from("teams")
      .select("members")
      .eq("id", teamId)
      .maybeSingle();

    if (team?.members?.includes(user.id)) {
      return { success: false, error: "You are already a member of this team" };
    }

    const { data, error } = await supabase
      .from("join_requests")
      .insert({
        id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        team_id: teamId,
        user_id: user.id,
        user_email: user.email || "",
        status: "pending",
      })
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    queryClient.invalidateQueries({ queryKey: ["user-sent-requests"] });
    queryClient.invalidateQueries({ queryKey: ["team-requests", teamId] });

    return { success: true, data: rowToRequest(data) };
  };

  // ── RESPOND TO JOIN REQUEST ───────────────────────────────────────────────────
  const respondToJoinRequest = async (
    requestId: string,
    action: "accepted" | "rejected"
  ) => {
    if (!user) return { success: false, error: "Not authenticated" };

    // Get the request
    const { data: req, error: reqErr } = await supabase
      .from("join_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (reqErr || !req) return { success: false, error: "Request not found" };

    // Update request status
    const { error: updateErr } = await supabase
      .from("join_requests")
      .update({ status: action })
      .eq("id", requestId);

    if (updateErr) return { success: false, error: updateErr.message };

    if (action === "accepted") {
      // Add user to team members array
      const { data: teamData } = await supabase
        .from("teams")
        .select("members")
        .eq("id", req.team_id)
        .single();

      const currentMembers: string[] = teamData?.members || [];
      if (!currentMembers.includes(req.user_id)) {
        await supabase
          .from("teams")
          .update({
            members: [...currentMembers, req.user_id],
            updated_at: new Date().toISOString(),
          })
          .eq("id", req.team_id);
      }
    }

    invalidate();
    queryClient.invalidateQueries({ queryKey: ["team-requests", req.team_id] });

    return { success: true };
  };

  // ── GET PENDING REQUESTS FOR A TEAM ──────────────────────────────────────────
  const useTeamRequests = (teamId: string) => {
    return useQuery({
      queryKey: ["team-requests", teamId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("join_requests")
          .select("*")
          .eq("team_id", teamId)
          .eq("status", "pending")
          .order("created_at", { ascending: false });

        if (error) throw error;
        return (data || []).map(rowToRequest);
      },
      staleTime: 10 * 1000,
      refetchInterval: 15 * 1000,
    });
  };

  // ── GET USER'S SENT REQUESTS ──────────────────────────────────────────────────
  const useUserSentRequests = () => {
    return useQuery({
      queryKey: ["user-sent-requests", user?.id],
      queryFn: async () => {
        if (!user) return [];
        const { data, error } = await supabase
          .from("join_requests")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        return (data || []).map(rowToRequest);
      },
      enabled: !!user,
      staleTime: 10 * 1000,
    });
  };

  // ── JOIN TEAM DIRECTLY ────────────────────────────────────────────────────────
  const joinTeam = async (teamId: string) => {
    if (!user) return { success: false, error: "Please sign in" };

    const { data: teamData, error: fetchErr } = await supabase
      .from("teams")
      .select("members, max_members")
      .eq("id", teamId)
      .single();

    if (fetchErr) return { success: false, error: "Team not found" };

    const members: string[] = teamData.members || [];
    if (members.includes(user.id)) return { success: false, error: "Already a member" };
    if (members.length >= teamData.max_members) return { success: false, error: "Team is full" };

    const { error } = await supabase
      .from("teams")
      .update({ members: [...members, user.id], updated_at: new Date().toISOString() })
      .eq("id", teamId);

    if (error) return { success: false, error: error.message };

    invalidate();
    return { success: true };
  };

  // ── LEAVE TEAM ────────────────────────────────────────────────────────────────
  const leaveTeam = async (teamId: string) => {
    if (!user) return { success: false, error: "Please sign in" };

    const { data: teamData } = await supabase
      .from("teams")
      .select("members")
      .eq("id", teamId)
      .single();

    if (!teamData) return { success: false, error: "Team not found" };

    const updatedMembers = (teamData.members || []).filter((m: string) => m !== user.id);

    if (updatedMembers.length === 0) {
      // Delete team if empty
      await supabase.from("teams").delete().eq("id", teamId);
    } else {
      await supabase
        .from("teams")
        .update({ members: updatedMembers, updated_at: new Date().toISOString() })
        .eq("id", teamId);
    }

    invalidate();
    return { success: true };
  };

  // ── IS USER IN TEAM ───────────────────────────────────────────────────────────
  const isUserInTeam = (teamId: string): boolean => {
    // This is a sync check — used for UI rendering
    // The actual data comes from useHackathonTeams query
    return false; // Will be checked via query data in the component
  };

  return {
    createTeam,
    deleteTeam,
    useHackathonTeams,
    useAllTeams,
    useUserTeams,
    sendJoinRequest,
    respondToJoinRequest,
    useTeamRequests,
    useUserSentRequests,
    joinTeam,
    leaveTeam,
    isUserInTeam,
  };
};
