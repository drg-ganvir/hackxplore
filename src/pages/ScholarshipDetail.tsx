import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
// import { MovingBubbles } from "@/components/ui/moving-bubbles";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useBookmarks } from "@/services/bookmarkService";
import { useAuth } from "@/contexts/AuthContext";
import { scholarshipsData } from "@/data/mockData";
import { ReminderModal } from "@/components/internships/ReminderModal";
import { AuthModal } from "@/components/auth/AuthModal";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  BookmarkIcon, 
  Clock, 
  ChevronLeft, 
  ExternalLink, 
  GraduationCap, 
  Award,
  DollarSign,
  CheckCircle2
} from "lucide-react";

export default function ScholarshipDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { toast } = useToast();

  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const scholarship = scholarshipsData.find((scholarship) => scholarship.id === id);

  if (!scholarship) {
    return (
      <>
        <Navbar />
        <main className="container py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Scholarship Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The scholarship you're looking for does not exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/scholarships">Browse Scholarships</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const isScholarshipBookmarked = isBookmarked(scholarship.id, "scholarship");

  const handleBookmarkClick = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    toggleBookmark(scholarship.id, "scholarship");
  };

  const handleSetReminder = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsReminderModalOpen(true);
  };

  const deadlineDate = new Date(scholarship.deadline);

  return (
    <>
      <Navbar />

      <main className="container py-12">
        <div className="mb-6">
          <Button asChild variant="ghost" className="mb-4">
            <Link to="/scholarships">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Scholarships
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <Badge className="mb-2">{scholarship.type}</Badge>
              <h1 className="text-3xl font-bold">{scholarship.title}</h1>
              <p className="text-muted-foreground">{scholarship.provider}</p>
            </div>

            <div className="flex gap-3">
              <Button
                variant={isScholarshipBookmarked ? "default" : "outline"}
                onClick={handleBookmarkClick}
                className={isScholarshipBookmarked ? "gradient-button" : ""}
              >
                <BookmarkIcon
                  className={`h-4 w-4 mr-2 ${isScholarshipBookmarked ? "fill-white" : ""}`}
                />
                {isScholarshipBookmarked ? "Bookmarked" : "Bookmark"}
              </Button>

              <Button variant="outline" onClick={handleSetReminder}>
                <Clock className="h-4 w-4 mr-2" />
                Set Reminder
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">About This Scholarship</h2>
                    <p>{scholarship.description}</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-semibold mb-3">Key Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <DollarSign className="h-5 w-5 text-primary mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Amount</h4>
                          <p>${scholarship.amount.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 text-primary mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Application Deadline</h4>
                          <p>{deadlineDate.toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <GraduationCap className="h-5 w-5 text-primary mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Scholarship Type</h4>
                          <p>{scholarship.type}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Award className="h-5 w-5 text-primary mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Provider</h4>
                          <p>{scholarship.provider}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-semibold mb-3">Eligibility Requirements</h3>
                    <ul className="space-y-2">
                      {scholarship.eligibility.map((requirement, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                          <span>{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Application</h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Application Deadline</p>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <p>{deadlineDate.toLocaleDateString()}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-muted-foreground text-sm mb-4">
                      To apply for this scholarship, visit the official website by clicking the button below.
                    </p>

                    <div className="space-y-3">
                      {scholarship.link && (
                        <Button
                          className="w-full gradient-button"
                          onClick={() => window.open(scholarship.link, "_blank")}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Apply Now
                        </Button>
                      )}

                      <Button variant="outline" className="w-full" onClick={handleSetReminder}>
                        <Clock className="h-4 w-4 mr-2" />
                        Set Deadline Reminder
                      </Button>

                      <Button
                        variant={isScholarshipBookmarked ? "secondary" : "outline"}
                        className="w-full"
                        onClick={handleBookmarkClick}
                      >
                        <BookmarkIcon
                          className={`h-4 w-4 mr-2 ${isScholarshipBookmarked ? "fill-current" : ""}`}
                        />
                        {isScholarshipBookmarked ? "Saved to Bookmarks" : "Save to Bookmarks"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />

      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        title={scholarship.title}
        date={new Date(scholarship.deadline)}
        type="scholarship"
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultView="login"
      />
    </>
  );
}
