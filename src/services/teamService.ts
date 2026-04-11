import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Team, TeamJoinRequest } from "@/types";

// ─── PERSISTENT STORAGE ───────────────────────────────────────────────────────
// Teams are stored in localStorage so they persist across page reloads
// and are visible to ALL users (shared storage key)

const TEAMS_KEY = "hackxplore_teams";
const REQUESTS_KEY = "hackxplore_join_requests";

function getTeams(): Team[] {
  try {
    const raw = localStorage.getItem(TEAMS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTeams(teams: Team[]) {
  try {
    localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
  } catch {}
}

function getRequests(): TeamJoinRequest[] {
  try {
    const raw = localStorage.getItem(REQUESTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRequests(requests: TeamJoinRequest[]) {
  try {
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
  } catch {}
}

// ─── HOOK ─────────────────────────────────────────────────────────────────────

export const useTeams = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // ── CREATE TEAM ──────────────────────────────────────────────────────────────
  const createTeam = async (
    teamData: Omit<Team, "id" | "members" | "createdAt" | "isOpen" | "updatedAt" | "leaderId">
  ) => {
    if (!user) return { success: false, error: "Please sign in to create a team" };

    const newTeam: Team = {
      id: `team-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      leaderId: user.id,
      members: [user.id],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOpen: true,
      ...teamData,
    };

    const teams = getTeams();
    teams.push(newTeam);
    saveTeams(teams);

    // Invalidate all team queries so UI refreshes everywhere
    queryClient.invalidateQueries({ queryKey: ["hackathon-teams"] });
    queryClient.invalidateQueries({ queryKey: ["user-teams"] });
    queryClient.invalidateQueries({ queryKey: ["all-teams"] });

    return { success: true, data: newTeam };
  };

  // ── DELETE TEAM ──────────────────────────────────────────────────────────────
  const deleteTeam = async (teamId: string) => {
    if (!user) return { success: false, error: "Please sign in" };

    const teams = getTeams();
    const team = teams.find((t) => t.id === teamId);

    if (!team) return { success: false, error: "Team not found" };
    if (team.leaderId !== user.id && !team.members.includes(user.id)) {
      return { success: false, error: "Not authorized to delete this team" };
    }

    const updated = teams.filter((t) => t.id !== teamId);
    saveTeams(updated);

    queryClient.invalidateQueries({ queryKey: ["hackathon-teams"] });
    queryClient.invalidateQueries({ queryKey: ["user-teams"] });
    queryClient.invalidateQueries({ queryKey: ["all-teams"] });

    return { success: true };
  };

  // ── GET TEAMS FOR A HACKATHON ─────────────────────────────────────────────────
  const useHackathonTeams = (hackathonId: string) => {
    return useQuery({
      queryKey: ["hackathon-teams", hackathonId],
      queryFn: () => {
        const teams = getTeams();
        return teams.filter((t) => t.hackathonId === hackathonId);
      },
      // Refetch frequently so changes from other "users" appear
      staleTime: 10 * 1000, // 10 seconds
      refetchInterval: 15 * 1000, // poll every 15s
    });
  };

  // ── GET ALL TEAMS ─────────────────────────────────────────────────────────────
  const useAllTeams = () => {
    return useQuery({
      queryKey: ["all-teams"],
      queryFn: () => getTeams(),
      staleTime: 10 * 1000,
      refetchInterval: 15 * 1000,
    });
  };

  // ── GET USER'S TEAMS ──────────────────────────────────────────────────────────
  const useUserTeams = () => {
    return useQuery({
      queryKey: ["user-teams", user?.id],
      queryFn: () => {
        if (!user) return [];
        return getTeams().filter((t) => t.members.includes(user.id));
      },
      enabled: !!user,
      staleTime: 10 * 1000,
      refetchInterval: 15 * 1000,
    });
  };

  // ── SEND JOIN REQUEST ─────────────────────────────────────────────────────────
  const sendJoinRequest = async (teamId: string) => {
    if (!user) return { success: false, error: "Please sign in to join a team" };

    const requests = getRequests();

    // Check if already requested
    if (requests.find((r) => r.teamId === teamId && r.userId === user.id)) {
      return { success: false, error: "You already sent a join request to this team" };
    }

    // Check if already a member
    const teams = getTeams();
    const team = teams.find((t) => t.id === teamId);
    if (!team) return { success: false, error: "Team not found" };
    if (team.members.includes(user.id)) {
      return { success: false, error: "You are already a member of this team" };
    }

    const newRequest: TeamJoinRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      teamId,
      userId: user.id,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    requests.push(newRequest);
    saveRequests(requests);

    queryClient.invalidateQueries({ queryKey: ["user-sent-requests"] });
    queryClient.invalidateQueries({ queryKey: ["team-requests", teamId] });

    return { success: true, data: newRequest };
  };

  // ── ACCEPT / REJECT JOIN REQUEST ──────────────────────────────────────────────
  const respondToJoinRequest = async (
    requestId: string,
    action: "accepted" | "rejected"
  ) => {
    if (!user) return { success: false, error: "Not authenticated" };

    const requests = getRequests();
    const reqIdx = requests.findIndex((r) => r.id === requestId);
    if (reqIdx === -1) return { success: false, error: "Request not found" };

    const req = requests[reqIdx];

    if (action === "accepted") {
      // Add user to team members
      const teams = getTeams();
      const teamIdx = teams.findIndex((t) => t.id === req.teamId);
      if (teamIdx !== -1) {
        if (!teams[teamIdx].members.includes(req.userId)) {
          teams[teamIdx].members.push(req.userId);
          teams[teamIdx].updatedAt = new Date().toISOString();
        }
        saveTeams(teams);
      }
    }

    requests[reqIdx] = { ...req, status: action };
    saveRequests(requests);

    queryClient.invalidateQueries({ queryKey: ["hackathon-teams"] });
    queryClient.invalidateQueries({ queryKey: ["user-teams"] });
    queryClient.invalidateQueries({ queryKey: ["team-requests", req.teamId] });

    return { success: true };
  };

  // ── GET REQUESTS FOR A TEAM ───────────────────────────────────────────────────
  const useTeamRequests = (teamId: string) => {
    return useQuery({
      queryKey: ["team-requests", teamId],
      queryFn: () => getRequests().filter((r) => r.teamId === teamId && r.status === "pending"),
      staleTime: 10 * 1000,
      refetchInterval: 15 * 1000,
    });
  };

  // ── GET USER'S SENT REQUESTS ──────────────────────────────────────────────────
  const useUserSentRequests = () => {
    return useQuery({
      queryKey: ["user-sent-requests", user?.id],
      queryFn: () => {
        if (!user) return [];
        return getRequests().filter((r) => r.userId === user.id);
      },
      enabled: !!user,
      staleTime: 10 * 1000,
    });
  };

  // ── JOIN TEAM DIRECTLY ────────────────────────────────────────────────────────
  const joinTeam = async (teamId: string) => {
    if (!user) return { success: false, error: "Please sign in" };

    const teams = getTeams();
    const idx = teams.findIndex((t) => t.id === teamId);
    if (idx === -1) return { success: false, error: "Team not found" };
    if (teams[idx].members.includes(user.id)) {
      return { success: false, error: "Already a member" };
    }
    if (teams[idx].members.length >= teams[idx].maxMembers) {
      return { success: false, error: "Team is full" };
    }

    teams[idx].members.push(user.id);
    teams[idx].updatedAt = new Date().toISOString();
    saveTeams(teams);

    queryClient.invalidateQueries({ queryKey: ["hackathon-teams"] });
    queryClient.invalidateQueries({ queryKey: ["user-teams"] });

    return { success: true };
  };

  // ── LEAVE TEAM ────────────────────────────────────────────────────────────────
  const leaveTeam = async (teamId: string) => {
    if (!user) return { success: false, error: "Please sign in" };

    const teams = getTeams();
    const idx = teams.findIndex((t) => t.id === teamId);
    if (idx === -1) return { success: false, error: "Team not found" };

    teams[idx].members = teams[idx].members.filter((m) => m !== user.id);
    teams[idx].updatedAt = new Date().toISOString();

    // If team is now empty, delete it
    if (teams[idx].members.length === 0) {
      teams.splice(idx, 1);
    }
    saveTeams(teams);

    queryClient.invalidateQueries({ queryKey: ["hackathon-teams"] });
    queryClient.invalidateQueries({ queryKey: ["user-teams"] });

    return { success: true };
  };

  // ── IS USER IN TEAM ───────────────────────────────────────────────────────────
  const isUserInTeam = (teamId: string): boolean => {
    if (!user) return false;
    const team = getTeams().find((t) => t.id === teamId);
    return team ? team.members.includes(user.id) : false;
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
