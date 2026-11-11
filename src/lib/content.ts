// Content loaded at build time. Server components only: importing this into a client component would ship the JSON to the browser.
import siteJson from '@/content/site.json';
import newsJson from '@/content/news.json';
import galleryJson from '@/content/gallery.json';
import mapJson from '@/content/map.json';
import type { NewsCardData, NewsImage, Region } from '@/lib/format';

export { REGION_LABEL, formatDate, readingTime } from '@/lib/format';
export type { NewsCardData, NewsImage, Region } from '@/lib/format';

export type Member = { group: 'council' | 'advisory'; country: string; name: string; role: string[] };
export type NewsPost = NewsCardData & { html: string; source: string };
export type Photo = { full: string; thumb: string; w: number; h: number };
export type Album = { slug: string; title: string; meta: string; photos: Photo[] };
export type MapPin = {
  key: string; name: string; role: string; note: string; kind: 'hq' | 'chapter' | 'rep'; region: string;
  x: number; y: number; label: { x: number; y: number; anchor: 'start' | 'end' | 'middle' } | null;
};
export type MapRoute = { key: string; region: string; delay: number; exit: boolean; r: string; g: string; o: string };
export type MapData = {
  width: number; height: number; origin: { x: number; y: number }; equatorY: number; dots: string;
  routes: MapRoute[]; pins: MapPin[]; exitLabels: { text: string; x: number; y: number; anchor: 'start' | 'end' | 'middle' }[];
};

export const site = siteJson as {
  members: Member[];
  pages: Record<string, string>;
  careers: { title: string; html: string }[];
  industries: string[];
  press: string[];
};
export const news = newsJson as NewsPost[];
export const albums = galleryJson as Album[];
export const mapData = mapJson as MapData;

export const latestNews = (n: number) => news.slice(0, n);
export const newsBySlug = (slug: string) => news.find((p) => p.slug === slug);
export const toCard = ({ html: _html, source: _source, ...rest }: NewsPost): NewsCardData => rest;

export function relatedNews(post: NewsPost, n = 3) {
  const same = news.filter((p) => p.slug !== post.slug && p.region === post.region);
  const others = news.filter((p) => p.slug !== post.slug && p.region !== post.region);
  return [...same, ...others].slice(0, n);
}

export const isRegion = (r: string): r is Region => ['africa', 'asia', 'aacci', 'world'].includes(r);
export type { NewsImage as Image };
