import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MovingBubbles } from "@/components/ui/moving-bubbles";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar, MapPin, Trophy, Users, ExternalLink,
  ChevronLeft, Plus, UserPlus, RefreshCw, Bell, Check, X, Clock
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  useHackathonTeams,
  useTeamRequests,
  useTeamActions,
} from "@/services/teamService";
import { CreateTeamModal } from "@/components/hackathons/CreateTeamModal";
import { AuthModal } from "@/components/auth/AuthModal";
import { HackathonCard as HackathonCardType } from "@/types";
import { fetchLiveHackathons } from "@/services/liveDataService";
import { hackathonsData } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

export default function HackathonDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const { sendJoinRequest, respondToJoinRequest } = useTeamActions();

  const [hackathon, setHackathon] = useState<HackathonCardType | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [joiningTeamId, setJoiningTeamId] = useState<string | null>(null);
  const [respondingId, setRespondingId] = useState<string | null>(null);

  const { data: teams = [], isLoading: teamsLoading, refetch: refetchTeams } =
    useHackathonTeams(id || "");

  // Teams where logged-in user is the leader
  const myLeaderTeams = user
    ? teams.filter(t => t.leaderId === user.id)
    : [];

  useEffect(() => {
    const load = async () => {
      setPageLoading(true);
      const fromMock = hackathonsData.find(h => h.id === id);
      if (fromMock) { setHackathon(fromMock); setPageLoading(false); return; }
      try {
        const live = await fetchLiveHackathons();
        const found = live.find(h => h.id === id);
        if (found) setHackathon(found);
      } catch {}
      setPageLoading(false);
    };
    if (id) load();
  }, [id]);

  const handleJoinTeam = async (teamId: string) => {
    if (!user) { setIsAuthModalOpen(true); return; }
    setJoiningTeamId(teamId);
    const result = await sendJoinRequest(teamId);
    toast(result.success
      ? { title: "✅ Request Sent!", description: "The team leader will review your request soon." }
      : { title: "Error", description: result.error, variant: "destructive" }
    );
    setJoiningTeamId(null);
  };

  const handleRespond = async (requestId: string, action: "accepted" | "rejected") => {
    setRespondingId(requestId);
    const result = await respondToJoinRequest(requestId, action);
    if (result.success) {
      toast({
        title: action === "accepted" ? "✅ Accepted!" : "❌ Rejected",
        description: action === "accepted"
          ? "User has been added to your team!"
          : "Join request has been rejected.",
      });
      refetchTeams();
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
    setRespondingId(null);
  };

  if (pageLoading) return (
    <><Navbar />
      <main className="container py-16 text-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Loading hackathon...</p>
      </main><Footer /></>
  );

  if (!hackathon) return (
    <><Navbar />
      <main className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Hackathon Not Found</h1>
        <Button asChild className="gradient-button">
          <Link to="/hackathons">Browse Hackathons</Link>
        </Button>
      </main><Footer /></>
  );

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
                {hackathon.image
                  ? <img src={hackathon.image} alt={hackathon.title}
                      className="w-full rounded-xl object-cover max-h-64"
                      onError={e => (e.target as HTMLImageElement).style.display = "none"} />
                  : <div className="w-full rounded-xl h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Trophy className="h-16 w-16 text-primary/30" />
                    </div>
                }

                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge>{Array.isArray(hackathon.type) ? hackathon.type[0] : hackathon.type}</Badge>
                    <Badge variant="outline">{hackathon.mode}</Badge>
                    {hackathon.isPopular && (
                      <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">🔥 Popular</Badge>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-1">{hackathon.title}</h1>
                  <p className="text-muted-foreground">by {hackathon.organizer}</p>
                </div>

                <Card>
                  <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoRow icon={<Calendar className="h-4 w-4 text-primary" />} label="Dates"
                      value={`${new Date(hackathon.startDate).toLocaleDateString()} — ${new Date(hackathon.endDate).toLocaleDateString()}`} />
                    <InfoRow icon={<MapPin className="h-4 w-4 text-primary" />} label="Location"
                      value={hackathon.location} />
                    {hackathon.prizePool
                      ? <InfoRow icon={<Trophy className="h-4 w-4 text-primary" />} label="Prize Pool"
                          value={`$${hackathon.prizePool.toLocaleString()}`} />
                      : null}
                    <InfoRow icon={<Calendar className="h-4 w-4 text-primary" />} label="Deadline"
                      value={new Date(hackathon.applicationDeadline).toLocaleDateString()} />
                  </CardContent>
                </Card>

                {hackathon.description && (
                  <Card><CardContent className="p-4">
                    <h2 className="font-semibold mb-2">About this Hackathon</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">{hackathon.description}</p>
                  </CardContent></Card>
                )}

                {hackathon.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {hackathon.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                  </div>
                )}

                <Button asChild className="gradient-button w-full sm:w-auto">
                  <a href={hackathon.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" /> Register on Official Site
                  </a>
                </Button>
              </div>

              {/* ── RIGHT: Teams + Requests ── */}
              <div className="space-y-4">

                {/* JOIN REQUESTS PANEL — always show if user is logged in and is a leader */}
                {myLeaderTeams.length > 0 && (
                  <div className="space-y-3">
                    {myLeaderTeams.map(team => (
                      <JoinRequestsCard
                        key={`requests-${team.id}`}
                        teamId={team.id}
                        teamName={team.name}
                        respondingId={respondingId}
                        onRespond={handleRespond}
                      />
                    ))}
                  </div>
                )}

                {/* Show a hint if logged in but not a leader yet */}
                {user && myLeaderTeams.length === 0 && !teamsLoading && (
                  <Card className="border-dashed border-muted-foreground/30">
                    <CardContent className="p-3 text-center text-xs text-muted-foreground">
                      <Bell className="h-4 w-4 mx-auto mb-1 opacity-50" />
                      Create a team to start receiving join requests
                    </CardContent>
                  </Card>
                )}

                {/* TEAMS LIST */}
                <Card className="border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-semibold flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" /> Teams
                        <span className="text-xs text-muted-foreground font-normal">({teams.length})</span>
                      </h2>
                      <Button size="sm" variant="ghost" onClick={() => refetchTeams()}
                        className="h-7 w-7 p-0" title="Refresh teams">
                        <RefreshCw className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <Button
                      onClick={() => user ? setIsCreateTeamOpen(true) : setIsAuthModalOpen(true)}
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
                          const isLeader = team.leaderId === user?.id;
                          const inTeam = user ? team.members.includes(user.id) : false;
                          const isFull = team.members.length >= team.maxMembers;

                          return (
                            <div key={team.id} className="rounded-lg border border-border p-3 bg-muted/20">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="font-medium text-sm truncate">{team.name}</p>
                                  {isLeader && (
                                    <p className="text-xs text-primary font-medium">👑 You are the leader</p>
                                  )}
                                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                    {team.description}
                                  </p>
                                </div>
                                <Badge variant="outline" className="shrink-0 text-xs">
                                  {team.members.length}/{team.maxMembers}
                                </Badge>
                              </div>

                              {team.skillsNeeded?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {team.skillsNeeded.slice(0, 3).map(s => (
                                    <Badge key={s} variant="secondary" className="text-xs py-0">{s}</Badge>
                                  ))}
                                  {team.skillsNeeded.length > 3 && (
                                    <Badge variant="secondary" className="text-xs py-0">
                                      +{team.skillsNeeded.length - 3}
                                    </Badge>
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
                                    {joiningTeamId === team.id
                                      ? <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                                      : <UserPlus className="h-3 w-3 mr-1" />
                                    }
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
                  💡 Teams are synced via Supabase — visible to everyone worldwide.
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

// ── Helper ────────────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

// ── Join Requests Card ────────────────────────────────────────────────────────
// This is a separate component so useTeamRequests is called at component top level
function JoinRequestsCard({
  teamId, teamName, respondingId, onRespond
}: {
  teamId: string;
  teamName: string;
  respondingId: string | null;
  onRespond: (reqId: string, action: "accepted" | "rejected") => void;
}) {
  const { data: requests = [], isLoading } = useTeamRequests(teamId);

  return (
    <Card className="border-orange-500/40 bg-orange-500/5">
      <CardContent className="p-4">
        <h2 className="font-semibold flex items-center gap-2 mb-1 text-orange-600 dark:text-orange-400">
          <Bell className="h-4 w-4" />
          Join Requests
        </h2>
        <p className="text-xs text-muted-foreground mb-3">
          Team: <span className="font-semibold text-foreground">{teamName}</span>
        </p>

        {isLoading ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
            <RefreshCw className="h-3 w-3 animate-spin" /> Checking for requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
            <Clock className="h-3.5 w-3.5" /> No pending requests yet
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs font-medium text-orange-600 dark:text-orange-400">
              {requests.length} pending request{requests.length > 1 ? "s" : ""}
            </p>
            {requests.map((req: any) => (
              <div key={req.id}
                className="rounded-lg border border-orange-500/20 bg-background p-3 space-y-2">
                <div>
                  <p className="text-xs font-semibold truncate">
                    👤 {req.userEmail || req.userId}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Requested: {new Date(req.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 h-8 text-xs bg-green-600 hover:bg-green-700 text-white border-0"
                    onClick={() => onRespond(req.id, "accepted")}
                    disabled={respondingId === req.id}
                  >
                    {respondingId === req.id
                      ? <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                      : <Check className="h-3 w-3 mr-1" />
                    }
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-8 text-xs border-red-400 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                    onClick={() => onRespond(req.id, "rejected")}
                    disabled={respondingId === req.id}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
