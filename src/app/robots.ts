import type { MetadataRoute } from 'next';
import { SITE } from '@/content/data';

export const dynamic = 'force-static';

// Open to every crawler, including AI and answer engines; only the form thank-you page is kept out.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/thanks/'] }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
