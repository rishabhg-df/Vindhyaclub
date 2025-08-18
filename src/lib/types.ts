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
  image: string;
  imageHint: string;
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
