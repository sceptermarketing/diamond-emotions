import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-inter-family',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Diamond Emotions | Wholesale Bridal & Fine Jewelry for Independent Jewelers',
  description:
    'Diamond Emotions designs engagement rings, wedding bands and fine jewelry for independent jewelers. Wholesale only, family-founded in East Lansing, Michigan, since 2009.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
