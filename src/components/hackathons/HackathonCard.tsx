import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, ExternalLink, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useBookmarks } from "@/services/bookmarkService";
import { AuthModal } from "@/components/auth/AuthModal";
import { CreateTeamModal } from "@/components/hackathons/CreateTeamModal";
import { HackathonType, UserSkill } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export interface HackathonCardProps {
  id: string;
  title: string;
  url: string;
  imageUrl: string;
  dates?: string;
  startDate?: string;
  endDate?: string;
  organizer?: string;
  mode?: "online" | "in-person" | "hybrid";
  type?: HackathonType | HackathonType[];
  prizePool?: string;
  description?: string;
  teamSize?: number;
  skills?: UserSkill[];
  location: string;
  source?: string;
  isDetailed?: boolean;
  onViewDetails?: () => void;
  onFormTeam?: () => void;
}

export function HackathonCard({
  id,
  title,
  url,
  imageUrl,
  dates,
  organizer,
  mode,
  type,
  prizePool,
  description,
  teamSize,
  skills,
  location,
  isDetailed,
  onViewDetails,
  onFormTeam,
}: HackathonCardProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark, isLoading } = useBookmarks();

  const isItemBookmarked = isBookmarked(id, "hackathon");

  const handleBookmark = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    toggleBookmark(id, "hackathon");
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails();
    }
  };

  const handleFormTeam = () => {
    if (onFormTeam) {
      onFormTeam();
    } else {
      if (!user) {
        setIsAuthModalOpen(true);
      } else {
        setIsCreateTeamModalOpen(true);
      }
    }
  };

  const [imgError, setImgError] = React.useState(false);

  return (
    <>
      <Card className="h-full bg-card/50 backdrop-blur-sm border border-primary/10 card-hover-effect overflow-hidden flex flex-col">
        <div className="relative">
          <a href={url} target="_blank" rel="noopener noreferrer">
            {imageUrl && !imgError ? (
              <img
                src={imageUrl}
                alt={title}
                className="aspect-video w-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="aspect-video w-full img-placeholder flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
                <span className="text-xs text-muted-foreground font-medium text-center px-2 line-clamp-2">{title}</span>
              </div>
            )}
          </a>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBookmark}
            disabled={isLoading}
            className="absolute top-2 right-2 h-8 w-8 rounded-full hover:bg-primary/10 bg-background/50 backdrop-blur-sm card-glow-effect"
          >
            <Bookmark
              className={cn("h-5 w-5", isItemBookmarked && "fill-primary text-primary")}
            />
            <span className="sr-only">
              {isItemBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
            </span>
          </Button>
        </div>
        
        <CardContent className="p-4 flex-grow flex flex-col">
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          
          <p className="text-sm text-muted-foreground mb-2">
            {organizer && <span>{organizer}</span>}
            {location && <span>, {location}</span>}
          </p>

          {dates && <p className="text-sm font-medium mb-2">{dates}</p>}

          {type && (
            <div className="mb-3 flex flex-wrap gap-1">
              {Array.isArray(type) 
                ? type.map((t) => (
                    <Badge key={t} variant="secondary" className="card-glow-effect text-xs">
                      {t}
                    </Badge>
                  ))
                : (
                    <Badge variant="secondary" className="card-glow-effect text-xs">
                      {type}
                    </Badge>
                  )
              }
            </div>
          )}

          {description && (
            <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
              {description}
            </p>
          )}
          
          <div className="mt-auto space-y-1 text-sm">
            {prizePool && <p className="text-muted-foreground">Prize: {prizePool}</p>}
            {mode && <p className="text-muted-foreground">Mode: {mode}</p>}
            {teamSize && (
              <p className="text-muted-foreground">
                Team Size: Up to {teamSize} members
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-between gap-2">
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="card-glow-effect flex-1"
          >
            <a href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Learn More
            </a>
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleFormTeam}
            className="gradient-button card-glow-effect flex-1"
          >
            <Users className="mr-2 h-4 w-4" />
            Create Team
          </Button>
        </CardFooter>
      </Card>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultView="login"
      />

      <CreateTeamModal
        isOpen={isCreateTeamModalOpen}
        onClose={() => setIsCreateTeamModalOpen(false)}
        hackathonId={id}
        hackathonTitle={title}
      />
    </>
  );
}
