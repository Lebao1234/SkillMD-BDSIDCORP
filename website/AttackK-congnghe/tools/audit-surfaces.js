/* Deep audit: opens the interactive surfaces the smoke suite never reaches and
   scans them in both languages for untranslated literals and missing keys. */
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = require('path').resolve(__dirname, '..');

const POLYFILL = `<script>
window.matchMedia = window.matchMedia || function (q) {
  return { media: q, matches: false, addListener(){}, removeListener(){}, addEventListener(){}, removeEventListener(){} };
};
window.IntersectionObserver = window.IntersectionObserver || function (cb) {
  this.observe = function (el) { cb([{ target: el, isIntersecting: true, boundingClientRect: { top: 0 } }], this); };
  this.unobserve = function(){}; this.disconnect = function(){};
};
window.scrollTo = window.scrollTo || function(){};
if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = function(){};
if (!Element.prototype.scrollBy) Element.prototype.scrollBy = function(){};
</script>`;

function load(file, lang) {
  let html = fs.readFileSync(path.join(ROOT, file.split('?')[0]), 'utf8');
  html = html.replace(/<link rel="stylesheet" href="https:[^>]*>/g, '');
  html = html.replace(/<script src="([^"]+)"><\/script>/g,
    (m, src) => '<script>' + fs.readFileSync(path.join(ROOT, src), 'utf8') + '</script>');
  const seed = '<script>try{localStorage.setItem("as.lang",JSON.stringify("' + lang + '"));}catch(e){}</script>';
  html = html.replace('<head>', '<head>' + POLYFILL + seed);

  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', (e) => errors.push('jsdomError: ' + (e.message || e)));
  const q = file.indexOf('?') > -1 ? file.slice(file.indexOf('?')) : '';
  const dom = new JSDOM(html, {
    runScripts: 'dangerously', pretendToBeVisual: true,
    url: 'https://local.test/' + file.split('?')[0] + q, virtualConsole: vc,
  });
  return { dom, errors };
}

function ready(dom) {
  return new Promise((res) => {
    const done = () => setTimeout(() => setTimeout(res, 0), 0);
    if (dom.window.document.readyState === 'complete') done();
    else dom.window.addEventListener('load', done);
  });
}

/* Words that can only come from a missed literal, per language. */
const VI_LEFTOVER = /\b(Khong|San pham|Gio hang|Danh muc|Tat ca|Them vao gio|Tam het hang|Con hang|Het hang|Thanh toan|Tai khoan|Ho tro|So luong|Tiet kiem|Tong cong|Bo loc|Ket qua|Dang tai|Xem nhanh|Dong|Giam so luong|Tang so luong|Mo gio hang|Da them|Xem trang chi tiet|Phien ban|Goi y|Dieu huong|Len dau trang|Tim san pham|Tim kiem san pham)\b/;
const EN_IN_VI = /\b(Add to cart|Sold out|In stock|Loading|View all|Checkout|Sort by|Filters|Sign in|Quick view|Close|Remove|Navigation|Back to top|Version|Try:)\b/;
const VI_IN_EN = /(Thêm vào giỏ|Giỏ hàng|Sản phẩm|Đang tải|Tất cả|Xem chi tiết|Thanh toán|Bộ lọc|Sắp xếp|Còn hàng|Hết hàng|Danh mục|Xem nhanh|Điều hướng|Gợi ý|Phiên bản|Đóng|Số lượng)/;
const KEYISH = /(?:^|[\s>"'])(?:g|nav|cat|col|lbl|card|sort|f|cart|coupon|toast|search|qv|ft|m|home|coll|pdp|co|cmp|wl|sp|bl|art|ac|dl|su|ann)\.[a-z][a-zA-Z0-9-]*(?:\.[a-z][a-zA-Z0-9-]*)*(?=$|[\s<"'])/;

let failures = 0;
const found = [];

function scan(label, node, lang, problems) {
  if (!node) { problems.push(label + ': node missing'); return; }
  const clone = node.cloneNode(true);
  Array.prototype.forEach.call(clone.querySelectorAll('script, style'), (el) => el.remove());
  const text = clone.textContent || '';

  const vi = text.match(VI_LEFTOVER);
  if (vi) problems.push(label + ': untranslated literal "' + vi[0] + '"');

  const key = text.match(KEYISH);
  if (key) problems.push(label + ': raw key "' + key[0] + '"');

  if (lang === 'vi') {
    const en = text.match(EN_IN_VI);
    if (en) problems.push(label + ': English left in Vietnamese "' + en[0] + '"');
  } else {
    const v = text.match(VI_IN_EN);
    if (v) problems.push(label + ': Vietnamese left in English "' + v[0] + '"');
  }

  /* Attribute values are invisible to textContent but still read aloud. */
  Array.prototype.forEach.call(clone.querySelectorAll('[aria-label],[placeholder],[title]'), (el) => {
    ['aria-label', 'placeholder', 'title'].forEach((a) => {
      const v = el.getAttribute(a);
      if (!v) return;
      if (VI_LEFTOVER.test(v)) problems.push(label + ': untranslated ' + a + ' "' + v + '"');
      if (KEYISH.test(v)) problems.push(label + ': raw key in ' + a + ' "' + v + '"');
      if (lang === 'en' && VI_IN_EN.test(v)) problems.push(label + ': Vietnamese ' + a + ' "' + v + '"');
      if (lang === 'vi' && EN_IN_VI.test(v)) problems.push(label + ': English ' + a + ' "' + v + '"');
    });
  });
}

async function auditSurfaces(lang) {
  console.log('\n--- interactive surfaces, ' + lang + ' ---');

  /* ---------- home page chrome ---------- */
  {
    const { dom, errors } = load('index.html', lang);
    await ready(dom);
    const w = dom.window, d = w.document;
    const p = errors.slice();

    /* Mega catalog panel */
    d.querySelector('.js-mega').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
    if (!d.querySelector('[data-mega]').classList.contains('is-open')) p.push('mega panel did not open');
    scan('mega panel', d.querySelector('[data-mega]'), lang, p);

    /* Mobile navigation drawer */
    d.querySelector('[data-mobilenav]').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
    scan('mobile drawer', d.querySelector('[data-drawer="mobilenav"]'), lang, p);

    /* Search overlay, empty then with a query */
    d.querySelector('[data-open-search]').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
    scan('search overlay (empty)', d.querySelector('[data-searchbox]'), lang, p);
    const si = d.querySelector('[data-search-input]');
    si.value = 'carbon';
    si.dispatchEvent(new w.Event('input', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 260));
    scan('search overlay (results)', d.querySelector('[data-searchbox]'), lang, p);
    si.value = 'zzzqqq';
    si.dispatchEvent(new w.Event('input', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 260));
    scan('search overlay (no results)', d.querySelector('[data-searchbox]'), lang, p);

    /* Inline type-ahead */
    const hi = d.querySelector('[data-hsearch-input]');
    hi.value = 'carbon';
    hi.dispatchEvent(new w.Event('input', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 260));
    scan('typeahead (results)', d.querySelector('[data-typeahead]'), lang, p);
    hi.value = 'zzzqqq';
    hi.dispatchEvent(new w.Event('input', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 260));
    scan('typeahead (no results)', d.querySelector('[data-typeahead]'), lang, p);

    /* Cart drawer, empty */
    d.querySelector('[data-open-cart]').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
    scan('cart drawer (empty)', d.querySelector('[data-drawer="cart"]'), lang, p);

    /* Cart drawer with a line, including the free-shipping meter both ways */
    const cheap = w.Catalog.all.filter((x) => x.available && x.minPrice < 20)[0];
    const dear = w.Catalog.all.filter((x) => x.available && x.minPrice > 80)[0];
    w.Store.addToCart({
      variantId: cheap.variants[0].id, handle: cheap.handle, title: cheap.shortTitle,
      variantTitle: cheap.variants[0].title, price: cheap.variants[0].price,
      image: cheap.images[0], qty: 1,
    });
    scan('cart drawer (under free shipping)', d.querySelector('[data-drawer="cart"]'), lang, p);
    w.Store.addToCart({
      variantId: dear.variants[0].id, handle: dear.handle, title: dear.shortTitle,
      variantTitle: dear.variants[0].title, price: dear.variants[0].price,
      image: dear.images[0], qty: 1,
    });
    scan('cart drawer (over free shipping)', d.querySelector('[data-drawer="cart"]'), lang, p);

    /* Quick view, on a product that has several variants */
    const multi = w.Catalog.all.filter((x) => x.variants.length > 2 && x.available)[0];
    w.UI.openQuickView(multi.handle, null);
    scan('quick view', d.querySelector('[data-modal="quickview"]'), lang, p);

    /* Toasts of each kind */
    w.UI.toast(w.I18N.t('toast.added', { name: 'X' }), 'ok', w.I18N.t('toast.openCart'), 'cart.html');
    w.UI.toast(w.I18N.t('toast.compareFull', { n: 4 }), 'bad');
    scan('toasts', d.querySelector('[data-toasts]'), lang, p);

    report('index.html chrome', p);
    w.close();
  }

  /* ---------- collection: filter panel, chips, list view ---------- */
  {
    const { dom, errors } = load('collection.html?c=mouse', lang);
    await ready(dom);
    const w = dom.window, d = w.document;
    const p = errors.slice();

    scan('filter rail', d.querySelector('[data-filters]'), lang, p);

    const box = d.querySelector('[data-facet="connection"]');
    box.checked = true;
    box.dispatchEvent(new w.Event('change', { bubbles: true }));
    scan('active filter chips', d.querySelector('[data-activefilters]'), lang, p);

    /* Price chip wording, both bounded and open ended */
    const pmin = d.querySelector('[data-price="min"]');
    pmin.value = '40';
    d.querySelector('[data-price-apply]').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
    scan('price chip (open ended)', d.querySelector('[data-activefilters]'), lang, p);

    /* Load more button label */
    const lm = d.querySelector('[data-loadmore]');
    if (lm) {
      if (!lm.textContent.trim()) p.push('load more button has no label');
      if (KEYISH.test(lm.textContent)) p.push('load more raw key: ' + lm.textContent);
      scan('load more', lm, lang, p);
    }

    /* Empty result state */
    const sensor = d.querySelector('[data-facet="sensor"]');
    if (sensor) {
      const pmax = d.querySelector('[data-price="max"]');
      pmax.value = '1';
      d.querySelector('[data-price-apply]').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
      scan('empty results', d.querySelector('[data-grid]'), lang, p);
    }

    report('collection.html', p);
    w.close();
  }

  /* ---------- product: bundle, specs, reviews, sticky bar ---------- */
  {
    const { dom, errors } = load('product.html?handle=attack-shark-x11ultra', lang);
    await ready(dom);
    const w = dom.window, d = w.document;
    const p = errors.slice();

    scan('buy box', d.querySelector('.buybox'), lang, p);
    scan('specs', d.querySelector('[data-specs]'), lang, p);
    scan('reviews', d.querySelector('[data-review-summary]'), lang, p);
    scan('review list', d.querySelector('[data-review-list]'), lang, p);
    scan('bundle', d.querySelector('[data-pdp-block]'), lang, p);
    scan('sticky bar', d.querySelector('[data-stickybuy]'), lang, p);
    scan('downloads', d.querySelector('[data-downloads]'), lang, p);

    d.querySelector('[data-fbt-toggle]').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
    scan('bundle (one added)', d.querySelector('[data-pdp-block]'), lang, p);

    /* A sold-out product exercises the other branch of every stock label. */
    const gone = w.Catalog.all.filter((x) => !x.available)[0];
    if (gone) {
      const g = load('product.html?handle=' + gone.handle, lang);
      await ready(g.dom);
      scan('sold out buy box', g.dom.window.document.querySelector('.buybox'), lang, p);
      g.dom.window.close();
    }

    report('product.html', p);
    w.close();
  }

  /* ---------- cart page and checkout ---------- */
  {
    const seeded = '<script>try{localStorage.setItem("as.cart",JSON.stringify([{variantId:"v1",handle:"attack-shark-x11ultra",title:"X11 ULTRA",variantTitle:"Black",price:109.99,compareAt:139.99,image:"x.png",qty:2}]));}catch(e){}</script>';
    ['cart.html', 'checkout.html'].forEach(() => {});

    for (const file of ['cart.html', 'checkout.html']) {
      let html = fs.readFileSync(path.join(ROOT, file), 'utf8');
      html = html.replace(/<link rel="stylesheet" href="https:[^>]*>/g, '');
      html = html.replace(/<script src="([^"]+)"><\/script>/g,
        (m, src) => '<script>' + fs.readFileSync(path.join(ROOT, src), 'utf8') + '</script>');
      html = html.replace('<head>', '<head>' + POLYFILL +
        '<script>try{localStorage.setItem("as.lang",JSON.stringify("' + lang + '"));}catch(e){}</script>' + seeded);

      const errs = [];
      const vc = new VirtualConsole();
      vc.on('jsdomError', (e) => errs.push('jsdomError: ' + (e.message || e)));
      const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://local.test/' + file, virtualConsole: vc });
      await ready(dom);
      const w = dom.window, d = w.document;
      const p = errs.slice();

      if (file === 'cart.html') {
        scan('cart lines', d.querySelector('[data-cart-lines]'), lang, p);
        scan('cart summary', d.querySelector('[data-summary]'), lang, p);
        scan('coupon form', d.querySelector('[data-coupon]'), lang, p);

        /* Applied coupon, and the inline error for a bad one. */
        d.querySelector('[data-coupon-input]').value = 'SHARK10';
        d.querySelector('[data-coupon-apply]').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
        scan('coupon applied', d.querySelector('[data-coupon]'), lang, p);
        scan('summary with discount', d.querySelector('[data-summary]'), lang, p);

        d.querySelector('[data-coupon-clear]').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
        d.querySelector('[data-coupon-input]').value = 'NOPE';
        d.querySelector('[data-coupon-apply]').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
        const msg = d.querySelector('[data-coupon-msg]').textContent;
        if (!msg) p.push('invalid coupon produced no message');
        if (VI_LEFTOVER.test(msg) || KEYISH.test(msg)) p.push('coupon error text: ' + msg);
        if (lang === 'en' && VI_IN_EN.test(msg)) p.push('coupon error not translated: ' + msg);

        /* The minimum-spend branch of the coupon copy. */
        d.querySelector('[data-coupon-input]').value = 'NEWGEAR20';
        d.querySelector('[data-coupon-apply]').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
        const el2 = d.querySelector('[data-coupon-msg]');
        const msg2 = el2 ? el2.textContent : '';
        if (msg2 && lang === 'en' && VI_IN_EN.test(msg2)) p.push('coupon minimum text not translated: ' + msg2);
      } else {
        scan('checkout steps', d.querySelector('[data-steps]'), lang, p);
        scan('checkout contact', d.querySelector('[data-step-panel="contact"]'), lang, p);
        scan('order summary', d.querySelector('[data-order-summary]'), lang, p);

        /* Validation messages */
        d.querySelector('[data-next]').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
        scan('validation errors', d.querySelector('[data-step-panel="contact"]'), lang, p);

        /* Shipping and payment panels */
        ['#ck-email|a@b.co', '#ck-phone|0901234567', '#ck-name|Nguyen Van A',
         '#ck-address|12 Nguyen Hue', '#ck-city|Ha Noi', '#ck-zip|10000'].forEach((pair) => {
          const [sel, val] = pair.split('|');
          d.querySelector(sel).value = val;
        });
        d.querySelector('[data-next]').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
        scan('shipping options', d.querySelector('[data-step-panel="shipping"]'), lang, p);
        d.querySelector('[data-next]').dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
        scan('payment options', d.querySelector('[data-step-panel="payment"]'), lang, p);

        /* Cash on delivery adds a surcharge row to the summary. */
        const cod = d.querySelector('[data-pay-options] input[value="cod"]');
        if (cod) {
          cod.checked = true;
          cod.dispatchEvent(new w.Event('change', { bubbles: true }));
          scan('summary with COD', d.querySelector('[data-order-summary]'), lang, p);
        }
      }

      report(file, p);
      w.close();
    }
  }

  /* ---------- compare, wishlist, downloads ---------- */
  {
    const { dom, errors } = load('compare.html', lang);
    await ready(dom);
    const w = dom.window, d = w.document;
    const p = errors.slice();
    scan('compare empty', d.querySelector('[data-compare-empty]'), lang, p);
    w.Store.toggleCompare('attack-shark-x11ultra');
    scan('compare one', d.querySelector('[data-compare-empty]'), lang, p);
    w.Store.toggleCompare('attack-shark-r11-ultra-carbon-fiber-wireless-8k-paw3950max-gaming-mouse');
    scan('compare table', d.querySelector('[data-compare-table]'), lang, p);
    report('compare.html', p);
    w.close();
  }

  {
    const { dom, errors } = load('wishlist.html', lang);
    await ready(dom);
    const w = dom.window, d = w.document;
    const p = errors.slice();
    scan('wishlist empty', d.querySelector('[data-wish-empty]'), lang, p);
    const btn = d.querySelector('[data-wish-addall]');
    if (btn && !btn.textContent.trim()) p.push('add-all button has no label');
    w.Store.toggleWishlist('attack-shark-x11ultra');
    scan('wishlist header', d.querySelector('[data-wish-actions]'), lang, p);
    report('wishlist.html', p);
    w.close();
  }

  {
    const { dom, errors } = load('downloads.html', lang);
    await ready(dom);
    const w = dom.window, d = w.document;
    const p = errors.slice();
    scan('download grid', d.querySelector('[data-dl-grid]'), lang, p);
    const q = d.querySelector('[data-dl-search]');
    q.value = 'zzzqqq';
    q.dispatchEvent(new w.Event('input', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 220));
    scan('download empty state', d.querySelector('[data-dl-grid]'), lang, p);
    report('downloads.html', p);
    w.close();
  }

  /* ---------- article: related product picker ---------- */
  {
    const posts = require(path.join(ROOT, 'assets/data/posts.json'));
    for (const post of posts) {
      const { dom, errors } = load('article.html?slug=' + post.slug, lang);
      await ready(dom);
      const d = dom.window.document;
      const p = errors.slice();
      const n = d.querySelectorAll('[data-art-products] .pcard').length;
      if (n !== 4) p.push(post.slug + ': expected 4 related products, got ' + n);
      scan('article ' + post.slug, d.querySelector('[data-art-body]'), lang, p);
      report('article ' + post.slug, p);
      dom.window.close();
    }
  }
}

function report(label, problems) {
  if (problems.length) {
    failures++;
    console.log('FAIL ' + label);
    problems.slice(0, 6).forEach((x) => { console.log('   ' + x); found.push(label + ' :: ' + x); });
  } else {
    console.log('pass ' + label);
  }
}

(async function main() {
  await auditSurfaces('vi');
  await auditSurfaces('en');
  console.log('\n' + (failures ? failures + ' SURFACES WITH PROBLEMS' : 'every surface clean'));
  if (found.length) {
    console.log('\n--- unique problems ---');
    [...new Set(found.map((f) => f.split(' :: ')[1]))].forEach((x) => console.log('  ' + x));
  }
  process.exit(failures ? 1 : 0);
})();
