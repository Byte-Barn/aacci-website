import { MEMBERSHIP, OFFICES, SECRETARIAT, SERVICES, SITE } from '@/content/data';
import { news } from '@/lib/content';

export const dynamic = 'force-static';

/** llms.txt: a plain-text guide to the site for AI crawlers and answer engines (https://llmstxt.org). */
export function GET() {
  const u = (p: string) => `${SITE.url}${p}`;
  const body = `# ${SITE.legalName} (${SITE.short})

> ${SITE.description} Not-for-profit company under Section 8 of India's Companies Act, 2013, incorporated in ${SITE.founded} (CIN ${SITE.cin}). Global Secretariat in Ahmedabad, India.

## Key facts
- Leadership: ${SECRETARIAT.map((p) => `${p.name} (${p.role})`).join('; ')}
- Offices: ${OFFICES.map((o) => `${o.tag}, ${o.city}`).join('; ')}
- Contact: ${SITE.email}, ${SITE.phone}, WhatsApp ${SITE.whatsapp}
- Membership: one-time admission fee $${MEMBERSHIP.admission}; ${MEMBERSHIP.categories.map((c) => `${c.name} ${c.options.map((o) => `$${o.fee}`).join('/')}`).join('; ')} per year
- Services: ${SERVICES.map((s) => s.name).join(', ')}

## Pages
- [About](${u('/about/')}): mission, objectives, logo, structure, founder's message
- [Leadership](${u('/leadership/')}): Permanent Secretariat, governing council, advisory board
- [Chapters](${u('/chapters/')}): international chapters, India regional chapters, official representatives
- [Membership](${u('/membership/')}): categories, fees, benefits, committees, application
- [Services](${u('/services/')})
- [Events](${u('/events/')}): events since 2018, photo gallery, sponsorship
- [News](${u('/news/')}): ${news.length} stories; RSS at ${u('/news/feed.xml')}
- [Contact](${u('/contact/')})
- [Policies](${u('/policies/')})

## Latest news
${news.slice(0, 20).map((p) => `- [${p.title}](${u(`/news/${p.slug}/`)}) (${p.date.slice(0, 10)})`).join('\n')}

## Optional
- [Sitemap](${u('/sitemap.xml')})
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
