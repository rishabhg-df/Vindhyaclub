import Image from 'next/image';
import { Section } from '@/components/shared/Section';

export function WelcomeSection() {
  return (
    <Section title="">
      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
        <div className="order-1">
          <Image
            src="https://images.unsplash.com/photo-1616488711413-a4e61691a071?q=80&w=800&auto=format&fit=crop"
            alt="Vindhya Club Trophy"
            data-ai-hint="trophy in case"
            width={800}
            height={600}
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="order-2">
          <h2 className="font-headline text-4xl font-bold">Welcome</h2>
          <h3 className="mb-4 font-headline text-2xl font-bold text-primary">
            Vindhya Club
          </h3>
          <p className="mb-4 text-muted-foreground">
            Vindhya Club was established in 1889 and became formally registered
            in 1904. Since then, it has been a vibrant center of culture,
            recreation, and social gatherings, offering a unique and rich
            history that continues to thrive today as &quot;Vindhya Club&quot;.
          </p>
        </div>
      </div>
    </Section>
  );
}
