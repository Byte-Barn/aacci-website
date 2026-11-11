"""Generate the map data for the WorldMap component: src/content/map.json.

Run from the repo root:  python scripts/build_map.py

Land comes from Natural Earth 1:50m (public domain, tools/data/ne_50m_land.geojson),
drawn as a halftone of dots on an equirectangular grid. Pins use real coordinates.
"""
import html
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LAND = ROOT / 'scripts' / 'data' / 'ne_50m_land.geojson'
LON0, LON1, LAT0, LAT1 = -20.0, 146.0, -36.0, 42.0
S = 10.0  # SVG units per degree
W, H = (LON1 - LON0) * S, (LAT1 - LAT0) * S
STEP = 11.0  # dot spacing in SVG units (1.1 degrees)


def xy(lat, lon):
    return (lon - LON0) * S, (LAT1 - lat) * S


# Places from asianafrican.org (contact, chapters and representatives pages).
# kind: hq = secretariat, chapter = chapter or country office, rep = official representative
# region drives the map filters. label: where the name sits (r, l, b, t) or '' for none.
PLACES = [
    ('ahmedabad', 'Ahmedabad', 'Global Secretariat', 'Akash Ganga Complex, Ellisbridge', 'hq', 'india', 23.03, 72.58, 'r'),
    ('mumbai', 'Mumbai', 'National Secretariat, India', 'Prestige Turf Tower, Mahalakshmi', 'hq', 'india', 19.08, 72.88, 'l'),
    ('delhi', 'New Delhi', 'Delhi NCR chapter', 'Home of the High Level Diplomatic Meet', 'chapter', 'india', 28.61, 77.21, 'r'),
    ('chandigarh', 'Chandigarh', 'Punjab chapter', 'President: Dr. Vishal Kalra', 'chapter', 'india', 30.73, 76.78, ''),
    ('kolkata', 'Kolkata', 'East India chapter', 'President: Dr. (H.C.) Mamta Binani', 'chapter', 'india', 22.57, 88.36, ''),
    ('bhubaneswar', 'Bhubaneswar', 'Odisha chapter', 'Chapter President: Dr Lita Mohapatra', 'chapter', 'india', 20.30, 85.82, ''),
    ('chennai', 'Chennai', 'Tamil Nadu chapter', 'Chapter President: Ms. Jani Jermans', 'chapter', 'india', 13.08, 80.27, ''),
    ('colombo', 'Sri Lanka', 'Sri Lanka chapter', 'Asian regional secretariat', 'chapter', 'asia', 6.93, 79.86, 'r'),
    ('dhaka', 'Bangladesh', 'Bangladesh chapter', 'Launched December 2022', 'chapter', 'asia', 23.81, 90.41, 'r'),
    ('hongkong', 'Hong Kong', 'Hong Kong chapter', 'President: Dr. Sandeep Sekhri', 'chapter', 'asia', 22.32, 114.17, 'r'),
    ('manila', 'Philippines', 'Philippines chapter', 'President: Sherlyn Solanoy', 'chapter', 'asia', 14.60, 120.98, 'r'),
    ('seoul', 'South Korea', 'South Korea chapter', 'Chapter MoU signed at AAEF 2024', 'chapter', 'asia', 37.57, 126.98, 'l'),
    ('tokyo', 'Japan', 'Japan chapter', 'President: Sujan Sanku', 'chapter', 'asia', 35.68, 139.69, 'b'),
    ('dubai', 'Dubai', 'Official representative', 'Adv. CA Dr. Harsh Patel', 'rep', 'gulf', 25.20, 55.27, 'l'),
    ('addis', 'Ethiopia', 'Ethiopia chapter', 'President: Selamawit Zemene', 'chapter', 'africa', 9.03, 38.74, 'r'),
    ('nairobi', 'Kenya', 'Kenya country office', 'Country Director: Nancy Muthoni', 'chapter', 'africa', -1.29, 36.82, 'r'),
    ('lagos', 'Nigeria', 'Nigeria chapter', 'African regional secretariat, Lagos', 'chapter', 'africa', 6.52, 3.38, 'b'),
    ('freetown', 'Sierra Leone', 'Sierra Leone chapter', 'Office bearers inducted April 2019', 'chapter', 'africa', 8.48, -13.23, 't'),
    ('accra', 'Ghana', 'Official representative', 'Charles Botse Bennin', 'rep', 'africa', 5.60, -0.19, ''),
    ('abidjan', 'Ivory Coast', 'Official representative', 'H.E. Ambassador Arnaud Dibi', 'rep', 'africa', 5.36, -4.01, ''),
    ('lome', 'Togo', 'Official representative', 'Coubageat Toure Mohamed Abdel Malik', 'rep', 'africa', 6.13, 1.22, ''),
    ('rabat', 'Morocco', 'Official representative', 'Mounir El Bouamri, Eng', 'rep', 'africa', 34.02, -6.84, 'r'),
    ('luanda', 'Angola', 'Official representative', 'Rui Matata Manuel', 'rep', 'africa', -8.84, 13.23, 'l'),
    ('mbabane', 'Eswatini', 'Official representative', 'Dalton Ncamiso Nxumalo', 'rep', 'africa', -26.31, 31.14, 'l'),
    ('portlouis', 'Mauritius', 'Mauritius chapter', 'Founder and Director: Siven Pillay', 'chapter', 'africa', -20.16, 57.50, 'r'),
]
ORIGIN = 'ahmedabad'

# Routes that leave the frame towards places outside it.
EXITS = [
    ('europe', 'To France', 46.5, 2.35, (2.35 + 0.8, LAT1 - 1.6), 'start'),
    ('americas', 'To the USA, Jamaica and Mexico', 20.0, -26.0, (LON0 + 0.8, 21.2), 'start'),
]


def load_land():
    data = json.loads(LAND.read_text(encoding='utf-8'))
    polys = []
    for feat in data['features']:
        geom = feat['geometry']
        parts = [geom['coordinates']] if geom['type'] == 'Polygon' else geom['coordinates']
        for rings in parts:
            outer = rings[0]
            lons = [p[0] for p in outer]
            lats = [p[1] for p in outer]
            if max(lons) < LON0 - 1 or min(lons) > LON1 + 1 or max(lats) < LAT0 - 1 or min(lats) > LAT1 + 1:
                continue
            proj = lambda ring: [xy(lat, lon) for lon, lat in ring]
            o = proj(outer)
            xs = [p[0] for p in o]
            ys = [p[1] for p in o]
            polys.append({'outer': o, 'holes': [proj(h) for h in rings[1:]],
                          'bbox': (min(xs), min(ys), max(xs), max(ys))})
    return polys


def inside(px, py, poly):
    hit = False
    j = len(poly) - 1
    for i in range(len(poly)):
        xi, yi = poly[i]
        xj, yj = poly[j]
        if (yi > py) != (yj > py) and px < (xj - xi) * (py - yi) / (yj - yi) + xi:
            hit = not hit
        j = i
    return hit


def on_land(x, y, poly):
    x0, y0, x1, y1 = poly['bbox']
    if not (x0 <= x <= x1 and y0 <= y <= y1):
        return False
    return inside(x, y, poly['outer']) and not any(inside(x, y, h) for h in poly['holes'])


def build_dots(polys):
    pts, hit_polys = [], set()
    row, y = 0, STEP / 2
    while y < H:
        x = STEP / 2 + (STEP / 2 if row % 2 else 0)
        while x < W:
            for k, p in enumerate(polys):
                if on_land(x, y, p):
                    pts.append((x, y))
                    hit_polys.add(k)
                    break
            x += STEP
        y += STEP * 0.866
        row += 1
    # Islands too small to catch a grid point still get one dot (Mauritius, Zanzibar, Bahrain...).
    for k, p in enumerate(polys):
        if k in hit_polys:
            continue
        x0, y0, x1, y1 = p['bbox']
        if max(x1 - x0, y1 - y0) < 2.0 or not (0 <= x0 <= W and 0 <= y0 <= H):
            continue
        pts.append(((x0 + x1) / 2, (y0 + y1) / 2))
    return ''.join(f'M{x:.0f} {y:.0f}h0' for x, y in pts), len(pts)


def route(o, c):
    (x0, y0), (x1, y1) = o, c
    mx, my = (x0 + x1) / 2, (y0 + y1) / 2
    dx, dy = x1 - x0, y1 - y0
    dist = math.hypot(dx, dy)
    nx, ny = -dy / dist, dx / dist
    if ny < 0:  # bow south, like a sea lane
        nx, ny = -nx, -ny
    k = 0.24 * dist
    return lambda off: (f'M{x0:.1f} {y0:.1f}Q{mx + nx * (k + off):.1f} {my + ny * (k + off):.1f} '
                        f'{x1:.1f} {y1:.1f}')


LABEL_POS = {'r': (11, 5, 'start'), 'l': (-11, 5, 'end'), 'b': (0, 22, 'middle'), 't': (0, -12, 'middle')}


def main():
    import json
    polys = load_land()
    dots, n = build_dots(polys)
    places = {p[0]: p for p in PLACES}
    ox, oy = xy(places[ORIGIN][6], places[ORIGIN][7])
    routes, pins, labels = [], [], []
    order = 0
    for key, name, role, note, kind, region, lat, lon, label in PLACES:
        x, y = xy(lat, lon)
        if key != ORIGIN and kind != 'hq':
            mk = route((ox, oy), (x, y))
            routes.append({'key': key, 'region': region, 'delay': round(0.9 + order * 0.07, 2), 'exit': False,
                           'r': mk(-6), 'g': mk(6), 'o': mk(0)})
            order += 1
        lab = None
        if label:
            dx, dy, anchor = LABEL_POS[label]
            lab = {'x': round(x + dx, 1), 'y': round(y + dy, 1), 'anchor': anchor}
        pins.append({'key': key, 'name': name, 'role': role, 'note': note, 'kind': kind, 'region': region,
                     'x': round(x, 1), 'y': round(y, 1), 'label': lab})
    for key, text, lat, lon, (llon, llat), anchor in EXITS:
        ex, ey = xy(lat, lon)
        if lat > LAT1:
            ey = -30
        mk = route((ox, oy), (ex, ey))
        routes.append({'key': key, 'region': 'beyond', 'delay': round(0.9 + order * 0.07, 2), 'exit': True,
                       'r': mk(-6), 'g': mk(6), 'o': mk(0)})
        lx, ly = xy(llat, llon)
        labels.append({'text': text, 'x': round(lx, 1), 'y': round(ly, 1), 'anchor': anchor})
        order += 1
    data = {'width': round(W), 'height': round(H), 'origin': {'x': round(ox, 1), 'y': round(oy, 1)},
            'equatorY': round(xy(0, 0)[1], 1), 'dots': dots, 'routes': routes, 'pins': pins, 'exitLabels': labels}
    out = ROOT / 'src' / 'content' / 'map.json'
    out.write_text(json.dumps(data, ensure_ascii=False), encoding='utf-8')
    print(f'{len(polys)} land shapes in view, {n} dots, {len(routes)} routes, {len(pins)} pins -> {out.name}')


if __name__ == '__main__':
    main()
