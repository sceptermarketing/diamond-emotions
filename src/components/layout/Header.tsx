'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { ADDRESS, LINKS, PHONE, PHONE_HREF } from '@/lib/links';
import { NAV } from './nav';
import s from './Header.module.css';

/**
 * Top bar + main header. On the homepage the bar sits over the hero: the logo on the hero's white
 * left panel (515px) and the menu over the photo, in white.
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    // the drawer is only used below 1200px; close it if the window grows past that
    const mq = window.matchMedia('(min-width: 1201px)');
    const onWide = () => mq.matches && setOpen(false);
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onWide);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onWide);
      burgerRef.current?.focus();
    };
  }, [open]);

  return (
    <header className={s.header}>
      <div className={s.topbar}>
        <p>Wholesale only · Serving independent jewelers since 2009</p>
        <div className={s.topbarRight}>
          <p className={s.shopping}>
            Shopping for a ring? <Link href={LINKS.findJeweler}>Find a jeweler near you</Link>
          </p>
          <a href={PHONE_HREF}>{PHONE}</a>
        </div>
      </div>

      <div className={s.bar}>
        <div className={s.logoCell}>
          <Link href={LINKS.home} className={s.logo} aria-label="Diamond Emotions home">
            <img src="/images/logo.png" alt="Diamond Emotions" width={156} height={52} />
          </Link>
        </div>

        <div className={s.navCell}>
          <nav aria-label="Main" className={s.nav}>
            <ul className={s.menu}>
              {NAV.map((item) => (
                <li key={item.label} className={item.children ? s.hasSub : undefined}>
                  <Link href={item.href} className={s.menuLink}>
                    {item.label}
                    {item.children && (
                      <span className={s.chev} aria-hidden>
                        <img src="/images/icons/chevron-white.svg" alt="" />
                      </span>
                    )}
                  </Link>
                  {item.children && (
                    <ul className={s.sub}>
                      {item.children.map((c) => (
                        <li key={c.label}>
                          <Link href={c.href}>{c.label}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className={s.actions}>
            <Link href={LINKS.retailerLogin} className={s.login}>
              <span className={s.badge} aria-hidden>
                <img src="/images/icons/badge-white.svg" alt="" />
              </span>
              Retail Login
            </Link>
            <Link href={LINKS.becomeRetailer} className={s.cta}>
              Become a Retailer
            </Link>
          </div>

          <button
            type="button"
            className={s.burger}
            ref={burgerRef}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`${s.backdrop} ${open ? s.backdropOpen : ''}`} onClick={close} aria-hidden />

      <div
        id="mobile-menu"
        className={`${s.drawer} ${open ? s.drawerOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
      >
        <div className={s.drawerHead}>
          <Link href={LINKS.home} onClick={close} aria-label="Diamond Emotions home">
            <img src="/images/logo-white.png" alt="Diamond Emotions" width={130} height={43} />
          </Link>
          <button ref={closeRef} type="button" className={s.close} aria-label="Close menu" onClick={close}>
            <span />
            <span />
          </button>
        </div>

        <nav aria-label="Mobile" className={s.drawerNav}>
          <ul>
            {NAV.map((item, i) => {
              const isOpen = expanded === item.label;
              return (
                <li key={item.label} style={{ '--i': i } as CSSProperties}>
                  <div className={s.row}>
                    <Link href={item.href} onClick={close}>
                      {item.label}
                    </Link>
                    {item.children && (
                      <button
                        type="button"
                        className={`${s.toggle} ${isOpen ? s.toggleOpen : ''}`}
                        aria-expanded={isOpen}
                        aria-label={`${isOpen ? 'Hide' : 'Show'} ${item.label} links`}
                        onClick={() => setExpanded(isOpen ? null : item.label)}
                      >
                        <img src="/images/icons/chevron-white.svg" alt="" />
                      </button>
                    )}
                  </div>
                  {item.children && (
                    <div className={`${s.subWrap} ${isOpen ? s.subWrapOpen : ''}`}>
                      <ul>
                        {item.children.map((c) => (
                          <li key={c.label}>
                            <Link href={c.href} onClick={close} tabIndex={isOpen ? undefined : -1}>
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={s.drawerFoot}>
          <div className={s.drawerButtons}>
            <Link href={LINKS.becomeRetailer} className="btn btn-sm btn-light" onClick={close}>
              Become a Retailer
            </Link>
            <Link href={LINKS.retailerLogin} className="btn btn-sm btn-outline-light" onClick={close}>
              Retail Login
            </Link>
          </div>
          <div className={s.contact}>
            <a href={PHONE_HREF} className={s.phone}>
              <img src="/images/icons/phone-white.svg" alt="" width={16} height={16} />
              {PHONE}
            </a>
            <a href={LINKS.map} target="_blank" rel="noopener noreferrer">
              {ADDRESS[0]}, {ADDRESS[1]}
            </a>
            <Link href={LINKS.findJeweler} onClick={close} className={s.find}>
              Shopping for a ring? Find a jeweler near you →
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
