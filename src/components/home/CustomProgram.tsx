import Link from 'next/link';
import { LINKS } from '@/lib/links';
import NumberedList from './NumberedList';
import s from './CustomProgram.module.css';

const STEPS = [
  { title: 'Sketch', text: "Send us a drawing of your customer's idea — or we'll draw it for you." },
  { title: 'CAD', text: 'Review a detailed CAD rendering with your customer before anything is made.' },
  {
    title: 'Finished piece',
    text: 'We craft it in white, yellow, rose or two-tone gold and ship it to your store.',
  },
];

export default function CustomProgram() {
  return (
    <section className={s.section}>
      <div className={s.panel}>
        <div className={s.copy}>
          <p className={`eyebrow ${s.eyebrow}`}>Custom Program</p>
          <h2 className={`h2 ${s.title}`}>Turn “I Don&apos;t See It” Into “That&apos;s The One.”</h2>
          <p className={s.text}>
            Every jeweler knows the couple who can&apos;t find exactly what they want. Now you never have to send them
            away. Share their idea — a sketch, a photo, a few words — and we&apos;ll take it from there.
          </p>
          <NumberedList items={STEPS} tone="light" />
        </div>
        <div className={s.actions}>
          <Link href={LINKS.customOrder} className="btn btn-lg btn-light">
            Start a Custom Order
          </Link>
          <Link href={LINKS.customProcess} className={s.link}>
            See How it Works
          </Link>
        </div>
      </div>
      <img src="/images/sketch.jpg" alt="" className={s.photo} loading="lazy" />
    </section>
  );
}
