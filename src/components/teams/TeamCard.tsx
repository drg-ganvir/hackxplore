import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Team, TeamServiceProps } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { User, Users, UserPlus, Clock, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TeamCardProps {
  team: Team;
  isUserTeamMember?: boolean;
  hackathonId?: string;
  hasJoinRequest?: boolean;
  isDetailed?: boolean;
}

export function TeamCard({ team, isUserTeamMember, hackathonId, hasJoinRequest, isDetailed = false }: TeamCardProps) {
  const { user } = useAuth();
  const { joinTeam, leaveTeam, isUserInTeam, sendJoinRequest } = useTeams() as TeamServiceProps;
  const { toast } = useToast();
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  
  // Check if the user is the creator of the team
  const isCreator = team.creator && team.leaderId === user?.id;
  
  const handleJoinTeam = async () => {
    if (!user || !joinTeam) return;
    
    setIsJoining(true);
    
    try {
      const result = await joinTeam(team.id);
      
      if (result.success) {
        toast({
          title: "Joined team",
          description: `You have successfully joined "${team.name}".`,
        });
      } else {
        toast({
          title: "Failed to join team",
          description: result.error || "An error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };
  
  const handleLeaveTeam = async () => {
    if (!user || !leaveTeam) return;
    
    setIsLeaving(true);
    
    try {
      const result = await leaveTeam(team.id);
      
      if (result.success) {
        toast({
          title: "Left team",
          description: `You have left "${team.name}".`,
        });
      } else {
        toast({
          title: "Failed to leave team",
          description: result.error || "An error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLeaving(false);
    }
  };
  
  const handleSendJoinRequest = async () => {
    if (!user || !sendJoinRequest) return;
    
    setIsSendingRequest(true);
    
    try {
      const result = await sendJoinRequest(team.id);
      
      if (result.success) {
        toast({
          title: "Request sent",
          description: `Your request to join "${team.name}" has been sent.`,
        });
      } else {
        toast({
          title: "Failed to send request",
          description: result.error || "An error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSendingRequest(false);
    }
  };

  return (
    <Card className={`glass-card ${isDetailed ? 'border-primary/20' : ''}`}>
      <CardHeader>
        <CardTitle>{team.name}</CardTitle>
        <CardDescription>{team.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            <span>{team.members.length} / {team.maxMembers} members</span>
          </div>
          
          {team.creator && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                {typeof team.creator === 'string' ? team.creator : team.creator.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium">{team.creator.name || user?.email}</p>
                <p className="text-xs text-muted-foreground">Team Leader</p>
              </div>
            </div>
          )}
          
          <Separator />
          
          <div>
            <h4 className="text-sm font-medium">Skills Needed</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {team.skillsNeeded.map(skill => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {isUserTeamMember ? (
          <Button variant="destructive" size="sm" onClick={handleLeaveTeam} disabled={isLeaving}>
            {isLeaving ? (
              <>
                Leaving...
              </>
            ) : (
              <>
                <X className="h-4 w-4 mr-2" />
                Leave Team
              </>
            )}
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={handleSendJoinRequest} disabled={isSendingRequest}>
            {isSendingRequest ? (
              <>
                Sending Request...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Request to Join
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

// Add this helper hook
function useTeams() {
  // Mock implementation (this should be replaced with your actual implementation)
  return {
    sendJoinRequest: async (teamId: string) => ({ success: true }),
    joinTeam: async (teamId: string) => ({ success: true }),
    leaveTeam: async (teamId: string) => ({ success: true }),
    isUserInTeam: (teamId: string) => false
  };
}
