import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Mail, Send, Github, Linkedin, Instagram } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      toast({ title: "Subscribed!", description: "You've been added to our newsletter." });
      setEmail("");
    }
  };

  return (
    <footer className="w-full border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/80 py-10 sm:py-14">
      <div className="container px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand + newsletter */}
        <div className="sm:col-span-2">
          <Link to="/" className="inline-block mb-3">
            <span className="font-bold text-xl bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              HackXplore
            </span>
          </Link>
          <p className="text-muted-foreground mb-5 text-sm max-w-sm">
            A centralized platform that aggregates hackathons, internships, and scholarships — helping students discover, bookmark, and participate in the best opportunities.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-2 max-w-xs">
            <Input
              type="email"
              placeholder="Your email"
              className="bg-muted/50 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" size="icon" className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">Explore</h3>
          <ul className="space-y-2.5">
            {[
              { to: "/", label: "Home" },
              { to: "/hackathons", label: "Hackathons" },
              { to: "/internships", label: "Internships" },
              { to: "/scholarships", label: "Scholarships" },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact + Social */}
        <div>
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">Connect</h3>
          <ul className="space-y-2.5">
            <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4 shrink-0" />
              <a href="mailto:info@hackxplore.com" className="hover:text-foreground transition-colors truncate">
                info@hackxplore.com
              </a>
            </li>
          </ul>
          <div className="mt-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Follow Us</p>
            <div className="flex gap-3">
              {[
                { Icon: Github, label: "GitHub" },
                { Icon: Linkedin, label: "LinkedIn" },
                { Icon: Instagram, label: "Instagram" },
              ].map(({ Icon, label }) => (
                <a key={label} href="#" className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-primary/10">
                  <Icon className="h-4 w-4" />
                  <span className="sr-only">{label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 mt-8 pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} HackXplore. All rights reserved.</p>
        <div className="flex gap-4">
          <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
