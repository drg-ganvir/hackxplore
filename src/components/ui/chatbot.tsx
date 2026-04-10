import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Send, X, Minimize2, Bot, Loader2, Maximize2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchLiveHackathons, fetchLiveInternships, fetchLiveScholarships } from "@/services/liveDataService";
import { HackathonCard, InternshipCard, Scholarship } from "@/types";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

// Cache fetched data so we don't re-fetch every message
let cachedHackathons: HackathonCard[] = [];
let cachedInternships: InternshipCard[] = [];
let cachedScholarships: Scholarship[] = [];
let dataLoaded = false;

async function loadData() {
  if (dataLoaded) return;
  try {
    const [h, i, s] = await Promise.all([
      fetchLiveHackathons(),
      fetchLiveInternships(),
      fetchLiveScholarships(),
    ]);
    cachedHackathons = h;
    cachedInternships = i;
    cachedScholarships = s;
    dataLoaded = true;
  } catch {
    dataLoaded = false;
  }
}

function generateResponse(query: string, user: any): string {
  const q = query.toLowerCase();

  // Hackathons
  if (q.includes("hackathon") || q.includes("hack") || q.includes("compete")) {
    const list = cachedHackathons.slice(0, 4);
    if (list.length > 0) {
      const items = list
        .map((h) => `• *${h.title}* by ${h.organizer}\n  📍 ${h.location} | 🗓 ${new Date(h.startDate).toLocaleDateString()} - ${new Date(h.endDate).toLocaleDateString()}${h.prizePool ? ` | 🏆 $${h.prizePool.toLocaleString()}` : ""}`)
        .join("\n\n");
      return `Here are some live hackathons right now:\n\n${items}\n\nVisit the Hackathons page to see all listings and filter by type!`;
    }
    return "Check out the Hackathons page for the latest listings — it fetches live data from Devpost!";
  }

  // Internships
  if (q.includes("internship") || q.includes("intern") || q.includes("job") || q.includes("work")) {
    const list = cachedInternships.slice(0, 4);
    if (list.length > 0) {
      const items = list
        .map((i) => `• *${i.title}* at ${i.company}\n  📍 ${i.location}${i.stipend ? ` | 💰 $${i.stipend}/mo` : ""}`)
        .join("\n\n");
      return `Here are some live internship opportunities:\n\n${items}\n\nHead to the Internships page to browse all listings and filter by skills!`;
    }
    return "Check out the Internships page — it shows real-time remote job listings!";
  }

  // Scholarships
  if (q.includes("scholarship") || q.includes("grant") || q.includes("funding") || q.includes("financial")) {
    const list = cachedScholarships
      .filter((s) => new Date(s.deadline) > new Date())
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 4);
    if (list.length > 0) {
      const items = list
        .map((s) => `• *${s.title}* — ${s.provider}\n  💵 $${s.amount.toLocaleString()} | ⏰ Deadline: ${new Date(s.deadline).toLocaleDateString()}`)
        .join("\n\n");
      return `Here are upcoming scholarships with approaching deadlines:\n\n${items}\n\nVisit the Scholarships page to apply and set deadline reminders!`;
    }
    return "Visit the Scholarships page to browse all current scholarship opportunities!";
  }

  // Team
  if (q.includes("team") || q.includes("teammate") || q.includes("partner")) {
    return "You can create or join a hackathon team by clicking **'Create Team'** on any hackathon card. Specify the skills you need and other participants can request to join your team. Manage your teams from your Profile page!";
  }

  // Profile / bookmarks
  if (q.includes("profile") || q.includes("bookmark") || q.includes("saved") || q.includes("account")) {
    return `You can manage your profile, view saved bookmarks, and check your hackathon teams on the **Profile page**. ${!user ? "You'll need to sign in first to access these features." : "Click your avatar in the top right to get there!"}`;
  }

  // Reminder
  if (q.includes("reminder") || q.includes("deadline") || q.includes("notify") || q.includes("alert")) {
    return "You can set deadline reminders by clicking the 🔔 **bell icon** on any internship or scholarship card. You'll find all your reminders in your Profile page!";
  }

  // About the platform
  if (q.includes("what is hackxplore") || q.includes("about") || q.includes("how does") || q.includes("help")) {
    return "**HackXplore** is your one-stop platform for:\n\n🏆 Live hackathons from Devpost\n💼 Real-time internships from Remotive\n🎓 Scholarships from top companies\n👥 Team formation for hackathons\n🔖 Bookmark & deadline reminders\n\nWhat would you like to explore?";
  }

  // Greeting
  if (q.includes("hi") || q.includes("hello") || q.includes("hey") || q.includes("hlo")) {
    return `Hey there! 👋 I'm the HackXplore assistant. I can help you find:\n\n🏆 Hackathons\n💼 Internships\n🎓 Scholarships\n👥 Team formation tips\n\nWhat are you looking for today?`;
  }

  // Fallback
  return "I can help you find **hackathons**, **internships**, or **scholarships**! You can also ask about creating teams, setting reminders, or managing your bookmarks. What would you like to know? 😊";
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Load live data when chatbot opens
  useEffect(() => {
    if (isOpen && !dataLoaded) {
      loadData().then(() => setDataReady(true));
    } else if (dataLoaded) {
      setDataReady(true);
    }
  }, [isOpen]);

  // Welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: "1",
        content: "👋 Hi! I'm your HackXplore assistant. Ask me about hackathons, internships, scholarships, or team formation!",
        sender: "bot",
        timestamp: new Date(),
      }]);
    }
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // If data not ready yet, wait briefly
    if (!dataLoaded) await loadData();

    setTimeout(() => {
      const response = generateResponse(input, user);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), content: response, sender: "bot", timestamp: new Date() },
      ]);
      setIsLoading(false);
    }, 600);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  // Quick suggestion chips
  const suggestions = ["Hackathons", "Internships", "Scholarships", "Create a team"];

  return (
    <>
      {/* Toggle button */}
      <Button
        onClick={() => { setIsOpen(!isOpen); setIsMinimized(false); }}
        className="fixed bottom-6 right-6 z-50 rounded-full h-14 w-14 shadow-xl gradient-button"
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat window */}
      {isOpen && (
        <Card className={`
          fixed z-50 shadow-2xl border border-primary/20 bg-card/98 backdrop-blur-md
          right-6 transition-all duration-300
          ${isMinimized
            ? "bottom-24 h-14 w-72"
            : "bottom-24 w-[92vw] sm:w-[380px] h-[520px] max-h-[80vh]"}
        `}>
          {/* Header */}
          <CardHeader className="px-4 py-3 border-b flex flex-row items-center justify-between space-y-0 shrink-0">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              HackXplore Assistant
              {dataReady && (
                <span className="text-xs font-normal text-green-500 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />
                  Live
                </span>
              )}
            </CardTitle>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsMinimized(!isMinimized)}>
                {isMinimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsOpen(false)}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardHeader>

          {!isMinimized && (
            <>
              {/* Messages */}
              <CardContent className="p-0 flex-1 overflow-hidden" style={{ height: "calc(100% - 110px)" }}>
                <ScrollArea className="h-full px-3 py-3">
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`flex items-end gap-2 max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                          {msg.sender === "bot" && (
                            <Avatar className="h-6 w-6 shrink-0">
                              <AvatarFallback className="bg-primary/20 text-primary text-xs">
                                <Bot className="h-3.5 w-3.5" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                            msg.sender === "user"
                              ? "bg-primary text-primary-foreground rounded-br-sm"
                              : "bg-muted text-foreground rounded-bl-sm"
                          }`}>
                            <div className="whitespace-pre-line break-words">{msg.content}</div>
                            <div className={`text-xs mt-1 opacity-60`}>
                              {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="flex items-end gap-2">
                          <Avatar className="h-6 w-6 shrink-0">
                            <AvatarFallback className="bg-primary/20 text-primary text-xs">
                              <Bot className="h-3.5 w-3.5" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="px-3 py-2 rounded-2xl rounded-bl-sm bg-muted flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Suggestion chips — show only at start */}
                  {messages.length === 1 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {suggestions.map((s) => (
                        <button
                          key={s}
                          onClick={() => { setInput(s); }}
                          className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>

              {/* Input */}
              <CardFooter className="p-3 border-t shrink-0">
                <div className="flex w-full items-center gap-2">
                  <Input
                    placeholder="Ask me anything..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    className="flex-1 text-sm h-9"
                    autoComplete="off"
                  />
                  <Button
                    size="icon"
                    className="h-9 w-9 gradient-button shrink-0"
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </>
          )}
        </Card>
      )}
    </>
  );
}
