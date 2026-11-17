import Link from 'next/link';
import { PHONE_HREF } from '@/lib/links';
import type { Collection } from '@/lib/collections';
import Crumbs from '@/components/layout/Crumbs';
import s from './CollectionIntro.module.css';

export default function CollectionIntro({ collection: c }: { collection: Collection }) {
  return (
    <section className={s.section}>
      <div className={s.copy}>
        <Crumbs items={c.crumbs} className={s.crumbs} />
        <h1 className={s.title}>{c.title}</h1>
        <p className={s.text}>{c.intro}</p>
        <p className={s.reassure}>
          <span className={s.strong}>Wholesale pricing by phone</span>
          <span className={s.item}>
            <a href={PHONE_HREF} className={s.phone}>
              (517) 574-4209
            </a>
          </span>
          <span className={s.item}>No online checkout</span>
        </p>
      </div>
      <div className={s.photo}>
        <img src={c.heroImage} alt="" fetchPriority="high" />
      </div>
    </section>
  );
}
