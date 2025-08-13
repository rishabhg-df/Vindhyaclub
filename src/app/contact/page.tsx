import { Hero } from '@/components/shared/Hero';
import { Section } from '@/components/shared/Section';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
  const contactDetails = [
    {
      icon: MapPin,
      title: 'Address',
      content: ['Vindhya Club, Station Road, Satna, MP'],
    },
    {
      icon: Phone,
      title: 'Phone',
      content: ['(O) 0761-2621326', '(R) 0761-2692637'],
    },
    {
      icon: Mail,
      title: 'Email',
      content: ['admin@vindhyaclub.in'],
    },
  ];

  return (
    <>
      <Hero
        imageUrl="https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=1920&auto=format=fit=crop"
        imageHint="contact us"
        title=""
        subtitle=""
        height="h-[calc(100vh-5rem)]"
      />
      <Section title="Contact">
        <div className="grid grid-cols-1 gap-12 text-center md:grid-cols-3">
          {contactDetails.map((detail, index) => {
            const Icon = detail.icon;
            return (
              <div key={index}>
                <Icon className="mx-auto mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-2 font-headline text-2xl font-bold text-primary">
                  {detail.title}
                </h3>
                <div className="text-muted-foreground">
                  {detail.content.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </>
  );
}
