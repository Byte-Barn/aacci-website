import type { Metadata, Viewport } from 'next';
import { Archivo } from 'next/font/google';
import Link from 'next/link';
import Effects from '@/components/client/Effects';
import { Newsletter } from '@/components/client/Forms';
import Header from '@/components/client/Header';
import SearchDialog from '@/components/client/Search';
import { JsonLd } from '@/components/ui';
import { OFFICES, SITE } from '@/content/data';
import { abs, organizationLd } from '@/lib/seo';
import '@/styles/main.css';
import '@/styles/pages.css';
import '@/styles/next.css';
import { asset } from '@/lib/base';

const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-archivo', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} (AACCI)`, template: '%s | AACCI' },
  description: SITE.description,
  applicationName: SITE.short,
  authors: [{ name: SITE.legalName, url: SITE.url }],
  creator: SITE.legalName,
  publisher: SITE.legalName,
  keywords: ['AACCI', 'Asian-African Chamber of Commerce', 'Asia Africa trade', 'chamber of commerce', 'High Level Diplomatic Meet', 'Asian African Leadership Forum', 'trade facilitation', 'business networking', 'Ahmedabad'],
  category: 'business',
  alternates: { canonical: abs('/'), types: { 'application/rss+xml': [{ url: abs('/news/feed.xml'), title: 'AACCI News' }] } },
  openGraph: { type: 'website', siteName: SITE.name, locale: 'en_GB', url: abs('/'), images: [{ url: abs('/img/og.jpg'), width: 1200, height: 630, alt: SITE.name }] },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: '#10232A', width: 'device-width', initialScale: 1 };

// Animations start from a hidden state only when JavaScript runs and the visitor allows motion.
const MOTION_SCRIPT = `document.documentElement.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion');setTimeout(function(){if(!window.__aacci)document.documentElement.classList.remove('motion')},5000);`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={archivo.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_SCRIPT }} />
        <JsonLd data={organizationLd()} />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <div className="progress" aria-hidden="true"><span /></div>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <a className="whatsapp" href={`https://wa.me/${SITE.whatsappChat}`} rel="noopener" aria-label="Chat with AACCI on WhatsApp">
          <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.6c-2 0-4-.6-5.7-1.6l-.4-.2-3.9 1 1-3.8-.3-.4A10.6 10.6 0 1 1 16 26.6zm5.8-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.7 8.7 0 0 1-4.3-3.8c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.7 3.7 0 0 0-1.1 2.7 6.4 6.4 0 0 0 1.3 3.4 14.6 14.6 0 0 0 5.6 5c2.1.9 2.9 1 4 .8.6-.1 1.9-.8 2.2-1.5s.3-1.4.2-1.5-.3-.2-.6-.3z" /></svg>
        </a>
        <SearchDialog />
        <Effects />
      </body>
    </html>
  );
}

function Footer() {
  const hq = OFFICES[0];
  return (
    <footer className="site-footer">
      <img className="footer-mark" src={asset('/img/aacci-logo-light.png')} alt="" width={512} height={512} loading="lazy" aria-hidden="true" />
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <img src={asset('/img/aacci-logo-light.png')} alt="AACCI" width={72} height={72} loading="lazy" />
          <p>{SITE.legalName}. A not-for-profit company registered with the Registrar of Companies, Gujarat.</p>
          <p className="footer-cin">CIN {SITE.cin}</p>
          <ul className="social">
            {SITE.social.map((s) => <li key={s.name}><a href={s.url} rel="noopener me">{s.name}</a></li>)}
          </ul>
        </div>
        <div className="footer-col">
          <h2 className="footer-title">Global Secretariat</h2>
          <address>{hq.lines.join(', ')}, India</address>
          <p>
            <a href={`tel:${SITE.phoneHref}`}>{SITE.phone}</a><br />
            <a href={`https://wa.me/${SITE.whatsappHref}`} rel="noopener">{SITE.whatsapp}</a> (WhatsApp)<br />
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </p>
        </div>
        <div className="footer-col">
          <h2 className="footer-title">The chamber</h2>
          <ul className="footer-links">
            {[['About AACCI', '/about/'], ['Leadership', '/leadership/'], ['Chapters', '/chapters/'], ['Membership', '/membership/'], ['Services', '/services/'],
              ['Events', '/events/'], ['News', '/news/'], ['Careers', '/careers/'], ['Contact', '/contact/'], ['Search', '/search/']].map(([l, h]) => (
              <li key={h}><Link href={h}>{l}</Link></li>
            ))}
          </ul>
        </div>
        <div className="footer-col footer-news" id="newsletter">
          <h2 className="footer-title">Newsletter</h2>
          <p>Chamber news, event dates and the quarterly newsletter.</p>
          <Newsletter />
        </div>
      </div>
      <div className="wrap footer-base">
        <p>© {new Date().getFullYear()} {SITE.legalName}</p>
        <ul>
          {[['Terms of use', '/policies/#terms'], ['Privacy policy', '/policies/#privacy'], ['Disclaimer', '/policies/#disclaimer'],
            ['Cancellation and refunds', '/policies/#refunds'], ['News feed (RSS)', '/news/feed.xml']].map(([l, h]) => (
            <li key={h}><a href={asset(h)}>{l}</a></li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
