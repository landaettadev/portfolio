export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tech: string[];
  demoUrl: string;
  githubUrl: string;
  featured: boolean;
}

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  showWhatsAppButton?: boolean;
}

export interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speed: number;
  animationOffset: number;
}

export interface Position {
  intern: string;
  fullstack: string;
  freelance: string;
  analyst: string;
  junior: string;
  trainee: string;
}

export type StackCategory = 'all' | 'frontend' | 'backend' | 'database' | 'tools';
