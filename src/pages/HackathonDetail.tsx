import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MovingBubbles } from "@/components/ui/moving-bubbles";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar, MapPin, Trophy, Users, ExternalLink, ChevronLeft,
  Plus, UserPlus, RefreshCw, Bell, Check, X, Clock
} from "lucide-react";
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
  const [respondingId, setRespondingId] = useState<string | null>(null);

  const {
    useHackathonTeams,
    useTeamRequests,
    sendJoinRequest,
    respondToJoinRequest,
  } = useTeams();

  const { data: teams = [], isLoading: teamsLoading, refetch: refetchTeams } = useHackathonTeams(id || "");

  // Find all teams where current user is the leader
  const myTeams = teams.filter(t => t.leaderId === user?.id);
  const myTeamIds = myTeams.map(t => t.id);

  // Load hackathon data
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const fromMock = hackathonsData.find(h => h.id === id);
      if (fromMock) { setHackathon(fromMock); setLoading(false); return; }
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
      toast({ title: "✅ Request sent!", description: "The team leader will review your request." });
    } else {
      toast({ title: "Could not send request", description: result.error, variant: "destructive" });
    }
    setJoiningTeamId(null);
  };

  const handleRespond = async (requestId: string, action: "accepted" | "rejected", applicantEmail: string) => {
    setRespondingId(requestId);
    const result = await respondToJoinRequest(requestId, action);
    if (result.success) {
      toast({
        title: action === "accepted" ? "✅ Request Accepted!" : "❌ Request Rejected",
        description: action === "accepted"
          ? `${applicantEmail} has been added to your team.`
          : `You rejected ${applicantEmail}'s request.`,
      });
      refetchTeams();
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
    setRespondingId(null);
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

            <Button variant="ghost" asChild className="mb-6 -ml-2">
              <Link to="/hackathons">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back to Hackathons
              </Link>
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* ── LEFT: Hackathon Info ── */}
              <div className="lg:col-span-2 space-y-6">
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

                {hackathon.description && (
                  <Card>
                    <CardContent className="p-4">
                      <h2 className="font-semibold mb-2">About this Hackathon</h2>
                      <p className="text-muted-foreground text-sm leading-relaxed">{hackathon.description}</p>
                    </CardContent>
                  </Card>
                )}

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

              {/* ── RIGHT: Teams + Join Requests ── */}
              <div className="space-y-4">

                {/* ── JOIN REQUESTS PANEL (only for team leaders) ── */}
                {user && myTeamIds.length > 0 && (
                  <JoinRequestsPanel
                    teamIds={myTeamIds}
                    teams={myTeams}
                    respondingId={respondingId}
                    onRespond={handleRespond}
                    useTeamRequests={useTeamRequests}
                  />
                )}

                {/* ── TEAMS PANEL ── */}
                <Card className="border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-semibold flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" /> Teams
                        <span className="text-xs text-muted-foreground font-normal">({teams.length})</span>
                      </h2>
                      <Button size="sm" variant="ghost" onClick={() => refetchTeams()} className="h-7 w-7 p-0" title="Refresh">
                        <RefreshCw className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <Button onClick={() => user ? setIsCreateTeamOpen(true) : setIsAuthModalOpen(true)}
                      className="w-full gradient-button mb-4" size="sm">
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
                          const inTeam = user ? team.members.includes(user.id) : false;
                          const isLeader = team.leaderId === user?.id;
                          const isFull = team.members.length >= team.maxMembers;

                          return (
                            <div key={team.id} className="rounded-lg border border-border p-3 bg-muted/20">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="font-medium text-sm truncate">{team.name}</p>
                                  {isLeader && (
                                    <span className="text-xs text-primary font-medium">👑 You are the leader</span>
                                  )}
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
                                {isLeader ? (
                                  <Badge className="w-full justify-center bg-primary/20 text-primary border-primary/30 text-xs">
                                    👑 Your Team
                                  </Badge>
                                ) : inTeam ? (
                                  <Badge className="w-full justify-center bg-green-500/20 text-green-600 border-green-500/30 text-xs">
                                    ✓ You're in this team
                                  </Badge>
                                ) : isFull ? (
                                  <Badge variant="outline" className="w-full justify-center text-muted-foreground text-xs">
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
                  💡 Teams are visible to all users. Create a team and accept join requests from the panel above.
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

// ── JOIN REQUESTS PANEL ────────────────────────────────────────────────────────
function JoinRequestsPanel({ teamIds, teams, respondingId, onRespond, useTeamRequests }: {
  teamIds: string[];
  teams: any[];
  respondingId: string | null;
  onRespond: (reqId: string, action: "accepted" | "rejected", email: string) => void;
  useTeamRequests: (teamId: string) => any;
}) {
  // Collect requests for ALL teams this user leads
  const allRequests: any[] = [];
  
  // We render one RequestFetcher per team and aggregate
  return (
    <Card className="border-orange-500/30 bg-orange-500/5">
      <CardContent className="p-4">
        <h2 className="font-semibold flex items-center gap-2 mb-3">
          <Bell className="h-4 w-4 text-orange-500" />
          Join Requests
          <span className="text-xs text-muted-foreground font-normal">(for your teams)</span>
        </h2>
        <div className="space-y-2">
          {teamIds.map(teamId => (
            <TeamRequestsList
              key={teamId}
              teamId={teamId}
              teamName={teams.find(t => t.id === teamId)?.name || ""}
              respondingId={respondingId}
              onRespond={onRespond}
              useTeamRequests={useTeamRequests}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Fetches and shows requests for a single team
function TeamRequestsList({ teamId, teamName, respondingId, onRespond, useTeamRequests }: {
  teamId: string;
  teamName: string;
  respondingId: string | null;
  onRespond: (reqId: string, action: "accepted" | "rejected", email: string) => void;
  useTeamRequests: (teamId: string) => any;
}) {
  const { data: requests = [], isLoading } = useTeamRequests(teamId);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground py-1">
        <RefreshCw className="h-3 w-3 animate-spin" /> Loading requests...
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-xs text-muted-foreground py-1 flex items-center gap-1">
        <Clock className="h-3 w-3" />
        No pending requests for <span className="font-medium text-foreground">{teamName}</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {requests.map((req: any) => (
        <div key={req.id} className="rounded-lg border border-orange-500/20 bg-background p-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">
                📧 {req.userId}
              </p>
              <p className="text-xs text-muted-foreground">
                wants to join <span className="font-medium text-foreground">{teamName}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date(req.createdAt).toLocaleDateString()} {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 h-7 text-xs bg-green-600 hover:bg-green-700 text-white"
              onClick={() => onRespond(req.id, "accepted", req.userId)}
              disabled={respondingId === req.id}
            >
              {respondingId === req.id ? (
                <RefreshCw className="h-3 w-3 animate-spin mr-1" />
              ) : (
                <Check className="h-3 w-3 mr-1" />
              )}
              Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-7 text-xs border-red-500/50 text-red-500 hover:bg-red-500/10"
              onClick={() => onRespond(req.id, "rejected", req.userId)}
              disabled={respondingId === req.id}
            >
              <X className="h-3 w-3 mr-1" />
              Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
