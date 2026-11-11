'use client';

import { useMemo, useState } from 'react';
import { useLocationSearch } from './hooks';
import { NewsCard } from '@/components/ui';
import type { NewsCardData, Region } from '@/lib/format';

const FILTERS: { id: 'all' | Region; label: string }[] = [
  { id: 'all', label: 'All' }, { id: 'africa', label: 'Africa' }, { id: 'asia', label: 'Asia' }, { id: 'aacci', label: 'AACCI' }, { id: 'world', label: 'World' },
];
const STEP = 12;

/** Every story from the newsroom: region filters, search and paging. The first page is server-rendered for crawlers. */
export default function NewsArchive({ items }: { items: NewsCardData[] }) {
  const search = useLocationSearch();
  const fromUrl = useMemo(() => {
    const p = new URLSearchParams(search);
    const r = p.get('region');
    return { region: (r && FILTERS.some((f) => f.id === r) ? r : 'all') as 'all' | Region, q: p.get('q') ?? '' };
  }, [search]);
  const [chosenRegion, setRegion] = useState<'all' | Region | null>(null);
  const [typed, setQ] = useState<string | null>(null);
  const region = chosenRegion ?? fromUrl.region;
  const q = typed ?? fromUrl.q;
  const [limit, setLimit] = useState(STEP + 1);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length };
    items.forEach((i) => { c[i.region] = (c[i.region] ?? 0) + 1; });
    return c;
  }, [items]);
  const term = q.trim().toLowerCase();
  const matches = useMemo(
    () => items.filter((i) => (region === 'all' || i.region === region) && (!term || `${i.title} ${i.excerpt}`.toLowerCase().includes(term))),
    [items, region, term],
  );
  const visible = matches.slice(0, limit);

  const choose = (r: 'all' | Region) => {
    setRegion(r);
    setLimit(STEP + 1);
    const url = new URL(location.href);
    if (r === 'all') url.searchParams.delete('region'); else url.searchParams.set('region', r);
    history.replaceState(null, '', url);
  };

  return (
    <>
      <div className="news-tools">
        <div className="filters" role="group" aria-label="Filter news by region">
          {FILTERS.filter((f) => counts[f.id]).map((f) => (
            <button key={f.id} type="button" className={`filter${region === f.id ? ' is-active' : ''}`} aria-pressed={region === f.id} onClick={() => choose(f.id)}>
              {f.label} <span className="filter-count">{counts[f.id]}</span>
            </button>
          ))}
        </div>
        <label className="field field--search"><span className="visually-hidden">Search news</span>
          <input type="search" placeholder="Search headlines" value={q} onChange={(e) => { setQ(e.target.value); setLimit(STEP + 1); }} autoComplete="off" /></label>
      </div>
      <p className="visually-hidden" aria-live="polite">{matches.length} stories</p>
      <ul className="news-list">
        {visible.map((p, i) => <NewsCard key={p.slug} post={p} lead={i === 0 && region === 'all' && !term} />)}
      </ul>
      {matches.length === 0 ? <p className="directory-empty">No stories match. Try another word or show all regions.</p> : null}
      {matches.length > limit ? (
        <div className="more-row">
          <button type="button" className="btn btn--line" onClick={() => setLimit(limit + STEP)}><span>Show more stories ({matches.length - limit} left)</span></button>
        </div>
      ) : null}
    </>
  );
}
