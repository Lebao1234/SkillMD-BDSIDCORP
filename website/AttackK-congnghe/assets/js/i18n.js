/* ============================================================================
   I18N
   Two languages, Vietnamese and English. Vietnamese is the default.

   HOW IT WORKS
   Every translatable string has a dot-namespaced key. The dictionary stores
   each key as a [vi, en] pair, so the two languages sit on the same line and a
   missing or drifted translation is visible at a glance.

     - markup uses data-i18n="key" for text, and data-i18n-<attr>="key" for
       attributes (placeholder, aria-label, alt, title, content)
     - scripts call t('key') or t('key', { name: 'value' }) for {name} slots

   Switching language persists the choice and reloads. That is the same route
   the currency switcher takes, and it is what guarantees every controller
   re-renders in the new language with no chance of a stale string surviving.

   Product names and descriptions are NOT translated. They come from a supplier
   catalog and read as model identifiers in both languages; translating
   "PAW3950MAX Gaming Mouse" would help nobody. Everything the storefront
   itself says is translated.
   ========================================================================= */
(function (global) {
  'use strict';

  var LANGS = { vi: 'Tiếng Việt', en: 'English' };
  var DEFAULT = 'vi';

  function read() {
    try {
      var v = JSON.parse(global.localStorage.getItem('as.lang'));
      return LANGS[v] ? v : null;
    } catch (err) {
      return null;
    }
  }

  /* No stored choice: follow the browser, but only as far as English. Anything
     that is not clearly English gets Vietnamese, since that is the default. */
  function detect() {
    var stored = read();
    if (stored) return stored;
    var nav = (global.navigator && (global.navigator.language || global.navigator.userLanguage)) || '';
    return /^en/i.test(nav) ? 'en' : DEFAULT;
  }

  var lang = detect();
  var DICT = {};

  function extend(obj) {
    Object.keys(obj).forEach(function (k) { DICT[k] = obj[k]; });
  }

  /* A missing key returns the key itself rather than an empty string, so a gap
     shows up in the interface instead of silently deleting a label. */
  function t(key, vars) {
    var entry = DICT[key];
    var out = entry ? (entry[lang === 'en' ? 1 : 0] || entry[0]) : key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        out = out.split('{' + k + '}').join(String(vars[k]));
      });
    }
    return out;
  }

  /* Plural helper. Vietnamese has no plural inflection, so the two languages
     genuinely differ here and the key carries both forms for English. */
  function plural(key, n, vars) {
    var entry = DICT[key];
    if (!entry) return key;
    if (lang !== 'en') return t(key, vars);
    var forms = String(entry[1]).split('|');
    var pick = n === 1 ? forms[0] : (forms[1] || forms[0]);
    var out = pick;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        out = out.split('{' + k + '}').join(String(vars[k]));
      });
    }
    return out;
  }

  var ATTRS = ['placeholder', 'aria-label', 'alt', 'title', 'content', 'value', 'label'];

  function apply(root) {
    var scope = root || global.document;
    /* The brand name is interpolated by so many strings that it is supplied to
       every markup lookup rather than repeated at each call site. */
    var vars = { brand: (global.BRAND && global.BRAND.name) || '' };

    Array.prototype.forEach.call(scope.querySelectorAll('[data-i18n]'), function (el) {
      el.textContent = t(el.getAttribute('data-i18n'), vars);
    });

    /* data-i18n-html is for the few strings that legitimately carry markup,
       such as a line break inside a display heading. The values come from this
       dictionary, never from user input. */
    Array.prototype.forEach.call(scope.querySelectorAll('[data-i18n-html]'), function (el) {
      el.innerHTML = t(el.getAttribute('data-i18n-html'), vars);
    });

    ATTRS.forEach(function (attr) {
      var sel = '[data-i18n-' + attr + ']';
      Array.prototype.forEach.call(scope.querySelectorAll(sel), function (el) {
        el.setAttribute(attr, t(el.getAttribute('data-i18n-' + attr), vars));
      });
    });
  }

  function setLang(next) {
    if (!LANGS[next] || next === lang) return;
    try { global.localStorage.setItem('as.lang', JSON.stringify(next)); } catch (err) {}
    global.location.reload();
  }

  global.I18N = {
    get lang() { return lang; },
    langs: LANGS,
    t: t,
    plural: plural,
    extend: extend,
    apply: apply,
    setLang: setLang,
    /* Locale tag for Intl and for the html lang attribute. */
    locale: function () { return lang === 'en' ? 'en-US' : 'vi-VN'; },
  };

  /* Set as early as possible so assistive technology and the browser both know
     what language the document is in before content renders. */
  if (global.document && global.document.documentElement) {
    global.document.documentElement.setAttribute('lang', lang);
  }

  /* ======================================================================
     DICTIONARY, PART 1: CHROME AND COMPONENTS
     Page prose lives in i18n-content.js.
     ====================================================================== */
  extend({
    /* ---- generic ---- */
    'g.brandLine': ['Thiết bị ngoại vi độ chính xác cao cho người chơi đòi hỏi độ trễ thấp nhất.',
                    'Precision peripherals for players who care about latency above all else.'],
    'g.home': ['Trang chủ', 'Home'],
    'g.catalog': ['Danh mục', 'Catalog'],
    'g.products': ['Sản phẩm', 'Products'],
    'g.product': ['Sản phẩm', 'Product'],
    'g.viewAll': ['Xem tất cả', 'View all'],
    'g.viewDetail': ['Xem chi tiết', 'View details'],
    'g.addToCart': ['Thêm vào giỏ', 'Add to cart'],
    'g.buyNow': ['Mua ngay', 'Buy now'],
    'g.preorder': ['Đặt trước', 'Pre-order'],
    'g.soldOut': ['Tạm hết hàng', 'Sold out'],
    'g.inStock': ['Còn hàng', 'In stock'],
    'g.outOfStock': ['Hết hàng', 'Out of stock'],
    'g.new': ['Mới', 'New'],
    'g.sale': ['Giảm giá', 'Sale'],
    'g.quantity': ['Số lượng', 'Quantity'],
    'g.remove': ['Xóa', 'Remove'],
    'g.close': ['Đóng', 'Close'],
    'g.apply': ['Áp dụng', 'Apply'],
    'g.continue': ['Tiếp tục', 'Continue'],
    'g.back': ['Quay lại', 'Back'],
    'g.loading': ['Đang tải', 'Loading'],
    'g.free': ['Miễn phí', 'Free'],
    'g.sortBy': ['Sắp xếp', 'Sort by'],
    'g.breadcrumb': ['Đường dẫn', 'Breadcrumb'],
    'g.skip': ['Bỏ qua, đi thẳng tới nội dung', 'Skip to main content'],
    'g.minutes': ['{n} phút đọc', '{n} min read'],
    'g.reviews': ['{n} đánh giá', '{n} reviews'],
    'g.decrease': ['Giảm số lượng', 'Decrease quantity'],
    'g.increase': ['Tăng số lượng', 'Increase quantity'],
    'g.optional': ['Không bắt buộc.', 'Optional.'],
    'g.pageOf': ['Phân trang', 'Pagination'],
    'g.prevPage': ['Trang trước', 'Previous page'],
    'g.nextPage': ['Trang kế tiếp', 'Next page'],

    /* ---- announcement ticker ---- */
    'ann.ship': ['Miễn phí vận chuyển tiêu chuẩn cho đơn từ 59 USD',
                 'Free standard shipping on orders over 59 USD'],
    'ann.ship.cta': ['Chính sách', 'Policy'],
    'ann.preorder': ['R86 HE đang mở đặt trước, cọc 2 USD để giảm 40 USD',
                     'R86 HE pre-orders are open: reserve for 2 USD, save 40 USD'],
    'ann.preorder.cta': ['Đặt trước', 'Reserve'],
    'ann.f1': ['F1 AIR 39 gram đã có hàng, nhẹ nhất trong dòng sản phẩm',
               'F1 AIR at 39 grams is in stock, the lightest we make'],
    'ann.f1.cta': ['Mua ngay', 'Shop now'],
    'ann.returns': ['Đổi trả không cần lý do trong 15 ngày, bảo hành 12 tháng',
                    'No-questions returns for 15 days, 12 month warranty'],
    'ann.returns.cta': ['Chi tiết', 'Details'],
    'ann.prev': ['Thông báo trước', 'Previous announcement'],
    'ann.next': ['Thông báo kế tiếp', 'Next announcement'],

    /* ---- header ---- */
    'nav.openMenu': ['Mở menu điều hướng', 'Open navigation menu'],
    'nav.backHome': ['{brand}, về trang chủ', '{brand}, back to home'],
    'nav.shortcuts': ['Lối tắt', 'Shortcuts'],
    'nav.new': ['Mới về', 'New in'],
    'nav.sale': ['Giảm giá', 'Sale'],
    'nav.blog': ['Bài viết', 'Journal'],
    'nav.support': ['Hỗ trợ', 'Support'],
    'nav.search': ['Tìm kiếm sản phẩm', 'Search products'],
    'nav.searchPlaceholder': ['Tìm chuột, bàn phím, cảm biến', 'Search mice, keyboards, sensors'],
    'nav.searchLabel': ['Tìm sản phẩm', 'Search for a product'],
    'nav.suggestions': ['Gợi ý tìm kiếm', 'Search suggestions'],
    'nav.currency': ['Đơn vị tiền tệ', 'Currency'],
    'nav.language': ['Ngôn ngữ', 'Language'],
    'nav.theme': ['Đổi giao diện sáng tối', 'Toggle light and dark theme'],
    'nav.themeToDark': ['Chuyển sang giao diện tối', 'Switch to dark theme'],
    'nav.themeToLight': ['Chuyển sang giao diện sáng', 'Switch to light theme'],
    'nav.account': ['Tài khoản của tôi', 'My account'],
    'nav.compare': ['Bảng so sánh', 'Comparison table'],
    'nav.wishlist': ['Danh sách yêu thích', 'Wishlist'],
    'nav.cart': ['Mở giỏ hàng', 'Open cart'],

    /* ---- catalog panel ---- */
    'cat.mice': ['Chuột', 'Mice'],
    'cat.keyboards': ['Bàn phím', 'Keyboards'],
    'cat.audioSurface': ['Âm thanh và bề mặt', 'Audio and surfaces'],
    'cat.accessories': ['Phụ kiện và combo', 'Accessories and bundles'],
    'cat.allMice': ['Tất cả chuột', 'All mice'],
    'cat.triMode': ['Không dây tri-mode', 'Tri-mode wireless'],
    'cat.polling8k': ['Polling 8000Hz', '8000Hz polling'],
    'cat.under50': ['Dưới 50 gram', 'Under 50 grams'],
    'cat.paw3950': ['Cảm biến PAW3950MAX', 'PAW3950MAX sensor'],
    'cat.mechKb': ['Bàn phím cơ', 'Mechanical keyboards'],
    'cat.heKb': ['Bàn phím từ tính HE', 'Hall effect keyboards'],
    'cat.rapidTrigger': ['Rapid trigger 0.005mm', '0.005mm rapid trigger'],
    'cat.keycaps': ['Keycap', 'Keycaps'],
    'cat.switches': ['Switch rời', 'Loose switches'],
    'cat.headsets': ['Tai nghe', 'Headsets'],
    'cat.mousepads': ['Lót chuột', 'Mousepads'],
    'cat.padsBest': ['Lót chuột bán chạy', 'Best selling pads'],
    'cat.cables': ['Cáp xoắn aviator', 'Aviator coiled cables'],
    'cat.restsGrip': ['Kê tay và grip tape', 'Wrist rests and grip tape'],
    'cat.bundles': ['Combo tiết kiệm', 'Value bundles'],
    'cat.newIn': ['Hàng mới về', 'New arrivals'],
    'cat.onSale': ['Đang giảm giá', 'On sale'],
    'cat.featured': ['Đang được chọn nhiều', 'Popular right now'],

    /* ---- collection titles and blurbs ---- */
    'col.all.title': ['Toàn bộ sản phẩm', 'Everything we make'],
    'col.all.blurb': ['Bàn phím, chuột, tai nghe và phụ kiện của {brand}.',
                      'Keyboards, mice, headsets and accessories from {brand}.'],
    'col.mouse.title': ['Chuột chơi game', 'Gaming mice'],
    'col.mouse.blurb': ['Siêu nhẹ, cảm biến PixArt, polling tới 8000Hz. Có bản dây, không dây và tri-mode.',
                        'Superlight bodies, PixArt sensors, polling up to 8000Hz. Wired, wireless and tri-mode.'],
    'col.keyboard.title': ['Bàn phím cơ', 'Mechanical keyboards'],
    'col.keyboard.blurb': ['Gasket mount, tri-mode, keycap PBT. Từ layout 65 phần trăm đến full size.',
                           'Gasket mount, tri-mode, PBT keycaps. From 65 percent layouts to full size.'],
    'col.he.title': ['Bàn phím từ tính HE', 'Hall effect keyboards'],
    'col.he.blurb': ['Rapid trigger tới 0.005mm, actuation chỉnh được theo từng phím, snap tap.',
                     'Rapid trigger down to 0.005mm, per-key actuation, snap tap.'],
    'col.headset.title': ['Tai nghe', 'Headsets'],
    'col.headset.blurb': ['Âm thanh định hướng cho FPS, mic khử ồn, kết nối không dây độ trễ thấp.',
                          'Directional audio for FPS, noise-cancelling mic, low latency wireless.'],
    'col.mousepad.title': ['Lót chuột', 'Mousepads'],
    'col.mousepad.blurb': ['Vải phủ, kính cường lực và sợi carbon. Chọn theo kiểu chơi của bạn.',
                           'Coated cloth, tempered glass and carbon fibre. Pick the one that suits your aim.'],
    'col.cable.title': ['Cáp xoắn', 'Coiled cables'],
    'col.cable.blurb': ['Cáp xoắn aviator tháo rời, hỗ trợ sạc nhanh và truyền dữ liệu.',
                        'Detachable aviator coiled cables with fast charging and data transfer.'],
    'col.keycaps.title': ['Keycap', 'Keycaps'],
    'col.keycaps.blurb': ['Bộ keycap PBT double shot và các bộ màu giới hạn.',
                          'Double shot PBT sets and limited colourways.'],
    'col.switches.title': ['Switch', 'Switches'],
    'col.switches.blurb': ['Switch cơ và switch từ tính để thay nóng.',
                           'Mechanical and Hall effect switches for hot swapping.'],
    'col.accessories.title': ['Phụ kiện', 'Accessories'],
    'col.accessories.blurb': ['Kê tay, grip tape, vỏ bảo vệ và dụng cụ tháo lắp.',
                              'Wrist rests, grip tape, covers and pullers.'],
    'col.bundle.title': ['Combo tiết kiệm', 'Value bundles'],
    'col.bundle.blurb': ['Ghép sẵn chuột, bàn phím và phụ kiện với giá tốt hơn mua lẻ.',
                         'Mouse, keyboard and accessories paired for less than buying them apart.'],
    'col.new.title': ['Hàng mới về', 'New arrivals'],
    'col.new.blurb': ['Những sản phẩm vừa lên kệ trong bốn tháng gần nhất.',
                      'Everything added in the last four months.'],
    'col.sale.title': ['Đang giảm giá', 'On sale'],
    'col.sale.blurb': ['Các model đang có giá tốt hơn niêm yết.', 'Models currently priced below list.'],
    'col.best.title': ['Bán chạy nhất', 'Best selling'],
    'col.best.blurb': ['Xếp theo số lượng đã bán trong vòng một năm.', 'Ranked by units sold over the last year.'],
    'col.wireless.title': ['Thiết bị không dây', 'Wireless gear'],
    'col.wireless.blurb': ['Mọi thứ dùng kết nối 2.4GHz hoặc Bluetooth.', 'Everything on 2.4GHz or Bluetooth.'],
    'col.8k.title': ['Polling 8000Hz', '8000Hz polling'],
    'col.8k.blurb': ['Những model báo cáo vị trí 8000 lần mỗi giây.',
                     'Models that report position 8000 times per second.'],

    /* ---- category labels used on cards and facets ---- */
    'lbl.mouse': ['Chuột chơi game', 'Gaming mouse'],
    'lbl.keyboard': ['Bàn phím cơ', 'Mechanical keyboard'],
    'lbl.he-keyboard': ['Bàn phím từ tính HE', 'Hall effect keyboard'],
    'lbl.headset': ['Tai nghe', 'Headset'],
    'lbl.mousepad': ['Lót chuột', 'Mousepad'],
    'lbl.cable': ['Cáp xoắn', 'Coiled cable'],
    'lbl.keycaps': ['Keycap', 'Keycaps'],
    'lbl.switches': ['Switch', 'Switches'],
    'lbl.wrist-rest': ['Kê tay', 'Wrist rest'],
    'lbl.tools': ['Dụng cụ', 'Tools'],
    'lbl.cover': ['Vỏ bảo vệ', 'Cover'],
    'lbl.grip-tape': ['Grip tape', 'Grip tape'],
    'lbl.bundle': ['Combo', 'Bundle'],
    'lbl.accessories': ['Phụ kiện', 'Accessories'],

    /* ---- product card ---- */
    'card.saveWish': ['Lưu {name} vào danh sách yêu thích', 'Save {name} to your wishlist'],
    'card.addCompare': ['Thêm {name} vào bảng so sánh', 'Add {name} to the comparison table'],
    'card.quickView': ['Xem nhanh {name}', 'Quick view {name}'],
    'card.discount': ['Giảm {n} phần trăm', '{n} percent off'],
    'card.colours': ['{n} phiên bản màu', '{n} colourways'],

    /* ---- sorting ---- */
    'sort.featured': ['Nổi bật', 'Featured'],
    'sort.best': ['Bán chạy nhất', 'Best selling'],
    'sort.new': ['Mới nhất', 'Newest'],
    'sort.old': ['Cũ nhất', 'Oldest'],
    'sort.priceAsc': ['Giá thấp đến cao', 'Price, low to high'],
    'sort.priceDesc': ['Giá cao đến thấp', 'Price, high to low'],
    'sort.titleAsc': ['Tên A đến Z', 'Name, A to Z'],
    'sort.titleDesc': ['Tên Z đến A', 'Name, Z to A'],
    'sort.rating': ['Đánh giá cao nhất', 'Highest rated'],

    /* ---- facets ---- */
    'f.title': ['Bộ lọc', 'Filters'],
    'f.filtersFor': ['Bộ lọc sản phẩm', 'Product filters'],
    'f.availability': ['Tình trạng', 'Availability'],
    'f.inStockOnly': ['Chỉ hàng còn sẵn', 'In stock only'],
    'f.onSale': ['Đang giảm giá', 'On sale'],
    'f.price': ['Khoảng giá', 'Price range'],
    'f.priceMin': ['Giá thấp nhất', 'Lowest price'],
    'f.priceMax': ['Giá cao nhất', 'Highest price'],
    'f.to': ['đến', 'to'],
    'f.category': ['Danh mục', 'Category'],
    'f.connection': ['Kết nối', 'Connection'],
    'f.sensor': ['Cảm biến', 'Sensor'],
    'f.polling': ['Polling rate', 'Polling rate'],
    'f.switch': ['Loại switch', 'Switch type'],
    'f.weight': ['Trọng lượng', 'Weight'],
    'f.clearOne': ['Bỏ lọc {name}', 'Remove filter {name}'],
    'f.clearAll': ['Xóa tất cả bộ lọc', 'Clear all filters'],
    'f.priceChip': ['Giá {min} đến {max}', 'Price {min} to {max}'],
    'f.noLimit': ['không giới hạn', 'no limit'],
    'f.viewResults': ['Xem kết quả', 'View results'],
    'f.under50': ['Dưới 50g', 'Under 50g'],
    'f.50to59': ['50g đến 59g', '50g to 59g'],
    'f.60to69': ['60g đến 69g', '60g to 69g'],
    'f.70plus': ['70g trở lên', '70g and above'],
    'f.wireless24': ['2.4GHz không dây', '2.4GHz wireless'],
    'f.bluetooth': ['Bluetooth', 'Bluetooth'],
    'f.wired': ['Có dây', 'Wired'],
    'f.magnetic': ['Từ tính HE', 'Hall effect'],
    'f.optical': ['Quang học', 'Optical'],
    'f.mechanical': ['Cơ học', 'Mechanical'],

    /* ---- cart drawer and cart page ---- */
    'cart.title': ['Giỏ hàng', 'Cart'],
    'cart.close': ['Đóng giỏ hàng', 'Close cart'],
    'cart.empty.title': ['Giỏ hàng trống', 'Your cart is empty'],
    'cart.empty.text': ['Chưa có sản phẩm nào. Bắt đầu từ những model bán chạy nhất hoặc xem hàng mới về.',
                        'Nothing here yet. Start with the best sellers, or see what just arrived.'],
    'cart.empty.best': ['Xem bán chạy', 'Shop best sellers'],
    'cart.empty.new': ['Hàng mới về', 'New arrivals'],
    'cart.subtotal': ['Tạm tính', 'Subtotal'],
    'cart.savings': ['Tiết kiệm', 'You save'],
    'cart.shipping': ['Vận chuyển', 'Shipping'],
    'cart.tax': ['Thuế ước tính', 'Estimated tax'],
    'cart.total': ['Tổng cộng', 'Total'],
    'cart.checkout': ['Thanh toán', 'Checkout'],
    'cart.checkoutFull': ['Tiến hành thanh toán', 'Proceed to checkout'],
    'cart.viewFull': ['Xem giỏ hàng đầy đủ', 'View full cart'],
    'cart.keepShopping': ['Tiếp tục mua sắm', 'Keep shopping'],
    'cart.freeShipDone': ['Đơn hàng được miễn phí vận chuyển tiêu chuẩn.',
                          'This order qualifies for free standard shipping.'],
    'cart.freeShipLeft': ['Thêm {amount} để được miễn phí vận chuyển.',
                          'Add {amount} more for free shipping.'],
    'cart.summary': ['Tóm tắt đơn hàng', 'Order summary'],
    'cart.clearAll': ['Xóa toàn bộ giỏ', 'Empty the cart'],
    'cart.removeLine': ['Xóa khỏi giỏ', 'Remove'],
    'cart.unitPrice': ['Đơn giá', 'Unit price'],
    'cart.qtyFor': ['Số lượng cho {name}', 'Quantity for {name}'],
    'cart.variant': ['Phiên bản: {name}', 'Variant: {name}'],
    'cart.savedTotal': ['Bạn tiết kiệm được {amount} cho đơn này.', 'You are saving {amount} on this order.'],
    'cart.taxNote': ['Thuế và phí vận chuyển cuối cùng được tính lại ở bước thanh toán theo địa chỉ nhận hàng.',
                     'Final tax and shipping are calculated at checkout from your delivery address.'],
    'cart.note.label': ['Ghi chú cho đơn hàng', 'Order note'],
    'cart.note.placeholder': ['Ví dụ: giao giờ hành chính, gọi trước khi đến.',
                              'For example: deliver during office hours, call before arriving.'],
    'cart.note.help': ['Ghi chú được gửi kèm đơn hàng tới bộ phận đóng gói.',
                       'Your note is passed to the packing team with the order.'],
    'cart.coupon.label': ['Mã giảm giá', 'Discount code'],
    'cart.coupon.placeholder': ['Ví dụ: SHARK10', 'For example: SHARK10'],
    'cart.coupon.help': ['Mã đang chạy: SHARK10, FREESHIP, NEWGEAR20.',
                         'Codes currently live: SHARK10, FREESHIP, NEWGEAR20.'],
    'cart.coupon.remove': ['Gỡ mã', 'Remove code'],
    'cart.coupon.applied': ['Đã áp dụng mã {code}.', 'Code {code} applied.'],
    'cart.coupon.cleared': ['Đã gỡ mã giảm giá.', 'Discount code removed.'],
    'cart.discountLine': ['Giảm giá', 'Discount'],
    'cart.cleared': ['Đã xóa toàn bộ giỏ hàng.', 'Cart emptied.'],
    'cart.itemsWaiting': ['{n} sản phẩm đang chờ thanh toán.', '{n} items waiting to be checked out.'],
    'cart.cross.title': ['Ghép thêm cho setup', 'Round out the setup'],
    'cart.cross.text': ['Phụ kiện hay được mua cùng những món trong giỏ của bạn.',
                        'Accessories people usually buy alongside what is in your cart.'],

    /* ---- coupons ---- */
    'coupon.SHARK10': ['Giảm 10 phần trăm', '10 percent off'],
    'coupon.FREESHIP': ['Miễn phí vận chuyển nhanh', 'Free express shipping'],
    'coupon.NEWGEAR20': ['Giảm 20 USD cho đơn từ 150 USD', '20 USD off orders over 150 USD'],
    'coupon.invalid': ['Mã không hợp lệ hoặc đã hết hạn.', 'That code is not valid or has expired.'],
    'coupon.min': ['Đơn hàng cần tối thiểu {amount} để dùng mã này.',
                   'This code needs a minimum order of {amount}.'],

    /* ---- toasts ---- */
    'toast.added': ['Đã thêm {name} vào giỏ hàng.', '{name} added to your cart.'],
    'toast.addedN': ['Đã thêm {n} sản phẩm vào giỏ hàng.', '{n} items added to your cart.'],
    'toast.openCart': ['Mở giỏ hàng', 'Open cart'],
    'toast.removed': ['Đã xóa sản phẩm khỏi giỏ.', 'Item removed from your cart.'],
    'toast.wishAdded': ['Đã lưu vào danh sách yêu thích.', 'Saved to your wishlist.'],
    'toast.wishRemoved': ['Đã bỏ khỏi danh sách yêu thích.', 'Removed from your wishlist.'],
    'toast.viewWish': ['Xem danh sách', 'View wishlist'],
    'toast.cmpAdded': ['Đã thêm vào bảng so sánh.', 'Added to the comparison table.'],
    'toast.cmpRemoved': ['Đã bỏ khỏi bảng so sánh.', 'Removed from the comparison table.'],
    'toast.openCompare': ['Mở bảng so sánh', 'Open comparison'],
    'toast.compareFull': ['Chỉ so sánh tối đa {n} sản phẩm cùng lúc.',
                          'You can compare at most {n} products at once.'],
    'toast.searchShort': ['Nhập ít nhất hai ký tự để tìm.', 'Type at least two characters to search.'],
    'toast.linkCopied': ['Đã sao chép đường dẫn sản phẩm.', 'Product link copied.'],
    'toast.copyBlocked': ['Trình duyệt chặn thao tác sao chép.', 'Your browser blocked the copy.'],
    'toast.reviewLogin': ['Chức năng gửi đánh giá cần đăng nhập tài khoản.',
                          'Writing a review needs a signed-in account.'],
    'toast.signIn': ['Đăng nhập', 'Sign in'],
    'toast.cartEmptyCheckout': ['Giỏ hàng đang trống, không thể đặt hàng.',
                                'Your cart is empty, so there is nothing to order.'],

    /* ---- search ---- */
    'search.title': ['Tìm kiếm sản phẩm', 'Search products'],
    'search.placeholder': ['Tìm chuột, bàn phím, cảm biến...', 'Search mice, keyboards, sensors...'],
    'search.close': ['Đóng tìm kiếm', 'Close search'],
    'search.suggest': ['Gợi ý:', 'Try:'],
    'search.minChars': ['Nhập ít nhất hai ký tự để bắt đầu tìm.', 'Type at least two characters to begin.'],
    'search.noResults': ['Không tìm thấy kết quả', 'No results found'],
    'search.noResultsText': ['Thử từ khóa ngắn hơn, hoặc duyệt theo danh mục.',
                             'Try a shorter search, or browse by category.'],
    'search.browseAll': ['Xem toàn bộ sản phẩm', 'Browse everything'],
    'search.allFor': ['Xem tất cả kết quả cho "{q}"', 'See all results for "{q}"'],
    'search.allResults': ['Xem tất cả kết quả', 'See all results'],
    'search.noneFor': ['Không có kết quả cho "{q}". Thử từ khóa ngắn hơn.',
                       'Nothing matches "{q}". Try a shorter search.'],
    'search.resultsFor': ['{n} kết quả cho "{q}"', '{n} results for "{q}"'],
    'search.zeroFor': ['Không có kết quả cho "{q}"', 'No results for "{q}"'],
    'search.typeToStart': ['Nhập từ khóa để bắt đầu tìm', 'Type to start searching'],
    'search.all': ['Tất cả', 'All'],

    /* ---- quick view and product controls ---- */
    'qv.title': ['Xem nhanh sản phẩm', 'Product quick view'],
    'qv.close': ['Đóng xem nhanh', 'Close quick view'],
    'qv.viewProduct': ['Xem trang chi tiết', 'Open the full product page'],
    'qv.choose': ['Chọn {name}', 'Choose {name}'],
    'qv.version': ['Phiên bản', 'Version'],

    /* ---- footer ---- */
    'ft.newsTitle': ['Nhận tin mở bán trước<br>mọi người khác', 'Hear about launches<br>before everyone else'],
    'ft.newsText': ['Một email mỗi tháng. Tin mở bán, mã giảm giá và hướng dẫn setup. Hủy bất cứ lúc nào.',
                    'One email a month. Launches, discount codes and setup guides. Unsubscribe any time.'],
    'ft.email': ['Địa chỉ email', 'Email address'],
    'ft.subscribe': ['Đăng ký', 'Subscribe'],
    'ft.emailHelp': ['Chúng tôi không chia sẻ email của bạn với bên thứ ba.',
                     'We never share your address with anyone.'],
    'ft.emailError': ['Email chưa đúng định dạng. Ví dụ: ten@vidu.com',
                      'That does not look like an email address. For example: name@example.com'],
    'ft.subscribed': ['Đã đăng ký. Kiểm tra hộp thư để xác nhận.', 'You are on the list. Check your inbox to confirm.'],
    'ft.about': ['{line} Chuột siêu nhẹ, bàn phím từ tính và phụ kiện được thiết kế quanh một mục tiêu duy nhất là độ trễ thấp nhất có thể.',
                 '{line} Superlight mice, Hall effect keyboards and accessories built around a single goal: the lowest latency we can reach.'],
    'ft.colProducts': ['Sản phẩm', 'Products'],
    'ft.colSupport': ['Hỗ trợ', 'Support'],
    'ft.colCompany': ['Công ty', 'Company'],
    'ft.colAccount': ['Tài khoản', 'Account'],
    'ft.store': ['Cửa hàng {code}', '{code} store'],
    'ft.driver': ['Tải driver', 'Download drivers'],
    'ft.shipPolicy': ['Chính sách vận chuyển', 'Shipping policy'],
    'ft.returns15': ['Đổi trả 15 ngày', '15 day returns'],
    'ft.warranty12': ['Bảo hành 12 tháng', '12 month warranty'],
    'ft.faq': ['Câu hỏi thường gặp', 'Frequently asked questions'],
    'ft.contact': ['Liên hệ', 'Contact'],
    'ft.aboutUs': ['Giới thiệu', 'About us'],
    'ft.affiliate': ['Chương trình tiếp thị liên kết', 'Affiliate programme'],
    'ft.creators': ['Hợp tác người sáng tạo', 'Creator partnerships'],
    'ft.news': ['Tin tức', 'News'],
    'ft.knowledge': ['Kiến thức', 'Guides'],
    'ft.userReviews': ['Đánh giá từ người dùng', 'Customer reviews'],
    'ft.signIn': ['Đăng nhập', 'Sign in'],
    'ft.register': ['Tạo tài khoản', 'Create an account'],
    'ft.orders': ['Đơn hàng của tôi', 'My orders'],
    'ft.wishlist': ['Danh sách yêu thích', 'Wishlist'],
    'ft.compare': ['Bảng so sánh', 'Comparison'],
    'ft.cart': ['Giỏ hàng', 'Cart'],
    'ft.disclaimer': ['Bản dựng kỹ thuật của giao diện thương mại điện tử. {brand} là tên thương hiệu hư cấu dùng cho bản dựng này; dữ liệu sản phẩm lấy từ một catalog công khai và chỉ để minh họa.',
                      'A technical build of an e-commerce interface. {brand} is a fictional brand used for this build; product data comes from a public catalog and is illustrative only.'],
    'ft.copyright': ['Bản quyền 2026 {brand}. Mọi quyền được bảo lưu.',
                     'Copyright 2026 {brand}. All rights reserved.'],
    'ft.privacy': ['Chính sách riêng tư', 'Privacy policy'],
    'ft.terms': ['Điều khoản sử dụng', 'Terms of use'],
    'ft.cookies': ['Cookie', 'Cookies'],
    'ft.socialOn': ['{brand} trên {network}', '{brand} on {network}'],
    'ft.backTop': ['Lên đầu trang', 'Back to top'],

    /* ---- mobile drawer ---- */
    'm.nav': ['Điều hướng', 'Navigation'],
    'm.closeMenu': ['Đóng menu', 'Close menu'],
    'm.account': ['Tài khoản', 'Account'],
    'm.support': ['Hỗ trợ', 'Support'],
  });
})(window);
