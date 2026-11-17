import type { ReactNode } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FinalCta from '@/components/home/FinalCta';

/** Inner page: solid header, the page, the "Ready To Sell More Bridal?" band, footer */
export default function PageShell({ children, cta = true }: { children: ReactNode; cta?: boolean }) {
  return (
    <>
      <Header variant="solid" />
      <main>
        {children}
        {cta && <FinalCta />}
      </main>
      <Footer />
    </>
  );
}
