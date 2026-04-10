export type HackathonType =
  | "Open"
  | "Themed"
  | "Beginner-Friendly"
  | "AI/ML"
  | "Web3"
  | "Mobile"
  | "Hardware"
  | "Web Development"
  | "Cloud Computing"
  | "EdTech"
  | "HealthTech"
  | "Sustainable Development"
  | "Blockchain"
  | "Game Development"
  | "IoT"
  | "Robotics"
  | "AR/VR"
  | "Web Development"
  | "Mobile Development"
  | "Data Science"
  | "Machine Learning"
  | "Artificial Intelligence"
  | "Cybersecurity"
  | "Cloud Computing"
  | "DevOps"
  | "Blockchain"
  | "UI/UX Design"
  | "Game Development"
  | "Robotics"
  | "IoT"
  | "AR/VR"
  | "Full Stack Development";

export interface HackathonCard {
  id: string;
  title: string;
  organizer: string;
  startDate: string;
  endDate: string;
  location: string;
  mode: "In-person" | "Online" | "Hybrid";
  prizePool?: number;
  tags: string[];
  applicationDeadline: string;
  url: string;
  image: string;
  isPopular: boolean;
  type: HackathonType | HackathonType[];
  description?: string;
  skills?: UserSkill[]; // Add skills property for recommendations
}

export interface InternshipCard {
  id: string;
  title: string;
  company: string;
  location: string;
  imageUrl: string;
  isRemote: boolean;
  stipend?: number;
  duration: string;
  skills: string[];
  postedDate?: string;
  applicationDeadline: string;
  type: string;
  companySize?: "Startup" | "Small" | "Medium" | "Large";
  description: string;
  onViewDetails?: () => void;
  onApply?: () => void;
  url: string;
  logo: string;
  requiredSkills: string[];
}

export type UserSkill =
  | "JavaScript"
  | "Python"
  | "Java"
  | "C++"
  | "C#"
  | "TypeScript"
  | "React"
  | "Angular"
  | "Vue.js"
  | "Node.js"
  | "Express.js"
  | "Django"
  | "Flask"
  | "Ruby on Rails"
  | "SQL"
  | "NoSQL"
  | "MongoDB"
  | "PostgreSQL"
  | "MySQL"
  | "AWS"
  | "Azure"
  | "Google Cloud"
  | "Docker"
  | "Kubernetes"
  | "Git"
  | "HTML"
  | "CSS"
  | "Sass"
  | "Less"
  | "UI/UX Design"
  | "Figma"
  | "Sketch"
  | "Adobe XD"
  | "Machine Learning"
  | "Deep Learning"
  | "Data Science"
  | "Data Analysis"
  | "Cybersecurity"
  | "Network Security"
  | "Cryptography"
  | "Penetration Testing"
  | "Blockchain"
  | "Web3"
  | "AR/VR"
  | "IoT"
  | "Robotics"
  | "Game Development"
  | "Mobile Development"
  | "Swift"
  | "Kotlin"
  | "React Native"
  | "Flutter"
  | "TensorFlow"
  | "Unity"
  | "Solidity"
  | "Web3"
  | "Tableau"
  | "Data Analysis"
  | "Network Security";

export interface User {
  id: string;
  email: string;
}

export interface UserProfile {
  id?: string;
  userId: string;
  name?: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  skills?: UserSkill[];
  interests?: HackathonType[];
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  preferredRole?: string;
  lookingFor?: 'hackathons' | 'internships' | 'both';
}

export interface Team {
  id: string;
  hackathonId: string;
  name: string;
  description: string;
  leaderId: string;
  members: string[];
  skillsNeeded: UserSkill[];
  maxMembers: number;
  isOpen: boolean;
  createdAt: string;
  updatedAt: string;
  creator?: {
    name: string;
    avatar: string;
  };
}

export interface TeamJoinRequest {
  id: string;
  teamId: string;
  userId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export type ScholarshipType = 
  | "Merit-based"
  | "Need-based"
  | "Research"
  | "STEM"
  | "Diversity"
  | "International"
  | "Athletic"
  | "Community Service"
  | "Creative Arts";

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  amount: number;
  deadline: string;
  type: ScholarshipType;
  eligibility: string[];
  link?: string;
  description?: string;
}

export interface ReminderItem {
  id: string;
  userId: string;
  title: string;
  date: string;
  type: "hackathon" | "internship" | "scholarship";
  notified: boolean;
  createdAt: string;
}

export interface PartnerLogo {
  name: string;
  logo: string;
  url: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  text: string;
  company?: string; // Added for compatibility
  image?: string; // Added for compatibility
}

export interface TeamCardProps {
  team: Team;
  isUserTeamMember?: boolean;
  hackathonId?: string;
  hasJoinRequest?: boolean;
  isDetailed?: boolean;
  showActions?: boolean;
  onDelete?: () => Promise<void>;
}

export interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventName?: string;
  eventDate?: Date;
  eventType?: string;
  type?: string;
  date?: Date;
  title?: string;
}

export interface TeamServiceProps {
  createTeam: (teamData: Omit<Team, "id" | "isOpen" | "members" | "createdAt" | "updatedAt" | "leaderId">) => Promise<{
    success: boolean;
    error: string;
    data?: any;
  } | {
    success: boolean;
    data: any;
    error?: undefined;
  }>;
  sendJoinRequest: (teamId: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  useHackathonTeams: (hackathonId: string) => any;
  useUserSentRequests: () => any;
  joinTeam: (teamId: string) => Promise<{ success: boolean; error?: string }>;
  leaveTeam: (teamId: string) => Promise<{ success: boolean; error?: string }>;
  isUserInTeam: (teamId: string) => boolean;
}

export interface HackathonCardProps {
  id: string;
  title: string;
  organizer: string;
  location: string;
  url: string;
  imageUrl: string;
  type: HackathonType | HackathonType[];
  prizePool?: string;
  mode: "online" | "in-person" | "hybrid";
  dates: string;
  description?: string;
  onViewDetails?: () => void;
  onFormTeam?: () => void;
  isDetailed?: boolean;
}

export interface InternshipCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  imageUrl: string;
  isRemote: boolean;
  stipend?: number;
  duration: string;
  skills: string[];
  postedDate?: string;
  applicationDeadline: string;
  type: string;
  companySize?: "Startup" | "Small" | "Medium" | "Large";
  description: string;
  onViewDetails?: () => void;
  onApply?: () => void;
  url?: string;
}
