import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MovingBubbles } from "@/components/ui/moving-bubbles";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Trophy, Users, ExternalLink, ChevronLeft, Plus, UserPlus, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTeams } from "@/services/teamService";
import { CreateTeamModal } from "@/components/hackathons/CreateTeamModal";
import { AuthModal } from "@/components/auth/AuthModal";
import { HackathonCard as HackathonCardType } from "@/types";
import { fetchLiveHackathons } from "@/services/liveDataService";
import { hackathonsData } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

export default function HackathonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [hackathon, setHackathon] = useState<HackathonCardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [joiningTeamId, setJoiningTeamId] = useState<string | null>(null);

  const { useHackathonTeams, joinTeam, sendJoinRequest, isUserInTeam } = useTeams();
  const { data: teams = [], isLoading: teamsLoading, refetch: refetchTeams } = useHackathonTeams(id || "");

  // Load hackathon data — check live data first, then mock
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      // First check mockData
      const fromMock = hackathonsData.find(h => h.id === id);
      if (fromMock) { setHackathon(fromMock); setLoading(false); return; }
      // Then check live data
      try {
        const live = await fetchLiveHackathons();
        const found = live.find(h => h.id === id);
        if (found) setHackathon(found);
      } catch {}
      setLoading(false);
    };
    if (id) load();
  }, [id]);

  const handleJoinTeam = async (teamId: string) => {
    if (!user) { setIsAuthModalOpen(true); return; }
    setJoiningTeamId(teamId);
    const result = await sendJoinRequest(teamId);
    if (result.success) {
      toast({ title: "Request sent!", description: "Your join request has been sent to the team leader." });
    } else {
      toast({ title: "Could not send request", description: result.error, variant: "destructive" });
    }
    setJoiningTeamId(null);
  };

  const handleCreateTeam = () => {
    if (!user) { setIsAuthModalOpen(true); return; }
    setIsCreateTeamOpen(true);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="container py-16 text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading hackathon...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!hackathon) {
    return (
      <>
        <Navbar />
        <main className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Hackathon Not Found</h1>
          <p className="text-muted-foreground mb-6">This hackathon doesn't exist or has ended.</p>
          <Button asChild className="gradient-button">
            <Link to="/hackathons">Browse Hackathons</Link>
          </Button>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <MovingBubbles />
      <Navbar />

      <main className="flex-1 overflow-x-hidden">
        <section className="py-8 md:py-12">
          <div className="container px-4">

            {/* Back button */}
            <Button variant="ghost" asChild className="mb-6 -ml-2">
              <Link to="/hackathons">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back to Hackathons
              </Link>
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* ── LEFT: Hackathon Info ── */}
              <div className="lg:col-span-2 space-y-6">
                {/* Cover image */}
                {hackathon.image ? (
                  <img src={hackathon.image} alt={hackathon.title}
                    className="w-full rounded-xl object-cover max-h-64"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <div className="w-full rounded-xl h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Trophy className="h-16 w-16 text-primary/30" />
                  </div>
                )}

                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge>{Array.isArray(hackathon.type) ? hackathon.type[0] : hackathon.type}</Badge>
                    <Badge variant="outline">{hackathon.mode}</Badge>
                    {hackathon.isPopular && <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">🔥 Popular</Badge>}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-1">{hackathon.title}</h1>
                  <p className="text-muted-foreground">by {hackathon.organizer}</p>
                </div>

                {/* Key info grid */}
                <Card>
                  <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Dates</p>
                        <p className="text-sm font-medium">
                          {new Date(hackathon.startDate).toLocaleDateString()} — {new Date(hackathon.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="text-sm font-medium">{hackathon.location}</p>
                      </div>
                    </div>
                    {hackathon.prizePool ? (
                      <div className="flex items-start gap-3">
                        <Trophy className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">Prize Pool</p>
                          <p className="text-sm font-medium">${hackathon.prizePool.toLocaleString()}</p>
                        </div>
                      </div>
                    ) : null}
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Application Deadline</p>
                        <p className="text-sm font-medium">{new Date(hackathon.applicationDeadline).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                {hackathon.description && (
                  <Card>
                    <CardContent className="p-4">
                      <h2 className="font-semibold mb-2">About this Hackathon</h2>
                      <p className="text-muted-foreground text-sm leading-relaxed">{hackathon.description}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Tags */}
                {hackathon.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {hackathon.tags.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                )}

                <Button asChild className="gradient-button w-full sm:w-auto">
                  <a href={hackathon.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" /> Register on Official Site
                  </a>
                </Button>
              </div>

              {/* ── RIGHT: Teams ── */}
              <div className="space-y-4">
                <Card className="border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-semibold flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" /> Teams
                        <span className="text-xs text-muted-foreground font-normal">({teams.length})</span>
                      </h2>
                      <Button size="sm" variant="ghost" onClick={() => refetchTeams()} className="h-7 w-7 p-0">
                        <RefreshCw className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {/* Create team button */}
                    <Button onClick={handleCreateTeam} className="w-full gradient-button mb-4" size="sm">
                      <Plus className="h-4 w-4 mr-1" /> Create a Team
                    </Button>

                    {teamsLoading ? (
                      <div className="text-center py-4">
                        <RefreshCw className="h-5 w-5 animate-spin text-primary mx-auto" />
                      </div>
                    ) : teams.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        <Users className="h-10 w-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No teams yet.</p>
                        <p className="text-xs mt-1">Be the first to create one!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {teams.map(team => {
                          const inTeam = isUserInTeam(team.id);
                          const isFull = team.members.length >= team.maxMembers;
                          return (
                            <div key={team.id} className="rounded-lg border border-border p-3 bg-muted/20">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="font-medium text-sm truncate">{team.name}</p>
                                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{team.description}</p>
                                </div>
                                <Badge variant="outline" className="shrink-0 text-xs">
                                  {team.members.length}/{team.maxMembers}
                                </Badge>
                              </div>

                              {team.skillsNeeded?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {team.skillsNeeded.slice(0, 3).map(skill => (
                                    <Badge key={skill} variant="secondary" className="text-xs py-0">{skill}</Badge>
                                  ))}
                                  {team.skillsNeeded.length > 3 && (
                                    <Badge variant="secondary" className="text-xs py-0">+{team.skillsNeeded.length - 3}</Badge>
                                  )}
                                </div>
                              )}

                              <div className="mt-2">
                                {inTeam ? (
                                  <Badge className="w-full justify-center bg-green-500/20 text-green-600 border-green-500/30">
                                    ✓ You're in this team
                                  </Badge>
                                ) : isFull ? (
                                  <Badge variant="outline" className="w-full justify-center text-muted-foreground">
                                    Team Full
                                  </Badge>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full h-7 text-xs"
                                    onClick={() => handleJoinTeam(team.id)}
                                    disabled={joiningTeamId === team.id}
                                  >
                                    {joiningTeamId === team.id ? (
                                      <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                                    ) : (
                                      <UserPlus className="h-3 w-3 mr-1" />
                                    )}
                                    Request to Join
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <p className="text-xs text-muted-foreground text-center px-2">
                  💡 Teams are shared across all users. Create a team and others can request to join!
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <CreateTeamModal
        isOpen={isCreateTeamOpen}
        onClose={() => { setIsCreateTeamOpen(false); refetchTeams(); }}
        hackathonId={id || ""}
        hackathonTitle={hackathon.title}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultView="login"
      />
    </>
  );
}
