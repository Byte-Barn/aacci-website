'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { MapData, MapPin } from '@/lib/content';

const FILTERS = [
  { id: 'all', label: 'All', regions: null },
  { id: 'africa', label: 'Africa', regions: ['africa'] },
  { id: 'asia', label: 'Asia and the Gulf', regions: ['asia', 'gulf'] },
  { id: 'india', label: 'India', regions: ['india'] },
] as const;

type Tip = { pin: MapPin; left: number; top: number };

/** Halftone map of Asia and Africa with routes from the Global Secretariat to every chapter and representative. */
export default function WorldMap({ data, legend = true, focusKey }: { data: MapData; legend?: boolean; focusKey?: string | null }) {
  const svg = useRef<SVGSVGElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);
  const [pulses, setPulses] = useState(false);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('all');
  const [tip, setTip] = useState<Tip | null>(null);

  useEffect(() => {
    const motion = document.documentElement.classList.contains('motion');
    const t1 = setTimeout(() => setDrawn(true), motion ? 350 : 0);
    const t2 = motion ? setTimeout(() => setPulses(true), 3600) : undefined;
    return () => { clearTimeout(t1); if (t2) clearTimeout(t2); };
  }, []);

  // Pause the SVG clock while the map is off screen.
  useEffect(() => {
    if (!pulses || !svg.current) return;
    const el = svg.current;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? el.unpauseAnimations() : el.pauseAnimations()));
    io.observe(el);
    return () => io.disconnect();
  }, [pulses]);

  const show = useCallback((pin: MapPin) => {
    const fr = frame.current?.getBoundingClientRect();
    const dot = svg.current?.querySelector(`[data-key="${pin.key}"] .pin-dot`)?.getBoundingClientRect();
    if (!fr || !dot) return;
    const x = dot.left + dot.width / 2 - fr.left;
    const half = 140;
    const visL = Math.max(0, -fr.left) + 12;
    const visR = Math.min(fr.width, window.innerWidth - fr.left) - 12;
    const left = Math.min(Math.max(x, visL + half), visR - half);
    const y = dot.top - fr.top;
    setTip({ pin, left, top: y < 130 ? y + dot.height + 150 : y });
  }, []);

  // A place selected elsewhere on the page (aacci:pin event, or the focusKey prop) lights up its pin.
  useEffect(() => {
    const motion = document.documentElement.classList.contains('motion');
    const reveal = (key: string | null | undefined) => {
      const pin = data.pins.find((p) => p.key === key);
      if (!pin) return;
      frame.current?.scrollIntoView({ behavior: motion ? 'smooth' : 'auto', block: 'center' });
      setTimeout(() => show(pin), motion ? 650 : 0);
    };
    if (focusKey) reveal(focusKey);
    const onPin = (e: Event) => reveal((e as CustomEvent<string>).detail);
    window.addEventListener('aacci:pin', onPin);
    return () => window.removeEventListener('aacci:pin', onPin);
  }, [focusKey, data.pins, show]);

  useEffect(() => {
    const close = (e: MouseEvent) => { if (!(e.target as Element).closest?.('.pin')) setTip(null); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setTip(null); };
    const resize = () => setTip(null);
    document.addEventListener('click', close);
    document.addEventListener('keydown', esc);
    window.addEventListener('resize', resize);
    return () => { document.removeEventListener('click', close); document.removeEventListener('keydown', esc); window.removeEventListener('resize', resize); };
  }, []);

  const allowed = FILTERS.find((f) => f.id === filter)?.regions as readonly string[] | null;
  const dimmed = (region: string, hq = false) => !!allowed && !hq && !allowed.includes(region);
  const shown = data.pins.filter((p) => p.kind !== 'hq' && !dimmed(p.region)).length;
  const lit = tip?.pin.key;

  return (
    <div className="hero-map" id="map">
      <h2 className="visually-hidden">Where AACCI works</h2>
      <div className="map-frame" ref={frame}>
        <svg ref={svg} className={`map${drawn ? ' is-drawn' : ''}${lit ? ' is-focus' : ''}`} viewBox={`0 0 ${data.width} ${data.height}`} aria-hidden="true" focusable="false">
          <defs>
            <mask id="land-reveal" maskUnits="userSpaceOnUse" x="0" y="0" width={data.width} height={data.height}>
              <circle className="land-reveal" cx={data.origin.x} cy={data.origin.y} r="2000" fill="#fff" />
            </mask>
          </defs>
          <g className="graticule"><path d={`M0 ${data.equatorY}H${data.width}`} /><text x={data.width - 12} y={data.equatorY - 8} textAnchor="end">Equator</text></g>
          <path className="land" mask="url(#land-reveal)" d={data.dots} />
          <g className="routes">
            {data.routes.map((r) => (
              <g key={r.key} className={`route${r.exit ? ' route--exit' : ''}${r.key === lit ? ' is-lit' : ''}${dimmed(r.region) || (allowed && r.exit) ? ' is-dim' : ''}`}
                data-key={r.key} style={{ '--d': `${r.delay}s` } as React.CSSProperties}>
                <path className="route-r" pathLength={1} d={r.r} />
                <path className="route-g" pathLength={1} d={r.g} />
                <path className="route-o" pathLength={1} id={`rt-${r.key}`} d={r.o} />
              </g>
            ))}
            {data.exitLabels.map((l) => <text key={l.text} className="exit-label" x={l.x} y={l.y} textAnchor={l.anchor}>{l.text}</text>)}
          </g>
          {pulses ? (
            <g className="pulses">
              {data.routes.filter((r) => !r.exit).map((r, i) => {
                const dur = `${(3.2 + (i % 5) * 0.55).toFixed(2)}s`;
                const begin = `${(i * 0.37).toFixed(2)}s`;
                return (
                  <circle key={r.key} r="3.4" className="pulse-dot" opacity="0">
                    <animateMotion dur={dur} repeatCount="indefinite" begin={begin}><mpath href={`#rt-${r.key}`} /></animateMotion>
                    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.12;.82;1" dur={dur} repeatCount="indefinite" begin={begin} />
                  </circle>
                );
              })}
            </g>
          ) : null}
          <g className="pins">
            {data.pins.map((p) => (
              <g key={p.key} className={`pin pin--${p.kind}${p.key === lit ? ' is-active' : ''}${dimmed(p.region, p.kind === 'hq') ? ' is-dim' : ''}`}
                data-key={p.key} tabIndex={0} role="button" aria-label={`${p.name}: ${p.role}. ${p.note}`}
                style={{ '--pd': `${(data.routes.find((r) => r.key === p.key)?.delay ?? -0.7) + 1.3}s` } as React.CSSProperties}
                onPointerEnter={(e) => e.pointerType === 'mouse' && show(p)} onPointerLeave={(e) => e.pointerType === 'mouse' && setTip(null)}
                onFocus={() => show(p)} onBlur={() => setTip(null)}
                onClick={(e) => { e.stopPropagation(); if (tip?.pin.key === p.key) setTip(null); else show(p); }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(p); } }}>
                <circle className="pin-pulse" cx={p.x} cy={p.y} r="5" />
                <circle className="pin-hit" cx={p.x} cy={p.y} r="15" />
                <circle className="pin-dot" cx={p.x} cy={p.y} r={p.kind === 'hq' ? 7 : 4.6} />
                {p.label ? <text x={p.label.x} y={p.label.y} textAnchor={p.label.anchor}>{p.name}</text> : null}
              </g>
            ))}
          </g>
        </svg>
        {tip ? (
          <div className="map-tip" role="status" aria-live="polite" style={{ left: tip.left, top: tip.top }}>
            <p className="map-tip-name">{tip.pin.name}</p>
            <p className="map-tip-role">{tip.pin.role}</p>
            <p className="map-tip-note">{tip.pin.note}</p>
          </div>
        ) : null}
      </div>
      {legend ? (
        <div className={`map-legend${drawn ? ' is-in' : ''}`}>
          <p className="map-legend-title">Routes from the Global Secretariat in Ahmedabad</p>
          <div className="map-filters" role="group" aria-label="Show places in">
            {FILTERS.map((f) => (
              <button key={f.id} type="button" className={`map-filter${filter === f.id ? ' is-active' : ''}`} aria-pressed={filter === f.id}
                onClick={() => { setFilter(f.id); setTip(null); }}>{f.label}</button>
            ))}
          </div>
          <p className="map-count" aria-live="polite">{allowed ? `${shown} places shown` : ''}</p>
          <ul>
            <li><i className="key key--hq" />Secretariats <b>2</b></li>
            <li><i className="key key--chapter" />Chapters and country offices <b>16</b></li>
            <li><i className="key key--rep" />Official representatives <b>7</b></li>
          </ul>
          <p className="map-legend-note">Plus chapters in the USA and Jamaica, and representatives in France and Mexico. Select a point to see who leads it.</p>
        </div>
      ) : null}
    </div>
  );
}
