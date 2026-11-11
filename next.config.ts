import type { NextConfig } from 'next';

// Fully static site: `next build` writes plain HTML, CSS, JS and files to /out.
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  agentRules: false,
};

export default nextConfig;
