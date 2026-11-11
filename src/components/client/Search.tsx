'use client';

import { useRouter } from 'next/navigation';
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { asset } from '@/lib/base';

type Entry = { t: string; u: string; k: string; s?: string; d?: string };
const ORDER = ['Page', 'Person', 'Chapter', 'Event', 'Album', 'Committee', 'News'];
const GROUP_LABEL: Record<string, string> = { Page: 'Pages', Person: 'People', Chapter: 'Chapters and representatives', Event: 'Events', Album: 'Photo albums', Committee: 'Committees', News: 'News' };

let indexPromise: Promise<Entry[]> | null = null;
const loadIndex = () => (indexPromise ??= fetch(asset('/search-index.json')).then((r) => r.json()));
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

function rank(index: Entry[], query: string) {
  const tokens = norm(query).split(/\s+/).filter(Boolean);
  if (!tokens.length) return [];
  const phrase = tokens.join(' ');
  const scored: { e: Entry; score: number }[] = [];
  for (const e of index) {
    const title = norm(e.t);
    const hay = title + ' ' + norm(e.s ?? '');
    if (!tokens.every((t) => hay.includes(t))) continue;
    let score = 0;
    for (const t of tokens) {
      if (title.startsWith(t) || title.includes(' ' + t)) score += 6;
      else if (title.includes(t)) score += 4;
      else score += 1;
    }
    if (title.includes(phrase)) score += 5;
    if (e.k === 'Page') score += 3;
    if (e.k === 'Person' || e.k === 'Chapter') score += 1;
    if (e.d) score += Math.max(0, 2 - (Date.now() - Date.parse(e.d)) / (1000 * 60 * 60 * 24 * 365));
    scored.push({ e, score });
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, 40).map((x) => x.e);
}

function Highlight({ text, query }: { text: string; query: string }) {
  const tokens = norm(query).split(/\s+/).filter((t) => t.length > 1);
  if (!tokens.length) return <>{text}</>;
  const re = new RegExp(`(${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  return <>{text.split(re).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : <Fragment key={i}>{part}</Fragment>))}</>;
}

export function SearchBox({ initial = '', autoFocus = false, onNavigate }: { initial?: string; autoFocus?: boolean; onNavigate?: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState(initial);
  const [index, setIndex] = useState<Entry[] | null>(null);
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => { loadIndex().then(setIndex).catch(() => setIndex([])); }, []);
  useEffect(() => { if (autoFocus) input.current?.focus(); }, [autoFocus]);

  const results = useMemo(() => (index ? rank(index, q) : []), [index, q]);
  const grouped = useMemo(() => {
    const flat: Entry[] = [];
    const groups = ORDER.map((k) => ({ k, items: results.filter((r) => r.k === k) })).filter((g) => g.items.length)
      .map((g) => ({ k: g.k, items: g.items.map((e) => { flat.push(e); return { e, i: flat.length - 1 }; }) }));
    return { groups, flat };
  }, [results]);

  const go = useCallback((e: Entry) => { onNavigate?.(); router.push(e.u); }, [router, onNavigate]);
  const onKey = (ev: React.KeyboardEvent) => {
    if (ev.key === 'ArrowDown') { ev.preventDefault(); setActive((a) => Math.min(a + 1, grouped.flat.length - 1)); }
    if (ev.key === 'ArrowUp') { ev.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    if (ev.key === 'Enter' && grouped.flat[active]) { ev.preventDefault(); go(grouped.flat[active]); }
  };

  const status = !q.trim()
    ? 'Type a name, an event, a country or a topic.'
    : index === null ? 'Loading the search index…'
      : results.length ? `${results.length === 40 ? 'Top 40' : results.length} result${results.length > 1 ? 's' : ''} for “${q.trim()}”`
        : `Nothing matches “${q.trim()}”. Try a shorter word, a country or a person’s surname.`;

  return (
    <div className="search-panel">
      <div className="search-bar">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
        <input ref={input} type="search" value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }} onKeyDown={onKey}
          placeholder="Search pages, people, events and news" aria-label="Search the site" aria-controls="search-results"
          aria-activedescendant={grouped.flat[active] ? `sr-${active}` : undefined} autoComplete="off" spellCheck={false} />
        {onNavigate ? <button className="search-close" type="button" onClick={onNavigate} aria-label="Close search">Esc</button> : null}
      </div>
      <p className="search-status" aria-live="polite">{status}</p>
      <ul className="search-results" id="search-results" role="listbox" aria-label="Search results">
        {grouped.groups.map((g) => (
          <Fragment key={g.k}>
            <li className="search-group" role="presentation">{GROUP_LABEL[g.k]}</li>
            {g.items.map(({ e, i }) => {
              return (
                <li key={e.u + e.t} id={`sr-${i}`} role="option" aria-selected={i === active} className={`search-item${i === active ? ' is-active' : ''}`} onMouseEnter={() => setActive(i)}>
                  <a href={asset(e.u)} onClick={(ev) => { ev.preventDefault(); go(e); }}>
                    <b><Highlight text={e.t} query={q} /></b>
                    {e.d ? <time dateTime={e.d}>{new Date(e.d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</time> : null}
                    {e.s ? <small><Highlight text={e.s.length > 140 ? e.s.slice(0, 140) + '…' : e.s} query={q} /></small> : null}
                  </a>
                </li>
              );
            })}
          </Fragment>
        ))}
      </ul>
    </div>
  );
}

export default function SearchDialog() {
  const [open, setOpen] = useState(false);
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    const show = () => { opener.current = document.activeElement; setOpen(true); };
    const onKey = (e: KeyboardEvent) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement).tagName) || (e.target as HTMLElement).isContentEditable;
      if ((e.key === '/' && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) { e.preventDefault(); show(); }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('aacci:search', show);
    document.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('aacci:search', show); document.removeEventListener('keydown', onKey); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open && opener.current instanceof HTMLElement) opener.current.focus();
  }, [open]);

  if (!open) return null;
  return (
    <div className="search" role="dialog" aria-modal="true" aria-label="Search the site" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
      <SearchBox autoFocus onNavigate={() => setOpen(false)} />
    </div>
  );
}
