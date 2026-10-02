/* ============================================================================
   CHECKOUT CONTROLLER
   Three steps: contact and delivery, shipping method, payment. Validation is
   inline and per field, errors sit below the input they belong to, and the
   review step reads back everything before the order is placed.

   No payment is processed. The final step writes a local order record so the
   account page has something real to show.
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

  var STEPS = ['contact', 'shipping', 'payment'];
  var step = 0;
  var data = { shipMethod: 'standard', payMethod: 'card' };

  var SHIPPING = {
    standard: { label: 'co.ship.standard', eta: 'co.ship.standardEta', cost: 0, note: 'co.ship.standardNote' },
    express: { label: 'co.ship.express', eta: 'co.ship.expressEta', cost: 14.9, note: '' },
    priority: { label: 'co.ship.priority', eta: 'co.ship.priorityEta', cost: 29.9, note: 'co.ship.priorityNote' },
  };

  var PAYMENTS = [
    { id: 'card', label: 'co.pay.card', note: 'co.pay.cardNote', icon: 'credit-card' },
    { id: 'paypal', label: 'PayPal', raw: true, note: 'co.pay.paypalNote', icon: 'paypal-logo' },
    { id: 'momo', label: 'co.pay.momo', note: 'co.pay.momoNote', icon: 'qr-code' },
    { id: 'vnpay', label: 'VNPay', raw: true, note: 'co.pay.vnpayNote', icon: 'bank' },
    { id: 'cod', label: 'co.pay.cod', note: 'co.pay.codNote', icon: 'hand-coins' },
  ];

  /* ------------------------------------------------------------------
     VALIDATION
     ------------------------------------------------------------------ */
  var RULES = {
    email: { test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }, msg: 'co.err.email' },
    phone: { test: function (v) { return /^[0-9+()\s.-]{8,20}$/.test(v); }, msg: 'co.err.phone' },
    required: { test: function (v) { return v.trim().length > 1; }, msg: 'co.err.required' },
    zip: { test: function (v) { return /^[A-Za-z0-9\s-]{3,12}$/.test(v); }, msg: 'co.err.zip' },
    card: { test: function (v) { return v.replace(/\s/g, '').length >= 13 && /^[0-9\s]+$/.test(v); }, msg: 'co.err.card' },
    expiry: { test: function (v) { return /^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(v); }, msg: 'co.err.expiry' },
    cvc: { test: function (v) { return /^[0-9]{3,4}$/.test(v); }, msg: 'co.err.cvc' },
  };

  function validateField(input) {
    var rule = RULES[input.getAttribute('data-rule')] || RULES.required;
    var field = input.closest('.field');
    var ok = rule.test(input.value);
    field.classList.toggle('has-error', !ok);
    input.setAttribute('aria-invalid', String(!ok));
    var err = $('[data-error]', field);
    if (err) err.querySelector('span').textContent = t(rule.msg);
    return ok;
  }

  function validateStep(name) {
    var panel = $('[data-step-panel="' + name + '"]');
    /* Skip fields inside a collapsed block, such as the card inputs when a
       different payment method is selected. Presence of the [hidden] ancestor
       is the test, not offsetParent, which also reports null for fixed and
       detached elements and would silently wave every field through. */
    var inputs = $$('[data-rule]', panel).filter(function (i) {
      return !i.disabled && !i.closest('[hidden]');
    });
    var ok = true;
    inputs.forEach(function (i) { if (!validateField(i)) ok = false; });
    if (!ok) {
      var first = $$('.has-error input, .has-error select', panel)[0];
      if (first) first.focus();
    }
    return ok;
  }

  function collect() {
    $$('[data-field]').forEach(function (i) {
      data[i.getAttribute('data-field')] = i.type === 'checkbox' ? i.checked : i.value;
    });
  }

  /* ------------------------------------------------------------------
     RENDERING
     ------------------------------------------------------------------ */
  function renderSteps() {
    var labels = [t('co.step1'), t('co.step2'), t('co.step3')];
    $('[data-steps]').innerHTML = STEPS.map(function (s, i) {
      var cls = i < step ? ' is-done' : i === step ? ' is-current' : '';
      return '<span class="step' + cls + '">' +
        (i < step ? icon('check') : '<span class="mono">' + (i + 1) + '</span>') +
        esc(labels[i]) + '</span>';
    }).join('');

    STEPS.forEach(function (s, i) {
      $('[data-step-panel="' + s + '"]').hidden = i !== step;
    });

    $('[data-back]').hidden = step === 0;
    $('[data-next]').textContent = step === STEPS.length - 1 ? t('co.placeOrder') : t('g.continue');
  }

  function renderShipping() {
    var tot = Store.totals();
    $('[data-ship-options]').innerHTML = Object.keys(SHIPPING).map(function (k) {
      var s = SHIPPING[k];
      var cost = k === 'standard' && tot.subtotal >= tot.freeShipAt ? 0 : s.cost;
      return '<label class="paymethod' + (data.shipMethod === k ? ' is-on' : '') + '">' +
        '<input type="radio" name="ship" value="' + k + '" data-ship' + (data.shipMethod === k ? ' checked' : '') + ' class="visually-hidden">' +
        icon('truck') +
        '<span><span class="paymethod__name">' + esc(t(s.label)) + '</span><br>' +
          '<span class="text-sm muted">' + esc(t(s.eta)) + (s.note ? '. ' + esc(t(s.note)) : '') + '</span></span>' +
        '<span class="paymethod__note">' + (cost === 0 ? esc(t('g.free')) : Store.money(cost)) + '</span>' +
      '</label>';
    }).join('');
  }

  function renderPayments() {
    $('[data-pay-options]').innerHTML = PAYMENTS.map(function (p) {
      return '<label class="paymethod' + (data.payMethod === p.id ? ' is-on' : '') + '">' +
        '<input type="radio" name="pay" value="' + p.id + '" data-pay' + (data.payMethod === p.id ? ' checked' : '') + ' class="visually-hidden">' +
        icon(p.icon) +
        '<span class="paymethod__name">' + esc(p.raw ? p.label : t(p.label)) + '</span>' +
        '<span class="paymethod__note">' + esc(t(p.note)) + '</span>' +
      '</label>';
    }).join('');

    $('[data-card-fields]').hidden = data.payMethod !== 'card';
  }

  function shippingCost() {
    var tot = Store.totals();
    var s = SHIPPING[data.shipMethod];
    if (data.shipMethod === 'standard' && tot.subtotal >= tot.freeShipAt) return 0;
    return s.cost;
  }

  function renderSummary() {
    var cart = Store.getCart();
    var tot = Store.totals();
    var ship = shippingCost();
    var cod = data.payMethod === 'cod' ? 2 : 0;
    var grand = tot.subtotal - tot.discount + ship + tot.tax + cod;
    var c = Store.getCoupon();

    $('[data-order-summary]').innerHTML =
      '<h2 class="authcard__title" style="font-size:var(--fs-2xl)">' + esc(t('co.orderSummary')) + '</h2>' +
      (cart.length
        ? cart.map(function (l) {
            return '<div class="litem">' +
              '<span class="litem__media"><img src="' + esc(l.image) + '" alt="" loading="lazy" width="84" height="84"></span>' +
              '<div class="litem__body">' +
                '<span class="litem__title">' + esc(l.title) + '</span>' +
                (l.variantTitle && l.variantTitle !== 'Default Title' ? '<span class="litem__meta">' + esc(l.variantTitle) + '</span>' : '') +
                '<span class="litem__meta mono">' + esc(t('co.qty', { n: l.qty })) + '</span>' +
              '</div>' +
              '<div class="litem__side"><span class="price price--sm"><span class="price__now">' + Store.money(l.price * l.qty) + '</span></span></div>' +
            '</div>';
          }).join('')
        : '<p class="muted">' + esc(t('cart.empty.title')) + '</p>') +
      '<div class="totals" style="margin-block-start:var(--space-6)">' +
        '<div class="totals__row"><span>' + esc(t('cart.subtotal')) + '</span><span>' + Store.money(tot.subtotal) + '</span></div>' +
        (tot.discount > 0 ? '<div class="totals__row"><span>' + esc(t('cart.discountLine')) + (c ? ' (' + esc(c.code) + ')' : '') + '</span><span style="color:var(--success)">-' + Store.money(tot.discount) + '</span></div>' : '') +
        '<div class="totals__row"><span>' + esc(t('co.shipLine', { method: t(SHIPPING[data.shipMethod].label) })) + '</span><span>' + (ship === 0 ? esc(t('g.free')) : Store.money(ship)) + '</span></div>' +
        (cod ? '<div class="totals__row"><span>' + esc(t('co.codFee')) + '</span><span>' + Store.money(cod) + '</span></div>' : '') +
        '<div class="totals__row"><span>' + esc(t('cart.tax')) + '</span><span>' + Store.money(tot.tax) + '</span></div>' +
        '<div class="totals__row totals__row--grand"><span>' + esc(t('cart.total')) + '</span><span>' + Store.money(grand) + '</span></div>' +
      '</div>';
  }

  /* ------------------------------------------------------------------
     CONFIRMATION
     ------------------------------------------------------------------ */
  function renderDone(order) {
    var ship = SHIPPING[data.shipMethod];
    $('[data-checkout-root]').innerHTML =
      '<div class="authcard" style="max-width:720px;margin-inline:auto;text-align:center;align-items:center">' +
        '<span class="empty__icon" style="border-color:var(--success);color:var(--success)">' + icon('check-circle') + '</span>' +
        '<h1 class="authcard__title">' + esc(t('co.done.title')) + '</h1>' +
        '<p class="muted">' + esc(t('co.done.text', {
          id: order.id,
          email: data.email || t('co.done.yourAddress'),
        })) + '</p>' +
        '<div class="surface surface--pad" style="width:100%;text-align:start">' +
          '<div class="totals">' +
            '<div class="totals__row"><span>' + esc(t('co.done.shipTo')) + '</span><span>' + esc([data.address, data.city, data.country].filter(Boolean).join(', ')) + '</span></div>' +
            '<div class="totals__row"><span>' + esc(t('co.done.method')) + '</span><span>' + esc(t(ship.label)) + ', ' + esc(t(ship.eta)) + '</span></div>' +
            '<div class="totals__row totals__row--grand"><span>' + esc(t('co.done.paid')) + '</span><span>' + Store.money(order.totals.total) + '</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="row" style="gap:var(--space-4)">' +
          '<a class="btn btn--primary" href="account.html#orders">' + esc(t('co.done.viewOrder')) + '</a>' +
          '<a class="btn btn--secondary" href="collection.html?c=shop-all">' + esc(t('cart.keepShopping')) + '</a>' +
        '</div>' +
        '<p class="text-sm dim">' + esc(t('co.done.note')) + '</p>' +
      '</div>';
    global.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ------------------------------------------------------------------
     EVENTS
     ------------------------------------------------------------------ */
  function bind() {
    doc.addEventListener('click', function (e) {
      if (e.target.closest('[data-next]')) {
        collect();
        if (!validateStep(STEPS[step])) return;
        if (step === STEPS.length - 1) {
          if (!Store.getCart().length) {
            UI.toast(t('toast.cartEmptyCheckout'), 'bad');
            return;
          }
          var btn = e.target.closest('[data-next]');
          btn.classList.add('is-loading');
          global.setTimeout(function () {
            var order = Store.placeOrder(data);
            renderDone(order);
          }, 700);
          return;
        }
        step += 1;
        renderSteps();
        renderSummary();
        global.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      if (e.target.closest('[data-back]')) {
        step = Math.max(0, step - 1);
        renderSteps();
        global.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    doc.addEventListener('change', function (e) {
      if (e.target.matches('[data-ship]')) {
        data.shipMethod = e.target.value;
        renderShipping();
        renderSummary();
      }
      if (e.target.matches('[data-pay]')) {
        data.payMethod = e.target.value;
        renderPayments();
        renderSummary();
      }
      if (e.target.matches('[data-rule]')) validateField(e.target);
    });

    doc.addEventListener('blur', function (e) {
      if (e.target.matches && e.target.matches('[data-rule]') && e.target.value) validateField(e.target);
    }, true);

    /* Light input masks so the demo card fields behave like real ones. */
    var card = $('[data-field="cardNumber"]');
    if (card) {
      card.addEventListener('input', function () {
        var digits = card.value.replace(/\D/g, '').slice(0, 19);
        card.value = digits.replace(/(.{4})/g, '$1 ').trim();
      });
    }
    var exp = $('[data-field="cardExpiry"]');
    if (exp) {
      exp.addEventListener('input', function () {
        var d = exp.value.replace(/\D/g, '').slice(0, 4);
        exp.value = d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d;
      });
    }
  }

  function boot() {
    if (!Store.getCart().length) {
      $('[data-empty-cart]').hidden = false;
      $('[data-checkout-root]').hidden = true;
      return;
    }
    try { data.note = global.sessionStorage.getItem('as.note') || ''; } catch (err) {}
    renderSteps();
    renderShipping();
    renderPayments();
    renderSummary();
    bind();
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);
