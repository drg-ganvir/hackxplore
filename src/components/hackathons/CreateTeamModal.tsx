
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useTeams } from "@/services/teamService";
import { UserSkill } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Check, PlusCircle, X, Users, UserPlus } from "lucide-react";
import { skillsOptions } from "@/data/mockData";

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  hackathonId: string;
  hackathonTitle: string;
}

export function CreateTeamModal({ isOpen, onClose, hackathonId, hackathonTitle }: CreateTeamModalProps) {
  const { user, profile } = useAuth();
  const { createTeam, useHackathonTeams, sendJoinRequest } = useTeams();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("join");
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [maxMembers, setMaxMembers] = useState(4);
  const [searchTerm, setSearchTerm] = useState("");
  const [availableSkills, setAvailableSkills] = useState<UserSkill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<UserSkill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  
  const { data: hackathonTeams = [], isLoading: isLoadingTeams } = useHackathonTeams(hackathonId);
  
  useEffect(() => {
    const allSkills = [...skillsOptions] as UserSkill[];
    const userSkills = profile?.skills || [];
    const filteredSkills = allSkills.filter(skill => !userSkills.includes(skill as UserSkill));
    setAvailableSkills(filteredSkills.sort((a, b) => a.localeCompare(b)));
  }, [profile?.skills]);
  
  const getFilteredSkills = () => {
    if (!searchTerm) return availableSkills;
    
    return availableSkills.filter(skill => 
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  const handleSelectSkill = (skill: UserSkill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
      setAvailableSkills(availableSkills.filter(s => s !== skill));
    }
    setSearchTerm("");
  };
  
  const handleRemoveSkill = (skill: UserSkill) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill));
    setAvailableSkills([...availableSkills, skill].sort((a, b) => a.localeCompare(b)));
  };
  
  const handleCreateTeam = async () => {
    if (!user) return;
    
    if (!teamName.trim()) {
      toast({
        title: "Team name required",
        description: "Please provide a name for your team",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const skillsNeeded = [...selectedSkills];
      
      const result = await createTeam({
        hackathonId,
        name: teamName,
        description: description || `Team for ${hackathonTitle}`,
        skillsNeeded,
        maxMembers,
        leaderId: user.id,
        updatedAt: new Date().toISOString()
      });
      
      if (result.success) {
        toast({
          title: "Team created successfully",
          description: `Your team '${teamName}' has been created for ${hackathonTitle}`,
        });
        
        onClose();
      } else {
        toast({
          title: "Failed to create team",
          description: result.error || "An error occurred while creating your team. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating team:", error);
      toast({
        title: "Failed to create team",
        description: "An error occurred while creating your team. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendJoinRequest = async (teamId: string) => {
    if (!user) return;
    
    try {
      setIsSendingRequest(true);
      
      const result = await sendJoinRequest(teamId);
      
      if (result.success) {
        toast({
          title: "Join request sent",
          description: "Your request to join the team has been sent successfully.",
        });
      } else {
        toast({
          title: "Failed to send request",
          description: result.error || "An error occurred while sending your request. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending join request:", error);
      toast({
        title: "Failed to send request",
        description: "An error occurred while sending your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSendingRequest(false);
    }
  };
  
  const filteredSkills = getFilteredSkills();
  
  const recommendedTeams = hackathonTeams.filter(team => {
    if (!team.isOpen || team.members.length >= team.maxMembers) return false;
    if (profile?.skills && profile.skills.length > 0) {
      return team.skillsNeeded.some(skill => 
        profile.skills?.includes(skill as UserSkill)
      );
    }
    return false;
  });
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{hackathonTitle}</DialogTitle>
          <DialogDescription>
            Join an existing team or create your own for this hackathon.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="join">Join Team</TabsTrigger>
            <TabsTrigger value="create">Create Team</TabsTrigger>
          </TabsList>
          
          <TabsContent value="join" className="mt-4">
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Available Teams</h3>
                <p className="text-sm text-muted-foreground">
                  These teams are looking for members with skills similar to yours
                </p>
                
                {isLoadingTeams ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="border rounded-md p-4 h-24 animate-pulse bg-muted"></div>
                    ))}
                  </div>
                ) : hackathonTeams.length > 0 ? (
                  <div className="space-y-4">
                    {hackathonTeams
                      .filter(team => team.isOpen && team.members.length < team.maxMembers)
                      .map(team => {
                        const userHasMatchingSkills = profile?.skills && team.skillsNeeded.some(skill => 
                          profile.skills.includes(skill)
                        );
                        
                        return (
                          <div 
                            key={team.id} 
                            className={`border rounded-md p-4 ${userHasMatchingSkills ? 'border-primary/30 bg-primary/5' : ''}`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center">
                                  <h4 className="font-medium">{team.name}</h4>
                                  {userHasMatchingSkills && (
                                    <Badge variant="secondary" className="ml-2 text-xs">Good Match</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{team.description}</p>
                                <div className="flex items-center text-xs text-muted-foreground mt-1">
                                  <Users className="h-3 w-3 mr-1" />
                                  <span>{team.members.length} / {team.maxMembers} members</span>
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleSendJoinRequest(team.id)}
                                disabled={isSendingRequest}
                              >
                                <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                                Request to Join
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              <p className="text-xs text-muted-foreground mr-1">Skills needed:</p>
                              {team.skillsNeeded.map(skill => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-md">
                    <Users className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <h4 className="text-lg font-medium">No teams available</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      There are no teams looking for members yet. Why not create one?
                    </p>
                    <Button 
                      className="mt-4"
                      onClick={() => setActiveTab("create")}
                    >
                      Create a Team
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="create" className="mt-4">
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="teamName">Team Name</Label>
                  <Input
                    id="teamName"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Enter team name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Team Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your team and project idea"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxMembers">Maximum Team Size</Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      type="number"
                      id="maxMembers"
                      value={maxMembers}
                      onChange={(e) => setMaxMembers(Number(e.target.value))}
                      min={2}
                      max={10}
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground">members (including you)</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div>
                    <Label>Skills You're Looking For</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Select skills that you want other team members to have
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedSkills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="gap-1">
                        {skill}
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-1 rounded-full hover:bg-secondary/80 focus:outline-none"
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove {skill}</span>
                        </button>
                      </Badge>
                    ))}
                    
                    {selectedSkills.length === 0 && (
                      <p className="text-sm text-muted-foreground italic">
                        No skills selected yet
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="skillSearch">Add Skills</Label>
                    <div className="relative">
                      <Input
                        id="skillSearch"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search for skills to add"
                        className="pr-8"
                      />
                    </div>
                    
                    {searchTerm && filteredSkills.length > 0 && (
                      <div className="bg-card border rounded-md mt-1 max-h-40 overflow-y-auto">
                        {filteredSkills.map((skill) => (
                          <button
                            key={skill}
                            onClick={() => handleSelectSkill(skill)}
                            className="w-full px-3 py-2 text-left hover:bg-muted flex items-center justify-between"
                          >
                            <span>{skill}</span>
                            <PlusCircle className="h-4 w-4 text-muted-foreground" />
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {searchTerm && filteredSkills.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No matching skills found
                      </p>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Team Creator</Label>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      {profile?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{profile?.name || user?.email}</p>
                      <p className="text-xs text-muted-foreground">Team Leader</p>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      <Check className="h-3 w-3 mr-1" />
                      You
                    </Badge>
                  </div>
                </div>
              </div>
            </ScrollArea>
            
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateTeam} 
                disabled={!teamName.trim() || isLoading}
                className="gradient-button"
              >
                <Users className="mr-2 h-4 w-4" />
                {isLoading ? "Creating..." : "Create Team"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
