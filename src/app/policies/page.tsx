import type { Metadata } from 'next';
import { PolicyNav } from '@/components/client/Widgets';
import { PageHero, Prose } from '@/components/ui';
import { site } from '@/lib/content';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Policies: terms, privacy, disclaimer and refunds',
  description: 'AACCI terms of use, privacy policy, disclaimer, and cancellation and refund policy.',
  path: '/policies/',
});

const DOCS = [
  { id: 'terms', label: 'Terms of use', key: 'terms-of-use' },
  { id: 'privacy', label: 'Privacy policy', key: 'privacy-policy' },
  { id: 'disclaimer', label: 'Disclaimer', key: 'disclaimer' },
  { id: 'refunds', label: 'Cancellation and refunds', key: 'cancellation-and-refund-policy' },
];

export default function Policies() {
  return (
    <>
      <PageHero short title="Policies" crumbs={[{ name: 'Policies', href: '/policies/' }]}
        lead="How you may use this website, how we handle your information, and our terms for payments and refunds." />
      <section className="section" aria-label="Policy documents">
        <div className="wrap policy-grid">
          <PolicyNav items={DOCS.map(({ id, label }) => ({ id, label }))} />
          <div className="policy-docs">
            {DOCS.map((d) => (
              <article className="prose policy" id={d.id} key={d.id}>
                <h2 className="h3">{d.label}</h2>
                <Prose className="" html={site.pages[d.key]} />
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
