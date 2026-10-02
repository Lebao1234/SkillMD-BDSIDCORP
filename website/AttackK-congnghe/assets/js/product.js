/* ============================================================================
   PRODUCT PAGE CONTROLLER
   Gallery with zoom, variant selection, quantity, add to cart, bundle builder,
   specification clusters, downloads, reviews and a sticky purchase bar.
   ========================================================================= */
(function (global) {
  'use strict';

  var doc = global.document;
  var Catalog = global.Catalog;
  var Store = global.Store;
  var UI = global.UI;
  var $ = UI.$;
  var $$ = UI.$$;
  var esc = Catalog.esc;
  var t = global.I18N.t;
  var icon = UI.icon;

  var product = null;
  var variant = null;
  var galleryIndex = 0;
  var bundle = {};

  function currentImages() {
    return product.images;
  }

  /* ------------------------------------------------------------------
     NOT FOUND
     ------------------------------------------------------------------ */
  function renderMissing() {
    $('[data-pdp]').innerHTML = '<div class="empty" style="grid-column:1/-1">' +
      '<span class="empty__icon">' + icon('package') + '</span>' +
      '<h2 class="empty__title">' + esc(t('pdp.missing.title')) + '</h2>' +
      '<p class="empty__text">' + esc(t('pdp.missing.text')) + '</p>' +
      '<div class="row"><a class="btn btn--primary" href="collection.html?c=shop-all">' + esc(t('search.browseAll')) + '</a>' +
      '<a class="btn btn--secondary" href="index.html">' + esc(t('pdp.missing.home')) + '</a></div></div>';
    $$('[data-pdp-section]').forEach(function (s) { s.hidden = true; });
    var bar = $('[data-stickybuy]');
    if (bar) bar.remove();
    var crumb = $('[data-crumb-name]');
    if (crumb) crumb.textContent = t('pdp.missing.crumb');
    doc.title = t('pdp.missing.title2', { brand: global.BRAND.name });
  }

  /* ------------------------------------------------------------------
     GALLERY
     ------------------------------------------------------------------ */
  function renderGallery() {
    var imgs = currentImages();
    $('[data-gallery-thumbs]').innerHTML = imgs.map(function (src, i) {
      return '<button type="button" class="gthumb" data-thumb="' + i + '" aria-current="' + (i === galleryIndex) + '" aria-label="' + esc(t('pdp.viewImage', { n: i + 1 })) + '">' +
        '<img src="' + esc(src) + '" alt="" loading="lazy" decoding="async" width="78" height="78"></button>';
    }).join('');

    var stage = $('[data-stage]');
    stage.querySelector('img').src = imgs[galleryIndex];
    stage.querySelector('img').alt = t('pdp.imageN', { title: product.title, n: galleryIndex + 1 });
  }

  function setImage(i) {
    var imgs = currentImages();
    galleryIndex = (i + imgs.length) % imgs.length;
    $('[data-stage]').classList.remove('is-zoomed');
    renderGallery();
  }

  /* ------------------------------------------------------------------
     VARIANTS
     ------------------------------------------------------------------ */
  function renderVariants() {
    var host = $('[data-variants]');
    if (product.variants.length < 2) { host.innerHTML = ''; return; }

    var optName = product.options.length ? product.options[0].name : t('qv.version');

    host.innerHTML = '<div class="opt-group">' +
      '<div class="opt-group__head">' +
        '<span class="opt-group__name">' + esc(optName) + '</span>' +
        '<span class="opt-group__value" data-variant-label>' + esc(variant.title) + '</span>' +
      '</div>' +
      '<div class="opt-list" role="group" aria-label="' + esc(t('qv.choose', { name: optName })) + '">' +
        product.variants.map(function (v) {
          return '<button type="button" class="opt' + (v.available ? '' : ' is-sold-out') + '" ' +
            'data-variant="' + esc(v.id) + '" aria-pressed="' + (v.id === variant.id) + '"' +
            (v.available ? '' : ' aria-disabled="true"') + '>' +
            (v.image ? '<img class="opt__thumb" src="' + esc(v.image) + '" alt="" loading="lazy" width="26" height="26">' : '') +
            esc(v.title) + '</button>';
        }).join('') +
      '</div></div>';
  }

  function selectVariant(id) {
    var v = product.variants.filter(function (x) { return x.id === id; })[0];
    if (!v) return;
    variant = v;
    $$('[data-variant]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-variant') === id));
    });
    var label = $('[data-variant-label]');
    if (label) label.textContent = v.title;
    if (v.image) {
      var i = product.images.indexOf(v.image);
      setImage(i >= 0 ? i : 0);
      if (i < 0) $('[data-stage] img').src = v.image;
    }
    renderPrice();
    renderStickyBar();
  }

  /* ------------------------------------------------------------------
     PRICE AND STOCK
     ------------------------------------------------------------------ */
  function renderPrice() {
    var host = $('[data-price]');
    var onSale = variant.compareAt && variant.compareAt > variant.price;
    var save = onSale ? Math.round(((variant.compareAt - variant.price) / variant.compareAt) * 100) : 0;

    host.innerHTML =
      '<span class="price price--lg">' +
        '<span class="price__now' + (onSale ? ' price__now--sale' : '') + '">' + Store.money(variant.price) + '</span>' +
        (onSale ? '<s class="price__was">' + Store.money(variant.compareAt) + '</s>' : '') +
      '</span>' +
      (onSale ? '<span class="badge badge--sale">' + esc(t('pdp.saveN', { n: save })) + '</span>' : '') +
      (variant.available
        ? '<span class="badge badge--stock">' + esc(t('g.inStock')) + '</span>'
        : '<span class="badge badge--out">' + esc(t('g.soldOut')) + '</span>');

    var add = $('[data-add]');
    var buy = $('[data-buynow]');
    add.disabled = !variant.available;
    add.textContent = variant.available ? t('g.addToCart') : t('g.soldOut');
    buy.hidden = !variant.available;

    var sku = $('[data-sku]');
    if (sku) sku.textContent = variant.sku || t('pdp.skuPending');
  }

  /* ------------------------------------------------------------------
     BUNDLE - frequently bought together
     ------------------------------------------------------------------ */
  function renderBundle() {
    var host = $('[data-fbt]');
    var partners = Catalog.alsoBuy(product.handle, 3);
    if (!partners.length) { host.closest('[data-pdp-block]').hidden = true; return; }

    partners.forEach(function (p) { if (!(p.handle in bundle)) bundle[p.handle] = false; });

    host.innerHTML = partners.map(function (p) {
      var on = bundle[p.handle];
      return '<div class="fbt__row' + (on ? ' is-added' : '') + '" data-fbt-row="' + esc(p.handle) + '">' +
        '<span class="fbt__media"><img src="' + esc(p.images[0]) + '" alt="" loading="lazy" width="58" height="58"></span>' +
        '<span><a class="fbt__name" href="product.html?handle=' + esc(p.handle) + '">' + esc(p.shortTitle) + '</a>' +
          '<span class="price price--sm" style="display:flex"><span class="price__now">' + Store.money(p.minPrice) + '</span></span></span>' +
        '<button type="button" class="btn btn--sm ' + (on ? 'btn--primary' : 'btn--secondary') + '" data-fbt-toggle="' + esc(p.handle) + '" aria-pressed="' + on + '">' +
          esc(on ? t('pdp.fbtAdded') : t('pdp.fbtAddBtn')) + '</button>' +
      '</div>';
    }).join('');

    var picked = partners.filter(function (p) { return bundle[p.handle]; });
    var total = variant.price + picked.reduce(function (n, p) { return n + p.minPrice; }, 0);

    $('[data-fbt-total]').innerHTML =
      '<div class="totals__row totals__row--grand"><span>' + esc(t('pdp.fbtTotal', { n: picked.length + 1 })) + '</span><span>' + Store.money(total) + '</span></div>';
    $('[data-fbt-add]').textContent = picked.length
      ? t('pdp.fbtAdd', { n: picked.length + 1 })
      : t('pdp.fbtAddOne');
  }

  /* ------------------------------------------------------------------
     SPECIFICATIONS
     Grouped into clusters instead of one long hairline table.
     ------------------------------------------------------------------ */
  function renderSpecs() {
    var f = product.facets;
    var groups = [];

    var core = [];
    core.push([t('pdp.spec.model'), product.shortTitle.split(' ').slice(0, 2).join(' ')]);
    core.push([t('pdp.spec.category'), Catalog.categoryLabel(product)]);
    /* The catalog this data came from carries its original vendor string.
       The storefront shows its own brand instead. */
    core.push([t('pdp.spec.brand'), (global.BRAND && global.BRAND.name) || product.vendor]);
    if (variant.sku) core.push([t('pdp.spec.sku'), variant.sku]);
    groups.push({ title: t('pdp.spec.identity'), rows: core });

    var perf = [];
    if (f.sensor) perf.push([t('pdp.spec.sensor'), f.sensor]);
    if (f.dpi) perf.push([t('pdp.spec.dpi'), f.dpi.toLocaleString(global.I18N.locale())]);
    if (f.polling) perf.push([t('pdp.spec.polling'), f.polling + 'Hz']);
    if (f.switchType) perf.push([t('pdp.spec.switch'), Catalog.facetLabel(f.switchType)]);
    if (perf.length) groups.push({ title: t('pdp.spec.performance'), rows: perf });

    var phys = [];
    if (f.weight) phys.push([t('pdp.spec.weight'), f.weight + 'g']);
    phys.push([t('pdp.spec.connection'), f.connection.map(Catalog.facetLabel).join(', ')]);
    phys.push([t('pdp.spec.port'), 'Type-C']);
    phys.push([t('pdp.spec.warranty'), t('pdp.spec.warranty12')]);
    groups.push({ title: t('pdp.spec.physical'), rows: phys });

    var opts = product.options.map(function (o) {
      return [o.name, o.values.join(', ')];
    });
    if (opts.length) groups.push({ title: t('pdp.spec.options'), rows: opts });

    $('[data-specs]').innerHTML = groups.map(function (g) {
      return '<div class="spec-group reveal"><p class="spec-group__title">' + esc(g.title) + '</p><dl class="stack stack-4">' +
        g.rows.map(function (r) {
          return '<div class="spec-row"><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>';
        }).join('') +
      '</dl></div>';
    }).join('');
  }

  /* ------------------------------------------------------------------
     FEATURE STORY BLOCKS
     ------------------------------------------------------------------ */
  function renderStory() {
    var host = $('[data-story]');
    var feats = product.features;
    if (!feats.length) {
      host.closest('[data-pdp-section]').hidden = true;
      return;
    }
    $('[data-story-count]').textContent = feats.length;
    host.innerHTML = feats.map(function (f, i) {
      return '<article class="storyblock reveal">' +
        '<p class="storyblock__num">' + String(i + 1).padStart(2, '0') + '</p>' +
        '<h3 class="storyblock__title">' + esc(f.heading) + '</h3>' +
        '<p class="storyblock__text">' + esc(f.body) + '</p>' +
      '</article>';
    }).join('');
  }

  /* ------------------------------------------------------------------
     REVIEWS
     ------------------------------------------------------------------ */
  function renderReviews() {
    var list = Catalog.reviewsFor(product.handle);
    var counts = [0, 0, 0, 0, 0];
    list.forEach(function (r) { counts[r.stars - 1] += 1; });
    var avg = list.length
      ? list.reduce(function (n, r) { return n + r.stars; }, 0) / list.length
      : product.rating;

    $('[data-review-summary]').innerHTML =
      '<div class="stack stack-3">' +
        '<p class="reviewsum__score mono">' + avg.toFixed(1) + '</p>' +
        '<div class="rating">' + Catalog.stars(avg) + '</div>' +
        '<p class="dim text-sm">' + esc(t('pdp.reviews.based', { n: list.length })) + '</p>' +
      '</div>' +
      '<div class="reviewbars">' +
        [5, 4, 3, 2, 1].map(function (s) {
          var n = counts[s - 1];
          var pct = list.length ? (n / list.length) * 100 : 0;
          return '<div class="reviewbar"><span>' + esc(t('pdp.reviews.stars', { n: s })) + '</span>' +
            '<span class="reviewbar__track"><span class="reviewbar__fill" style="width:' + pct.toFixed(1) + '%"></span></span>' +
            '<span>' + n + '</span></div>';
        }).join('') +
      '</div>' +
      '<button type="button" class="btn btn--secondary btn--block" data-write-review>' + esc(t('pdp.reviews.write')) + '</button>';

    $('[data-review-list]').innerHTML = list.map(function (r) {
      return '<article class="review">' +
        '<div class="review__head">' +
          '<span class="review__avatar" aria-hidden="true">' + esc(r.author.trim().charAt(0)) + '</span>' +
          '<div class="stack stack-2">' +
            '<span class="review__name">' + esc(r.author) + '</span>' +
            '<div class="row" style="gap:var(--space-3)">' +
              '<span class="rating">' + Catalog.stars(r.stars) + '</span>' +
              (r.verified ? '<span class="badge badge--stock">' + esc(t('pdp.reviews.verified')) + '</span>' : '') +
            '</div>' +
          '</div>' +
          '<span class="dim text-sm" style="margin-inline-start:auto">' + esc(r.date) + '</span>' +
        '</div>' +
        '<h4 class="review__title">' + esc(Catalog.reviewTitle(r)) + '</h4>' +
        '<p class="review__body">' + esc(Catalog.reviewBody(r)) + '</p>' +
        '<div class="review__foot">' +
          '<span>' + esc(t('pdp.reviews.variant', { name: r.variant })) + '</span>' +
          '<span>' + esc(t('pdp.reviews.helpful', { n: r.helpful })) + '</span>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  /* ------------------------------------------------------------------
     RELATED
     ------------------------------------------------------------------ */
  function renderRelated() {
    var rel = Catalog.related(product.handle, 4);
    if (!rel.length) { $('[data-related]').closest('[data-pdp-section]').hidden = true; return; }
    $('[data-related]').innerHTML = Catalog.cards(rel);
    UI.observeReveal($('[data-related]'));
    UI.syncCounts();
  }

  function renderViewed() {
    var host = $('[data-viewed-rail]');
    if (!host) return;
    var items = Store.getViewed()
      .filter(function (h) { return h !== product.handle; })
      .map(Catalog.get).filter(Boolean).slice(0, 6);
    if (items.length < 2) { host.closest('[data-pdp-section]').hidden = true; return; }
    host.innerHTML = Catalog.cards(items, { noQuickAdd: true });
    UI.observeReveal(host);
    UI.syncCounts();
  }

  /* ------------------------------------------------------------------
     STICKY PURCHASE BAR
     ------------------------------------------------------------------ */
  function renderStickyBar() {
    $('[data-sticky-name]').textContent = product.shortTitle;
    $('[data-sticky-price]').innerHTML = '<span class="price price--sm"><span class="price__now">' + Store.money(variant.price) + '</span></span>';
    var btn = $('[data-sticky-add]');
    btn.disabled = !variant.available;
    btn.textContent = variant.available ? t('g.addToCart') : t('g.soldOut');
    var img = $('[data-sticky-img]');
    img.src = variant.image || product.images[0];
  }

  function initStickyBar() {
    var bar = $('[data-stickybuy]');
    var anchor = $('[data-add]');
    if (!bar || !anchor || !('IntersectionObserver' in global)) return;
    new IntersectionObserver(function (entries) {
      bar.classList.toggle('is-on', !entries[0].isIntersecting && entries[0].boundingClientRect.top < 0);
    }, { threshold: 0 }).observe(anchor);
  }

  /* ------------------------------------------------------------------
     ADD TO CART
     ------------------------------------------------------------------ */
  function qty() {
    var input = $('[data-qty-main]');
    return Math.max(1, Math.min(99, parseInt(input.value, 10) || 1));
  }

  function addCurrent(showToast) {
    Store.addToCart({
      variantId: variant.id,
      handle: product.handle,
      title: product.shortTitle,
      variantTitle: variant.title,
      price: variant.price,
      compareAt: variant.compareAt,
      image: variant.image || product.images[0],
      qty: qty(),
    });
    if (showToast !== false) {
      UI.toast(t('toast.added', { name: product.shortTitle }), 'ok', t('toast.openCart'), 'cart.html');
    }
  }

  /* ------------------------------------------------------------------
     EVENTS
     ------------------------------------------------------------------ */
  function bind() {
    doc.addEventListener('click', function (e) {
      var thumb = e.target.closest('[data-thumb]');
      if (thumb) { setImage(parseInt(thumb.getAttribute('data-thumb'), 10)); return; }

      if (e.target.closest('[data-gal-prev]')) { setImage(galleryIndex - 1); return; }
      if (e.target.closest('[data-gal-next]')) { setImage(galleryIndex + 1); return; }

      var stage = e.target.closest('[data-stage]');
      if (stage && !e.target.closest('.gallery__arrows')) {
        stage.classList.toggle('is-zoomed');
        return;
      }

      var vbtn = e.target.closest('[data-variant]');
      if (vbtn) { selectVariant(vbtn.getAttribute('data-variant')); return; }

      if (e.target.closest('[data-qty-minus]')) {
        var i1 = $('[data-qty-main]');
        i1.value = Math.max(1, (parseInt(i1.value, 10) || 1) - 1);
        return;
      }
      if (e.target.closest('[data-qty-plus]')) {
        var i2 = $('[data-qty-main]');
        i2.value = Math.min(99, (parseInt(i2.value, 10) || 1) + 1);
        return;
      }

      var addBtn = e.target.closest('[data-add]');
      if (addBtn) {
        addBtn.classList.add('is-loading');
        global.setTimeout(function () {
          addBtn.classList.remove('is-loading');
          addCurrent();
        }, 240);
        return;
      }

      if (e.target.closest('[data-sticky-add]')) { addCurrent(); return; }

      if (e.target.closest('[data-buynow]')) {
        addCurrent(false);
        global.location.href = 'checkout.html';
        return;
      }

      var fbtToggle = e.target.closest('[data-fbt-toggle]');
      if (fbtToggle) {
        var h = fbtToggle.getAttribute('data-fbt-toggle');
        bundle[h] = !bundle[h];
        renderBundle();
        return;
      }

      if (e.target.closest('[data-fbt-add]')) {
        addCurrent(false);
        var n = 1;
        Object.keys(bundle).forEach(function (h) {
          if (!bundle[h]) return;
          var p = Catalog.get(h);
          if (!p) return;
          var v = p.variants.filter(function (x) { return x.available; })[0] || p.variants[0];
          Store.addToCart({
            variantId: v.id, handle: p.handle, title: p.shortTitle, variantTitle: v.title,
            price: v.price, compareAt: v.compareAt, image: v.image || p.images[0], qty: 1,
          });
          n += 1;
        });
        UI.toast(t('toast.addedN', { n: n }), 'ok', t('toast.openCart'), 'cart.html');
        return;
      }

      var wish = e.target.closest('[data-pdp-wish]');
      if (wish) {
        var added = Store.toggleWishlist(product.handle);
        wish.setAttribute('aria-pressed', String(added));
        wish.classList.toggle('is-on', added);
        UI.toast(added ? t('toast.wishAdded') : t('toast.wishRemoved'), added ? 'ok' : 'info');
        return;
      }

      var cmp = e.target.closest('[data-pdp-compare]');
      if (cmp) {
        var res = Store.toggleCompare(product.handle);
        if (!res.ok) { UI.toast(res.reason, 'bad'); return; }
        cmp.setAttribute('aria-pressed', String(res.added));
        UI.toast(res.added ? t('toast.cmpAdded') : t('toast.cmpRemoved'), res.added ? 'ok' : 'info',
          res.added ? t('toast.openCompare') : null, 'compare.html');
        return;
      }

      if (e.target.closest('[data-write-review]')) {
        UI.toast(t('toast.reviewLogin'), 'info', t('toast.signIn'), 'account.html');
      }

      var share = e.target.closest('[data-share]');
      if (share) {
        var url = global.location.href;
        if (navigator.share) {
          navigator.share({ title: product.title, url: url }).catch(function () {});
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(function () {
            UI.toast(t('toast.linkCopied'), 'ok');
          }).catch(function () {
            UI.toast(t('toast.copyBlocked'), 'bad');
          });
        }
      }
    });

    /* Keyboard navigation inside the gallery. */
    $('[data-gallery]').addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); setImage(galleryIndex + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); setImage(galleryIndex - 1); }
    });
  }

  /* ------------------------------------------------------------------
     BOOT
     ------------------------------------------------------------------ */
  function boot() {
    var handle = new URLSearchParams(global.location.search).get('handle');
    product = handle ? Catalog.get(handle) : null;

    if (!product) {
      /* Fall back to the best seller so the page is never a dead end. */
      if (!handle) product = Catalog.sortItems(Catalog.all, 'best')[0];
      if (!product) { renderMissing(); return; }
    }

    variant = product.variants.filter(function (v) { return v.available; })[0] || product.variants[0];
    Store.markViewed(product.handle);

    doc.title = product.shortTitle + ' | ' + global.BRAND.name;
    var meta = doc.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', product.summary.slice(0, 155));

    $('[data-crumb-cat]').textContent = Catalog.categoryLabel(product);
    $('[data-crumb-cat]').href = 'collection.html?c=' + product.category;
    $('[data-crumb-name]').textContent = product.shortTitle;

    $('[data-title]').textContent = product.shortTitle;
    $('[data-sub]').textContent = product.summary;
    $('[data-cat]').textContent = Catalog.categoryLabel(product);
    $('[data-rating]').innerHTML = Catalog.stars(product.rating) +
      '<span class="mono">' + product.rating.toFixed(1) + '</span>' +
      '<a class="dim" href="#reviews">' + esc(t('g.reviews', { n: product.reviewCount })) + '</a>';

    /* Highlight bullets, taken from the real feature headings. */
    var bullets = product.features.slice(0, 6).map(function (f) { return f.heading; });
    if (bullets.length < 3) {
      bullets = [];
      if (product.facets.sensor) bullets.push(t('pdp.bullet.sensor', { name: product.facets.sensor }));
      if (product.facets.weight) bullets.push(t('pdp.bullet.weight', { n: product.facets.weight }));
      if (product.facets.polling) bullets.push(t('pdp.bullet.polling', { n: product.facets.polling }));
      bullets.push(t('pdp.bullet.connection', { list: product.facets.connection.map(Catalog.facetLabel).join(', ') }));
      bullets.push(t('pdp.bullet.warranty'));
    }
    $('[data-bullets]').innerHTML = bullets.map(function (b) {
      return '<p class="buybox__bullet"><i class="ph-light ph-check" aria-hidden="true"></i><span>' + esc(b) + '</span></p>';
    }).join('');

    var wishBtn = $('[data-pdp-wish]');
    var on = Store.inWishlist(product.handle);
    wishBtn.setAttribute('aria-pressed', String(on));
    wishBtn.classList.toggle('is-on', on);
    $('[data-pdp-compare]').setAttribute('aria-pressed', String(Store.inCompare(product.handle)));

    $('[data-sold]').textContent = product.unitsSold.toLocaleString(global.I18N.locale());

    /* Download links follow the same pattern the brand uses for every model. */
    var slug = product.shortTitle.split(' ').slice(0, 2).join('').replace(/[^A-Za-z0-9]/g, '');
    $('[data-downloads]').innerHTML =
      '<a class="dllink" href="downloads.html">' + icon('download-simple') + esc(t('pdp.software', { name: slug })) + '</a>' +
      '<a class="dllink" href="downloads.html#manuals">' + icon('file-pdf') + esc(t('pdp.manual')) + '</a>' +
      '<a class="dllink" href="https://controlhub.top/AttackShark/" target="_blank" rel="noopener">' + icon('globe') + esc(t('pdp.webdriver')) + '</a>';

    renderGallery();
    renderVariants();
    renderPrice();
    renderBundle();
    renderSpecs();
    renderStory();
    renderReviews();
    renderRelated();
    renderViewed();
    renderStickyBar();
    initStickyBar();
    bind();

    UI.observeReveal();
    UI.syncCounts();
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);
