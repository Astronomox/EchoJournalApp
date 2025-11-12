import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import StarryBackground from '@/components/starry-background';
import './globals.css';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'EchoJournal',
  description: 'The Journal that Listens Back',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased')}>
        <Providers>
          <StarryBackground />
          {children}
        </Providers>
      </body>
    </html>
  );
}
