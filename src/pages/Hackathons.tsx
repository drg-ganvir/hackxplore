import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HackathonCard } from "@/components/hackathons/HackathonCard";
import { HackathonFilters } from "@/components/hackathons/HackathonFilters";
import { MovingBubbles } from "@/components/ui/moving-bubbles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowDown, RefreshCw, Wifi } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { hackathonsData } from "@/data/mockData";
import { HackathonCard as HackathonCardType, HackathonType, UserSkill } from "@/types";
import { filterHackathons } from "@/services/recommendationService";
import { fetchLiveHackathons } from "@/services/liveDataService";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { CreateTeamModal } from "@/components/hackathons/CreateTeamModal";

export default function Hackathons() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredHackathons, setFilteredHackathons] = useState<HackathonCardType[]>([]);
  const [allHackathons, setAllHackathons] = useState<HackathonCardType[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiveData, setIsLiveData] = useState(false);
  const [filters, setFilters] = useState({
    types: [] as HackathonType[],
    mode: "all",
    prizePoolMin: 0,
    prizePoolMax: 100000,
    timeframe: "all",
    skills: [] as UserSkill[],
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState<HackathonCardType | null>(null);

  const { user } = useAuth();
  const isMobile = useIsMobile();
  const listTopRef = useRef<HTMLDivElement>(null);

  // Fetch live hackathons on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const live = await fetchLiveHackathons();
        if (live.length > 0) {
          setAllHackathons(live);
          setIsLiveData(true);
        } else {
          setAllHackathons(hackathonsData);
          setIsLiveData(false);
        }
      } catch {
        setAllHackathons(hackathonsData);
        setIsLiveData(false);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    let results = allHackathons;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        hackathon =>
          hackathon.title.toLowerCase().includes(query) ||
          hackathon.organizer.toLowerCase().includes(query) ||
          (hackathon.description && hackathon.description.toLowerCase().includes(query))
      );
    }

    results = filterHackathons(results, {
      types: filters.types,
      mode: filters.mode as any,
      prizePoolMin: filters.prizePoolMin,
      prizePoolMax: filters.prizePoolMax,
      timeframe: filters.timeframe as any,
      skills: filters.skills,
    });

    if (!showAll) {
      setFilteredHackathons(results.slice(0, 12));
    } else {
      setFilteredHackathons(results);
    }
  }, [searchQuery, filters, allHackathons, showAll]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleViewMore = () => {
    setShowAll(true);
    if (listTopRef.current) {
      listTopRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFormTeam = (hackathon: HackathonCardType) => {
    setSelectedHackathon(hackathon);
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      setIsTeamModalOpen(true);
    }
  };

  const handleViewDetails = (id: string) => {
    window.location.href = `/hackathons/${id}`;
  };

  return (
    <>
      <MovingBubbles numBubbles={15} opacity={0.1} minSize={10} maxSize={40} />
      <Navbar />

      <main className="flex-1 overflow-x-hidden">
        <section className="py-10 md:py-16 bg-gradient-to-b from-transparent to-primary/5">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h1 className="text-4xl font-bold mb-4">Discover Hackathons</h1>
              <p className="text-muted-foreground text-lg">
                Find live hackathons from Devpost — filter by type, mode, and prize pool.
              </p>
              {isLiveData && (
                <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 text-sm">
                  <Wifi className="h-3.5 w-3.5" />
                  Live data from Devpost
                </div>
              )}
            </div>

            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-8 relative">
              <div className="relative overflow-hidden rounded-full shadow-lg">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search hackathons by name, organizer, or description..."
                  className="pl-12 pr-4 py-6 border-primary/20 bg-background/50 backdrop-blur-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute -left-10 -top-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
                <div className="absolute -right-10 -bottom-10 w-20 h-20 bg-secondary/10 rounded-full blur-xl"></div>
              </div>
            </form>
          </div>
        </section>

        <section className="py-8 md:py-12 relative">
          <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10"></div>

          <div className="container">
            <div className="flex flex-col lg:flex-row gap-8">
              {isMobile && (
                <div className="w-full mb-4">
                  <HackathonFilters onFilterChange={handleFilterChange} isMobile={true} />
                </div>
              )}
              {!isMobile && <HackathonFilters onFilterChange={handleFilterChange} />}

              <div className="flex-1" ref={listTopRef}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">
                    {isLoading ? (
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        Fetching live hackathons...
                      </span>
                    ) : (
                      <>
                        {filteredHackathons.length}{" "}
                        {filteredHackathons.length === 1 ? "Hackathon" : "Hackathons"}
                        {isLiveData && (
                          <span className="ml-2 text-sm font-normal text-muted-foreground">(live)</span>
                        )}
                      </>
                    )}
                  </h2>
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-64 rounded-xl bg-muted/40 animate-pulse" />
                    ))}
                  </div>
                ) : filteredHackathons.length > 0 ? (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredHackathons.map((hackathon) => (
                        <div key={hackathon.id} className="animate-float hackathon-card-container">
                          <HackathonCard
                            id={hackathon.id}
                            title={hackathon.title}
                            organizer={hackathon.organizer}
                            location={hackathon.location}
                            url={hackathon.url}
                            imageUrl={hackathon.image}
                            type={hackathon.type}
                            prizePool={hackathon.prizePool !== undefined ? hackathon.prizePool.toString() : undefined}
                            mode={hackathon.mode.toLowerCase() as "online" | "in-person" | "hybrid"}
                            dates={`${new Date(hackathon.startDate).toLocaleDateString()} - ${new Date(hackathon.endDate).toLocaleDateString()}`}
                            description={hackathon.description}
                            onViewDetails={() => handleViewDetails(hackathon.id)}
                            onFormTeam={() => handleFormTeam(hackathon)}
                          />
                        </div>
                      ))}
                    </div>

                    {!showAll && filteredHackathons.length >= 12 && (
                      <div className="flex justify-center mt-8">
                        <Button onClick={handleViewMore} className="flex items-center gap-2 gradient-button">
                          Load More
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-card/50 backdrop-blur-sm rounded-lg border border-primary/10">
                    <h3 className="text-xl font-semibold mb-2">No hackathons found</h3>
                    <p className="text-muted-foreground mb-6">Try adjusting your filters or search query</p>
                    <Button
                      onClick={() => {
                        setSearchQuery("");
                        setFilters({
                          types: [],
                          mode: "all",
                          prizePoolMin: 0,
                          prizePoolMax: 100000,
                          timeframe: "all",
                          skills: [],
                        });
                      }}
                      className="rounded-full gradient-button"
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultView="login"
      />

      {selectedHackathon && (
        <CreateTeamModal
          isOpen={isTeamModalOpen}
          onClose={() => setIsTeamModalOpen(false)}
          hackathonId={selectedHackathon.id}
          hackathonTitle={selectedHackathon.title}
        />
      )}
    </>
  );
}
