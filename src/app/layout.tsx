import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from '@/context/Providers';
import { ClientHeader } from '@/components/layout/ClientHeader';
import { ClientFooter } from '@/components/layout/ClientFooter';

export const metadata: Metadata = {
  title: 'Vindhya Club Central',
  description: 'Welcome to the official website of Vindhya Club.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Space+Grotesk:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="font-body bg-background text-foreground antialiased"
        suppressHydrationWarning={true}
      >
        <Providers>
          <div className="flex min-h-screen flex-col">
            <ClientHeader />
            <main className="flex-grow">{children}</main>
            <ClientFooter />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
