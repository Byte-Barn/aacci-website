import type { MetadataRoute } from 'next';
import { SITE } from '@/content/data';
import { news } from '@/lib/content';

export const dynamic = 'force-static';

const PAGES: [string, number, MetadataRoute.Sitemap[number]['changeFrequency']][] = [
  ['/', 1, 'weekly'], ['/about/', 0.8, 'monthly'], ['/leadership/', 0.7, 'monthly'], ['/chapters/', 0.7, 'monthly'],
  ['/membership/', 0.9, 'monthly'], ['/services/', 0.7, 'monthly'], ['/events/', 0.8, 'weekly'], ['/news/', 0.9, 'daily'],
  ['/contact/', 0.6, 'yearly'], ['/careers/', 0.5, 'monthly'], ['/policies/', 0.3, 'yearly'],
];

export default function sitemap(): MetadataRoute.Sitemap {
  const latest = (news[0]?.modified ?? new Date().toISOString()).slice(0, 10);
  return [
    ...PAGES.map(([path, priority, changeFrequency]) => ({
      url: `${SITE.url}${path}`, lastModified: path === '/' || path === '/news/' ? latest : '2026-11-11', changeFrequency, priority,
    })),
    ...news.map((p) => ({
      url: `${SITE.url}/news/${p.slug}/`, lastModified: p.modified.slice(0, 10), changeFrequency: 'yearly' as const, priority: 0.5,
      ...(p.image ? { images: [`${SITE.url}${p.image.src}`] } : {}),
    })),
  ];
}
