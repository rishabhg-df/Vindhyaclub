import Image from 'next/image';
import { Hero } from '@/components/shared/Hero';
import { Section } from '@/components/shared/Section';

export default function AboutPage() {
  return (
    <>
      <Hero
        imageUrl="https://placehold.co/1920x1080.png"
        imageHint="team huddle"
        title="About Vindhya Club"
        subtitle="Discover the heart of our club — where every story begins with teamwork, grows with dedication, and lives on in community spirit."
        height="h-[70vh]"
      />
      <Section title="Our Story" id="about-us">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <h3 className="mb-4 font-headline text-2xl font-bold">
              Forged in Passion, Built for Community
            </h3>
            <p className="mb-4 text-muted-foreground">
              Founded in 1995, Vindhya Club started as a small community of
              sports lovers with a shared dream: to create a space where
              passion for sports could thrive. Over the decades, we've grown
              into a premier sports institution, but our core values remain
              unchanged.
            </p>
            <p className="text-muted-foreground">
              We believe in the power of sport to bring people together,
              foster discipline, and create lasting memories. Our
              state-of-the-art facilities and dedicated team are here to
              support every member, from the aspiring athlete to the weekend
              warrior.
            </p>
          </div>
          <div className="order-1 md:order-2">
            <Image
              src="https://placehold.co/800x600.png"
              alt="Club history"
              data-ai-hint="vintage sports photo"
              width={800}
              height={600}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
