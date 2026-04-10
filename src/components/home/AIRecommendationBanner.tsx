
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "../auth/AuthModal";

export function AIRecommendationBanner() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();
  
  const handleSignIn = () => {
    setIsAuthModalOpen(true);
  };
  
  if (user) return null;
  
  return (
    <>
      <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-secondary/10 border-primary/10 shadow-lg overflow-hidden relative">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-secondary/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-primary/20 rounded-full blur-lg"></div>
        
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-primary opacity-80" />
            <div>
              <h3 className="text-lg font-semibold">Join Hackathons & Find Teams</h3>
              <p className="text-muted-foreground">Sign in to create or join teams for upcoming hackathons</p>
            </div>
          </div>
          
          <Button onClick={handleSignIn} className="relative overflow-hidden group w-full md:w-auto">
            <span className="relative z-10">Sign In</span>
            <span className="absolute inset-0 bg-white/10 group-hover:animate-ripple rounded-md"></span>
          </Button>
        </CardContent>
      </Card>
      
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultView="login"
      />
    </>
  );
}
