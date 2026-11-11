import type { MetadataRoute } from 'next';
import { SITE } from '@/content/data';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.short,
    description: SITE.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#10232A',
    theme_color: '#10232A',
    icons: [{ src: '/img/aacci-logo.png', sizes: '512x512', type: 'image/png' }],
  };
}
