import type { Metadata } from 'next';
import Gallery from '@/components/client/Gallery';
import { Timeline } from '@/components/client/Widgets';
import { Btn, JsonLd, PageHero, SectionHead, Words } from '@/components/ui';
import { SPONSOR_TIERS } from '@/content/data';
import { albums } from '@/lib/content';
import { eventsLd, pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Events: diplomatic meets, forums and missions since 2018',
  description: "AACCI's High Level Diplomatic Meets, Asian African Leadership Forums, awards and trade missions from 2018 to 2026, the photo gallery and sponsorship packages.",
  path: '/events/',
  image: '/img/hldm-2.webp',
});

export default function Events() {
  const photos = albums.reduce((n, a) => n + a.photos.length, 0);
  return (
    <>
      <JsonLd data={eventsLd()} />
      <PageHero title="Diplomatic meets, forums and missions" crumbs={[{ name: 'Events', href: '/events/' }]}
        lead="Since its launch in 2018, AACCI has hosted events from New Delhi and Mumbai to Lagos, Accra, Colombo, Bangkok and Dubai." />

      <section className="section" id="next" aria-labelledby="next-title">
        <div className="wrap split split--center">
          <div>
            <Words className="h2" id="next-title" text="Upcoming events" />
            <p className="section-intro" data-reveal="">The next event will be announced here first. Subscribe and we will email you the date, venue and how to register.</p>
          </div>
          <article className="ticket ticket--next ticket--light" data-reveal="">
            <p className="ticket-date"><b>Next</b><span>To be announced</span></p>
            <h3 className="ticket-title">Most recent: Global Business Leadership Forum</h3>
            <p className="ticket-place">DoubleTree by Hilton, Dubai, 23 October 2026</p>
            <a className="btn btn--primary" href="#newsletter"><span>Get event updates</span></a>
          </article>
        </div>
      </section>

      <section className="events section section--ink" aria-labelledby="past-title">
        <div className="wrap">
          <SectionHead id="past-title" title="Every event since 2018" intro="From the first soft launch in New Delhi to the eighth High Level Diplomatic Meet." />
        </div>
        <Timeline />
      </section>

      <section className="section" id="gallery" aria-labelledby="gallery-title">
        <div className="wrap">
          <SectionHead id="gallery-title" title="Photo gallery" intro={`${photos} photos from ${albums.length} AACCI events. Choose an event, then select a photo to see it full size or play it as a slideshow.`} />
          <Gallery albums={albums} />
        </div>
      </section>

      <section className="section section--ink sponsor-section" aria-label="Sponsorship">
        <div className="wrap sponsor" id="sponsor">
          <div className="sponsor-copy">
            <h2 className="h3" data-reveal="">Sponsor an AACCI event</h2>
            <p data-reveal="">Put your company in front of business leaders, ministers and diplomats from both continents. Every package includes a listing on the welcome sign and event programme.</p>
            <div data-reveal=""><Btn href="/contact/">Talk to us about sponsorship</Btn></div>
          </div>
          <ul className="tiers">
            {SPONSOR_TIERS.map((t) => (
              <li className={`tier tier--${t.id}`} data-reveal="" key={t.id}>
                <p className="tier-name">{t.name}</p><p className="tier-price">{t.price}</p><p className="tier-perks">{t.perks}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" id="agm" aria-labelledby="agm-title">
        <div className="wrap split">
          <Words className="h2" id="agm-title" text="Annual general meeting" />
          <div className="prose" data-reveal="">
            <p className="lead">The AGM brings the general membership together once a year.</p>
            <p>Members elect the board, take key decisions, review the year&apos;s accounts and hear reports from the chairman, the secretary, the finance director and the committees. It is also where members can ask about the chamber&apos;s direction for the year ahead.</p>
          </div>
        </div>
      </section>
    </>
  );
}
