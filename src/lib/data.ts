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
    image: 'https://placehold.co/600x400.png',
    imageHint: 'new year party',
  },
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
    title: 'Sports',
    description: 'We provides all the sports and activities in our club.',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'sports equipment',
  },
  {
    title: 'Kids Zone',
    description:
      'We have largest garden in the locality with kids play area.',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'kids playing',
  },
  {
    title: 'Restaurant',
    description: 'The best and choicest cuisine in our Restaurant.',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'gourmet food',
  },
  {
    title: 'Bar',
    description: 'We serve best beverages in our bar for our',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'cocktail bar',
  },
];

export const facilities: Facility[] = [
  {
    name: 'Snooker',
    description: 'We feel proud that the game SNOOKER, founded by British General About 320 years...',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'snooker table',
  },
  {
    name: 'Lawn Tennis',
    description: 'Club provides two types of Tennis Court to the members according to their interest.',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'tennis court',
  },
  {
    name: 'Card Room',
    description: 'This section is also functioning well and a large number of members and their wives take part.',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'playing cards',
  },
  {
    name: 'Badminton',
    description: 'Club has recently renewed Badminton Court where Members and their dependents can enjoy.',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'badminton court',
  },
   {
    name: 'Health Club',
    description: 'This section is also functioning well and a large number of members and their wives take part.',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'modern gym',
  },
  {
    name: 'Bar',
    description: 'A well-stacked bar serving a large number of brands as per the requirements of the Members.',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'cocktail bar',
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

export const history: HistoryItem[] = [
  {
    year: '1904-1905',
    description: 'The year the club was founded, laying the groundwork for a century of sport.',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'historic building black and white',
  },
  {
    year: '1906',
    description: 'Construction of our first clubhouse, a landmark for the community.',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'vintage architecture',
  },
  {
    year: '1960',
    description: 'Hosted the first national-level tennis tournament, putting us on the map.',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'old stadium',
  },
   {
    year: 'Present',
    description: 'Continuing our legacy with state-of-the-art facilities and a thriving community.',
    image: 'https://placehold.co/600x400.png',
    imageHint: 'modern sports complex',
  },
];
