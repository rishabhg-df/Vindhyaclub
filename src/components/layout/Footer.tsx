
'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Mail, MapPin, Phone, ChevronRight } from 'lucide-react';
import { useEvents } from '@/context/EventContext';
import { navLinks as defaultLinks } from '@/lib/data';

export function Footer() {
  const { events, loading: eventsLoading } = useEvents();

  const links = useMemo(() => {
    if (eventsLoading || events.length > 0) {
      return defaultLinks.filter(
        (link) =>
          link.label === 'Home' ||
          link.label === 'About' ||
          link.label === 'Events' ||
          link.label === 'Facilities'
      );
    }
    return defaultLinks.filter(
      (link) =>
        link.label === 'Home' ||
        link.label === 'About' ||
        link.label === 'Facilities'
    );
  }, [events, eventsLoading]);

  const otherLinks = [
    { href: '#', label: 'Terms & Condition' },
    { href: '#', label: 'Privacy Policy' },
    { href: '/contact', label: 'Contact' },
  ];

  const mapsUrl = 'https://maps.app.goo.gl/5sM3whx8RNETGMHV8';
  const embedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3628.291342993335!2d80.8351530149984!3d24.57947798418847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39845a246f90bd21%3A0x6b8f6789a71a5665!2sVindhya%20Club!5e0!3m2!1sen!2sin!4v1628087948251!5m2!1sen!2sin`;

  const contactDetails = [
    { icon: Phone, content: '+91 1234567890', href: 'tel:+911234567890' },
    {
      icon: Mail,
      content: 'vindhyaclub@example.com',
      href: 'mailto:vindhyaclub@example.com',
    },
    { icon: MapPin, content: 'Vindhya Club, Satna.', href: mapsUrl },
  ];

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-12 md:grid-cols-4 md:px-6">
        <div>
          <h3 className="mb-4 font-headline text-lg font-semibold text-primary">
            Links
          </h3>
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-2 transition-colors hover:text-primary"
                >
                  <ChevronRight className="h-4 w-4 text-primary" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-headline text-lg font-semibold text-primary">
            Other Links
          </h3>
          <ul className="space-y-2">
            {otherLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="flex items-center gap-2 transition-colors hover:text-primary"
                >
                  <ChevronRight className="h-4 w-4 text-primary" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-headline text-lg font-semibold text-primary">
            Contact
          </h3>
          <ul className="space-y-3">
            {contactDetails.map((detail, index) => {
              const Icon = detail.icon;
              return (
                <li key={index} className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-primary" />
                  <a
                    href={detail.href}
                    className="transition-colors hover:text-primary"
                  >
                    {detail.content}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
           <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Vindhya Club location on Google Maps"
          >
            <iframe
              src={embedUrl}
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="pointer-events-none rounded-lg"
            ></iframe>
          </a>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4">
        <p className="text-center text-sm text-gray-400">
          Copyright © {new Date().getFullYear()} Vindhya Club. All Rights
          Reserved
        </p>
      </div>
    </footer>
  );
}
