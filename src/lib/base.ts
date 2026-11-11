/**
 * Sub-path the site is served under, for example "/aacci-website" on GitHub Pages.
 * Empty when the site sits at the root of a domain. Set NEXT_PUBLIC_BASE_PATH at build time.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/**
 * Add the base path to a root-based path ("/img/logo.png", "/news/feed.xml").
 * Use it for every image, plain <a>, fetch and form action. next/link and the
 * router add the base path themselves, so their hrefs must not be wrapped.
 * Anything that is not root-based ("#apply", "mailto:", "https://") is returned unchanged.
 */
export const asset = (path: string) => (path.startsWith('/') ? `${BASE_PATH}${path}` : path);
