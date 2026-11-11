import type { Metadata } from 'next';
import { Suspense } from 'react';
import SearchPage from '@/components/client/SearchPage';
import { PageHero } from '@/components/ui';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = {
  ...pageMeta({ title: 'Search', description: 'Search AACCI pages, people, chapters, events and news.', path: '/search/' }),
  robots: { index: false, follow: true },
};

export default function Search() {
  return (
    <>
      <PageHero short title="Search the site" crumbs={[{ name: 'Search', href: '/search/' }]} lead="Pages, people, chapters, events, photo albums and every news story." />
      <section className="section search-page">
        <div className="wrap narrow">
          <Suspense fallback={<p>Loading search…</p>}>
            <SearchPage />
          </Suspense>
        </div>
      </section>
    </>
  );
}
