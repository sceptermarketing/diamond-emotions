import type { CSSProperties } from 'react';
import Link from 'next/link';
import { PHONE_DISPLAY, PHONE_HREF } from '@/lib/links';
import type { Feature, MenuLink, NavItem } from './nav';
import s from './MegaMenu.module.css';

/** One dropdown panel of the main menu (Figma "Navigation / … dropdown", 821:2122 and siblings) */
export default function MegaMenu({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  return (
    <div className={s.panel}>
      <div className={s.content}>
        {item.columns.map((col) => (
          <div key={col.title} className={s.column} style={{ flexBasis: col.width } as CSSProperties}>
            <p className={`${s.colTitle} ${col.muted ? s.colTitleMuted : ''}`}>{col.title}</p>
            {col.links.map((l) => (
              <MenuAnchor key={l.label} link={l} onNavigate={onNavigate} />
            ))}
          </div>
        ))}
        {item.feature && <FeatureBlock feature={item.feature} onNavigate={onNavigate} />}
      </div>
      <div className={s.footer}>
        <p>Wholesale collections · Call to order</p>
        <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
      </div>
    </div>
  );
}

function MenuAnchor({ link, onNavigate }: { link: MenuLink; onNavigate: () => void }) {
  const content = (
    <>
      {link.label}
      {link.arrow && (
        <svg className={s.arrow} width="12" height="12" viewBox="0 0 12 12" aria-hidden>
          <path d="M3.5 8.5l5-5M4.5 3.5h4v4" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
      )}
    </>
  );
  return link.href.startsWith('tel:') ? (
    <a href={link.href} className={s.link}>
      {content}
    </a>
  ) : (
    <Link href={link.href} className={s.link} onClick={onNavigate}>
      {content}
    </Link>
  );
}

function FeatureBlock({ feature: f, onNavigate }: { feature: Feature; onNavigate: () => void }) {
  if (f.kind === 'image') {
    return (
      <div className={s.editorial} style={{ flexBasis: f.width }}>
        <img src={f.image} alt="" className={s.editorialImg} style={{ height: f.imageHeight }} loading="lazy" />
        <p className={s.editorialTitle}>{f.title}</p>
        <MenuAnchor link={f.link} onNavigate={onNavigate} />
      </div>
    );
  }
  if (f.kind === 'card') {
    return (
      <div className={s.card} style={{ flexBasis: f.width, padding: f.padding }}>
        {f.eyebrow && <p className={s.eyebrow}>{f.eyebrow}</p>}
        <p className={s.cardTitle} style={{ fontSize: f.titleSize }}>
          {f.title}
        </p>
        <p className={s.cardText} style={{ fontSize: f.textSize, maxWidth: f.textWidth }}>
          {f.text}
        </p>
        <MenuAnchor link={f.link} onNavigate={onNavigate} />
        {f.note && <p className={s.note}>{f.note}</p>}
        {f.after && <MenuAnchor link={f.after} onNavigate={onNavigate} />}
      </div>
    );
  }
  if (f.kind === 'steps') {
    return (
      <>
        <div className={s.steps} style={{ flexBasis: f.width }}>
          <p className={s.stepsTitle}>{f.title}</p>
          {f.steps.map((step, i) => (
            <p key={step} className={s.step}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              {step}
            </p>
          ))}
          <p className={s.cardText}>{f.text}</p>
        </div>
        <div className={s.editorial} style={{ flexBasis: f.imageWidth }}>
          <img src={f.image} alt="" className={s.editorialImg} style={{ height: f.imageHeight }} loading="lazy" />
          <MenuAnchor link={f.link} onNavigate={onNavigate} />
        </div>
      </>
    );
  }
  return (
    <>
      {f.posts.map((p) => (
        <Link key={p.href} href={p.href} className={s.post} onClick={onNavigate}>
          <span className={s.eyebrow}>{p.eyebrow}</span>
          <span className={s.postTitle}>{p.title}</span>
          <span className={s.cardText}>{p.text}</span>
          <span className={s.link}>
            Read article
            <svg className={s.arrow} width="12" height="12" viewBox="0 0 12 12" aria-hidden>
              <path d="M3.5 8.5l5-5M4.5 3.5h4v4" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
            </svg>
          </span>
        </Link>
      ))}
    </>
  );
}
