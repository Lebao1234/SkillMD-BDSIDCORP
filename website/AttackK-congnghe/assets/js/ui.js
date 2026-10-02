/* ============================================================================
   UI
   Shared chrome for every page: announcement ticker, header with the catalog
   panel and inline search, mobile navigation, search overlay, cart drawer,
   quick view modal, toasts, accordions, tabs, scroll reveal, theme toggle and
   back to top.

   Motion rules observed here:
     - no scroll event listeners, IntersectionObserver only
     - transform and opacity only
     - every animation collapses under prefers-reduced-motion
   ========================================================================= */
(function (global) {
  'use strict';

  var doc = global.document;
  var Store = global.Store;
  var Catalog = global.Catalog;
  var BRAND = global.BRAND;
  var I18N = global.I18N;
  var t = I18N.t;
  var esc = Catalog ? Catalog.esc : function (s) { return s; };

  var reduceMotion = global.matchMedia
    ? global.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false };

  function $(sel, root) { return (root || doc).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); }

  function icon(name) { return '<i class="ph-light ph-' + name + '" aria-hidden="true"></i>'; }

  /* ======================================================================
     CATALOG MODEL
     One panel replaces the five hover menus the first header used. Counts are
     read from the live catalog, so a column can never advertise a collection
     that has nothing in it.

     Every label here is an i18n key rather than a string, so the model is the
     same shape in both languages and nothing has to be duplicated per locale.
     ====================================================================== */
  function count(slug) {
    return Catalog ? Catalog.collection(slug).items.length : 0;
  }

  var CATALOG_COLS = [
    { title: 'cat.mice', icon: 'mouse', links: [
      ['cat.allMice', 'collection.html?c=mouse', 'mouse'],
      ['cat.triMode', 'collection.html?c=wireless', 'wireless'],
      ['cat.polling8k', 'collection.html?c=8k', '8k'],
      ['cat.under50', 'collection.html?c=mouse&weight=' + encodeURIComponent('Duoi 50g'), null],
      ['cat.paw3950', 'collection.html?c=mouse&sensor=PAW3950MAX', null],
    ] },
    { title: 'cat.keyboards', icon: 'keyboard', links: [
      ['cat.mechKb', 'collection.html?c=keyboard', 'keyboard'],
      ['cat.heKb', 'collection.html?c=he-keyboard', 'he-keyboard'],
      ['cat.rapidTrigger', 'collection.html?c=he-keyboard&sort=new', null],
      ['cat.keycaps', 'collection.html?c=keycaps', 'keycaps'],
      ['cat.switches', 'collection.html?c=switches', 'switches'],
    ] },
    { title: 'cat.audioSurface', icon: 'headphones', links: [
      ['cat.headsets', 'collection.html?c=headset', 'headset'],
      ['cat.mousepads', 'collection.html?c=mousepad', 'mousepad'],
      ['cat.padsBest', 'collection.html?c=mousepad&sort=best', null],
    ] },
    { title: 'cat.accessories', icon: 'plugs', links: [
      ['cat.cables', 'collection.html?c=cable', 'cable'],
      ['cat.restsGrip', 'collection.html?c=accessories', 'accessories'],
      ['cat.bundles', 'collection.html?c=bundle', 'bundle'],
      ['cat.newIn', 'collection.html?c=new', 'new'],
      ['cat.onSale', 'collection.html?c=sale', 'sale'],
    ] },
  ];

  /* Four shortcuts only. Anything deeper lives one click away inside the
     catalog panel, which is what keeps the bar on a single line at desktop. */
  var SHORTCUTS = [
    { key: 'nav.new', href: 'collection.html?c=new', tag: 'NEW' },
    { key: 'nav.sale', href: 'collection.html?c=sale', tag: 'SALE' },
    { key: 'nav.blog', href: 'blog.html' },
    { key: 'nav.support', href: 'support.html' },
  ];

  var FEATURED_HANDLE = 'attack-shark-rs6-ultra-wireless-gaming-mouse';

  var ANNOUNCE = [
    { key: 'ann.ship', cta: 'ann.ship.cta', href: 'support.html#shipping' },
    { key: 'ann.preorder', cta: 'ann.preorder.cta', href: 'product.html?handle=attack-shark-r86-he' },
    { key: 'ann.f1', cta: 'ann.f1.cta', href: 'product.html?handle=attack-shark-f1-air-39g-wireless-paw3955max-gaming-mouse' },
    { key: 'ann.returns', cta: 'ann.returns.cta', href: 'support.html#returns' },
  ];

  /* ======================================================================
     HEADER MARKUP
     ====================================================================== */
  function headerHtml() {
    var announce = ANNOUNCE.map(function (a, i) {
      return '<p class="announce__item' + (i === 0 ? ' is-current' : '') + '" data-i="' + i + '">' +
        '<span class="announce__text">' + esc(t(a.key)) + '</span>' +
        '<a class="announce__cta" href="' + a.href + '"><span>' + esc(t(a.cta)) + '</span>' + icon('arrow-right') + '</a>' +
      '</p>';
    }).join('');

    var cols = CATALOG_COLS.map(function (c) {
      return '<div><p class="mega__coltitle">' + icon(c.icon) + esc(t(c.title)) + '</p><ul class="mega__list">' +
        c.links.map(function (l) {
          var n = l[2] ? count(l[2]) : 0;
          return '<li><a href="' + l[1] + '"><span>' + esc(t(l[0])) + '</span>' +
            (n ? '<span class="mega__count">' + n + '</span>' : '') + '</a></li>';
        }).join('') + '</ul></div>';
    }).join('');

    var feature = Catalog ? Catalog.get(FEATURED_HANDLE) : null;
    if (!feature && Catalog) feature = Catalog.sortItems(Catalog.all, 'best')[0];

    var featureHtml = feature
      ? '<a class="mega__feature" href="product.html?handle=' + esc(feature.handle) + '">' +
          '<span class="mega__coltitle" style="margin:0;border:0;padding:0">' + icon('star') + esc(t('cat.featured')) + '</span>' +
          '<span class="mega__feature-media"><img src="' + esc(feature.images[0]) + '" alt="" loading="lazy" decoding="async" width="300" height="300"></span>' +
          '<span class="mega__feature-name">' + esc(feature.shortTitle) + '</span>' +
          '<span class="price price--sm"><span class="price__now">' + Store.money(feature.minPrice) + '</span></span>' +
        '</a>'
      : '';

    var shortcuts = SHORTCUTS.map(function (s) {
      return '<a class="quicknav__link" href="' + s.href + '">' + esc(t(s.key)) +
        (s.tag ? '<span class="quicknav__tag">' + s.tag + '</span>' : '') + '</a>';
    }).join('');

    var langs = Object.keys(I18N.langs).map(function (code) {
      return '<option value="' + code + '"' + (I18N.lang === code ? ' selected' : '') + '>' +
        code.toUpperCase() + '</option>';
    }).join('');

    return '' +
    '<div class="announce" data-announce>' +
      '<div class="wrap announce__inner">' +
        '<button type="button" class="announce__nav" data-announce-prev aria-label="' + esc(t('ann.prev')) + '">' + icon('caret-left') + '</button>' +
        '<div class="announce__viewport">' + announce + '</div>' +
        '<button type="button" class="announce__nav" data-announce-next aria-label="' + esc(t('ann.next')) + '">' + icon('caret-right') + '</button>' +
      '</div>' +
    '</div>' +

    '<header class="header" data-header>' +
      '<div class="wrap header__bar">' +

        '<button type="button" class="icon-btn burger" data-mobilenav aria-expanded="false" aria-controls="mobilenav" aria-label="' + esc(t('nav.openMenu')) + '">' +
          '<span></span><span></span><span></span>' +
        '</button>' +

        '<a class="brand" href="index.html" aria-label="' + esc(t('nav.backHome', { brand: BRAND.name })) + '">' +
          BRAND.lockup({ size: 30, descriptor: true }) +
        '</a>' +

        '<button type="button" class="catbtn js-mega" aria-expanded="false" aria-controls="mega-catalog">' +
          icon('squares-four') + esc(t('g.catalog')) +
          '<span class="catbtn__caret">' + icon('caret-down') + '</span>' +
        '</button>' +

        '<nav class="quicknav" aria-label="' + esc(t('nav.shortcuts')) + '">' + shortcuts + '</nav>' +

        '<div class="hsearch__wrap">' +
          '<form class="hsearch" role="search" data-hsearch>' +
            '<span class="searchbox__icon">' + icon('magnifying-glass') + '</span>' +
            '<label class="visually-hidden" for="hsearch-input">' + esc(t('nav.searchLabel')) + '</label>' +
            '<input class="hsearch__input" id="hsearch-input" type="search" autocomplete="off" ' +
              'placeholder="' + esc(t('nav.searchPlaceholder')) + '" data-hsearch-input ' +
              'aria-controls="typeahead" aria-expanded="false">' +
            '<kbd class="hsearch__key">/</kbd>' +
          '</form>' +
          '<div class="typeahead" id="typeahead" data-typeahead role="listbox" aria-label="' + esc(t('nav.suggestions')) + '"></div>' +
        '</div>' +

        '<div class="header__actions">' +
          '<button type="button" class="icon-btn header__searchbtn" data-open-search aria-label="' + esc(t('nav.search')) + '">' + icon('magnifying-glass') + '</button>' +
          '<label class="visually-hidden" for="lang-select">' + esc(t('nav.language')) + '</label>' +
          '<select class="curselect curselect--lang" id="lang-select" data-lang>' + langs + '</select>' +
          '<label class="visually-hidden" for="cur-select">' + esc(t('nav.currency')) + '</label>' +
          '<select class="curselect" id="cur-select" data-currency>' +
            Object.keys(Store.currencies).map(function (c) {
              return '<option value="' + c + '"' + (Store.getCurrency() === c ? ' selected' : '') + '>' + c + '</option>';
            }).join('') +
          '</select>' +
          '<button type="button" class="icon-btn" data-theme-toggle aria-label="' + esc(t('nav.theme')) + '">' + icon('moon-stars') + '</button>' +
          '<span class="header__divider" aria-hidden="true"></span>' +
          '<a class="icon-btn" href="account.html" aria-label="' + esc(t('nav.account')) + '">' + icon('user') + '</a>' +
          '<span class="icon-btn-wrap"><a class="icon-btn" href="compare.html" aria-label="' + esc(t('nav.compare')) + '">' + icon('scales') +
            '<span class="icon-btn__count" data-count-compare hidden>0</span></a></span>' +
          '<span class="icon-btn-wrap"><a class="icon-btn" href="wishlist.html" aria-label="' + esc(t('nav.wishlist')) + '">' + icon('heart') +
            '<span class="icon-btn__count" data-count-wish hidden>0</span></a></span>' +
          '<span class="icon-btn-wrap"><button type="button" class="icon-btn" data-open-cart aria-label="' + esc(t('nav.cart')) + '">' + icon('shopping-cart-simple') +
            '<span class="icon-btn__count" data-count-cart hidden>0</span></button></span>' +
        '</div>' +
      '</div>' +

      '<div class="mega" id="mega-catalog" data-mega>' +
        '<div class="wrap mega__inner">' +
          '<div class="mega__cols">' + cols + '</div>' +
          featureHtml +
        '</div>' +
      '</div>' +
    '</header>';
  }

  /* ======================================================================
     FOOTER MARKUP
     ====================================================================== */
  function footerHtml() {
    var socials = BRAND.socials.map(function (s) {
      return '<a class="footer__social" href="' + s[1] + '" target="_blank" rel="noopener" aria-label="' +
        esc(t('ft.socialOn', { brand: BRAND.name, network: s[2] })) + '">' + icon(s[0]) + '</a>';
    }).join('');

    var stores = ['UK', 'DE', 'JP', 'CA', 'FR', 'KR', 'BR', 'ES', 'IT'].map(function (c) {
      return '<a class="footer__store" href="#">' + esc(t('ft.store', { code: c })) + '</a>';
    }).join('');

    function col(titleKey, links) {
      return '<div><p class="footer__colhead">' + esc(t(titleKey)) + '</p><ul class="footer__list">' +
        links.map(function (l) { return '<li><a href="' + l[1] + '">' + esc(t(l[0])) + '</a></li>'; }).join('') +
        '</ul></div>';
    }

    return '' +
    '<footer class="footer">' +
      '<div class="footer__news"><div class="wrap footer__news-inner">' +
        '<div class="stack stack-4">' +
          '<h2 class="footer__news-title">' + t('ft.newsTitle') + '</h2>' +
          '<p class="muted">' + esc(t('ft.newsText')) + '</p>' +
        '</div>' +
        '<form class="newsform" data-newsletter novalidate>' +
          '<div class="field">' +
            '<label class="field__label" for="news-email">' + esc(t('ft.email')) + '</label>' +
            '<div class="newsform__row">' +
              '<input class="input" type="email" id="news-email" name="email" placeholder="ten@vidu.com" autocomplete="email" required>' +
              '<button class="btn btn--primary" type="submit">' + esc(t('ft.subscribe')) + '</button>' +
            '</div>' +
            '<p class="field__help">' + esc(t('ft.emailHelp')) + '</p>' +
            '<p class="field__error" data-error>' + icon('warning-circle') + '<span>' + esc(t('ft.emailError')) + '</span></p>' +
          '</div>' +
        '</form>' +
      '</div></div>' +

      '<div class="footer__main"><div class="wrap">' +
        '<div class="footer__cols">' +
          '<div class="footer__about">' +
            '<a class="brand" href="index.html">' + BRAND.lockup({ size: 34, descriptor: true }) + '</a>' +
            '<p class="muted text-md">' + esc(t('ft.about', { line: t('g.brandLine') })) + '</p>' +
            '<div class="footer__socials">' + socials + '</div>' +
          '</div>' +
          col('ft.colProducts', [
            ['lbl.mouse', 'collection.html?c=mouse'],
            ['lbl.keyboard', 'collection.html?c=keyboard'],
            ['lbl.he-keyboard', 'collection.html?c=he-keyboard'],
            ['lbl.headset', 'collection.html?c=headset'],
            ['lbl.mousepad', 'collection.html?c=mousepad'],
            ['cat.bundles', 'collection.html?c=bundle'],
          ]) +
          col('ft.colSupport', [
            ['ft.driver', 'downloads.html'],
            ['ft.shipPolicy', 'support.html#shipping'],
            ['ft.returns15', 'support.html#returns'],
            ['ft.warranty12', 'support.html#warranty'],
            ['ft.faq', 'support.html#faq'],
            ['ft.contact', 'support.html#contact'],
          ]) +
          col('ft.colCompany', [
            ['ft.aboutUs', 'support.html#about'],
            ['ft.affiliate', 'support.html#affiliate'],
            ['ft.creators', 'support.html#creators'],
            ['ft.news', 'blog.html?topic=news'],
            ['ft.knowledge', 'blog.html?topic=guides'],
            ['ft.userReviews', 'blog.html'],
          ]) +
          col('ft.colAccount', [
            ['ft.signIn', 'account.html'],
            ['ft.register', 'account.html#register'],
            ['ft.orders', 'account.html#orders'],
            ['ft.wishlist', 'wishlist.html'],
            ['ft.compare', 'compare.html'],
            ['ft.cart', 'cart.html'],
          ]) +
        '</div>' +
        '<div class="footer__stores">' + stores + '</div>' +
        '<div class="footer__legal">' +
          '<p>' + esc(t('ft.disclaimer', { brand: BRAND.name })) + '</p>' +
          '<div class="paylist"><span>VISA</span><span>MASTERCARD</span><span>AMEX</span><span>PAYPAL</span><span>APPLE PAY</span><span>MOMO</span><span>VNPAY</span></div>' +
        '</div>' +
        '<div class="footer__legal">' +
          '<span>' + esc(t('ft.copyright', { brand: BRAND.legalName })) + '</span>' +
          '<div class="footer__legal-links">' +
            '<a href="mailto:' + BRAND.email.support + '">' + BRAND.email.support + '</a>' +
            '<a href="support.html#privacy">' + esc(t('ft.privacy')) + '</a>' +
            '<a href="support.html#terms">' + esc(t('ft.terms')) + '</a>' +
            '<a href="support.html#cookies">' + esc(t('ft.cookies')) + '</a>' +
          '</div>' +
        '</div>' +
      '</div></div>' +
    '</footer>';
  }

  /* ======================================================================
     OVERLAY MARKUP (search, cart drawer, mobile nav, quick view)
     ====================================================================== */
  function overlaysHtml() {
    var mobileGroups = CATALOG_COLS.map(function (c, i) {
      return '<div class="mobilenav__group">' +
        '<button type="button" class="mobilenav__toggle" aria-expanded="' + (i === 0) + '" aria-controls="mnav-' + i + '">' +
          esc(t(c.title)) + icon('plus') + '</button>' +
        '<div class="mobilenav__panel" id="mnav-' + i + '"><div><div class="mobilenav__links">' +
          c.links.map(function (l) { return '<a href="' + l[1] + '">' + esc(t(l[0])) + '</a>'; }).join('') +
        '</div></div></div></div>';
    }).join('') +
    SHORTCUTS.map(function (sc) {
      return '<div class="mobilenav__group"><a class="mobilenav__toggle" href="' + sc.href + '">' +
        esc(t(sc.key)) + icon('arrow-right') + '</a></div>';
    }).join('');

    return '' +
    '<div class="backdrop" data-backdrop></div>' +

    '<div class="searchbox" data-searchbox role="dialog" aria-modal="true" aria-label="' + esc(t('search.title')) + '">' +
      '<div class="wrap searchbox__inner">' +
        '<div class="searchbox__field">' +
          '<span class="searchbox__icon">' + icon('magnifying-glass') + '</span>' +
          '<label class="visually-hidden" for="search-input">' + esc(t('nav.searchLabel')) + '</label>' +
          '<input class="searchbox__input" id="search-input" type="search" placeholder="' + esc(t('search.placeholder')) + '" autocomplete="off" data-search-input>' +
          '<button type="button" class="icon-btn" data-close-search aria-label="' + esc(t('search.close')) + '">' + icon('x') + '</button>' +
        '</div>' +
        '<div class="searchbox__suggest">' +
          '<span class="dim text-sm">' + esc(t('search.suggest')) + '</span>' +
          ['8K polling', 'carbon fiber', 'rapid trigger', 'PAW3950MAX', '39g', 'glass pad'].map(function (s) {
            return '<button type="button" class="chip" data-suggest="' + esc(s) + '">' + esc(s) + '</button>';
          }).join('') +
        '</div>' +
        '<div class="searchbox__results" data-search-results aria-live="polite"></div>' +
      '</div>' +
    '</div>' +

    '<aside class="drawer drawer--left" data-drawer="mobilenav" id="mobilenav" role="dialog" aria-modal="true" aria-label="' + esc(t('m.nav')) + '">' +
      '<div class="drawer__head">' +
        '<p class="drawer__title">' + esc(t('g.catalog')) + '</p>' +
        '<button type="button" class="icon-btn" data-close-drawer aria-label="' + esc(t('m.closeMenu')) + '">' + icon('x') + '</button>' +
      '</div>' +
      '<div class="drawer__body">' + mobileGroups +
        '<div class="stack stack-4" style="padding-block-start:var(--space-8)">' +
          '<a class="btn btn--secondary btn--block" href="account.html">' + icon('user') + esc(t('m.account')) + '</a>' +
          '<a class="btn btn--secondary btn--block" href="support.html">' + icon('lifebuoy') + esc(t('m.support')) + '</a>' +
        '</div>' +
      '</div>' +
    '</aside>' +

    '<aside class="drawer" data-drawer="cart" id="cartdrawer" role="dialog" aria-modal="true" aria-label="' + esc(t('cart.title')) + '">' +
      '<div class="drawer__head">' +
        '<p class="drawer__title">' + esc(t('cart.title')) + ' <span class="mono dim" data-cart-title-count>(0)</span></p>' +
        '<button type="button" class="icon-btn" data-close-drawer aria-label="' + esc(t('cart.close')) + '">' + icon('x') + '</button>' +
      '</div>' +
      '<div class="drawer__body" data-cart-body></div>' +
      '<div class="drawer__foot" data-cart-foot hidden></div>' +
    '</aside>' +

    '<div class="modal" data-modal="quickview" role="dialog" aria-modal="true" aria-label="' + esc(t('qv.title')) + '">' +
      '<div class="modal__panel" data-quickview-panel></div>' +
    '</div>' +

    '<div class="toasts" data-toasts role="status" aria-live="polite"></div>' +
    '<button type="button" class="totop" data-totop aria-label="' + esc(t('ft.backTop')) + '">' + icon('arrow-up') + '</button>' +
    '<div class="grain" aria-hidden="true"></div>';
  }

  /* ======================================================================
     FOCUS TRAP
     ====================================================================== */
  var FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  var trapStack = [];

  function trapFocus(container, returnTo) {
    function onKey(e) {
      if (e.key !== 'Tab') return;
      var items = $$(FOCUSABLE, container).filter(function (el) {
        return el.offsetParent !== null || el === doc.activeElement;
      });
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey && doc.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && doc.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    container.addEventListener('keydown', onKey);
    trapStack.push({ container: container, onKey: onKey, returnTo: returnTo });
    var firstEl = $$(FOCUSABLE, container)[0];
    if (firstEl) global.setTimeout(function () { firstEl.focus(); }, 60);
  }

  function releaseFocus() {
    var trap = trapStack.pop();
    if (!trap) return;
    trap.container.removeEventListener('keydown', trap.onKey);
    if (trap.returnTo && trap.returnTo.focus) trap.returnTo.focus();
  }

  /* ======================================================================
     OVERLAY CONTROLLER
     ====================================================================== */
  var openLayer = null;

  function lockBody(on) {
    doc.body.classList.toggle('is-locked', !!on);
  }

  function closeAll() {
    if (!openLayer) return;
    var el = openLayer.el;
    el.classList.remove('is-open');
    if (openLayer.trigger) openLayer.trigger.setAttribute('aria-expanded', 'false');
    $('[data-backdrop]').classList.remove('is-open');
    lockBody(false);
    releaseFocus();
    openLayer = null;
  }

  function openLayerEl(el, trigger) {
    if (openLayer && openLayer.el === el) { closeAll(); return; }
    if (openLayer) closeAll();
    el.classList.add('is-open');
    $('[data-backdrop]').classList.add('is-open');
    lockBody(true);
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    openLayer = { el: el, trigger: trigger };
    trapFocus(el, trigger);
  }

  /* ======================================================================
     TOASTS
     ====================================================================== */
  var TOAST_ICON = { info: 'info', ok: 'check-circle', bad: 'warning-circle' };

  function toast(message, kind, actionLabel, actionHref) {
    var host = $('[data-toasts]');
    if (!host) return;
    var k = kind || 'info';
    var el = doc.createElement('div');
    el.className = 'toast toast--' + k;
    el.innerHTML = '<span class="toast__icon">' + icon(TOAST_ICON[k] || 'info') + '</span>' +
      '<div class="grow"><p>' + esc(message) + '</p>' +
      (actionLabel ? '<a class="link" style="margin-block-start:var(--space-3)" href="' + actionHref + '">' + esc(actionLabel) + '</a>' : '') +
      '</div>';
    host.appendChild(el);
    global.setTimeout(function () {
      el.classList.add('is-out');
      global.setTimeout(function () { el.remove(); }, 320);
    }, actionLabel ? 5200 : 3400);
  }

  /* ======================================================================
     CART DRAWER RENDERING
     ====================================================================== */
  function renderCartDrawer() {
    var body = $('[data-cart-body]');
    var foot = $('[data-cart-foot]');
    if (!body) return;
    var cart = Store.getCart();
    $('[data-cart-title-count]').textContent = '(' + Store.cartCount() + ')';

    if (!cart.length) {
      body.innerHTML = '<div class="empty">' +
        '<span class="empty__icon">' + icon('shopping-cart-simple') + '</span>' +
        '<h3 class="empty__title">' + esc(t('cart.empty.title')) + '</h3>' +
        '<p class="empty__text">' + esc(t('cart.empty.text')) + '</p>' +
        '<div class="row" style="gap:var(--space-4)">' +
          '<a class="btn btn--primary" href="collection.html?c=best-selling">' + esc(t('cart.empty.best')) + '</a>' +
          '<a class="btn btn--secondary" href="collection.html?c=new">' + esc(t('cart.empty.new')) + '</a>' +
        '</div></div>';
      foot.hidden = true;
      return;
    }

    body.innerHTML = cart.map(function (l) {
      return '<div class="litem" data-line="' + esc(l.variantId) + '">' +
        '<a class="litem__media" href="product.html?handle=' + esc(l.handle) + '"><img src="' + esc(l.image) + '" alt="" loading="lazy" width="84" height="84"></a>' +
        '<div class="litem__body">' +
          '<a class="litem__title" href="product.html?handle=' + esc(l.handle) + '">' + esc(l.title) + '</a>' +
          (l.variantTitle && l.variantTitle !== 'Default Title' ? '<p class="litem__meta">' + esc(l.variantTitle) + '</p>' : '') +
          '<div class="qty qty--sm">' +
            '<button type="button" class="qty__btn" data-qty-down aria-label="' + esc(t('g.decrease')) + '">' + icon('minus') + '</button>' +
            '<input class="qty__input" type="number" value="' + l.qty + '" min="1" max="99" aria-label="' + esc(t('g.quantity')) + '" data-qty-input>' +
            '<button type="button" class="qty__btn" data-qty-up aria-label="' + esc(t('g.increase')) + '">' + icon('plus') + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="litem__side">' +
          '<span class="price price--sm"><span class="price__now">' + Store.money(l.price * l.qty) + '</span></span>' +
          '<button type="button" class="litem__remove" data-remove>' + esc(t('g.remove')) + '</button>' +
        '</div>' +
      '</div>';
    }).join('');

    var tot = Store.totals();
    var pct = Math.min(100, (tot.subtotal / tot.freeShipAt) * 100);
    foot.hidden = false;
    foot.innerHTML =
      '<div class="meter">' +
        '<div class="meter__track"><div class="meter__fill' + (tot.freeShipRemaining === 0 ? ' is-done' : '') + '" style="width:' + pct.toFixed(1) + '%"></div></div>' +
        '<p class="meter__text">' + esc(tot.freeShipRemaining === 0
          ? t('cart.freeShipDone')
          : t('cart.freeShipLeft', { amount: Store.money(tot.freeShipRemaining) })) + '</p>' +
      '</div>' +
      '<div class="totals">' +
        '<div class="totals__row"><span>' + esc(t('cart.subtotal')) + '</span><span>' + Store.money(tot.subtotal) + '</span></div>' +
        (tot.savings > 0 ? '<div class="totals__row"><span>' + esc(t('cart.savings')) + '</span><span style="color:var(--success)">' + Store.money(tot.savings) + '</span></div>' : '') +
      '</div>' +
      '<a class="btn btn--primary btn--lg btn--block" href="checkout.html">' + esc(t('cart.checkout')) + '</a>' +
      '<a class="btn btn--secondary btn--block" href="cart.html">' + esc(t('cart.viewFull')) + '</a>';
  }

  /* ======================================================================
     QUICK VIEW
     ====================================================================== */
  function openQuickView(handle, trigger) {
    var p = Catalog.get(handle);
    if (!p) return;
    var panel = $('[data-quickview-panel]');
    var v = p.variants.filter(function (x) { return x.available; })[0] || p.variants[0];

    panel.innerHTML =
      '<button type="button" class="icon-btn icon-btn--bordered modal__close" data-close-modal aria-label="' + esc(t('qv.close')) + '">' + icon('x') + '</button>' +
      '<div class="pdp" style="padding:var(--space-9);gap:var(--space-9)">' +
        '<div>' +
          '<div class="gallery__stage" style="cursor:default"><img src="' + esc(p.images[0]) + '" alt="' + esc(p.title) + '" width="700" height="700"></div>' +
          '<div class="rail" style="margin-block-start:var(--space-4);grid-auto-columns:78px">' +
            p.images.slice(0, 6).map(function (src, i) {
              return '<button type="button" class="gthumb" data-qv-thumb="' + i + '" aria-current="' + (i === 0) + '"><img src="' + esc(src) + '" alt="" loading="lazy" width="78" height="78"></button>';
            }).join('') +
          '</div>' +
        '</div>' +
        '<div class="buybox">' +
          '<div class="buybox__head">' +
            '<p class="pcard__cat">' + esc(p.categoryLabel) + '</p>' +
            '<h2 class="buybox__title" style="font-size:var(--fs-3xl)">' + esc(p.shortTitle) + '</h2>' +
            '<div class="rating">' + Catalog.stars(p.rating) + '<span class="mono">' + p.rating.toFixed(1) + '</span><span class="dim">(' + esc(t('g.reviews', { n: p.reviewCount })) + ')</span></div>' +
          '</div>' +
          '<div class="buybox__pricerow">' + Catalog.priceHtml(p, 'lg') +
            (p.available ? '<span class="badge badge--stock">' + esc(t('g.inStock')) + '</span>' : '<span class="badge badge--out">' + esc(t('g.outOfStock')) + '</span>') +
          '</div>' +
          '<p class="muted">' + esc(p.summary) + '</p>' +
          (p.options.length && p.options[0].values.length > 1
            ? '<div class="opt-group"><div class="opt-group__head"><span class="opt-group__name">' + esc(p.options[0].name) + '</span>' +
              '<span class="opt-group__value" data-qv-optval>' + esc(v.options[0] || '') + '</span></div>' +
              '<div class="opt-list">' + p.variants.map(function (x, i) {
                return '<button type="button" class="opt' + (x.available ? '' : ' is-sold-out') + '" data-qv-variant="' + esc(x.id) + '" aria-pressed="' + (x.id === v.id) + '"' + (x.available ? '' : ' disabled') + '>' +
                  (x.image ? '<img class="opt__thumb" src="' + esc(x.image) + '" alt="" loading="lazy" width="26" height="26">' : '') +
                  esc(x.title) + '</button>';
              }).join('') + '</div></div>'
            : '') +
          '<div class="buybox__actions">' +
            '<div class="buybox__actionrow">' +
              '<div class="qty">' +
                '<button type="button" class="qty__btn" data-qv-down aria-label="' + esc(t('g.decrease')) + '">' + icon('minus') + '</button>' +
                '<input class="qty__input" type="number" value="1" min="1" max="99" aria-label="' + esc(t('g.quantity')) + '" data-qv-qty>' +
                '<button type="button" class="qty__btn" data-qv-up aria-label="' + esc(t('g.increase')) + '">' + icon('plus') + '</button>' +
              '</div>' +
              '<button type="button" class="btn btn--primary btn--lg" data-qv-add' + (p.available ? '' : ' disabled') + '>' +
                esc(p.available ? t('g.addToCart') : t('g.soldOut')) + '</button>' +
            '</div>' +
            '<a class="btn btn--secondary btn--block" href="product.html?handle=' + esc(p.handle) + '">' + esc(t('qv.viewProduct')) + '</a>' +
          '</div>' +
        '</div>' +
      '</div>';

    var state = { variant: v, qty: 1 };

    panel.addEventListener('click', function (e) {
      var thumb = e.target.closest('[data-qv-thumb]');
      if (thumb) {
        var i = parseInt(thumb.getAttribute('data-qv-thumb'), 10);
        $('.gallery__stage img', panel).src = p.images[i];
        $$('[data-qv-thumb]', panel).forEach(function (t) { t.setAttribute('aria-current', t === thumb); });
        return;
      }
      var vb = e.target.closest('[data-qv-variant]');
      if (vb) {
        state.variant = p.variants.filter(function (x) { return x.id === vb.getAttribute('data-qv-variant'); })[0];
        $$('[data-qv-variant]', panel).forEach(function (b) { b.setAttribute('aria-pressed', b === vb); });
        var label = $('[data-qv-optval]', panel);
        if (label) label.textContent = state.variant.options[0] || state.variant.title;
        if (state.variant.image) $('.gallery__stage img', panel).src = state.variant.image;
        return;
      }
      var input = $('[data-qv-qty]', panel);
      if (e.target.closest('[data-qv-down]')) { input.value = Math.max(1, parseInt(input.value, 10) - 1); return; }
      if (e.target.closest('[data-qv-up]')) { input.value = Math.min(99, parseInt(input.value, 10) + 1); return; }
      if (e.target.closest('[data-qv-add]')) {
        Store.addToCart({
          variantId: state.variant.id,
          handle: p.handle,
          title: p.shortTitle,
          variantTitle: state.variant.title,
          price: state.variant.price,
          compareAt: state.variant.compareAt,
          image: state.variant.image || p.images[0],
          qty: parseInt(input.value, 10) || 1,
        });
        closeAll();
        toast(t('toast.added', { name: p.shortTitle }), 'ok', t('toast.openCart'), 'cart.html');
      }
    });

    openLayerEl($('[data-modal="quickview"]'), trigger);
  }

  /* ======================================================================
     ANNOUNCEMENT ROTATOR
     ====================================================================== */
  function initAnnounce() {
    var root = $('[data-announce]');
    if (!root) return;
    var items = $$('.announce__item', root);
    if (items.length < 2) return;
    var i = 0;
    var timer = null;

    function go(next) {
      items[i].classList.remove('is-current');
      items[i].classList.add('is-prev');
      var prev = items[i];
      global.setTimeout(function () { prev.classList.remove('is-prev'); }, 420);
      i = (next + items.length) % items.length;
      items[i].classList.add('is-current');
    }

    function start() {
      if (reduceMotion.matches) return;
      stop();
      timer = global.setInterval(function () { go(i + 1); }, 5200);
    }
    function stop() { if (timer) global.clearInterval(timer); timer = null; }

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    $('[data-announce-next]').addEventListener('click', function () { go(i + 1); start(); });
    $('[data-announce-prev]').addEventListener('click', function () { go(i - 1); start(); });
    start();
  }

  /* ======================================================================
     HEADER BEHAVIOUR
     Sticky styling is driven by a sentinel and IntersectionObserver, never by
     a scroll listener.
     ====================================================================== */
  function initHeader() {
    var header = $('[data-header]');
    if (!header) return;

    var sentinel = doc.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:0;height:1px;width:1px';
    header.parentNode.insertBefore(sentinel, header);

    if ('IntersectionObserver' in global) {
      new IntersectionObserver(function (entries) {
        header.classList.toggle('is-stuck', !entries[0].isIntersecting);
      }, { rootMargin: '0px' }).observe(sentinel);
    }

    /* Catalog panel. One trigger, one panel. Click rather than hover, so the
       keyboard path is the same path, and the panel does not fire while the
       pointer is merely travelling across the bar. */
    var megaBtn = $('.js-mega', header);
    var megaPanel = $('[data-mega]', header);
    var leaveTimer = null;

    function setMega(open) {
      if (!megaBtn || !megaPanel) return;
      megaPanel.classList.toggle('is-open', open);
      megaBtn.setAttribute('aria-expanded', String(open));
    }

    if (megaBtn) {
      megaBtn.addEventListener('click', function () {
        setMega(megaBtn.getAttribute('aria-expanded') !== 'true');
      });

      doc.addEventListener('click', function (e) {
        if (!e.target.closest('.mega') && !e.target.closest('.js-mega')) setMega(false);
      });

      /* A short grace period stops the panel snapping shut when the pointer
         crosses the gap between the trigger and the panel. */
      header.addEventListener('mouseleave', function () {
        leaveTimer = global.setTimeout(function () { setMega(false); }, 220);
      });
      header.addEventListener('mouseenter', function () {
        if (leaveTimer) global.clearTimeout(leaveTimer);
      });
    }

    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { setMega(false); closeAll(); }
    });

    /* Mark the current page among the shortcuts. */
    var page = global.location.pathname.split('/').pop() || 'index.html';
    var params = new URLSearchParams(global.location.search);
    $$('.quicknav__link[href]', header).forEach(function (a) {
      var href = a.getAttribute('href');
      if (href.indexOf(page) !== 0) return;
      var c = params.get('c');
      if (page === 'collection.html' && c && href.indexOf('c=' + c) === -1) return;
      a.setAttribute('aria-current', 'page');
    });
  }

  /* ======================================================================
     INLINE SEARCH WITH TYPE-AHEAD
     The field lives in the bar at desktop widths. Results drop straight under
     it, so the common case of "I know what I want" never opens a full overlay.
     ====================================================================== */
  function initInlineSearch() {
    var form = $('[data-hsearch]');
    var input = $('[data-hsearch-input]');
    var panel = $('[data-typeahead]');
    if (!form || !input || !panel) return;

    var debounce = null;

    function close() {
      panel.classList.remove('is-open');
      input.setAttribute('aria-expanded', 'false');
    }

    function open() {
      panel.classList.add('is-open');
      input.setAttribute('aria-expanded', 'true');
    }

    function render(q) {
      var term = String(q || '').trim();
      if (term.length < 2) { close(); return; }

      var hits = Catalog.search(term, 6);
      if (!hits.length) {
        panel.innerHTML = '<p class="text-sm dim" style="padding:var(--space-4)">' +
          esc(t('search.noneFor', { q: term })) + '</p>';
        open();
        return;
      }

      panel.innerHTML = hits.map(function (p) {
        return '<a class="sresult" role="option" href="product.html?handle=' + esc(p.handle) + '">' +
          '<span class="sresult__media"><img src="' + esc(p.images[0]) + '" alt="" loading="lazy" width="62" height="62"></span>' +
          '<span><span class="sresult__title">' + esc(p.shortTitle) + '</span>' +
          '<span class="sresult__meta"> ' + esc(p.categoryLabel) + (p.facets.sensor ? ' / ' + esc(p.facets.sensor) : '') + '</span></span>' +
          '<span class="price price--sm"><span class="price__now">' + Store.money(p.minPrice) + '</span></span>' +
        '</a>';
      }).join('') +
      '<a class="btn btn--secondary btn--sm btn--block" style="margin-block-start:var(--space-3)" ' +
        'href="search.html?q=' + encodeURIComponent(term) + '">' + esc(t('search.allResults')) + '</a>';
      open();
    }

    input.addEventListener('input', function () {
      global.clearTimeout(debounce);
      var q = input.value;
      debounce = global.setTimeout(function () { render(q); }, 160);
    });

    input.addEventListener('focus', function () {
      if (input.value.trim().length >= 2) render(input.value);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = input.value.trim();
      if (v.length < 2) { toast(t('toast.searchShort'), 'bad'); return; }
      global.location.href = 'search.html?q=' + encodeURIComponent(v);
    });

    doc.addEventListener('click', function (e) {
      if (!e.target.closest('.hsearch__wrap')) close();
    });

    /* Slash focuses the field, the way a search-led storefront should behave.
       Escape returns the field to its resting state. */
    doc.addEventListener('keydown', function (e) {
      if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(doc.activeElement.tagName)) {
        if (input.offsetParent === null) return;
        e.preventDefault();
        input.focus();
        input.select();
      }
      if (e.key === 'Escape' && doc.activeElement === input) {
        close();
        input.blur();
      }
    });
  }

  /* ======================================================================
     SEARCH
     ====================================================================== */
  function initSearch() {
    var box = $('[data-searchbox]');
    var input = $('[data-search-input]');
    var results = $('[data-search-results]');
    if (!box || !input) return;

    var debounce = null;

    function render(q) {
      if (String(q).trim().length < 2) {
        results.innerHTML = '<p class="dim text-sm">' + esc(t('search.minChars')) + '</p>';
        return;
      }
      var hits = Catalog.search(q, 8);
      if (!hits.length) {
        results.innerHTML = '<div class="empty" style="padding-block:var(--space-9)">' +
          '<span class="empty__icon">' + icon('magnifying-glass') + '</span>' +
          '<h3 class="empty__title">' + esc(t('search.noResults')) + '</h3>' +
          '<p class="empty__text">' + esc(t('search.noResultsText')) + '</p>' +
          '<a class="btn btn--secondary" href="collection.html?c=shop-all">' + esc(t('search.browseAll')) + '</a></div>';
        return;
      }
      results.innerHTML =
        hits.map(function (p) {
          return '<a class="sresult" href="product.html?handle=' + esc(p.handle) + '">' +
            '<span class="sresult__media"><img src="' + esc(p.images[0]) + '" alt="" loading="lazy" width="62" height="62"></span>' +
            '<span><span class="sresult__title">' + esc(p.shortTitle) + '</span>' +
            '<span class="sresult__meta"> ' + esc(p.categoryLabel) + (p.facets.sensor ? ' / ' + esc(p.facets.sensor) : '') + '</span></span>' +
            '<span class="price price--sm"><span class="price__now">' + Store.money(p.minPrice) + '</span></span>' +
          '</a>';
        }).join('') +
        '<a class="btn btn--secondary btn--block" href="search.html?q=' + encodeURIComponent(q) + '">' + esc(t('search.allFor', { q: q })) + '</a>';
    }

    input.addEventListener('input', function () {
      global.clearTimeout(debounce);
      var q = input.value;
      debounce = global.setTimeout(function () { render(q); }, 160);
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && input.value.trim().length >= 2) {
        global.location.href = 'search.html?q=' + encodeURIComponent(input.value.trim());
      }
    });

    box.addEventListener('click', function (e) {
      var s = e.target.closest('[data-suggest]');
      if (s) {
        input.value = s.getAttribute('data-suggest');
        render(input.value);
        input.focus();
      }
      if (e.target.closest('[data-close-search]')) closeAll();
    });

    render('');
  }

  /* ======================================================================
     GLOBAL DELEGATION
     ====================================================================== */
  function initGlobalEvents() {
    doc.addEventListener('click', function (e) {
      var target = e.target;

      if (target.closest('[data-open-search]')) { openLayerEl($('[data-searchbox]'), target.closest('[data-open-search]')); return; }
      if (target.closest('[data-open-cart]')) { renderCartDrawer(); openLayerEl($('[data-drawer="cart"]'), target.closest('[data-open-cart]')); return; }
      if (target.closest('[data-mobilenav]')) { openLayerEl($('[data-drawer="mobilenav"]'), target.closest('[data-mobilenav]')); return; }
      if (target.closest('[data-close-drawer]') || target.closest('[data-close-modal]') || target.closest('[data-backdrop]')) { closeAll(); return; }

      /* Generic opener: data-open-layer holds a selector for any drawer or
         modal a page defines locally, such as the mobile filter panel. */
      var opener = target.closest('[data-open-layer]');
      if (opener) {
        var target = $(opener.getAttribute('data-open-layer'));
        if (target) openLayerEl(target, opener);
        return;
      }

      var toTop = target.closest('[data-totop]');
      if (toTop) {
        global.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
        return;
      }

      var themeBtn = target.closest('[data-theme-toggle]');
      if (themeBtn) {
        var isLight = doc.documentElement.getAttribute('data-theme') === 'light' ||
          (!doc.documentElement.getAttribute('data-theme') && global.matchMedia('(prefers-color-scheme: light)').matches);
        Store.setTheme(isLight ? 'dark' : 'light');
        syncThemeIcon();
        return;
      }

      var wish = target.closest('.js-wish');
      if (wish) {
        var added = Store.toggleWishlist(wish.getAttribute('data-handle'));
        toast(added ? t('toast.wishAdded') : t('toast.wishRemoved'), added ? 'ok' : 'info',
          added ? t('toast.viewWish') : null, 'wishlist.html');
        return;
      }

      var cmp = target.closest('.js-compare');
      if (cmp) {
        var res = Store.toggleCompare(cmp.getAttribute('data-handle'));
        if (!res.ok) toast(res.reason, 'bad');
        else toast(res.added ? t('toast.cmpAdded') : t('toast.cmpRemoved'), res.added ? 'ok' : 'info',
          res.added ? t('toast.openCompare') : null, 'compare.html');
        return;
      }

      var qv = target.closest('.js-quickview');
      if (qv) { openQuickView(qv.getAttribute('data-handle'), qv); return; }

      var qa = target.closest('.js-quickadd');
      if (qa) {
        var p = Catalog.get(qa.getAttribute('data-handle'));
        if (!p) return;
        if (p.variants.length > 1) { openQuickView(p.handle, qa); return; }
        var v = p.variants[0];
        qa.classList.add('is-loading');
        global.setTimeout(function () {
          qa.classList.remove('is-loading');
          Store.addToCart({
            variantId: v.id, handle: p.handle, title: p.shortTitle, variantTitle: v.title,
            price: v.price, compareAt: v.compareAt, image: v.image || p.images[0], qty: 1,
          });
          toast(t('toast.added', { name: p.shortTitle }), 'ok', t('toast.openCart'), 'cart.html');
        }, 260);
        return;
      }

      /* Cart drawer line controls */
      var line = target.closest('[data-line]');
      if (line) {
        var id = line.getAttribute('data-line');
        var input = $('[data-qty-input]', line);
        if (target.closest('[data-qty-down]')) { Store.setQty(id, parseInt(input.value, 10) - 1); return; }
        if (target.closest('[data-qty-up]')) { Store.setQty(id, parseInt(input.value, 10) + 1); return; }
        if (target.closest('[data-remove]')) { Store.removeFromCart(id); toast(t('toast.removed'), 'info'); return; }
      }

      /* Generic accordion */
      var acc = target.closest('.acc__btn, .fgroup__btn, .mobilenav__toggle');
      if (acc && acc.hasAttribute('aria-expanded')) {
        acc.setAttribute('aria-expanded', acc.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
      }
    });

    doc.addEventListener('change', function (e) {
      var line = e.target.closest('[data-line]');
      if (line && e.target.matches('[data-qty-input]')) {
        Store.setQty(line.getAttribute('data-line'), e.target.value);
      }
      if (e.target.matches('[data-currency]')) {
        Store.setCurrency(e.target.value);
        global.location.reload();
      }
      if (e.target.matches('[data-lang]')) {
        I18N.setLang(e.target.value);
      }
    });

    /* Newsletter with inline validation */
    doc.addEventListener('submit', function (e) {
      var form = e.target.closest('[data-newsletter]');
      if (!form) return;
      e.preventDefault();
      var field = $('.field', form);
      var input = $('input[type="email"]', form);
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
      field.classList.toggle('has-error', !ok);
      input.setAttribute('aria-invalid', String(!ok));
      if (!ok) { input.focus(); return; }
      var btn = $('button[type="submit"]', form);
      btn.classList.add('is-loading');
      global.setTimeout(function () {
        btn.classList.remove('is-loading');
        form.innerHTML = '<div class="row" style="gap:var(--space-4);color:var(--success)">' +
          icon('check-circle') + '<p>' + esc(t('ft.subscribed')) + '</p></div>';
      }, 520);
    });
  }

  /* ======================================================================
     TABS
     ====================================================================== */
  function initTabs(root) {
    $$('[data-tabs]', root || doc).forEach(function (group) {
      var tabs = $$('[role="tab"]', group);
      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () { select(tab); });
        tab.addEventListener('keydown', function (e) {
          var i = tabs.indexOf(tab);
          if (e.key === 'ArrowRight') { e.preventDefault(); tabs[(i + 1) % tabs.length].focus(); tabs[(i + 1) % tabs.length].click(); }
          if (e.key === 'ArrowLeft') { e.preventDefault(); tabs[(i - 1 + tabs.length) % tabs.length].focus(); tabs[(i - 1 + tabs.length) % tabs.length].click(); }
        });
      });
      function select(tab) {
        tabs.forEach(function (t) {
          var on = t === tab;
          t.setAttribute('aria-selected', String(on));
          t.setAttribute('tabindex', on ? '0' : '-1');
          var panel = doc.getElementById(t.getAttribute('aria-controls'));
          if (panel) panel.hidden = !on;
        });
      }
    });
  }

  /* ======================================================================
     SCROLL REVEAL
     ====================================================================== */
  var revealObserver = null;

  function observeReveal(root) {
    if (reduceMotion.matches || !('IntersectionObserver' in global)) {
      $$('.reveal', root || doc).forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    }
    $$('.reveal:not(.is-in)', root || doc).forEach(function (el, i) {
      if (!el.style.getPropertyValue('--reveal-delay')) {
        el.style.setProperty('--reveal-delay', Math.min(i % 8, 7) * 55 + 'ms');
      }
      revealObserver.observe(el);
    });
  }

  /* Back to top visibility, sentinel based so there is no scroll handler. */
  function initToTop() {
    var btn = $('[data-totop]');
    if (!btn || !('IntersectionObserver' in global)) return;
    var mark = doc.createElement('div');
    mark.setAttribute('aria-hidden', 'true');
    mark.style.cssText = 'position:absolute;top:900px;height:1px;width:1px';
    doc.body.appendChild(mark);
    new IntersectionObserver(function (entries) {
      btn.classList.toggle('is-on', !entries[0].isIntersecting);
    }).observe(mark);
  }

  /* ======================================================================
     BADGE COUNTS AND THEME ICON
     ====================================================================== */
  function setCount(sel, n) {
    var el = $(sel);
    if (!el) return;
    el.textContent = n > 99 ? '99+' : String(n);
    el.hidden = n === 0;
  }

  function syncCounts() {
    setCount('[data-count-cart]', Store.cartCount());
    setCount('[data-count-wish]', Store.getWishlist().length);
    setCount('[data-count-compare]', Store.getCompare().length);

    var wished = Store.getWishlist();
    $$('.js-wish').forEach(function (b) {
      var on = wished.indexOf(b.getAttribute('data-handle')) !== -1;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    var cmp = Store.getCompare();
    $$('.js-compare').forEach(function (b) {
      var on = cmp.indexOf(b.getAttribute('data-handle')) !== -1;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });
  }

  function syncThemeIcon() {
    var btn = $('[data-theme-toggle]');
    if (!btn) return;
    var isLight = doc.documentElement.getAttribute('data-theme') === 'light' ||
      (!doc.documentElement.getAttribute('data-theme') && global.matchMedia('(prefers-color-scheme: light)').matches);
    btn.innerHTML = icon(isLight ? 'sun' : 'moon-stars');
    btn.setAttribute('aria-label', isLight ? t('nav.themeToDark') : t('nav.themeToLight'));
  }

  /* ======================================================================
     BOOT
     ====================================================================== */
  function mount() {
    doc.documentElement.classList.remove('no-js');

    var headerHost = $('[data-site-header]');
    if (headerHost) headerHost.innerHTML = headerHtml();

    var footerHost = $('[data-site-footer]');
    if (footerHost) footerHost.innerHTML = footerHtml();

    var overlayHost = doc.createElement('div');
    overlayHost.innerHTML = overlaysHtml();
    while (overlayHost.firstChild) doc.body.appendChild(overlayHost.firstChild);

    /* Swap every data-i18n string in the page markup before the chrome and
       the page controllers render anything on top of it. */
    I18N.apply();

    initAnnounce();
    initHeader();
    initInlineSearch();
    initSearch();
    initGlobalEvents();
    initTabs();
    initToTop();
    observeReveal();
    syncCounts();
    syncThemeIcon();
    renderCartDrawer();

    Store.on('cart', function () { syncCounts(); renderCartDrawer(); });
    Store.on('wishlist', syncCounts);
    Store.on('compare', syncCounts);
  }

  global.UI = {
    mount: mount,
    toast: toast,
    icon: icon,
    observeReveal: observeReveal,
    initTabs: initTabs,
    syncCounts: syncCounts,
    closeAll: closeAll,
    openQuickView: openQuickView,
    renderCartDrawer: renderCartDrawer,
    $: $,
    $$: $$,
  };

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', mount);
  else mount();
})(window);
