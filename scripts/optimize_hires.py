"""Process the high-resolution originals downloaded from asianafrican.org.

Run from the repo root:  python scripts/optimize_hires.py
Reads  content/raw/images/hires/ (+ data/hires-manifest.json) and content/raw/images/ (earlier originals).
Writes public/img/people, partners, news, gallery/<album>/ and content/raw/gallery.json.
"""
import json
import re
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
HI = ROOT / 'content' / 'raw' / 'images' / 'hires'
SRC = ROOT / 'content' / 'raw' / 'images'
OUT = ROOT / 'public' / 'img'
MANIFEST = json.loads((HI / 'data' / 'hires-manifest.json').read_text(encoding='utf-8'))


def disk(name):
    """The browser shortened very long names to 110 characters."""
    p = HI / name
    if p.exists():
        return p
    q = HI / re.sub(r'\.+(?=[^.]*$)', '.', name[:110])
    return q if q.exists() else None


def load(path):
    im = Image.open(path)
    im = ImageOps.exif_transpose(im)
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA')
        bg = Image.new('RGBA', im.size, 'white')
        bg.alpha_composite(im)
        im = bg
    return im.convert('RGB')


def save(im, path, max_w, quality=82):
    path.parent.mkdir(parents=True, exist_ok=True)
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    im.save(path, 'WEBP', quality=quality, method=6)
    return im.size


# Albums for the Events gallery, newest first. Sources: ('hires', [names]) or ('gallery', index) or ('src', [names]).
ALBUMS = [
    ('secretariat-2022', 'Global Secretariat opening', 'Ahmedabad, 24 December 2022', ('hires', [f'event__AACCI_{i}.jpg' for i in range(11)])),
    ('hldm-2024', 'High Level Diplomatic Meet, Series VI', 'IIC, New Delhi, 2024', ('src', [f'photo__HLDM-S-VI-New-Delhi_{i}.jpg' for i in range(1, 7)])),
    ('aaef-2024', 'Asian African Economic Forum 2024', 'Bangkok, 4 October 2024', ('src', ['photo__AAEF_2024.png', 'photo__AAEF-2024.png', 'photo__AAEF_H.E.-Faiyaz-Murshid-Kazi.png', 'photo__MOU_AACCI-South-Korea-Chapter.png'])),
    ('awards-nigeria-2023', 'Leadership and Corporate Governance Awards', 'Abuja, Nigeria, 2 May 2023', ('gallery', 1)),
    ('ibcci-mou-2022', 'MoU with the India-Bangladesh Chamber of Commerce and Industry', '27 November 2022', ('hires', ['event__MOU_1.jpeg', 'event__MOU_2.jpeg', 'event__MOU_3.jpeg'])),
    ('hldm-2022-s3', 'High Level Diplomatic Meet 2022, session 3', 'IIC, New Delhi, 19 November 2022', ('hires', [f'event__HLDM_S3_{i}.jpg' for i in range(1, 8)])),
    ('aalf-4', 'Asian–African Leadership Forum, fourth edition', 'IIC, New Delhi, 24 April 2022', ('gallery', 24)),
    ('hldm-2022-s1', 'High Level Diplomatic Meet 2022, session 1', 'IIC, New Delhi, 19 March 2022', ('gallery', 22)),
    ('chennai-2019', 'Launch of the 5th chapter office', 'Chennai, 6 December 2019', ('gallery', 19)),
    ('auto-show-2019', 'India Auto Show 2019', 'Mumbai, 3 October 2019', ('gallery', 17)),
    ('lagos-chancery-2019', 'Courtesy meeting with the High Commission of India', 'Lagos, 18 July 2019', ('gallery', 13)),
    ('sme-seminar-2019', "Seminar on the impact of SMEs on Africa's economic development", 'Lagos, 27 April 2019', ('gallery', 10)),
    ('ip-fest-2019', 'Intellectual Property Festival 2019', 'IP FEST 2019', ('gallery', 14)),
    ('council-induction-2018', 'Governing council and advisory board induction', 'Colombo, 29 October 2018', ('gallery', 6)),
    ('healthcare-2018', 'Global Healthcare Leadership Forum', 'Ahmedabad, 20 October 2018', ('gallery', 4)),
    ('atigs-2018', 'Africa Trade and Investment Global Summit', 'Washington D.C., 24–26 June 2018', ('gallery', 3)),
    ('sme-summit-2018', 'Global SME Summit', 'Lagos, 8 April 2018', ('gallery', 2)),
    ('dubai', 'Dubai: a hub for international business', 'Dubai', ('gallery', 16)),
    ('fccisl', 'Partnership with the Federation of Chambers of Commerce and Industry of Sri Lanka', 'Sri Lanka', ('gallery', 0)),
]

PEOPLE = {**MANIFEST['people'], 'nancy-muthoni': 'event__WhatsApp-Image-2025-06-04-at-11.54.22-AM-1.jpeg'}

# Two slugs share their first 70 characters, so their manifest file names collided; these were fetched separately.
NEWS_FIX = {
    'india-uk-ceta-enters-into-force-a-new-era-of-trade-economic-cooperation': 'newsfix__ceta.jpeg',
    'india-uk-ceta-enters-into-force-a-new-era-of-trade-economic-cooperation-2': 'newsfix__manufacturing.jpeg',
}


def main():
    report = {'people': 0, 'partners': 0, 'news': 0, 'photos': 0}
    for key, name in PEOPLE.items():
        p = disk(name)
        if p:
            save(load(p), OUT / 'people' / f'{key}.webp', 900, 84)
            report['people'] += 1
    for name in MANIFEST['logos'].values():
        p = disk(name)
        if p:
            stem = name[len('logo__'):].rsplit('.', 1)[0]
            im = load(p)
            im.thumbnail((360, 360), Image.LANCZOS)
            save(im, OUT / 'partners' / f'{stem}.webp', 360, 86)
            report['partners'] += 1
    news = {}
    for slug, name in {**MANIFEST['news'], **NEWS_FIX}.items():
        p = disk(name)
        if p:
            save(load(p), OUT / 'news' / f'{slug}.webp', 1200, 80)
            news[slug] = f'news/{slug}.webp'
            report['news'] += 1
    albums = []
    for slug, title, meta, (kind, ref) in ALBUMS:
        if kind == 'gallery':
            names = [disk(n) for n in MANIFEST['gallery'][ref]['files']]
        elif kind == 'hires':
            names = [disk(n) for n in ref]
        else:
            names = [SRC / n if (SRC / n).exists() else None for n in ref]
        photos = []
        for i, p in enumerate(n for n in names if n):
            im = load(p)
            full = save(im, OUT / 'gallery' / slug / f'{i + 1:02d}.webp', 1600, 82)
            thumb = im.copy()
            thumb.thumbnail((640, 640), Image.LANCZOS)
            save(thumb, OUT / 'gallery' / slug / f'{i + 1:02d}-t.webp', 640, 76)
            photos.append({'full': f'gallery/{slug}/{i + 1:02d}.webp', 'thumb': f'gallery/{slug}/{i + 1:02d}-t.webp',
                           'w': full[0], 'h': full[1]})
        if photos:
            albums.append({'slug': slug, 'title': title, 'meta': meta, 'photos': photos})
            report['photos'] += len(photos)
    data = {'albums': albums, 'news': news}
    (ROOT / 'content' / 'raw' / 'gallery.json').write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding='utf-8')
    print(report, f'{len(albums)} albums')


if __name__ == '__main__':
    main()
