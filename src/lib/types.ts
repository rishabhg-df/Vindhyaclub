
import type { LucideIcon } from 'lucide-react';

export type NavLink = {
  href: string;
  label: string;
};

export type Event = {
  id: string;
  title: string;
  date: string;
  entryTime?: string;
  description: string;
  imageUrl?: string; // Changed from image to imageUrl to align with new context
  imageHint?: string; // Kept for now, but should be phased out
};

export type Facility = {
  name: string;
  description: string;
  image: string;
  imageHint: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  imageHint: string;
};

export type HistoryItem = {
  year: string;
  description: string;
  image: string;
  imageHint: string;
};
