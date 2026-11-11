'use client';

import { useEffect, useRef, useState } from 'react';
import { SERVICES, ETHIOPIA, TESTIMONIALS } from '@/content/data';
import { useMotion } from './hooks';

const motionOn = () => typeof document !== 'undefined' && document.documentElement.classList.contains('motion');

/** Services as tabs; the photo wipes across diagonally when the tab changes. */
export function ServicesTabs() {
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (i: number, focus = false) => {
    if (i === cur) return;
    setPrev(cur);
    setCur(i);
    if (focus) tabs.current[i]?.focus();
  };
  useEffect(() => {
    if (prev === null) return;
    const t = setTimeout(() => setPrev(null), 950);
    return () => clearTimeout(t);
  }, [prev, cur]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const step = ({ ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 } as Record<string, number>)[e.key];
    if (step) { e.preventDefault(); select((i + step + SERVICES.length) % SERVICES.length, true); }
    if (e.key === 'Home') { e.preventDefault(); select(0, true); }
    if (e.key === 'End') { e.preventDefault(); select(SERVICES.length - 1, true); }
  };

  return (
    <div className="services-grid">
      <div className="service-list" role="tablist" aria-label="Services" aria-orientation="vertical">
        {SERVICES.map((s, i) => (
          <button key={s.id} ref={(el) => { tabs.current[i] = el; }} className="service-tab" role="tab" id={`svc-tab-${i}`} aria-controls="svc-panel"
            aria-selected={i === cur} tabIndex={i === cur ? 0 : -1} onClick={() => select(i)} onKeyDown={(e) => onKey(e, i)}>
            <span className="service-name">{s.name}</span>
            <span className="service-desc">{s.short}</span>
          </button>
        ))}
      </div>
      <figure className="service-panel" id="svc-panel" role="tabpanel" aria-labelledby={`svc-tab-${cur}`}>
        <div className="service-media fx" data-tilt="">
          {SERVICES.map((s, i) => (
            (i === cur || i === prev) ? (
              <img key={s.id} className={`service-img${i === cur && prev !== null && motionOn() ? ' is-entering' : ''}`} src={s.img} alt={i === cur ? s.alt : ''}
                width={1500} height={600} style={{ zIndex: i === cur ? 2 : 1 }} />
            ) : null
          ))}
        </div>
      </figure>
    </div>
  );
}

/** Horizontal reel of the Ethiopia meetings: snap scrolling, drag with the mouse, arrow buttons and a little parallax. */
export function Reel() {
  const track = useRef<HTMLOListElement>(null);
  const [index, setIndex] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const cards = Array.from(el.querySelectorAll<HTMLElement>('.reel-card'));
    const stepW = () => cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap || '0');
    let raf = 0;
    const update = () => {
      setIndex(Math.min(cards.length - 1, Math.round(el.scrollLeft / stepW())));
      setEdges({ start: el.scrollLeft < 4, end: el.scrollLeft > el.scrollWidth - el.clientWidth - 4 });
      if (motionOn()) {
        const mid = window.innerWidth / 2;
        cards.forEach((c) => {
          const r = c.getBoundingClientRect();
          c.querySelector('img')?.style.setProperty('--px', `${(((r.left + r.width / 2 - mid) / window.innerWidth) * -7).toFixed(2)}%`);
        });
      }
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();

    // Drag to scroll with a mouse.
    let down = false, moved = false, startX = 0, startLeft = 0;
    const pd = (e: PointerEvent) => { if (e.pointerType !== 'mouse' || e.button !== 0) return; down = true; moved = false; startX = e.clientX; startLeft = el.scrollLeft; };
    const pm = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 5) { moved = true; el.classList.add('is-dragging'); }
      if (moved) el.scrollLeft = startLeft - dx;
    };
    const pu = () => {
      if (!down) return;
      down = false;
      if (moved) { el.classList.remove('is-dragging'); el.scrollTo({ left: Math.round(el.scrollLeft / stepW()) * stepW(), behavior: 'smooth' }); }
    };
    el.addEventListener('pointerdown', pd);
    window.addEventListener('pointermove', pm);
    window.addEventListener('pointerup', pu);
    return () => {
      el.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll);
      el.removeEventListener('pointerdown', pd); window.removeEventListener('pointermove', pm); window.removeEventListener('pointerup', pu);
    };
  }, []);

  const go = (dir: number) => {
    const el = track.current;
    const card = el?.querySelector('.reel-card');
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + 24), behavior: motionOn() ? 'smooth' : 'auto' });
  };

  return (
    <div className="reel">
      <ol className="reel-track" ref={track} tabIndex={0} aria-label="Meetings in Ethiopia, scroll sideways"
        onKeyDown={(e) => { if (e.key === 'ArrowRight') { e.preventDefault(); go(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); } }}>
        {ETHIOPIA.map((m) => (
          <li className="reel-card" key={m.img}>
            <figure>
              <div className="reel-media fx" data-tilt=""><img src={m.img} alt={m.alt} width={1500} height={392} loading="lazy" decoding="async" /></div>
              <figcaption><span className="reel-org">{m.org}</span><span className="reel-who">{m.who}</span></figcaption>
            </figure>
          </li>
        ))}
      </ol>
      <div className="wrap reel-foot">
        <p className="reel-note">Each meeting was held with Dr. G.D. Singh, Founder and Chairman of AACCI.</p>
        <div className="reel-controls">
          <span className="reel-count" aria-hidden="true"><b>{index + 1}</b> / {ETHIOPIA.length}</span>
          <button className="round-btn" type="button" aria-label="Previous meeting" disabled={edges.start} onClick={() => go(-1)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button>
          <button className="round-btn" type="button" aria-label="Next meeting" disabled={edges.end} onClick={() => go(1)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></button>
        </div>
      </div>
    </div>
  );
}

/** Member testimonials: auto-advancing, pausable, paused on hover and focus. */
export function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const motion = useMotion();
  const [visible, setVisible] = useState(false);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stage.current) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(stage.current);
    return () => io.disconnect();
  }, []);
  const playing = motion && !paused && !hover && visible;
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setI((n) => (n + 1) % TESTIMONIALS.length), 7000);
    return () => clearTimeout(t);
  }, [playing, i]);

  return (
    <div className={`voices-stage${playing ? ' is-playing' : ''}`} ref={stage} aria-roledescription="carousel" aria-label="Member testimonials"
      style={{ '--vd': '7s' } as React.CSSProperties} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}
      onFocus={() => setHover(true)} onBlur={() => setHover(false)}>
      {TESTIMONIALS.map((t, n) => (
        <figure key={t.name} className={`voice${n === i ? ' is-current' : ''}`} aria-roledescription="slide" aria-label={`${n + 1} of ${TESTIMONIALS.length}`} aria-hidden={n !== i}>
          <blockquote><p>{t.quote}</p></blockquote>
          <figcaption><img src={t.img} alt="" width={150} height={150} loading="lazy" /><span><b>{t.name}</b>{t.role}</span></figcaption>
        </figure>
      ))}
      <div className="voices-nav">
        {TESTIMONIALS.map((t, n) => (
          <button key={t.name} type="button" className={`voices-dot${n === i ? ' is-current' : ''}`} aria-label={`Show testimonial ${n + 1}`}
            aria-current={n === i ? 'true' : undefined} onClick={() => setI(n)}><span key={n === i ? `on-${i}` : 'off'} /></button>
        ))}
        {motion ? (
          <button type="button" className="voices-pause" aria-pressed={paused} aria-label={paused ? 'Play testimonials' : 'Pause testimonials'} onClick={() => setPaused(!paused)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path className="i-pause" d="M8 5v14M16 5v14" /><path className="i-play" d="M7 5l12 7-12 7z" /></svg>
          </button>
        ) : null}
      </div>
    </div>
  );
}
