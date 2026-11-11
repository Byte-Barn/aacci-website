import type { Metadata } from 'next';
import { PlaceList } from '@/components/client/Widgets';
import WorldMap from '@/components/client/WorldMap';
import { Btn, PageHero, SectionHead, Words } from '@/components/ui';
import { SITE } from '@/content/data';
import { mapData } from '@/lib/content';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Chapters and representatives',
  description: 'AACCI chapters in Ethiopia, Kenya, Nigeria, Sri Lanka, Japan, Hong Kong and more, six regional chapters in India, and official representatives in 12 countries.',
  path: '/chapters/',
});

export default function Chapters() {
  return (
    <>
      <PageHero title="Chapters and representatives" crumbs={[{ name: 'About', href: '/about/' }, { name: 'Chapters', href: '/chapters/' }]}
        lead="Where AACCI is on the ground, and who leads it there. Select a point on the map or a name in the lists.">
        <WorldMap data={mapData} />
      </PageHero>

      <section className="section" id="international" aria-labelledby="intl-title">
        <div className="wrap">
          <SectionHead id="intl-title" title="International chapters" intro="Chapters run the chamber's work in their country: events, members and links with government." />
          <PlaceList group="international" />
        </div>
      </section>

      <section className="section section--mist" id="india" aria-labelledby="india-title">
        <div className="wrap">
          <SectionHead id="india-title" title="India chapter" intro="Led by National President Dr. Kishor Navandar, with the National Secretariat in Mumbai and regional chapters across the country." />
          <PlaceList group="india" compact />
        </div>
      </section>

      <section className="section" id="representatives" aria-labelledby="reps-title">
        <div className="wrap">
          <SectionHead id="reps-title" title="Official representatives" intro="Your first contact for AACCI in these countries." />
          <PlaceList group="representatives" compact />
        </div>
      </section>

      <section className="section section--ink" id="partner" aria-labelledby="start-title">
        <div className="wrap split split--center">
          <div>
            <Words className="h2" id="start-title" text="Partner with AACCI in your country" />
            <p className="section-intro" data-reveal="">Chambers of commerce, industry associations and SME federations with a verified membership base can sign a bilateral cooperation agreement with AACCI.</p>
          </div>
          <div className="stack" data-reveal="">
            <Btn href={`mailto:${SITE.email}?subject=Expression%20of%20interest%3A%20bilateral%20cooperation`}>Send an expression of interest</Btn>
            <p className="muted-ink">Or call the Permanent Secretariat on <a href={`tel:${SITE.phoneHref}`}>{SITE.phone}</a>.</p>
          </div>
        </div>
      </section>
    </>
  );
}
