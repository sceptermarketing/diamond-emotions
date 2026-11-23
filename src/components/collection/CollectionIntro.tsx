import Link from 'next/link';
import { PHONE_HREF } from '@/lib/links';
import type { Collection } from '@/lib/collections';
import Crumbs from '@/components/layout/Crumbs';
import s from './CollectionIntro.module.css';
import p from '@/components/content/PageIntro.module.css';

// Same large photo hero as the inner pages (Custom Design Process layout: half copy, half photo, 510px tall)
export default function CollectionIntro({ collection: c }: { collection: Collection }) {
  return (
    <section className={`${s.section} ${p.large}`}>
      <div className={`${s.copy} ${p.copyLarge}`}>
        <Crumbs items={c.crumbs} className={`${s.crumbs} ${p.crumbsLarge}`} />
        <h1 className={`${s.title} ${p.titleLarge}`}>{c.title}</h1>
        <p className={`${s.text} ${p.textLarge}`}>{c.intro}</p>
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
      <div className={`${s.photo} ${p.photoLarge}`}>
        <img src={c.heroImage} alt="" fetchPriority="high" />
      </div>
    </section>
  );
}
