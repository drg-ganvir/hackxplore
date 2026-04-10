import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HackathonCard } from "@/components/hackathons/HackathonCard";
import { MovingBubbles } from "@/components/ui/moving-bubbles";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { HackathonCard as HackathonCardType, HackathonType } from "@/types";

export default function HackathonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hackathon, setHackathon] = useState<HackathonCardType | null>(null);
  const [similarHackathons, setSimilarHackathons] = useState<HackathonCardType[]>([]);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  // Mock implementation for useHackathonTeams
  const { hackathonTeams, isLoadingTeams, joinTeam, leaveTeam, isUserInTeam } = useHackathonTeamsService();

  // Fetch hackathon details and similar hackathons
  useEffect(() => {
    // Mock data fetching
    const mockHackathons = [
      {
        id: "1",
        title: "AI Hackathon",
        organizer: "DoraHacks",
        startDate: "2024-08-01",
        endDate: "2024-08-03",
        location: "Online",
        mode: "Online" as "Online" | "In-person" | "Hybrid",
        prizePool: 10000,
        tags: ["AI", "Machine Learning"],
        applicationDeadline: "2024-07-25",
        url: "https://dorahacks.com/events",
        image: "/hackathons/ai-hackathon.jpg",
        isPopular: true,
        type: "AI/ML" as HackathonType,
        description: "Build innovative AI solutions for real-world problems."
      },
      {
        id: "2",
        title: "Web3 Hackathon",
        organizer: "ETHGlobal",
        startDate: "2024-09-15",
        endDate: "2024-09-17",
        location: "New York, NY",
        mode: "In-person" as "Online" | "In-person" | "Hybrid",
        prizePool: 15000,
        tags: ["Web3", "Blockchain"],
        applicationDeadline: "2024-09-01",
        url: "https://ethglobal.com/events",
        image: "/hackathons/web3-hackathon.jpg",
        isPopular: false,
        type: "Web3" as HackathonType,
        description: "Explore the world of decentralized applications and blockchain technology."
      },
      {
        id: "3",
        title: "Mobile App Hackathon",
        organizer: "DevTown",
        startDate: "2024-10-20",
        endDate: "2024-10-22",
        location: "San Francisco, CA",
        mode: "Hybrid",
        prizePool: 12000,
        tags: ["Mobile", "Development"],
        applicationDeadline: "2024-10-05",
        url: "https://devtown.com/events",
        image: "/hackathons/mobile-hackathon.jpg",
        isPopular: true,
        type: "Mobile" as HackathonType,
        description: "Create innovative mobile applications for iOS and Android platforms."
      },
      {
        id: "4",
        title: "Sustainable Solutions Hackathon",
        organizer: "HackGreen",
        startDate: "2024-11-10",
        endDate: "2024-11-12",
        location: "Berlin, Germany",
        mode: "In-person",
        prizePool: 18000,
        tags: ["Sustainability", "Environment"],
        applicationDeadline: "2024-10-25",
        url: "https://hackgreen.org/events",
        image: "/hackathons/sustainable-hackathon.jpg",
        isPopular: false,
        type: "Sustainable Development" as HackathonType,
        description: "Develop sustainable solutions to address environmental challenges."
      },
    ];

    const selectedHackathon = mockHackathons.find(h => h.id === id) || null;
    if (selectedHackathon) {
      setHackathon(selectedHackathon);

      // Find similar hackathons based on tags
      const similar = mockHackathons.filter(h =>
        h.tags.some(tag => selectedHackathon.tags.includes(tag)) && h.id !== id
      );
      setSimilarHackathons(similar);
    }
  }, [id]);

  // Check if hackathon is hackathon-friendly for the error with 'some'
  const isHackathonFriendly = Array.isArray(hackathon?.type) 
    ? hackathon.type.some(t => t === "Beginner-Friendly") 
    : hackathon?.type === "Beginner-Friendly";

  const handleJoinTeam = async (hackathon: HackathonCardType) => {
    // Implement join team logic here
    console.log(`Joining team for hackathon: ${hackathon.title}`);
  };

  return (
    <>
      <MovingBubbles />
      <Navbar />

      <main className="flex-1 overflow-x-hidden">
        <section className="py-10 md:py-16 bg-gradient-to-b from-transparent to-primary/5">
          <div className="container">
            <div className="grid grid-cols-12 gap-8">
              {/* Main hackathon card */}
              <div className="col-span-12 md:col-span-8 space-y-6">
                <HackathonCard
                  isDetailed={true}
                  id={hackathon.id}
                  title={hackathon.title}
                  organizer={hackathon.organizer}
                  location={hackathon.location}
                  url={hackathon.url}
                  imageUrl={hackathon.image} // Added imageUrl property
                  type={hackathon.type}
                  prizePool={hackathon.prizePool ? hackathon.prizePool.toString() : undefined}
                  mode={hackathon.mode.toLowerCase() as "online" | "in-person" | "hybrid"}
                  dates={`${new Date(hackathon.startDate).toLocaleDateString()} - ${new Date(hackathon.endDate).toLocaleDateString()}`}
                  description={hackathon.description}
                  onViewDetails={() => {}}
                  onFormTeam={() => {}}
                />

                {/* Additional details */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Details</h2>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span>{new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}</span>
                    </div>
                    {hackathon.mode && (
                      <div className="flex items-center space-x-2">
                        <span>Mode: {hackathon.mode}</span>
                      </div>
                    )}
                    {hackathon.prizePool && (
                      <div className="flex items-center space-x-2">
                        <span>Prize Pool: ${hackathon.prizePool}</span>
                      </div>
                    )}
                  </div>
                  {hackathon.description && (
                    <p className="text-muted-foreground">{hackathon.description}</p>
                  )}
                </div>
              </div>

              {/* Sidebar with team info and similar hackathons */}
              <div className="col-span-12 md:col-span-4 space-y-6">
                {/* Team formation section */}
                <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-primary/10 p-4 space-y-4">
                  <h3 className="text-lg font-semibold">Team Formation</h3>
                  {isLoadingTeams ? (
                    <p className="text-muted-foreground">Loading teams...</p>
                  ) : hackathonTeams && hackathonTeams.length > 0 ? (
                    <div className="space-y-2">
                      {hackathonTeams.map(team => (
                        <div key={team.id} className="p-2 rounded-md bg-muted/20">
                          <p className="text-sm font-medium">{team.name}</p>
                          <p className="text-xs text-muted-foreground">{team.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No teams available for this hackathon yet.</p>
                  )}
                  {user ? (
                    <Button className="w-full gradient-button">Form a Team</Button>
                  ) : (
                    <Button className="w-full gradient-button">Login to Form a Team</Button>
                  )}
                </div>

                {/* Similar hackathons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  {similarHackathons.slice(0, 4).map(similarHackathon => (
                    <HackathonCard
                      key={similarHackathon.id}
                      id={similarHackathon.id}
                      title={similarHackathon.title}
                      organizer={similarHackathon.organizer}
                      location={similarHackathon.location}
                      url={similarHackathon.url}
                      imageUrl={similarHackathon.image} // Added imageUrl property
                      type={similarHackathon.type}
                      prizePool={similarHackathon.prizePool ? similarHackathon.prizePool.toString() : undefined}
                      mode={similarHackathon.mode.toLowerCase() as "online" | "in-person" | "hybrid"}
                      dates={`${new Date(similarHackathon.startDate).toLocaleDateString()} - ${new Date(similarHackathon.endDate).toLocaleDateString()}`}
                      description={similarHackathon.description || ""}
                      onViewDetails={() => navigate(`/hackathons/${similarHackathon.id}`)}
                      onFormTeam={() => handleJoinTeam(similarHackathon)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

// Mock implementation (this should be replaced with your actual implementation)
function useHackathonTeamsService() {
  return {
    hackathonTeams: [
      {
        id: "team-1",
        name: "AI Innovators",
        description: "Building the future with AI",
        members: ["user-1", "user-2"],
      },
      {
        id: "team-2",
        name: "Web3 Wizards",
        description: "Decentralizing the world",
        members: ["user-3", "user-4"],
      },
    ],
    isLoadingTeams: false,
    joinTeam: async (teamId: string) => ({ success: true }),
    leaveTeam: async (teamId: string) => ({ success: true }),
    isUserInTeam: (teamId: string) => false
  };
}
