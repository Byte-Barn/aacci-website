import type { Metadata } from 'next';
import Link from 'next/link';
import { Cta, PageHero, Partners, Prose, SectionHead, Words } from '@/components/ui';
import { site } from '@/lib/content';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'About AACCI',
  description: 'Who AACCI is: its mission and objectives, the meaning of its logo, how the chamber is structured, and a message from founder Dr. G.D. Singh.',
  path: '/about/',
});

const MISSION = [
  'Good corporate governance',
  'Public-private partnerships in development projects, especially regional projects that cover more than one member country',
  'A better business climate for private investment',
  'Institutionalised public-private dialogue',
  'Involvement of the private sector in policy making',
  'Capacity building for members through seminars, workshops and platforms to share ideas and experience',
];
const OBJECTIVES = [
  'Facilitate advocacy, dialogue and exchange of information between members and member governments, to improve the business climate and promote Asian business interests in Africa, and African interests in Asia',
  'Promote and increase two-way investment, business and trade flows between Asian and African member nations',
  'Raise the profile of African nations in the Asian business community, and vice versa',
  "Implement Asian projects in Africa, and African projects in Asia, complementing the bilateral work of member states' missions and business organisations",
  'Provide members and non-members with services on economic, legal, technical, financial and market issues',
  'Help small and medium companies in Asian and African member states form strategic alliances',
];
const MEANING = [
  ['r', 'Red is solidity.', 'The relentless effort to be the best at what a chamber exists to do.'],
  ['g', 'Green is sustainability.', 'An optimistic future that keeps the environment at the centre of every activity.'],
  ['o', 'Orange is prosperity.', 'A colour of prosperity in ancient civilisations of both continents, for member nations and their SMEs.'],
  ['a', 'The solid A is Asia.', 'An economy lifted first by Japan, then the tiger economies, and now India and China.'],
  ['map', 'The outline of Africa ends in an upward arrow.', 'A continent with immense potential for growth.'],
];
const STRUCTURE = [
  ['General Assembly', 'The supreme body of the chamber.'],
  ['Permanent Secretariat', "The founder directors, who set the chamber's policy and strategy."],
  ['split'],
  ['Executive Council', 'Manages the chamber day to day from the Asian Secretariat hub in Ahmedabad.'],
  ['Technical commissions', "Set up when needed to review issues for the chamber's deliberations."],
];

export default function About() {
  return (
    <>
      <PageHero title="One voice for business across Asia and Africa" crumbs={[{ name: 'About', href: '/about/' }]}
        lead="A not-for-profit chamber that brings chambers of commerce, trade bodies, companies and professionals from more than 100 countries to one table." />

      <section className="section" aria-labelledby="who-title">
        <div className="wrap split">
          <div className="prose">
            <Words className="h2" id="who-title" text="Who we are" />
            <p className="lead" data-reveal="">The Asian-African Chamber of Commerce and Industry Foundation was conceived to bring together the presidents and representatives of commerce chambers and leading professionals across the region, to address shared issues and grow through collective effort.</p>
            <p data-reveal="">Its primary objective is to give the business community of Asia and Africa a unified voice and a strategic instrument, in line with the UN Sustainable Development Goals 2030. AACCI promotes the interests of its members, supports regional integration initiatives undertaken by governments on both continents, and works through multilateral advocacy to reduce the barriers that hold back trade between them.</p>
          </div>
          <dl className="facts" data-reveal="">
            {[['Legal form', 'Not-for-profit company under Section 8 of the Companies Act, 2013'], ['Incorporated', '2018, Registrar of Companies, Gujarat'],
              ['Corporate Identity Number', 'U74995GJ2018NPL105079'], ['Global Secretariat', 'Ahmedabad, Gujarat, India'],
              ['Regional secretariats', 'Lagos, Nigeria (Africa) and Sri Lanka (Asia)']].map(([t, d]) => <div key={t}><dt>{t}</dt><dd>{d}</dd></div>)}
          </dl>
        </div>
      </section>

      <section className="mission section section--mist" id="mission" aria-labelledby="mission-title">
        <div className="wrap">
          <p className="vision" data-reveal=""><span>Our vision</span>To be recognised as an essential driving force for international business between Asian and African organisations.</p>
          <div className="mission-grid">
            <div>
              <h2 id="mission-title" className="h3" data-reveal="">Our mission</h2>
              <p className="muted" data-reveal="">AACCI advocates on behalf of the private sector of the Asian-African region for:</p>
              <ul className="tick-list">{MISSION.map((m) => <li key={m} data-reveal="">{m}</li>)}</ul>
            </div>
            <div>
              <h2 className="h3" data-reveal="">Our objectives</h2>
              <ul className="tick-list">{OBJECTIVES.map((m) => <li key={m} data-reveal="">{m}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      <section className="logo-story section section--ink" id="logo" aria-labelledby="logo-title">
        <div className="wrap logo-grid">
          <div className="logo-stage" data-logo-stage="">
            <img src="/img/aacci-logo-light.png" alt="The AACCI logo: an outline of Africa with three stripes in red, green and orange, beside a solid letter A" width={512} height={512} loading="lazy" />
            <span className="logo-halo" aria-hidden="true" />
          </div>
          <div>
            <Words className="h2" id="logo-title" text="What our logo stands for" />
            <p className="section-intro" data-reveal="">Founder Dr. G.D. Singh designed it around one idea: integrating Asia and Africa on a single platform of growth and equity.</p>
            <ul className="meaning">
              {MEANING.map(([k, b, t]) => <li key={k} className={`meaning-row meaning-row--${k}`} data-reveal=""><i aria-hidden="true" /><b>{b}</b> {t}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="structure section" id="structure" aria-labelledby="structure-title">
        <div className="wrap">
          <SectionHead id="structure-title" title="How the chamber is structured" intro="Five bodies, from the members' General Assembly to the technical commissions that study specific issues." />
          <ol className="org">
            {STRUCTURE.map(([name, desc]) => name === 'split' ? (
              <li className="org-tier org-tier--split" data-reveal="" key="split">
                <span className="org-half"><span className="org-name">African secretariat</span><span className="org-desc">Lagos, Nigeria. Led by the Vice Chairman, Africa.</span></span>
                <span className="org-half"><span className="org-name">Asian secretariat</span><span className="org-desc">Sri Lanka. Advice and networking support for the region.</span></span>
              </li>
            ) : (
              <li className="org-tier" data-reveal="" key={name}>
                <span className="org-name">{name}</span>
                <span className="org-desc">{desc}{name === 'Permanent Secretariat' ? <> <Link className="text-link" href="/leadership/">Meet them</Link></> : null}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="founder section section--mist" id="founder" aria-labelledby="founder-title">
        <div className="wrap founder-grid">
          <figure className="founder-photo" data-reveal="portrait">
            <div className="person-photo"><div className="fx" data-tilt=""><img src="/img/people/gd-singh.webp" alt="Dr. G.D. Singh" width={900} height={900} loading="lazy" /></div></div>
            <figcaption><b>Dr. G.D. Singh</b>Founder and Chairman</figcaption>
          </figure>
          <div>
            <Words className="h2" id="founder-title" text="A message from the founder" />
            <blockquote className="pull" data-reveal=""><p>Our commitment to our members is to be energised and passionate about their businesses, and ultimately their success.</p></blockquote>
            <details className="more" data-reveal="">
              <summary>Read the full message</summary>
              <Prose html={site.pages['message-from-founder-chairman']} />
            </details>
          </div>
        </div>
      </section>

      <section className="section" id="award" aria-labelledby="award-title">
        <div className="wrap award-band">
          <div className="fx" data-tilt="" data-reveal=""><img src="/img/glory-book.webp" alt="India Glory Book of Records certificate awarded to AACCI" width={712} height={983} loading="lazy" /></div>
          <div>
            <Words className="h2" id="award-title" text="Fastest growing chamber of commerce in India" />
            <p className="lead" data-reveal="">AACCI is officially recognised by the India Glory Book of Records with the title &ldquo;The Fastest Growing Chamber of Commerce in India&rdquo;.</p>
            <p className="muted" data-reveal="">The recognition reflects the work of members and the support the chamber gives them, and sets a higher bar for the years ahead.</p>
          </div>
        </div>
      </section>

      <Partners />
      <Cta />
    </>
  );
}
