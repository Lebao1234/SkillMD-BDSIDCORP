/* Normalizes the raw Shopify catalog into the storefront dataset. */
const fs = require('fs');
const path = require('path');

const RAW = require('./raw.json');
const OUT = require('path').resolve(__dirname, '../assets/data');

/* Design rule: zero em-dashes / en-dashes anywhere in shipped copy. */
const clean = (s) =>
  String(s == null ? '' : s)
    .replace(/[\u2014\u2013]/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

const stripTags = (html) => clean(String(html || '').replace(/<[^>]*>/g, ' '));

/* Pull the h2 + following paragraphs out of the Shopify body_html. */
function extractFeatures(html) {
  if (!html) return [];
  const out = [];
  const re = /<h2[^>]*>([\s\S]*?)<\/h2>([\s\S]*?)(?=<h2|$)/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const heading = stripTags(m[1]);
    const body = stripTags(m[2]);
    if (heading && body && body.length > 30) {
      out.push({ heading, body: body.slice(0, 420) });
    }
  }
  return out.slice(0, 9);
}

const CATEGORY = {
  'Mouse': { slug: 'mouse', label: 'Chuot choi game', group: 'mouse' },
  'Gaming Keyboard': { slug: 'keyboard', label: 'Ban phim co', group: 'keyboard' },
  'He Keyboard': { slug: 'he-keyboard', label: 'Ban phim tu tinh HE', group: 'keyboard' },
  'Headset': { slug: 'headset', label: 'Tai nghe', group: 'headset' },
  'Mouse Pad': { slug: 'mousepad', label: 'Lot chuot', group: 'accessory' },
  'Coiled Cable': { slug: 'cable', label: 'Cap xoan', group: 'accessory' },
  'Keycaps': { slug: 'keycaps', label: 'Keycap', group: 'accessory' },
  'Switches': { slug: 'switches', label: 'Switch', group: 'accessory' },
  'Wrist Rest': { slug: 'wrist-rest', label: 'Ke tay', group: 'accessory' },
  'Keycap Puller': { slug: 'tools', label: 'Dung cu', group: 'accessory' },
  'Keyboard Cover': { slug: 'cover', label: 'Vo bao ve', group: 'accessory' },
  'Mouse Grip Tape': { slug: 'grip-tape', label: 'Grip tape', group: 'accessory' },
  'Bundled': { slug: 'bundle', label: 'Combo', group: 'bundle' },
};

function categorize(p) {
  const direct = CATEGORY[p.product_type];
  if (direct) return direct;
  const t = (p.title || '').toLowerCase();
  if (/mouse pad|mousepad/.test(t)) return CATEGORY['Mouse Pad'];
  if (/wrist rest/.test(t)) return CATEGORY['Wrist Rest'];
  if (/cable/.test(t)) return CATEGORY['Coiled Cable'];
  if (/keycap/.test(t)) return CATEGORY['Keycaps'];
  if (/switch/.test(t)) return CATEGORY['Switches'];
  if (/headset|headphone/.test(t)) return CATEGORY['Headset'];
  if (/keyboard/.test(t)) return /\bhe\b|magnetic|rapid trigger/.test(t) ? CATEGORY['He Keyboard'] : CATEGORY['Gaming Keyboard'];
  if (/mouse/.test(t)) return CATEGORY['Mouse'];
  return { slug: 'accessories', label: 'Phu kien', group: 'accessory' };
}

/* Facet derivation from the real title + description text. */
function facets(p, blob) {
  const f = { connection: [], sensor: null, dpi: null, weight: null, polling: null, switchType: null };
  if (/2\.4\s*g|wireless|tri-?mode/i.test(blob)) f.connection.push('2.4GHz Wireless');
  if (/bluetooth/i.test(blob)) f.connection.push('Bluetooth');
  if (/wired|type-?c|usb/i.test(blob)) f.connection.push('Wired');
  if (!f.connection.length) f.connection.push('Wired');

  const sensor = blob.match(/PAW\s?3\d{3}(?:PRO|MAX)?|PMW\s?3\d{3}(?:PRO|MAX)?/i);
  if (sensor) f.sensor = sensor[0].toUpperCase().replace(/\s+/g, '');

  const dpi = blob.match(/(\d{4,6})\s*DPI/i) || blob.match(/DPI[^0-9]{0,12}(\d{4,6})/i);
  if (dpi) f.dpi = parseInt(dpi[1], 10);

  const w = blob.match(/(\d{2,3})\s*g\b(?!\w)/i);
  if (w) {
    const val = parseInt(w[1], 10);
    if (val >= 25 && val <= 400) f.weight = val;
  }

  const poll = blob.match(/(\d{3,4})\s*Hz/i);
  if (poll) f.polling = parseInt(poll[1], 10);

  if (/magnetic|hall effect|rapid trigger/i.test(blob)) f.switchType = 'Magnetic HE';
  else if (/optical switch|optical micro/i.test(blob)) f.switchType = 'Optical';
  else if (/mechanical|gasket/i.test(blob)) f.switchType = 'Mechanical';

  return f;
}

const money = (v) => (v == null || v === '' ? null : Math.round(parseFloat(v) * 100) / 100);

const products = RAW.products
  .filter((p) => p.images && p.images.length && p.variants && p.variants.length)
  .map((p) => {
    const cat = categorize(p);
    const blob = clean(p.title + ' ' + stripTags(p.body_html).slice(0, 2600));
    const variants = p.variants.map((v) => ({
      id: String(v.id),
      title: clean(v.title),
      options: [v.option1, v.option2, v.option3].filter(Boolean).map(clean),
      sku: clean(v.sku),
      price: money(v.price),
      compareAt: money(v.compare_at_price),
      available: !!v.available,
      image: v.featured_image ? v.featured_image.src : null,
    }));
    const prices = variants.map((v) => v.price).filter((n) => typeof n === 'number');
    const compares = variants.map((v) => v.compareAt).filter((n) => typeof n === 'number');
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 0;
    const maxCompare = compares.length ? Math.max(...compares) : 0;

    return {
      id: String(p.id),
      handle: p.handle,
      title: clean(p.title),
      /* The storefront carries its own brand, so the source vendor name is
         stripped wherever it appears, not just at the front. One title in the
         catalog reads "Pre Order: ATTACK SHARK R86 HE", which a leading-anchor
         match would have left untouched. Merchandising prefixes are dropped
         too, since stock status is already a badge on the card. */
      shortTitle: clean(p.title)
        .replace(/^(pre[- ]?order|new|sale)\s*:\s*/i, '')
        .replace(/attack\s?shark\s*/gi, '')
        .replace(/\s{2,}/g, ' ')
        .trim(),
      vendor: clean(p.vendor) || 'ATTACK SHARK',
      category: cat.slug,
      categoryLabel: cat.label,
      group: cat.group,
      tags: (p.tags || []).map(clean),
      publishedAt: p.published_at,
      minPrice,
      maxPrice,
      compareAt: maxCompare > maxPrice ? maxCompare : null,
      available: variants.some((v) => v.available),
      images: p.images.slice(0, 10).map((i) => i.src),
      options: (p.options || []).map((o) => ({ name: clean(o.name), values: o.values.map(clean) })),
      variants,
      features: extractFeatures(p.body_html),
      summary: stripTags(p.body_html).slice(0, 220),
      facets: facets(p, blob),
    };
  });

/* Deterministic pseudo-random so ratings/review counts stay stable across builds. */
function seeded(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

products.forEach((p) => {
  const r = seeded(p.handle);
  p.reviewCount = Math.floor(r() * 180) + 3;
  p.rating = Math.round((4.1 + r() * 0.85) * 10) / 10;
  p.unitsSold = Math.floor(r() * 4200) + 120;
  p.isNew = new Date(p.publishedAt).getTime() > Date.now() - 1000 * 60 * 60 * 24 * 120;
  p.onSale = !!(p.compareAt && p.compareAt > p.minPrice);
  p.discountPct = p.onSale ? Math.round(((p.compareAt - p.minPrice) / p.compareAt) * 100) : 0;
});

products.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

const byCat = {};
products.forEach((p) => { byCat[p.category] = (byCat[p.category] || 0) + 1; });

fs.writeFileSync(path.join(OUT, 'products.json'), JSON.stringify(products));
console.log('products:', products.length);
console.log('categories:', JSON.stringify(byCat));
console.log('with features:', products.filter((p) => p.features.length).length);
console.log('with sensor:', products.filter((p) => p.facets.sensor).length);
console.log('with weight:', products.filter((p) => p.facets.weight).length);
console.log('sample:', JSON.stringify(products[0]).slice(0, 700));
