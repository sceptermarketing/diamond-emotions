'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LINKS, PHONE, PHONE_HREF } from '@/lib/links';
import { NAV } from './nav';
import s from './Header.module.css';

/**
 * Top bar + main header. On the homepage the bar sits over the hero: the logo on the hero's white
 * left panel (515px) and the menu over the photo, in white.
 */
export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
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
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={s.mobile} hidden={!open}>
        <ul>
          {NAV.map((item) => (
            <li key={item.label}>
              <Link href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
              {item.children && (
                <ul>
                  {item.children.map((c) => (
                    <li key={c.label}>
                      <Link href={c.href} onClick={() => setOpen(false)}>
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <div className={s.mobileActions}>
          <Link href={LINKS.becomeRetailer} className="btn btn-sm btn-dark" onClick={() => setOpen(false)}>
            Become a Retailer
          </Link>
          <Link href={LINKS.retailerLogin} className="btn btn-sm btn-outline" onClick={() => setOpen(false)}>
            Retail Login
          </Link>
        </div>
      </div>
    </header>
  );
}
