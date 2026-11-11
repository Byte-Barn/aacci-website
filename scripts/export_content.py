"""Turn the raw content exported from asianafrican.org into clean JSON for the Next.js site.

Run from the repo root:  python scripts/export_content.py

Reads   content/raw/aacci-site.json   pages, council and advisory board, policies, careers
        content/raw/news-all.json     all WordPress posts (text, dates, categories, image URLs) and page slugs
        content/raw/gallery.json      event albums (built by scripts/optimize_hires.py)
        content/raw/news-images/      optional original news images named news__<post id>.<ext>
Writes  src/content/*.json and public/img/news/<short slug>-<post id>.webp (+ -t.webp thumbnails)
"""
import html
import json
import re
from datetime import datetime
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / 'content' / 'raw'
OUT = ROOT / 'src' / 'content'
NEWS_IMG = ROOT / 'public' / 'img' / 'news'

SITE = json.loads((RAW / 'aacci-site.json').read_text(encoding='utf-8'))
NEWS = json.loads((RAW / 'news-all.json').read_text(encoding='utf-8'))
GALLERY = json.loads((RAW / 'gallery.json').read_text(encoding='utf-8'))

# Known errors on the current site, fixed on the way through (listed in docs/content-audit.md).
TEXT_FIXES = [
    ('whose registered office is 3, India, Sri Lanka, and Nigeria',
     'whose registered office is at 201, Akash Ganga Complex, Ellisbridge, Ahmedabad, Gujarat 380006, India'),
    ('the people of Ascension', 'people across Asia and Africa'),
    ('Ahmedaba.', 'Ahmedabad.'), ('Notabe', 'Notable'), ('Slovac', 'Slovak'),
    ('RESPONSIBILTIES', 'RESPONSIBILITIES'), ('ConsultanT', 'Consultant'),
    ('United State of America', 'United States of America'), ('(lST)', '(IST)'),
]
KEEP_CAPS = {'LLP', 'PLC', 'LTD', 'LTD.', 'NGO', 'SME', 'MSME', 'USA', 'UAE', 'UK', 'IT', 'AI', 'GDP', 'FDI', 'US', 'EU', 'CETA',
             'ASEAN', 'BRICS', 'AACCI', 'IMF', 'G20', 'ICT', 'PLI', 'DTAA', 'NRI', 'NRIS', 'VAT', 'GCC', 'FTA', 'FTAS', 'CFA', 'DBA', 'FICA'}


def fix(s):
    s = html.unescape(s or '')
    for a, b in TEXT_FIXES:
        s = s.replace(a, b)
    return s.replace(' ', ' ').strip()


def soften_caps(s):
    """BOARD CHAIRMAN -> Board Chairman; keeps acronyms and (MSEA)-style abbreviations."""
    if not s or not s.isupper() or len(s) < 6:
        return s
    out = []
    for w in s.split():
        core = re.sub(r'[^A-Z0-9.]', '', w)
        out.append(w if w.startswith('(') or core in KEEP_CAPS or re.match(r'^\$?\d', w) else w.capitalize())
    return ' '.join(out)


def blocks_html(blocks, skip_h1=True, heading='h3'):
    out, in_list = [], False
    for tag, text in blocks:
        text = html.escape(fix(text))
        if tag == 'h1' and skip_h1:
            continue
        if tag == 'li':
            if not in_list:
                out.append('<ul>')
                in_list = True
            out.append(f'<li>{text}</li>')
            continue
        if in_list:
            out.append('</ul>')
            in_list = False
        if tag in ('h2', 'h3', 'h4', 'h5', 'h6'):
            out.append(f'<{heading}>{text}</{heading}>')
        else:
            out.append(f'<p>{text}</p>')
    if in_list:
        out.append('</ul>')
    return ''.join(out)


# ---------- people ----------
def members():
    m = SITE['members']
    split = next(i for i, x in enumerate(m) if 'Anna Klapper' in x['lines'])
    rows = []
    for i, x in enumerate(m):
        lines = [soften_caps(fix(s)) for s in x['lines']]
        rows.append({'group': 'council' if i < split else 'advisory', 'country': lines[0], 'name': lines[1], 'role': lines[2:]})
    return rows


# ---------- pages ----------
def page_html(slug):
    blocks = SITE['pages'][slug]
    if slug == 'privacy-policy' and blocks and blocks[1][1].startswith('Please read these Conditions of use'):
        blocks = blocks[:1] + blocks[2:]  # that paragraph is the terms of use, pasted into the privacy policy
    return blocks_html(blocks)


def careers():
    roles, cur = [], None
    for tag, text in SITE['pages']['careers']:
        if tag == 'h2':
            cur = {'title': fix(text).title() if text.isupper() else fix(text), 'blocks': []}
            roles.append(cur)
        elif cur:
            cur['blocks'].append((tag, text))
    return [{'title': r['title'], 'html': blocks_html(r['blocks'], heading='h4')} for r in roles]


# ---------- news ----------
REGION = {53: 'africa', 52: 'asia', 54: 'aacci'}
ALLOWED = {'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'blockquote', 'a', 'table', 'thead', 'tbody', 'tr', 'th', 'td'}
DROP_WITH_CONTENT = {'script', 'style', 'iframe', 'noscript', 'figcaption', 'svg', 'form', 'button'}
RENAME = {'h1': 'h2', 'h5': 'h4', 'h6': 'h4', 'b': 'strong', 'i': 'em'}


class Sanitiser(HTMLParser):
    """Keeps a small set of text tags; drops scripts, embeds and every attribute except safe link targets."""

    def __init__(self, post_slugs):
        super().__init__(convert_charrefs=True)
        self.out, self.skip, self.post_slugs = [], 0, post_slugs

    def handle_starttag(self, tag, attrs):
        if tag in DROP_WITH_CONTENT:
            self.skip += 1
            return
        if self.skip:
            return
        tag = RENAME.get(tag, tag)
        if tag not in ALLOWED:
            return
        if tag == 'a':
            href = dict(attrs).get('href') or ''
            m = re.match(r'https?://(?:www\.)?asianafrican\.org/([a-z0-9-]+)/?$', href)
            if m and m.group(1) in self.post_slugs:
                self.out.append(f'<a href="/news/{m.group(1)}/">')
            elif re.match(r'^(https?:|mailto:)', href):
                self.out.append(f'<a href="{html.escape(href, quote=True)}" rel="noopener">')
            else:
                self.out.append('<a>')
            return
        self.out.append('<br>' if tag == 'br' else f'<{tag}>')

    def handle_endtag(self, tag):
        if tag in DROP_WITH_CONTENT:
            self.skip = max(0, self.skip - 1)
            return
        if self.skip:
            return
        tag = RENAME.get(tag, tag)
        if tag in ALLOWED and tag != 'br':
            self.out.append(f'</{tag}>')

    def handle_data(self, data):
        if not self.skip:
            self.out.append(html.escape(data))

    def result(self):
        s = ''.join(self.out)
        s = re.sub(r'<(p|li|h[2-4])>\s*(?:<br>\s*)*</\1>', '', s)  # empty blocks
        s = re.sub(r'\s{2,}', ' ', s)
        return s.strip()


def clean_html(raw, post_slugs):
    p = Sanitiser(post_slugs)
    p.feed(raw or '')
    p.close()
    return p.result()


def plain(raw):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', raw or ''))).strip()


def trim(text, n):
    """Shorten to n characters at a word boundary, ending with an ellipsis."""
    if len(text) <= n:
        return text
    cut = text[:n].rsplit(' ', 1)[0].rstrip(',;:.-–— ')
    return cut + '…'


def image_stem(post):
    """Short file name for a news image: the start of the slug plus the post id, e.g. africas-green-minerals-drive-a-new-era-8584.
    Keeps paths well under the 260-character Windows limit when the repo is cloned into a deep folder."""
    slug = post['slug']
    if len(slug) > 40:
        slug = slug[:40].rsplit('-', 1)[0]
    return f'{slug}-{post["id"]}'


def news_image(post):
    """Return /img/news/<stem>.webp if we have it, processing an original from content/raw/news-images when present."""
    stem = image_stem(post)
    target = NEWS_IMG / f'{stem}.webp'
    if not target.exists():
        originals = list((RAW / 'news-images').glob(f'news__{post["id"]}.*')) if (RAW / 'news-images').exists() else []
        if originals:
            from PIL import Image, ImageOps  # only needed when new originals are added
            im = ImageOps.exif_transpose(Image.open(originals[0])).convert('RGB')
            NEWS_IMG.mkdir(parents=True, exist_ok=True)
            big = im.copy()
            big.thumbnail((1200, 1200))
            big.save(target, 'WEBP', quality=80, method=6)
    if not target.exists():
        return None
    thumb = NEWS_IMG / f'{stem}-t.webp'
    if not thumb.exists():
        from PIL import Image
        im = Image.open(target)
        im.thumbnail((640, 640))
        im.save(thumb, 'WEBP', quality=76, method=6)
    from PIL import Image
    w, h = Image.open(target).size
    return {'src': f'/img/news/{stem}.webp', 'thumb': f'/img/news/{stem}-t.webp', 'w': w, 'h': h}


def news():
    posts = sorted(NEWS['posts'], key=lambda p: p['date'], reverse=True)
    slugs = {p['slug'] for p in posts}
    seen, kept, merged = {}, [], {}
    for p in posts:
        title = soften_caps(fix(p['title']))
        if not title:
            continue  # untitled drafts published by mistake
        key = re.sub(r'[^a-z0-9]', '', title.lower())
        if key in seen:
            merged[p['slug']] = seen[key]  # duplicate post: redirect it to the one we keep
            continue
        seen[key] = p['slug']
        region = next((REGION[c] for c in p['cats'] if c in REGION), 'aacci' if 54 in p['cats'] else 'world')
        body = clean_html(p['content'], slugs)
        excerpt = fix(plain(p['excerpt']))
        excerpt = re.sub(r'\s*\[(?:&hellip;|…|\.\.\.)\]\s*$', '…', excerpt)
        kept.append({
            'slug': p['slug'], 'title': title, 'date': p['date'], 'modified': p['modified'],
            'region': region, 'excerpt': trim(excerpt, 260), 'html': body,
            'words': len(plain(body).split()), 'image': news_image(p), 'source': p['link'],
        })
    return kept, merged


def gallery():
    albums = []
    for a in GALLERY['albums']:
        albums.append({**a, 'photos': [{**ph, 'full': '/img/' + ph['full'], 'thumb': '/img/' + ph['thumb']} for ph in a['photos']]})
    return albums


def redirects(posts, merged):
    """Old WordPress URLs on asianafrican.org -> pages of the new site."""
    pages = {p['slug'] for p in NEWS['pages']}
    fixed = {
        'home': '/', 'about-us': '/about/', 'message-from-founder-chairman': '/about/#founder', 'mission-vision': '/about/#mission',
        'objectives': '/about/#mission', 'affiliations-treaties': '/about/#partners', 'the-logo': '/about/#logo', 'body': '/about/#structure',
        'hierarchy': '/about/#structure', 'achievement': '/about/#award', 'messages': '/about/#founder',
        'permanent-secretariat': '/leadership/', 'governing-council-advisory-board': '/leadership/#council',
        'international-chapters': '/chapters/', 'regional-chapters': '/chapters/#india', 'regional-chapter': '/chapters/#india',
        'official-representatives': '/chapters/#representatives', 'notice': '/chapters/#partner',
        'join-aacci': '/membership/#apply', 'membership-renewal': '/membership/#renew', 'exclusive-benefits': '/membership/#benefits',
        '12-reasons-to-join-aacci': '/membership/#benefits', 'industries': '/membership/#committees', 'committees': '/membership/#committees',
        'code-of-conduct': '/membership/#conduct', 'rules-regulations': '/membership/#conduct', 'membership-categories': '/membership/#fees',
        'membership-fees': '/membership/#fees', 'corporate-members': '/membership/#members', 'membership-nomination-form': '/membership/#apply',
        'services': '/services/', 'trade-facilitation-services': '/services/#trade', 'government-representation': '/services/#government',
        'business-networking-services': '/services/#networking', 'trade-mission-fairs-exhibition-services': '/services/#missions',
        'advertising': '/services/#advertising', 'newsletters': '/services/#advertising', 'knowledge-report': '/news/',
        'annual-report': '/news/', 'upcoming-events': '/events/#next', 'past-event': '/events/#timeline', 'activity': '/events/#timeline',
        'sponsorship-opportunity': '/events/#sponsor', 'annual-general-meeting': '/events/#agm', 'photo-gallery': '/events/#gallery',
        'video-gallery': '/events/#gallery', 'press-coverage': '/news/#press', 'latest-news': '/news/', 'rss-news': '/news/',
        'contact': '/contact/', 'careers': '/careers/', 'apply': '/membership/#apply', 'terms-of-use': '/policies/#terms',
        'privacy-policy': '/policies/#privacy', 'disclaimer': '/policies/#disclaimer', 'cancellation-and-refund-policy': '/policies/#refunds',
    }
    rules = [('/' + k + '/', v) for k, v in fixed.items()]
    for slug in sorted(pages - set(fixed)):
        target = '/membership/#committees' if 'committee' in slug else ('/events/' if any(w in slug for w in ('nomination', 'registration', 'delegate', 'form')) else '/leadership/')
        rules.append((f'/{slug}/', target))
    for p in posts:
        rules.append((f'/{p["slug"]}/', f'/news/{p["slug"]}/'))
    for old, keep in merged.items():
        rules.append((f'/{old}/', f'/news/{keep}/'))
    rules += [('/category/africa-news/*', '/news/?region=africa'), ('/category/asia-news/*', '/news/?region=asia'),
              ('/category/*', '/news/'), ('/tag/*', '/news/'), ('/author/*', '/news/'), ('/feed/*', '/news/feed.xml'),
              ('/wp-content/uploads/*', '/'), ('/wp-admin/*', '/'), ('/wp-login.php', '/')]
    return rules


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    posts, merged = news()
    content = {
        'members': members(),
        'pages': {k: page_html(k) for k in ['message-from-founder-chairman', 'code-of-conduct', 'rules-regulations', 'terms-of-use',
                                           'privacy-policy', 'disclaimer', 'cancellation-and-refund-policy']},
        'careers': careers(),
        'industries': [fix(t) for tag, t in SITE['pages']['industries'] if tag == 'li'],
        'press': [fix(t) for tag, t in SITE['pages']['press-coverage'] if tag in ('h4', 'h3', 'p') and len(t) > 20],
    }
    (OUT / 'site.json').write_text(json.dumps(content, ensure_ascii=False, indent=1), encoding='utf-8')
    (OUT / 'news.json').write_text(json.dumps(posts, ensure_ascii=False), encoding='utf-8')
    (OUT / 'gallery.json').write_text(json.dumps(gallery(), ensure_ascii=False, indent=1), encoding='utf-8')
    rules = redirects(posts, merged)
    (ROOT / 'public' / '_redirects').write_text(
        '# Old asianafrican.org addresses -> new pages (Netlify format). Generated by scripts/export_content.py\n'
        + '\n'.join(f'{a}  {b}  301' for a, b in rules) + '\n', encoding='utf-8')
    with_img = sum(1 for p in posts if p['image'])
    print(f'{len(content["members"])} members, {len(posts)} news posts ({with_img} with images, {len(merged)} duplicates merged), '
          f'{len(GALLERY["albums"])} albums, {len(rules)} redirects')


if __name__ == '__main__':
    main()
