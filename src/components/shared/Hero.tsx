import Image from 'next/image';
import { cn } from '@/lib/utils';

type HeroProps = {
  imageUrl: string;
  imageHint: string;
  title: string;
  subtitle?: string;
  height?: string;
};

export function Hero({
  imageUrl,
  imageHint,
  title,
  subtitle,
  height = 'h-[60vh]',
}: HeroProps) {
  return (
    <section className={cn('relative flex w-full items-center justify-center', height)}>
      <Image
        src={imageUrl}
        alt={title}
        data-ai-hint={imageHint}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 text-center text-white">
        <h1 className="font-headline text-4xl font-bold md:text-6xl lg:text-7xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-3xl text-xl font-bold text-white drop-shadow-md md:text-3xl">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
