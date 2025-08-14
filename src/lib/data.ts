
import type { Event, Service, Facility, TeamMember, HistoryItem } from './types';

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
    title: 'New Year Celebration',
    date: '2024-12-31',
    description:
      'Dance 8:30 pm onwards No Entry after 10:30pm',
    image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=80&w=1920&auto=format=fit=crop',
    imageHint: 'new year party',
  },
  {
    title: 'Annual Tennis Tournament',
    date: '2024-08-15',
    description:
      'Join our most anticipated tennis event of the year. All skill levels welcome.',
    image: 'https://images.unsplash.com/photo-1543310728-76cf54c45ac1?q=80&w=600&auto=format=fit=crop',
    imageHint: 'tennis match',
  },
  {
    title: 'Swimming Gala',
    date: '2024-09-05',
    description:
      'A fun-filled day of swimming competitions for all age groups. Prizes to be won!',
    image: 'https://images.unsplash.com/photo-1559437655-274a0c57504f?q=80&w=600&auto=format=fit=crop',
    imageHint: 'swimming competition',
  },
  {
    title: 'Club Marathon',
    date: '2024-10-20',
    description:
      'Challenge yourself in our annual 10k club marathon. A test of endurance and spirit.',
    image: 'https://images.unsplash.com/photo-1512428208326-813539b5a755?q=80&w=600&auto=format=fit=crop',
    imageHint: 'running marathon',
  },
   {
    title: 'Youth Soccer Camp',
    date: '2024-07-22',
    description:
      'A week-long soccer camp for kids aged 8-14. Coached by certified professionals.',
    image: 'https://images.unsplash.com/photo-1551957442-f53835a4b9e2?q=80&w=600&auto=format=fit=crop',
    imageHint: 'soccer kids',
  },
];

export const services: Service[] = [
  {
    title: 'Sports',
    description: 'We provides all the sports and activities in our club.',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600&auto=format=fit=crop',
    imageHint: 'multiple sports',
  },
  {
    title: 'Kids Zone',
    description:
      'We have largest garden in the locality with kids play area.',
    image: 'https://images.unsplash.com/photo-1551009175-8a68da93d5f9?q=80&w=600&auto=format=fit=crop',
    imageHint: 'kids playground',
  },
  {
    title: 'Restaurant',
    description: 'The best and choicest cuisine in our Restaurant.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format=fit=crop',
    imageHint: 'elegant restaurant',
  },
  {
    title: 'Bar',
    description: 'We serve best beverages in our bar for our',
    image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=600&auto=format=fit=crop',
    imageHint: 'modern bar',
  },
];

export const facilities: Facility[] = [
  {
    name: 'Snooker',
    description: 'We feel proud that the game SNOOKER, founded by British General About 320 years...',
    image: 'https://images.unsplash.com/photo-1608283483323-e4d3a84033e4?q=80&w=600&auto=format=fit=crop',
    imageHint: 'snooker table',
  },
  {
    name: 'Lawn Tennis',
    description: 'Club provides two types of Tennis Court to the members according to their interest.',
    image: 'https://images.unsplash.com/photo-1559526324-c1f275fbfa32?q=80&w=600&auto=format=fit=crop',
    imageHint: 'tennis court',
  },
  {
    name: 'Card Room',
    description: 'This section is also functioning well and a large number of members and their wives take part.',
    image: 'https://images.unsplash.com/photo-1521992453696-6d65a6a6a4f8?q=80&w=600&auto=format=fit=crop',
    imageHint: 'playing cards',
  },
  {
    name: 'Badminton',
    description: 'Club has recently renewed Badminton Court where Members and their dependents can enjoy.',
    image: 'https://images.unsplash.com/photo-1594464528388-e3215f94a0a5?q=80&w=600&auto=format=fit=crop',
    imageHint: 'badminton action',
  },
   {
    name: 'Health Club',
    description: 'This section is also functioning well and a large number of members and their wives take part.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format=fit=crop',
    imageHint: 'modern gym',
  },
  {
    name: 'Bar',
    description: 'A well-stacked bar serving a large number of brands as per the requirements of the Members.',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=600&auto=format=fit=crop',
    imageHint: 'cocktail bar',
  },
];

export const team: TeamMember[] = [
  {
    name: 'John Doe',
    role: 'Club President',
    bio: 'Leading the club with passion and vision for over a decade.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format=fit=crop',
    imageHint: 'male portrait',
  },
  {
    name: 'Jane Smith',
    role: 'Head of Sports',
    bio: 'A former professional athlete dedicated to nurturing talent at all levels.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format=fit=crop',
    imageHint: 'female portrait',
  },
  {
    name: 'Mike Johnson',
    role: 'Facilities Manager',
    bio: 'Ensuring our facilities are state-of-the-art and always ready for our members.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format=fit=crop',
    imageHint: 'professional man',
  },
  {
    name: 'Emily Davis',
    role: 'Member Relations',
    bio: 'The friendly face of Vindhya Club, always here to help our members.',
    image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=400&auto=format=fit=crop',
    imageHint: 'friendly woman',
  },
];

export const history: HistoryItem[] = [
  {
    year: '1904-1905',
    description: 'The year the club was founded, laying the groundwork for a century of sport.',
    image: 'https://images.unsplash.com/photo-1562796242-7041935543b5?q=80&w=600&auto=format=fit=crop',
    imageHint: 'vintage clubhouse',
  },
  {
    year: '1906',
    description: 'Construction of our first clubhouse, a landmark for the community.',
    image: 'https://images.unsplash.com/photo-1574366660429-150a7c4e2439?q=80&w=600&auto=format=fit=crop',
    imageHint: 'old building construction',
  },
  {
    year: '1960',
    description: 'Hosted the first national-level tennis tournament, putting us on the map.',
    image: 'https://images.unsplash.com/photo-1495433324223-1a239b970634?q=80&w=600&auto=format=fit=crop',
    imageHint: 'grand hotel',
  },
   {
    year: 'Present',
    description: 'Continuing our legacy with state-of-the-art facilities and a thriving community.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format=fit=crop',
    imageHint: 'modern resort',
  },
];
