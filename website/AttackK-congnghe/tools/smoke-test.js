/* Headless smoke test: loads every page in jsdom, runs its scripts, and
   exercises the main interactions. Network is disabled; local scripts are
   resolved from disk. */
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.resolve(__dirname, '..');
const PAGES = [
  'index.html',
  'collection.html?c=mouse',
  'product.html?handle=attack-shark-x11ultra',
  'cart.html',
  'checkout.html',
  'compare.html',
  'wishlist.html',
  'search.html?q=carbon',
  'blog.html',
  'article.html?slug=best-mouse-feet-for-gaming-aim',
  'support.html',
  'downloads.html',
  'account.html',
];

let failures = 0;

/* jsdom implements neither matchMedia nor IntersectionObserver. Both are
   universally available in browsers, so they are stubbed for the harness
   rather than worked around in the shipped code. The IntersectionObserver
   stub fires immediately, which also proves the reveal path runs. */
const POLYFILL = `<script>
(function(){
  if (!window.matchMedia) {
    window.matchMedia = function (q) {
      return { media: q, matches: false, addListener: function(){}, removeListener: function(){},
               addEventListener: function(){}, removeEventListener: function(){}, onchange: null };
    };
  }
  if (!window.IntersectionObserver) {
    window.IntersectionObserver = function (cb) {
      this.observe = function (el) {
        cb([{ target: el, isIntersecting: true, boundingClientRect: { top: 0 } }], this);
      };
      this.unobserve = function () {};
      this.disconnect = function () {};
    };
  }
  if (!window.scrollTo) window.scrollTo = function(){};
  if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = function(){};
  if (!Element.prototype.scrollBy) Element.prototype.scrollBy = function(){};
})();
</script>`;

function loadPage(spec, lang) {
  const [file, query] = spec.split('?');
  let html = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const seed = lang
    ? '<script>try{localStorage.setItem("as.lang", JSON.stringify("' + lang + '"));}catch(e){}</script>'
    : '';
  html = html.replace('<head>', '<head>' + POLYFILL + seed);

  /* Strip remote stylesheets; jsdom will not fetch them and they add noise. */
  html = html.replace(/<link rel="stylesheet" href="https:[^>]*>/g, '');

  /* Inline the local scripts so jsdom does not need a resource loader. */
  html = html.replace(/<script src="([^"]+)"><\/script>/g, (m, src) => {
    const p = path.join(ROOT, src);
    if (!fs.existsSync(p)) { console.log('  MISSING SCRIPT', src); failures++; return ''; }
    return '<script>' + fs.readFileSync(p, 'utf8') + '</script>';
  });

  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', (e) => errors.push('jsdomError: ' + (e.stack || e.message)));
  vc.on('error', (...a) => errors.push('console.error: ' + a.join(' ')));

  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    url: 'https://local.test/' + file + (query ? '?' + query : ''),
    virtualConsole: vc,
  });

  return { dom, errors, spec };
}

function ready(dom) {
  return new Promise((resolve) => {
    const w = dom.window;
    const done = () => setTimeout(() => setTimeout(resolve, 0), 0);
    if (w.document.readyState === 'complete') done();
    else w.addEventListener('load', done);
  });
}

const QUEUE = [];
function check(spec, assertions) { QUEUE.push([spec, assertions]); }

async function runCheck(spec, assertions) {
  const { dom, errors } = loadPage(spec);
  await ready(dom);
  const { window } = dom;
  const doc = window.document;

  const problems = errors.slice();

  try {
    await assertions(window, doc, problems);
  } catch (err) {
    problems.push('assertion threw: ' + err.stack);
  }

  if (problems.length) {
    failures++;
    console.log('FAIL ' + spec);
    problems.slice(0, 6).forEach((p) => console.log('   ' + String(p).split('\n').slice(0, 4).join('\n   ')));
  } else {
    console.log('pass ' + spec);
  }
  dom.window.close();
}

function must(problems, cond, msg) {
  if (!cond) problems.push(msg);
}

/* ------------------------------------------------------------------ */

check('index.html', (w, d, p) => {
  must(p, d.querySelector('.header'), 'header not mounted');
  must(p, d.querySelectorAll('.catbtn').length === 1, 'catalog trigger missing');
  must(p, d.querySelector('.footer'), 'footer not mounted');
  /* Redesigned hero: three indexed slides, each with a copy block, a framed
     product stage and a three-figure spec bar. */
  must(p, d.querySelectorAll('.hero__num').length === 3, 'hero index rail wrong count');
  must(p, d.querySelectorAll('.hero__copy').length === 3, 'hero copy blocks wrong count');
  must(p, d.querySelectorAll('.hero__stage').length === 3, 'hero stages wrong count');
  must(p, d.querySelectorAll('.hero__spec').length === 9, 'hero spec figures wrong count');
  must(p, d.querySelectorAll('.hero__copy.is-current').length === 1, 'exactly one hero copy should be current');
  must(p, d.querySelectorAll('.hero__stage.is-current').length === 1, 'exactly one hero stage should be current');
  must(p, d.querySelectorAll('.hero__copy h1').length === 1, 'only the first hero slide may carry the h1');
  Array.prototype.forEach.call(d.querySelectorAll('.hero__shot img'), function (img) {
    if (!img.getAttribute('src')) p.push('hero stage image with no src');
  });

  /* Clicking an index entry must move both columns together. */
  var nums = d.querySelectorAll('.hero__num');
  nums[2].dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
  must(p, d.querySelectorAll('.hero__copy')[2].classList.contains('is-current'), 'hero copy did not advance');
  must(p, d.querySelectorAll('.hero__stage')[2].classList.contains('is-current'), 'hero stage did not advance');
  must(p, nums[2].getAttribute('aria-current') === 'true', 'hero index not marked current');
  must(p, d.querySelectorAll('.hero__stage')[2].getAttribute('aria-hidden') === 'false', 'current stage still aria-hidden');

  must(p, d.querySelectorAll('[data-fresh] .pcard').length >= 6, 'fresh rail empty');
  must(p, d.querySelectorAll('[data-bento] .bento__cell').length === 3, 'bento should have exactly 3 cells');
  must(p, d.querySelectorAll('[data-cats] .cats__tile').length === 7, 'category wall should have 7 tiles');
  must(p, d.querySelectorAll('[data-best-panels] .pcard').length >= 20, 'best seller tabs empty');
  must(p, d.querySelectorAll('.countdown__unit').length === 4, 'countdown units missing');
  must(p, d.querySelector('[data-post-lead] .post-lead'), 'editorial lead missing');
  must(p, d.querySelectorAll('[data-post-list] .post-row').length === 4, 'editorial list wrong length');
  must(p, d.querySelectorAll('.announce__item').length === 4, 'announcement slides wrong count');
  must(p, d.querySelectorAll('.announce__item .announce__text').length === 4, 'announcement text nodes missing');
  must(p, d.querySelectorAll('.announce__item.is-current').length === 1, 'exactly one announcement should be current');
  must(p, !d.querySelector('.utility'), 'the utility bar should be gone from the redesigned header');

  /* Inline type-ahead: two characters is the threshold. */
  var hs = d.querySelector('[data-hsearch-input]');
  hs.value = 'carbon';
  hs.dispatchEvent(new w.Event('input', { bubbles: true }));

  must(p, d.querySelectorAll('[data-toasts]').length === 1, 'toast host missing');
  must(p, d.querySelectorAll('.searchbox').length === 1, 'search overlay missing');
  must(p, d.querySelectorAll('.drawer[data-drawer="cart"]').length === 1, 'cart drawer missing');

  /* No empty product images */
  d.querySelectorAll('.pcard__img').forEach((img) => {
    if (!img.getAttribute('src')) p.push('product card image with no src');
  });

  /* Eyebrow budget: at most ceil(sections/3) */
  const sections = d.querySelectorAll('main > section').length;
  const eyebrows = d.querySelectorAll('main .eyebrow').length;
  must(p, eyebrows <= Math.ceil(sections / 3),
    'eyebrow budget exceeded: ' + eyebrows + ' eyebrows for ' + sections + ' sections');

  /* Add to cart via quick add on a single variant product */
  const Store = w.Store;
  const single = w.Catalog.all.find((x) => x.variants.length === 1 && x.available);
  Store.addToCart({
    variantId: single.variants[0].id, handle: single.handle, title: single.shortTitle,
    variantTitle: single.variants[0].title, price: single.variants[0].price,
    image: single.images[0], qty: 2,
  });
  must(p, Store.cartCount() === 2, 'cart count after add should be 2, got ' + Store.cartCount());
  must(p, d.querySelector('[data-count-cart]').hidden === false, 'cart badge still hidden');
  must(p, d.querySelectorAll('[data-cart-body] .litem').length === 1, 'cart drawer line not rendered');
  Store.clearCart();
  must(p, d.querySelector('[data-count-cart]').hidden === true, 'cart badge not hidden after clear');
});

check('collection.html?c=mouse', (w, d, p) => {
  must(p, d.querySelector('[data-col-title]').textContent.length > 3, 'collection title empty');
  const cards = d.querySelectorAll('[data-grid] .pcard').length;
  must(p, cards === 12, 'expected 12 cards on page one, got ' + cards);
  must(p, d.querySelectorAll('[data-filters] .fgroup').length >= 5, 'filter groups missing');
  must(p, /\d/.test(d.querySelector('[data-resultcount]').textContent), 'result count not rendered');
  must(p, d.querySelectorAll('[data-pager] .pager__btn').length > 2, 'pager missing');

  /* Apply a facet and confirm the grid narrows */
  const before = d.querySelectorAll('[data-grid] .pcard').length;
  const box = d.querySelector('[data-facet="connection"]');
  must(p, !!box, 'connection facet missing');
  if (box) {
    box.checked = true;
    box.dispatchEvent(new w.Event('change', { bubbles: true }));
    must(p, d.querySelectorAll('[data-activefilters] .chip').length >= 2, 'active filter chip not rendered');
    must(p, w.location.search.indexOf('connection=') !== -1, 'filter not written to url');
  }

  /* Load more */
  const lm = d.querySelector('[data-loadmore]');
  if (lm && !d.querySelector('[data-loadmore-wrap]').hidden) {
    lm.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
    must(p, d.querySelectorAll('[data-grid] .pcard').length > before, 'load more did not add cards');
  }

  /* Clear */
  const clear = d.querySelector('[data-chip-clear]');
  if (clear) clear.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
  must(p, d.querySelectorAll('[data-activefilters] .chip').length === 0, 'chips not cleared');
});

check('product.html?handle=attack-shark-x11ultra', (w, d, p) => {
  must(p, d.querySelector('[data-title]').textContent.indexOf('X11') !== -1, 'pdp title wrong: ' + d.querySelector('[data-title]').textContent);
  must(p, d.querySelectorAll('[data-gallery-thumbs] .gthumb').length >= 4, 'gallery thumbs missing');
  must(p, d.querySelector('[data-stage] img').getAttribute('src'), 'stage image empty');
  must(p, d.querySelectorAll('[data-variants] .opt').length === 3, 'expected 3 colour variants');
  must(p, d.querySelector('[data-price] .price__now').textContent.indexOf('$') !== -1, 'price not formatted');
  must(p, d.querySelectorAll('[data-specs] .spec-group').length >= 3, 'spec clusters missing');
  must(p, d.querySelectorAll('[data-story] .storyblock').length >= 5, 'feature blocks missing');
  must(p, d.querySelectorAll('[data-review-list] .review').length >= 4, 'reviews missing');
  must(p, d.querySelectorAll('[data-related] .pcard').length === 4, 'related products missing');
  must(p, d.querySelectorAll('[data-fbt] .fbt__row').length === 3, 'bundle rows missing');
  must(p, d.querySelectorAll('[data-downloads] .dllink').length === 3, 'download links missing');

  /* Switch variant */
  const opts = d.querySelectorAll('[data-variant]');
  opts[2].dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
  must(p, opts[2].getAttribute('aria-pressed') === 'true', 'variant not selected');
  must(p, d.querySelector('[data-variant-label]').textContent === opts[2].textContent.trim(), 'variant label not synced');

  /* Quantity and add */
  d.querySelector('[data-qty-plus]').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
  must(p, d.querySelector('[data-qty-main]').value === '2', 'qty stepper failed');

  /* Bundle toggle updates the total */
  const t0 = d.querySelector('[data-fbt-total]').textContent;
  d.querySelector('[data-fbt-toggle]').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
  must(p, d.querySelector('[data-fbt-total]').textContent !== t0, 'bundle total did not change');

  /* Recently viewed recorded */
  must(p, w.Store.getViewed()[0] === 'attack-shark-x11ultra', 'viewed not recorded');
});

check('product.html?handle=does-not-exist', (w, d, p) => {
  must(p, d.querySelector('[data-pdp] .empty'), 'unknown handle should render a not-found state');
  must(p, d.querySelector('[data-crumb-name]').textContent === w.I18N.t('pdp.missing.crumb'), 'breadcrumb not updated for not-found');
  must(p, !d.querySelector('[data-stickybuy]'), 'sticky buy bar should be removed when there is no product');
  must(p, Array.prototype.every.call(d.querySelectorAll('[data-pdp-section]'), (s) => s.hidden), 'pdp sections should be hidden');
});

check('product.html', (w, d, p) => {
  must(p, d.querySelector('[data-title]').textContent.length > 2, 'bare product url should fall back to a real product');
  must(p, d.querySelectorAll('[data-gallery-thumbs] .gthumb').length > 0, 'fallback product has no gallery');
});

check('cart.html', (w, d, p) => {
  must(p, d.querySelector('[data-cart-empty]').hidden === false, 'empty cart state should show');
  must(p, d.querySelector('[data-cart-grid]').hidden === true, 'cart grid should be hidden when empty');

  const prod = w.Catalog.all.find((x) => x.available);
  w.Store.addToCart({
    variantId: prod.variants[0].id, handle: prod.handle, title: prod.shortTitle,
    variantTitle: prod.variants[0].title, price: prod.variants[0].price,
    compareAt: prod.variants[0].compareAt, image: prod.images[0], qty: 3,
  });
  must(p, d.querySelector('[data-cart-grid]').hidden === false, 'cart grid should show after add');
  must(p, d.querySelectorAll('[data-cart-lines] .cartrow').length === 1, 'cart row not rendered');
  must(p, d.querySelector('[data-summary]').textContent.indexOf(w.I18N.t('cart.total')) !== -1, 'summary missing total');

  /* Coupon flow */
  d.querySelector('[data-coupon-input]').value = 'SHARK10';
  d.querySelector('[data-coupon-apply]').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
  must(p, w.Store.getCoupon() && w.Store.getCoupon().code === 'SHARK10', 'coupon not applied');
  must(p, w.Store.totals().discount > 0, 'discount not computed');

  d.querySelector('[data-coupon-input]') === null || true;
  w.Store.clearCoupon();

  /* Bad coupon shows an inline error */
  d.querySelector('[data-coupon-input]').value = 'NOPE';
  d.querySelector('[data-coupon-apply]').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
  must(p, d.querySelector('[data-coupon-input]').closest('.field').classList.contains('has-error'), 'invalid coupon did not flag an error');

  /* Quantity edit */
  const down = d.querySelector('[data-cart-lines] [data-qty-down]');
  down.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
  must(p, w.Store.cartCount() === 2, 'qty down failed, count ' + w.Store.cartCount());

  /* Remove */
  d.querySelector('[data-cart-lines] [data-remove]').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
  must(p, w.Store.cartCount() === 0, 'remove failed');
  must(p, d.querySelector('[data-cart-empty]').hidden === false, 'empty state did not return');
});

check('checkout.html', (w, d, p) => {
  must(p, d.querySelector('[data-empty-cart]').hidden === false, 'checkout should block on an empty cart');

  /* Seed a cart then re-run boot by dispatching load on a fresh page below. */
});

/* Checkout with a seeded cart: prime localStorage before the page boots. */
async function checkoutWithCart() {
  const spec = 'checkout.html';
  const { dom, errors } = (function () {
    const file = 'checkout.html';
    let html = fs.readFileSync(path.join(ROOT, file), 'utf8');
    html = html.replace(/<link rel="stylesheet" href="https:[^>]*>/g, '');
    html = html.replace(/<script src="([^"]+)"><\/script>/g, (m, src) =>
      '<script>' + fs.readFileSync(path.join(ROOT, src), 'utf8') + '</script>');

    const seed = `<script>try{localStorage.setItem('as.cart', JSON.stringify([
      {variantId:'v1',handle:'attack-shark-x11ultra',title:'X11 ULTRA',variantTitle:'Black',price:109.99,compareAt:null,image:'x.png',qty:1}
    ]));}catch(e){}</script>`;
    html = html.replace('<head>', '<head>' + POLYFILL + seed);

    const errs = [];
    const vc = new VirtualConsole();
    vc.on('jsdomError', (e) => errs.push('jsdomError: ' + (e.stack || e.message)));
    vc.on('error', (...a) => errs.push('console.error: ' + a.join(' ')));
    return {
      dom: new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://local.test/checkout.html', virtualConsole: vc }),
      errors: errs,
    };
  })();

  await ready(dom);
  const w = dom.window;
  const d = w.document;
  const p = errors.slice();

  must(p, d.querySelector('[data-empty-cart]').hidden !== false, 'checkout should not be blocked with items');
  must(p, d.querySelectorAll('[data-steps] .step').length === 3, 'three steps expected');
  must(p, d.querySelector('[data-step-panel="contact"]').hidden === false, 'step one should be visible');
  must(p, d.querySelector('[data-order-summary]').textContent.indexOf(w.I18N.t('cart.total')) !== -1, 'order summary missing');

  /* Advance with empty fields: must be blocked and flag errors */
  d.querySelector('[data-next]').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
  must(p, d.querySelectorAll('[data-step-panel="contact"] .field.has-error').length >= 4, 'validation did not flag empty required fields');
  must(p, d.querySelector('[data-step-panel="shipping"]').hidden === true, 'advanced past an invalid step');

  /* Fill in and advance */
  const set = (sel, v) => { const el = d.querySelector(sel); el.value = v; };
  set('#ck-email', 'nguoi.dung@vidu.com');
  set('#ck-phone', '0901234567');
  set('#ck-name', 'Tran Le Bao Khanh');
  set('#ck-address', '12 Nguyen Hue');
  set('#ck-city', 'Ho Chi Minh');
  set('#ck-zip', '70000');
  d.querySelector('[data-next]').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
  must(p, d.querySelector('[data-step-panel="shipping"]').hidden === false, 'did not advance to shipping');
  must(p, d.querySelectorAll('[data-ship-options] .paymethod').length === 3, 'shipping options missing');

  d.querySelector('[data-next]').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
  must(p, d.querySelector('[data-step-panel="payment"]').hidden === false, 'did not advance to payment');
  must(p, d.querySelectorAll('[data-pay-options] .paymethod').length === 5, 'payment options missing');
  must(p, d.querySelector('[data-next]').textContent === w.I18N.t('co.placeOrder'), 'final button label wrong');

  /* Card masking */
  const card = d.querySelector('[data-field="cardNumber"]');
  card.value = '4242424242424242';
  card.dispatchEvent(new w.Event('input', { bubbles: true }));
  must(p, card.value === '4242 4242 4242 4242', 'card mask failed: ' + card.value);

  if (p.length) { failures++; console.log('FAIL checkout.html (with cart)'); p.slice(0, 6).forEach((x) => console.log('   ' + String(x).split('\n').slice(0, 4).join('\n   '))); }
  else console.log('pass checkout.html (with cart)');
  w.close();
}

check('compare.html', (w, d, p) => {
  must(p, d.querySelector('[data-compare-empty]').hidden === false, 'compare empty state missing');
  w.Store.toggleCompare('attack-shark-x11ultra');
  w.Store.toggleCompare('attack-shark-r11-ultra-carbon-fiber-wireless-8k-paw3950max-gaming-mouse');
  must(p, d.querySelector('[data-compare-table]').hidden === false, 'compare table did not appear');
  must(p, d.querySelectorAll('.comparetable tbody tr').length === 12, 'compare rows wrong count');
  must(p, d.querySelectorAll('.comparetable thead th').length === 3, 'compare columns wrong count');
  must(p, d.querySelectorAll('.comparetable .is-best').length > 0, 'no best value highlighted');

  /* Cap at four */
  const extra = w.Catalog.all.filter((x) => x.category === 'mouse').slice(0, 6);
  extra.forEach((x) => w.Store.toggleCompare(x.handle));
  must(p, w.Store.getCompare().length <= 4, 'compare cap exceeded: ' + w.Store.getCompare().length);
  w.Store.clearCompare();
  must(p, d.querySelector('[data-compare-empty]').hidden === false, 'empty state did not return');
});

check('wishlist.html', (w, d, p) => {
  must(p, d.querySelector('[data-wish-empty]').hidden === false, 'wishlist empty state missing');
  w.Store.toggleWishlist('attack-shark-x11ultra');
  must(p, d.querySelectorAll('[data-wish-grid] .pcard').length === 1, 'wishlist card not rendered');
  must(p, d.querySelector('[data-wish-actions]').hidden === false, 'bulk actions hidden');
  d.querySelector('[data-wish-addall]').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
  must(p, w.Store.cartCount() >= 1, 'add all to cart failed');
  w.Store.clearCart();
});

check('search.html?q=carbon', (w, d, p) => {
  must(p, d.querySelector('[data-search-term]').textContent === 'carbon', 'search term not echoed');
  must(p, d.querySelectorAll('[data-search-grid] .pcard').length > 3, 'search returned too few results');
  must(p, d.querySelectorAll('[data-search-groups] .chip').length >= 2, 'category breakdown missing');

  /* Narrow by group */
  const chips = d.querySelectorAll('[data-group]');
  chips[1].dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
  must(p, d.querySelectorAll('[data-search-grid] .pcard').length > 0, 'group filter emptied results');
});

check('search.html?q=zzzzqqq', (w, d, p) => {
  must(p, d.querySelector('[data-search-empty]').hidden === false, 'empty search state missing');
  must(p, d.querySelectorAll('[data-search-fallback] .pcard').length === 4, 'fallback suggestions missing');
});

check('blog.html', (w, d, p) => {
  must(p, d.querySelector('[data-blog-lead] .post-lead'), 'blog lead missing');
  must(p, d.querySelectorAll('[data-blog-list] .post-row').length === 7, 'blog list wrong length');
  must(p, d.querySelectorAll('[data-blog-topics] .chip').length === 3, 'topic filters wrong count');
  must(p, d.querySelector('[data-blog-topics] .chip').textContent.indexOf('guides') === -1,
    'topic chips should show translated labels, not slugs');
  d.querySelectorAll('[data-topic]')[1].dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
  must(p, d.querySelectorAll('[data-blog-list] .post-row').length < 7, 'topic filter did not narrow the list');
});

check('article.html?slug=best-mouse-feet-for-gaming-aim', (w, d, p) => {
  must(p, d.querySelector('[data-art-title]').textContent.length > 10, 'article title wrong');
  must(p, d.querySelectorAll('[data-art-body] section').length === 5, 'article sections wrong count');
  must(p, d.querySelectorAll('[data-art-toc] a').length === 5, 'table of contents wrong count');
  must(p, d.querySelectorAll('[data-art-products] .pcard').length === 4, 'article product picks missing');
  must(p, d.querySelectorAll('[data-art-more] .post-row').length === 3, 'more articles missing');
  must(p, d.querySelector('[data-art-cover]').getAttribute('src'), 'article cover missing');
});

check('support.html', (w, d, p) => {
  must(p, d.querySelectorAll('.sidenav a').length === 11, 'support side nav wrong count');
  must(p, d.querySelectorAll('.acc__btn').length === 9, 'accordion count wrong');
  ['shipping', 'returns', 'warranty', 'faq', 'contact', 'about', 'affiliate', 'creators', 'privacy', 'terms', 'cookies']
    .forEach((id) => must(p, d.getElementById(id), 'missing section #' + id));

  /* Accordion toggling */
  const btn = d.querySelectorAll('.acc__btn')[1];
  must(p, btn.getAttribute('aria-expanded') === 'false', 'accordion should start closed');
  btn.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
  must(p, btn.getAttribute('aria-expanded') === 'true', 'accordion did not open');
});

check('downloads.html', (w, d, p) => {
  const n = d.querySelectorAll('[data-dl-grid] .dlcard').length;
  must(p, n > 20, 'download library too small: ' + n);
  must(p, d.querySelectorAll('[data-dl-grid] .dlcard .dllink').length === n * 4, 'each card needs four links');

  const sel = d.querySelector('[data-dl-group]');
  sel.value = 'headset';
  sel.dispatchEvent(new w.Event('change', { bubbles: true }));
  const m = d.querySelectorAll('[data-dl-grid] .dlcard').length;
  must(p, m > 0 && m < n, 'group filter failed: ' + m + ' of ' + n);
});

check('index.html?lang', (w, d, p) => {
  /* The switch is present, shows both languages, and defaults to Vietnamese. */
  const sel = d.querySelector('[data-lang]');
  must(p, !!sel, 'language select missing from the header');
  must(p, sel.options.length === 2, 'expected two languages, got ' + (sel && sel.options.length));
  must(p, sel.value === w.I18N.lang, 'select does not reflect the active language');
  must(p, d.documentElement.getAttribute('lang') === w.I18N.lang, 'html lang attribute out of step');
  must(p, w.I18N.t('no.such.key') === 'no.such.key', 'missing key should return the key');
});

check('account.html', (w, d, p) => {
  must(p, d.querySelectorAll('[data-auth]').length === 2, 'both auth forms expected');
  must(p, d.querySelector('[data-orders] .empty'), 'orders empty state missing');

  /* Submitting empty flags errors rather than doing nothing */
  const form = d.querySelector('[data-auth="login"]');
  form.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
  must(p, d.querySelectorAll('[data-auth="login"] .field.has-error').length === 2, 'login validation did not flag both fields');

  /* Password reveal */
  const toggle = d.querySelector('[data-pw-toggle="li-pass"]');
  toggle.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
  must(p, d.getElementById('li-pass').type === 'text', 'password reveal failed');
});

/* Shared chrome must be identical on every page. */
async function chromeChecks() {
  console.log('\n--- shared chrome ---');
  for (const spec of PAGES) {
    const { dom, errors } = loadPage(spec);
    await ready(dom);
    const d = dom.window.document;
    const p = errors.slice();
    must(p, d.querySelectorAll('.header .catbtn').length === 1, 'catalog trigger missing on ' + spec);
    must(p, d.querySelectorAll('.header .quicknav__link').length === 4, 'shortcut count wrong on ' + spec + ': ' + d.querySelectorAll('.header .quicknav__link').length);
    must(p, d.querySelectorAll('.header .mega__cols > div').length === 4, 'catalog panel columns wrong on ' + spec);
    must(p, d.querySelector('.header .hsearch__input'), 'inline search missing on ' + spec);
    must(p, d.querySelectorAll('.brand .mark').length === 2, 'brand mark should appear in the header and the footer on ' + spec);
    must(p, (d.querySelector('.brand__word') || {}).textContent &&
      d.querySelector('.brand__word').textContent.indexOf('HADAL') === 0, 'wordmark wrong on ' + spec);
    /* Scan rendered text only. Script bodies are excluded: the harness inlines
       them, and the generated data file carries a provenance comment naming the
       source catalog, which is accurate and is not shipped copy. */
    var clone = d.body.cloneNode(true);
    Array.prototype.forEach.call(clone.querySelectorAll('script, style'), function (el) { el.remove(); });
    must(p, !/attack\s?shark/i.test(clone.textContent || ''), 'old brand name still visible on ' + spec);

    /* Untranslated leftovers. Every Vietnamese string in the dictionary has
       diacritics, so these bare forms can only come from a missed literal. */
    var shown = clone.textContent || '';
    var LEFTOVER = /\b(Khong|San pham|Gio hang|Danh muc|Tat ca|Xem tat ca|Them vao gio|Tam het hang|Con hang|Het hang|Thanh toan|Tai khoan|Ho tro|So luong|Tiet kiem|Tong cong|Bo loc|Ket qua|Dang tai)\b/;
    var hit = shown.match(LEFTOVER);
    must(p, !hit, 'untranslated literal on ' + spec + ': ' + (hit && hit[0]));

    /* A missing dictionary entry renders as its own dot-separated key. */
    /* A dictionary key is always lowercase after the dot, which is what keeps
       this from firing on ordinary sentence punctuation such as "8000Hz. Khi". */
    var KEYISH = /(?:^|[\s>"'])(?:g|nav|cat|col|lbl|card|sort|f|cart|coupon|toast|search|qv|ft|m|home|coll|pdp|co|cmp|wl|sp|bl|art|ac|dl|su|ann)\.[a-z][a-zA-Z0-9-]*(?:\.[a-z][a-zA-Z0-9-]*)*(?=$|[\s<"'])/;
    var keyish = shown.match(KEYISH);
    must(p, !keyish, 'missing translation key rendered on ' + spec + ': ' + (keyish && keyish[0]));

    /* Attributes are invisible to textContent but are still read aloud, and
       that is exactly where the first pass left untranslated labels behind. */
    var attrLeftovers = [];
    Array.prototype.forEach.call(clone.querySelectorAll('[aria-label],[placeholder],[alt],[title]'), function (el) {
      ['aria-label', 'placeholder', 'alt', 'title'].forEach(function (a) {
        var v = el.getAttribute(a);
        if (!v) return;
        if (LEFTOVER.test(v) || KEYISH.test(' ' + v + ' ')) attrLeftovers.push(a + '="' + v + '"');
      });
    });
    must(p, !attrLeftovers.length, 'untranslated attribute on ' + spec + ': ' + attrLeftovers[0]);
    must(p, d.querySelectorAll('.footer__colhead').length === 4, 'footer columns wrong on ' + spec);
    must(p, d.querySelector('.skip-link'), 'skip link missing on ' + spec);
    must(p, d.querySelector('[data-theme-toggle]'), 'theme toggle missing on ' + spec);
    must(p, d.querySelectorAll('h1').length === 1, 'expected exactly one h1 on ' + spec + ', found ' + d.querySelectorAll('h1').length);
    if (p.length) { failures++; console.log('FAIL chrome ' + spec); p.slice(0, 4).forEach((x) => console.log('   ' + x)); }
    else console.log('pass chrome ' + spec);
    dom.window.close();
  }
}

/* Every page must render in Vietnamese with no English chrome left behind. */
async function vietnameseChecks() {
  console.log('\n--- vietnamese ---');
  for (const spec of PAGES) {
    const { dom, errors } = loadPage(spec, 'vi');
    await ready(dom);
    const w = dom.window;
    const d = w.document;
    const p = errors.slice();

    must(p, w.I18N.lang === 'vi', 'language not switched on ' + spec);
    must(p, d.documentElement.getAttribute('lang') === 'vi', 'html lang wrong on ' + spec);
    must(p, w.I18N.t('g.addToCart') === 'Thêm vào giỏ', 'Vietnamese lookup wrong on ' + spec);
    must(p, w.I18N.t('g.reviews', { n: 12 }) === '12 đánh giá', 'interpolation failed on ' + spec);

    const clone = d.body.cloneNode(true);
    Array.prototype.forEach.call(clone.querySelectorAll('script, style'), (el) => el.remove());
    const shown = clone.textContent || '';

    /* Any English chrome word surviving into the Vietnamese rendering means a
       literal was missed. Product names stay English by design, so the probe
       words are ones only the storefront itself would say. */
    const eng = shown.match(/(Add to cart|Sold out|In stock|Loading|View all|Checkout|Sort by|Filters|Your cart|Sign in)/);
    must(p, !eng, 'English chrome left in the Vietnamese rendering of ' + spec + ': ' + (eng && eng[0]));

    if (p.length) { failures++; console.log('FAIL vi ' + spec); p.slice(0, 3).forEach((x) => console.log('   ' + x)); }
    else console.log('pass vi ' + spec);
    dom.window.close();
  }
}

async function englishChecks() {
  console.log('\n--- english ---');
  for (const spec of PAGES) {
    const { dom, errors } = loadPage(spec, 'en');
    await ready(dom);
    const d = dom.window.document;
    const p = errors.slice();

    must(p, dom.window.I18N.lang === 'en', 'language not switched on ' + spec);
    must(p, d.documentElement.getAttribute('lang') === 'en', 'html lang attribute wrong on ' + spec);

    const clone = d.body.cloneNode(true);
    Array.prototype.forEach.call(clone.querySelectorAll('script, style'), (el) => el.remove());
    const shown = clone.textContent || '';

    /* Diacritics are the tell: no Vietnamese word survives into the English
       rendering, and the product catalog itself is plain ASCII. */
    /* Reviewer names are proper nouns and keep their diacritics in both
       languages, so probe for words only the storefront itself would say
       rather than for any accented character. */
    const viet = shown.match(/(Thêm vào giỏ|Giỏ hàng|Sản phẩm|Đang tải|Tất cả|Xem chi tiết|Thanh toán|Bộ lọc|Sắp xếp|Còn hàng|Hết hàng|Đánh giá|Danh mục)/);
    must(p, !viet, 'Vietnamese chrome left in the English rendering of ' + spec + ': ' + (viet && viet[0]));

    const keyish = shown.match(/\b(?:g|nav|cat|col|lbl|card|sort|f|cart|coupon|toast|search|qv|ft|m|home|coll|pdp|co|cmp|wl|sp|bl|art|ac|dl|su|ann)\.[a-zA-Z0-9.]+\b/);
    must(p, !keyish, 'missing English translation on ' + spec + ': ' + (keyish && keyish[0]));

    if (p.length) { failures++; console.log('FAIL en ' + spec); p.slice(0, 3).forEach((x) => console.log('   ' + x)); }
    else console.log('pass en ' + spec);
    dom.window.close();
  }
}

(async function main() {
  for (const [spec, fn] of QUEUE) await runCheck(spec, fn);
  await checkoutWithCart();
  await chromeChecks();
  await vietnameseChecks();
  await englishChecks();
  console.log('\n' + (failures ? failures + ' FAILURES' : 'all checks passed'));
  process.exit(failures ? 1 : 0);
})();
