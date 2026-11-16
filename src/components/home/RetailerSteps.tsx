import Link from 'next/link';
import { LINKS, PHONE, PHONE_HREF } from '@/lib/links';
import NumberedList from './NumberedList';
import s from './RetailerSteps.module.css';

// Step 3's text repeats step 1's in the Figma design; kept as designed until the client sends copy.
const STEPS = [
  {
    title: 'Apply',
    text: "We've stood behind the counter. We know what it takes to close a bridal sale — and what gets in the way.",
  },
  { title: 'Meet the line', text: "We'll walk you through the collection, wholesale pricing and our custom program." },
  {
    title: 'Start selling',
    text: "We've stood behind the counter. We know what it takes to close a bridal sale — and what gets in the way.",
  },
];

export default function RetailerSteps() {
  return (
    <section className={s.section}>
      <img src="/images/steps.png" alt="" className={s.photo} loading="lazy" />
      <div className={s.content}>
        <p className="eyebrow">Become a Retailer</p>
        <h2 className="h2">Start Carrying Diamond Emotions in Three Steps</h2>
        <div className={s.list}>
          <NumberedList items={STEPS} tone="dark" />
        </div>
        <div className={s.actions}>
          <Link href={LINKS.becomeRetailer} className="btn btn-sm btn-dark">
            Become a Retailer
          </Link>
          <p className={s.call}>
            Questions? <a href={PHONE_HREF}>Call {PHONE}</a>
          </p>
        </div>
      </div>
    </section>
  );
}
