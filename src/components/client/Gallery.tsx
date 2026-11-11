'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Album } from '@/lib/content';

const motionOn = () => typeof document !== 'undefined' && document.documentElement.classList.contains('motion');

/**
 * Event photo gallery. Albums are fanned decks of photos; the chosen album opens as a masonry wall
 * that keeps each photo's real shape. The viewer has a filmstrip, swipe, keyboard control and a slideshow.
 */
export default function Gallery({ albums }: { albums: Album[] }) {
  const [a, setA] = useState(0);
  const [view, setView] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const decks = useRef<(HTMLButtonElement | null)[]>([]);
  const opener = useRef<HTMLElement | null>(null);
  const album = albums[a];
  const photos = album.photos;

  const pickAlbum = (i: number, focus = false) => {
    setA(i);
    if (focus) decks.current[i]?.focus();
    decks.current[i]?.scrollIntoView({ behavior: motionOn() ? 'smooth' : 'auto', block: 'nearest', inline: 'nearest' });
  };
  const open = (i: number, el: HTMLElement) => { opener.current = el; setView(i); };
  const close = useCallback(() => { setView(null); setPlaying(false); opener.current?.focus(); }, []);
  const step = useCallback((d: number) => setView((v) => (v === null ? v : (v + d + photos.length) % photos.length)), [photos.length]);

  useEffect(() => {
    if (view === null) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === ' ') { e.preventDefault(); setPlaying((p) => !p); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', onKey); };
  }, [view, close, step]);

  // Slideshow.
  useEffect(() => {
    if (!playing || view === null) return;
    const t = setTimeout(() => step(1), 4500);
    return () => clearTimeout(t);
  }, [playing, view, step]);

  // Keep the active thumbnail in view and preload the next photo.
  const strip = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (view === null) return;
    strip.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ block: 'nearest', inline: 'center' });
    const next = new Image();
    next.src = photos[(view + 1) % photos.length].full;
  }, [view, photos]);

  // Swipe on touch screens.
  const touch = useRef<number | null>(null);

  return (
    <div className="gallery-app">
      <div className="decks" role="tablist" aria-label="Events in the gallery">
        {albums.map((al, i) => (
          <button key={al.slug} ref={(el) => { decks.current[i] = el; }} className="deck" role="tab" aria-selected={i === a} aria-controls="album-panel"
            id={`deck-${al.slug}`} tabIndex={i === a ? 0 : -1} onClick={() => pickAlbum(i)}
            onKeyDown={(e) => {
              const d = ({ ArrowRight: 1, ArrowLeft: -1 } as Record<string, number>)[e.key];
              if (d) { e.preventDefault(); pickAlbum((i + d + albums.length) % albums.length, true); }
            }}>
            <span className="deck-stack" aria-hidden="true">
              {al.photos.slice(0, 3).map((p) => <img key={p.thumb} src={p.thumb} alt="" width={640} height={427} loading="lazy" decoding="async" />)}
            </span>
            <span className="deck-title">{al.title}</span>
            <span className="deck-meta">{al.meta}, {al.photos.length} photo{al.photos.length > 1 ? 's' : ''}</span>
          </button>
        ))}
      </div>

      <div className="album-in" id="album-panel" role="tabpanel" aria-labelledby={`deck-${album.slug}`} key={album.slug}>
        <div className="album-bar">
          <div><h3>{album.title}</h3><p>{album.meta}. {photos.length} photo{photos.length > 1 ? 's' : ''}.</p></div>
          <button type="button" className="btn btn--line" onClick={(e) => { open(0, e.currentTarget); setPlaying(true); }}><span>Play slideshow</span></button>
        </div>
        <ul className="masonry">
          {photos.map((p, i) => (
            <li className="tile" key={p.full} style={{ '--i': i } as React.CSSProperties}>
              <button type="button" className="fx" data-tilt="" onClick={(e) => open(i, e.currentTarget)} aria-label={`Open photo ${i + 1} of ${photos.length}: ${album.title}`}>
                <img src={p.thumb} alt={`${album.title}, photo ${i + 1}`} width={p.w} height={p.h} loading="lazy" decoding="async" />
                <span className="tile-cap" aria-hidden="true"><span>{album.title}</span><span>{String(i + 1).padStart(2, '0')}</span></span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {view !== null ? (
        <div className={`viewer${playing ? ' is-playing' : ''}`} role="dialog" aria-modal="true" aria-label={`${album.title}: photo viewer`}>
          <div className="viewer-top">
            <p className="viewer-title">{album.title}, {album.meta}</p>
            <span className="viewer-count" aria-live="polite">{view + 1} / {photos.length}</span>
            <button type="button" className="viewer-btn" onClick={() => setPlaying(!playing)} aria-pressed={playing}>{playing ? 'Pause' : 'Play'}</button>
            <button type="button" className="viewer-btn" onClick={close} aria-label="Close photo viewer" autoFocus>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>
          <div className="viewer-stage" onClick={(e) => { if (e.target === e.currentTarget) close(); }}
            onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => { if (touch.current === null) return; const dx = e.changedTouches[0].clientX - touch.current; if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1); touch.current = null; }}>
            <button type="button" className="viewer-btn viewer-nav viewer-prev" onClick={() => step(-1)} aria-label="Previous photo"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button>
            <img key={photos[view].full} className="is-in" src={photos[view].full} alt={`${album.title}, photo ${view + 1}`} width={photos[view].w} height={photos[view].h} />
            <button type="button" className="viewer-btn viewer-nav viewer-next" onClick={() => step(1)} aria-label="Next photo"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></button>
            <span className="viewer-progress" key={`p-${view}-${playing}`} aria-hidden="true" />
          </div>
          <div className="viewer-strip" ref={strip}>
            {photos.map((p, i) => (
              <button key={p.thumb} type="button" aria-label={`Photo ${i + 1}`} aria-current={i === view} onClick={() => setView(i)}>
                <img src={p.thumb} alt="" width={84} height={60} loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
