import type { NextConfig } from 'next';

// Fully static site: `next build` writes plain HTML, CSS, JS and files to /out.
const nextConfig: NextConfig = {
  output: 'export',
  // Sub-path the site is served under ("/aacci-website" on GitHub Pages); unset at a domain root.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  agentRules: false,
};

export default nextConfig;
