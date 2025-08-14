
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
    image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=1920',
    imageHint: 'new year party',
  },
  {
    title: 'Annual Tennis Tournament',
    date: '2024-08-15',
    description:
      'Join our most anticipated tennis event of the year. All skill levels welcome.',
    image: 'https://images.unsplash.com/photo-1543310728-76cf54c45ac1?w=600',
    imageHint: 'tennis match',
  },
  {
    title: 'Swimming Gala',
    date: '2024-09-05',
    description:
      'A fun-filled day of swimming competitions for all age groups. Prizes to be won!',
    image: 'https://images.unsplash.com/photo-1559437655-274a0c57504f?w=600',
    imageHint: 'swimming competition',
  },
  {
    title: 'Club Marathon',
    date: '2024-10-20',
    description:
      'Challenge yourself in our annual 10k club marathon. A test of endurance and spirit.',
    image: 'https://images.unsplash.com/photo-1512428208326-813539b5a755?w=600',
    imageHint: 'running marathon',
  },
   {
    title: 'Youth Soccer Camp',
    date: '2024-07-22',
    description:
      'A week-long soccer camp for kids aged 8-14. Coached by certified professionals.',
    image: 'https://images.unsplash.com/photo-1551957442-f53835a4b9e2?w=600',
    imageHint: 'soccer kids',
  },
];

export const services: Service[] = [
  {
    title: 'Sports',
    description: 'We provides all the sports and activities in our club.',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600',
    imageHint: 'multiple sports',
  },
  {
    title: 'Kids Zone',
    description:
      'We have largest garden in the locality with kids play area.',
    image: 'https://images.unsplash.com/photo-1551009175-8a68da93d5f9?w=600',
    imageHint: 'kids playground',
  },
  {
    title: 'Restaurant',
    description: 'The best and choicest cuisine in our Restaurant.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600',
    imageHint: 'elegant restaurant',
  },
  {
    title: 'Bar',
    description: 'We serve best beverages in our bar for our',
    image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600',
    imageHint: 'modern bar',
  },
];

export const facilities: Facility[] = [
  {
    name: 'Snooker',
    description: 'We feel proud that the game SNOOKER, founded by British General About 320 years...',
    image: 'https://images.unsplash.com/photo-1589405858862-2ac9cbb41321?w=600',
    imageHint: 'snooker table',
  },
  {
    name: 'Lawn Tennis',
    description: 'Club provides two types of Tennis Court to the members according to their interest.',
    image: 'https://images.unsplash.com/photo-1559526324-c1f275fbfa32?w=600',
    imageHint: 'tennis court',
  },
  {
    name: 'Card Room',
    description: 'This section is also functioning well and a large number of members and their wives take part.',
    image: 'https://images.unsplash.com/photo-1552549293-a5895e865427',
    imageHint: 'playing cards',
  },
  {
    name: 'Badminton',
    description: 'Club has recently renewed Badminton Court where Members and their dependents can enjoy.',
    image: 'https://images.unsplash.com/photo-1554064736-d6b3bab22532?w=600',
    imageHint: 'badminton sport',
  },
   {
    name: 'Health Club',
    description: 'This section is also functioning well and a large number of members and their wives take part.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600',
    imageHint: 'modern gym',
  },
  {
    name: 'Bar',
    description: 'A well-stacked bar serving a large number of brands as per the requirements of the Members.',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600',
    imageHint: 'cocktail bar',
  },
];

export const team: TeamMember[] = [
  {
    name: 'John Doe',
    role: 'Club President',
    bio: 'Leading the club with passion and vision for over a decade.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
    imageHint: 'male portrait',
  },
  {
    name: 'Jane Smith',
    role: 'Head of Sports',
    bio: 'A former professional athlete dedicated to nurturing talent at all levels.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    imageHint: 'female portrait',
  },
  {
    name: 'Mike Johnson',
    role: 'Facilities Manager',
    bio: 'Ensuring our facilities are state-of-the-art and always ready for our members.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    imageHint: 'professional man',
  },
  {
    name: 'Emily Davis',
    role: 'Member Relations',
    bio: 'The friendly face of Vindhya Club, always here to help our members.',
    image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=400',
    imageHint: 'friendly woman',
  },
];

export const history: HistoryItem[] = [
  {
    year: '1904-1905',
    description: 'The year the club was founded, laying the groundwork for a century of sport.',
    image: 'https://images.unsplash.com/photo-1563815984218-1a4b86a8a25c',
    imageHint: 'vintage photograph',
  },
  {
    year: '1906',
    description: 'Construction of our first clubhouse, a landmark for the community.',
    image: 'https://images.unsplash.com/photo-1613925761379-373f13350482',
    imageHint: 'historic building',
  },
  {
    year: '1960',
    description: 'Hosted the first national-level tennis tournament, putting us on the map.',
    image: 'https://images.unsplash.com/photo-1622053933734-a8c435500c92',
    imageHint: 'vintage sports event',
  },
   {
    year: 'Present',
    description: 'Continuing our legacy with state-of-the-art facilities and a thriving community.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
    imageHint: 'modern resort',
  },
];
