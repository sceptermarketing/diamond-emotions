import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import TrustBar from '@/components/home/TrustBar';
import WhyPartner from '@/components/home/WhyPartner';
import RetailerSteps from '@/components/home/RetailerSteps';
import BridalCollection from '@/components/home/BridalCollection';
import CustomProgram from '@/components/home/CustomProgram';
import Milestones from '@/components/home/Milestones';
import OurStory from '@/components/home/OurStory';
import NewArrivals from '@/components/home/NewArrivals';
import Testimonials from '@/components/home/Testimonials';
import Faq from '@/components/home/Faq';
import FinalCta from '@/components/home/FinalCta';
import { HOME_NEW_ARRIVALS } from '@/lib/catalog';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <WhyPartner />
        <RetailerSteps />
        <BridalCollection />
        <CustomProgram />
        <Milestones />
        <OurStory />
        <NewArrivals products={HOME_NEW_ARRIVALS} />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
