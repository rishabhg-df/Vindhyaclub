
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
  imageUrl?: string; 
  imageHint?: string;
};

export type Facility = {
  name: string;
  description: string;
  image: string;
  imageHint: string;
  fee: number;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  imageHint: string;
  createdAt: any;
};

export type HistoryItem = {
  year: string;
  description: string;
  image: string;
  imageHint: string;
};

export type Payment = {
  id: string;
  amount: number;
  date: string;
  description: string;
  status: 'Paid' | 'Due';
};

export type RegisteredMember = {
  id: string; // Firestore document ID
  uid: string; // Firebase Auth User ID
  name: string;
  email: string;
  phone: string;
  address: string;
  dob?: string;
  dateOfJoining: string;
  photoUrl?: string;
  imageHint?: string;
  role: 'admin' | 'member';
  createdAt: any;
  services?: string[];
  payments?: Payment[];
};

export type Expenditure = {
  id: string;
  category: 'Maintenance' | 'Salaries' | 'Utilities' | 'Events' | 'Other';
  amount: number;
  description: string;
  date: string;
  createdAt: any;
};
