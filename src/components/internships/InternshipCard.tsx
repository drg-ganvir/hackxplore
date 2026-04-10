import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, ExternalLink, Calendar, DollarSign, MapPin, Bell, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { useBookmarks } from "@/services/bookmarkService";
import { AuthModal } from "@/components/auth/AuthModal";
import { ReminderModal } from "@/components/internships/ReminderModal";
import { UserSkill } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface InternshipCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  imageUrl: string;
  skills: UserSkill[];
  duration: string;
  deadline?: string;
  stipend?: string;
  isRemote?: boolean;
  postedDate: string;
  type: string;
  isBookmarked?: boolean;
  onViewDetailsClick?: () => void;
}

export function InternshipCard({
  id,
  title,
  company,
  location,
  description,
  url,
  imageUrl,
  skills,
  duration,
  deadline,
  stipend,
  isRemote,
  postedDate,
  type,
  isBookmarked: initialBookmarkState,
  onViewDetailsClick,
}: InternshipCardProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark, isLoading } = useBookmarks();
  
  const hasBookmark = isBookmarked(id, "internship");
  
  const handleBookmark = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    
    toggleBookmark(id, "internship");
  };

  const handleSetReminder = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    
    setIsReminderModalOpen(true);
  };

  const handleViewDetails = () => {
    if (onViewDetailsClick) {
      onViewDetailsClick();
    }
  };
  
  const [imgError, setImgError] = React.useState(false);

  return (
    <>
      <Card className="h-full bg-card/50 backdrop-blur-sm border border-primary/10 card-hover-effect flex flex-col overflow-hidden">
        <CardContent className="p-4 flex-grow">
          <div className="flex gap-4 mb-4">
            <div className="h-16 w-16 shrink-0 rounded-md bg-primary/10 border border-primary/20 p-1.5 flex items-center justify-center">
              {imageUrl && !imgError ? (
                <img
                  src={imageUrl}
                  alt={company}
                  className="h-full w-full object-contain"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-2xl font-bold text-primary">
                  {company.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <h3 className="text-base font-semibold leading-tight line-clamp-2 cursor-pointer" onClick={handleViewDetails}>
                  {title}
                </h3>
                <div className="flex gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleSetReminder}
                          className="h-8 w-8 rounded-full hover:bg-primary/10 card-glow-effect"
                        >
                          <Bell className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Set deadline reminder</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleBookmark}
                          disabled={isLoading}
                          className="h-8 w-8 rounded-full hover:bg-primary/10 card-glow-effect"
                        >
                          <Bookmark
                            className={cn("h-5 w-5", hasBookmark && "fill-primary text-primary")}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{hasBookmark ? "Remove bookmark" : "Bookmark internship"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{company}</p>
            </div>
          </div>
          
          <div className="mb-3 space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2 text-primary/70" />
              <span>{location}</span>
              {isRemote && (
                <Badge variant="outline" className="ml-2 text-xs">
                  Remote Available
                </Badge>
              )}
            </div>
            
            {deadline && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2 text-primary/70" />
                <span>Deadline: {deadline}</span>
              </div>
            )}
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2 text-primary/70" />
              <span>Duration: {duration}</span>
            </div>
            
            {stipend && (
              <div className="flex items-center text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4 mr-2 text-primary/70" />
                <span>Stipend: {stipend}</span>
              </div>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
            {description}
          </p>
          
          {skills && skills.length > 0 && (
            <div className="mt-3 space-y-1">
              <p className="text-sm font-medium">Skills Required:</p>
              <div className="flex flex-wrap gap-1">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="card-glow-effect text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <div className="flex w-full gap-2">
            {onViewDetailsClick && (
              <Button
                onClick={handleViewDetails}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                View Details
              </Button>
            )}
            <Button
              asChild
              className="gradient-button card-glow-effect flex-1"
              size="sm"
            >
              <a href={url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Apply Now
              </a>
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultView="login"
      />
      
      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        internshipId={id}
        internshipTitle={title}
        deadline={deadline}
        company={company}
      />
    </>
  );
}
