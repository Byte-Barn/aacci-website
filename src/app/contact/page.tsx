import type { Metadata } from 'next';
import Link from 'next/link';
import { SmartForm } from '@/components/client/Forms';
import { Btn, PageHero, Stripes, Words } from '@/components/ui';
import { OFFICES, SITE } from '@/content/data';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Contact the chamber',
  description: 'Contact the AACCI Global Secretariat in Ahmedabad, the National Secretariat in Mumbai or the Nigeria chapter in Lagos, by phone, WhatsApp, email or the contact form.',
  path: '/contact/',
});

export default function Contact() {
  return (
    <>
      <PageHero title="Talk to the chamber" crumbs={[{ name: 'Contact', href: '/contact/' }]}
        lead="Questions about membership, events, certificates or partnerships go to the Global Secretariat in Ahmedabad. For Africa, contact the Nigeria chapter."
        actions={<><Btn href={`https://wa.me/${SITE.whatsappChat}`}>Message on WhatsApp</Btn><Btn href={`mailto:${SITE.email}`} variant="ghost">{SITE.email}</Btn></>} />

      <section className="section" aria-labelledby="offices-title">
        <div className="wrap">
          <h2 id="offices-title" className="visually-hidden">Offices</h2>
          <ul className="offices">
            {OFFICES.map((o, i) => (
              <li className={`office${i === 0 ? ' office--main' : ''}`} data-reveal="" key={o.id} itemScope itemType="https://schema.org/Place">
                {'photo' in o && o.photo ? <img className="office-photo" src={o.photo} alt="The grand opening of the Global Secretariat office in Ahmedabad, December 2022" width={640} height={256} loading="lazy" /> : null}
                <p className="office-tag">{o.tag}</p>
                <h3 className="h3" itemProp="name">{o.city}</h3>
                <address itemProp="address">{o.lines.join(', ')}</address>
                {o.contacts.length ? (
                  <ul className="contact-lines">
                    {o.contacts.map((c) => <li key={c.label}><span>{c.label}</span><a href={c.href} rel={c.href.startsWith('http') ? 'noopener' : undefined}>{c.value}</a></li>)}
                  </ul>
                ) : null}
                <a className="text-link" href={o.map} rel="noopener">Get directions</a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--mist" aria-labelledby="form-title">
        <div className="wrap split">
          <div>
            <Stripes />
            <Words className="h2" id="form-title" text="Send a message" />
            <p className="section-intro" data-reveal="">Tell us what you need and the right team will reply by email.</p>
            <dl className="facts" data-reveal="">
              <div><dt>Office hours</dt><dd>{SITE.hours}</dd></div>
              <div><dt>Membership support</dt><dd><a href={`mailto:${SITE.emails.support}`}>{SITE.emails.support}</a></dd></div>
              <div><dt>Work with us</dt><dd><Link href="/careers/">See open roles</Link></dd></div>
            </dl>
          </div>
          <SmartForm name="contact" submitLabel="Send message">
            <div className="form-row">
              <label className="field"><span>Full name</span><input name="name" autoComplete="name" required /></label>
              <label className="field"><span>Email</span><input name="email" type="email" autoComplete="email" required /></label>
            </div>
            <div className="form-row">
              <label className="field"><span>Phone <small>Optional</small></span><input name="phone" type="tel" autoComplete="tel" /></label>
              <label className="field"><span>Organisation <small>Optional</small></span><input name="organisation" autoComplete="organization" /></label>
            </div>
            <label className="field"><span>What is it about?</span>
              <select name="topic" required defaultValue="">
                <option value="">Choose a topic</option>
                {['Membership', 'Events and sponsorship', 'Certificate of origin', 'Chapters and partnerships', 'Media and press', 'Something else'].map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
            <label className="field"><span>Your message</span><textarea name="message" rows={5} required /></label>
          </SmartForm>
        </div>
      </section>
    </>
  );
}
