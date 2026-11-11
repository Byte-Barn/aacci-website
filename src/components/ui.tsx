import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { PARTNERS, SITE } from '@/content/data';
import { REGION_LABEL, formatDate, type NewsCardData } from '@/lib/format';
import { breadcrumbLd } from '@/lib/seo';

type HeadingTag = 'h1' | 'h2' | 'h3';

/** Heading split into word spans so it can rise in line by line. Full text stays in aria-label for screen readers and crawlers. */
export function Words({ text, as: Tag = 'h2', className, id }: { text: string; as?: HeadingTag; className?: string; id?: string }) {
  const words = text.split(/\s+/);
  return (
    <Tag className={className} id={id} data-reveal="lines" aria-label={text}>
      {words.map((w, i) => (
        <span key={i}>
          <span className="w" aria-hidden="true">
            <span style={{ '--wi': i } as CSSProperties}>{w}</span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}

export const Stripes = () => (
  <div className="stripes" aria-hidden="true"><i /><i /><i /></div>
);

export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

export function PageHero({
  title, lead, crumbs, actions, children, short, mark = true,
}: {
  title: string; lead: string; crumbs: { name: string; href: string }[]; actions?: ReactNode; children?: ReactNode; short?: boolean; mark?: boolean;
}) {
  const trail = [{ name: 'Home', href: '/' }, ...crumbs];
  return (
    <section className={`page-hero${short ? ' page-hero--short' : ''}${children ? ' page-hero--map' : ''}`}>
      <JsonLd data={breadcrumbLd(trail.map((c) => ({ name: c.name, path: c.href })))} />
      <div className="wrap page-hero-inner">
        <nav className="crumbs" aria-label="Breadcrumb">
          <ol>
            {trail.map((c, i) => (
              <li key={c.href} {...(i === trail.length - 1 ? { 'aria-current': 'page' as const } : {})}>
                {i === trail.length - 1 ? c.name : <Link href={c.href}>{c.name}</Link>}
              </li>
            ))}
          </ol>
        </nav>
        <Words as="h1" className="page-title" text={title} />
        <p className="page-lead">{lead}</p>
        {actions ? <div className="page-hero-actions">{actions}</div> : null}
      </div>
      {children}
      {mark && !children ? <img className="page-hero-mark" src="/img/aacci-logo-light.png" alt="" width={512} height={512} /> : null}
      {!children ? <div className="page-hero-stripes" aria-hidden="true"><i /><i /><i /></div> : null}
    </section>
  );
}

export function SectionHead({ title, id, intro, split = true }: { title: string; id?: string; intro?: ReactNode; split?: boolean }) {
  return (
    <div className={`section-head${split ? ' section-head--split' : ''}`}>
      <Words className="h2" id={id} text={title} />
      {intro ? <p className="section-intro" data-reveal="">{intro}</p> : null}
    </div>
  );
}

export function Btn({ href, children, variant = 'primary', ...rest }: { href: string; children: ReactNode; variant?: 'primary' | 'ghost' | 'dark' | 'line' } & Record<string, unknown>) {
  const cls = `btn btn--${variant}`;
  const external = /^(https?:|mailto:|tel:)/.test(href);
  return external
    ? <a className={cls} href={href} rel={href.startsWith('http') ? 'noopener' : undefined} {...rest}><span>{children}</span></a>
    : <Link className={cls} href={href} {...rest}><span>{children}</span></Link>;
}

/** News card: the story's own photo, or a branded tile when the original has none. */
export function NewsCard({ post, lead = false }: { post: NewsCardData; lead?: boolean }) {
  const label = REGION_LABEL[post.region];
  return (
    <li className={`story${lead ? ' story--lead' : ''}`} data-region={post.region}>
      <Link href={`/news/${post.slug}/`} prefetch={false}>
        <div className="story-media fx" data-tilt="">
          {post.image ? (
            <img className="story-img" src={lead ? post.image.src : post.image.thumb} alt="" width={post.image.w} height={post.image.h} loading="lazy" decoding="async" />
          ) : (
            <div className="story-media--brand" data-region={post.region} style={{ position: 'absolute', inset: 0 }}>
              <img className="brand-mark" src="/img/aacci-emblem-light.png" alt="" width={464} height={269} loading="lazy" />
              <span className="brand-region">{label}</span>
            </div>
          )}
        </div>
        <p className="story-meta">
          <span className={`tag tag--${post.region === 'aacci' ? 'world' : post.region}`}>{label}</span>
          <time dateTime={post.date.slice(0, 10)}>{formatDate(post.date)}</time>
        </p>
        <h3 className="story-title">{post.title}</h3>
        {lead && post.excerpt ? <p className="story-dek">{post.excerpt}</p> : null}
      </Link>
    </li>
  );
}

export function Partners({ id = 'partners' }: { id?: string }) {
  return (
    <section className="partners section" id={id} aria-labelledby={`${id}-title`}>
      <div className="wrap">
        <SectionHead id={`${id}-title`} title="Affiliations and treaties" intro="Chambers, trade bodies, universities and development agencies that AACCI has signed agreements with." />
      </div>
      <div className="marquee" data-marquee="">
        {PARTNERS.map((row, r) => (
          <ul className={`marquee-row${r % 2 ? ' marquee-row--reverse' : ''}`} key={r}>
            {[...row, ...row].map((p, i) => (
              <li key={i} {...(i >= row.length ? { 'data-clone': '', 'aria-hidden': true } : {})}>
                <img src={`/img/partners/${p.file}.webp`} alt={i >= row.length ? '' : p.name} width={200} height={200} loading="lazy" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}

export function Cta() {
  return (
    <section className="cta" aria-labelledby="cta-title">
      <div className="cta-ribbon" aria-hidden="true"><i /><i /><i /></div>
      <div className="wrap cta-inner">
        <Words as="h2" className="cta-title" id="cta-title" text="Bring your business to the Asia–Africa table." />
        <div className="cta-actions" data-reveal="">
          <Btn href="/membership/#apply" variant="dark">Become a member</Btn>
          <Btn href={`https://wa.me/${SITE.whatsappChat}`} variant="line">Message us on WhatsApp</Btn>
        </div>
      </div>
    </section>
  );
}

export const Prose = ({ html, className = 'prose' }: { html: string; className?: string }) => (
  <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
);
