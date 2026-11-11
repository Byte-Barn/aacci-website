# Content audit: asianafrican.org

This is a review of the current WordPress site, made while migrating its content (November 2026). It lists the problems found, the corrections applied in this repo, and the questions the chamber still needs to answer.

## Problems on the current site

### Technical
- **Bot check:** every page and image sits behind a bot check ("One moment, please…"). Search engines' fallback fetchers and link previews (WhatsApp, LinkedIn, Facebook) get a challenge page instead of content.
- **Sitemap:** `robots.txt` points to `/sitemap_index.xml`, but every sitemap URL returns 404.
- **Broken link:** the footer link "AACCI Advantage" returns 404.
- **Old domains:** some files load from old domains. The Knowledge Report PDF and the founder's photo load from `test.asianafrican.org`; the logo page image loads from `aacci.ubgroup.asia`.
- **Junk posts:** untitled draft posts and duplicate posts are published. The new site leaves them out and redirects the duplicates.
- **Burned-in captions:** captions are baked into the home page photos, with typos ("Haseen", "Minster"). The new site crops the captions off and sets them as real text.
- **Missing alt text:** many images have empty alt text.

### Content

| Topic | Conflict on the current site |
| --- | --- |
| Founding date | Incorporated 2018, "conceptualized in 2015", and "around 10 years back" |
| Countries | "More than 100" and "102" |
| Founder's title | "Founder & Chairman" and "Founder & President" |
| Phone numbers | +91 90999 93461, +91 63593 63632 and +91 98987 96566 |
| Office hours | Monday–Friday 10:00–18:00 (renewal page) and Monday–Saturday 10:00–19:00 (notice page) |

- **Committees:** the site claims 57 committees but lists 56 industries.
- **Stale events:** "Upcoming events" lists an event that has already happened.

## Corrections applied in this repo

These are made in `scripts/export_content.py`.
- **Terms of use:** the registered office read "3, India, Sri Lanka, and Nigeria". It now gives the Global Secretariat address.
- **Privacy policy:** a paragraph from the terms of use had been pasted at the top. It is removed.
- **Founder's message:** "the people of Ascension" (template text) now reads "people across Asia and Africa".
- **Typos fixed:** "Ahmedaba", "Notabe", "Slovac", "RESPONSIBILTIES", "ConsultanT", "United State of America", "(lST)".
- **Capitals:** all-capitals headlines and job titles are set in title case. Acronyms are kept.
- **Testimonials:** quotes were lightly copy-edited for grammar. The chamber should approve the edits.

## Questions for the chamber

1. **Founding year:** confirm 2018 (incorporation) as the year to publish.
2. **Phone numbers:** which are current? The site shows +91 63593 63632 (phone) and +91 90999 93461 (WhatsApp).
3. **Founder's title:** "Founder and Chairman" or "Founder and President"?
4. **Office hours:** which hours are correct?
5. **Corporate members:** the sectors for Meera Ore Venture LLP, Shivasti International and Bet Medical are missing.
6. **Chapters:** confirm the South Korea and Mauritius chapter details.
7. **Photos:** can we get full-resolution event photos, portraits for the governing council and advisory board, and the Ethiopia photos without captions?
8. **Upcoming events:** what is planned for 2026–27?
9. **News images:** 418 older news posts are still missing their featured image. The originals sit on asianafrican.org and can be added to `content/raw/news-images/`.
