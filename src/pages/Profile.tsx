import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MovingBubbles } from "@/components/ui/moving-bubbles";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/components/auth/ProfileForm";
import { TeamCard } from "@/components/teams/TeamCard";
import { InternshipCard } from "@/components/internships/InternshipCard";
import { HackathonCard } from "@/components/hackathons/HackathonCard";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useTeams, useUserTeams } from "@/services/teamService";
import { useBookmarks } from "@/services/bookmarkService";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Pencil, Github, Linkedin, Globe, Trash2, AlertTriangle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { hackathonsData, internshipsData } from "@/data/mockData";

export default function Profile() {
  const { user, profile, isLoading: isProfileLoading } = useAuth();
  const { deleteTeam } = useTeams();
  const { bookmarks, removeBookmark } = useBookmarks();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<string | null>(null);
  
  const { data: teams, isLoading: isTeamsLoading } = useUserTeams(user?.id);
  
  const bookmarkedHackathons = hackathonsData.filter(
    hackathon => bookmarks.some(b => b.itemId === hackathon.id && b.itemType === "hackathon")
  );
  
  const bookmarkedInternships = internshipsData.filter(
    internship => bookmarks.some(b => b.itemId === internship.id && b.itemType === "internship")
  );
  
  useEffect(() => {
    if (!user && !isProfileLoading) {
      navigate("/login");
    }
  }, [user, isProfileLoading, navigate]);
  
  const handleDeleteTeam = async (teamId: string) => {
    setTeamToDelete(teamId);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteTeam = async () => {
    if (!teamToDelete) return;
    
    try {
      const result = await deleteTeam(teamToDelete);
      
      if (result.success) {
        toast({
          title: "Team deleted",
          description: "Your team has been successfully deleted.",
        });
      } else {
        toast({
          title: "Failed to delete team",
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
      setIsDeleteDialogOpen(false);
      setTeamToDelete(null);
    }
  };
  
  const handleRemoveBookmark = async (id: string, type: "hackathon" | "internship") => {
    await removeBookmark(id, type);
    toast({
      title: "Bookmark removed",
      description: `The ${type} has been removed from your bookmarks.`,
    });
  };
  
  if (isProfileLoading) {
    return (
      <>
        <Navbar />
        <main className="container py-10">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-12 w-1/3 mb-4" />
            <Skeleton className="h-64 w-full mb-8" />
            <Skeleton className="h-8 w-1/4 mb-2" />
            <Skeleton className="h-32 w-full" />
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  if (!user) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <>
      <MovingBubbles />
      <Navbar />
      
      <main className="container py-10">
        <div className="max-w-5xl mx-auto">
          {isEditMode ? (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Edit Profile</h1>
                <Button variant="outline" onClick={() => setIsEditMode(false)}>
                  Cancel
                </Button>
              </div>
              <ProfileForm onComplete={() => setIsEditMode(false)} />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-3xl font-bold">My Profile</h1>
                  <p className="text-muted-foreground">
                    Manage your profile, teams, and bookmarks
                  </p>
                </div>
                <Button onClick={() => setIsEditMode(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="teams">My Teams</TabsTrigger>
                  <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>
                        Your personal information and preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex flex-col items-center">
                          <Avatar className="h-32 w-32 mb-4">
                            <AvatarImage src={profile?.avatarUrl || ""} />
                            <AvatarFallback className="text-4xl">
                              {profile?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex flex-col items-center">
                            <h2 className="text-xl font-semibold">{profile?.name || "Anonymous User"}</h2>
                            <p className="text-muted-foreground">{user.email}</p>
                            
                            {profile?.preferredRole && (
                              <Badge className="mt-2">{profile.preferredRole}</Badge>
                            )}
                          </div>
                          
                          <div className="flex gap-2 mt-4">
                            {profile?.githubUrl && (
                              <Button variant="outline" size="icon" asChild>
                                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
                                  <Github className="h-4 w-4" />
                                  <span className="sr-only">GitHub</span>
                                </a>
                              </Button>
                            )}
                            
                            {profile?.linkedinUrl && (
                              <Button variant="outline" size="icon" asChild>
                                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                                  <Linkedin className="h-4 w-4" />
                                  <span className="sr-only">LinkedIn</span>
                                </a>
                              </Button>
                            )}
                            
                            {profile?.portfolioUrl && (
                              <Button variant="outline" size="icon" asChild>
                                <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer">
                                  <Globe className="h-4 w-4" />
                                  <span className="sr-only">Portfolio</span>
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          {profile?.bio && (
                            <div className="mb-6">
                              <h3 className="text-lg font-medium mb-2">About</h3>
                              <p className="text-muted-foreground">{profile.bio}</p>
                            </div>
                          )}
                          
                          <Separator className="my-4" />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="text-lg font-medium mb-2">Skills</h3>
                              {profile?.skills && profile.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {profile.skills.map(skill => (
                                    <Badge key={skill} variant="secondary">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-muted-foreground">No skills added yet</p>
                              )}
                            </div>
                            
                            <div>
                              <h3 className="text-lg font-medium mb-2">Interests</h3>
                              {profile?.interests && profile.interests.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {profile.interests.map(interest => (
                                    <Badge key={interest} variant="outline">
                                      {interest}
                                    </Badge>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-muted-foreground">No interests added yet</p>
                              )}
                            </div>
                          </div>
                          
                          <Separator className="my-4" />
                          
                          <div>
                            <h3 className="text-lg font-medium mb-2">Looking For</h3>
                            <Badge variant="default">
                              {profile?.lookingFor === "hackathons" 
                                ? "Hackathons" 
                                : profile?.lookingFor === "internships" 
                                  ? "Internships" 
                                  : "Hackathons & Internships"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="teams">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Teams</CardTitle>
                      <CardDescription>
                        Teams you've created or joined for hackathons
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isTeamsLoading ? (
                        <div className="space-y-4">
                          <Skeleton className="h-32 w-full" />
                          <Skeleton className="h-32 w-full" />
                        </div>
                      ) : teams && teams.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {teams?.map(team => (
                            <TeamCard 
                              key={team.id}
                              team={team}
                              isUserTeamMember={true}
                              hackathonId={team.hackathonId}
                              isDetailed={false}
                              showActions={true}
                              onDelete={async () => handleDeleteTeam(team.id)}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">No teams yet</h3>
                          <p className="text-muted-foreground mb-4">
                            You haven't created or joined any teams yet.
                          </p>
                          <Button asChild>
                            <a href="/hackathons">Browse Hackathons</a>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="bookmarks">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Bookmarks</CardTitle>
                      <CardDescription>
                        Hackathons and internships you've saved for later
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="hackathons" className="mt-4">
                        <TabsList>
                          <TabsTrigger value="hackathons">Hackathons</TabsTrigger>
                          <TabsTrigger value="internships">Internships</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="hackathons" className="mt-4">
                          {bookmarkedHackathons.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {bookmarkedHackathons.map(hackathon => (
                                <HackathonCard
                                  key={hackathon.id}
                                  id={hackathon.id}
                                  title={hackathon.title}
                                  organizer={hackathon.organizer}
                                  location={hackathon.location}
                                  url={hackathon.url}
                                  imageUrl={hackathon.image}
                                  type={hackathon.type}
                                  prizePool={hackathon.prizePool ? hackathon.prizePool.toString() : undefined}
                                  mode={hackathon.mode.toLowerCase() as "online" | "in-person" | "hybrid"}
                                  dates={`${new Date(hackathon.startDate).toLocaleDateString()} - ${new Date(hackathon.endDate).toLocaleDateString()}`}
                                  description={hackathon.description}
                                  onViewDetails={() => navigate(`/hackathons/${hackathon.id}`)}
                                  onFormTeam={() => navigate(`/hackathons/${hackathon.id}`)}
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                              <h3 className="text-lg font-medium mb-2">No bookmarked hackathons</h3>
                              <p className="text-muted-foreground mb-4">
                                You haven't bookmarked any hackathons yet.
                              </p>
                              <Button asChild>
                                <a href="/hackathons">Browse Hackathons</a>
                              </Button>
                            </div>
                          )}
                        </TabsContent>
                        
                        <TabsContent value="internships" className="mt-4">
                          {bookmarkedInternships.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {bookmarkedInternships.map(internship => (
                                <InternshipCard
                                  key={internship.id}
                                  id={internship.id}
                                  title={internship.title}
                                  company={internship.company}
                                  location={internship.location}
                                  isRemote={internship.isRemote}
                                  stipend={internship.stipend}
                                  duration={internship.duration}
                                  deadline={internship.applicationDeadline}
                                  imageUrl={internship.logo}
                                  skills={(internship.requiredSkills || []) as any}
                                  description={internship.description || ""}
                                  type="Tech"
                                  postedDate={new Date().toISOString().split('T')[0]}
                                  url={internship.url || ""}
                                  onViewDetailsClick={() => navigate(`/internships/${internship.id}`)}
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                              <h3 className="text-lg font-medium mb-2">No bookmarked internships</h3>
                              <p className="text-muted-foreground mb-4">
                                You haven't bookmarked any internships yet.
                              </p>
                              <Button asChild>
                                <a href="/internships">Browse Internships</a>
                              </Button>
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
      
      <Footer />
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your team
              and remove all members from it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTeam} className="bg-destructive text-destructive-foreground">
              Delete Team
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
