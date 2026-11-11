"""Turn the original images in content/raw/images into web-sized WebP files in public/img.

Run from the repo root:  python scripts/optimize_images.py
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'content' / 'raw' / 'images'
OUT = ROOT / 'public' / 'img'

# Ethiopia meeting photos carry a burned-in caption bar across the lower third
# (y > ~392 of 600). We keep the clean top band and set the caption as real text.
ETHIOPIA = {
    'eth-deputy-pm': 'photo__Deputy-Prime-Minister-Republic-of-Ethiopia-1.jpg',
    'eth-chamber': 'photo__Ethiopian-Chamber-of-Commerce-Sectoral-Association-Republic-of-Ethiopia-1.jpg',
    'eth-tourism': 'photo__FDRE-Ministry-of-Tourism-Republic-of-Ethiopia-1.jpg',
    'eth-innovation': 'photo__Ministry-of-Innovation-Technology-Republic-of-Ethiopia-1.jpg',
    'eth-trade': 'photo__Ministry-of-Trade-Regional-Integration-Republic-of-Ethiopia-1.jpg',
    'eth-agriculture': 'photo__Natural-Resources-Sustainable-Agriculture-Republic-of-Ethiopia-1.jpg',
}

PHOTOS = {
    'hldm-1': 'photo__HLDM-S-VI-New-Delhi_1.jpg',
    'hldm-2': 'photo__HLDM-S-VI-New-Delhi_2.jpg',
    'hldm-3': 'photo__HLDM-S-VI-New-Delhi_3.jpg',
    'hldm-4': 'photo__HLDM-S-VI-New-Delhi_4.jpg',
    'hldm-5': 'photo__HLDM-S-VI-New-Delhi_5.jpg',
    'hldm-6': 'photo__HLDM-S-VI-New-Delhi_6.jpg',
    'hldm-2023': 'event__HLDM-S4-2023.jpg',
    'gala-022': 'photo__022.jpg',
    'forum-03': 'photo__03.jpg',
    'forum-05': 'photo__05.jpg',
    'group-06': 'photo__06.jpg',
    'group-10': 'photo__10.jpg',
    'awards-8': 'photo__8.jpg',
    'awards-9': 'photo__9.jpg',
    'award-01': 'photo__01.jpg',
    'aaef-stage': 'photo__AAEF-2024.png',
    'aaef-group': 'photo__AAEF_2024.png',
    'aaef-award': 'photo__AAEF_H.E.-Faiyaz-Murshid-Kazi.png',
    'aaef-panel': 'photo__Panel-Discussion_AALF-.png',
    'bela-2024': 'photo__BELA-2024.png',
    'mou-korea': 'photo__MOU_AACCI-South-Korea-Chapter.png',
    'news-dangote': 'photo__WhatsApp-Image-2026-10-05-at-1.46.38-PM.jpeg',
    'news-zambia': 'photo__WhatsApp-Image-2026-08-05-at-3.51.12-PM.jpeg',
    'news-bishoftu': 'photo__WhatsApp-Image-2026-08-03-at-1.17.39-PM.jpeg',
    'glory-book': 'photo__India-Glory-Book.jpeg',
    'textile-show': 'event__SL.jpg-1.jpeg',
}

PEOPLE = {
    'gd-singh': 'people__GD-Singh-300x300.png',
    'neetu-singh': 'people__Neetu-Singh-Profile-pic-2025-300x300.png',
    'leye-babalola': 'people__leye-200x250xc.jpg',
    'mj-puri': 'people__WhatsApp-Image-2026-09-11-at-4.01.29-PM-1-200x300.jpeg',
    'ravi-swamy': 'people__WhatsApp-Image-2026-09-29-at-12.03.58-PM-300x300.jpeg',
    'mangesh-amale': 'people__Mangesh-Amale-150x150.jpeg',
    'divya-rao': 'people__Divya-Rao-150x150.jpeg',
    'dalveer-bawa': 'people__Dalveer-Bawa-150x150.jpeg',
    'rohini-sharma': 'people__Rohini-Sharma-150x150.jpeg',
}


def save(im, name, width, quality=80):
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    path = OUT / f'{name}.webp'
    im.save(path, 'WEBP', quality=quality, method=6)
    return path, im.size


def main():
    (OUT / 'people').mkdir(parents=True, exist_ok=True)
    (OUT / 'partners').mkdir(parents=True, exist_ok=True)
    report = []
    for name, src in ETHIOPIA.items():
        im = Image.open(SRC / src).convert('RGB').crop((0, 0, 1500, 392))
        report.append(save(im, name, 1500))
    for name, src in PHOTOS.items():
        im = Image.open(SRC / src).convert('RGB')
        report.append(save(im, name, 1600))
    for name, src in PEOPLE.items():
        im = Image.open(SRC / src).convert('RGB')
        report.append(save(im, f'people/{name}', 600, 84))
    logo = Image.open(SRC / 'photo__Logo-1.png').convert('RGBA')
    logo.save(OUT / 'aacci-logo.png', optimize=True)
    for p in sorted(SRC.glob('logo__*')):
        stem = p.name[len('logo__'):].rsplit('.', 1)[0]
        stem = stem.replace('-200x200xc', '').lower()
        im = Image.open(p).convert('RGBA')
        bg = Image.new('RGBA', im.size, 'white')
        bg.alpha_composite(im)
        report.append(save(bg.convert('RGB'), f'partners/{stem}', 240, 82))
    total = sum(path.stat().st_size for path, _ in report)
    for path, size in report:
        print(f'{path.relative_to(OUT)}  {size[0]}x{size[1]}  {path.stat().st_size // 1024} KB')
    print(f'{len(report)} files, {total / 1048576:.1f} MB')


if __name__ == '__main__':
    main()
