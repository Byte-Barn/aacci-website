'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const motionOn = () => document.documentElement.classList.contains('motion');

/**
 * Site-wide effects, re-armed on every page: scroll reveals, counters, image tilt,
 * the logo marquee, the reading progress bar and the floating WhatsApp button.
 */
export default function Effects() {
  const pathname = usePathname();

  useEffect(() => {
    (window as unknown as { __aacci?: boolean }).__aacci = true; // the app is running: keep animated start states
    const motion = motionOn();
    const cleanups: (() => void)[] = [];

    // Reveal on scroll (content is visible without JS; the hidden start state only exists under html.motion).
    const countUp = (el: HTMLElement) => {
      const to = Number(el.dataset.to);
      if (el.dataset.plain !== undefined || !motion || !to) return;
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / 1500);
        el.textContent = String(Math.round(to * (1 - Math.pow(1 - t, 3))));
        if (t < 1) requestAnimationFrame(step);
      };
      el.textContent = '0';
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        el.classList.add('is-in');
        el.querySelectorAll<HTMLElement>('.count').forEach(countUp);
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    document.querySelectorAll('.ledger, .benefit-list, .tiers, .people, .cta-actions, .steps, .places, .tickets, .price-rows').forEach((group) => {
      group.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, i) => el.style.setProperty('--rd', String(i * 80)));
    });
    document.querySelectorAll('[data-reveal], .stripes, .cta, [data-logo-stage]').forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    // Logo marquee runs only when motion is allowed; otherwise it is a static grid.
    document.querySelectorAll('[data-marquee]').forEach((m) => m.classList.toggle('is-animated', motion));

    // Pointer tilt + glare on images marked data-tilt.
    if (motion && matchMedia('(hover: hover)').matches) {
      let current: HTMLElement | null = null;
      const move = (e: PointerEvent) => {
        const el = (e.target as HTMLElement).closest<HTMLElement>('[data-tilt]');
        if (current && current !== el) { current.classList.remove('is-tilting'); current.style.removeProperty('--rx'); current.style.removeProperty('--ry'); }
        current = el;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.classList.add('is-tilting');
        el.style.setProperty('--rx', `${((px - 0.5) * 7).toFixed(2)}deg`);
        el.style.setProperty('--ry', `${((0.5 - py) * 7).toFixed(2)}deg`);
        el.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
        el.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
      };
      const leave = () => { if (current) { current.classList.remove('is-tilting'); current = null; } };
      document.addEventListener('pointermove', move, { passive: true });
      document.addEventListener('pointerleave', leave);
      cleanups.push(() => { document.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave); });
    }

    // Reading progress bar.
    const bar = document.querySelector<HTMLElement>('.progress span');
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar?.style.setProperty('--p', max > 0 ? (window.scrollY / max).toFixed(4) : '0');
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    cleanups.push(() => window.removeEventListener('scroll', onScroll));

    // The floating WhatsApp button steps aside where the page has its own call to action.
    const wa = document.querySelector('.whatsapp');
    if (wa) {
      const seen = new Set<Element>();
      const waIO = new IntersectionObserver((entries) => {
        entries.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
        wa.classList.toggle('is-away', seen.size > 0);
      });
      document.querySelectorAll('.cta, .site-footer').forEach((el) => waIO.observe(el));
      cleanups.push(() => { waIO.disconnect(); wa.classList.remove('is-away'); });
    }

    return () => cleanups.forEach((fn) => fn());
  }, [pathname]);

  return null;
}
