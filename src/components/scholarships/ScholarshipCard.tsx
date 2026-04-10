
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useBookmarks } from "@/services/bookmarkService";
import { useAuth } from "@/contexts/AuthContext";
import { Scholarship } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { BookmarkIcon, ExternalLink, Calendar, Clock } from "lucide-react";
import { useState } from "react";
import { ReminderModal } from "@/components/internships/ReminderModal";
import { formatDistanceToNow } from "date-fns";

export function ScholarshipCard({
  id,
  title,
  provider,
  amount,
  deadline,
  type,
  eligibility,
  link,
  description,
  onViewDetailsClick,
}: Scholarship & { onViewDetailsClick?: () => void }) {
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { toast } = useToast();
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const isScholarshipBookmarked = isBookmarked(id, "scholarship");

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to bookmark scholarships",
        variant: "destructive",
      });
      return;
    }
    
    toggleBookmark(id, "scholarship");
  };
  
  const handleSetReminder = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to set reminders",
        variant: "destructive",
      });
      return;
    }
    
    setIsReminderModalOpen(true);
  };
  
  const formattedDeadline = new Date(deadline);
  const deadlineDistance = formatDistanceToNow(formattedDeadline, { addSuffix: true });
  
  return (
    <>
      <Card className="h-full flex flex-col overflow-hidden border border-primary/10 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/10">
        <CardContent className="p-4 sm:p-6 flex-grow">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary">{provider.charAt(0)}</span>
                </div>
                <Badge className="text-xs">{type}</Badge>
              </div>
              <h3 className="text-base sm:text-xl font-bold mb-1 line-clamp-2">{title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{provider}</p>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-full ${isScholarshipBookmarked ? 'text-primary' : 'text-muted-foreground'}`}
              onClick={handleBookmarkClick}
            >
              <BookmarkIcon 
                className={`h-5 w-5 ${isScholarshipBookmarked ? 'fill-primary' : ''}`} 
              />
              <span className="sr-only">Bookmark</span>
            </Button>
          </div>
          
          <div className="mt-4 flex flex-col space-y-2">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
              <p className="text-sm">
                <span className="font-medium">Deadline:</span> {formattedDeadline.toLocaleDateString()} ({deadlineDistance})
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-green-600 dark:text-green-400">$</span>
              <p className="text-sm font-medium text-foreground">{amount.toLocaleString()}<span className="text-muted-foreground font-normal"> award</span></p>
            </div>
          </div>
          
          {description && (
            <p className="mt-4 text-sm line-clamp-2">{description}</p>
          )}
          
          <div className="mt-4">
            <p className="text-sm font-medium mb-1">Eligibility:</p>
            <div className="flex flex-wrap gap-1">
              {eligibility.slice(0, 3).map((criterion, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {criterion}
                </Badge>
              ))}
              {eligibility.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{eligibility.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
        
        <Separator />
        
        <CardFooter className="p-4 flex flex-wrap justify-between gap-2">
          <Button variant="outline" size="sm" onClick={handleSetReminder}>
            <Clock className="h-4 w-4 mr-1" />
            Set Reminder
          </Button>

          {link && (
            <Button
              size="sm"
              className="gradient-button flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                window.open(link, "_blank");
              }}
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              Apply Now
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        internshipId={id}
        internshipTitle={title}
        deadline={deadline}
        company={provider}
      />
    </>
  );
}
