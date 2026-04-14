import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Team, TeamJoinRequest } from "@/types";

// ─── MAPPERS ──────────────────────────────────────────────────────────────────
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

function rowToRequest(row: any): TeamJoinRequest {
  return {
    id: row.id,
    teamId: row.team_id,
    userId: row.user_id,
    userEmail: row.user_email || row.user_id,
    status: row.status,
    createdAt: row.created_at,
  };
}

// ─── STANDALONE HOOKS (called at top level, not inside useTeams) ──────────────

export function useHackathonTeams(hackathonId: string) {
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
    refetchInterval: 15 * 1000,
  });
}

export function useTeamRequests(teamId: string) {
  return useQuery({
    queryKey: ["team-requests", teamId],
    queryFn: async () => {
      if (!teamId) return [];
      const { data, error } = await supabase
        .from("join_requests")
        .select("*")
        .eq("team_id", teamId)
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(rowToRequest);
    },
    enabled: !!teamId,
    staleTime: 5 * 1000,
    refetchInterval: 10 * 1000, // poll every 10s so leader sees requests fast
  });
}

export function useUserTeams(userId: string | undefined) {
  return useQuery({
    queryKey: ["user-teams", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .contains("members", [userId])
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(rowToTeam);
    },
    enabled: !!userId,
    staleTime: 10 * 1000,
    refetchInterval: 15 * 1000,
  });
}

export function useUserSentRequests(userId: string | undefined) {
  return useQuery({
    queryKey: ["user-sent-requests", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("join_requests")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(rowToRequest);
    },
    enabled: !!userId,
    staleTime: 10 * 1000,
  });
}

// ─── ACTIONS HOOK ─────────────────────────────────────────────────────────────

export const useTeamActions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["hackathon-teams"] });
    queryClient.invalidateQueries({ queryKey: ["user-teams"] });
    queryClient.invalidateQueries({ queryKey: ["team-requests"] });
  };

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
      .from("teams").insert(newTeam).select().single();

    if (error) return { success: false, error: error.message, userEmail: undefined };
    invalidateAll();
    return { success: true, data: rowToTeam(data) };
  };

  const deleteTeam = async (teamId: string) => {
    if (!user) return { success: false, error: "Please sign in" };
    const { error } = await supabase.from("teams").delete()
      .eq("id", teamId).eq("leader_id", user.id);
    if (error) return { success: false, error: error.message, userEmail: undefined };
    invalidateAll();
    return { success: true };
  };

  const sendJoinRequest = async (teamId: string) => {
    if (!user) return { success: false, error: "Please sign in to join a team" };

    // Check existing request
    const { data: existing } = await supabase.from("join_requests")
      .select("id").eq("team_id", teamId).eq("user_id", user.id).maybeSingle();
    if (existing) return { success: false, error: "You already sent a request to this team" };

    // Check already member
    const { data: team } = await supabase.from("teams")
      .select("members").eq("id", teamId).maybeSingle();
    if (team?.members?.includes(user.id))
      return { success: false, error: "You are already a member of this team" };

    const { data, error } = await supabase.from("join_requests").insert({
      id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      team_id: teamId,
      user_id: user.id,
      user_email: user.email || user.id,
      status: "pending",
    }).select().single();

    if (error) return { success: false, error: error.message, userEmail: undefined };

    // Invalidate the specific team's requests so leader sees it immediately
    queryClient.invalidateQueries({ queryKey: ["team-requests", teamId] });
    queryClient.invalidateQueries({ queryKey: ["user-sent-requests", user.id] });

    return { success: true, data: rowToRequest(data) };
  };

  const respondToJoinRequest = async (requestId: string, action: "accepted" | "rejected") => {
    if (!user) return { success: false, error: "Not authenticated" };

    const { data: req, error: reqErr } = await supabase
      .from("join_requests").select("*").eq("id", requestId).single();
    if (reqErr || !req) return { success: false, error: "Request not found" };

    // Update request status
    const { error: updateErr } = await supabase.from("join_requests")
      .update({ status: action }).eq("id", requestId);
    if (updateErr) return { success: false, error: updateErr.message };

    if (action === "accepted") {
      const { data: teamData } = await supabase.from("teams")
        .select("members").eq("id", req.team_id).single();
      const currentMembers: string[] = teamData?.members || [];
      if (!currentMembers.includes(req.user_id)) {
        await supabase.from("teams").update({
          members: [...currentMembers, req.user_id],
          updated_at: new Date().toISOString(),
        }).eq("id", req.team_id);
      }
    }

    invalidateAll();
    queryClient.invalidateQueries({ queryKey: ["team-requests", req.team_id] });

    return { success: true, userEmail: req.user_email || req.user_id, error: undefined };
  };

  const joinTeam = async (teamId: string) => {
    if (!user) return { success: false, error: "Please sign in" };
    const { data: teamData, error: fetchErr } = await supabase
      .from("teams").select("members, max_members").eq("id", teamId).single();
    if (fetchErr) return { success: false, error: "Team not found" };
    const members: string[] = teamData.members || [];
    if (members.includes(user.id)) return { success: false, error: "Already a member" };
    if (members.length >= teamData.max_members) return { success: false, error: "Team is full" };
    const { error } = await supabase.from("teams")
      .update({ members: [...members, user.id], updated_at: new Date().toISOString() })
      .eq("id", teamId);
    if (error) return { success: false, error: error.message, userEmail: undefined };
    invalidateAll();
    return { success: true };
  };

  const leaveTeam = async (teamId: string) => {
    if (!user) return { success: false, error: "Please sign in" };
    const { data: teamData } = await supabase.from("teams")
      .select("members").eq("id", teamId).single();
    if (!teamData) return { success: false, error: "Team not found" };
    const updated = (teamData.members || []).filter((m: string) => m !== user.id);
    if (updated.length === 0) {
      await supabase.from("teams").delete().eq("id", teamId);
    } else {
      await supabase.from("teams")
        .update({ members: updated, updated_at: new Date().toISOString() })
        .eq("id", teamId);
    }
    invalidateAll();
    return { success: true };
  };

  return {
    createTeam, deleteTeam, sendJoinRequest,
    respondToJoinRequest, joinTeam, leaveTeam,
  };
};

// ─── LEGACY HOOK (keeps Profile.tsx and other pages working) ──────────────────
export const useTeams = () => {
  const { user } = useAuth();
  const actions = useTeamActions();

  return {
    ...actions,
    useHackathonTeams,
    useTeamRequests,
    useAllTeams: () => useHackathonTeams(""), // fallback
    useUserTeams: () => useUserTeams(user?.id),
    useUserSentRequests: () => useUserSentRequests(user?.id),
    isUserInTeam: () => false,
  };
};
