import type { Metadata } from 'next';
import { Btn } from '@/components/ui';

export const metadata: Metadata = { title: 'Thank you', robots: { index: false, follow: true } };

/** Shown after a form is sent without JavaScript (Netlify Forms posts here). */
export default function Thanks() {
  return (
    <section className="page-hero thanks">
      <div className="wrap page-hero-inner">
        <h1 className="page-title">Thank you. Your form has been sent.</h1>
        <p className="page-lead">The AACCI secretariat will reply by email. For anything urgent, call +91 63593 63632.</p>
        <div className="page-hero-actions"><Btn href="/">Back to the homepage</Btn><Btn href="/news/" variant="ghost">Read the latest news</Btn></div>
      </div>
      <div className="page-hero-stripes" aria-hidden="true"><i /><i /><i /></div>
    </section>
  );
}
