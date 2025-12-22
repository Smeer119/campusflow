
export interface User {
  id: string;
  name: string;
  email: string;
  photoURL: string;
  collegeId: string;
  joinedEvents: string[];
  echoCount: number;
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  banner: string;
  isExternal: boolean;
  attendees: string[];
}

export interface ConnectProfile {
  id: string;
  name: string;
  type: 'Student' | 'Alumni';
  stream: string;
  year: string;
  interests: string[];
  location: { x: number, y: number };
  avatar: string;
  bg: string;
  currentRole?: string; // e.g., "Software Engineer at Google"
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  isPlanPrompt?: boolean;
}

export interface StudyPlanItem {
  id: string;
  subject: string;
  time: string;
  tasks: string[];
  difficulty: number;
}

// Added missing EchoComment interface to support Echo reporting feed
export interface EchoComment {
  id: string;
  text: string;
  user: string;
  time: string;
}

// Added missing EchoPost interface to support Echo reporting feed
export interface EchoPost {
  id: string;
  title: string;
  content: string;
  status: 'Investigating' | 'Resolved' | 'Pending';
  likes: number;
  comments: number;
  flags: number;
  createdAt: string;
  authorId: string;
  imageUrl?: string;
  commentsList: EchoComment[];
}
