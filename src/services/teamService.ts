import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Team, TeamJoinRequest } from "@/types";

const mockTeamsData = [
  {
    id: "team-1",
    hackathonId: "hackathon-1",
    name: "Team Awesome",
    description: "We are building something awesome!",
    skillsNeeded: ["React", "Node.js", "JavaScript"],
    maxMembers: 4,
    members: ["user-1", "user-2"],
    isOpen: true,
    createdAt: "2023-05-15T10:30:00Z"
  },
  {
    id: "team-2",
    hackathonId: "hackathon-2",
    name: "The Innovators",
    description: "Innovating for a better future",
    skillsNeeded: ["Python", "AI", "Machine Learning"],
    maxMembers: 5,
    members: ["user-3", "user-4", "user-5"],
    isOpen: true,
    createdAt: "2023-05-16T14:20:00Z"
  },
  {
    id: "team-3",
    hackathonId: "hackathon-1",
    name: "Code Wizards",
    description: "Casting spells with code",
    skillsNeeded: ["JavaScript", "HTML", "CSS"],
    maxMembers: 3,
    members: ["user-1"],
    isOpen: true,
    createdAt: "2023-05-17T09:15:00Z"
  }
];

const mockJoinRequests = [
  {
    id: "request-1",
    teamId: "team-2",
    userId: "user-1",
    status: "pending",
    createdAt: "2023-05-20T10:00:00Z"
  },
  {
    id: "request-2",
    teamId: "team-3",
    userId: "user-2",
    status: "accepted",
    createdAt: "2023-05-21T14:00:00Z"
  },
  {
    id: "request-3",
    teamId: "team-1",
    userId: "user-3",
    status: "rejected",
    createdAt: "2023-05-22T18:00:00Z"
  }
];

export const useTeams = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Function to create a team
  const createTeam = async (teamData: Omit<Team, 'id' | 'members' | 'createdAt' | 'isOpen'>) => {
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }
    
    const newTeam = {
      id: `team-${Date.now()}`,
      members: [user.id],
      createdAt: new Date().toISOString(),
      isOpen: true,
      ...teamData
    };
    
    // Simulate API call
    mockTeamsData.push(newTeam as Team);
    
    // Optimistically update the cache
    queryClient.setQueryData(['user-teams', user.id], (oldData: any) => {
      return [...(oldData || []), newTeam];
    });
    
    return { success: true, data: newTeam };
  };
  
  // Function to fetch teams for a specific hackathon
  const useHackathonTeams = (hackathonId: string) => {
    return useQuery({
      queryKey: ['hackathon-teams', hackathonId],
      queryFn: async () => {
        // Simulate API call
        return mockTeamsData.filter(team => team.hackathonId === hackathonId);
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };
  
  // Function to fetch teams created or joined by the current user
  const useUserTeams = () => {
    return useQuery({
      queryKey: ['user-teams', user?.id],
      queryFn: async () => {
        if (!user) return [];
        
        // Simulate API call
        return mockTeamsData.filter(team => team.members.includes(user.id));
      },
      enabled: !!user,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };
  
  // Function to delete a team
  const deleteTeam = async (teamId: string) => {
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }
    
    // Check if the user is a member of the team
    const teamToDelete = mockTeamsData.find(team => team.id === teamId);
    if (!teamToDelete || !teamToDelete.members.includes(user.id)) {
      return { success: false, error: "User not authorized to delete this team" };
    }
    
    // Simulate API call
    const index = mockTeamsData.findIndex(team => team.id === teamId);
    if (index > -1) {
      mockTeamsData.splice(index, 1);
    }
    
    // Optimistically update the cache
    queryClient.setQueryData(['user-teams', user.id], (oldData: any) => {
      return (oldData || []).filter((team: any) => team.id !== teamId);
    });
    
    return { success: true };
  };
  
  // Function to send a join request to a team
  const sendJoinRequest = async (teamId: string) => {
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }
    
    // Check if the user has already requested to join the team
    if (mockJoinRequests.find(req => req.teamId === teamId && req.userId === user.id)) {
      return { success: false, error: "Join request already sent" };
    }
    
    const newRequest = {
      id: `request-${Date.now()}`,
      teamId: teamId,
      userId: user.id,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    
    // Simulate API call
    mockJoinRequests.push(newRequest);
    
    // Optimistically update the cache
    queryClient.setQueryData(['user-sent-requests', user.id], (oldData: any) => {
      return [...(oldData || []), newRequest];
    });
    
    return { success: true, data: newRequest };
  };
  
  // Function to fetch join requests sent by the current user
  const useUserSentRequests = () => {
    return useQuery({
      queryKey: ['user-sent-requests', user?.id],
      queryFn: async () => {
        if (!user) return [];
        
        // Simulate API call
        return mockJoinRequests.filter(req => req.userId === user.id);
      },
      enabled: !!user,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };
  
  return {
    createTeam,
    useHackathonTeams,
    useUserTeams,
    deleteTeam,
    sendJoinRequest,
    useUserSentRequests,
  };
};
