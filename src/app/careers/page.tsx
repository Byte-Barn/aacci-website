import type { Metadata } from 'next';
import { PickLink, SmartForm } from '@/components/client/Forms';
import { PageHero, Prose, Words } from '@/components/ui';
import { site } from '@/lib/content';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Careers at AACCI',
  description: 'Open roles at the Asian-African Chamber of Commerce and Industry Global Secretariat in Ahmedabad: Sales Manager and Officer Strategic Alliance.',
  path: '/careers/',
});

export default function Careers() {
  return (
    <>
      <PageHero title="Work with the chamber" crumbs={[{ name: 'Careers', href: '/careers/' }]}
        lead="Help connect business across Asia and Africa. Our team is based at the Global Secretariat in Ahmedabad." />
      <section className="section" aria-labelledby="roles-title">
        <div className="wrap split">
          <div>
            <Words className="h2" id="roles-title" text="Open roles" />
            <p className="section-intro" data-reveal="">Both roles are based at the Global Secretariat in Ahmedabad.</p>
          </div>
          <div className="roles" data-reveal="">
            {site.careers.map((r) => (
              <details className="role" key={r.title}>
                <summary><span className="role-title">{r.title}</span><span className="role-meta">Ahmedabad, Gujarat</span></summary>
                <div className="role-body">
                  <Prose html={r.html} />
                  <p><PickLink href="#apply" select="[data-role-select]" value={r.title}>Apply for this role</PickLink></p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--mist" id="apply" aria-labelledby="career-form-title">
        <div className="wrap split">
          <div>
            <Words className="h2" id="career-form-title" text="Apply" />
            <p className="section-intro" data-reveal="">Tell us which role you want and why. We will reply by email if your profile fits.</p>
          </div>
          <SmartForm name="careers" multipart submitLabel="Send application">
            <div className="form-row">
              <label className="field"><span>Full name</span><input name="name" autoComplete="name" required /></label>
              <label className="field"><span>Email</span><input name="email" type="email" autoComplete="email" required /></label>
            </div>
            <div className="form-row">
              <label className="field"><span>Phone</span><input name="phone" type="tel" autoComplete="tel" required /></label>
              <label className="field"><span>Role</span>
                <select name="role" required data-role-select="" defaultValue="">
                  <option value="">Choose a role</option>
                  {site.careers.map((r) => <option key={r.title}>{r.title}</option>)}
                </select>
              </label>
            </div>
            <label className="field"><span>CV <small>PDF or Word, up to 5 MB</small></span><input name="cv" type="file" accept=".pdf,.doc,.docx" required /></label>
            <label className="field"><span>Why this role? <small>Optional</small></span><textarea name="message" rows={4} /></label>
          </SmartForm>
        </div>
      </section>
    </>
  );
}
