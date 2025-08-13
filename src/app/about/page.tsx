import { Hero } from '@/components/shared/Hero';
import { Section } from '@/components/shared/Section';
import { HistoryCard } from '@/components/about/HistoryCard';
import { history } from '@/lib/data';

export default function AboutPage() {
  return (
    <>
      <Hero
        imageUrl="https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1920&auto=format&fit=crop"
        imageHint="team huddle"
        title=""
        subtitle="Discover the heart of our club — where every story begins with teamwork, grows with dedication, and lives on in community spirit."
        height="h-[calc(100vh-5rem)]"
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
