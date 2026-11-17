import Link from 'next/link';
import { LINKS, PHONE, PHONE_HREF } from '@/lib/links';
import NumberedList from './NumberedList';
import s from './RetailerSteps.module.css';

// Step copy drawn from the old site's "Become a Retailer" page
const STEPS = [
  {
    title: 'Apply',
    text: 'Tell us about your store. It takes a few minutes, and our sales manager follows up right away.',
  },
  { title: 'Meet the line', text: "We'll walk you through the collection, wholesale pricing and our custom program." },
  {
    title: 'Start selling',
    text: 'Stock your case at competitive wholesale prices, take custom orders, and count on industry-leading support.',
  },
];

export default function RetailerSteps() {
  return (
    <section className={s.section}>
      <div className={s.photo}>
        <img src="/images/steps.png" alt="" loading="lazy" />
      </div>
      <div className={s.content}>
        <p className="eyebrow">Become a Retailer</p>
        <h2 className="h2">Start Carrying Diamond Emotions In Three Steps</h2>
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
