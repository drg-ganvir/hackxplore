
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { UserProfile, User, UserSkill, HackathonType } from '@/types';

// Auth Context Types
type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  signUp: (email: string, password: string) => Promise<{ user?: User; error?: { message: string } }>;
  signIn: (email: string, password: string) => Promise<{ user?: User; error?: { message: string } }>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<{ success?: boolean; error?: { message: string } }>;
  isLoading: boolean;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// API base URL - should match your backend
const API_URL = 'http://localhost:3001/api';

// Auth Modal Props
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: 'login' | 'signup';
}

// Provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Simulate fetching user data
        const mockUser = localStorage.getItem('mockUser');
        
        if (mockUser) {
          const userData = JSON.parse(mockUser);
          setUser(userData);
          
          // Also fetch user profile
          const mockProfile = localStorage.getItem('mockProfile');
          if (mockProfile) {
            setProfile(JSON.parse(mockProfile));
          }
        }
      } catch (error) {
        console.error("Auth status check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Sign up function
  const signUp = async (email: string, password: string) => {
    try {
      console.log(`Signing up user with email: ${email}`);
      
      // Create a mock user for demo purposes
      const newUser = {
        id: `user-${Date.now()}`,
        email
      };
      
      // Store in localStorage for persistence
      localStorage.setItem('mockUser', JSON.stringify(newUser));
      
      // Set user in state
      setUser(newUser);
      
      return { user: newUser };
    } catch (error) {
      console.error("Sign up error:", error);
      return { error: { message: "Error creating account" } };
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      console.log(`Signing in user with email: ${email}`);
      
      // Create a mock user for demo purposes
      const mockUser = {
        id: `user-${Date.now()}`,
        email
      };
      
      // Store in localStorage for persistence
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      
      // Set user in state
      setUser(mockUser);
      
      // Create a mock profile if it doesn't exist
      const existingProfile = localStorage.getItem('mockProfile');
      if (!existingProfile) {
        const defaultProfile: UserProfile = {
          userId: mockUser.id,
          name: email.split('@')[0],
          skills: ["TypeScript", "React", "CSS"] as UserSkill[],
          interests: ["Web Development", "AI/ML"] as HackathonType[],
          lookingFor: 'both',
          preferredRole: 'Frontend Developer',
          bio: 'Passionate about web development and learning new technologies'
        };
        
        localStorage.setItem('mockProfile', JSON.stringify(defaultProfile));
        setProfile(defaultProfile);
      } else {
        setProfile(JSON.parse(existingProfile));
      }
      
      return { user: mockUser };
    } catch (error) {
      console.error("Sign in error:", error);
      return { error: { message: "Invalid credentials" } };
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      // Clear local storage
      localStorage.removeItem('mockUser');
      
      // Clear state
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Update profile function
  const updateProfile = async (profileData: Partial<UserProfile>) => {
    try {
      console.log("Updating profile with data:", profileData);
      
      // For demo, just store in localStorage
      const updatedProfile = { ...profile, ...profileData };
      localStorage.setItem('mockProfile', JSON.stringify(updatedProfile));
      
      // Update local state
      setProfile(updatedProfile as UserProfile);
      
      return { success: true };
    } catch (error) {
      console.error("Profile update error:", error);
      return { error: { message: "Failed to update profile" } };
    }
  };

  // Create context value
  const value = {
    user,
    profile,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Auth Modal component
export function AuthModal({ isOpen, onClose, defaultView = 'login' }: AuthModalProps) {
  const [view, setView] = useState<'login' | 'signup'>(defaultView);
  
  const handleSuccess = () => {
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {view === 'login' ? 'Welcome Back' : 'Create Your Account'}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={view} onValueChange={(value) => setView(value as 'login' | 'signup')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Log In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm 
              onSwitchToSignUp={() => setView('signup')} 
              onSuccess={handleSuccess} 
            />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignUpForm 
              setView={setView}
              onSuccess={handleSuccess} 
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
