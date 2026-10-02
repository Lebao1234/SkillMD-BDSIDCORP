/* ============================================================================
   STORE
   Client-side state for cart, wishlist, compare, recently viewed, currency and
   theme. Persistence is localStorage, and every read and write is wrapped:
   private windows, blocked site data and storage quota errors must not take the
   page down. When storage is unavailable the store falls back to memory, so the
   session still works and simply does not survive a reload.
   ========================================================================= */
(function (global) {
  'use strict';

  var PREFIX = 'as.';
  var MEM = {};
  var STORAGE_OK = (function () {
    try {
      var k = PREFIX + 'probe';
      global.localStorage.setItem(k, '1');
      global.localStorage.removeItem(k);
      return true;
    } catch (err) {
      return false;
    }
  })();

  function read(key, fallback) {
    if (!STORAGE_OK) return key in MEM ? MEM[key] : fallback;
    try {
      var raw = global.localStorage.getItem(PREFIX + key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (err) {
      return fallback;
    }
  }

  function write(key, value) {
    MEM[key] = value;
    if (!STORAGE_OK) return;
    try {
      global.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (err) {
      /* Quota or a locked-down browser. State stays in memory for this tab. */
    }
  }

  /* ------------------------------------------------------------------
     Tiny event bus. Views subscribe, the store never touches the DOM.
     ------------------------------------------------------------------ */
  var handlers = {};

  function on(evt, fn) {
    (handlers[evt] || (handlers[evt] = [])).push(fn);
    return function off() {
      handlers[evt] = handlers[evt].filter(function (h) { return h !== fn; });
    };
  }

  function emit(evt, payload) {
    (handlers[evt] || []).forEach(function (fn) {
      try { fn(payload); } catch (err) { /* one bad listener must not break the rest */ }
    });
  }

  /* ------------------------------------------------------------------
     CURRENCY
     Rates are illustrative fixed values for the demo storefront. Base is USD
     because that is the currency of the source catalog.
     ------------------------------------------------------------------ */
  var CURRENCIES = {
    USD: { code: 'USD', symbol: '$', rate: 1, locale: 'en-US', decimals: 2 },
    VND: { code: 'VND', symbol: 'đ', rate: 25400, locale: 'vi-VN', decimals: 0 },
    EUR: { code: 'EUR', symbol: '€', rate: 0.92, locale: 'de-DE', decimals: 2 },
    GBP: { code: 'GBP', symbol: '£', rate: 0.79, locale: 'en-GB', decimals: 2 },
  };

  var currency = read('currency', 'USD');
  if (!CURRENCIES[currency]) currency = 'USD';

  function setCurrency(code) {
    if (!CURRENCIES[code]) return;
    currency = code;
    write('currency', code);
    emit('currency', code);
    emit('change', null);
  }

  function money(usd) {
    var c = CURRENCIES[currency];
    var value = (Number(usd) || 0) * c.rate;
    /* Group separators follow the reading language, not the currency, so a
       Vietnamese reader paying in USD still sees familiar grouping. */
    var loc = global.I18N ? global.I18N.locale() : c.locale;
    try {
      return new Intl.NumberFormat(loc, {
        style: 'currency',
        currency: c.code,
        minimumFractionDigits: c.decimals,
        maximumFractionDigits: c.decimals,
      }).format(value);
    } catch (err) {
      return c.symbol + value.toFixed(c.decimals);
    }
  }

  /* ------------------------------------------------------------------
     CART
     A line is keyed by variant id. Quantity is clamped to 1..99.
     ------------------------------------------------------------------ */
  var cart = read('cart', []);
  if (!Array.isArray(cart)) cart = [];

  function persistCart() {
    write('cart', cart);
    emit('cart', cart);
    emit('change', null);
  }

  function clampQty(n) {
    n = parseInt(n, 10);
    if (isNaN(n) || n < 1) return 1;
    return Math.min(n, 99);
  }

  function addToCart(line) {
    if (!line || !line.variantId) return null;
    var qty = clampQty(line.qty || 1);
    var found = cart.filter(function (l) { return l.variantId === line.variantId; })[0];
    if (found) {
      found.qty = clampQty(found.qty + qty);
    } else {
      cart.push({
        variantId: String(line.variantId),
        handle: line.handle,
        title: line.title,
        variantTitle: line.variantTitle || '',
        price: Number(line.price) || 0,
        compareAt: line.compareAt ? Number(line.compareAt) : null,
        image: line.image || '',
        qty: qty,
      });
    }
    persistCart();
    return found || cart[cart.length - 1];
  }

  function setQty(variantId, qty) {
    var line = cart.filter(function (l) { return l.variantId === String(variantId); })[0];
    if (!line) return;
    line.qty = clampQty(qty);
    persistCart();
  }

  function removeFromCart(variantId) {
    var before = cart.length;
    cart = cart.filter(function (l) { return l.variantId !== String(variantId); });
    if (cart.length !== before) persistCart();
  }

  function clearCart() {
    cart = [];
    persistCart();
  }

  function cartCount() {
    return cart.reduce(function (n, l) { return n + l.qty; }, 0);
  }

  function cartSubtotal() {
    return cart.reduce(function (n, l) { return n + l.price * l.qty; }, 0);
  }

  function cartSavings() {
    return cart.reduce(function (n, l) {
      if (!l.compareAt || l.compareAt <= l.price) return n;
      return n + (l.compareAt - l.price) * l.qty;
    }, 0);
  }

  /* Promotion codes accepted by the demo checkout. */
  var COUPONS = {
    SHARK10: { type: 'percent', value: 10 },
    FREESHIP: { type: 'shipping', value: 0 },
    NEWGEAR20: { type: 'fixed', value: 20, min: 150 },
  };

  var coupon = read('coupon', null);

  function applyCoupon(code) {
    var key = String(code || '').trim().toUpperCase();
    var found = COUPONS[key];
    var t = global.I18N ? global.I18N.t : function (k) { return k; };
    if (!found) return { ok: false, reason: t('coupon.invalid') };
    if (found.min && cartSubtotal() < found.min) {
      return { ok: false, reason: t('coupon.min', { amount: money(found.min) }) };
    }
    coupon = { code: key, def: found };
    write('coupon', coupon);
    emit('cart', cart);
    emit('change', null);
    return { ok: true, coupon: coupon };
  }

  function clearCoupon() {
    coupon = null;
    write('coupon', null);
    emit('cart', cart);
    emit('change', null);
  }

  function getCoupon() { return coupon; }

  var FREE_SHIP_AT = 59;
  var SHIP_FLAT = 7.9;

  function totals() {
    var subtotal = cartSubtotal();
    var discount = 0;
    var freeShip = subtotal >= FREE_SHIP_AT;

    if (coupon && coupon.def) {
      if (coupon.def.type === 'percent') discount = subtotal * (coupon.def.value / 100);
      else if (coupon.def.type === 'fixed') discount = Math.min(coupon.def.value, subtotal);
      else if (coupon.def.type === 'shipping') freeShip = true;
    }

    var shipping = cart.length === 0 || freeShip ? 0 : SHIP_FLAT;
    var taxable = Math.max(0, subtotal - discount);
    var tax = taxable * 0.08;
    return {
      subtotal: subtotal,
      discount: discount,
      shipping: shipping,
      tax: tax,
      total: taxable + shipping + tax,
      freeShipAt: FREE_SHIP_AT,
      freeShipRemaining: Math.max(0, FREE_SHIP_AT - subtotal),
      savings: cartSavings() + discount,
    };
  }

  /* ------------------------------------------------------------------
     WISHLIST and COMPARE
     Both store product handles. Compare is capped at four so the table stays
     readable on a laptop.
     ------------------------------------------------------------------ */
  var COMPARE_MAX = 4;
  var wishlist = read('wishlist', []);
  var compare = read('compare', []);
  if (!Array.isArray(wishlist)) wishlist = [];
  if (!Array.isArray(compare)) compare = [];

  function inWishlist(handle) { return wishlist.indexOf(handle) !== -1; }

  function toggleWishlist(handle) {
    if (!handle) return false;
    var i = wishlist.indexOf(handle);
    if (i === -1) wishlist.push(handle);
    else wishlist.splice(i, 1);
    write('wishlist', wishlist);
    emit('wishlist', wishlist);
    emit('change', null);
    return i === -1;
  }

  function removeWishlist(handle) {
    var i = wishlist.indexOf(handle);
    if (i === -1) return;
    wishlist.splice(i, 1);
    write('wishlist', wishlist);
    emit('wishlist', wishlist);
    emit('change', null);
  }

  function inCompare(handle) { return compare.indexOf(handle) !== -1; }

  function toggleCompare(handle) {
    if (!handle) return { ok: false };
    var i = compare.indexOf(handle);
    if (i !== -1) {
      compare.splice(i, 1);
      write('compare', compare);
      emit('compare', compare);
      emit('change', null);
      return { ok: true, added: false };
    }
    if (compare.length >= COMPARE_MAX) {
      var t = global.I18N ? global.I18N.t : function (k) { return k; };
      return { ok: false, reason: t('toast.compareFull', { n: COMPARE_MAX }) };
    }
    compare.push(handle);
    write('compare', compare);
    emit('compare', compare);
    emit('change', null);
    return { ok: true, added: true };
  }

  function clearCompare() {
    compare = [];
    write('compare', compare);
    emit('compare', compare);
    emit('change', null);
  }

  /* ------------------------------------------------------------------
     RECENTLY VIEWED - newest first, capped at twelve
     ------------------------------------------------------------------ */
  var viewed = read('viewed', []);
  if (!Array.isArray(viewed)) viewed = [];

  function markViewed(handle) {
    if (!handle) return;
    viewed = [handle].concat(viewed.filter(function (h) { return h !== handle; })).slice(0, 12);
    write('viewed', viewed);
  }

  /* ------------------------------------------------------------------
     ORDERS - written at the end of the demo checkout so the account page has
     something real to show.
     ------------------------------------------------------------------ */
  function placeOrder(details) {
    var orders = read('orders', []);
    if (!Array.isArray(orders)) orders = [];
    var t = totals();
    var order = {
      id: 'AS' + String(Date.now()).slice(-8),
      placedAt: new Date().toISOString(),
      items: cart.map(function (l) { return Object.assign({}, l); }),
      totals: t,
      details: details || {},
    };
    orders.unshift(order);
    write('orders', orders.slice(0, 20));
    clearCart();
    clearCoupon();
    return order;
  }

  function getOrders() {
    var o = read('orders', []);
    return Array.isArray(o) ? o : [];
  }

  /* ------------------------------------------------------------------
     THEME
     Dark is the brand default. The toggle writes an explicit value so the
     choice survives a reload; no value means follow the operating system.
     ------------------------------------------------------------------ */
  function getTheme() { return read('theme', null); }

  function setTheme(value) {
    if (value) {
      document.documentElement.setAttribute('data-theme', value);
      write('theme', value);
    } else {
      document.documentElement.removeAttribute('data-theme');
      write('theme', null);
    }
    emit('theme', value);
  }

  global.Store = {
    on: on,
    emit: emit,
    money: money,
    currencies: CURRENCIES,
    getCurrency: function () { return currency; },
    setCurrency: setCurrency,

    getCart: function () { return cart.slice(); },
    addToCart: addToCart,
    setQty: setQty,
    removeFromCart: removeFromCart,
    clearCart: clearCart,
    cartCount: cartCount,
    cartSubtotal: cartSubtotal,
    totals: totals,

    applyCoupon: applyCoupon,
    clearCoupon: clearCoupon,
    getCoupon: getCoupon,

    getWishlist: function () { return wishlist.slice(); },
    inWishlist: inWishlist,
    toggleWishlist: toggleWishlist,
    removeWishlist: removeWishlist,

    getCompare: function () { return compare.slice(); },
    inCompare: inCompare,
    toggleCompare: toggleCompare,
    clearCompare: clearCompare,
    compareMax: COMPARE_MAX,

    getViewed: function () { return viewed.slice(); },
    markViewed: markViewed,

    placeOrder: placeOrder,
    getOrders: getOrders,

    getTheme: getTheme,
    setTheme: setTheme,
    storageAvailable: STORAGE_OK,
  };
})(window);
