// Small helpers safe to use in client components (no content JSON imported here).

export type Region = 'africa' | 'asia' | 'aacci' | 'world';
export type NewsImage = { src: string; thumb: string; w: number; h: number };
export type NewsCardData = {
  slug: string; title: string; date: string; modified: string; region: Region; excerpt: string; words: number; image: NewsImage | null;
};

export const REGION_LABEL: Record<Region, string> = { africa: 'Africa', asia: 'Asia', aacci: 'AACCI', world: 'World' };

export function formatDate(iso: string) {
  const d = new Date(iso.slice(0, 10) + 'T00:00:00Z');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export const readingTime = (words: number) => Math.max(1, Math.round(words / 220));

export const usd = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
