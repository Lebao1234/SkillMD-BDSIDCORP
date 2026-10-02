/* ============================================================================
   SEARCH RESULTS CONTROLLER
   Full page results with sorting, a category breakdown and a useful empty
   state that suggests the nearest matches instead of a dead end.
   ========================================================================= */
(function (global) {
  'use strict';

  var doc = global.document;
  var Catalog = global.Catalog;
  var UI = global.UI;
  var $ = UI.$;
  var $$ = UI.$$;
  var esc = Catalog.esc;
  var t = global.I18N.t;
  var icon = UI.icon;

  var query = '';
  var sort = 'featured';
  var group = 'all';
  var hits = [];

  function run() {
    hits = Catalog.search(query, 200);
    renderGroups();
    renderResults();
  }

  function renderGroups() {
    var counts = { all: hits.length };
    hits.forEach(function (p) { counts[p.category] = (counts[p.category] || 0) + 1; });

    var labels = { all: t('search.all') };
    hits.forEach(function (p) { labels[p.category] = Catalog.categoryLabel(p); });

    var keys = Object.keys(counts).sort(function (a, b) {
      if (a === 'all') return -1;
      if (b === 'all') return 1;
      return counts[b] - counts[a];
    });

    $('[data-search-groups]').innerHTML = keys.map(function (k) {
      return '<button type="button" class="chip' + (group === k ? ' is-active' : '') + '" data-group="' + esc(k) + '">' +
        esc(labels[k]) + ' <span class="mono dim">' + counts[k] + '</span></button>';
    }).join('');
  }

  function renderResults() {
    var list = group === 'all' ? hits : hits.filter(function (p) { return p.category === group; });
    list = Catalog.sortItems(list, sort);

    $('[data-search-count]').textContent = list.length
      ? t('search.resultsFor', { n: list.length, q: query })
      : t('search.zeroFor', { q: query });

    var grid = $('[data-search-grid]');

    if (!list.length) {
      grid.innerHTML = '';
      var fallback = Catalog.sortItems(Catalog.all, 'best').slice(0, 4);
      $('[data-search-empty]').hidden = false;
      $('[data-search-fallback]').innerHTML = Catalog.cards(fallback);
      UI.observeReveal($('[data-search-fallback]'));
      UI.syncCounts();
      return;
    }

    $('[data-search-empty]').hidden = true;
    grid.innerHTML = Catalog.cards(list);
    UI.observeReveal(grid);
    UI.syncCounts();
  }

  function bind() {
    doc.addEventListener('click', function (e) {
      var g = e.target.closest('[data-group]');
      if (g) {
        group = g.getAttribute('data-group');
        renderGroups();
        renderResults();
      }
    });

    doc.addEventListener('change', function (e) {
      if (e.target.matches('[data-search-sort]')) {
        sort = e.target.value;
        renderResults();
      }
    });

    var form = $('[data-search-form]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = $('[data-search-q]').value.trim();
      if (v.length < 2) {
        UI.toast(t('toast.searchShort'), 'bad');
        return;
      }
      query = v;
      group = 'all';
      global.history.replaceState(null, '', 'search.html?q=' + encodeURIComponent(v));
      $('[data-search-term]').textContent = v;
      doc.title = t('sp.h1') + ' ' + v + ' | ' + global.BRAND.name;
      run();
    });
  }

  function boot() {
    query = (new URLSearchParams(global.location.search).get('q') || '').trim();
    $('[data-search-q]').value = query;
    $('[data-search-term]').textContent = query || t('sp.allProducts');
    if (query) doc.title = t('sp.h1') + ' ' + query + ' | ' + global.BRAND.name;

    $('[data-search-sort]').innerHTML = Object.keys(Catalog.sorts).map(function (k) {
      return '<option value="' + k + '">' + esc(t(Catalog.sorts[k].label)) + '</option>';
    }).join('');

    if (query.length >= 2) run();
    else {
      $('[data-search-count]').textContent = t('search.typeToStart');
      $('[data-search-grid]').innerHTML = Catalog.cards(Catalog.sortItems(Catalog.all, 'best').slice(0, 8));
      UI.observeReveal();
      UI.syncCounts();
    }

    bind();
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);
