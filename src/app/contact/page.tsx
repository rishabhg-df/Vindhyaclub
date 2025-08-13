import { Hero } from '@/components/shared/Hero';
import { Section } from '@/components/shared/Section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
  const contactDetails = [
    {
      icon: MapPin,
      title: 'Address',
      content: '123 Sports Lane, Fitness City, 12345',
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '(123) 456-7890',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'info@vindhyaclub.com',
    },
  ];

  return (
    <>
      <Hero
        imageUrl="https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=1920&auto=format=fit=crop"
        imageHint="contact us"
        title=""
        subtitle=""
        height="h-[70vh]"
      />
      <Section title="Get In Touch">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {contactDetails.map((detail, index) => {
            const Icon = detail.icon;
            return (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-8 w-8" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="font-headline text-xl">
                    {detail.title}
                  </CardTitle>
                  <p className="text-muted-foreground">{detail.content}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Section>
    </>
  );
}
