'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { MEMBERSHIP, TIMELINE, CHAPTERS, type Place } from '@/content/data';
import { usd } from '@/lib/format';
import type { MapData, Member } from '@/lib/content';
import { useIntro, useLocationSearch, useMotion } from './hooks';
import WorldMap from './WorldMap';
import { asset } from '@/lib/base';

const motionOn = () => typeof document !== 'undefined' && document.documentElement.classList.contains('motion');

/** Home hero: the logo intro plays once per session, then the headline rises. */
export function HeroIntro() {
  const intro = useIntro();
  const [done, setDone] = useState(false);
  useEffect(() => {
    const hero = document.querySelector('.hero');
    if (!intro) { hero?.classList.add('is-ready'); return; }
    const t1 = setTimeout(() => hero?.classList.add('is-ready'), 950);
    const t2 = setTimeout(() => setDone(true), 1900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [intro]);
  if (!intro || done) return null;
  return (
    <div className="loader" aria-hidden="true">
      <img className="loader-logo" src={asset('/img/aacci-logo-light.png')} alt="" width={120} height={120} />
      <span className="loader-stripe loader-stripe--r" /><span className="loader-stripe loader-stripe--g" /><span className="loader-stripe loader-stripe--o" />
    </div>
  );
}

/** Events since 2018 as a horizontal track that travels as you scroll (pinned on large screens). */
export function Timeline() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const [pinned, setPinned] = useState(false);
  const [height, setHeight] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(TIMELINE[0].year);

  useEffect(() => {
    const tl = wrap.current, tr = track.current;
    if (!tl || !tr) return;
    let distance = 0, raf = 0;
    const pick = () => {
      const anchor = window.innerWidth * 0.3;
      let best = TIMELINE[0].year;
      tr.querySelectorAll<HTMLElement>('.tl-year').forEach((el) => { if (el.getBoundingClientRect().left <= anchor) best = Number(el.dataset.year); });
      setCurrent(best);
    };
    const frame = () => {
      if (tl.classList.contains('is-pinned')) {
        const p = distance ? Math.min(1, Math.max(0, -tl.getBoundingClientRect().top / distance)) : 0;
        tr.style.transform = `translate3d(${(-p * distance).toFixed(1)}px,0,0)`;
        setProgress(p);
      } else {
        const max = tr.scrollWidth - tr.clientWidth;
        setProgress(max > 0 ? tr.scrollLeft / max : 0);
      }
      pick();
    };
    const layout = () => {
      const pin = motionOn() && window.innerWidth >= 960 && window.innerHeight >= 620;
      tr.style.transform = '';
      tl.classList.toggle('is-pinned', pin);
      setPinned(pin);
      distance = pin ? Math.max(0, tr.scrollWidth - window.innerWidth) : 0;
      setHeight(pin ? distance + window.innerHeight : null);
      frame();
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); };
    let rt: ReturnType<typeof setTimeout>;
    const onResize = () => { clearTimeout(rt); rt = setTimeout(layout, 150); };
    window.addEventListener('scroll', onScroll, { passive: true });
    tr.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    layout();
    return () => { window.removeEventListener('scroll', onScroll); tr.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <div className={`timeline${pinned ? ' is-pinned' : ''}`} id="timeline" ref={wrap} style={height ? ({ '--tl-h': `${height}px` } as React.CSSProperties) : undefined}>
      <div className="timeline-sticky">
        <div className="wrap timeline-bar">
          <div className="timeline-rail" aria-hidden="true"><span style={{ '--tp': progress } as React.CSSProperties} /></div>
          <p className="timeline-hint">{pinned ? 'Scroll to travel through the years' : 'Swipe or scroll sideways'}</p>
        </div>
        <ol className="timeline-track" ref={track} tabIndex={0} aria-label="Events by year, scroll sideways">
          {TIMELINE.map((y) => (
            <li key={y.year} className={`tl-year${y.photo ? ' tl-year--photo' : ''}${current === y.year ? ' is-current' : ''}`} data-year={y.year}>
              <h3 className="tl-label">{y.year}</h3>
              {y.photo ? <div className="fx tl-fx" data-tilt=""><img className="tl-photo" src={asset(y.photo.src)} alt={y.photo.alt} width={640} height={360} loading="lazy" decoding="async" /></div> : null}
              <ul className="tl-events">
                {y.events.map((e) => (
                  <li key={e.name}>
                    {e.iso ? <time className="tl-date" dateTime={e.iso}>{e.date}</time> : <span className="tl-date">{e.date}</span>}
                    <span className="tl-name">{e.name}</span><span className="tl-place">{e.place}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/** Membership fee finder: who is joining, their size or reach, and the first-year cost. */
export function FeeFinder() {
  const [who, setWho] = useState(0);
  const [opt, setOpt] = useState(0);
  const cat = MEMBERSHIP.categories[who];
  const annual = cat.options[Math.min(opt, cat.options.length - 1)].fee;
  const total = annual + MEMBERSHIP.admission;
  const motion = useMotion();
  const [tweened, setShown] = useState({ annual, total });
  const shown = motion ? tweened : { annual, total };
  const frames = useRef<number[]>([]);

  useEffect(() => {
    frames.current.forEach(cancelAnimationFrame);
    if (!motion) return;
    const from = { ...tweened };
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 600);
      const e = 1 - Math.pow(1 - t, 3);
      setShown({ annual: from.annual + (annual - from.annual) * e, total: from.total + (total - from.total) * e });
      if (t < 1) frames.current = [requestAnimationFrame(step)];
    };
    frames.current = [requestAnimationFrame(step)];
    return () => frames.current.forEach(cancelAnimationFrame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annual, total, motion]);

  const applyLabel = useMemo(() => {
    const o = cat.options[Math.min(opt, cat.options.length - 1)].label.toLowerCase();
    return { associate: `Associate: ${o} chamber or trade body`, corporate: `Corporate: ${o}`, patron: 'Patron or benefactor', individual: 'Individual' }[cat.id] ?? '';
  }, [cat, opt]);

  const pickInForm = () => {
    const el = document.querySelector<HTMLSelectElement>('[data-category-select]');
    if (!el) return;
    const o = Array.from(el.options).find((x) => x.text === applyLabel);
    if (o) { el.value = o.value; el.dispatchEvent(new Event('change', { bubbles: true })); }
  };

  return (
    <form className="finder" aria-label="Membership fee finder" onSubmit={(e) => e.preventDefault()}>
      <fieldset className="finder-step">
        <legend>Who is joining?</legend>
        <div className="choice-row">
          {MEMBERSHIP.categories.map((c, i) => (
            <label className="choice" key={c.id}>
              <input type="radio" name="who" value={c.id} checked={who === i} onChange={() => { setWho(i); setOpt(0); }} />
              <span><b>{c.who}</b><small>{c.name}</small></span>
            </label>
          ))}
        </div>
      </fieldset>
      {cat.options.length > 1 ? (
        <fieldset className="finder-step" data-scope="">
          <legend>{cat.scopeLabel}</legend>
          <div className="choice-row choice-row--small">
            {cat.options.map((o, i) => (
              <label className="choice" key={o.label}>
                <input type="radio" name="scope" value={o.fee} checked={opt === i} onChange={() => setOpt(i)} />
                <span><b>{o.label}</b><small>{usd(o.fee)} a year</small></span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}
      <output className="quote" aria-live="polite">
        <div className="quote-main">
          <p className="quote-cat" key={cat.id}>{cat.name}</p>
          <p className="quote-desc">{cat.desc}</p>
        </div>
        <dl className="quote-figures">
          <div><dt>Annual subscription</dt><dd>{usd(shown.annual)}</dd></div>
          <div><dt>Admission fee, paid once</dt><dd>{usd(MEMBERSHIP.admission)}</dd></div>
          <div className="quote-total"><dt>Your first year</dt><dd>{usd(shown.total)}</dd></div>
        </dl>
        <p className="quote-note">Members in India pay 18% GST on the admission fee. Memberships run for one year from the date you join or renew.</p>
        <a className="btn btn--primary" href="#apply" onClick={pickInForm}><span>{cat.cta}</span></a>
      </output>
    </form>
  );
}

const DIRECTORY_STEP = 12;

/** Advisory board directory with search and a country filter. Reads ?q= so search results can link straight to a person. */
export function Directory({ members }: { members: Member[] }) {
  const search = useLocationSearch();
  const [typed, setQ] = useState<string | null>(null);
  const q = typed ?? (new URLSearchParams(search).get('q') ?? '');
  const [country, setCountry] = useState('');
  const countries = useMemo(() => {
    const c: Record<string, number> = {};
    members.forEach((m) => { c[m.country] = (c[m.country] ?? 0) + 1; });
    return Object.entries(c).sort(([a], [b]) => a.localeCompare(b));
  }, [members]);
  const [limit, setLimit] = useState(DIRECTORY_STEP);
  const term = q.trim().toLowerCase();
  const shown = members.filter((m) => (!country || m.country === country) && (!term || `${m.name} ${m.role.join(' ')} ${m.country}`.toLowerCase().includes(term)));
  // Everyone stays in the HTML for crawlers; without a search the list opens a page at a time so phones aren't faced with 123 cards.
  const filtering = Boolean(term || country);
  const visible = new Set(filtering ? shown : shown.slice(0, limit));

  return (
    <div className="directory">
      <div className="directory-tools">
        <label className="field field--search"><span className="visually-hidden">Search the advisory board</span>
          <input type="search" placeholder="Search names, companies or roles" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" /></label>
        <label className="field field--select"><span className="visually-hidden">Filter by country</span>
          <select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">All countries</option>
            {countries.map(([c, n]) => <option key={c} value={c}>{c} ({n})</option>)}
          </select></label>
        <p className="directory-count" aria-live="polite">{shown.length === members.length ? `${members.length} advisers` : `Showing ${shown.length} of ${members.length} advisers`}</p>
      </div>
      <ul className="members">
        {members.map((m, i) => (
          <MemberCard key={m.name + i} m={m} index={i} hidden={!visible.has(m)} />
        ))}
      </ul>
      {shown.length === 0 ? <p className="directory-empty">No advisers match that search. Try a shorter name or choose all countries.</p> : null}
      {!filtering && shown.length > limit ? (
        <div className="more-row">
          <button type="button" className="btn btn--line" onClick={() => setLimit(limit + DIRECTORY_STEP)}><span>Show more advisers ({shown.length - limit} left)</span></button>
        </div>
      ) : null}
    </div>
  );
}

export function initials(name: string) {
  const skip = new Set(['dr', 'mr', 'mrs', 'ms', 'prof', 'h', 'e', 'he', 'amb', 'adv', 'ca', 'engr', 'rev', 'brig', 'retd', 'dra', 'hc', 'sri', 'shri', 'hrh']);
  const words = name.replace(/\(.*?\)/g, '').replace(/\./g, ' ').split(/\s+/).filter((w) => w && !skip.has(w.toLowerCase()));
  return words.length ? (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : '')).toUpperCase() : '·';
}

export function MemberCard({ m, index, hidden = false }: { m: Member; index: number; hidden?: boolean }) {
  return (
    <li className={`member${hidden ? ' is-hidden' : ''}`} style={{ '--n': index % 3 } as React.CSSProperties}>
      <span className="member-mono" aria-hidden="true">{initials(m.name)}</span>
      <p className="member-name">{m.name}</p>
      <p className="member-role">{m.role.map((r) => <span key={r}>{r}</span>)}</p>
      <p className="member-country">{m.country}</p>
    </li>
  );
}

/** Chapters page lists: selecting a place shows it on the map (the map listens for the aacci:pin event). */
export function PlaceList({ group, compact = false }: { group: keyof typeof CHAPTERS; compact?: boolean }) {
  const [active, setActive] = useState<string | null>(null);
  const pick = (p: Place) => {
    if (!p.pin) return;
    setActive(p.pin);
    window.dispatchEvent(new CustomEvent('aacci:pin', { detail: p.pin }));
  };
  return (
    <ul className={`places${compact ? ' places--compact' : ''}`}>
      {CHAPTERS[group].map((p) => (
        <li key={p.name + p.lead} className={`place${active && p.pin === active ? ' is-active' : ''}`} data-reveal=""
          {...(p.pin ? {
            tabIndex: 0, role: 'button', 'aria-label': `${p.name}, ${p.lead}. Show on the map`, onClick: () => pick(p),
            onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(p); } },
          } : {})}>
          <p className="place-name">{p.name}</p><p className="place-lead">{p.lead}</p>
        </li>
      ))}
    </ul>
  );
}

export { WorldMap };
export type { MapData };

/** Policies page: the side menu follows the section you are reading. */
export function PolicyNav({ items }: { items: { id: string; label: string }[] }) {
  const [cur, setCur] = useState(items[0].id);
  // Work out the current section from the scroll position, so jumps (Home key, anchor links) are right too.
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => Boolean(el));
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.35;
      const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let id = items[0].id;
      for (const el of els) if (el.getBoundingClientRect().top <= line) id = el.id;
      setCur(atEnd && els.length ? els[els.length - 1].id : id);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    raf = requestAnimationFrame(update);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, [items]);
  return (
    <nav className="policy-nav" aria-label="Policies">
      <ul>{items.map((i) => <li key={i.id}><a href={`#${i.id}`} className={cur === i.id ? 'is-current' : undefined}>{i.label}</a></li>)}</ul>
    </nav>
  );
}
