import type { LucideIcon } from 'lucide-react';

export type NavLink = {
  href: string;
  label: string;
};

export type Event = {
  title: string;
  date: string;
  description: string;
  image: string;
  imageHint: string;
};

export type Service = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type Facility = {
  name: string;
  image: string;
  imageHint: string;
};

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  image: string;
  imageHint: string;
};
