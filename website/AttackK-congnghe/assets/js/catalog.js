/* ============================================================================
   CATALOG
   Query, filter, sort and render helpers over the product dataset.
   Data arrives from assets/data/products.js as window.__CATALOG.
   ========================================================================= */
(function (global) {
  'use strict';

  var t = global.I18N.t;

  var ALL = Array.isArray(global.__CATALOG) ? global.__CATALOG : [];
  var REVIEWS = global.__REVIEWS || {};
  var POSTS = Array.isArray(global.__POSTS) ? global.__POSTS : [];

  var BY_HANDLE = {};
  ALL.forEach(function (p) { BY_HANDLE[p.handle] = p; });

  /* Collections the storefront navigation points at. Each one is a slug plus a
     predicate, so a collection page needs no separate dataset. Titles and
     blurbs are i18n keys; the slug is what travels in the URL. */
  var COLLECTIONS = {
    'shop-all': { key: 'col.all', test: function () { return true; } },
    'mouse': { key: 'col.mouse', test: function (p) { return p.category === 'mouse'; } },
    'keyboard': { key: 'col.keyboard', test: function (p) { return p.category === 'keyboard'; } },
    'he-keyboard': { key: 'col.he', test: function (p) { return p.category === 'he-keyboard'; } },
    'headset': { key: 'col.headset', test: function (p) { return p.category === 'headset'; } },
    'mousepad': { key: 'col.mousepad', test: function (p) { return p.category === 'mousepad'; } },
    'cable': { key: 'col.cable', test: function (p) { return p.category === 'cable'; } },
    'keycaps': { key: 'col.keycaps', test: function (p) { return p.category === 'keycaps'; } },
    'switches': { key: 'col.switches', test: function (p) { return p.category === 'switches'; } },
    'accessories': {
      key: 'col.accessories',
      test: function (p) {
        return ['wrist-rest', 'grip-tape', 'cover', 'tools', 'accessories'].indexOf(p.category) !== -1;
      },
    },
    'bundle': { key: 'col.bundle', test: function (p) { return p.category === 'bundle'; } },
    'new': { key: 'col.new', test: function (p) { return p.isNew; } },
    'sale': { key: 'col.sale', test: function (p) { return p.onSale; } },
    'best-selling': { key: 'col.best', test: function () { return true; }, sort: 'best' },
    'wireless': {
      key: 'col.wireless',
      test: function (p) { return p.facets.connection.indexOf('2.4GHz Wireless') !== -1; },
    },
    '8k': { key: 'col.8k', test: function (p) { return p.facets.polling >= 8000; } },
  };

  /* Category name shown on cards, breadcrumbs and facets. The dataset stores a
     stable slug; the words come from the dictionary. */
  function categoryLabel(product) {
    return t('lbl.' + product.category);
  }

  /* Facet values are stable ASCII identifiers so they can live in a URL
     unchanged across languages. This maps one to its display label. */
  var FACET_LABELS = {
    'Con hang': 'g.inStock',
    'Het hang': 'g.outOfStock',
    'Duoi 50g': 'f.under50',
    '50g den 59g': 'f.50to59',
    '60g den 69g': 'f.60to69',
    '70g tro len': 'f.70plus',
    '2.4GHz Wireless': 'f.wireless24',
    'Bluetooth': 'f.bluetooth',
    'Wired': 'f.wired',
    'Magnetic HE': 'f.magnetic',
    'Optical': 'f.optical',
    'Mechanical': 'f.mechanical',
  };

  function facetLabel(value) {
    if (FACET_LABELS[value]) return t(FACET_LABELS[value]);
    if (/^[a-z-]+$/.test(value) && global.I18N) {
      var key = 'lbl.' + value;
      var out = t(key);
      if (out !== key) return out;
    }
    return value;
  }

  function collection(slug) {
    var def = COLLECTIONS[slug] || COLLECTIONS['shop-all'];
    var items = ALL.filter(def.test);
    if (def.sort === 'best') {
      items = items.slice().sort(function (a, b) { return b.unitsSold - a.unitsSold; });
    }
    return {
      slug: slug,
      def: def,
      title: t(def.key + '.title'),
      blurb: t(def.key + '.blurb', { brand: global.BRAND ? global.BRAND.name : '' }),
      items: items,
    };
  }

  function get(handle) { return BY_HANDLE[handle] || null; }

  function reviewsFor(handle) { return REVIEWS[handle] || []; }

  /* Editorial records carry an _en twin for every field the storefront wrote
     itself. Product copy has no twin, because it comes from the supplier. */
  function localized(record, field) {
    var alt = record[field + '_en'];
    return global.I18N.lang === 'en' && alt ? alt : record[field];
  }

  function postTitle(p) { return localized(p, 'title'); }
  function postExcerpt(p) { return localized(p, 'excerpt'); }
  function postBody(p) { return localized(p, 'body'); }
  function reviewTitle(r) { return localized(r, 'title'); }
  function reviewBody(r) { return localized(r, 'body'); }

  function posts() { return POSTS.slice(); }

  function post(slug) {
    return POSTS.filter(function (p) { return p.slug === slug; })[0] || null;
  }

  /* ------------------------------------------------------------------
     SORTING
     ------------------------------------------------------------------ */
  var SORTS = {
    featured: { label: 'sort.featured', fn: null },
    best: { label: 'sort.best', fn: function (a, b) { return b.unitsSold - a.unitsSold; } },
    new: { label: 'sort.new', fn: function (a, b) { return new Date(b.publishedAt) - new Date(a.publishedAt); } },
    old: { label: 'sort.old', fn: function (a, b) { return new Date(a.publishedAt) - new Date(b.publishedAt); } },
    'price-asc': { label: 'sort.priceAsc', fn: function (a, b) { return a.minPrice - b.minPrice; } },
    'price-desc': { label: 'sort.priceDesc', fn: function (a, b) { return b.minPrice - a.minPrice; } },
    'title-asc': { label: 'sort.titleAsc', fn: function (a, b) { return a.title.localeCompare(b.title); } },
    'title-desc': { label: 'sort.titleDesc', fn: function (a, b) { return b.title.localeCompare(a.title); } },
    rating: { label: 'sort.rating', fn: function (a, b) { return b.rating - a.rating; } },
  };

  function sortItems(items, key) {
    var s = SORTS[key];
    if (!s || !s.fn) return items.slice();
    return items.slice().sort(s.fn);
  }

  /* ------------------------------------------------------------------
     FACETS
     Built from whatever is actually present in the current result set, so a
     filter never offers a value that would return nothing.
     ------------------------------------------------------------------ */
  function buildFacets(items) {
    var out = {
      category: {},
      connection: {},
      sensor: {},
      polling: {},
      switchType: {},
      weight: {},
      availability: { 'Con hang': 0, 'Het hang': 0 },
      price: { min: Infinity, max: 0 },
    };

    items.forEach(function (p) {
      out.category[p.category] = (out.category[p.category] || 0) + 1;
      p.facets.connection.forEach(function (c) { out.connection[c] = (out.connection[c] || 0) + 1; });
      if (p.facets.sensor) out.sensor[p.facets.sensor] = (out.sensor[p.facets.sensor] || 0) + 1;
      if (p.facets.polling) {
        var k = p.facets.polling + 'Hz';
        out.polling[k] = (out.polling[k] || 0) + 1;
      }
      if (p.facets.switchType) out.switchType[p.facets.switchType] = (out.switchType[p.facets.switchType] || 0) + 1;
      if (p.facets.weight) {
        var band = p.facets.weight < 50 ? 'Duoi 50g'
          : p.facets.weight < 60 ? '50g den 59g'
          : p.facets.weight < 70 ? '60g den 69g'
          : '70g tro len';
        out.weight[band] = (out.weight[band] || 0) + 1;
      }
      out.availability[p.available ? 'Con hang' : 'Het hang'] += 1;
      out.price.min = Math.min(out.price.min, p.minPrice);
      out.price.max = Math.max(out.price.max, p.maxPrice || p.minPrice);
    });

    if (out.price.min === Infinity) out.price.min = 0;
    out.price.min = Math.floor(out.price.min);
    out.price.max = Math.ceil(out.price.max);
    return out;
  }

  var WEIGHT_BANDS = {
    'Duoi 50g': function (w) { return w > 0 && w < 50; },
    '50g den 59g': function (w) { return w >= 50 && w < 60; },
    '60g den 69g': function (w) { return w >= 60 && w < 70; },
    '70g tro len': function (w) { return w >= 70; },
  };

  function applyFilters(items, f) {
    f = f || {};
    return items.filter(function (p) {
      if (f.inStock && !p.available) return false;
      if (f.onSale && !p.onSale) return false;
      if (f.priceMin != null && p.minPrice < f.priceMin) return false;
      if (f.priceMax != null && p.minPrice > f.priceMax) return false;

      if (f.category && f.category.length && f.category.indexOf(p.categoryLabel) === -1) return false;

      if (f.connection && f.connection.length) {
        var hit = f.connection.some(function (c) { return p.facets.connection.indexOf(c) !== -1; });
        if (!hit) return false;
      }
      if (f.sensor && f.sensor.length && f.sensor.indexOf(p.facets.sensor) === -1) return false;
      if (f.polling && f.polling.length && f.polling.indexOf(p.facets.polling + 'Hz') === -1) return false;
      if (f.switchType && f.switchType.length && f.switchType.indexOf(p.facets.switchType) === -1) return false;

      if (f.weight && f.weight.length) {
        var w = p.facets.weight || 0;
        var pass = f.weight.some(function (band) {
          return WEIGHT_BANDS[band] ? WEIGHT_BANDS[band](w) : false;
        });
        if (!pass) return false;
      }
      return true;
    });
  }

  /* ------------------------------------------------------------------
     SEARCH
     Weighted token match over title, category, tags, sensor and description.
     ------------------------------------------------------------------ */
  function search(query, limit) {
    var q = String(query || '').trim().toLowerCase();
    if (q.length < 2) return [];
    var tokens = q.split(/\s+/);

    var scored = ALL.map(function (p) {
      var title = p.title.toLowerCase();
      var hay = (p.title + ' ' + categoryLabel(p) + ' ' + p.categoryLabel + ' ' + p.tags.join(' ') + ' ' +
        (p.facets.sensor || '') + ' ' + p.summary).toLowerCase();
      var score = 0;
      tokens.forEach(function (t) {
        if (title.indexOf(t) === 0) score += 14;
        else if (title.indexOf(' ' + t) !== -1) score += 9;
        else if (title.indexOf(t) !== -1) score += 6;
        else if (hay.indexOf(t) !== -1) score += 2;
      });
      if (score && p.available) score += 1;
      return { p: p, score: score };
    }).filter(function (s) { return s.score > 0; });

    scored.sort(function (a, b) { return b.score - a.score || b.p.unitsSold - a.p.unitsSold; });
    return scored.slice(0, limit || 40).map(function (s) { return s.p; });
  }

  /* Products that pair well with the one on screen: same brand, different
     category, priced to sit under the anchor item. */
  function alsoBuy(handle, n) {
    var p = get(handle);
    if (!p) return [];
    return ALL.filter(function (x) {
      return x.handle !== handle && x.available && x.group !== p.group && x.minPrice <= p.minPrice;
    }).sort(function (a, b) { return b.unitsSold - a.unitsSold; }).slice(0, n || 3);
  }

  function related(handle, n) {
    var p = get(handle);
    if (!p) return [];
    return ALL.filter(function (x) {
      return x.handle !== handle && x.category === p.category;
    }).sort(function (a, b) {
      return Math.abs(a.minPrice - p.minPrice) - Math.abs(b.minPrice - p.minPrice);
    }).slice(0, n || 4);
  }

  /* ------------------------------------------------------------------
     RENDERING
     ------------------------------------------------------------------ */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function stars(rating) {
    var pct = Math.max(0, Math.min(100, (Number(rating) / 5) * 100));
    return '<span class="rating__stars" aria-hidden="true">★★★★★' +
      '<span class="rating__fill" style="width:' + pct.toFixed(1) + '%">★★★★★</span></span>';
  }

  function priceHtml(p, size) {
    var cls = 'price' + (size ? ' price--' + size : '');
    var now = global.Store.money(p.minPrice);
    var prefix = p.maxPrice > p.minPrice ? 'Tu ' : '';
    var html = '<span class="' + cls + '">' +
      '<span class="price__now' + (p.onSale ? ' price__now--sale' : '') + '">' + prefix + now + '</span>';
    if (p.onSale) html += '<s class="price__was">' + global.Store.money(p.compareAt) + '</s>';
    return html + '</span>';
  }

  function specChips(p) {
    var bits = [];
    if (p.facets.weight) bits.push(p.facets.weight + 'g');
    if (p.facets.sensor) bits.push(p.facets.sensor);
    if (p.facets.polling) bits.push(p.facets.polling + 'Hz');
    if (!bits.length && p.facets.switchType) bits.push(p.facets.switchType);
    if (!bits.length) bits.push(categoryLabel(p));
    return bits.slice(0, 3).map(function (b) { return '<span>' + esc(b) + '</span>'; }).join('');
  }

  function swatches(p) {
    var colorOpt = p.options.filter(function (o) { return /color|colour|mau/i.test(o.name); })[0];
    if (!colorOpt) return '';
    var shown = colorOpt.values.slice(0, 5);
    var extra = colorOpt.values.length - shown.length;
    var html = shown.map(function (v) {
      var variant = p.variants.filter(function (x) { return x.options.indexOf(v) !== -1; })[0];
      var bg = variant && variant.image ? 'background-image:url(' + variant.image + ')' : '';
      return '<span class="swatch" style="' + bg + '" title="' + esc(v) + '"></span>';
    }).join('');
    if (extra > 0) html += '<span class="swatch swatch--more">+' + extra + '</span>';
    return '<span class="pcard__swatches" aria-label="' + esc(t('card.colours', { n: colorOpt.values.length })) + '">' + html + '</span>';
  }

  function card(p, opts) {
    opts = opts || {};
    var url = 'product.html?handle=' + encodeURIComponent(p.handle);
    var alt = p.images[1] || p.images[0];
    var flags = '';
    if (!p.available) flags += '<span class="badge badge--out">' + esc(t('g.outOfStock')) + '</span>';
    else if (p.onSale) flags += '<span class="badge badge--sale">' + esc(t('card.discount', { n: p.discountPct })) + '</span>';
    if (p.isNew) flags += '<span class="badge badge--new">' + esc(t('g.new')) + '</span>';

    var wished = global.Store.inWishlist(p.handle);
    var compared = global.Store.inCompare(p.handle);

    return '' +
      '<article class="pcard reveal" data-handle="' + esc(p.handle) + '">' +
        '<div class="pcard__media">' +
          '<a href="' + url + '" tabindex="-1" aria-hidden="true">' +
            '<img class="pcard__img pcard__img--main" src="' + esc(p.images[0]) + '" alt="" loading="lazy" decoding="async" width="600" height="600">' +
            (alt !== p.images[0] ? '<img class="pcard__img pcard__img--alt" src="' + esc(alt) + '" alt="" loading="lazy" decoding="async" width="600" height="600">' : '') +
          '</a>' +
          '<div class="pcard__flags">' + flags + '</div>' +
          '<div class="pcard__tools">' +
            '<button type="button" class="pcard__tool js-wish' + (wished ? ' is-on' : '') + '" data-handle="' + esc(p.handle) + '" aria-pressed="' + wished + '" aria-label="' + esc(t('card.saveWish', { name: p.shortTitle })) + '">' +
              '<i class="ph-light ph-heart" aria-hidden="true"></i></button>' +
            '<button type="button" class="pcard__tool js-compare' + (compared ? ' is-on' : '') + '" data-handle="' + esc(p.handle) + '" aria-pressed="' + compared + '" aria-label="' + esc(t('card.addCompare', { name: p.shortTitle })) + '">' +
              '<i class="ph-light ph-scales" aria-hidden="true"></i></button>' +
            '<button type="button" class="pcard__tool js-quickview" data-handle="' + esc(p.handle) + '" aria-label="' + esc(t('card.quickView', { name: p.shortTitle })) + '">' +
              '<i class="ph-light ph-eye" aria-hidden="true"></i></button>' +
          '</div>' +
          (opts.noQuickAdd ? '' :
            '<div class="pcard__quick">' +
              (p.available
                ? '<button type="button" class="btn btn--contrast btn--sm btn--block js-quickadd" data-handle="' + esc(p.handle) + '">' +
                    '<i class="ph-light ph-shopping-cart-simple" aria-hidden="true"></i>' + esc(t('g.addToCart')) + '</button>'
                : '<button type="button" class="btn btn--secondary btn--sm btn--block" disabled>' + esc(t('g.soldOut')) + '</button>') +
            '</div>') +
        '</div>' +
        '<div class="pcard__body">' +
          '<p class="pcard__cat">' + esc(categoryLabel(p)) + '</p>' +
          '<h3 class="pcard__title"><a href="' + url + '">' + esc(p.shortTitle) + '</a></h3>' +
          '<div class="pcard__spec">' + specChips(p) + '</div>' +
          '<div class="rating">' + stars(p.rating) +
            '<span class="mono">' + p.rating.toFixed(1) + '</span>' +
            '<span class="dim">(' + p.reviewCount + ')</span>' +
          '</div>' +
          '<div class="pcard__foot">' + priceHtml(p) + swatches(p) + '</div>' +
        '</div>' +
      '</article>';
  }

  function cards(items, opts) {
    return items.map(function (p) { return card(p, opts); }).join('');
  }

  function skeletons(n) {
    var one = '<div class="skel-card">' +
      '<div class="skel skel-card__media"></div>' +
      '<div class="skel-card__lines">' +
        '<div class="skel skel-line skel-line--sm"></div>' +
        '<div class="skel skel-line skel-line--lg"></div>' +
        '<div class="skel skel-line"></div>' +
      '</div></div>';
    return new Array(n || 8).fill(one).join('');
  }

  global.Catalog = {
    all: ALL,
    get: get,
    collections: COLLECTIONS,
    collection: collection,
    categoryLabel: categoryLabel,
    facetLabel: facetLabel,
    sorts: SORTS,
    sortItems: sortItems,
    buildFacets: buildFacets,
    applyFilters: applyFilters,
    search: search,
    alsoBuy: alsoBuy,
    related: related,
    reviewsFor: reviewsFor,
    postTitle: postTitle,
    postExcerpt: postExcerpt,
    postBody: postBody,
    reviewTitle: reviewTitle,
    reviewBody: reviewBody,
    posts: posts,
    post: post,
    card: card,
    cards: cards,
    skeletons: skeletons,
    stars: stars,
    priceHtml: priceHtml,
    esc: esc,
  };
})(window);
