import type { Metadata } from 'next';
import { Btn } from '@/components/ui';
import { asset } from '@/lib/base';

export const metadata: Metadata = { title: 'Page not found', robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="wrap not-found-inner">
        <img className="not-found-mark" src={asset('/img/aacci-logo-light.png')} alt="" width={512} height={512} />
        <div>
          <p className="not-found-code">404</p>
          <h1 className="page-title">This route doesn&apos;t lead anywhere</h1>
          <p className="page-lead">The page may have moved when the site was rebuilt. Try search, or one of these.</p>
          <ul className="not-found-links">
            <li><Btn href="/">Go to the homepage</Btn></li>
            <li><Btn href="/search/" variant="ghost">Search the site</Btn></li>
            <li><Btn href="/membership/" variant="ghost">Membership</Btn></li>
            <li><Btn href="/news/" variant="ghost">Latest news</Btn></li>
          </ul>
        </div>
      </div>
      <div className="page-hero-stripes" aria-hidden="true"><i /><i /><i /></div>
    </section>
  );
}
