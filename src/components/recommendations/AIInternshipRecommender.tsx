
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { InternshipCard } from "@/components/internships/InternshipCard";
import { HackathonCard } from "@/components/hackathons/HackathonCard";
import { internshipsData, hackathonsData } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { HackathonCard as HackathonCardType, InternshipCard as InternshipCardType, UserSkill, HackathonType } from "@/types";
import { getRecommendedInternships, getRecommendedHackathons } from "@/services/recommendationService";
import { Brain, RefreshCw, User } from "lucide-react";

interface AIInternshipRecommenderProps {
  className?: string;
}

export function AIInternshipRecommender({ className }: AIInternshipRecommenderProps) {
  const { user, profile } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [recommendations, setRecommendations] = useState<{
    internships: InternshipCardType[];
    hackathons: HackathonCardType[];
  }>({
    internships: [],
    hackathons: []
  });
  const [activeTab, setActiveTab] = useState("internships");

  const analyzeProfile = () => {
    if (!user || !profile) return;
    
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate AI analysis with progress
    const intervalId = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(intervalId);
          
          // Get recommendations
          const recommendedInternships = getRecommendedInternships(
            internshipsData as InternshipCardType[],
            profile.skills as UserSkill[]
          );
          
          const recommendedHackathons = getRecommendedHackathons(
            hackathonsData as HackathonCardType[],
            profile.skills as UserSkill[],
            profile.interests as HackathonType[]
          );
          
          setRecommendations({
            internships: recommendedInternships,
            hackathons: recommendedHackathons
          });
          
          setIsAnalyzing(false);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };
  
  if (!user || !profile) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Career Recommendations
          </CardTitle>
          <CardDescription>
            Sign in to get personalized recommendations based on your profile
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <Button variant="outline" asChild>
            <a href="/profile">
              <User className="mr-2 h-4 w-4" />
              Create Your Profile
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  if (isAnalyzing) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Analyzing Your Profile</CardTitle>
          <CardDescription>
            Our AI is finding the best matches for your skills and interests
          </CardDescription>
        </CardHeader>
        <CardContent className="py-10">
          <div className="space-y-4">
            <Progress value={analysisProgress} className="h-2" />
            <div className="text-center text-sm text-muted-foreground">
              Analyzing {profile.skills?.length || 0} skills and {profile.interests?.length || 0} interests...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Career Recommendations
            </CardTitle>
            <CardDescription>
              Personalized opportunities based on your profile
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={analyzeProfile}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pb-0">
        {recommendations.internships.length === 0 && recommendations.hackathons.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium mb-2">Get Personalized Recommendations</h3>
            <p className="text-muted-foreground mb-6">
              Click the button below to analyze your profile and get matched with relevant opportunities
            </p>
            <Button onClick={analyzeProfile}>Generate Recommendations</Button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Skills analyzed:</h3>
              <div className="flex flex-wrap gap-1 mb-4">
                {profile.skills?.map(skill => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
              
              <h3 className="text-sm font-medium mb-2">Interests analyzed:</h3>
              <div className="flex flex-wrap gap-1">
                {profile.interests?.map(interest => (
                  <Badge key={interest} variant="secondary" className="text-xs">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
            
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList className="w-full">
                <TabsTrigger value="internships" className="flex-1">
                  Internships ({recommendations.internships.length})
                </TabsTrigger>
                <TabsTrigger value="hackathons" className="flex-1">
                  Hackathons ({recommendations.hackathons.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="internships" className="mt-4">
                {recommendations.internships.length > 0 ? (
                  <div className="space-y-4">
                    {recommendations.internships.slice(0, 3).map(internship => (
                      <InternshipCard 
                        key={internship.id}
                        id={internship.id}
                        title={internship.title}
                        company={internship.company}
                        location={internship.location}
                        isRemote={internship.isRemote}
                        stipend={internship.stipend}
                        duration={internship.duration}
                        applicationDeadline={internship.applicationDeadline}
                        skills={internship.requiredSkills}
                        companySize={internship.companySize}
                        description={internship.description}
                        imageUrl={internship.logo}
                        type="Tech"
                        postedDate={new Date().toISOString().split('T')[0]}
                        url={internship.url}
                        onViewDetails={() => {}}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No matching internships found. Try updating your skills in your profile.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="hackathons" className="mt-4">
                {recommendations.hackathons.length > 0 ? (
                  <div className="space-y-4">
                    {recommendations.hackathons.slice(0, 3).map(hackathon => (
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
                        onViewDetails={() => {}}
                        onFormTeam={() => {}}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No matching hackathons found. Try updating your interests in your profile.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
      
      <CardFooter className="pt-4 pb-4">
        <Button asChild variant="outline" className="w-full">
          <a href={activeTab === "internships" ? "/internships" : "/hackathons"}>
            View All {activeTab === "internships" ? "Internships" : "Hackathons"}
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
