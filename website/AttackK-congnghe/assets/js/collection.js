/* ============================================================================
   COLLECTION PAGE CONTROLLER
   Facet filtering, sorting, grid and list views, pagination and a mobile
   filter drawer. All state lives in the query string so a filtered view can be
   shared or bookmarked and the back button behaves.
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

  var PER_PAGE = 12;

  /* Facet key to query-parameter name, and the label shown on a filter chip. */
  var FACET_DEFS = [
    { key: 'category', param: 'cat', label: 'f.category' },
    { key: 'connection', param: 'connection', label: 'f.connection' },
    { key: 'sensor', param: 'sensor', label: 'f.sensor' },
    { key: 'polling', param: 'polling', label: 'f.polling' },
    { key: 'switchType', param: 'switch', label: 'f.switch' },
    { key: 'weight', param: 'weight', label: 'f.weight' },
  ];

  var state = {
    slug: 'shop-all',
    sort: 'featured',
    view: 'grid',
    page: 1,
    filters: {},
  };

  /* ------------------------------------------------------------------
     URL <-> STATE
     ------------------------------------------------------------------ */
  function readUrl() {
    var q = new URLSearchParams(global.location.search);
    state.slug = q.get('c') || 'shop-all';
    state.sort = q.get('sort') || 'featured';
    state.view = q.get('view') === 'list' ? 'list' : 'grid';
    state.page = Math.max(1, parseInt(q.get('page'), 10) || 1);

    var f = {};
    FACET_DEFS.forEach(function (d) {
      var v = q.getAll(d.param);
      if (v.length) f[d.key] = v.join(',').split(',').filter(Boolean);
    });
    if (q.get('stock') === '1') f.inStock = true;
    if (q.get('sale') === '1') f.onSale = true;
    if (q.get('pmin')) f.priceMin = parseFloat(q.get('pmin'));
    if (q.get('pmax')) f.priceMax = parseFloat(q.get('pmax'));
    state.filters = f;
  }

  function writeUrl(replace) {
    var q = new URLSearchParams();
    q.set('c', state.slug);
    if (state.sort !== 'featured') q.set('sort', state.sort);
    if (state.view !== 'grid') q.set('view', state.view);
    if (state.page > 1) q.set('page', String(state.page));

    FACET_DEFS.forEach(function (d) {
      var v = state.filters[d.key];
      if (v && v.length) q.set(d.param, v.join(','));
    });
    if (state.filters.inStock) q.set('stock', '1');
    if (state.filters.onSale) q.set('sale', '1');
    if (state.filters.priceMin != null) q.set('pmin', String(state.filters.priceMin));
    if (state.filters.priceMax != null) q.set('pmax', String(state.filters.priceMax));

    var url = global.location.pathname + '?' + q.toString();
    if (replace) global.history.replaceState(null, '', url);
    else global.history.pushState(null, '', url);
  }

  /* ------------------------------------------------------------------
     FILTER PANEL
     Counts come from the collection before filtering, so a shopper can always
     see how many items sit behind each option.
     ------------------------------------------------------------------ */
  function facetGroupHtml(def, buckets, openByDefault) {
    var keys = Object.keys(buckets);
    if (!keys.length) return '';
    keys.sort(function (a, b) {
      var na = parseFloat(a);
      var nb = parseFloat(b);
      if (!isNaN(na) && !isNaN(nb)) return na - nb;
      return a.localeCompare(b);
    });
    var picked = state.filters[def.key] || [];

    return '<div class="fgroup">' +
      '<button type="button" class="fgroup__btn" aria-expanded="' + (openByDefault ? 'true' : 'false') + '" aria-controls="fg-' + def.key + '">' +
        esc(t(def.label)) + icon('plus') +
      '</button>' +
      '<div class="fgroup__panel" id="fg-' + def.key + '"><div><div class="fgroup__list">' +
        keys.map(function (k) {
          var on = picked.indexOf(k) !== -1;
          return '<label class="check"><input type="checkbox" data-facet="' + def.key + '" value="' + esc(k) + '"' + (on ? ' checked' : '') + '>' +
            '<span>' + esc(Catalog.facetLabel(k)) + '</span><span class="check__count">' + buckets[k] + '</span></label>';
        }).join('') +
      '</div></div></div></div>';
  }

  function renderFilters(baseItems) {
    var facets = Catalog.buildFacets(baseItems);
    var html = '';

    html += '<div class="fgroup">' +
      '<button type="button" class="fgroup__btn" aria-expanded="true" aria-controls="fg-avail">' + esc(t('f.availability')) + icon('plus') + '</button>' +
      '<div class="fgroup__panel" id="fg-avail"><div><div class="fgroup__list">' +
        '<label class="check"><input type="checkbox" data-flag="inStock"' + (state.filters.inStock ? ' checked' : '') + '>' +
          '<span>' + esc(t('f.inStockOnly')) + '</span><span class="check__count">' + facets.availability['Con hang'] + '</span></label>' +
        '<label class="check"><input type="checkbox" data-flag="onSale"' + (state.filters.onSale ? ' checked' : '') + '>' +
          '<span>' + esc(t('f.onSale')) + '</span><span class="check__count">' + baseItems.filter(function (p) { return p.onSale; }).length + '</span></label>' +
      '</div></div></div></div>';

    html += '<div class="fgroup">' +
      '<button type="button" class="fgroup__btn" aria-expanded="true" aria-controls="fg-price">' + esc(t('f.price')) + icon('plus') + '</button>' +
      '<div class="fgroup__panel" id="fg-price"><div>' +
        '<div class="pricerange">' +
          '<label class="visually-hidden" for="pmin">' + esc(t('f.priceMin')) + '</label>' +
          '<input class="input" id="pmin" type="number" inputmode="numeric" min="0" placeholder="' + facets.price.min + '" value="' + (state.filters.priceMin != null ? state.filters.priceMin : '') + '" data-price="min">' +
          '<span class="dim">' + esc(t('f.to')) + '</span>' +
          '<label class="visually-hidden" for="pmax">' + esc(t('f.priceMax')) + '</label>' +
          '<input class="input" id="pmax" type="number" inputmode="numeric" min="0" placeholder="' + facets.price.max + '" value="' + (state.filters.priceMax != null ? state.filters.priceMax : '') + '" data-price="max">' +
          '<button type="button" class="btn btn--secondary btn--sm" data-price-apply>OK</button>' +
        '</div>' +
      '</div></div></div>';

    FACET_DEFS.forEach(function (d, i) {
      html += facetGroupHtml(d, facets[d.key], i < 2);
    });

    var panel = $('[data-filters]');
    if (panel) panel.innerHTML = html;
    var mobilePanel = $('[data-filters-mobile]');
    if (mobilePanel) mobilePanel.innerHTML = html;
  }

  /* ------------------------------------------------------------------
     ACTIVE FILTER CHIPS
     ------------------------------------------------------------------ */
  function renderChips() {
    var host = $('[data-activefilters]');
    if (!host) return;
    var chips = [];

    FACET_DEFS.forEach(function (d) {
      (state.filters[d.key] || []).forEach(function (v) {
        chips.push({ label: Catalog.facetLabel(v), key: d.key, value: v });
      });
    });
    if (state.filters.inStock) chips.push({ label: t('g.inStock'), flag: 'inStock' });
    if (state.filters.onSale) chips.push({ label: t('f.onSale'), flag: 'onSale' });
    if (state.filters.priceMin != null || state.filters.priceMax != null) {
      chips.push({
        label: t('f.priceChip', {
          min: state.filters.priceMin != null ? Store.money(state.filters.priceMin) : '0',
          max: state.filters.priceMax != null ? Store.money(state.filters.priceMax) : t('f.noLimit'),
        }),
        price: true,
      });
    }

    if (!chips.length) { host.innerHTML = ''; return; }

    host.innerHTML = chips.map(function (c) {
      var attrs = c.flag ? 'data-chip-flag="' + c.flag + '"'
        : c.price ? 'data-chip-price="1"'
        : 'data-chip-key="' + c.key + '" data-chip-value="' + esc(c.value) + '"';
      return '<button type="button" class="chip is-active" ' + attrs + ' aria-label="' + esc(t('f.clearOne', { name: c.label })) + '">' +
        esc(c.label) + '<span class="chip__x">' + icon('x') + '</span></button>';
    }).join('') +
    '<button type="button" class="chip" data-chip-clear>' + esc(t('f.clearAll')) + '</button>';
  }

  /* ------------------------------------------------------------------
     RESULTS
     ------------------------------------------------------------------ */
  function renderResults() {
    var grid = $('[data-grid]');
    if (!grid) return;

    var col = Catalog.collection(state.slug);
    var filtered = Catalog.applyFilters(col.items, state.filters);
    var sorted = state.sort === 'featured' && col.def.sort === 'best'
      ? Catalog.sortItems(filtered, 'best')
      : Catalog.sortItems(filtered, state.sort);

    var total = sorted.length;
    var pages = Math.max(1, Math.ceil(total / PER_PAGE));
    if (state.page > pages) state.page = pages;
    var slice = sorted.slice(0, state.page * PER_PAGE);

    $('[data-resultcount]').textContent = total === 0
      ? t('coll.none')
      : t('coll.showing', { shown: slice.length, total: total });

    grid.classList.toggle('is-list', state.view === 'list');

    if (!total) {
      grid.classList.remove('is-list');
      grid.innerHTML = '<div class="empty" style="grid-column:1/-1">' +
        '<span class="empty__icon">' + icon('funnel-x') + '</span>' +
        '<h3 class="empty__title">' + esc(t('coll.empty.title')) + '</h3>' +
        '<p class="empty__text">' + esc(t('coll.empty.text')) + '</p>' +
        '<div class="row"><button type="button" class="btn btn--primary" data-chip-clear>' + esc(t('coll.empty.clear')) + '</button>' +
        '<a class="btn btn--secondary" href="collection.html?c=shop-all">' + esc(t('coll.empty.all')) + '</a></div>' +
      '</div>';
      $('[data-loadmore-wrap]').hidden = true;
      $('[data-pager]').innerHTML = '';
      return;
    }

    grid.innerHTML = Catalog.cards(slice);
    UI.observeReveal(grid);
    UI.syncCounts();

    var more = $('[data-loadmore-wrap]');
    more.hidden = slice.length >= total;
    $('[data-loadmore]').textContent = t('coll.loadMore', { n: Math.min(PER_PAGE, total - slice.length) });

    renderPager(pages);
  }

  function renderPager(pages) {
    var host = $('[data-pager]');
    if (!host) return;
    if (pages < 2) { host.innerHTML = ''; return; }

    var cur = state.page;
    var nums = [];
    for (var i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || Math.abs(i - cur) <= 1) nums.push(i);
      else if (nums[nums.length - 1] !== '...') nums.push('...');
    }

    host.innerHTML =
      '<button type="button" class="pager__btn" data-page="' + (cur - 1) + '"' + (cur === 1 ? ' disabled' : '') + ' aria-label="' + esc(t('g.prevPage')) + '">' + icon('caret-left') + '</button>' +
      nums.map(function (n) {
        if (n === '...') return '<span class="pager__gap">...</span>';
        return '<button type="button" class="pager__btn" data-page="' + n + '"' + (n === cur ? ' aria-current="page"' : '') + '>' + n + '</button>';
      }).join('') +
      '<button type="button" class="pager__btn" data-page="' + (cur + 1) + '"' + (cur === pages ? ' disabled' : '') + ' aria-label="' + esc(t('g.nextPage')) + '">' + icon('caret-right') + '</button>';
  }

  /* ------------------------------------------------------------------
     HEAD
     ------------------------------------------------------------------ */
  function renderHead() {
    var col = Catalog.collection(state.slug);
    doc.title = col.title + ' | ' + global.BRAND.name;
    $('[data-col-title]').textContent = col.title;
    $('[data-col-blurb]').textContent = col.blurb;
    $('[data-col-crumb]').textContent = col.title;

    var cover = Catalog.sortItems(col.items, 'best')[0];
    var img = $('[data-col-cover]');
    if (img && cover) {
      img.src = cover.images[0];
      img.alt = '';
    }
  }

  /* ------------------------------------------------------------------
     EVENTS
     ------------------------------------------------------------------ */
  function refresh(pushUrl) {
    writeUrl(!pushUrl);
    renderResults();
    renderChips();
  }

  function toggleFacet(key, value, on) {
    var list = state.filters[key] || [];
    var i = list.indexOf(value);
    if (on && i === -1) list.push(value);
    if (!on && i !== -1) list.splice(i, 1);
    if (list.length) state.filters[key] = list;
    else delete state.filters[key];
    state.page = 1;
  }

  function bind() {
    doc.addEventListener('change', function (e) {
      var facet = e.target.closest('[data-facet]');
      if (facet) {
        toggleFacet(facet.getAttribute('data-facet'), facet.value, facet.checked);
        /* Mirror the change into the other copy of the panel. */
        $$('[data-facet="' + facet.getAttribute('data-facet') + '"][value="' + facet.value.replace(/"/g, '\\"') + '"]')
          .forEach(function (el) { el.checked = facet.checked; });
        refresh();
        return;
      }
      var flag = e.target.closest('[data-flag]');
      if (flag) {
        var name = flag.getAttribute('data-flag');
        if (flag.checked) state.filters[name] = true;
        else delete state.filters[name];
        state.page = 1;
        $$('[data-flag="' + name + '"]').forEach(function (el) { el.checked = flag.checked; });
        refresh();
        return;
      }
      if (e.target.matches('[data-sort]')) {
        state.sort = e.target.value;
        state.page = 1;
        $$('[data-sort]').forEach(function (el) { el.value = state.sort; });
        refresh();
      }
    });

    doc.addEventListener('click', function (e) {
      var apply = e.target.closest('[data-price-apply]');
      if (apply) {
        var root = apply.closest('.pricerange');
        var min = $('[data-price="min"]', root).value;
        var max = $('[data-price="max"]', root).value;
        if (min !== '') state.filters.priceMin = parseFloat(min); else delete state.filters.priceMin;
        if (max !== '') state.filters.priceMax = parseFloat(max); else delete state.filters.priceMax;
        state.page = 1;
        refresh();
        return;
      }

      var chip = e.target.closest('[data-chip-key]');
      if (chip) {
        toggleFacet(chip.getAttribute('data-chip-key'), chip.getAttribute('data-chip-value'), false);
        renderFilters(Catalog.collection(state.slug).items);
        refresh();
        return;
      }

      var chipFlag = e.target.closest('[data-chip-flag]');
      if (chipFlag) {
        delete state.filters[chipFlag.getAttribute('data-chip-flag')];
        state.page = 1;
        renderFilters(Catalog.collection(state.slug).items);
        refresh();
        return;
      }

      if (e.target.closest('[data-chip-price]')) {
        delete state.filters.priceMin;
        delete state.filters.priceMax;
        state.page = 1;
        renderFilters(Catalog.collection(state.slug).items);
        refresh();
        return;
      }

      if (e.target.closest('[data-chip-clear]')) {
        state.filters = {};
        state.page = 1;
        renderFilters(Catalog.collection(state.slug).items);
        refresh();
        return;
      }

      var view = e.target.closest('[data-view]');
      if (view) {
        state.view = view.getAttribute('data-view');
        $$('[data-view]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === view)); });
        refresh();
        return;
      }

      if (e.target.closest('[data-loadmore]')) {
        state.page += 1;
        refresh();
        return;
      }

      var pageBtn = e.target.closest('[data-page]');
      if (pageBtn) {
        state.page = parseInt(pageBtn.getAttribute('data-page'), 10);
        refresh();
        $('[data-grid]').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    global.addEventListener('popstate', function () {
      readUrl();
      renderHead();
      renderFilters(Catalog.collection(state.slug).items);
      renderResults();
      renderChips();
      syncControls();
    });
  }

  function syncControls() {
    $$('[data-sort]').forEach(function (el) { el.value = state.sort; });
    $$('[data-view]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-view') === state.view));
    });
  }

  function fillSort() {
    var opts = Object.keys(Catalog.sorts).map(function (k) {
      return '<option value="' + k + '">' + esc(t(Catalog.sorts[k].label)) + '</option>';
    }).join('');
    $$('[data-sort]').forEach(function (sel) { sel.innerHTML = opts; });
  }

  function fillViewed() {
    var host = $('[data-viewed]');
    if (!host) return;
    var items = Store.getViewed().map(Catalog.get).filter(Boolean).slice(0, 6);
    if (items.length < 3) {
      host.closest('section').hidden = true;
      return;
    }
    $('[data-viewed-rail]').innerHTML = Catalog.cards(items, { noQuickAdd: true });
    UI.observeReveal(host);
    UI.syncCounts();
  }

  function boot() {
    readUrl();
    fillSort();
    renderHead();
    renderFilters(Catalog.collection(state.slug).items);
    syncControls();
    renderResults();
    renderChips();
    fillViewed();
    bind();
    writeUrl(true);
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);
