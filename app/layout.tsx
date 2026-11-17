import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Coy — Discover',
  description: 'Swipe-based discovery with Coy’s core promise of mutual privacy.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="bg-[#0b0b0e] text-white h-full overflow-hidden flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
