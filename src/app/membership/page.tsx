import type { Metadata } from 'next';
import { SmartForm } from '@/components/client/Forms';
import { FeeFinder } from '@/components/client/Widgets';
import { Btn, PageHero, Prose, SectionHead, Stripes, Words } from '@/components/ui';
import { MEMBERSHIP, SITE } from '@/content/data';
import { site } from '@/lib/content';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Membership: categories, fees and how to join',
  description: 'AACCI membership for chambers, companies, large institutions and individuals. Annual fees from $210, a one-time $210 admission fee, benefits, committees and an online application.',
  path: '/membership/',
});

export default function Membership() {
  return (
    <>
      <PageHero title="Join the Asia–Africa business network" crumbs={[{ name: 'Membership', href: '/membership/' }]}
        lead="Members come from financial institutions, international groups, regional SMEs, public sector undertakings and the professions. Find your category, see the fee, and apply in a few minutes."
        actions={<><Btn href="#apply">Apply now</Btn><Btn href="#fees" variant="ghost">See the fees</Btn></>} />

      <section className="membership section" id="fees" aria-labelledby="mem-title">
        <div className="wrap">
          <SectionHead id="mem-title" title="Find the right membership" intro="Tell us who is joining and we will show the category, the annual fee and what your first year costs. All fees are in US dollars." />
          <FeeFinder />
        </div>
      </section>

      <section className="section section--mist" id="benefits" aria-labelledby="benefits-title">
        <div className="wrap">
          <SectionHead id="benefits-title" title="What members get" intro="Twelve reasons members give for joining, in eight lines." />
          <ul className="benefit-list">{MEMBERSHIP.benefits.map(([b, t]) => <li key={b} data-reveal=""><b>{b}</b> {t}</li>)}</ul>
        </div>
      </section>

      <section className="section" id="join" aria-labelledby="join-title">
        <div className="wrap">
          <SectionHead id="join-title" title="How to join" intro="Four steps, from choosing a category to your first event." />
          <ol className="steps">{MEMBERSHIP.steps.map(([b, t]) => <li key={b} data-reveal=""><b>{b}</b><span>{t}</span></li>)}</ol>
        </div>
      </section>

      <section className="section section--ink" id="renew" aria-labelledby="renew-title">
        <div className="wrap split">
          <div>
            <Words className="h2" id="renew-title" text="Renewing your membership" />
            <p className="section-intro" data-reveal="">Renew to keep your access to events, webinars, the network and the chamber&apos;s advocacy.</p>
            <div data-reveal=""><Btn href="#apply">Renew now</Btn></div>
          </div>
          <dl className="facts facts--ink" data-reveal="">
            {MEMBERSHIP.renewal.map(([t, d]) => <div key={t}><dt>{t}</dt><dd>{d}</dd></div>)}
            <div><dt>Questions</dt><dd><a href={`mailto:${SITE.emails.support}`}>{SITE.emails.support}</a></dd></div>
          </dl>
        </div>
      </section>

      <section className="section" id="committees" aria-labelledby="committees-title">
        <div className="wrap">
          <SectionHead id="committees-title" title="Industry committees" intro="Committees bring members of one sector together to share knowledge and take shared issues to government. These are active now." />
          <ul className="chips chips--strong" data-reveal="">{MEMBERSHIP.committees.map((c) => <li key={c}>{c}</li>)}</ul>
          <details className="more" data-reveal="">
            <summary>See all {site.industries.length} industries the chamber covers</summary>
            <ul className="chips">{site.industries.map((c) => <li key={c}>{c}</li>)}</ul>
          </details>
        </div>
      </section>

      <section className="section section--mist" id="members" aria-labelledby="corp-title">
        <div className="wrap">
          <SectionHead id="corp-title" title="Corporate members" intro="Organisations forming the commercial foundation of the Asia–Africa trade and investment network." />
          <ul className="corp" data-reveal="">{MEMBERSHIP.corporate.map(([n, s]) => <li key={n}><b>{n}</b><span>{s}</span></li>)}</ul>
        </div>
      </section>

      <section className="section" id="conduct" aria-labelledby="conduct-title">
        <div className="wrap split">
          <div>
            <Words className="h2" id="conduct-title" text="Code of conduct and rules" />
            <p className="section-intro" data-reveal="">Every member agrees to these when they join.</p>
          </div>
          <div>
            <details className="more more--boxed"><summary>AACCI code of conduct</summary><Prose html={site.pages['code-of-conduct']} /></details>
            <details className="more more--boxed"><summary>Rules and regulations for membership</summary><Prose html={site.pages['rules-regulations']} /></details>
          </div>
        </div>
      </section>

      <section className="apply section section--mist" id="apply" aria-labelledby="apply-title">
        <div className="wrap split">
          <div>
            <Stripes />
            <Words className="h2" id="apply-title" text="Apply for membership" />
            <p className="section-intro" data-reveal="">Send your details and the membership team will contact you about the next steps and payment.</p>
            <ul className="contact-lines" data-reveal="">
              <li><span>Call</span><a href={`tel:${SITE.phoneHref}`}>{SITE.phone}</a></li>
              <li><span>Email</span><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            </ul>
          </div>
          <SmartForm name="membership" submitLabel="Send application">
            <div className="form-row">
              <label className="field"><span>Full name</span><input name="name" autoComplete="name" required /></label>
              <label className="field"><span>Organisation</span><input name="organisation" autoComplete="organization" required /></label>
            </div>
            <div className="form-row">
              <label className="field"><span>Email</span><input name="email" type="email" autoComplete="email" required /></label>
              <label className="field"><span>Phone, with country code</span><input name="phone" type="tel" autoComplete="tel" required /></label>
            </div>
            <div className="form-row">
              <label className="field"><span>Country</span><input name="country" autoComplete="country-name" required /></label>
              <label className="field"><span>Membership</span>
                <select name="category" required data-category-select="" defaultValue="">
                  <option value="">Choose a category</option>
                  {MEMBERSHIP.formOptions.map((o) => <option key={o}>{o}</option>)}
                </select>
              </label>
            </div>
            <label className="field"><span>Anything we should know? <small>Optional</small></span><textarea name="message" rows={4} /></label>
            <label className="check"><input type="checkbox" name="agree" required /><span>I agree to the AACCI code of conduct and membership rules.</span></label>
          </SmartForm>
        </div>
      </section>
    </>
  );
}
