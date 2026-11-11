'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { NAV } from '@/content/data';

export const openSearch = () => window.dispatchEvent(new CustomEvent('aacci:search'));

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  // Close menus on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) { setLastPath(pathname); setOpen(null); setMobile(false); }

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

  useEffect(() => { document.body.style.overflow = mobile ? 'hidden' : ''; }, [mobile]);

  const section = (href: string) => pathname.startsWith(href) || (href === '/about/' && ['/leadership/', '/chapters/', '/careers/'].some((p) => pathname.startsWith(p)));
  const hover = (label: string | null, e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpen(label), label ? 90 : 180);
  };

  return (
    <header className={`site-header${scrolled || mobile ? ' is-scrolled' : ''}${hidden && !open && !mobile ? ' is-hidden' : ''}`}>
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
        <button className="menu-toggle" aria-expanded={mobile} aria-controls="mobile-menu" onClick={() => setMobile(!mobile)}>
          <span className="menu-toggle-bars" aria-hidden="true"><i /><i /><i /></span>
          <span className="menu-toggle-label">{mobile ? 'Close' : 'Menu'}</span>
        </button>
      </div>
      <div className={`mobile-menu${mobile ? ' is-open' : ''}`} id="mobile-menu" hidden={!mobile}>
        <nav aria-label="Mobile">
          <ul>
            {[{ label: 'Home', href: '/' }, { label: 'About', href: '/about/' }, { label: 'Leadership', href: '/leadership/' },
              { label: 'Chapters', href: '/chapters/' }, { label: 'Membership', href: '/membership/' }, { label: 'Services', href: '/services/' },
              { label: 'Events', href: '/events/' }, { label: 'News', href: '/news/' }, { label: 'Contact', href: '/contact/' }].map((l, i) => (
              <li key={l.href} style={{ '--i': i } as React.CSSProperties}><Link href={l.href}>{l.label}</Link></li>
            ))}
          </ul>
          <button className="btn btn--ghost" type="button" onClick={() => { setMobile(false); openSearch(); }}><span>Search the site</span></button>
          <Link className="btn btn--primary" href="/membership/#apply"><span>Become a member</span></Link>
        </nav>
      </div>
    </header>
  );
}
