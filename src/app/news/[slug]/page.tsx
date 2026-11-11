import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd, NewsCard, Prose } from '@/components/ui';
import { SITE } from '@/content/data';
import { REGION_LABEL, formatDate, news, newsBySlug, readingTime, relatedNews, toCard } from '@/lib/content';
import { articleLd, breadcrumbLd, pageMeta } from '@/lib/seo';

export const dynamicParams = false;
export const generateStaticParams = () => news.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = newsBySlug((await params).slug);
  if (!post) return {};
  const meta = pageMeta({ title: post.title, description: post.excerpt.slice(0, 160), path: `/news/${post.slug}/`, image: post.image?.src, type: 'article' });
  return {
    ...meta,
    openGraph: { ...meta.openGraph, type: 'article', publishedTime: post.date, modifiedTime: post.modified, section: REGION_LABEL[post.region], authors: [SITE.legalName] },
  };
}

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const post = newsBySlug((await params).slug);
  if (!post) notFound();
  const i = news.findIndex((p) => p.slug === post.slug);
  const newer = news[i - 1];
  const older = news[i + 1];
  const url = encodeURIComponent(`${SITE.url}/news/${post.slug}/`);
  return (
    <>
      <JsonLd data={[articleLd(post), breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'News', path: '/news/' }, { name: post.title, path: `/news/${post.slug}/` }])]} />
      <article className="article">
        <header className="article-head">
          <div className="wrap narrow">
            <nav className="crumbs" aria-label="Breadcrumb"><ol><li><Link href="/">Home</Link></li><li><Link href="/news/">News</Link></li><li aria-current="page">Article</li></ol></nav>
            <p className="story-meta">
              <Link className={`tag tag--${post.region === 'aacci' ? 'world' : post.region}`} href={`/news/?region=${post.region}`}>{REGION_LABEL[post.region]}</Link>
              <time dateTime={post.date.slice(0, 10)}>{formatDate(post.date)}</time>
            </p>
            <h1 className="article-title">{post.title}</h1>
            <p className="article-byline"><img src="/img/aacci-logo-light.png" alt="" width={40} height={40} />AACCI Newsroom<span aria-hidden="true"> </span><span className="article-read">{readingTime(post.words)} min read</span></p>
          </div>
        </header>
        <div className="wrap narrow">
          {post.image ? (
            <figure className="article-figure fx" data-tilt=""><img src={post.image.src} alt="" width={post.image.w} height={post.image.h} /></figure>
          ) : null}
          <Prose className="prose article-body" html={post.html || `<p>${post.excerpt}</p>`} />
          <div className="share">
            <p>Share this story</p>
            <ul>
              <li><a href={`https://wa.me/?text=${url}`} rel="noopener">WhatsApp</a></li>
              <li><a href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`} rel="noopener">LinkedIn</a></li>
              <li><a href={`https://x.com/intent/post?url=${url}`} rel="noopener">X</a></li>
              <li><a href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${url}`}>Email</a></li>
            </ul>
          </div>
          <nav className="pager" aria-label="More stories">
            {newer ? <Link className="pager-link" href={`/news/${newer.slug}/`} rel="prev"><small>Newer story</small>{newer.title}</Link> : <span />}
            {older ? <Link className="pager-link pager-link--older" href={`/news/${older.slug}/`} rel="next"><small>Older story</small>{older.title}</Link> : <span />}
          </nav>
        </div>
      </article>
      <section className="section section--mist" aria-labelledby="more-news-title">
        <div className="wrap">
          <div className="section-head section-head--split">
            <h2 id="more-news-title" className="h2">More {REGION_LABEL[post.region] === 'World' ? '' : `${REGION_LABEL[post.region]} `}news</h2>
            <p className="section-intro"><Link className="text-link" href="/news/">All news</Link></p>
          </div>
          <ul className="news-list">{relatedNews(post, 3).map((p) => <NewsCard key={p.slug} post={toCard(p)} />)}</ul>
        </div>
      </section>
    </>
  );
}
