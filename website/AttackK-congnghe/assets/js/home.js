/* ============================================================================
   HOME PAGE CONTROLLER
   Fills the sections that are driven by the catalog and runs the hero slider
   and the giveaway countdown.
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

  var reduceMotion = global.matchMedia('(prefers-reduced-motion: reduce)');

  /* ------------------------------------------------------------------
     HERO SLIDER
     Three slides, cross-faded. Motivated by hierarchy: each slide is a
     separate merchandising message and only one may hold the eye at a time.
     ------------------------------------------------------------------ */
  function initHero() {
    var hero = $('[data-hero]');
    if (!hero) return;
    var copies = $$('.hero__copy', hero);
    var stages = $$('.hero__stage', hero);
    var nums = $$('.hero__num', hero);
    if (copies.length < 2) return;

    var i = 0;
    var timer = null;

    function go(n) {
      i = (n + copies.length) % copies.length;
      copies.forEach(function (c, k) { c.classList.toggle('is-current', k === i); });
      stages.forEach(function (s, k) {
        s.classList.toggle('is-current', k === i);
        s.setAttribute('aria-hidden', String(k !== i));
      });
      nums.forEach(function (d, k) { d.setAttribute('aria-current', String(k === i)); });
    }

    function start() {
      if (reduceMotion.matches) return;
      stop();
      timer = global.setInterval(function () { go(i + 1); }, 6800);
    }
    function stop() { if (timer) global.clearInterval(timer); timer = null; }

    nums.forEach(function (d, k) {
      d.addEventListener('click', function () { go(k); start(); });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    hero.addEventListener('focusin', stop);
    start();
  }

  /* ------------------------------------------------------------------
     FRESH FINDS RAIL
     ------------------------------------------------------------------ */
  function fillFresh() {
    var rail = $('[data-fresh]');
    if (!rail) return;
    var items = Catalog.collection('new').items.slice(0, 10);
    if (items.length < 6) {
      items = Catalog.sortItems(Catalog.all, 'new').slice(0, 10);
    }
    rail.innerHTML = Catalog.cards(items);

    var prev = $('[data-fresh-prev]');
    var next = $('[data-fresh-next]');
    function step(dir) {
      var card = rail.firstElementChild;
      var w = card ? card.getBoundingClientRect().width + 16 : 280;
      rail.scrollBy({ left: dir * w * 2, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    }
    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });
  }

  /* ------------------------------------------------------------------
     SPOTLIGHT BENTO
     Three products, three cells. One lead plus two stacked, no empty tile.
     ------------------------------------------------------------------ */
  var SPOTLIGHT = [
    { handle: 'attack-shark-rs6-ultra-wireless-gaming-mouse', key: 'home.spot1' },
    { handle: 'attack-shark-v2-air-wireless-gaming-mouse', key: 'home.spot2' },
    { handle: 'attack-shark-r98-he-rapid-trigger-keyboard', key: 'home.spot3' },
  ];

  function fillBento() {
    var host = $('[data-bento]');
    if (!host) return;

    var picks = SPOTLIGHT.map(function (s) {
      var p = Catalog.get(s.handle);
      return p ? { p: p, line: t(s.key) } : null;
    }).filter(Boolean);

    /* If a handle moved in the catalog, backfill from best sellers so the grid
       still has exactly three cells and never renders a blank tile. */
    if (picks.length < 3) {
      var fill = Catalog.sortItems(Catalog.all, 'best').filter(function (p) {
        return !picks.some(function (x) { return x.p.handle === p.handle; });
      });
      while (picks.length < 3 && fill.length) {
        var p = fill.shift();
        picks.push({ p: p, line: p.summary.slice(0, 96) });
      }
    }

    host.innerHTML = picks.map(function (x, i) {
      var p = x.p;
      return '<a class="bento__cell reveal' + (i === 0 ? ' bento__cell--lead' : '') + '" href="product.html?handle=' + esc(p.handle) + '">' +
        '<img class="bento__bg" src="' + esc(p.images[0]) + '" alt="" loading="lazy" decoding="async" width="900" height="700">' +
        '<h3 class="bento__name">' + esc(p.shortTitle) + '</h3>' +
        '<p class="bento__line">' + esc(x.line) + '</p>' +
        '<span class="bento__cta">' + esc(t('g.viewDetail')) + ' ' + icon('arrow-right') + '</span>' +
      '</a>';
    }).join('');
  }

  /* ------------------------------------------------------------------
     CATEGORY TILES
     Seven categories, seven cells. Cover art is the best selling item in
     each category, so every tile carries a real product photograph.
     ------------------------------------------------------------------ */
  var CATS = [
    { slug: 'keyboard' },
    { slug: 'mouse' },
    { slug: 'he-keyboard' },
    { slug: 'headset' },
    { slug: 'mousepad' },
    { slug: 'cable' },
    { slug: 'keycaps' },
  ];

  function fillCats() {
    var host = $('[data-cats]');
    if (!host) return;
    host.innerHTML = CATS.map(function (c) {
      var col = Catalog.collection(c.slug);
      var cover = Catalog.sortItems(col.items, 'best')[0];
      if (!cover) return '';
      return '<a class="cats__tile reveal" href="collection.html?c=' + c.slug + '">' +
        '<img src="' + esc(cover.images[0]) + '" alt="" loading="lazy" decoding="async" width="800" height="600">' +
        '<span class="cats__label">' + esc(t('lbl.' + c.slug)) +
          '<span class="cats__count">' + esc(t('home.cats.count', { n: col.items.length })) + '</span>' +
        '</span></a>';
    }).join('');
  }

  /* ------------------------------------------------------------------
     BEST SELLERS WITH CATEGORY TABS
     ------------------------------------------------------------------ */
  var TABS = [
    { id: 'all', label: 'home.best.all', slug: 'best-selling' },
    { id: 'mouse', label: 'home.best.mice', slug: 'mouse' },
    { id: 'kb', label: 'home.best.kb', slug: 'keyboard' },
    { id: 'he', label: 'home.best.he', slug: 'he-keyboard' },
    { id: 'acc', label: 'home.best.acc', slug: 'accessories' },
  ];

  function fillBest() {
    var tablist = $('[data-best-tabs]');
    var panels = $('[data-best-panels]');
    if (!tablist || !panels) return;

    tablist.innerHTML = TABS.map(function (tab, i) {
      return '<button type="button" class="tab" role="tab" id="bt-' + tab.id + '" ' +
        'aria-controls="bp-' + tab.id + '" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? '0' : '-1') + '">' +
        esc(t(tab.label)) + '</button>';
    }).join('');

    panels.innerHTML = TABS.map(function (tab, i) {
      var items = Catalog.sortItems(Catalog.collection(tab.slug).items, 'best').slice(0, 8);
      return '<div class="tabpanel" role="tabpanel" id="bp-' + tab.id + '" aria-labelledby="bt-' + tab.id + '"' + (i === 0 ? '' : ' hidden') + '>' +
        '<div class="grid-products grid-products--4">' + Catalog.cards(items) + '</div></div>';
    }).join('');

    UI.initTabs(panels.parentNode);
    UI.observeReveal(panels);
    UI.syncCounts();
  }

  /* ------------------------------------------------------------------
     GIVEAWAY COUNTDOWN
     Real semantic state, so it is allowed to tick. Ends at the next Sunday
     23:59 local time so the demo never shows an expired event.
     ------------------------------------------------------------------ */
  function initCountdown() {
    var host = $('[data-countdown]');
    if (!host) return;

    var end = new Date();
    end.setDate(end.getDate() + ((7 - end.getDay()) % 7 || 7));
    end.setHours(23, 59, 59, 0);

    var units = [
      { key: 'd', label: 'home.draw.days' },
      { key: 'h', label: 'home.draw.hours' },
      { key: 'm', label: 'home.draw.mins' },
      { key: 's', label: 'home.draw.secs' },
    ];

    host.innerHTML = units.map(function (u) {
      return '<div class="countdown__unit"><span class="countdown__num" data-cd="' + u.key + '">00</span>' +
        '<span class="countdown__lbl">' + esc(t(u.label)) + '</span></div>';
    }).join('');

    function pad(n) { return String(n).padStart(2, '0'); }

    function tick() {
      var diff = Math.max(0, end - new Date());
      var s = Math.floor(diff / 1000);
      var d = Math.floor(s / 86400);
      var h = Math.floor((s % 86400) / 3600);
      var m = Math.floor((s % 3600) / 60);
      var sec = s % 60;
      $('[data-cd="d"]', host).textContent = pad(d);
      $('[data-cd="h"]', host).textContent = pad(h);
      $('[data-cd="m"]', host).textContent = pad(m);
      $('[data-cd="s"]', host).textContent = pad(sec);
    }

    tick();
    var id = global.setInterval(tick, 1000);
    global.addEventListener('pagehide', function () { global.clearInterval(id); });
  }

  /* ------------------------------------------------------------------
     EDITORIAL TEASERS
     ------------------------------------------------------------------ */
  function fillEditorial() {
    var leadHost = $('[data-post-lead]');
    var listHost = $('[data-post-list]');
    if (!leadHost || !listHost) return;

    var posts = Catalog.posts();
    var lead = posts[0];
    var rest = posts.slice(1, 5);

    leadHost.innerHTML = '<a class="post-lead reveal" href="article.html?slug=' + esc(lead.slug) + '">' +
      '<span class="post-lead__media"><img src="' + esc(lead.cover) + '" alt="" loading="lazy" decoding="async" width="900" height="560"></span>' +
      '<span class="post-meta"><span>' + esc(t('bl.topic.' + lead.topic)) + '</span><span>' + esc(lead.date) + '</span><span>' + esc(t('g.minutes', { n: lead.minutes })) + '</span></span>' +
      '<span class="post-lead__title">' + esc(Catalog.postTitle(lead)) + '</span>' +
      '<span class="muted">' + esc(Catalog.postExcerpt(lead)) + '</span>' +
    '</a>';

    listHost.innerHTML = rest.map(function (p) {
      return '<a class="post-row reveal" href="article.html?slug=' + esc(p.slug) + '">' +
        '<span class="post-row__media"><img src="' + esc(p.cover) + '" alt="" loading="lazy" decoding="async" width="112" height="112"></span>' +
        '<span class="stack stack-3">' +
          '<span class="post-meta"><span>' + esc(t('bl.topic.' + p.topic)) + '</span><span>' + esc(t('g.minutes', { n: p.minutes })) + '</span></span>' +
          '<span class="post-row__title">' + esc(Catalog.postTitle(p)) + '</span>' +
        '</span></a>';
    }).join('');
  }

  /* ------------------------------------------------------------------
     BOOT
     ------------------------------------------------------------------ */
  function boot() {
    initHero();
    fillFresh();
    fillBento();
    fillCats();
    fillBest();
    initCountdown();
    fillEditorial();
    UI.observeReveal();
    UI.syncCounts();
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);
