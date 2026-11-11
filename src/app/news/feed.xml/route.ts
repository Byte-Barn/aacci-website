import { SITE } from '@/content/data';
import { REGION_LABEL, news } from '@/lib/content';

export const dynamic = 'force-static';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** RSS 2.0 feed of the 50 latest stories. */
export function GET() {
  const items = news.slice(0, 50).map((p) => {
    const url = `${SITE.url}/news/${p.slug}/`;
    return `<item><title>${esc(p.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid>`
      + `<pubDate>${new Date(p.date + 'Z').toUTCString()}</pubDate><category>${REGION_LABEL[p.region]}</category>`
      + `<description>${esc(p.excerpt)}</description>`
      + (p.image ? `<enclosure url="${SITE.url}${p.image.src}" type="image/webp" length="0"/>` : '')
      + `</item>`;
  }).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>`
    + `<title>AACCI News</title><link>${SITE.url}/news/</link><description>Business news from Asia and Africa, and announcements from the ${esc(SITE.legalName)}.</description>`
    + `<language>en</language><lastBuildDate>${new Date(news[0].modified + 'Z').toUTCString()}</lastBuildDate>`
    + `<atom:link href="${SITE.url}/news/feed.xml" rel="self" type="application/rss+xml"/>`
    + `<image><url>${SITE.url}/img/aacci-logo.png</url><title>AACCI News</title><link>${SITE.url}/news/</link></image>`
    + items + `</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
