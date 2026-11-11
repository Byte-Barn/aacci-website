'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { NAV, SITE } from '@/content/data';

export const openSearch = () => window.dispatchEvent(new CustomEvent('aacci:search'));

const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [group, setGroup] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const wasOpen = useRef(false);

  // Close menus on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) { setLastPath(pathname); setOpen(null); setMobile(false); }

  const section = (href: string) => pathname.startsWith(href) || (href === '/about/' && ['/leadership/', '/chapters/', '/careers/'].some((p) => pathname.startsWith(p)));
  const closeDrawer = () => setMobile(false);
  const openDrawer = () => {
    setGroup(NAV.find((item) => item.links && section(item.href))?.label ?? null);
    setMobile(true);
  };

  useEffect(() => {
    let last = window.scrollY;
    const motion = document.documentElement.classList.contains('motion');
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      if (motion) setHidden(y > last && y > 480);
      if (y < last) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(null); setMobile(false); }
    };
    const onClick = (e: MouseEvent) => { if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('click', onClick); };
  }, []);

  // The drawer is a modal: lock the page, move focus in, keep Tab inside, and hand focus back on close.
  useEffect(() => {
    document.body.style.overflow = mobile ? 'hidden' : '';
    if (!mobile) {
      if (wasOpen.current) { wasOpen.current = false; toggleRef.current?.focus({ preventScroll: true }); }
      return;
    }
    wasOpen.current = true;
    drawerRef.current?.querySelector<HTMLElement>('.drawer-close')?.focus({ preventScroll: true });
    const onTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !drawerRef.current) return;
      const items = [...drawerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => !el.closest('[inert]'));
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    // Widening to desktop (rotating a tablet, resizing a window) closes the drawer and unlocks the page.
    const wide = window.matchMedia('(min-width: 1181px)');
    const onWide = () => { if (wide.matches) setMobile(false); };
    document.addEventListener('keydown', onTab);
    wide.addEventListener('change', onWide);
    window.addEventListener('resize', onWide);
    return () => { document.removeEventListener('keydown', onTab); wide.removeEventListener('change', onWide); window.removeEventListener('resize', onWide); };
  }, [mobile]);

  const hover = (label: string | null, e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpen(label), label ? 90 : 180);
  };

  return (
    <>
      <header className={`site-header${scrolled ? ' is-scrolled' : ''}${hidden && !open && !mobile ? ' is-hidden' : ''}`}>
        <div className="wrap header-row">
          <Link className="brand" href="/" aria-label="AACCI home">
            <img src="/img/aacci-logo-light.png" alt="" width={48} height={48} />
            <span className="brand-name">Asian-African Chamber<br />of Commerce &amp; Industry</span>
          </Link>
          <nav className="nav" aria-label="Main" ref={navRef}>
            <ul className="nav-list">
              {NAV.map((item) => (
                <li key={item.label} className={`nav-item${section(item.href) ? ' is-current' : ''}`}
                  onPointerEnter={(e) => item.links && hover(item.label, e)} onPointerLeave={(e) => item.links && hover(null, e)}>
                  {item.links ? (
                    <>
                      <button className="nav-btn" aria-expanded={open === item.label} aria-controls={`mega-${item.label.toLowerCase()}`}
                        onClick={() => setOpen(open === item.label ? null : item.label)}>{item.label}</button>
                      <div className={`mega${open === item.label ? ' is-open' : ''}`} id={`mega-${item.label.toLowerCase()}`}>
                        <div className="mega-intro">
                          <p className="mega-title">{item.label}</p>
                          <p>{item.intro}</p>
                          <Link className="text-link" href={item.href}>{item.label} overview</Link>
                        </div>
                        <ul className="mega-links">
                          {item.links.map((l, i) => (
                            <li key={l.href} style={{ '--i': i } as React.CSSProperties}><Link href={l.href} onClick={() => setOpen(null)}>{l.label}</Link></li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <Link className="nav-link" href={item.href} {...(section(item.href) ? { 'aria-current': 'page' as const } : {})}>{item.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <button className="search-btn" type="button" aria-label="Search the site" aria-haspopup="dialog" onClick={openSearch}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
            <kbd aria-hidden="true">/</kbd>
          </button>
          <Link className="btn btn--primary header-cta" href="/membership/#apply"><span>Become a member</span></Link>
          <button className="menu-toggle" type="button" ref={toggleRef} aria-expanded={mobile} aria-controls="mobile-menu" aria-haspopup="dialog"
            onClick={() => (mobile ? closeDrawer() : openDrawer())}>
            <span className="menu-toggle-bars" aria-hidden="true"><i /><i /><i /></span>
            <span className="menu-toggle-label">Menu</span>
          </button>
        </div>
      </header>

      <div className={`drawer-scrim${mobile ? ' is-open' : ''}`} aria-hidden="true" onClick={closeDrawer} />
      <div className={`drawer${mobile ? ' is-open' : ''}`} id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu"
        ref={drawerRef} inert={!mobile}>
        <div className="drawer-head">
          <Link className="drawer-brand" href="/" onClick={closeDrawer}>
            <img src="/img/aacci-logo-light.png" alt="" width={40} height={40} />
            <span>Asian-African Chamber<br />of Commerce &amp; Industry</span>
          </Link>
          <button className="drawer-close" type="button" aria-label="Close menu" onClick={closeDrawer}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" /></svg>
          </button>
        </div>
        <div className="drawer-body">
          <nav aria-label="Mobile">
            <ul className="drawer-links">
              <li style={{ '--i': 0 } as React.CSSProperties}>
                <div className="drawer-row">
                  <Link href="/" onClick={closeDrawer} {...(pathname === '/' ? { 'aria-current': 'page' as const } : {})}>Home</Link>
                </div>
              </li>
              {NAV.map((item, i) => {
                const id = `drawer-${item.label.toLowerCase()}`;
                const expanded = group === item.label;
                return (
                  <li key={item.label} style={{ '--i': i + 1 } as React.CSSProperties}>
                    <div className="drawer-row">
                      <Link href={item.href} onClick={closeDrawer} {...(section(item.href) ? { 'aria-current': 'page' as const } : {})}>{item.label}</Link>
                      {item.links && (
                        <button className="drawer-more" type="button" aria-expanded={expanded} aria-controls={id}
                          aria-label={`${expanded ? 'Hide' : 'Show'} ${item.label} pages`} onClick={() => setGroup(expanded ? null : item.label)} />
                      )}
                    </div>
                    {item.links && (
                      <div className={`drawer-sub${expanded ? ' is-open' : ''}`} id={id} inert={!expanded}>
                        <ul>
                          {item.links.map((l) => (
                            <li key={l.href}><Link href={l.href} onClick={closeDrawer}>{l.label}</Link></li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="drawer-actions">
            <Link className="btn btn--primary" href="/membership/#apply" onClick={closeDrawer}><span>Become a member</span></Link>
            <button className="btn btn--ghost" type="button" onClick={() => { closeDrawer(); openSearch(); }}><span>Search the site</span></button>
          </div>
          <p className="drawer-contact">
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a><br />
            <a href={`tel:${SITE.phoneHref}`}>{SITE.phone}</a>
          </p>
        </div>
      </div>
    </>
  );
}
