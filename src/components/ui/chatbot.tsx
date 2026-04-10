
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Send, X, Maximize2, Minimize2, Bot, Loader2 } from "lucide-react";
import { hackathonsData, internshipsData, scholarshipsData } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

// Types for messages
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          content: "👋 Hi there! I'm your HackXplore assistant. I can help you with information about hackathons, internships, and scholarships. How can I assist you today?",
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    }
  }, [messages.length]);
  
  // Auto scroll to bottom of messages
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);
  
  const toggleChatbot = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
    }
  };
  
  const minimize = () => {
    setIsMinimized(true);
  };
  
  const maximize = () => {
    setIsMinimized(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      handleSendMessage();
    }
  };
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Generate bot response (simulated delay)
    setTimeout(() => {
      const response = generateResponse(input);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };
  
  const generateResponse = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    
    // Check if query is about hackathons
    if (
      lowercaseQuery.includes('hackathon') || 
      lowercaseQuery.includes('hack') ||
      lowercaseQuery.includes('team')
    ) {
      const upcomingHackathons = hackathonsData
        .filter(h => new Date(h.endDate) > new Date())
        .slice(0, 3);
      
      if (upcomingHackathons.length > 0) {
        return `Here are some upcoming hackathons you might be interested in:
        
${upcomingHackathons.map(h => `- ${h.title} by ${h.organizer} (${new Date(h.startDate).toLocaleDateString()} to ${new Date(h.endDate).toLocaleDateString()})${h.prizePool ? ` - Prize pool: $${h.prizePool.toLocaleString()}` : ''}`).join('\n')}

You can view all hackathons on the Hackathons page. Would you like to know more about any of these?`;
      } else {
        return "I don't have information about upcoming hackathons at the moment. Please check the Hackathons page for the latest listings.";
      }
    }
    
    // Check if query is about internships
    if (
      lowercaseQuery.includes('internship') || 
      lowercaseQuery.includes('intern') ||
      lowercaseQuery.includes('job')
    ) {
      const recentInternships = internshipsData
        .slice(0, 3);
      
      if (recentInternships.length > 0) {
        return `Here are some internship opportunities that might interest you:
        
${recentInternships.map(i => `- ${i.title} at ${i.company} (${i.location})${i.stipend ? ` - Stipend: $${i.stipend}` : ''}`).join('\n')}

You can explore all internships on the Internships page. Would you like more details about any of these?`;
      } else {
        return "I don't have information about internships at the moment. Please check the Internships page for the latest listings.";
      }
    }
    
    // Check if query is about scholarships
    if (
      lowercaseQuery.includes('scholarship') || 
      lowercaseQuery.includes('grant') ||
      lowercaseQuery.includes('fund') ||
      lowercaseQuery.includes('financial aid')
    ) {
      const upcomingScholarships = scholarshipsData
        .filter(s => new Date(s.deadline) > new Date())
        .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
        .slice(0, 3);
      
      if (upcomingScholarships.length > 0) {
        return `Here are some upcoming scholarship opportunities:
        
${upcomingScholarships.map(s => `- ${s.title} by ${s.provider} (Deadline: ${new Date(s.deadline).toLocaleDateString()}) - Amount: $${s.amount.toLocaleString()}`).join('\n')}

Visit the Scholarships page to explore all opportunities. Would you like more information about any of these?`;
      } else {
        return "I don't have information about current scholarships. Please check the Scholarships page for the latest listings.";
      }
    }
    
    // Check if query is about profile or account
    if (
      lowercaseQuery.includes('profile') || 
      lowercaseQuery.includes('account') ||
      lowercaseQuery.includes('my bookmarks') ||
      lowercaseQuery.includes('settings')
    ) {
      return `You can manage your profile, view your bookmarks, and check your team memberships by visiting the Profile page. ${!user ? "You'll need to log in first to access these features." : ""}`;
    }
    
    // Check if query is about reminders
    if (
      lowercaseQuery.includes('reminder') || 
      lowercaseQuery.includes('notify') ||
      lowercaseQuery.includes('alert')
    ) {
      return "You can set reminders for hackathon deadlines, internship applications, and scholarship deadlines. Look for the 'Set Reminder' button on each card or detail page. Reminders will be shown in your profile.";
    }
    
    // Check if query is about creating or joining teams
    if (
      lowercaseQuery.includes('create team') || 
      lowercaseQuery.includes('join team') ||
      lowercaseQuery.includes('find teammates')
    ) {
      return "You can create or join teams for hackathons by clicking on the 'Create Team' or 'Join Team' buttons on the hackathon cards. When creating a team, you can specify the skills you're looking for. You can manage your teams from your profile page.";
    }
    
    // General inquiry about the platform
    if (
      lowercaseQuery.includes('what is') || 
      lowercaseQuery.includes('how does') ||
      lowercaseQuery.includes('about platform')
    ) {
      return "HackXplore is a centralized platform where you can discover hackathons, internships, and scholarships all in one place. You can bookmark opportunities, set reminders for deadlines, create or join hackathon teams, and more. Is there something specific you'd like to know about?";
    }
    
    // Fallback response
    return "I'm not sure I understand. Could you rephrase your question? I can help with information about hackathons, internships, scholarships, team formation, or how to use the platform.";
  };
  
  return (
    <>
      {/* Chat button */}
      <Button
        onClick={toggleChatbot}
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg gradient-button animate-pulse-slow"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat window */}
      {isOpen && (
        <Card
          className={`
            fixed z-50 shadow-xl border border-primary/20 bg-card/95 backdrop-blur-sm
            transition-all duration-300 ease-in-out
            ${isMinimized 
              ? 'bottom-24 right-6 h-16 w-80' 
              : 'bottom-24 right-6 max-w-md w-[90vw] md:w-[400px] h-[500px] max-h-[80vh]'
            }
          `}
        >
          {isMinimized ? (
            <div className="flex items-center justify-between h-full px-4">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-primary" />
                <span className="font-medium">HackXplore Assistant</span>
              </div>
              <Button variant="ghost" size="icon" onClick={maximize}>
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <CardHeader className="px-4 py-3 border-b flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-md font-medium flex items-center">
                  <Bot className="h-5 w-5 text-primary mr-2" />
                  HackXplore Assistant
                </CardTitle>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="icon" onClick={minimize}>
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0 flex flex-col h-[calc(100%-110px)]">
                <ScrollArea 
                  className="h-full py-4 px-4" 
                  ref={scrollAreaRef as React.RefObject<HTMLDivElement>}
                >
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`
                          flex items-start space-x-2 max-w-[80%]
                          ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}
                        `}>
                          {message.sender === 'bot' && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/bot-avatar.png" />
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                <Bot className="h-5 w-5" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          
                          <div className={`
                            py-2 px-3 rounded-lg
                            ${message.sender === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'}
                          `}>
                            <div className="whitespace-pre-line break-words text-sm">
                              {message.content}
                            </div>
                            <div className={`
                              text-xs mt-1 
                              ${message.sender === 'user' 
                                ? 'text-primary-foreground/70' 
                                : 'text-muted-foreground'}
                            `}>
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="flex items-start space-x-2 max-w-[80%]">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              <Bot className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="py-3 px-4 rounded-lg bg-muted flex items-center">
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            <span className="ml-2 text-xs text-muted-foreground">Thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>

              <CardFooter className="p-3 pt-2 border-t">
                <div className="flex w-full items-center space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    className="flex-1"
                  />
                  <Button 
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading}
                    className="gradient-button"
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
