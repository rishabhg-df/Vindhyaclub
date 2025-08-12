import Link from 'next/link';
import { Club } from 'lucide-react';

export function Footer() {
  const footerLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/events', label: 'Events' },
    { href: '/services', label: 'Services' },
    { href: '/facilities', label: 'Facilities' },
    { href: '/contact', label: 'Contact' },
    { href: '/signin', label: 'Sign In' },
  ];

  const otherLinks = [
    { href: '#', label: 'Privacy Policy' },
    { href: '#', label: 'Terms of Service' },
    { href: '#', label: 'Club Rules' },
  ];

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-12 md:grid-cols-4 md:px-6">
        <div className="col-span-1 flex flex-col items-start gap-4 md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
                <Club className="h-8 w-8 text-primary" />
                <span className="font-headline text-2xl font-bold text-white">
                Vindhya <span className="text-primary">Club</span>
                </span>
            </Link>
            <p className="max-w-md text-muted-foreground">The premier destination for sports enthusiasts. Join our community and elevate your game.</p>
        </div>
        
        <div className="col-span-1">
          <h3 className="mb-4 font-headline text-lg font-semibold">Quick Links</h3>
          <ul className="space-y-2">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="col-span-1">
          <h3 className="mb-4 font-headline text-lg font-semibold">Contact</h3>
          <address className="not-italic">
            <p>123 Sports Lane, Fitness City</p>
            <p>Phone: (123) 456-7890</p>
            <p>Email: info@vindhyaclub.com</p>
          </address>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Vindhya Club. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
