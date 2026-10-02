/* ============================================================================
   COMPARE CONTROLLER
   Side by side specification table for up to four products. The best value in
   each numeric row is marked so the table answers a question rather than just
   listing numbers.
   ========================================================================= */
(function (global) {
  'use strict';

  var doc = global.document;
  var Catalog = global.Catalog;
  var Store = global.Store;
  var UI = global.UI;
  var $ = UI.$;
  var esc = Catalog.esc;
  var t = global.I18N.t;
  var icon = UI.icon;

  /* direction: 'high' means a bigger number wins, 'low' means smaller wins,
     null means the row is not comparable. */
  var ROWS = [
    { label: 'cmp.row.price', get: function (p) { return Store.money(p.minPrice); }, num: function (p) { return p.minPrice; }, dir: 'low' },
    { label: 'cmp.row.category', get: function (p) { return Catalog.categoryLabel(p); } },
    { label: 'cmp.row.weight', get: function (p) { return p.facets.weight ? p.facets.weight + 'g' : t('pdp.spec.undisclosed'); }, num: function (p) { return p.facets.weight; }, dir: 'low' },
    { label: 'cmp.row.sensor', get: function (p) { return p.facets.sensor || t('pdp.spec.na'); } },
    { label: 'cmp.row.dpi', get: function (p) { return p.facets.dpi ? p.facets.dpi.toLocaleString(global.I18N.locale()) : t('pdp.spec.na'); }, num: function (p) { return p.facets.dpi; }, dir: 'high' },
    { label: 'cmp.row.polling', get: function (p) { return p.facets.polling ? p.facets.polling + 'Hz' : t('pdp.spec.undisclosed'); }, num: function (p) { return p.facets.polling; }, dir: 'high' },
    { label: 'cmp.row.switch', get: function (p) { return p.facets.switchType ? Catalog.facetLabel(p.facets.switchType) : t('pdp.spec.na'); } },
    { label: 'cmp.row.connection', get: function (p) { return p.facets.connection.map(Catalog.facetLabel).join(', '); } },
    { label: 'cmp.row.rating', get: function (p) { return t('cmp.ratingVal', { n: p.rating.toFixed(1) }); }, num: function (p) { return p.rating; }, dir: 'high' },
    { label: 'cmp.row.reviews', get: function (p) { return String(p.reviewCount); }, num: function (p) { return p.reviewCount; }, dir: 'high' },
    { label: 'cmp.row.stock', get: function (p) { return p.available ? t('g.inStock') : t('g.soldOut'); } },
    { label: 'cmp.row.variants', get: function (p) { return String(p.variants.length); }, num: function (p) { return p.variants.length; }, dir: 'high' },
  ];

  function render() {
    var handles = Store.getCompare();
    var items = handles.map(Catalog.get).filter(Boolean);

    $('[data-compare-count]').textContent = t('cmp.count', { n: items.length, max: Store.compareMax });

    if (items.length < 2) {
      $('[data-compare-table]').hidden = true;
      $('[data-compare-empty]').hidden = false;
      $('[data-compare-empty]').innerHTML = '<div class="empty">' +
        '<span class="empty__icon">' + icon('scales') + '</span>' +
        '<h2 class="empty__title">' + esc(t('cmp.need2.title')) + '</h2>' +
        '<p class="empty__text">' + esc(items.length === 1 ? t('cmp.need2.one') : t('cmp.need2.none')) + '</p>' +
        '<div class="row"><a class="btn btn--primary" href="collection.html?c=mouse">' + esc(t('cmp.browseMice')) + '</a>' +
        '<a class="btn btn--secondary" href="collection.html?c=he-keyboard">' + esc(t('cmp.browseHe')) + '</a></div></div>';
      renderSuggest();
      return;
    }

    $('[data-compare-table]').hidden = false;
    $('[data-compare-empty]').hidden = true;

    var head = '<tr><th scope="col"><span class="visually-hidden">' + esc(t('cmp.attribute')) + '</span></th>' +
      items.map(function (p) {
        return '<th scope="col"><div class="comparecell">' +
          '<a class="comparecell__media" href="product.html?handle=' + esc(p.handle) + '">' +
            '<img src="' + esc(p.images[0]) + '" alt="" loading="lazy" width="240" height="240"></a>' +
          '<a class="comparecell__name" href="product.html?handle=' + esc(p.handle) + '">' + esc(p.shortTitle) + '</a>' +
          '<div class="row" style="gap:var(--space-3)">' +
            '<button type="button" class="btn btn--primary btn--sm js-quickadd" data-handle="' + esc(p.handle) + '">' + esc(t('g.addToCart')) + '</button>' +
            '<button type="button" class="icon-btn icon-btn--sm icon-btn--bordered" data-drop="' + esc(p.handle) + '" aria-label="' + esc(t('cmp.drop', { name: p.shortTitle })) + '">' + icon('x') + '</button>' +
          '</div>' +
        '</div></th>';
      }).join('') + '</tr>';

    var body = ROWS.map(function (row) {
      var best = null;
      if (row.num && row.dir) {
        var vals = items.map(row.num).filter(function (v) { return typeof v === 'number' && !isNaN(v); });
        if (vals.length > 1) best = row.dir === 'high' ? Math.max.apply(null, vals) : Math.min.apply(null, vals);
      }
      return '<tr><th scope="row">' + esc(t(row.label)) + '</th>' +
        items.map(function (p) {
          var isBest = best !== null && row.num(p) === best;
          return '<td class="' + (isBest ? 'is-best' : '') + '">' + esc(row.get(p)) +
            (isBest ? ' ' + icon('star') : '') + '</td>';
        }).join('') + '</tr>';
    }).join('');

    $('[data-compare-table]').innerHTML =
      '<table class="comparetable"><thead>' + head + '</thead><tbody>' + body + '</tbody></table>';

    renderSuggest();
  }

  function renderSuggest() {
    var host = $('[data-compare-suggest]');
    if (!host) return;
    var picked = Store.getCompare();
    var items = picked.length
      ? Catalog.related(picked[0], 8).filter(function (p) { return picked.indexOf(p.handle) === -1; }).slice(0, 4)
      : Catalog.sortItems(Catalog.all, 'best').slice(0, 4);
    host.innerHTML = Catalog.cards(items, { noQuickAdd: true });
    UI.observeReveal(host);
    UI.syncCounts();
  }

  function bind() {
    doc.addEventListener('click', function (e) {
      var drop = e.target.closest('[data-drop]');
      if (drop) { Store.toggleCompare(drop.getAttribute('data-drop')); return; }
      if (e.target.closest('[data-compare-clear]')) {
        Store.clearCompare();
        UI.toast(t('cmp.cleared'), 'info');
      }
    });
    Store.on('compare', render);
  }

  function boot() { render(); bind(); UI.observeReveal(); }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);
