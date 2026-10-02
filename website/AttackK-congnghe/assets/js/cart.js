/* ============================================================================
   CART PAGE CONTROLLER
   Full line editing, coupon handling, free shipping meter, order note, cross
   sell and an empty state that offers a way forward.
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

  function renderLines() {
    var host = $('[data-cart-lines]');
    var cart = Store.getCart();

    $('[data-cart-count]').textContent = Store.cartCount();
    var head = $('[data-cart-head]');
    if (head) head.textContent = t('cart.itemsWaiting', { n: Store.cartCount() });

    if (!cart.length) {
      $('[data-cart-grid]').hidden = true;
      $('[data-cart-empty]').hidden = false;
      return;
    }

    $('[data-cart-grid]').hidden = false;
    $('[data-cart-empty]').hidden = true;

    host.innerHTML = cart.map(function (l) {
      var onSale = l.compareAt && l.compareAt > l.price;
      return '<div class="cartrow" data-line="' + esc(l.variantId) + '">' +
        '<a class="cartrow__media" href="product.html?handle=' + esc(l.handle) + '">' +
          '<img src="' + esc(l.image) + '" alt="" loading="lazy" width="110" height="110"></a>' +
        '<div class="cartrow__body">' +
          '<a class="litem__title" href="product.html?handle=' + esc(l.handle) + '">' + esc(l.title) + '</a>' +
          (l.variantTitle && l.variantTitle !== 'Default Title'
            ? '<p class="litem__meta">' + esc(t('cart.variant', { name: l.variantTitle })) + '</p>' : '') +
          '<p class="litem__meta">' + esc(t('cart.unitPrice')) + ': ' + Store.money(l.price) +
            (onSale ? ' <s class="dim">' + Store.money(l.compareAt) + '</s>' : '') + '</p>' +
          '<div class="qty qty--sm">' +
            '<button type="button" class="qty__btn" data-qty-down aria-label="' + esc(t('g.decrease')) + '">' + icon('minus') + '</button>' +
            '<input class="qty__input" type="number" value="' + l.qty + '" min="1" max="99" aria-label="' + esc(t('cart.qtyFor', { name: l.title })) + '" data-qty-input>' +
            '<button type="button" class="qty__btn" data-qty-up aria-label="' + esc(t('g.increase')) + '">' + icon('plus') + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="cartrow__side">' +
          '<span class="price"><span class="price__now">' + Store.money(l.price * l.qty) + '</span></span>' +
          '<button type="button" class="litem__remove" data-remove>' + esc(t('cart.removeLine')) + '</button>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function renderSummary() {
    var tot = Store.totals();
    var c = Store.getCoupon();
    var pct = Math.min(100, (tot.subtotal / tot.freeShipAt) * 100);

    $('[data-summary]').innerHTML =
      '<h2 class="authcard__title" style="font-size:var(--fs-2xl)">' + esc(t('cart.summary')) + '</h2>' +
      '<div class="meter">' +
        '<div class="meter__track"><div class="meter__fill' + (tot.freeShipRemaining === 0 ? ' is-done' : '') + '" style="width:' + pct.toFixed(1) + '%"></div></div>' +
        '<p class="meter__text">' + esc(tot.freeShipRemaining === 0
          ? t('cart.freeShipDone')
          : t('cart.freeShipLeft', { amount: Store.money(tot.freeShipRemaining) })) + '</p>' +
      '</div>' +
      '<div class="totals">' +
        '<div class="totals__row"><span>' + esc(t('cart.subtotal')) + '</span><span>' + Store.money(tot.subtotal) + '</span></div>' +
        (tot.discount > 0
          ? '<div class="totals__row"><span>' + esc(t('cart.discountLine')) + (c ? ' (' + esc(c.code) + ')' : '') + '</span><span style="color:var(--success)">-' + Store.money(tot.discount) + '</span></div>'
          : '') +
        '<div class="totals__row"><span>' + esc(t('cart.shipping')) + '</span><span>' + (tot.shipping === 0 ? esc(t('g.free')) : Store.money(tot.shipping)) + '</span></div>' +
        '<div class="totals__row"><span>' + esc(t('cart.tax')) + '</span><span>' + Store.money(tot.tax) + '</span></div>' +
        '<div class="totals__row totals__row--grand"><span>' + esc(t('cart.total')) + '</span><span>' + Store.money(tot.total) + '</span></div>' +
      '</div>' +
      (tot.savings > 0 ? '<p class="text-sm" style="color:var(--success)">' + esc(t('cart.savedTotal', { amount: Store.money(tot.savings) })) + '</p>' : '') +
      '<a class="btn btn--primary btn--lg btn--block" href="checkout.html">' + esc(t('cart.checkoutFull')) + '</a>' +
      '<a class="btn btn--secondary btn--block" href="collection.html?c=shop-all">' + esc(t('cart.keepShopping')) + '</a>' +
      '<p class="text-sm dim">' + esc(t('cart.taxNote')) + '</p>';
  }

  function renderCoupon() {
    var host = $('[data-coupon]');
    var c = Store.getCoupon();

    if (c) {
      host.innerHTML = '<div class="row row--between" style="padding:var(--space-5);border:1px solid var(--accent);border-radius:var(--radius);background:var(--accent-wash)">' +
        '<span class="row" style="gap:var(--space-3)">' + icon('ticket') +
          '<span><strong class="mono">' + esc(c.code) + '</strong><br><span class="text-sm muted">' + esc(t('coupon.' + c.code)) + '</span></span></span>' +
        '<button type="button" class="litem__remove" data-coupon-clear>' + esc(t('cart.coupon.remove')) + '</button>' +
      '</div>';
      return;
    }

    host.innerHTML =
      '<div class="field">' +
        '<label class="field__label" for="coupon-input">' + esc(t('cart.coupon.label')) + '</label>' +
        '<div class="coupon">' +
          '<input class="input" id="coupon-input" type="text" placeholder="' + esc(t('cart.coupon.placeholder')) + '" autocomplete="off" data-coupon-input>' +
          '<button type="button" class="btn btn--secondary" data-coupon-apply>' + esc(t('g.apply')) + '</button>' +
        '</div>' +
        '<p class="field__help">' + esc(t('cart.coupon.help')) + '</p>' +
        '<p class="field__error" data-coupon-error>' + icon('warning-circle') + '<span data-coupon-msg></span></p>' +
      '</div>';
  }

  function renderCross() {
    var host = $('[data-cross]');
    var cart = Store.getCart();
    var owned = {};
    cart.forEach(function (l) { owned[l.handle] = true; });

    var pool = cart.length
      ? Catalog.alsoBuy(cart[0].handle, 12)
      : Catalog.sortItems(Catalog.all, 'best').slice(0, 12);

    var picks = pool.filter(function (p) { return !owned[p.handle]; }).slice(0, 4);
    if (!picks.length) { host.closest('section').hidden = true; return; }
    host.innerHTML = Catalog.cards(picks);
    UI.observeReveal(host);
    UI.syncCounts();
  }

  function renderAll() {
    renderLines();
    renderSummary();
    renderCoupon();
  }

  function bind() {
    doc.addEventListener('click', function (e) {
      if (e.target.closest('[data-coupon-apply]')) {
        var input = $('[data-coupon-input]');
        var res = Store.applyCoupon(input.value);
        var field = input.closest('.field');
        if (!res.ok) {
          field.classList.add('has-error');
          $('[data-coupon-msg]').textContent = res.reason;
          input.focus();
          return;
        }
        field.classList.remove('has-error');
        UI.toast(t('cart.coupon.applied', { code: res.coupon.code }), 'ok');
        return;
      }
      if (e.target.closest('[data-coupon-clear]')) {
        Store.clearCoupon();
        UI.toast(t('cart.coupon.cleared'), 'info');
        return;
      }
      if (e.target.closest('[data-cart-clear]')) {
        if (!Store.getCart().length) return;
        Store.clearCart();
        UI.toast(t('cart.cleared'), 'info');
      }
    });

    /* The note is a demo field, so it is kept in the page rather than the
       store. It is submitted with the order at checkout. */
    var note = $('[data-order-note]');
    if (note) {
      try { note.value = global.sessionStorage.getItem('as.note') || ''; } catch (err) {}
      note.addEventListener('input', function () {
        try { global.sessionStorage.setItem('as.note', note.value); } catch (err) {}
      });
    }

    Store.on('cart', function () { renderAll(); renderCross(); });
  }

  function boot() {
    renderAll();
    renderCross();
    bind();
    UI.observeReveal();
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);
