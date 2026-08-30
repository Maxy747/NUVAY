import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { BottomNav } from '@/components/layout/BottomNav';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'NUVAY | AI Travel Journey Planner',
  description: 'Describe your dream trip naturally and receive personalized day-by-day itineraries, route maps, and budget breakdowns powered by AI.',
  keywords: 'AI travel planner, itinerary generator, India travel, budget trip calculator, route map, Coorg, Gokarna, Karnataka',
  icons: {
    icon: '/nuvay-logo.png',
    shortcut: '/nuvay-logo.png',
    apple: '/nuvay-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#05070A] text-slate-100 antialiased min-h-screen flex flex-col selection:bg-amber-500 selection:text-slate-950">
        <Navbar />
        <main className="flex-1 w-full pb-20 md:pb-0">{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
