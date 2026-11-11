import { CHAPTERS, MEMBERSHIP, NAV, OUTREACH, SECRETARIAT, SERVICES, TIMELINE } from '@/content/data';
import { albums, news, site } from '@/lib/content';

export const dynamic = 'force-static';

type Entry = { t: string; u: string; k: string; s?: string; d?: string };

/** Search index for the site search: pages and sections, people, chapters, events, albums, committees and news. */
export function GET() {
  const entries: Entry[] = [
    { t: 'Home', u: '/', k: 'Page', s: 'One chamber for two continents. Map of chapters and representatives.' },
    { t: 'About AACCI', u: '/about/', k: 'Page', s: 'Who we are, not-for-profit chamber incorporated 2018, CIN U74995GJ2018NPL105079' },
    { t: 'Leadership', u: '/leadership/', k: 'Page', s: 'Permanent Secretariat, governing council and advisory board' },
    { t: 'Chapters and representatives', u: '/chapters/', k: 'Page', s: 'International chapters, India chapter and official representatives' },
    { t: 'Membership', u: '/membership/', k: 'Page', s: 'Categories, fees, benefits, how to join, renewal, committees' },
    { t: 'Membership fees', u: '/membership/#fees', k: 'Page', s: 'Associate $250 to $700, corporate $385 to $1,250, patron $5,000, individual $210, admission $210' },
    { t: 'Apply for membership', u: '/membership/#apply', k: 'Page', s: 'Application form' },
    { t: 'Renew your membership', u: '/membership/#renew', k: 'Page', s: 'One year, reminder a month before, 30-day grace period' },
    { t: 'Services', u: '/services/', k: 'Page', s: SERVICES.map((s) => s.name).join(', ') },
    { t: 'Events', u: '/events/', k: 'Page', s: 'Upcoming events, every event since 2018, photo gallery, sponsorship, AGM' },
    { t: 'Sponsorship packages', u: '/events/#sponsor', k: 'Page', s: 'Platinum $25,000, Gold $15,000, Silver $10,000, Bronze $5,000' },
    { t: 'Photo gallery', u: '/events/#gallery', k: 'Page', s: `${albums.length} event albums` },
    { t: 'News', u: '/news/', k: 'Page', s: 'Business news from Asia and Africa' },
    { t: 'Contact', u: '/contact/', k: 'Page', s: 'Global Secretariat Ahmedabad, National Secretariat Mumbai, Nigeria chapter Lagos, phone, WhatsApp, email' },
    { t: 'Careers', u: '/careers/', k: 'Page', s: site.careers.map((c) => c.title).join(', ') },
    { t: 'Policies', u: '/policies/', k: 'Page', s: 'Terms of use, privacy policy, disclaimer, cancellation and refunds' },
    ...NAV.flatMap((n) => (n.links ?? []).map((l) => ({ t: l.label, u: l.href, k: 'Page', s: n.label }))),
    ...SERVICES.map((s) => ({ t: s.name, u: `/services/#${s.id}`, k: 'Page', s: s.short })),
    ...SECRETARIAT.map((p) => ({ t: p.name, u: '/leadership/#secretariat', k: 'Person', s: `${p.role}, Permanent Secretariat` })),
    ...OUTREACH.map((p) => ({ t: p.name, u: '/leadership/#secretariat', k: 'Person', s: `${p.role}, chamber outreach team` })),
    ...site.members.map((m) => ({
      t: m.name, k: 'Person', s: [...m.role, m.country, m.group === 'council' ? 'Governing council' : 'Advisory board'].join(', '),
      u: m.group === 'council' ? '/leadership/#council' : `/leadership/?q=${encodeURIComponent(m.name)}#advisory`,
    })),
    ...(['international', 'india', 'representatives'] as const).flatMap((g) => CHAPTERS[g].map((p) => ({
      t: g === 'representatives' ? `${p.name} representative` : g === 'india' ? `${p.name} (India chapter)` : `${p.name} chapter`, u: `/chapters/#${g}`, k: 'Chapter', s: p.lead,
    }))),
    ...TIMELINE.flatMap((y) => y.events.map((e) => ({ t: e.name, u: '/events/#timeline', k: 'Event', s: `${e.date} ${y.year}, ${e.place}`, ...(e.iso ? { d: e.iso } : {}) }))),
    ...albums.map((a) => ({ t: a.title, u: '/events/#gallery', k: 'Album', s: `${a.meta}, ${a.photos.length} photos` })),
    ...MEMBERSHIP.committees.map((c) => ({ t: `${c} committee`, u: '/membership/#committees', k: 'Committee' })),
    ...news.map((p) => ({ t: p.title, u: `/news/${p.slug}/`, k: 'News', s: p.excerpt.slice(0, 160), d: p.date.slice(0, 10) })),
  ];
  return Response.json(entries);
}
