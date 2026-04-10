import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MovingBubbles } from "@/components/ui/moving-bubbles";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HackathonCard } from "@/components/hackathons/HackathonCard";
import { InternshipCard } from "@/components/internships/InternshipCard";
import { ScholarshipCard } from "@/components/scholarships/ScholarshipCard";
import { TestimonialSection } from "@/components/home/TestimonialSection";
import { PartnerSection } from "@/components/home/PartnerSection";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Search, LightbulbIcon, Users, Globe, Wifi, RefreshCw } from "lucide-react";
import { hackathonsData, internshipsData } from "@/data/mockData";
import {
  HackathonCard as HackathonCardType,
  InternshipCard as InternshipCardType,
  Scholarship,
} from "@/types";
import { fetchLiveHackathons, fetchLiveInternships, fetchLiveScholarships } from "@/services/liveDataService";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";

const FEATURES = [
  { icon: Search, title: "Centralized Discovery", desc: "Find hackathons and internships from multiple platforms in one place, saving you time and effort." },
  { icon: LightbulbIcon, title: "AI Recommendations", desc: "Get personalized suggestions based on your skills, interests, and past activities." },
  { icon: Users, title: "Team Formation", desc: "Easily create or join teams for hackathons with our built-in team formation feature." },
  { icon: Globe, title: "Global Opportunities", desc: "Access opportunities from around the world, whether remote or in-person." },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState("hackathons");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [featuredHackathons, setFeaturedHackathons] = useState<HackathonCardType[]>([]);
  const [featuredInternships, setFeaturedInternships] = useState<InternshipCardType[]>([]);
  const [featuredScholarships, setFeaturedScholarships] = useState<Scholarship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiveData, setIsLiveData] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [hackathons, internships, scholarships] = await Promise.all([
          fetchLiveHackathons(),
          fetchLiveInternships(),
          fetchLiveScholarships(),
        ]);
        setFeaturedHackathons((hackathons.length ? hackathons : hackathonsData).slice(0, 3) as HackathonCardType[]);
        setFeaturedInternships((internships.length ? internships : internshipsData).slice(0, 3) as InternshipCardType[]);
        setFeaturedScholarships(scholarships.slice(0, 3));
        if (hackathons.length) setIsLiveData(true);
      } catch {
        setFeaturedHackathons(hackathonsData.slice(0, 3) as HackathonCardType[]);
        setFeaturedInternships(internshipsData.slice(0, 3) as InternshipCardType[]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const viewMoreLink = activeTab === "hackathons" ? "/hackathons" : activeTab === "internships" ? "/internships" : "/scholarships";

  return (
    <>
      <MovingBubbles />
      <Navbar />

      <main className="overflow-x-hidden">

        {/* ── Hero ── */}
        <section className="py-14 sm:py-20 text-center relative overflow-hidden">
          <div className="container px-4 relative z-10">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent leading-tight">
              Discover. Connect.<br className="hidden sm:block" /> Hack. Grow.
            </h1>
            <p className="text-base sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 px-2">
              HackXplore is your centralized platform for discovering hackathons, internships, and scholarships — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 px-4">
              <Button asChild size="lg" className="gradient-button w-full sm:w-auto">
                <Link to="/hackathons">
                  Explore Hackathons <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="hover:bg-primary/10 hover:text-primary w-full sm:w-auto">
                <Link to="/internships">Discover Internships</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── Why HackXplore ── */}
        <section className="py-12 sm:py-16 bg-gradient-to-b from-transparent to-primary/5">
          <div className="container px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">Why Choose HackXplore</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
                We simplify your journey to find and participate in hackathons and internships that match your skills.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-card/50 backdrop-blur-sm p-5 rounded-xl border border-primary/10 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
                  <div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2">{title}</h3>
                  <p className="text-muted-foreground text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured Opportunities ── */}
        <section className="py-12 sm:py-16">
          <div className="container px-4">
            {/* Header row */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-bold">Featured Opportunities</h2>
                {isLiveData && !isLoading && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 text-xs font-medium">
                    <Wifi className="h-3 w-3" /> Live
                  </span>
                )}
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                <TabsList className="grid grid-cols-3 w-full sm:w-auto bg-primary/10">
                  {["hackathons", "internships", "scholarships"].map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="capitalize text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-white"
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Cards */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 rounded-xl bg-muted/40 animate-pulse" />
                ))}
              </div>
            ) : activeTab === "hackathons" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {featuredHackathons.map((h) => (
                  <div key={h.id} className="hackathon-card-container animate-float">
                    <HackathonCard
                      id={h.id} title={h.title} organizer={h.organizer}
                      location={h.location} url={h.url} imageUrl={h.image}
                      type={h.type} prizePool={h.prizePool?.toString()}
                      mode={h.mode.toLowerCase() as "online" | "in-person" | "hybrid"}
                      dates={`${new Date(h.startDate).toLocaleDateString()} - ${new Date(h.endDate).toLocaleDateString()}`}
                      description={h.description}
                      onViewDetails={() => navigate(`/hackathons/${h.id}`)}
                      onFormTeam={() => navigate(`/hackathons/${h.id}`)}
                    />
                  </div>
                ))}
              </div>
            ) : activeTab === "internships" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {featuredInternships.map((i) => (
                  <div key={i.id} className="internship-card-container animate-float">
                    <InternshipCard
                      {...i} imageUrl={i.logo}
                      skills={(i.requiredSkills || i.skills || []) as any}
                      postedDate={i.postedDate || new Date().toISOString().split("T")[0]}
                      onViewDetails={() => navigate(`/internships/${i.id}`)}
                      url={i.url}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {featuredScholarships.map((s) => (
                  <div key={s.id} className="animate-float">
                    <ScholarshipCard {...s} onViewDetailsClick={() => navigate(`/scholarships/${s.id}`)} />
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-center mt-8">
              <Button asChild className="gradient-button">
                <Link to={viewMoreLink}>
                  View All {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── Stats Banner ── */}
        <section className="py-10 bg-primary/5 border-y border-primary/10">
          <div className="container px-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {[
                { value: "500+", label: "Hackathons Listed" },
                { value: "1,200+", label: "Internships Available" },
                { value: "50K+", label: "Students Helped" },
                { value: "200+", label: "Partner Companies" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl sm:text-3xl font-extrabold text-primary">{value}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <TestimonialSection />
        <PartnerSection />

        {/* ── CTA ── */}
        <section className="py-16 sm:py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="container px-4 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Ready to find your next challenge?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8 text-sm sm:text-base">
              Create your profile today and get personalized recommendations for hackathons and internships.
            </p>
            {!user && (
              <Button size="lg" className="gradient-button w-full sm:w-auto" onClick={() => setIsAuthModalOpen(true)}>
                Get Started — It's Free
              </Button>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} defaultView="signup" />
    </>
  );
}
