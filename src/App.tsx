import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Hackathons from "./pages/Hackathons";
import HackathonDetail from "./pages/HackathonDetail";
import Internships from "./pages/Internships";
import InternshipDetail from "./pages/InternshipDetail";
import Scholarships from "./pages/Scholarships";
import ScholarshipDetail from "./pages/ScholarshipDetail";
import Profile from "./pages/Profile";
import Bookmarks from "./pages/Bookmarks";
import NotFound from "./pages/NotFound";
import { Chatbot } from "./components/ui/chatbot";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/hackathons" element={<Hackathons />} />
              <Route path="/hackathons/:id" element={<HackathonDetail />} />
              <Route path="/internships" element={<Internships />} />
              <Route path="/internships/:id" element={<InternshipDetail />} />
              <Route path="/scholarships" element={<Scholarships />} />
              <Route path="/scholarships/:id" element={<ScholarshipDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Chatbot />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
