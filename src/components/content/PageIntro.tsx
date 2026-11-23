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

/**
 * Inner-page intro: ivory panel, breadcrumb, serif title.
 * With a photo it takes the Custom Design Process hero layout (Figma 916:493): half copy, half photo, 510px tall.
 */
export default function PageIntro({ crumbs, title, text, image, imagePosition, children }: Props) {
  const large = Boolean(image);
  return (
    <section className={`${s.section} ${large ? p.large : p.noPhoto}`}>
      <div className={`${s.copy} ${large ? p.copyLarge : ''}`}>
        <Crumbs items={crumbs} className={`${s.crumbs} ${large ? p.crumbsLarge : ''}`} />
        <h1 className={`${s.title} ${large ? p.titleLarge : ''}`}>{title}</h1>
        {text && <div className={`${s.text} ${p.text} ${large ? p.textLarge : ''}`}>{text}</div>}
        {children && <div className={p.extra}>{children}</div>}
      </div>
      {image && (
        <div className={`${s.photo} ${p.photoLarge}`}>
          <img src={image} alt="" fetchPriority="high" style={imagePosition ? { objectPosition: imagePosition } : undefined} />
        </div>
      )}
    </section>
  );
}
