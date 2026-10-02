/* ============================================================================
   ACCOUNT CONTROLLER
   Sign in and register forms with inline validation, plus the order history
   written by the demo checkout. No server, no credentials are stored.
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
  var icon = UI.icon;
  var t = global.I18N.t;

  var RULES = {
    email: { test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }, msg: 'co.err.email' },
    password: { test: function (v) { return v.length >= 8; }, msg: 'ac.passwordHelp' },
    name: { test: function (v) { return v.trim().length >= 2; }, msg: 'ac.err.name' },
  };

  function validate(input) {
    var rule = RULES[input.getAttribute('data-rule')];
    if (!rule) return true;
    var field = input.closest('.field');
    var ok = rule.test(input.value);
    field.classList.toggle('has-error', !ok);
    input.setAttribute('aria-invalid', String(!ok));
    var err = $('[data-error]', field);
    if (err) err.querySelector('span').textContent = t(rule.msg);
    return ok;
  }

  function renderOrders() {
    var host = $('[data-orders]');
    var orders = Store.getOrders();

    if (!orders.length) {
      host.innerHTML = '<div class="empty">' +
        '<span class="empty__icon">' + icon('receipt') + '</span>' +
        '<h3 class="empty__title">' + esc(t('ac.orders.empty')) + '</h3>' +
        '<p class="empty__text">' + esc(t('ac.orders.emptyText')) + '</p>' +
        '<a class="btn btn--primary" href="collection.html?c=best-selling">' + esc(t('ac.orders.cta')) + '</a></div>';
      return;
    }

    host.innerHTML = orders.map(function (o) {
      var when = new Date(o.placedAt);
      return '<article class="surface surface--pad stack stack-6 reveal">' +
        '<div class="row row--between row--wrap">' +
          '<div class="stack stack-2">' +
            '<p class="opt-group__name">' + esc(t('ac.order', { id: o.id })) + '</p>' +
            '<p class="text-sm dim mono">' + when.toLocaleString(global.I18N.locale()) + '</p>' +
          '</div>' +
          '<span class="badge badge--stock">' + esc(t('ac.orderStatus')) + '</span>' +
        '</div>' +
        '<div>' + o.items.map(function (l) {
          return '<div class="litem">' +
            '<a class="litem__media" href="product.html?handle=' + esc(l.handle) + '"><img src="' + esc(l.image) + '" alt="" loading="lazy" width="84" height="84"></a>' +
            '<div class="litem__body">' +
              '<a class="litem__title" href="product.html?handle=' + esc(l.handle) + '">' + esc(l.title) + '</a>' +
              (l.variantTitle && l.variantTitle !== 'Default Title' ? '<p class="litem__meta">' + esc(l.variantTitle) + '</p>' : '') +
              '<p class="litem__meta mono">' + esc(t('co.qty', { n: l.qty })) + '</p>' +
            '</div>' +
            '<div class="litem__side"><span class="price price--sm"><span class="price__now">' + Store.money(l.price * l.qty) + '</span></span></div>' +
          '</div>';
        }).join('') + '</div>' +
        '<div class="totals"><div class="totals__row totals__row--grand"><span>' + esc(t('cart.total')) + '</span><span>' + Store.money(o.totals.total) + '</span></div></div>' +
      '</article>';
    }).join('');

    UI.observeReveal(host);
  }

  function renderSaved() {
    var wish = Store.getWishlist().map(Catalog.get).filter(Boolean).slice(0, 4);
    var viewed = Store.getViewed().map(Catalog.get).filter(Boolean).slice(0, 4);

    $('[data-acc-wish]').innerHTML = wish.length
      ? Catalog.cards(wish, { noQuickAdd: true })
      : '<p class="muted" style="grid-column:1/-1">' + esc(t('ac.savedEmpty')) + '</p>';

    $('[data-acc-viewed]').innerHTML = viewed.length
      ? Catalog.cards(viewed, { noQuickAdd: true })
      : '<p class="muted" style="grid-column:1/-1">' + esc(t('ac.viewedEmpty')) + '</p>';

    UI.observeReveal();
    UI.syncCounts();
  }

  function bind() {
    doc.addEventListener('submit', function (e) {
      var form = e.target.closest('[data-auth]');
      if (!form) return;
      e.preventDefault();

      var inputs = $$('[data-rule]', form);
      var ok = true;
      inputs.forEach(function (i) { if (!validate(i)) ok = false; });
      if (!ok) { $$('.has-error input', form)[0].focus(); return; }

      var btn = $('button[type="submit"]', form);
      btn.classList.add('is-loading');
      global.setTimeout(function () {
        btn.classList.remove('is-loading');
        UI.toast(t(form.getAttribute('data-auth') === 'login' ? 'ac.loginNote' : 'ac.registerNote'), 'info');
      }, 600);
    });

    doc.addEventListener('blur', function (e) {
      if (e.target.matches && e.target.matches('[data-rule]') && e.target.value) validate(e.target);
    }, true);

    doc.addEventListener('click', function (e) {
      var toggle = e.target.closest('[data-pw-toggle]');
      if (!toggle) return;
      var input = $('#' + toggle.getAttribute('data-pw-toggle'));
      var show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      toggle.innerHTML = icon(show ? 'eye-slash' : 'eye');
      toggle.setAttribute('aria-label', t(show ? 'ac.hidePassword' : 'ac.showPassword'));
    });

    Store.on('change', function () { renderOrders(); renderSaved(); });
  }

  function boot() {
    renderOrders();
    renderSaved();
    bind();
    UI.observeReveal();
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);
