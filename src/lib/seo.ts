import type { Metadata } from 'next';
import { SITE, OFFICES, SECRETARIAT, TIMELINE } from '@/content/data';
import type { NewsPost } from '@/lib/content';

/** Full public address of a root-based path. SITE.url already includes any sub-path the site is served under. */
export const abs = (path: string) => `${SITE.url}${path}`;

/** Page metadata with canonical URL, Open Graph and Twitter cards. */
export function pageMeta(opts: { title: string; description: string; path: string; image?: string; type?: 'website' | 'article' }): Metadata {
  const image = abs(opts.image ?? '/img/og.jpg');
  const url = abs(opts.path);
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      type: opts.type ?? 'website',
      url,
      title: opts.title,
      description: opts.description,
      siteName: SITE.name,
      locale: 'en_GB',
      images: [{ url: image, width: 1200, height: 630, alt: SITE.name }],
    },
    twitter: { card: 'summary_large_image', title: opts.title, description: opts.description, images: [image] },
  };
}

const hq = OFFICES[0];

export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': abs('/#organization'),
    name: SITE.legalName,
    alternateName: [SITE.short, SITE.name],
    url: SITE.url,
    logo: { '@type': 'ImageObject', url: abs('/img/aacci-logo.png'), width: 512, height: 512 },
    image: abs('/img/og.jpg'),
    description: SITE.description,
    foundingDate: SITE.founded,
    identifier: { '@type': 'PropertyValue', propertyID: 'CIN', value: SITE.cin },
    email: SITE.email,
    telephone: SITE.phone,
    areaServed: [{ '@type': 'Continent', name: 'Asia' }, { '@type': 'Continent', name: 'Africa' }],
    address: {
      '@type': 'PostalAddress', streetAddress: hq.street, addressLocality: hq.locality, addressRegion: hq.region,
      postalCode: hq.postalCode, addressCountry: hq.country,
    },
    contactPoint: [
      { '@type': 'ContactPoint', contactType: 'customer support', telephone: SITE.phone, email: SITE.email, areaServed: ['Asia', 'Africa'], availableLanguage: ['English'] },
      { '@type': 'ContactPoint', contactType: 'membership', email: SITE.emails.support },
    ],
    founder: { '@type': 'Person', name: 'Dr. G.D. Singh', jobTitle: 'Founder and Chairman' },
    member: SECRETARIAT.map((p) => ({ '@type': 'OrganizationRole', roleName: p.role, member: { '@type': 'Person', name: p.name, image: abs(p.img) } })),
    location: OFFICES.map((o) => ({
      '@type': 'Place', name: `${o.tag}, ${o.city}`,
      address: { '@type': 'PostalAddress', streetAddress: o.street, addressLocality: o.locality, addressRegion: o.region, postalCode: o.postalCode || undefined, addressCountry: o.country },
    })),
    sameAs: SITE.social.map((s) => s.url),
  };
}

export function websiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': abs('/#website'),
    url: SITE.url,
    name: SITE.name,
    alternateName: SITE.short,
    inLanguage: 'en',
    publisher: { '@id': abs('/#organization') },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: abs('/search/?q={search_term_string}') },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: abs(t.path) })),
  };
}

export function articleLd(post: NewsPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: { '@type': 'WebPage', '@id': abs(`/news/${post.slug}/`) },
    headline: post.title.slice(0, 110),
    description: post.excerpt,
    datePublished: post.date.slice(0, 10),
    dateModified: post.modified.slice(0, 10),
    image: post.image ? [abs(post.image.src)] : [abs('/img/og.jpg')],
    articleSection: post.region === 'aacci' ? 'AACCI' : `${post.region[0].toUpperCase()}${post.region.slice(1)} news`,
    wordCount: post.words,
    inLanguage: 'en',
    author: { '@type': 'Organization', name: SITE.legalName, url: SITE.url },
    publisher: { '@id': abs('/#organization'), '@type': 'Organization', name: SITE.legalName, logo: { '@type': 'ImageObject', url: abs('/img/aacci-logo.png') } },
  };
}

export function eventsLd() {
  const items = TIMELINE.flatMap((y) => y.events.filter((e) => e.iso && e.place !== 'Online').map((e) => ({ ...e, year: y.year })));
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'AACCI events since 2018',
    itemListElement: items.map((e, i) => ({
      '@type': 'ListItem', position: i + 1,
      item: {
        '@type': 'Event', name: e.name, startDate: e.iso, eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: { '@type': 'Place', name: e.place, address: e.place },
        organizer: { '@id': abs('/#organization'), '@type': 'Organization', name: SITE.legalName, url: SITE.url },
      },
    })),
  };
}

export function personListLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'AACCI Permanent Secretariat',
    itemListElement: SECRETARIAT.map((p, i) => ({
      '@type': 'ListItem', position: i + 1,
      item: { '@type': 'Person', name: p.name, jobTitle: p.role, image: abs(p.img), worksFor: { '@id': abs('/#organization') } },
    })),
  };
}
