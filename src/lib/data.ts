import { Dumbbell, Swords, Trophy, Users } from 'lucide-react';
import type { Event, Service, Facility, TeamMember } from './types';

export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/events', label: 'Events' },
  { href: '/services', label: 'Services' },
  { href: '/facilities', label: 'Facilities' },
  { href: '/contact', label: 'Contact' },
];

export const events: Event[] = [
  {
    title: 'Annual Tennis Tournament',
    date: '2024-08-15',
    description:
      'Join our most anticipated tennis event of the year. All skill levels welcome.',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'tennis match',
  },
  {
    title: 'Swimming Gala',
    date: '2024-09-05',
    description:
      'A fun-filled day of swimming competitions for all age groups. Prizes to be won!',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'swimming pool',
  },
  {
    title: 'Club Marathon',
    date: '2024-10-20',
    description:
      'Challenge yourself in our annual 10k club marathon. A test of endurance and spirit.',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'running marathon',
  },
   {
    title: 'Youth Soccer Camp',
    date: '2024-07-22',
    description:
      'A week-long soccer camp for kids aged 8-14. Coached by certified professionals.',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'soccer kids',
  },
];

export const services: Service[] = [
  {
    title: 'Personal Training',
    description:
      'Get one-on-one guidance from our certified personal trainers to achieve your fitness goals.',
    icon: Dumbbell,
  },
  {
    title: 'Group Classes',
    description:
      'Join our dynamic group classes, from yoga to HIIT, suitable for all fitness levels.',
    icon: Users,
  },
  {
    title: 'Sports Coaching',
    description:
      'Improve your skills in tennis, swimming, and more with our expert coaches.',
    icon: Trophy,
  },
  {
    title: 'Fencing Lessons',
    description:
      'Learn the art of fencing with our experienced instructors. Equipment provided.',
    icon: Swords,
  },
];

export const facilities: Facility[] = [
  {
    name: 'Olympic Size Pool',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'olympic pool',
  },
  {
    name: 'Tennis Courts',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'tennis court',
  },
  {
    name: 'Fully-Equipped Gym',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'modern gym',
  },
  {
    name: 'Indoor Soccer Field',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'indoor soccer',
  },
];

export const team: TeamMember[] = [
  {
    name: 'John Doe',
    role: 'Club President',
    bio: 'Leading the club with passion and vision for over a decade.',
    image: 'https://placehold.co/400x400.png',
    imageHint: 'male portrait',
  },
  {
    name: 'Jane Smith',
    role: 'Head of Sports',
    bio: 'A former professional athlete dedicated to nurturing talent at all levels.',
    image: 'https://placehold.co/400x400.png',
    imageHint: 'female portrait',
  },
  {
    name: 'Mike Johnson',
    role: 'Facilities Manager',
    bio: 'Ensuring our facilities are state-of-the-art and always ready for our members.',
    image: 'https://placehold.co/400x400.png',
    imageHint: 'professional man',
  },
  {
    name: 'Emily Davis',
    role: 'Member Relations',
    bio: 'The friendly face of Vindhya Club, always here to help our members.',
    image: 'https://placehold.co/400x400.png',
    imageHint: 'friendly woman',
  },
];
