import type { ReactNode } from 'react';
import Crumbs from '@/components/layout/Crumbs';
import type { Crumb } from '@/lib/collections';
import s from '@/components/collection/CollectionIntro.module.css';
import p from './PageIntro.module.css';

type Props = {
  crumbs: Crumb[];
  title: string;
  text?: ReactNode;
  image?: string;
  imagePosition?: string; // object-position of the photo, e.g. '75% 50%'
  children?: ReactNode; // buttons or meta under the text
};

/** Inner-page intro in the collection page's style: ivory panel, breadcrumb, serif title, photo on the right */
export default function PageIntro({ crumbs, title, text, image, imagePosition, children }: Props) {
  return (
    <section className={`${s.section} ${image ? '' : p.noPhoto}`}>
      <div className={s.copy}>
        <Crumbs items={crumbs} className={s.crumbs} />
        <h1 className={s.title}>{title}</h1>
        {text && <div className={`${s.text} ${p.text}`}>{text}</div>}
        {children && <div className={p.extra}>{children}</div>}
      </div>
      {image && (
        <div className={s.photo}>
          <img src={image} alt="" fetchPriority="high" style={imagePosition ? { objectPosition: imagePosition } : undefined} />
        </div>
      )}
    </section>
  );
}
