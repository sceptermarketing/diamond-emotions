'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ADDRESS, LINKS, PHONE, PHONE_HREF } from '@/lib/links';
import { NAV, menuLinks } from './nav';
import MegaMenu from './MegaMenu';
import s from './Header.module.css';

/**
 * Top bar + main header with the menu dropdowns (Figma "Menu", 821:2620). On the homepage the bar sits
 * over the hero: the logo on the hero's white left panel (515px) and the menu over the photo, in white.
 * Inner pages: white bar, menu centred. Once the header scrolls out of view (desktop), a green bar with
 * the logo, menu and buttons sticks to the top of the window.
 */
type Props = {
  /** overlay: laid over the homepage hero. solid: white logo row for inner pages. */
  variant?: 'overlay' | 'solid';
};

export default function Header({ variant = 'overlay' }: Props) {
  const solid = variant === 'solid';
  const pathname = usePathname();
  const [open, setOpen] = useState(false); // mobile drawer
  const [expanded, setExpanded] = useState<string | null>(null);
  const [menu, setMenu] = useState<string | null>(null); // open dropdown
  const [stuck, setStuck] = useState(false);
  const [reserve, setReserve] = useState(0); // inner pages: header height kept while the bar is fixed
  const mainRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const closeRef = useRef<HTMLButtonElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);
  const closeMenu = useCallback(() => setMenu(null), []);

  // a new page closes any open dropdown
  useEffect(() => setMenu(null), [pathname]);

  // desktop: once the header has scrolled out of view, a green bar sticks to the top of the window
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1201px)');
    let bottom = 0; // where the header ends, measured while it is in place
    const onScroll = () => {
      const main = mainRef.current;
      if (!main || !wide.matches) return setStuck(false);
      if (getComputedStyle(main).position !== 'fixed') {
        bottom = main.getBoundingClientRect().bottom + window.scrollY;
        setReserve(main.offsetHeight);
      }
      setStuck(window.scrollY > bottom);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // dropdown: Escape or a click outside closes it
  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const i = NAV.findIndex((n) => n.label === menu);
      setMenu(null);
      document.getElementById(`menu-tab-${i}`)?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setMenu(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [menu]);

  // mouse: open on hover, close shortly after leaving the menu bar and its panel (touch uses taps)
  const hoverOpen = (label: string, type: string) => {
    if (type !== 'mouse') return;
    clearTimeout(leaveTimer.current);
    setMenu(label);
  };
  const hoverLeave = (type: string) => {
    if (type !== 'mouse') return;
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => setMenu(null), 150);
  };

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

  const dark = solid && !stuck; // grey menu text on the white inner-page bar

  return (
    <header
      className={`${s.header} ${solid ? s.solid : s.overlay} ${stuck ? s.stuck : ''}`}
      style={stuck && solid ? { paddingBottom: reserve } : undefined}
    >
      <div className={s.topbar}>
        <p>Wholesale only · Serving independent jewelers since 2009</p>
        {solid ? (
          <Link href={LINKS.findJeweler} className={s.topbarLink}>
            Shopping for a ring? Find a jeweler near you&nbsp;&nbsp;↗
          </Link>
        ) : (
          <div className={s.topbarRight}>
            <p className={s.shopping}>
              Shopping for a ring? <Link href={LINKS.findJeweler}>Find a jeweler near you</Link>
            </p>
            <a href={PHONE_HREF}>{PHONE}</a>
          </div>
        )}
      </div>

      <div ref={mainRef} className={s.main}>
        <div className={s.bar}>
          <div className={s.logoCell}>
            <Link href={LINKS.home} className={s.logo} aria-label="Diamond Emotions home">
              <img
                src={stuck ? '/images/logo-white.png' : '/images/logo.png'}
                alt="Diamond Emotions"
                width={156}
                height={52}
              />
            </Link>
          </div>

          <nav ref={navRef} aria-label="Main" className={s.nav} onPointerLeave={(e) => hoverLeave(e.pointerType)}>
            <ul className={s.menu}>
              {NAV.map((item, i) => {
                const isOpen = menu === item.label;
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      id={`menu-tab-${i}`}
                      className={`${s.menuLink} ${isOpen ? s.menuOpen : ''}`}
                      aria-expanded={isOpen}
                      aria-controls={`menu-panel-${i}`}
                      onPointerEnter={(e) => hoverOpen(item.label, e.pointerType)}
                      onClick={() => setMenu(isOpen ? null : item.label)}
                    >
                      <span className={s.menuLabel} data-label={item.label}>
                        {item.label}
                      </span>
                      <span className={s.chev} aria-hidden>
                        <img src={dark ? '/images/icons/chevron-gray.svg' : '/images/icons/chevron-white.svg'} alt="" />
                      </span>
                    </button>
                    <div
                      id={`menu-panel-${i}`}
                      className={`${s.dropdown} ${isOpen ? s.dropdownOpen : ''}`}
                      inert={!isOpen}
                      onPointerEnter={(e) => hoverOpen(item.label, e.pointerType)}
                    >
                      <MegaMenu item={item} onNavigate={closeMenu} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className={s.navCell}>
            <div className={s.actions}>
              <Link href={LINKS.retailerLogin} className={s.login}>
                <span className={s.badge} aria-hidden>
                  <img src={dark ? '/images/icons/badge-gray.svg' : '/images/icons/badge-white.svg'} alt="" />
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
                    <button
                      type="button"
                      className={`${s.toggle} ${isOpen ? s.toggleOpen : ''}`}
                      aria-expanded={isOpen}
                      aria-label={`${isOpen ? 'Hide' : 'Show'} ${item.label} links`}
                      onClick={() => setExpanded(isOpen ? null : item.label)}
                    >
                      <img src="/images/icons/chevron-white.svg" alt="" />
                    </button>
                  </div>
                  <div className={`${s.subWrap} ${isOpen ? s.subWrapOpen : ''}`}>
                    <ul>
                      {menuLinks(item).map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} onClick={close} tabIndex={isOpen ? undefined : -1}>
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
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
