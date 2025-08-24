
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
  id: string; // Firestore document ID
  memberId: string;
  amount: number;
  date: string; // The date the payment was logged or became due
  paymentDate?: string; // The date it was actually paid, if different
  description: string;
  comment?: string;
  status: 'Paid' | 'Due';
  createdAt: any;
};

export type RegisteredMember = {
  id: string; // Firestore document ID
  uid: string; // Firebase Auth User ID
  name: string;
  email: string;
  phone: string;
  phoneVerified?: boolean;
  address: string;
  dob?: string;
  dateOfJoining: string;
  photoUrl?: string;
  imageHint?: string;
  role: 'admin' | 'member';
  createdAt: any;
  services?: string[];
};

export type Expenditure = {
  id: string;
  category: 'Maintenance' | 'Salaries' | 'Utilities' | 'Events' | 'Other';
  amount: number;
  description: string;
  date: string;
  createdAt: any;
};
