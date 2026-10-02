/* ============================================================================
   WISHLIST CONTROLLER
   Saved products with bulk actions: move everything in stock to the cart, or
   clear the list. Out of stock items stay visible rather than disappearing.
   ========================================================================= */
(function (global) {
  'use strict';

  var doc = global.document;
  var Catalog = global.Catalog;
  var Store = global.Store;
  var UI = global.UI;
  var $ = UI.$;
  var icon = UI.icon;
  var t = global.I18N.t;
  var esc = Catalog.esc;

  function render() {
    var items = Store.getWishlist().map(Catalog.get).filter(Boolean);
    var inStock = items.filter(function (p) { return p.available; });

    $('[data-wish-actions]').hidden = items.length === 0;
    var saved = $('[data-wish-saved]');
    if (saved) saved.textContent = t('wl.saved', { n: items.length });
    $('[data-wish-addall]').textContent = t('wl.addAll', { n: inStock.length });
    $('[data-wish-addall]').disabled = inStock.length === 0;

    if (!items.length) {
      $('[data-wish-grid]').innerHTML = '';
      $('[data-wish-empty]').hidden = false;
      renderSuggest();
      return;
    }

    $('[data-wish-empty]').hidden = true;
    $('[data-wish-grid]').innerHTML = Catalog.cards(items);
    UI.observeReveal($('[data-wish-grid]'));
    UI.syncCounts();
    renderSuggest();
  }

  function renderSuggest() {
    var host = $('[data-wish-suggest]');
    if (!host) return;
    var saved = Store.getWishlist();
    var pool = saved.length
      ? Catalog.related(saved[0], 10)
      : Catalog.sortItems(Catalog.all, 'best');
    var items = pool.filter(function (p) { return saved.indexOf(p.handle) === -1; }).slice(0, 4);
    host.innerHTML = Catalog.cards(items, { noQuickAdd: true });
    UI.observeReveal(host);
    UI.syncCounts();
  }

  function bind() {
    doc.addEventListener('click', function (e) {
      if (e.target.closest('[data-wish-addall]')) {
        var added = 0;
        Store.getWishlist().map(Catalog.get).filter(Boolean).forEach(function (p) {
          if (!p.available) return;
          var v = p.variants.filter(function (x) { return x.available; })[0];
          if (!v) return;
          Store.addToCart({
            variantId: v.id, handle: p.handle, title: p.shortTitle, variantTitle: v.title,
            price: v.price, compareAt: v.compareAt, image: v.image || p.images[0], qty: 1,
          });
          added += 1;
        });
        UI.toast(added ? t('toast.addedN', { n: added }) : t('wl.noneInStock'),
          added ? 'ok' : 'info', added ? t('toast.openCart') : null, 'cart.html');
        return;
      }
      if (e.target.closest('[data-wish-clear]')) {
        Store.getWishlist().forEach(Store.removeWishlist);
        UI.toast(t('wl.cleared'), 'info');
      }
    });
    Store.on('wishlist', render);
  }

  function boot() { render(); bind(); UI.observeReveal(); }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);
