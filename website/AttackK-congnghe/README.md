# HADAL storefront

A complete e-commerce front end for gaming peripherals, built as a static site
with no build step. Thirteen pages in Vietnamese and English, 175 real products,
cart and checkout, faceted search, comparison, wishlist and an editorial
section.

Design rules come from `.claude/skills/design-system/SKILL.md`; how they were
applied is documented in [DESIGN.md](DESIGN.md).

---

## Running it

Open `index.html` directly in a browser. It works from the file system: the
catalog ships as `assets/data/*.js` rather than JSON precisely so that `fetch`,
which browsers block on `file://`, is never needed.

A local server is still nicer for clean URLs and caching:

```bash
cd website/AttackK-congnghe
python -m http.server 5173
# then open http://localhost:5173
```

Two things load from a CDN: Google Fonts (Space Grotesk for everything, and
JetBrains Mono for numerals) and Phosphor Light icons from jsDelivr. Offline, the page falls back to
system fonts and the icon glyphs do not render; everything else still works.

---

## Pages

| File | What it does |
| --- | --- |
| `index.html` | Home. Indexed hero split, service commitments, new arrivals rail, spotlight bento, category wall, tabbed best sellers, giveaway with live countdown, community photo wall, press marquee, editorial teasers |
| `collection.html` | Product listing. Faceted filters, sorting, grid and list views, load more plus numbered pagination, mobile filter drawer, recently viewed |
| `product.html` | Product detail. Gallery with zoom, variant picker, quantity, bundle builder, spec clusters, feature blocks, downloads, reviews, related products, sticky purchase bar |
| `cart.html` | Full cart. Line editing, coupons, free-shipping meter, order note, cross sell |
| `checkout.html` | Three-step checkout with per-field validation and an order confirmation |
| `compare.html` | Side-by-side table for up to four products, best value marked per row |
| `wishlist.html` | Saved products with bulk add to cart |
| `search.html` | Full search results with category breakdown and sorting |
| `blog.html` | Article index with topic filters |
| `article.html` | Article reader with a table of contents and related products |
| `support.html` | Shipping, returns, warranty, FAQ, contact, company and legal, with a section-tracking side nav |
| `downloads.html` | Driver and manual library, searchable, plus the web driver |
| `account.html` | Sign in and register with validation, order history, saved and recently viewed |

---

## Feature parity with the reference storefront

**Languages.** Vietnamese and English, switched from the header. Vietnamese is
the default; with no stored choice the site follows the browser. Everything the
storefront itself says is translated, including the eight journal articles and
the review copy. Product names and supplier descriptions are left alone, because
they read as model identifiers in both languages.

**Navigation and chrome.** Single-line announcement ticker with manual
controls, sticky header that condenses on scroll, one catalog panel with live
counts and a featured product, four shortcuts, a persistent inline search field
with type-ahead and a `/` focus shortcut, currency switcher, mobile drawer with
a morphing hamburger, full-screen search overlay below 1024px, cart drawer,
light and dark theme toggle, back to top.

**Catalog.** 175 products across 14 categories, real variants, real images, real
option sets. Sixteen virtual collections (by category, new, sale, best selling,
wireless, 8K polling) built from predicates rather than duplicated data.

**Filtering.** Availability, on sale, price range, category, connection type,
sensor, polling rate, switch type and weight band. Counts come from the current
collection, so a filter never offers a value that would return nothing. All
state lives in the query string, so a filtered view can be shared and the back
button works.

**Product page.** Thumbnail gallery with click-to-zoom and arrow-key navigation,
variant swatches that swap the main image, quantity stepper, add to cart and buy
now, frequently-bought-together with a running total, grouped specifications,
feature blocks parsed from the real product copy, download links, review summary
with a star distribution, related products, recently viewed and a sticky
purchase bar.

**Commerce.** Cart with quantity editing and removal, three working coupon codes
(`SHARK10`, `FREESHIP`, `NEWGEAR20`), free-shipping progress meter, order note,
three shipping tiers, five payment methods, tax estimate, order confirmation and
a local order history.

**Everything else.** Wishlist, comparison capped at four, recently viewed,
currency switching across USD, VND, EUR and GBP, toasts, skeletons and a
composed empty state on every list surface.

---

## Structure

```
index.html  collection.html  product.html  cart.html  checkout.html
compare.html  wishlist.html  search.html  blog.html  article.html
support.html  downloads.html  account.html

assets/
  css/
    tokens.css       design tokens, the only file with literal colour values
    base.css         reset, typography, accessibility primitives
    components.css   buttons, cards, forms, drawers, modals, toasts, skeletons
    layout.css       announcement rail, header, mega menu, search, footer
    pages.css        per-page surfaces
    platform.css     restyles the Epod base sections (collection, product,
                     blog, cart) in HADAL tokens; unused by the static site
  js/
    brand.js         name, wordmark, logo geometry, contacts, social handles
    i18n.js          translation engine plus the chrome dictionary
    i18n-content.js  page prose dictionary
    store.js         cart, wishlist, compare, viewed, currency, theme, orders
    catalog.js       query, filter, sort, search and card rendering
    ui.js            shared chrome, overlays, toasts, reveal, focus management
    home.js collection.js product.js cart.js checkout.js
    compare.js wishlist.js search.js blog.js account.js
  data/
    products.js  reviews.js  posts.js     loaded by the pages
    products.json reviews.json posts.json same data, for any server-side use

tools/
  build-data.js      normalizes the raw catalog into the dataset
  build-content.js   builds the editorial and review datasets
  smoke-test.js      headless test suite
```

Header and footer are injected by `ui.js` so thirteen pages do not carry
thirteen copies of the same 200 lines. Page titles, meta descriptions,
breadcrumbs, `h1`s and the main content stay in the HTML, so the parts that
matter for indexing and for a no-JS reader are still served statically.

---

## Testing

```bash
npm install jsdom
node tools/smoke-test.js
```

Fifty-seven checks run each page in jsdom, execute its scripts and exercise the
real interactions: adding to cart, editing quantities, applying a valid and an
invalid coupon, filtering and clearing filters, loading more results, switching
variants, toggling bundle items, advancing the checkout with empty and with
filled fields, hitting the comparison cap, moving the hero between slides,
opening an accordion, filtering downloads and revealing a password.

Every page is then loaded twice more, once seeded to Vietnamese and once to
English, and checked for three things: that no untranslated literal survives,
that no dictionary key leaks through as raw text, and that neither language
leaves the other one visible in its rendering.

It also enforces four rules mechanically: exactly one `h1` per page, the eyebrow
budget on the home page, the shape of the header on every page, and that the
previous brand name appears nowhere in rendered text.

jsdom implements neither `matchMedia` nor `IntersectionObserver`. Both are
stubbed in the harness rather than worked around in the shipped code, since
every browser has had them for a decade.

---

## Rebuilding the data

```bash
curl "https://attackshark.com/products.json?limit=250" -o tools/raw.json
node tools/build-data.js      # writes assets/data/products.json
node tools/build-content.js   # writes posts.json and reviews.json
```

Then regenerate the script wrappers the pages load:

```bash
node -e "const fs=require('fs'),d='assets/data/';[['products','__CATALOG'],['reviews','__REVIEWS'],['posts','__POSTS']].forEach(([f,g])=>fs.writeFileSync(d+f+'.js','window.'+g+' = '+fs.readFileSync(d+f+'.json','utf8')+';\n'))"
```

`build-data.js` strips em-dashes and en-dashes from every string it emits, which
is what keeps the shipped copy clean of them. It also strips the source vendor
name out of product titles wherever it appears, so the storefront shows only its
own brand.

To rename the store again, edit `assets/js/brand.js`. Titles and meta
descriptions interpolate the name from there through the dictionary, so nothing
else hard-codes it.

To add a third language, add a column to every entry in `assets/js/i18n.js` and
`assets/js/i18n-content.js`, and add the code to `LANGS`.

---

## What is real and what is not

**Real,** taken from a public product catalog: product names, handles,
prices, compare-at prices, stock status, variants and SKUs, option sets, images,
and the feature copy on product pages, which is parsed from the real product
descriptions. Press links point at the real articles.

**Generated sample data,** so the interface has something to render: star
ratings, review counts, review text and reviewer names, units sold, the
giveaway countdown, and the blog articles.

**Not real at all:** no payment is processed and nothing is transmitted. Cart,
wishlist, comparison, recently viewed and order history live in `localStorage`
in your own browser. Every read and write is wrapped in `try/catch`, so a
private window or blocked site data degrades to in-memory state for the session
rather than breaking the page. The account forms validate input formats and
store nothing.
