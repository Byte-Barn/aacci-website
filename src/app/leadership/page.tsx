import type { Metadata } from 'next';
import { Directory, MemberCard } from '@/components/client/Widgets';
import { Btn, JsonLd, PageHero, SectionHead } from '@/components/ui';
import { OUTREACH, SECRETARIAT } from '@/content/data';
import { site } from '@/lib/content';
import { pageMeta, personListLd } from '@/lib/seo';
import { asset } from '@/lib/base';

export const metadata: Metadata = pageMeta({
  title: 'Leadership, governing council and advisory board',
  description: 'The AACCI Permanent Secretariat led by Dr. G.D. Singh, the governing council, and an advisory board of more than 120 leaders from business, government and the professions.',
  path: '/leadership/',
});

export default function Leadership() {
  const council = site.members.filter((m) => m.group === 'council');
  const advisory = site.members.filter((m) => m.group === 'advisory');
  const countries = new Set(site.members.map((m) => m.country)).size;
  return (
    <>
      <JsonLd data={personListLd()} />
      <PageHero title="The people behind the chamber" crumbs={[{ name: 'About', href: '/about/' }, { name: 'Leadership', href: '/leadership/' }]}
        lead={`A Permanent Secretariat sets the strategy. A governing council and an advisory board of more than 130 leaders from ${countries} countries guide it.`} />

      <section className="leadership section" id="secretariat" aria-labelledby="lead-title">
        <div className="wrap">
          <SectionHead id="lead-title" title="Permanent Secretariat" intro="The founding team responsible for the chamber's policy and strategy." />
          <ul className="people">
            {SECRETARIAT.map((p) => (
              <li className="person" data-reveal="portrait" key={p.name}>
                <div className="person-photo"><div className="fx" data-tilt=""><img src={asset(p.img)} alt={p.name} width={p.w} height={p.h} loading="lazy" /></div></div>
                <p className="person-name">{p.name}</p><p className="person-role">{p.role}</p>
              </li>
            ))}
          </ul>
          <div className="team-row" data-reveal="">
            <p className="team-title">Chamber outreach team</p>
            <ul className="team">{OUTREACH.map((t) => <li key={t.name}>{t.name} <span>{t.role}</span></li>)}</ul>
          </div>
        </div>
      </section>

      <section className="section section--mist" id="council" aria-labelledby="council-title">
        <div className="wrap">
          <SectionHead id="council-title" title="Governing council" intro="Chairs and chief executives from chambers, development agencies, hospitals, law firms and industry." />
          <ul className="members members--council">{council.map((m, i) => <MemberCard key={m.name} m={m} index={i} />)}</ul>
        </div>
      </section>

      <section className="section" id="advisory" aria-labelledby="advisory-title">
        <div className="wrap">
          <SectionHead id="advisory-title" title="Advisory board" intro={`${advisory.length} advisers from business, government, academia and the professions. Search by name, company or country.`} />
          <Directory members={advisory} />
        </div>
      </section>

      <section className="section section--mist" aria-labelledby="chapters-cta-title">
        <div className="wrap wide-link">
          <h2 id="chapters-cta-title" className="h3">Chapter presidents and country representatives</h2>
          <Btn href="/chapters/" variant="dark">See chapters and representatives</Btn>
        </div>
      </section>
    </>
  );
}
