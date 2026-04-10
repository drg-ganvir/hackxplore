import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, BookmarkIcon, UserIcon, LogOut, Menu, Home, Sun, Moon } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const [search, setSearch] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<"login" | "signup">("login");
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      const path = location.pathname.includes("intern") ? "/internships" : "/hackathons";
      navigate(`${path}?search=${encodeURIComponent(search.trim())}`);
    }
  };

  const openLogin = () => { setAuthModalView("login"); setIsAuthModalOpen(true); };
  const openSignup = () => { setAuthModalView("signup"); setIsAuthModalOpen(true); };
  const handleSignOut = async () => { await signOut(); navigate("/"); };
  const isActive = (path: string) => location.pathname === path;

  const ThemeToggle = () => (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full hover:bg-primary/10 hover:text-primary w-9 h-9 shrink-0"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark"
        ? <Sun className="h-4 w-4 text-yellow-400" />
        : <Moon className="h-4 w-4 text-indigo-500" />}
    </Button>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between gap-2">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
            HackXplore
          </span>
        </Link>

        {/* Desktop nav + search */}
        <div className="hidden md:flex items-center gap-3 flex-1 mx-2">
          <nav className="flex items-center gap-1 shrink-0">
            {[
              { path: "/", label: "Home", icon: <Home className="mr-1.5 h-4 w-4" /> },
              { path: "/hackathons", label: "Hackathons" },
              { path: "/internships", label: "Internships" },
              { path: "/scholarships", label: "Scholarships" },
            ].map(({ path, label, icon }) => (
              <Link to={path} key={path}>
                <Button
                  variant={isActive(path) ? "default" : "ghost"}
                  size="sm"
                  className={isActive(path) ? "gradient-button" : "hover:bg-primary/10 hover:text-primary"}
                >
                  {icon}{label}
                </Button>
              </Link>
            ))}
          </nav>

          <form onSubmit={handleSearch} className="relative flex-1 max-w-xs lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search hackathons, internships..."
              className="w-full pl-9 bg-muted/50 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>

        {/* Desktop right actions */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={profile?.avatarUrl} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {profile?.name ? profile.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 bg-card/95 backdrop-blur-md border-primary/20">
                <div className="flex items-center p-2">
                  <div className="flex flex-col leading-none">
                    {profile?.name && <p className="font-medium text-sm">{profile.name}</p>}
                    {user.email && <p className="w-[180px] truncate text-xs text-muted-foreground">{user.email}</p>}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                  <UserIcon className="mr-2 h-4 w-4" /><span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/bookmarks")} className="cursor-pointer">
                  <BookmarkIcon className="mr-2 h-4 w-4" /><span>Bookmarks</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" /><span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={openLogin} className="hover:bg-primary/10 hover:text-primary">Sign In</Button>
              <Button size="sm" onClick={openSignup} className="gradient-button">Sign Up</Button>
            </div>
          )}
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col bg-background/95 backdrop-blur-md w-72">
              <div className="flex flex-col gap-3 mt-6">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type="search" placeholder="Search..." className="pl-9 w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
                </form>

                {[
                  { path: "/", label: "Home" },
                  { path: "/hackathons", label: "Hackathons" },
                  { path: "/internships", label: "Internships" },
                  { path: "/scholarships", label: "Scholarships" },
                ].map(({ path, label }) => (
                  <Link to={path} key={path}>
                    <Button variant={isActive(path) ? "default" : "ghost"} className={`w-full justify-start ${isActive(path) ? "gradient-button" : ""}`}>
                      {label}
                    </Button>
                  </Link>
                ))}

                <div className="border-t pt-3 mt-1">
                  {user ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3 px-2 py-1">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={profile?.avatarUrl} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {profile?.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          {profile?.name && <p className="font-medium text-sm truncate">{profile.name}</p>}
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                      <Link to="/profile"><Button variant="ghost" className="w-full justify-start"><UserIcon className="mr-2 h-4 w-4" />Profile</Button></Link>
                      <Link to="/bookmarks"><Button variant="ghost" className="w-full justify-start"><BookmarkIcon className="mr-2 h-4 w-4" />Bookmarks</Button></Link>
                      <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />Sign out
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button onClick={openLogin} variant="outline" className="w-full">Sign In</Button>
                      <Button onClick={openSignup} className="w-full gradient-button">Sign Up</Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} defaultView={authModalView} />
    </header>
  );
}
