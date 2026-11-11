// Hand-maintained content for the AACCI site. Facts come from asianafrican.org.

export const SITE = {
  url: 'https://asianafricanmission.org',
  name: 'Asian-African Chamber of Commerce & Industry',
  legalName: 'Asian-African Chamber of Commerce and Industry Foundation',
  short: 'AACCI',
  description:
    'AACCI connects chambers of commerce, companies and professionals from more than 100 countries to trade, invest and shape policy across Asia and Africa.',
  cin: 'U74995GJ2018NPL105079',
  founded: '2018',
  email: 'info@asianafrican.org',
  emails: { asia: 'asia@asianafrican.org', africa: 'africa@asianafrican.org', support: 'support@asianafrican.org' },
  phone: '+91 63593 63632',
  phoneHref: '+916359363632',
  whatsapp: '+91 90999 93461',
  whatsappHref: '919099993461',
  whatsappChat: '916359363632',
  hours: 'Monday to Friday, 10 am to 6 pm IST',
  social: [
    { name: 'Facebook', url: 'https://www.facebook.com/asianafricanchamber/' },
    { name: 'Instagram', url: 'https://www.instagram.com/asianafricanchamber/' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/company/asian-african-chamber-of-commerce-and-industry/' },
  ],
} as const;

export const OFFICES = [
  {
    id: 'ahmedabad', tag: 'Global Secretariat', city: 'Ahmedabad, India',
    lines: ['201, Akash Ganga Complex, beside Rio Restaurant', 'Gujarat College Road, Ellisbridge', 'Ahmedabad, Gujarat 380006'],
    locality: 'Ahmedabad', region: 'Gujarat', postalCode: '380006', country: 'IN',
    street: '201, Akash Ganga Complex, Gujarat College Road, Ellisbridge',
    contacts: [
      { label: 'Phone', value: '+91 63593 63632', href: 'tel:+916359363632' },
      { label: 'WhatsApp', value: '+91 90999 93461', href: 'https://wa.me/919099993461' },
      { label: 'Email', value: 'info@asianafrican.org', href: 'mailto:info@asianafrican.org' },
      { label: 'Asia desk', value: 'asia@asianafrican.org', href: 'mailto:asia@asianafrican.org' },
    ],
    map: 'https://www.google.com/maps/search/?api=1&query=Akash%20Ganga%20Complex%2C%20Gujarat%20College%20Road%2C%20Ellisbridge%2C%20Ahmedabad%20380006',
    photo: '/img/gallery/secretariat-2022/01-t.webp',
  },
  {
    id: 'mumbai', tag: 'National Secretariat', city: 'Mumbai, India',
    lines: ['Office 802, 8th Floor, Prestige Turf Tower', 'Shakti Mill Lane, Mahalakshmi (West)', 'Mumbai 400011, Maharashtra'],
    locality: 'Mumbai', region: 'Maharashtra', postalCode: '400011', country: 'IN',
    street: 'Office 802, 8th Floor, Prestige Turf Tower, Shakti Mill Lane, Mahalakshmi (West)',
    contacts: [],
    map: 'https://www.google.com/maps/search/?api=1&query=Prestige%20Turf%20Tower%2C%20Shakti%20Mill%20Lane%2C%20Mahalakshmi%2C%20Mumbai%20400011',
  },
  {
    id: 'lagos', tag: 'Nigeria chapter', city: 'Lagos, Nigeria',
    lines: ['C/o ICCA Nigeria, 10 Fasulade Close', 'off Suberu Oje Road, Casso Bus Stop', 'Alagbado, Lagos'],
    locality: 'Lagos', region: 'Lagos', postalCode: '', country: 'NG',
    street: '10 Fasulade Close, off Suberu Oje Road, Alagbado',
    contacts: [
      { label: 'Phone', value: '+234 803 306 6041', href: 'tel:+2348033066041' },
      { label: 'Africa desk', value: 'africa@asianafrican.org', href: 'mailto:africa@asianafrican.org' },
    ],
    map: 'https://www.google.com/maps/search/?api=1&query=Fasulade%20Close%2C%20Alagbado%2C%20Lagos',
  },
] as const;

export type NavItem = { label: string; href: string; intro?: string; links?: { label: string; href: string }[] };
export const NAV: NavItem[] = [
  {
    label: 'About', href: '/about/', intro: 'A not-for-profit chamber, incorporated in 2018, giving business across Asia and Africa one voice.',
    links: [
      { label: 'Mission and objectives', href: '/about/#mission' }, { label: 'The meaning of our logo', href: '/about/#logo' },
      { label: 'How the chamber is structured', href: '/about/#structure' }, { label: 'Message from the founder', href: '/about/#founder' },
      { label: 'Leadership and advisory board', href: '/leadership/' }, { label: 'Chapters and representatives', href: '/chapters/' },
      { label: 'Affiliations and treaties', href: '/about/#partners' }, { label: 'Careers', href: '/careers/' },
    ],
  },
  {
    label: 'Membership', href: '/membership/', intro: 'Four categories for chambers, companies, large institutions and individuals.',
    links: [
      { label: 'Categories and fees', href: '/membership/#fees' }, { label: 'Benefits of joining', href: '/membership/#benefits' },
      { label: 'How to join', href: '/membership/#join' }, { label: 'Renew your membership', href: '/membership/#renew' },
      { label: 'Industry committees', href: '/membership/#committees' }, { label: 'Corporate members', href: '/membership/#members' },
      { label: 'Code of conduct and rules', href: '/membership/#conduct' }, { label: 'Apply now', href: '/membership/#apply' },
    ],
  },
  {
    label: 'Services', href: '/services/', intro: 'Practical help to trade, meet and be heard across both continents.',
    links: [
      { label: 'Trade facilitation', href: '/services/#trade' }, { label: 'Government representation', href: '/services/#government' },
      { label: 'Business networking', href: '/services/#networking' }, { label: 'Trade missions and exhibitions', href: '/services/#missions' },
      { label: 'Certificate of origin', href: '/services/#origin' }, { label: 'Consultancy', href: '/services/#consultancy' },
      { label: 'Advertising with AACCI', href: '/services/#advertising' },
    ],
  },
  {
    label: 'Events', href: '/events/', intro: 'Diplomatic meets, forums, awards and trade missions since 2018.',
    links: [
      { label: 'Upcoming events', href: '/events/#next' }, { label: 'Past events, 2018 to 2026', href: '/events/#timeline' },
      { label: 'Photo gallery', href: '/events/#gallery' }, { label: 'Sponsorship', href: '/events/#sponsor' },
      { label: 'Annual general meeting', href: '/events/#agm' },
    ],
  },
  { label: 'News', href: '/news/' },
  { label: 'Contact', href: '/contact/' },
];

export const FACTS = [
  { value: 2018, plain: true, suffix: '', text: 'Incorporated in Gujarat as a not-for-profit company under Section 8 of the Companies Act, 2013' },
  { value: 100, suffix: '+', text: 'Countries engaged across Asia and Africa through members, chapters and partners' },
  { value: 57, suffix: '', text: 'Industry committees, from banking and pharmaceuticals to renewable energy' },
  { value: 130, suffix: '+', text: 'Governing council and advisory board members from industry, diplomacy and law' },
  { value: 40, suffix: '+', text: 'Affiliated chambers, trade bodies and institutions with signed treaties' },
];

export const SERVICES = [
  {
    id: 'trade', name: 'Trade facilitation', img: '/img/aaef-panel.webp', alt: 'Panel discussion at the Asian African Leadership Forum',
    short: 'B2B meetings, matchmaking events, consultancy and partner searches, built on MoUs with chambers across both continents.',
    long: 'AACCI has MoUs with leading industry chambers across both continents, which lets it work alongside the trade bodies of many countries and connect Asian companies with African ones.',
    points: ['Trade events, B2B meetings and matchmaking', 'Consultancy for market entry', 'Searches for business partners and associates'],
  },
  {
    id: 'government', name: 'Government representation', img: '/img/hldm-1.webp', alt: 'Award presented at the High Level Diplomatic Meet in New Delhi',
    short: 'The chamber takes part in government trade and investment initiatives and lobbies for a climate where business can grow.',
    long: 'The chamber takes part in key government initiatives on trade and investment. That seat at the table lets it lobby and advocate for a trade and investment environment where business can grow.',
    points: ['A direct line to policy makers on MSME, trade, fiscal and social policy'],
  },
  {
    id: 'networking', name: 'Business networking', img: '/img/gala-022.webp', alt: 'Members and guests at an AACCI gala',
    short: 'Regular networking sessions where members meet, swap experience and find new business.',
    long: 'Regular networking sessions let members meet, exchange information and experience, and find new business. AACCI hosts international delegations, diplomats, industrialists, government officials, economists and bankers.',
    points: [],
  },
  {
    id: 'missions', name: 'Trade missions and exhibitions', img: '/img/aaef-stage.webp', alt: 'Delegates on stage at the Asian African Economic Forum 2024 in Bangkok',
    short: 'Delegations to target sectors abroad, and joint ventures and B2B sessions with partner chambers.',
    long: 'The chamber leads business delegations to trade missions in sectors that matter to members, and works with partner chambers to organise joint ventures and B2B meeting sessions.',
    points: [],
  },
  {
    id: 'origin', name: 'Certificate of origin', img: '/img/mou-korea.webp', alt: 'MoU signing for the AACCI South Korea chapter',
    short: 'Certificates of origin for members who export.',
    long: 'Certificates of origin for members who export. Contact the secretariat for documents and turnaround.',
    points: [],
  },
  {
    id: 'consultancy', name: 'Consultancy', img: '/img/award-01.webp', alt: 'Members receiving certificates at an AACCI forum',
    short: 'Advice on industrial growth, monetary and fiscal policy, taxation and corporate law.',
    long: 'Expert advice on industrial growth, monetary and fiscal policy, exchange rates, economic planning, taxation and corporate law.',
    points: [],
  },
];

export const ETHIOPIA = [
  { img: '/img/eth-deputy-pm.webp', org: 'Office of the Deputy Prime Minister', who: 'H.E. Demeke Mekonnen Hassen, Deputy Prime Minister', alt: 'H.E. Demeke Mekonnen Hassen with Dr. G.D. Singh' },
  { img: '/img/eth-tourism.webp', org: 'FDRE Ministry of Tourism', who: 'H.E. Mr. Seleshi Girma, State Minister', alt: 'Meeting at the FDRE Ministry of Tourism' },
  { img: '/img/eth-innovation.webp', org: 'Ministry of Innovation and Technology', who: 'Dr. Belete Molla Getahun (PhD), Minister', alt: 'Dr Belete Molla Getahun with Dr. G.D. Singh' },
  { img: '/img/eth-trade.webp', org: 'Ministry of Trade and Regional Integration', who: 'Dr. Kassahun Gofe Balami, Minister', alt: 'Meeting at the Ministry of Trade and Regional Integration' },
  { img: '/img/eth-chamber.webp', org: 'Ethiopian Chamber of Commerce and Sectoral Associations', who: 'Dr. Kenenisa Lemi Debela, Secretary General', alt: 'Dr. Kenenisa Lemi Debela with Dr. G.D. Singh' },
  { img: '/img/eth-agriculture.webp', org: 'Natural Resources and Sustainable Agriculture', who: 'Teferi Tsegaye (PhD), National Program Leader', alt: 'Teferi Tsegaye with Dr. G.D. Singh' },
];

export const SECRETARIAT = [
  { name: 'Dr. G.D. Singh', role: 'Founder and Chairman', img: '/img/people/gd-singh.webp', w: 900, h: 900 },
  { name: 'Dr. Neetu Singh', role: 'Secretary General', img: '/img/people/neetu-singh.webp', w: 800, h: 800 },
  { name: 'Dr. Leye Talpha Babalola', role: 'Vice Chairman, Africa', img: '/img/people/leye-babalola.webp', w: 200, h: 250 },
  { name: 'M J Puri (Maulik Goswami)', role: 'Director General', img: '/img/people/mj-puri.webp', w: 600, h: 900 },
  { name: 'Ravi Swamy', role: 'Chief Advisor, Government and Strategic Affairs', img: '/img/people/ravi-swamy.webp', w: 900, h: 900 },
];

export const OUTREACH = [
  { name: 'Vivek Panwar', role: 'Project Manager' }, { name: 'Mahak Bagde', role: 'Public Relations Officer' },
  { name: 'Tisha Jain', role: 'Support Officer' }, { name: 'Bhumit Kalathiya', role: 'Data Analyst and Support Officer' },
];

export const TESTIMONIALS = [
  { quote: 'The Asian African leadership forum was well organised and superbly executed. The agenda was well set and everything went off smoothly. It was good to listen to the ambassadors of various countries and understand the business opportunities there.', name: 'Dalveer Bawa', role: 'Founder and CEO, NineOne Blackboard Advisory Solutions', img: '/img/people/dalveer-bawa.webp' },
  { quote: 'A great event, packed with so much knowledge and great speakers, offering a unique balance of current trends and alliance growth. In short: a compact source of inspiration.', name: 'Divya Rao', role: 'Senior Manager, Marketing, SMEcorner', img: '/img/people/divya-rao.webp' },
  { quote: 'Velox Solutions was awarded for Excellence in Innovation and Technology by the Asian African Chamber of Commerce and Industry at The Hotel Grand, New Delhi. We feel proud to be part of such an event.', name: 'Mangesh Amale', role: 'Founder, Velox Solutions Pvt. Ltd.', img: '/img/people/mangesh-amale.webp' },
  { quote: 'The Asian-African Chamber is a great platform for business, trade, networking and social contribution. I am glad my work was recognised.', name: 'Rohini Sharma', role: 'Founder, Radvision World Consultancy', img: '/img/people/rohini-sharma.webp' },
];

export type Place = { name: string; lead: string; pin?: string };
export const CHAPTERS: { international: Place[]; india: Place[]; representatives: Place[] } = {
  international: [
    { name: 'Ethiopia', lead: 'Selamawit Zemene, President', pin: 'addis' },
    { name: 'Kenya', lead: 'Nancy Muthoni, Country Director', pin: 'nairobi' },
    { name: 'Nigeria', lead: 'African regional secretariat, Lagos. Dr. Leye Talpha Babalola, Vice Chairman, Africa', pin: 'lagos' },
    { name: 'Sierra Leone', lead: 'Office bearers inducted in Freetown, April 2019', pin: 'freetown' },
    { name: 'Mauritius', lead: 'Siven Pillay, Founder and Director', pin: 'portlouis' },
    { name: 'Sri Lanka', lead: 'Asian regional secretariat. Committee chairs: Dr. Tharindu Wijenayake (Youth), Savio Danushthan Innasithamby (PR and Media), Sagara Lakmal De Mel (Photography), Jatin Trivedi (IPR)', pin: 'colombo' },
    { name: 'Bangladesh', lead: 'Launched December 2022, after an MoU with the India-Bangladesh Chamber of Commerce and Industry', pin: 'dhaka' },
    { name: 'Hong Kong', lead: 'Dr. Sandeep Sekhri, President', pin: 'hongkong' },
    { name: 'Philippines', lead: 'Sherlyn Solanoy, President', pin: 'manila' },
    { name: 'South Korea', lead: 'Chapter MoU signed at the Asian African Economic Forum 2024', pin: 'seoul' },
    { name: 'Japan', lead: 'Sujan Sanku, President', pin: 'tokyo' },
    { name: 'United States of America', lead: 'H.E. Monica Sekhmet Grant, President. H.E. Dr. Arc Ajalie Raphael Richard Eluemuno, Vice President' },
    { name: 'Jamaica', lead: 'Dr. Dawkins Brown, President' },
  ],
  india: [
    { name: 'National Secretariat, Mumbai', lead: 'Dr. Kishor Navandar, National President of India', pin: 'mumbai' },
    { name: 'Delhi NCR', lead: 'Amb. Mahesh Sachdev, Honorary President', pin: 'delhi' },
    { name: 'East India', lead: 'Dr. (H.C.) Mamta Binani, President', pin: 'kolkata' },
    { name: 'Maharashtra', lead: 'Brajesh Kumar, President' },
    { name: 'Punjab', lead: 'Dr. Vishal Kalra, President', pin: 'chandigarh' },
    { name: 'Odisha', lead: 'Dr Lita Mohapatra, Chapter President', pin: 'bhubaneswar' },
    { name: 'Tamil Nadu', lead: 'Ms. Jani Jermans, Chapter President', pin: 'chennai' },
  ],
  representatives: [
    { name: 'India', lead: 'Bharat Metaliya and Murli Ratan' }, { name: 'Dubai', lead: 'Adv. CA Dr. Harsh Patel', pin: 'dubai' },
    { name: 'Ghana', lead: 'Charles Botse Bennin', pin: 'accra' }, { name: 'Ivory Coast', lead: 'H.E. Ambassador Arnaud Dibi', pin: 'abidjan' },
    { name: 'Togo', lead: 'Coubageat Toure Mohamed Abdel Malik', pin: 'lome' }, { name: 'Morocco', lead: 'Mounir El Bouamri, Eng', pin: 'rabat' },
    { name: 'Angola', lead: 'Rui Matata Manuel', pin: 'luanda' }, { name: 'Eswatini', lead: 'Dalton Ncamiso Nxumalo', pin: 'mbabane' },
    { name: 'Nigeria', lead: 'Roland Oletu Oroh' }, { name: 'Kenya', lead: 'Benjamin Musunza' },
    { name: 'France', lead: 'Soumaya Chebbi' }, { name: 'Mexico', lead: 'Dra. HC J. Eliselma de los Ríos Aveldaño' },
  ],
};

export type TimelineEvent = { date: string; name: string; place: string; iso?: string };
export type TimelineYear = { year: number; photo?: { src: string; alt: string }; events: TimelineEvent[] };
export const TIMELINE: TimelineYear[] = [
  { year: 2018, photo: { src: '/img/gallery/council-induction-2018/04-t.webp', alt: 'Governing council and advisory board induction in Colombo, October 2018' }, events: [
    { date: '2018', name: 'Soft launch at the 5th International Education Forum', place: 'New Delhi' },
    { date: '15 Sep', name: 'Jaipur chapter soft launch', place: 'Rajasthan, India', iso: '2018-09-15' },
    { date: '2 Oct', name: 'Hong Kong chapter president appointed', place: 'Hong Kong', iso: '2018-10-02' },
    { date: '20 Oct', name: 'Global Healthcare Leadership Forum, and MoU with Gujarat Chamber of Commerce & Industry', place: 'Ahmedabad', iso: '2018-10-20' },
    { date: '29 Oct', name: 'Sri Lanka soft launch and council induction', place: 'Colombo', iso: '2018-10-29' },
    { date: '8 Dec', name: 'MoUs with the Abuja and Sierra Leone chambers', place: 'Lagos', iso: '2018-12-08' },
    { date: '12 Dec', name: 'Strategic partnership with EACCIA', place: 'Kenya', iso: '2018-12-12' },
  ] },
  { year: 2019, photo: { src: '/img/gallery/chennai-2019/01-t.webp', alt: 'Launch of the 5th chapter office in Chennai, December 2019' }, events: [
    { date: '6 Mar', name: 'Africa SMB Forum', place: 'Abidjan', iso: '2019-03-06' },
    { date: '23 Mar', name: 'Asian African Leadership Forum', place: 'New Delhi', iso: '2019-03-23' },
    { date: '27 Apr', name: "Seminar on the impact of SMEs on Africa's economic development", place: 'Lagos', iso: '2019-04-27' },
    { date: '29 Apr', name: 'Sierra Leone chapter induction', place: 'Freetown', iso: '2019-04-29' },
    { date: '22 Jun', name: '3rd Global Business Leadership Forum', place: 'Mumbai', iso: '2019-06-22' },
    { date: '15 Oct', name: 'Africa AgTech Expo & Forum', place: 'Lagos', iso: '2019-10-15' },
    { date: '6 Dec', name: 'Launch of the 5th chapter office', place: 'Chennai', iso: '2019-12-06' },
  ] },
  { year: 2020, events: [
    { date: '25 Jan', name: '2nd Asian African Leadership Forum', place: 'The Grand, New Delhi', iso: '2020-01-25' },
    { date: 'Mar–Nov', name: '9th to 12th Real Estate Development Summits', place: 'Italy, Dubai, Thailand, Kenya' },
    { date: '9 Oct', name: 'Asian African Innovation Summit & Expo', place: 'New Delhi', iso: '2020-10-09' },
    { date: '28 Oct', name: 'ATIGS Dubai 2020', place: 'Dubai', iso: '2020-10-28' },
    { date: '11 Dec', name: 'AACCI Seminar', place: 'Colombo', iso: '2020-12-11' },
  ] },
  { year: 2021, events: [
    { date: '30 Apr', name: '3rd Asian African Leadership Forum', place: 'New Delhi', iso: '2021-04-30' },
    { date: '22 Oct', name: 'Asian-African Business Summit, Back 2 Business series', place: 'Online', iso: '2021-10-22' },
    { date: '10 Dec', name: 'Asian–African Leadership Forum, Africa edition', place: 'Accra', iso: '2021-12-10' },
  ] },
  { year: 2022, photo: { src: '/img/gallery/hldm-2022-s3/01-t.webp', alt: 'Delegates at the High Level Diplomatic Meet 2022, session 3' }, events: [
    { date: '19 Mar', name: 'High Level Diplomatic Meet, session 1', place: 'IIC, New Delhi', iso: '2022-03-19' },
    { date: '24 Apr', name: 'Asian–African Leadership Forum, fourth edition', place: 'IIC, New Delhi', iso: '2022-04-24' },
    { date: '20 Aug', name: 'High Level Diplomatic Meet, session 2', place: 'The Grand, New Delhi', iso: '2022-08-20' },
    { date: '19 Nov', name: 'High Level Diplomatic Meet, session 3', place: 'IIC, New Delhi', iso: '2022-11-19' },
    { date: '27 Nov', name: 'MoU with the India-Bangladesh Chamber of Commerce and Industry', place: 'Bangladesh chapter launched', iso: '2022-11-27' },
    { date: '24 Dec', name: 'Global Secretariat office opens', place: 'Ahmedabad', iso: '2022-12-24' },
  ] },
  { year: 2023, photo: { src: '/img/hldm-2023.webp', alt: 'Delegates at the High Level Diplomatic Meet 2023, Series IV' }, events: [
    { date: '21 Jan', name: 'Asian African Business Summit, Maharashtra edition', place: 'Pune', iso: '2023-01-21' },
    { date: '2 May', name: 'Leadership and Corporate Governance Awards', place: 'Abuja', iso: '2023-05-02' },
    { date: '24 Jun', name: 'High Level Diplomatic Meet, Series IV', place: 'IIC, New Delhi', iso: '2023-06-24' },
  ] },
  { year: 2024, photo: { src: '/img/aaef-group.webp', alt: 'Delegates at the Asian African Economic Forum 2024 in Bangkok' }, events: [
    { date: '10 Feb', name: 'MSME Leadership Summit & Awards', place: 'Mumbai', iso: '2024-02-10' },
    { date: '12–14 Feb', name: 'International Business Summit & Expo', place: 'Bhubaneswar', iso: '2024-02-12' },
    { date: '6 Apr', name: 'Asian African Iconic Awards', place: 'Mumbai', iso: '2024-04-06' },
    { date: '4 Oct', name: 'Asian African Economic Forum', place: 'Bangkok', iso: '2024-10-04' },
    { date: '2024', name: 'High Level Diplomatic Meet, Series VI', place: 'IIC, New Delhi' },
  ] },
  { year: 2025, events: [
    { date: '3 May', name: 'Global Business Leadership Award', place: 'Colombo', iso: '2025-05-03' },
    { date: '10–11 Oct', name: 'Future Billionaire Investment Summit', place: 'Dubai', iso: '2025-10-10' },
  ] },
  { year: 2026, events: [
    { date: '5–6 Jun', name: 'Global Leadership & Legacy Conclave', place: 'Bangkok', iso: '2026-06-05' },
    { date: '5–7 Aug', name: 'Premier International Textile Sourcing Show of South Asia', place: 'BMICH, Colombo', iso: '2026-08-05' },
    { date: '24 Sep', name: 'High Level Diplomatic Meet, Series VIII', place: 'IIC, New Delhi', iso: '2026-09-24' },
    { date: '23 Oct', name: 'Global Business Leadership Forum', place: 'DoubleTree by Hilton, Dubai', iso: '2026-10-23' },
  ] },
];

export const RECENT_EVENTS = [
  { day: '23', month: 'Oct 2026', name: 'Global Business Leadership Forum', place: 'DoubleTree by Hilton, Dubai' },
  { day: '24', month: 'Sep 2026', name: 'High Level Diplomatic Meet, Series VIII', place: 'IIC, New Delhi' },
  { day: '5–7', month: 'Aug 2026', name: 'Premier International Textile Sourcing Show of South Asia', place: 'BMICH, Colombo' },
];

export const SPONSOR_TIERS = [
  { id: 'platinum', name: 'Platinum', price: '$25,000', perks: '10 delegate passes for a year, vendor table, your banner on site, 10 e-blasts, website banner for 3 months' },
  { id: 'gold', name: 'Gold', price: '$15,000', perks: '4 delegate passes for a year, vendor table, your banner on site, 4 e-blasts' },
  { id: 'silver', name: 'Silver', price: '$10,000', perks: '2 delegate passes for a year, vendor table, 2 e-blasts' },
  { id: 'bronze', name: 'Bronze', price: '$5,000', perks: '2 delegate passes for a year' },
];

export const MEMBERSHIP = {
  admission: 210,
  categories: [
    { id: 'associate', who: 'A chamber or trade body', name: 'Associate member', cta: 'Apply as an associate member', scopeLabel: 'What is its reach?',
      desc: 'For chambers, trade bodies, councils and industry organisations. Affiliation does not affect your organisation’s autonomy.',
      options: [{ label: 'Regional', fee: 250 }, { label: 'National', fee: 550 }, { label: 'International', fee: 700 }] },
    { id: 'corporate', who: 'A company or firm', name: 'Corporate member', cta: 'Apply as a corporate member', scopeLabel: 'What size is the business?',
      desc: 'For firms, sole proprietors, manufacturers, service companies and any business in trade, commerce, agriculture or the professions.',
      options: [{ label: 'Small enterprise', fee: 385 }, { label: 'Medium enterprise', fee: 625 }, { label: 'Large enterprise', fee: 1250 }] },
    { id: 'patron', who: 'A large company, PSU or bank', name: 'Patron or benefactor', cta: 'Apply as a patron member', scopeLabel: '',
      desc: 'For large companies, multinationals, public sector undertakings and financial institutions, with special privileges. Limited to 150 members.',
      options: [{ label: 'Patron', fee: 5000 }] },
    { id: 'individual', who: 'An individual', name: 'Individual member', cta: 'Apply as an individual member', scopeLabel: '',
      desc: 'For consultants, professionals and seniors who want to be part of the chamber without promoting a business.',
      options: [{ label: 'Individual', fee: 210 }] },
  ],
  formOptions: [
    'Associate: regional chamber or trade body', 'Associate: national chamber or trade body', 'Associate: international chamber or trade body',
    'Corporate: small enterprise', 'Corporate: medium enterprise', 'Corporate: large enterprise', 'Patron or benefactor', 'Individual',
    'Renewal of an existing membership',
  ],
  benefits: [
    ['Access to decision makers.', 'Meet ministers, ambassadors, central and state governments and international agencies.'],
    ['Delegations and trade fairs.', 'Join visiting foreign delegations, exhibitions and business missions abroad.'],
    ['Expert advice.', 'Guidance on industrial growth, fiscal policy, exchange rates, taxation and corporate law.'],
    ['A say in policy.', 'Put your views to policy makers and foreign investors through the chamber.'],
    ['The business directory.', 'Your company profile is circulated every year to ministries, government offices and chambers, free of charge.'],
    ['Sector committees.', 'Work with peers in your industry on shared issues and opportunities.'],
    ['Lower event fees.', 'Members pay reduced fees for paid programmes.'],
    ['Giving back.', 'Support CSR initiatives with philanthropic partners CIHF and WPDO, towards the UN Sustainable Development Goals.'],
  ],
  steps: [
    ['Choose your category', 'Use the fee finder above to pick the category and size that fit.'],
    ['Send the application', "Fill in the form below with your organisation's details."],
    ['Talk to the membership team', 'An admin officer contacts you to confirm the details and answer questions.'],
    ['Pay and get started', 'Pay the admission fee and annual subscription in advance. Your year starts the day you join.'],
  ],
  renewal: [
    ['Length', 'One year from the date of renewal, unless stated otherwise'],
    ['Reminder', 'By email, one month before your membership expires'],
    ['Grace period', '30 days after expiry, during which you can still renew'],
    ['After the grace period', 'You will need to apply again as a new member'],
  ],
  committees: [
    'Automobiles', 'Banking and Financial', 'Construction and Real Estate', 'Education', 'Food Processing and Dairy Products',
    'Foreign Trade and Investment', 'Healthcare and Hospitals', 'IT and ITES', 'Legal Services', 'Manufacturing and Machineries',
    'NGO and Social Enterprises', 'Pharmaceuticals', 'Renewable Energy', 'Small and Medium Enterprises (SME)', 'Women Entrepreneurship',
    'Art, Culture and Handicraft', 'Yoga and Alternative Medicine', 'Welfare (Karnataka)',
  ],
  corporate: [
    ['Titans International Consultancy LLP', 'International consultancy'], ['Zaron Metal Sections India Pvt. Ltd.', 'Metal and manufacturing'],
    ['IST Formwork LLP', 'Construction and formwork'], ['Madras Hardtools Pvt. Ltd.', 'Industrial tools and hardware'],
    ['Hydro Meshines India Pvt. Ltd.', 'Machinery and engineering'], ['Meera Ore Venture LLP', 'Corporate member'],
    ['Skyward Consultancy', 'Human resources'], ['Shivasti International', 'Corporate member'], ['Bet Medical', 'Corporate member'],
  ],
};

export const PARTNERS: { file: string; name: string }[][] = [
  [
    ['acci', 'Abuja Chamber of Commerce and Industry'], ['eaccia', 'East African Chamber of Commerce, Industry and Agriculture'],
    ['ethiopian-chamber-of-commerce', 'Ethiopian Chamber of Commerce and Sectoral Associations'], ['kenya-chamber-of-commerce-industry-logo', 'Kenya National Chamber of Commerce and Industry'],
    ['slccia', 'Sierra Leone Chamber of Commerce, Industry and Agriculture'], ['pacc', 'Pan African Chamber of Commerce'],
    ['industrial-parks-development-corporation-ipdc', 'Industrial Parks Development Corporation, Ethiopia'], ['africa2b', 'Africa2B'],
    ['p4', 'Institute of Company and Commercial Accountants'], ['indian-african-business-forum', 'India Africa Business Forum'],
    ['atigs-group', 'ATIGS Group'], ['brics', 'BRICS Chamber of Commerce and Industry'], ['aacc', 'Asian-Arab Chamber of Commerce'],
    ['azteca-university', 'Universidad Azteca'], ['p1', 'University of Entrepreneurship and Technology'], ['p2', 'World Peace and Diplomacy Organisation'],
    ['p3', 'Confederation of International Accreditation Commission'], ['p5', 'Confederation of International Healthcare Foundation'],
    ['ffmsdg', 'Millennium Sustainable Development Goals'], ['international-legal-alliance', 'International Legal Alliance'], ['worldmedicaas', 'Worldmedicaas'],
  ],
  [
    ['logo-ggcci', 'Gujarat Chamber of Commerce and Industry'], ['the-southern-gujarat-chamber-of', 'The Southern Gujarat Chamber of Commerce and Industry'],
    ['saurashtra-chamber-of-commerce-industry', 'Saurashtra Chamber of Commerce and Industry'], ['deccan-chamber-of-commerce-industry-agriculture', 'Deccan Chamber of Commerce, Industry and Agriculture'],
    ['aiai', 'All India Association of Industries'], ['iicci', 'Indian Importers Chambers of Commerce and Industry'],
    ['miiccia', 'Millennial India International Chamber of Commerce, Industry and Agriculture'], ['intellectual-punjabi-chamber-of-commerce', 'Intellectual Punjabi Chamber of Commerce'],
    ['world-sikh-chamber-of-commerce', 'World Sikh Chamber of Commerce'], ['mpidc', 'MP Industrial Development Corporation'], ['achievers', 'Achievers'],
    ['colombo-chamber-of-commerce-industry', 'Colombo Chamber of Commerce'], ['the-federation-of-chambers-of-commerce-industry-of-sri-lanka', 'Federation of Chambers of Commerce and Industry of Sri Lanka'],
    ['confederation-of-micro-small-medium-industries-cosmi', 'Confederation of Micro, Small and Medium Industries, Sri Lanka'],
    ['korea-export-import-association-koexima', 'Korea Export and Import Association'], ['korea-trade-investment-promotion-association', 'KOTRA, Korea Trade-Investment Promotion Agency'],
    ['aeu-logo', 'Association of Exporters of Uzbekistan'], ['uzbekmart', 'Uzbekmart'], ['indcham', 'Indian Chamber of Commerce in the Slovak Republic'],
    ['sj-mobilita', 'SJ Mobilità'], ['global-block-chain-association', 'Global Blockchain Association'],
  ],
].map((row) => row.map(([file, name]) => ({ file, name })));
