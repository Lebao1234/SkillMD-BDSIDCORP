const { init, call } = require('./mcp');

const STYLE_SETTINGS = [
  { type: 'header', label: 'Style' },
  { type: 'checkbox', id: 'visible', label: 'Visible', default: true },
  { type: 'color', id: 'bg_color', label: 'Background color' },
  { type: 'color', id: 'text_color', label: 'Text color' },
  { type: 'color', id: 'heading_color', label: 'Heading color' },
  { type: 'text', id: 'padding_top', label: 'Padding top (CSS)' },
  { type: 'text', id: 'padding_bottom', label: 'Padding bottom (CSS)' },
  { type: 'color', id: 'border_color', label: 'Border color' },
  { type: 'range', id: 'border_width', label: 'Border width', min: 0, max: 8, step: 1, unit: 'px', default: 0 },
  { type: 'range', id: 'border_radius', label: 'Border radius', min: 0, max: 48, step: 1, unit: 'px', default: 0 }
];

async function main() {
  await init();

  // =========================================================================
  // 1. ANNOUNCEMENT BAR
  // =========================================================================
  const announceContent = `<div class="announce" data-announce>
  <div class="wrap announce__inner">
    <button type="button" class="announce__nav" data-announce-prev aria-label="{% if request.locale.iso_code == 'en' %}Previous announcement{% else %}Thông báo trước{% endif %}"><i class="ph-light ph-caret-left" aria-hidden="true"></i></button>
    <div class="announce__viewport">
      <p class="announce__item is-current" data-i="0">
        <span class="announce__text">{% if request.locale.iso_code == 'en' %}Standard shipping: Free for orders over 1,500,000₫{% else %}Vận chuyển tiêu chuẩn: Miễn phí cho đơn từ 1.500.000đ{% endif %}</span>
        <a class="announce__cta" href="/pages/shipping"><span>{% if request.locale.iso_code == 'en' %}Delivery policy{% else %}Chính sách giao nhận{% endif %}</span><i class="ph-light ph-arrow-right" aria-hidden="true"></i></a>
      </p>
      <p class="announce__item" data-i="1">
        <span class="announce__text">{% if request.locale.iso_code == 'en' %}R86 HE Carbon: Pre-orders open now{% else %}R86 HE Carbon rèn: Đang mở đặt trước{% endif %}</span>
        <a class="announce__cta" href="/collections/ban-phim-he"><span>{% if request.locale.iso_code == 'en' %}Pre-order{% else %}Đặt trước ngay{% endif %}</span><i class="ph-light ph-arrow-right" aria-hidden="true"></i></a>
      </p>
      <p class="announce__item" data-i="2">
        <span class="announce__text">{% if request.locale.iso_code == 'en' %}F1 Air 39g: Solid unibody ultralight mouse{% else %}F1 Air 39g: Chuột siêu nhẹ thân liền khối{% endif %}</span>
        <a class="announce__cta" href="/collections/chuot-choi-game"><span>{% if request.locale.iso_code == 'en' %}Explore{% else %}Khám phá{% endif %}</span><i class="ph-light ph-arrow-right" aria-hidden="true"></i></a>
      </p>
      <p class="announce__item" data-i="3">
        <span class="announce__text">{% if request.locale.iso_code == 'en' %}15-day return policy: No questions asked{% else %}Đổi trả 15 ngày: Không cần lý do{% endif %}</span>
        <a class="announce__cta" href="/pages/returns"><span>{% if request.locale.iso_code == 'en' %}Return policy{% else %}Chính sách đổi trả{% endif %}</span><i class="ph-light ph-arrow-right" aria-hidden="true"></i></a>
      </p>
    </div>
    <button type="button" class="announce__nav" data-announce-next aria-label="{% if request.locale.iso_code == 'en' %}Next announcement{% else %}Thông báo tiếp theo{% endif %}"><i class="ph-light ph-caret-right" aria-hidden="true"></i></button>
  </div>
</div>
{% schema %}
{
  "name": "Announcement bar",
  "category": "header",
  "settings": [
    {"type":"header","label":"Style"},
    {"type":"checkbox","id":"visible","label":"Visible","default":true},
    {"type":"color","id":"bg_color","label":"Background color"},
    {"type":"color","id":"text_color","label":"Text color"},
    {"type":"color","id":"heading_color","label":"Heading color"},
    {"type":"text","id":"padding_top","label":"Padding top (CSS)"},
    {"type":"text","id":"padding_bottom","label":"Padding bottom (CSS)"},
    {"type":"color","id":"border_color","label":"Border color"},
    {"type":"range","id":"border_width","label":"Border width","min":0,"max":8,"step":1,"unit":"px","default":0},
    {"type":"range","id":"border_radius","label":"Border radius","min":0,"max":48,"step":1,"unit":"px","default":0}
  ]
}
{% endschema %}`;

  await call('upsert_theme_file', {
    path: 'sections/announcement-bar.liquid',
    content: announceContent
  });
  console.log('Upserted sections/announcement-bar.liquid');

  // =========================================================================
  // 2. HEADER
  // =========================================================================
  const headerContent = `<header class="header" data-header>
  <div class="wrap header__bar">
    <button type="button" class="icon-btn burger" data-mobilenav aria-expanded="false" aria-controls="mobilenav" aria-label="{% if request.locale.iso_code == 'en' %}Open navigation menu{% else %}Mở danh mục điều hướng{% endif %}">
      <span></span><span></span><span></span>
    </button>

    <a class="brand" href="/" aria-label="{{ shop.name | default: 'HADAL' }} — {% if request.locale.iso_code == 'en' %}Home{% else %}Trang chủ{% endif %}">
      <span class="brand__mark">
        <svg class="mark" width="30" height="30" viewBox="0 0 32 32" fill="none" role="img" aria-hidden="true" focusable="false">
          <path d="M10.6 3h10.8L29 10.6v10.8L21.4 29H10.6L3 21.4V10.6z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          <path d="M10.5 12.6h11M12.6 17h6.8M15.2 21.4h1.6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </span>
      <span class="brand__word">
        {{ shop.name | default: 'HADAL' }}
        <span class="brand__descriptor">PRECISION HARDWARE</span>
      </span>
    </a>

    <button type="button" class="catbtn js-mega" aria-expanded="false" aria-controls="mega-catalog">
      <i class="ph-light ph-squares-four" aria-hidden="true"></i>
      <span>{% if request.locale.iso_code == 'en' %}Catalog{% else %}Danh mục{% endif %}</span>
      <span class="catbtn__caret"><i class="ph-light ph-caret-down" aria-hidden="true"></i></span>
    </button>

    <nav class="quicknav" aria-label="{% if request.locale.iso_code == 'en' %}Shortcuts{% else %}Lối tắt nhanh{% endif %}">
      <a class="quicknav__link" href="/collections/hang-moi">
        <span>{% if request.locale.iso_code == 'en' %}New In{% else %}Mới về{% endif %}</span>
        <span class="quicknav__tag">NEW</span>
      </a>
      <a class="quicknav__link" href="/collections/giam-gia">
        <span>{% if request.locale.iso_code == 'en' %}On Sale{% else %}Giảm giá{% endif %}</span>
        <span class="quicknav__tag">SALE</span>
      </a>
      <a class="quicknav__link" href="/blogs/news">
        <span>{% if request.locale.iso_code == 'en' %}Journal{% else %}Bài viết{% endif %}</span>
      </a>
      <a class="quicknav__link" href="/pages/support">
        <span>{% if request.locale.iso_code == 'en' %}Support{% else %}Hỗ trợ{% endif %}</span>
      </a>
    </nav>

    <div class="hsearch__wrap">
      <form class="hsearch" role="search" method="GET" action="/search" data-hsearch>
        <span class="searchbox__icon"><i class="ph-light ph-magnifying-glass" aria-hidden="true"></i></span>
        <label class="visually-hidden" for="hsearch-input">{% if request.locale.iso_code == 'en' %}Search hardware{% else %}Tìm kiếm thiết bị{% endif %}</label>
        <input class="hsearch__input" id="hsearch-input" type="search" name="q" value="{{ request.query.q }}" autocomplete="off" placeholder="{% if request.locale.iso_code == 'en' %}Search mice, keyboards, gear...{% else %}Tìm chuột, bàn phím, phụ kiện...{% endif %}" data-hsearch-input aria-controls="typeahead" aria-expanded="false">
        <kbd class="hsearch__key">/</kbd>
      </form>
      <div class="typeahead" id="typeahead" data-typeahead role="listbox" aria-label="{% if request.locale.iso_code == 'en' %}Search suggestions{% else %}Gợi ý tìm kiếm{% endif %}"></div>
    </div>

    <div class="header__actions">
      <button type="button" class="icon-btn header__searchbtn" data-open-search aria-label="{% if request.locale.iso_code == 'en' %}Open search{% else %}Tìm kiếm{% endif %}">
        <i class="ph-light ph-magnifying-glass" aria-hidden="true"></i>
      </button>

      <label class="visually-hidden" for="lang-select">{% if request.locale.iso_code == 'en' %}Language{% else %}Ngôn ngữ{% endif %}</label>
      <select class="curselect curselect--lang" id="lang-select" data-lang>
        <option value="vi"{% if request.locale.iso_code != 'en' %} selected{% endif %}>VI</option>
        <option value="en"{% if request.locale.iso_code == 'en' %} selected{% endif %}>EN</option>
      </select>

      <label class="visually-hidden" for="cur-select">{% if request.locale.iso_code == 'en' %}Currency{% else %}Tiền tệ{% endif %}</label>
      <select class="curselect" id="cur-select" data-currency>
        <option value="VND"{% if cart.currency.iso_code == 'VND' or cart.currency.iso_code == blank %} selected{% endif %}>VND</option>
        <option value="USD"{% if cart.currency.iso_code == 'USD' %} selected{% endif %}>USD</option>
      </select>

      <button type="button" class="icon-btn" data-theme-toggle aria-label="{% if request.locale.iso_code == 'en' %}Toggle theme{% else %}Đổi giao diện sáng tối{% endif %}">
        <i class="ph-light ph-moon-stars" aria-hidden="true"></i>
      </button>

      <span class="header__divider" aria-hidden="true"></span>

      <a class="icon-btn" href="/account" aria-label="{% if request.locale.iso_code == 'en' %}User account{% else %}Tài khoản{% endif %}">
        <i class="ph-light ph-user" aria-hidden="true"></i>
      </a>

      <span class="icon-btn-wrap">
        <a class="icon-btn" href="/pages/compare" aria-label="{% if request.locale.iso_code == 'en' %}Product compare{% else %}So sánh sản phẩm{% endif %}">
          <i class="ph-light ph-scales" aria-hidden="true"></i>
          <span class="icon-btn__count" data-count-compare hidden>0</span>
        </a>
      </span>

      <span class="icon-btn-wrap">
        <a class="icon-btn" href="/pages/wishlist" aria-label="{% if request.locale.iso_code == 'en' %}Wishlist{% else %}Danh sách yêu thích{% endif %}">
          <i class="ph-light ph-heart" aria-hidden="true"></i>
          <span class="icon-btn__count" data-count-wish hidden>0</span>
        </a>
      </span>

      <span class="icon-btn-wrap">
        <a class="icon-btn" href="/cart" data-cart-toggle aria-label="{% if request.locale.iso_code == 'en' %}Shopping cart{% else %}Giỏ hàng{% endif %}">
          <i class="ph-light ph-shopping-cart-simple" aria-hidden="true"></i>
          <span class="icon-btn__count" data-cart-count{% if cart.item_count == 0 or cart.item_count == blank %} hidden{% endif %}>{{ cart.item_count | default: 0 }}</span>
        </a>
      </span>
    </div>
  </div>

  <div class="mega" id="mega-catalog" data-mega>
    <div class="wrap mega__inner">
      <div class="mega__cols">
        <div>
          <p class="mega__coltitle"><i class="ph-light ph-mouse" aria-hidden="true"></i>{% if request.locale.iso_code == 'en' %}Gaming Mice{% else %}Chuột chơi game{% endif %}</p>
          <ul class="mega__list">
            <li><a href="/collections/chuot-choi-game"><span>{% if request.locale.iso_code == 'en' %}All Mice{% else %}Tất cả chuột{% endif %}</span><span class="mega__count">43</span></a></li>
            <li><a href="/collections/chuot-choi-game"><span>{% if request.locale.iso_code == 'en' %}Tri-mode Wireless{% else %}Tri-mode không dây{% endif %}</span><span class="mega__count">24</span></a></li>
            <li><a href="/collections/chuot-choi-game"><span>{% if request.locale.iso_code == 'en' %}8000Hz Polling{% else %}Polling 8000Hz{% endif %}</span><span class="mega__count">16</span></a></li>
            <li><a href="/collections/chuot-choi-game"><span>{% if request.locale.iso_code == 'en' %}Under 50g Ultralight{% else %}Dưới 50g siêu nhẹ{% endif %}</span></a></li>
            <li><a href="/collections/chuot-choi-game"><span>{% if request.locale.iso_code == 'en' %}PAW3950MAX Sensor{% else %}Cảm biến PAW3950MAX{% endif %}</span></a></li>
          </ul>
        </div>
        <div>
          <p class="mega__coltitle"><i class="ph-light ph-keyboard" aria-hidden="true"></i>{% if request.locale.iso_code == 'en' %}Keyboards{% else %}Bàn phím{% endif %}</p>
          <ul class="mega__list">
            <li><a href="/collections/ban-phim-co"><span>{% if request.locale.iso_code == 'en' %}Mechanical Keyboards{% else %}Bàn phím cơ{% endif %}</span><span class="mega__count">28</span></a></li>
            <li><a href="/collections/ban-phim-he"><span>{% if request.locale.iso_code == 'en' %}Magnetic Switch HE{% else %}Bàn phím từ tính HE{% endif %}</span><span class="mega__count">17</span></a></li>
            <li><a href="/collections/ban-phim-he"><span>{% if request.locale.iso_code == 'en' %}Rapid Trigger 0.005mm{% else %}Rapid Trigger 0.005mm{% endif %}</span></a></li>
            <li><a href="/collections/keycap"><span>{% if request.locale.iso_code == 'en' %}PBT Keycaps{% else %}Keycaps PBT{% endif %}</span><span class="mega__count">11</span></a></li>
            <li><a href="/collections/switch"><span>{% if request.locale.iso_code == 'en' %}Custom Switches{% else %}Switches cơ & từ tính{% endif %}</span><span class="mega__count">5</span></a></li>
          </ul>
        </div>
        <div>
          <p class="mega__coltitle"><i class="ph-light ph-headphones" aria-hidden="true"></i>{% if request.locale.iso_code == 'en' %}Audio & Surface{% else %}Âm thanh & Bề mặt{% endif %}</p>
          <ul class="mega__list">
            <li><a href="/collections/tai-nghe"><span>{% if request.locale.iso_code == 'en' %}Gaming Headsets{% else %}Tai nghe gaming{% endif %}</span><span class="mega__count">9</span></a></li>
            <li><a href="/collections/lot-chuot"><span>{% if request.locale.iso_code == 'en' %}Control & Speed Pads{% else %}Lót chuột chuyên dụng{% endif %}</span><span class="mega__count">7</span></a></li>
            <li><a href="/collections/lot-chuot"><span>{% if request.locale.iso_code == 'en' %}Glass Pads & CORDURA{% else %}Bề mặt kính & Cordura{% endif %}</span></a></li>
          </ul>
        </div>
        <div>
          <p class="mega__coltitle"><i class="ph-light ph-plugs" aria-hidden="true"></i>{% if request.locale.iso_code == 'en' %}Accessories & Gear{% else %}Phụ kiện & Combo{% endif %}</p>
          <ul class="mega__list">
            <li><a href="/collections/cap-xoan"><span>{% if request.locale.iso_code == 'en' %}Coiled Aviator Cables{% else %}Cáp xoắn phi công Aviator{% endif %}</span><span class="mega__count">24</span></a></li>
            <li><a href="/collections/ke-tay"><span>{% if request.locale.iso_code == 'en' %}Wrist Rests & Grips{% else %}Kê tay & Grip tape{% endif %}</span><span class="mega__count">14</span></a></li>
            <li><a href="/collections/combo"><span>{% if request.locale.iso_code == 'en' %}Full Setup Bundles{% else %}Combo tiết kiệm trọn bộ{% endif %}</span><span class="mega__count">9</span></a></li>
            <li><a href="/collections/hang-moi"><span>{% if request.locale.iso_code == 'en' %}New In Drops{% else %}Hàng mới về{% endif %}</span><span class="mega__count">24</span></a></li>
            <li><a href="/collections/giam-gia"><span>{% if request.locale.iso_code == 'en' %}Seasonal Deals{% else %}Ưu đãi theo mùa{% endif %}</span><span class="mega__count">24</span></a></li>
          </ul>
        </div>
      </div>
      <a class="mega__feature" href="/products/r86-he-carbon-fiber-rapid-trigger-keyboard-magnetic-switch">
        <span class="mega__coltitle" style="margin:0;border:0;padding:0"><i class="ph-light ph-star" aria-hidden="true"></i>{% if request.locale.iso_code == 'en' %}Featured Hardware{% else %}Sản phẩm nổi bật{% endif %}</span>
        <span class="mega__feature-media"><img src="/storage/store-172/imported/1789490833333049215-2026-37-r86-he.jpg" alt="R86 HE Carbon" loading="lazy" width="300" height="300"></span>
        <span class="mega__feature-name">R86 HE Carbon Fiber</span>
        <span class="price price--sm"><span class="price__now">2.600.000₫</span></span>
      </a>
    </div>
  </div>
</header>
{% schema %}
{
  "name": "Header",
  "category": "header",
  "settings": [
    {"type":"linklist","id":"menu","label":"Menu điều hướng","default":"main-menu"},
    {"type":"image","id":"logo","label":"Logo (ghi đè)"},
    {"type":"range","id":"logo_width","label":"Chiều rộng logo","min":80,"max":260,"step":4,"unit":"px","default":140},
    {"type":"text","id":"logo_text","label":"Chữ thay logo","default":"HADAL"},
    {"type":"header","label":"Style"},
    {"type":"checkbox","id":"visible","label":"Visible","default":true},
    {"type":"color","id":"bg_color","label":"Background color"},
    {"type":"color","id":"text_color","label":"Text color"},
    {"type":"color","id":"heading_color","label":"Heading color"},
    {"type":"text","id":"padding_top","label":"Padding top (CSS)"},
    {"type":"text","id":"padding_bottom","label":"Padding bottom (CSS)"},
    {"type":"color","id":"border_color","label":"Border color"},
    {"type":"range","id":"border_width","label":"Border width","min":0,"max":8,"step":1,"unit":"px","default":0},
    {"type":"range","id":"border_radius","label":"Border radius","min":0,"max":48,"step":1,"unit":"px","default":0}
  ]
}
{% endschema %}`;

  await call('upsert_theme_file', {
    path: 'sections/header.liquid',
    content: headerContent
  });
  console.log('Upserted sections/header.liquid');

  // =========================================================================
  // 3. FOOTER
  // =========================================================================
  const footerContent = `<footer class="footer">
  <div class="footer__news">
    <div class="wrap footer__news-inner">
      <div class="stack stack-4">
        <h2 class="footer__news-title">{% if request.locale.iso_code == 'en' %}Get the HADAL dispatch{% else %}Đăng ký nhận tin từ HADAL{% endif %}</h2>
        <p class="muted">{% if request.locale.iso_code == 'en' %}Firmware drops, pre-order windows and hardware reviews. No marketing spam.{% else %}Thông báo mở bán sớm, cập nhật firmware và bài viết kỹ thuật. Không thư rác, hủy bất cứ lúc nào.{% endif %}</p>
      </div>
      <form class="newsform" data-newsletter action="#" method="POST" novalidate>
        <div class="field">
          <label class="field__label visually-hidden" for="news-email">Email</label>
          <div class="newsform__row">
            <input class="input" type="email" id="news-email" name="email" placeholder="{% if request.locale.iso_code == 'en' %}your@email.com{% else %}ten@vidu.com{% endif %}" autocomplete="email" required>
            <button class="btn btn--primary" type="submit">{% if request.locale.iso_code == 'en' %}Subscribe{% else %}Đăng ký{% endif %}</button>
          </div>
          <p class="field__help">{% if request.locale.iso_code == 'en' %}Zero spam. One email every two weeks. Unsubscribe anytime.{% else %}Không spam. Tối đa 1 email mỗi hai tuần. Hủy đăng ký bất cứ lúc nào.{% endif %}</p>
        </div>
      </form>
    </div>
  </div>

  <div class="footer__main">
    <div class="wrap">
      <div class="footer__cols">
        <div class="footer__about">
          <a class="brand" href="/" aria-label="{{ shop.name | default: 'HADAL' }}">
            <span class="brand__mark">
              <svg class="mark" width="34" height="34" viewBox="0 0 32 32" fill="none" role="img" aria-hidden="true" focusable="false">
                <path d="M10.6 3h10.8L29 10.6v10.8L21.4 29H10.6L3 21.4V10.6z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M10.5 12.6h11M12.6 17h6.8M15.2 21.4h1.6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="brand__word">
              {{ shop.name | default: 'HADAL' }}
              <span class="brand__descriptor">PRECISION HARDWARE</span>
            </span>
          </a>
          <p class="muted text-md">{% if request.locale.iso_code == 'en' %}High-precision gaming peripherals engineered for competitive players demanding minimum latency and repeatable actuation.{% else %}Thiết bị ngoại vi độ chính xác cao cho người chơi đòi hỏi độ trễ thấp nhất và hành trình phím chuẩn xác.{% endif %}</p>
          <div class="footer__socials">
            <a class="footer__social" href="https://www.facebook.com/" target="_blank" rel="noopener" aria-label="HADAL on Facebook"><i class="ph-light ph-facebook-logo" aria-hidden="true"></i></a>
            <a class="footer__social" href="https://x.com/" target="_blank" rel="noopener" aria-label="HADAL on X"><i class="ph-light ph-x-logo" aria-hidden="true"></i></a>
            <a class="footer__social" href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="HADAL on Instagram"><i class="ph-light ph-instagram-logo" aria-hidden="true"></i></a>
            <a class="footer__social" href="https://www.youtube.com/" target="_blank" rel="noopener" aria-label="HADAL on YouTube"><i class="ph-light ph-youtube-logo" aria-hidden="true"></i></a>
            <a class="footer__social" href="https://www.tiktok.com/" target="_blank" rel="noopener" aria-label="HADAL on TikTok"><i class="ph-light ph-tiktok-logo" aria-hidden="true"></i></a>
            <a class="footer__social" href="https://discord.com/" target="_blank" rel="noopener" aria-label="HADAL on Discord"><i class="ph-light ph-discord-logo" aria-hidden="true"></i></a>
          </div>
        </div>

        <div>
          <p class="footer__colhead">{% if request.locale.iso_code == 'en' %}Products{% else %}Sản phẩm{% endif %}</p>
          <ul class="footer__list">
            <li><a href="/collections/chuot-choi-game">{% if request.locale.iso_code == 'en' %}Gaming Mice{% else %}Chuột chơi game{% endif %}</a></li>
            <li><a href="/collections/ban-phim-co">{% if request.locale.iso_code == 'en' %}Mechanical Keyboards{% else %}Bàn phím cơ{% endif %}</a></li>
            <li><a href="/collections/ban-phim-he">{% if request.locale.iso_code == 'en' %}Magnetic HE Keyboards{% else %}Bàn phím từ tính HE{% endif %}</a></li>
            <li><a href="/collections/tai-nghe">{% if request.locale.iso_code == 'en' %}Gaming Headsets{% else %}Tai nghe gaming{% endif %}</a></li>
            <li><a href="/collections/lot-chuot">{% if request.locale.iso_code == 'en' %}Mousepads{% else %}Lót chuột chuyên dụng{% endif %}</a></li>
            <li><a href="/collections/combo">{% if request.locale.iso_code == 'en' %}Value Bundles{% else %}Combo tiết kiệm{% endif %}</a></li>
          </ul>
        </div>

        <div>
          <p class="footer__colhead">{% if request.locale.iso_code == 'en' %}Support{% else %}Hỗ trợ{% endif %}</p>
          <ul class="footer__list">
            <li><a href="/pages/downloads">{% if request.locale.iso_code == 'en' %}Drivers & Software{% else %}Tải driver & phần mềm{% endif %}</a></li>
            <li><a href="/pages/shipping">{% if request.locale.iso_code == 'en' %}Shipping Policy{% else %}Chính sách vận chuyển{% endif %}</a></li>
            <li><a href="/pages/returns">{% if request.locale.iso_code == 'en' %}15-Day Returns{% else %}Đổi trả 15 ngày{% endif %}</a></li>
            <li><a href="/pages/warranty">{% if request.locale.iso_code == 'en' %}24-Month Warranty{% else %}Bảo hành 24 tháng{% endif %}</a></li>
            <li><a href="/pages/faq">{% if request.locale.iso_code == 'en' %}FAQ{% else %}Câu hỏi thường gặp{% endif %}</a></li>
            <li><a href="/pages/contact">{% if request.locale.iso_code == 'en' %}Contact Us{% else %}Liên hệ hỗ trợ{% endif %}</a></li>
          </ul>
        </div>

        <div>
          <p class="footer__colhead">{% if request.locale.iso_code == 'en' %}HADAL{% else %}HADAL{% endif %}</p>
          <ul class="footer__list">
            <li><a href="/pages/about">{% if request.locale.iso_code == 'en' %}About Us{% else %}Về chúng tôi{% endif %}</a></li>
            <li><a href="/pages/affiliate">{% if request.locale.iso_code == 'en' %}Affiliate Program{% else %}Tiếp thị liên kết{% endif %}</a></li>
            <li><a href="/pages/creators">{% if request.locale.iso_code == 'en' %}For Creators{% else %}Dành cho Creator{% endif %}</a></li>
            <li><a href="/blogs/news">{% if request.locale.iso_code == 'en' %}News & Updates{% else %}Tin tức & Cập nhật{% endif %}</a></li>
            <li><a href="/blogs/guides">{% if request.locale.iso_code == 'en' %}Knowledge & Benchmarks{% else %}Cẩm nang & Đo lường{% endif %}</a></li>
            <li><a href="/blogs/reviews">{% if request.locale.iso_code == 'en' %}Community Reviews{% else %}Đánh giá từ cộng đồng{% endif %}</a></li>
          </ul>
        </div>

        <div>
          <p class="footer__colhead">{% if request.locale.iso_code == 'en' %}Account{% else %}Tài khoản{% endif %}</p>
          <ul class="footer__list">
            <li><a href="/account">{% if request.locale.iso_code == 'en' %}Sign In{% else %}Đăng nhập{% endif %}</a></li>
            <li><a href="/account">{% if request.locale.iso_code == 'en' %}Register{% else %}Đăng ký thành viên{% endif %}</a></li>
            <li><a href="/account">{% if request.locale.iso_code == 'en' %}Order History{% else %}Lịch sử đơn hàng{% endif %}</a></li>
            <li><a href="/pages/wishlist">{% if request.locale.iso_code == 'en' %}Wishlist{% else %}Danh sách yêu thích{% endif %}</a></li>
            <li><a href="/pages/compare">{% if request.locale.iso_code == 'en' %}Product Compare{% else %}So sánh sản phẩm{% endif %}</a></li>
            <li><a href="/cart">{% if request.locale.iso_code == 'en' %}Shopping Cart{% else %}Giỏ hàng{% endif %}</a></li>
          </ul>
        </div>
      </div>

      <div class="footer__stores">
        <a class="footer__store" href="#">United Kingdom</a>
        <a class="footer__store" href="#">Deutschland</a>
        <a class="footer__store" href="#">Japan</a>
        <a class="footer__store" href="#">Canada</a>
        <a class="footer__store" href="#">France</a>
        <a class="footer__store" href="#">Korea</a>
        <a class="footer__store" href="#">Brasil</a>
        <a class="footer__store" href="#">España</a>
        <a class="footer__store" href="#">Italia</a>
      </div>

      <div class="footer__legal">
        <p>{% if request.locale.iso_code == 'en' %}HADAL is an independent hardware brand specializing in low-latency peripherals for competitive gaming. Products engineered for repeatability.{% else %}HADAL là thương hiệu ngoại vi độc lập chuyên nghiên cứu thiết bị độ trễ cực thấp cho game thủ thi đấu. Mọi sản phẩm được tinh chỉnh cho độ chính xác lặp lại.{% endif %}</p>
        <div class="paylist">
          <span>VISA</span>
          <span>MASTERCARD</span>
          <span>AMEX</span>
          <span>PAYPAL</span>
          <span>APPLE PAY</span>
          <span>MOMO</span>
          <span>VNPAY</span>
        </div>
      </div>

      <div class="footer__legal">
        <span>&copy; {{ 'now' | date: '%Y' }} HADAL Peripherals. {% if request.locale.iso_code == 'en' %}All rights reserved.{% else %}Bảo lưu mọi quyền.{% endif %}</span>
        <div class="footer__legal-links">
          <a href="mailto:support@hadal.gg">support@hadal.gg</a>
          <a href="/pages/privacy">{% if request.locale.iso_code == 'en' %}Privacy Policy{% else %}Chính sách quyền riêng tư{% endif %}</a>
          <a href="/pages/terms">{% if request.locale.iso_code == 'en' %}Terms of Service{% else %}Điều khoản dịch vụ{% endif %}</a>
          <a href="/pages/cookies">{% if request.locale.iso_code == 'en' %}Cookie Preferences{% else %}Chính sách cookie{% endif %}</a>
        </div>
      </div>
    </div>
  </div>
</footer>
{% schema %}
{
  "name": "Footer",
  "category": "footer",
  "settings": [
    {"type":"textarea","id":"blurb","label":"Giới thiệu ngắn","default":"Thiết bị nhập liệu cho người chơi đo trước khi tin. Chuột siêu nhẹ, bàn phím từ tính và phụ kiện dựng cho độ chính xác lặp lại."},
    {"type":"header","label":"Style"},
    {"type":"checkbox","id":"visible","label":"Visible","default":true},
    {"type":"color","id":"bg_color","label":"Background color"},
    {"type":"color","id":"text_color","label":"Text color"},
    {"type":"color","id":"heading_color","label":"Heading color"},
    {"type":"text","id":"padding_top","label":"Padding top (CSS)"},
    {"type":"text","id":"padding_bottom","label":"Padding bottom (CSS)"},
    {"type":"color","id":"border_color","label":"Border color"},
    {"type":"range","id":"border_width","label":"Border width","min":0,"max":8,"step":1,"unit":"px","default":0},
    {"type":"range","id":"border_radius","label":"Border radius","min":0,"max":48,"step":1,"unit":"px","default":0}
  ]
}
{% endschema %}`;

  await call('upsert_theme_file', {
    path: 'sections/footer.liquid',
    content: footerContent
  });
  console.log('Upserted sections/footer.liquid');

  await call('clear_storefront_cache', {});
  console.log('Storefront cache cleared!');
}

main().catch(console.error);

