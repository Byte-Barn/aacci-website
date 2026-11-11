import type { Metadata } from 'next';
import Link from 'next/link';
import NewsArchive from '@/components/client/NewsArchive';
import { PageHero, Words } from '@/components/ui';
import { news, site, toCard } from '@/lib/content';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'News: business across Asia and Africa',
  description: `${news.length} stories on trade, investment and policy across Asia and Africa, plus announcements from the Asian-African Chamber of Commerce and Industry.`,
  path: '/news/',
});

function byMonth() {
  const groups = new Map<string, typeof news>();
  for (const p of news) {
    const key = p.date.slice(0, 7);
    groups.set(key, [...(groups.get(key) ?? []), p]);
  }
  return [...groups.entries()];
}

export default function News() {
  return (
    <>
      <PageHero title="Business news from both continents" crumbs={[{ name: 'News', href: '/news/' }]}
        lead="Trade, investment and policy news from Asia and Africa, and announcements from the chamber." />
      <section className="news section section--mist" aria-label="Latest news">
        <div className="wrap">
          <NewsArchive items={news.map(toCard)} />
        </div>
      </section>

      <section className="section" id="archive" aria-labelledby="archive-title">
        <div className="wrap">
          <details className="more more--boxed">
            <summary id="archive-title">Browse the full archive by month ({news.length} stories)</summary>
            <div className="archive-months">
              {byMonth().map(([month, posts]) => (
                <div key={month} className="archive-month">
                  <h3>{new Date(month + '-01T00:00:00Z').toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' })}</h3>
                  <ul>{posts.map((p) => <li key={p.slug}><Link href={`/news/${p.slug}/`}>{p.title}</Link></li>)}</ul>
                </div>
              ))}
            </div>
          </details>
        </div>
      </section>

      <section className="section section--mist" id="press" aria-labelledby="press-title">
        <div className="wrap split">
          <div>
            <Words className="h2" id="press-title" text="AACCI in the press" />
            <p className="section-intro" data-reveal="">Launches, MoUs and appointments covered by the media.</p>
          </div>
          <ul className="press-list" data-reveal="">{site.press.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      </section>
    </>
  );
}
