import { Hero } from '@/components/shared/Hero';
import { Section } from '@/components/shared/Section';
import { HistoryCard } from '@/components/about/HistoryCard';
import { history } from '@/lib/data';

export default function AboutPage() {
  return (
    <>
      <Hero
        imageUrl="https://placehold.co/1920x1080.png"
        imageHint="team huddle"
        title=""
        subtitle=""
        height="h-[70vh]"
      />
      <Section title="About US" id="about-us">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {history.map((item, index) => (
            <HistoryCard key={index} item={item} />
          ))}
        </div>
      </Section>
    </>
  );
}
