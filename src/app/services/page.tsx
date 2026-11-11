import type { Metadata } from 'next';
import Link from 'next/link';
import { Cta, PageHero } from '@/components/ui';
import { SERVICES } from '@/content/data';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Services: trade facilitation, representation and missions',
  description: 'Trade facilitation, government representation, business networking, trade missions and exhibitions, certificates of origin, consultancy and advertising for AACCI members.',
  path: '/services/',
});

export default function Services() {
  const main = SERVICES.slice(0, 4);
  const more = [
    { id: 'origin', title: 'Certificate of origin', text: SERVICES[4].long, link: 'Ask about certificates' },
    { id: 'consultancy', title: 'Consultancy', text: SERVICES[5].long, link: 'Talk to an adviser' },
    { id: 'advertising', title: 'Advertising with AACCI', text: "Reach every member, affiliated partner and trade agency through the quarterly newsletter and the annual members' directory.", link: 'Ask for rates' },
  ];
  return (
    <>
      <PageHero title="Practical help to trade across two continents" crumbs={[{ name: 'Services', href: '/services/' }]}
        lead="AACCI works as a bridge between Asian and African trade bodies, companies and governments. These are the services members use most." />
      <section className="section" aria-label="Services">
        <div className="wrap">
          {main.map((s, i) => (
            <article className={`feature${i % 2 ? ' feature--flip' : ''}`} id={s.id} key={s.id}>
              <div className="feature-media fx" data-tilt="" data-reveal="wipe"><img src={s.img} alt={s.alt} width={1500} height={600} loading="lazy" /></div>
              <div className="feature-copy">
                <h2 className="h3" data-reveal="">{s.name}</h2>
                <p data-reveal="">{s.long}</p>
                {s.points.length ? <ul className="tick-list" data-reveal="">{s.points.map((p) => <li key={p}>{p}</li>)}</ul> : null}
                {s.id === 'missions' ? <Link className="text-link" href="/events/" data-reveal="">See past missions and events</Link> : null}
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section section--mist" aria-labelledby="more-services-title">
        <div className="wrap">
          <h2 id="more-services-title" className="visually-hidden">More services</h2>
          <ul className="cards-3">
            {more.map((c) => (
              <li className="card" id={c.id} key={c.id} data-reveal="">
                <h3 className="h3">{c.title}</h3><p>{c.text}</p><Link className="text-link" href="/contact/">{c.link}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <Cta />
    </>
  );
}
