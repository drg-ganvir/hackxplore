import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HackathonCard } from "@/components/hackathons/HackathonCard";
import { InternshipCard } from "@/components/internships/InternshipCard";
import { AuthModal } from "@/components/auth/AuthModal";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useBookmarks } from "@/services/bookmarkService";
import { hackathonsData, internshipsData, scholarshipsData } from "@/data/mockData";
import { BookmarkIcon, LogIn } from "lucide-react";

export default function Bookmarks() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const { bookmarks, isLoading } = useBookmarks();
  
  const hackathonBookmarks = bookmarks
    .filter(bookmark => bookmark.item_type === "hackathon")
    .map(bookmark => 
      hackathonsData.find(hackathon => hackathon.id === bookmark.item_id)
    )
    .filter(hackathon => hackathon !== undefined) as any[];
    
  const internshipBookmarks = bookmarks
    .filter(bookmark => bookmark.item_type === "internship")
    .map(bookmark => 
      internshipsData.find(internship => internship.id === bookmark.item_id)
    )
    .filter(internship => internship !== undefined) as any[];
    
  const scholarshipBookmarks = bookmarks
    .filter(bookmark => bookmark.item_type === "scholarship")
    .map(bookmark => 
      scholarshipsData.find(scholarship => scholarship.id === bookmark.item_id)
    )
    .filter(scholarship => scholarship !== undefined) as any[];
  
  if (!user) {
    return (
      <AnimatedBackground>
        <Navbar />
        <main className="container py-16">
          <div className="max-w-md mx-auto text-center">
            <Card>
              <CardContent className="pt-12 pb-6 px-6">
                <BookmarkIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h1 className="text-2xl font-bold mb-2">Sign In Required</h1>
                <p className="text-muted-foreground mb-6">
                  You need to be signed in to view your bookmarked hackathons, internships, and scholarships.
                </p>
                <Button onClick={() => setIsAuthModalOpen(true)}>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            defaultView="login"
          />
        </main>
        <Footer />
      </AnimatedBackground>
    );
  }
  
  return (
    <AnimatedBackground>
      <Navbar />
      
      <main className="container py-12">
        <h1 className="text-3xl font-bold mb-8">My Bookmarks</h1>
        
        <Tabs defaultValue="hackathons">
          <TabsList className="mb-8 w-full md:w-auto">
            <TabsTrigger value="hackathons">
              Hackathons ({hackathonBookmarks.length})
            </TabsTrigger>
            <TabsTrigger value="internships">
              Internships ({internshipBookmarks.length})
            </TabsTrigger>
            <TabsTrigger value="scholarships">
              Scholarships ({scholarshipBookmarks.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="hackathons">
            {isLoading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, index) => (
                  <Card key={index} className="w-full h-48 animate-pulse bg-muted"></Card>
                ))}
              </div>
            ) : hackathonBookmarks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {hackathonBookmarks.map((hackathon) => (
                  <HackathonCard
                    key={hackathon.id}
                    id={hackathon.id}
                    title={hackathon.title}
                    organizer={hackathon.organizer}
                    location={hackathon.location}
                    url={hackathon.url}
                    imageUrl={hackathon.image}
                    type={hackathon.type}
                    prizePool={hackathon.prizePool?.toString()}
                    mode={hackathon.mode?.toLowerCase() as "online" | "in-person" | "hybrid"}
                    dates={`${new Date(hackathon.startDate).toLocaleDateString()} - ${new Date(hackathon.endDate).toLocaleDateString()}`}
                    description={hackathon.description}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <BookmarkIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No bookmarked hackathons</h3>
                    <p className="text-muted-foreground mb-6">
                      You haven't bookmarked any hackathons yet. Browse hackathons and click the bookmark icon to add them here.
                    </p>
                    <Button asChild>
                      <a href="/hackathons">Explore Hackathons</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="internships">
            {isLoading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, index) => (
                  <Card key={index} className="w-full h-48 animate-pulse bg-muted"></Card>
                ))}
              </div>
            ) : internshipBookmarks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {internshipBookmarks.map((internship) => (
                  <InternshipCard
                    key={internship.id}
                    id={internship.id}
                    title={internship.title}
                    company={internship.company}
                    location={internship.location}
                    imageUrl={internship.logo || internship.imageUrl || ""}
                    isRemote={internship.isRemote}
                    stipend={internship.stipend}
                    duration={internship.duration}
                    deadline={internship.applicationDeadline}
                    skills={(internship.requiredSkills || internship.skills || []) as any}
                    description={internship.description || ""}
                    type="Tech"
                    postedDate={internship.postedDate || new Date().toISOString().split("T")[0]}
                    url={internship.url || ""}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <BookmarkIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No bookmarked internships</h3>
                    <p className="text-muted-foreground mb-6">
                      You haven't bookmarked any internships yet. Browse internships and click the bookmark icon to add them here.
                    </p>
                    <Button asChild>
                      <a href="/internships">Explore Internships</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="scholarships">
            {isLoading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, index) => (
                  <Card key={index} className="w-full h-48 animate-pulse bg-muted"></Card>
                ))}
              </div>
            ) : scholarshipBookmarks.length > 0 ? (
              <div className="space-y-6">
                {scholarshipBookmarks.map((scholarship) => (
                  <Card key={scholarship.id} {...scholarship} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <BookmarkIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No bookmarked scholarships</h3>
                    <p className="text-muted-foreground mb-6">
                      You haven't bookmarked any scholarships yet. Browse scholarships and click the bookmark icon to add them here.
                    </p>
                    <Button asChild>
                      <a href="/scholarships">Explore Scholarships</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </AnimatedBackground>
  );
}
