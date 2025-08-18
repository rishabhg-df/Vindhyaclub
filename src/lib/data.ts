
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
    image: 'https://cdn.pixabay.com/photo/2016/11/28/10/48/christmas-background-1864718_640.jpg',
    imageHint: 'christmas background',
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
    name: 'Badminton',
    description: 'Enjoy a friendly match or competitive game in our modern, well-lit badminton court.',
    image: 'https://cdn.pixabay.com/photo/2021/02/19/16/36/badminton-6030861_640.jpg',
    imageHint: 'badminton sport',
  },
  {
    name: 'Swimming Pool',
    description: 'Relax and rejuvenate in our crystal-clear swimming pool, perfect for all ages.',
    image: 'https://cdn.pixabay.com/photo/2016/03/27/21/55/girls-1284419_640.jpg',
    imageHint: 'swimming pool',
  },
  {
    name: 'Squash Court',
    description: 'Challenge your agility and speed in our professional-grade, air-conditioned squash courts.',
    image: 'https://media.istockphoto.com/id/1232520348/photo/its-all-in-how-you-serve.jpg?s=1024x1024&w=is&k=20&c=NyCn7dU6K3JEw5zl5mniogBoBxcWbpNbkeDrHF2WCwQ=',
    imageHint: 'squash court',
  },
  {
    name: 'Half Basketball Court',
    description: 'Practice your shots and enjoy a casual game on our outdoor half basketball court.',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1920&auto=format&fit=crop',
    imageHint: 'basketball court',
  },
   {
    name: 'Lawn Tennis',
    description: 'Serve an ace on our beautifully maintained lawn tennis courts, available day and night.',
    image: 'https://images.unsplash.com/photo-1559523182-a284c3fb7cff?q=80&w=1920&auto=format&fit=crop',
    imageHint: 'tennis court',
  },
  {
    name: 'Pool & Snooker',
    description: 'Unwind and test your skills on our classic pool and snooker tables in a relaxed setting.',
    image: 'https://images.unsplash.com/photo-1608283929910-29a2e424a4b5?q=80&w=1920&auto=format&fit=crop',
    imageHint: 'pool table',
  },
  {
    name: 'Gym',
    description: 'Achieve your fitness goals with our state-of-the-art gym, equipped with the latest machines.',
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1920&auto=format&fit=crop',
    imageHint: 'modern gym',
  },
];

export const team: TeamMember[] = [
  {
    name: 'Dr. Satish Kumar S',
    role: 'Club President',
    bio: 'Leading the club with passion and vision for over a decade.',
    image: 'https://cdn.s3waas.gov.in/s38e6b42f1644ecb1327dc03ab345e618b/uploads/bfi_thumb/2025020454-r0zxhxfa9ej3kpxiw6s4sngj7oqwo1aum8vlxcfux4.jpg',
    imageHint: 'male portrait',
  },
  {
    name: 'Sanjay Shrivastav',
    role: 'Joint Secretary',
    bio: 'A former professional athlete dedicated to nurturing talent at all levels.',
    image: 'https://i.postimg.cc/j2V8nHvv/2.png',
    imageHint: 'professional man',
  },
  {
    name: 'Sp Ashutosh gupta',
    role: 'Vice President',
    bio: 'Dedicated to enhancing the club experience for all our members.',
    image: 'https://i.postimg.cc/nzhStVrY/1.png',
    imageHint: 'professional man',
  },
  {
    name: 'Dr Praveen Shrivastava',
    role: 'Secretary',
    bio: 'Ensuring the smooth operation of the club and its activities.',
    image: 'https://i.postimg.cc/yYxJ3MgQ/4.png',
    imageHint: 'professional portrait',
  },
  {
    name: 'Ashish Dwivedi',
    role: 'Manager',
    bio: 'Overseeing daily operations and ensuring a great member experience.',
    image: 'https://i.postimg.cc/V6XqT3BB/3.png',
    imageHint: 'professional manager',
  },
];

export const history: HistoryItem[] = [
  {
    year: '1904-1905',
    description: 'The year the club was founded, laying the groundwork for a century of sport.',
    image: 'https://media.istockphoto.com/id/1216087127/photo/empty-dry-cracked-swamp-reclamation-soil.jpg?s=612x612&w=0&k=20&c=z8OEaAbOe8x1AJph3vajaZHnUACU0wD2b0Oqv9pHaM0=',
    imageHint: 'cracked ground',
  },
  {
    year: '1906',
    description: 'Construction of our first clubhouse, a landmark for the community.',
    image: 'https://media.istockphoto.com/id/1300668435/photo/humayuns-tomb-in-india-a-famous-unesco-object-in-new-delhi.jpg?s=612x612&w=0&k=20&c=zacDjdo068SUsJXrDAOsHk5TxwzUS-SxQLIKuBDpPdI=',
    imageHint: 'historic building',
  },
  {
    year: '1960',
    description: 'Hosted the first national-level tennis tournament, putting us on the map.',
    image: 'https://cdn.pixabay.com/photo/2020/05/12/18/29/city-5164368_1280.jpg',
    imageHint: 'vintage sports event',
  },
   {
    year: 'Present',
    description: 'Continuing our legacy with state-of-the-art facilities and a thriving community.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
    imageHint: 'modern resort',
  },
];
