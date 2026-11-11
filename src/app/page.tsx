import type { Metadata } from 'next';
import Link from 'next/link';
import { ServicesTabs, Reel, Testimonials } from '@/components/client/Showcase';
import { HeroIntro } from '@/components/client/Widgets';
import WorldMap from '@/components/client/WorldMap';
import { Btn, Cta, JsonLd, NewsCard, Partners, SectionHead, Stripes, Words } from '@/components/ui';
import { FACTS, RECENT_EVENTS, SITE } from '@/content/data';
import { latestNews, mapData, toCard } from '@/lib/content';
import { pageMeta, websiteLd } from '@/lib/seo';

export const metadata: Metadata = {
  ...pageMeta({ title: `${SITE.name} (AACCI)`, description: SITE.description, path: '/' }),
  title: { absolute: `${SITE.name} (AACCI): one chamber for two continents` },
};

export default function Home() {
  return (
    <>
      <JsonLd data={websiteLd()} />
      <HeroIntro />
      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="wrap hero-copy">
          <h1 className="hero-title" id="hero-title">
            <span className="line"><span>One chamber</span></span>
            <span className="line"><span>for two continents.</span></span>
          </h1>
          <div className="hero-row">
            <img className="hero-mark" src="/img/aacci-emblem-light.png" alt="" width={464} height={269} aria-hidden="true" />
            <div className="hero-side">
              <p className="hero-lead">AACCI brings together chambers of commerce, companies and professionals from more than 100 countries to trade, invest and shape policy across Asia and Africa.</p>
              <div className="hero-actions">
                <Btn href="/membership/">Become a member</Btn>
                <Btn href="/chapters/" variant="ghost">See where we work</Btn>
              </div>
            </div>
          </div>
        </div>
        <WorldMap data={mapData} />
      </section>

      <section className="about section" aria-labelledby="about-title">
        <div className="wrap about-grid">
          <div className="about-copy">
            <Stripes />
            <Words className="h2" id="about-title" text="A unified voice for business between Asia and Africa" />
            <p className="lead" data-reveal="">The chamber brings the presidents of commerce chambers and leading professionals across the region together, so they can tackle shared issues and grow through collective effort, in line with the UN Sustainable Development Goals 2030.</p>
            <p data-reveal=""><Link className="text-link" href="/about/">More about the chamber</Link></p>
          </div>
          <dl className="ledger">
            {FACTS.map((f) => (
              <div className="ledger-row" data-reveal="" key={f.text}>
                <dt><span className="count" data-to={f.value} {...(f.plain ? { 'data-plain': '' } : {})}>{f.value}</span>{f.suffix}</dt>
                <dd>{f.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="services section section--mist" aria-labelledby="services-title">
        <div className="wrap">
          <SectionHead id="services-title" title="What the chamber does for members" intro={<>Six services, one network of chambers and governments behind each of them. <Link className="text-link" href="/services/">All services</Link></>} />
          <ServicesTabs />
        </div>
      </section>

      <section className="ethiopia section" id="ethiopia" aria-labelledby="eth-title">
        <div className="wrap section-head section-head--split">
          <div>
            <Stripes />
            <Words className="h2" id="eth-title" text="Building AACCI's presence in Ethiopia" />
          </div>
          <p className="section-intro" data-reveal="">AACCI is working with Ethiopian ministries, business associations and communities on innovation and technology, trade and regional integration, tourism and agroecology.</p>
        </div>
        <Reel />
      </section>

      <section className="events-teaser section section--ink" aria-labelledby="events-title">
        <div className="wrap">
          <SectionHead id="events-title" title="Diplomatic meets, forums and missions" intro={<>Since 2018, AACCI has hosted events from New Delhi and Mumbai to Lagos, Accra, Colombo, Bangkok and Dubai. <Link className="text-link text-link--light" href="/events/">See every event since 2018</Link></>} />
          <ol className="tickets">
            <li className="ticket ticket--next" data-reveal="">
              <p className="ticket-date"><b>Next</b><span>To be announced</span></p>
              <h3 className="ticket-title">The next AACCI event</h3>
              <p className="ticket-place">Subscribe to hear about it first.</p>
              <a className="btn btn--primary" href="#newsletter"><span>Get event updates</span></a>
            </li>
            {RECENT_EVENTS.map((e) => (
              <li className="ticket" data-reveal="" key={e.name}>
                <p className="ticket-date"><b>{e.day}</b><span>{e.month}</span></p>
                <h3 className="ticket-title">{e.name}</h3>
                <p className="ticket-place">{e.place}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="member-band section" aria-labelledby="band-title">
        <div className="wrap member-band-grid">
          <div>
            <Stripes />
            <Words className="h2" id="band-title" text="Membership from $210 a year" />
            <p className="section-intro" data-reveal="">Pick the category that fits, add the one-time $210 admission fee, and you are part of the network.</p>
            <div data-reveal=""><Btn href="/membership/#fees" variant="dark">Work out your fee</Btn></div>
          </div>
          <ul className="price-rows">
            {[['Chambers and trade bodies', 'Associate member', 'from $250'], ['Companies and firms', 'Corporate member', 'from $385'],
              ['Large companies, PSUs and banks', 'Patron, limited to 150', '$5,000'], ['Individuals and consultants', 'Individual member', '$210']].map(([c, n, p]) => (
              <li data-reveal="" key={c}><span className="price-cat">{c}</span><span className="price-note">{n}</span><b>{p}</b></li>
            ))}
          </ul>
        </div>
      </section>

      <Partners />

      <section className="news section section--mist" aria-labelledby="news-title">
        <div className="wrap">
          <SectionHead id="news-title" title="Business news from both continents" intro={<>Daily coverage of trade, investment and policy across Asia and Africa. <Link className="text-link" href="/news/">All news</Link></>} />
          <ul className="news-list news-list--home">
            {latestNews(4).map((p, i) => <NewsCard key={p.slug} post={toCard(p)} lead={i === 0} />)}
          </ul>
        </div>
      </section>

      <section className="voices section" aria-labelledby="voices-title">
        <div className="wrap voices-grid">
          <Words className="h2" id="voices-title" text="What members say" />
          <Testimonials />
        </div>
      </section>

      <Cta />
    </>
  );
}
