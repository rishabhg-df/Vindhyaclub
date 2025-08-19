
import type { Facility, TeamMember, HistoryItem } from './types';

export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/events', label: 'Events' },
  { href: '/facilities', label: 'Facilities' },
  { href: '/contact', label: 'Contact' },
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
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1920&auto=format=fit=crop',
    imageHint: 'basketball court',
  },
   {
    name: 'Lawn Tennis',
    description: 'Serve an ace on our beautifully maintained lawn tennis courts, available day and night.',
    image: 'https://cdn.pixabay.com/photo/2017/04/25/11/06/wilson-2259352_640.jpg',
    imageHint: 'tennis court',
  },
  {
    name: 'Pool & Snooker',
    description: 'Unwind and test your skills on our classic pool and snooker tables in a relaxed setting.',
    image: 'https://cdn.pixabay.com/photo/2019/09/30/19/28/snooker-4516624_640.jpg',
    imageHint: 'pool table',
  },
  {
    name: 'Gym',
    description: 'Achieve your fitness goals with our state-of-the-art gym, equipped with the latest machines.',
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1920&auto=format=fit=crop',
    imageHint: 'modern gym',
  },
];

export const team: Omit<TeamMember, 'id'>[] = [
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
