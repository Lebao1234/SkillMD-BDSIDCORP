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
  // 1. HADAL HERO
  // =========================================================================
  const heroContent = `<section class="hero" data-hero aria-roledescription="carousel" aria-label="{% if request.locale.iso_code == 'en' %}Featured Hardware{% else %}Sản phẩm nổi bật{% endif %}">
  <div class="wrap hero__grid">
    <div class="hero__rail" role="tablist" aria-label="{% if request.locale.iso_code == 'en' %}Select featured product{% else %}Chọn sản phẩm nổi bật{% endif %}">
      <button type="button" class="hero__num" role="tab" aria-current="true" data-slide="0" aria-label="{% if request.locale.iso_code == 'en' %}Product 1 of 3{% else %}Sản phẩm 1 trong 3{% endif %}">01</button>
      <button type="button" class="hero__num" role="tab" aria-current="false" data-slide="1" aria-label="{% if request.locale.iso_code == 'en' %}Product 2 of 3{% else %}Sản phẩm 2 trong 3{% endif %}">02</button>
      <button type="button" class="hero__num" role="tab" aria-current="false" data-slide="2" aria-label="{% if request.locale.iso_code == 'en' %}Product 3 of 3{% else %}Sản phẩm 3 trong 3{% endif %}">03</button>
    </div>

    <div class="hero__copycol">
      <article class="hero__copy is-current" data-slide="0">
        <p class="eyebrow">{% if request.locale.iso_code == 'en' %}Pre-orders Open{% else %}Đang mở đặt trước{% endif %}</p>
        <h1 class="hero__title">R86 HE<br>Carbon</h1>
        <p class="hero__sub">{% if request.locale.iso_code == 'en' %}Forged carbon fiber case, CNC aluminum frame, HUANO Glass Jade magnetic switches.{% else %}Vỏ sợi carbon rèn, khung nhôm CNC, switch từ tính HUANO Glass Jade.{% endif %}</p>
        <div class="hero__ctas">
          <a class="btn btn--primary btn--lg" href="/products/r86-he-carbon-fiber-rapid-trigger-keyboard-magnetic-switch">{% if request.locale.iso_code == 'en' %}Pre-order{% else %}Đặt trước{% endif %}</a>
          <a class="btn btn--secondary btn--lg" href="/collections/ban-phim-he">{% if request.locale.iso_code == 'en' %}View details{% else %}Xem chi tiết{% endif %}</a>
        </div>
      </article>

      <article class="hero__copy" data-slide="1">
        <p class="eyebrow">{% if request.locale.iso_code == 'en' %}Ultralight Gaming{% else %}Siêu nhẹ 39g{% endif %}</p>
        <p class="hero__title">F1 Air<br>39 gram</p>
        <p class="hero__sub">{% if request.locale.iso_code == 'en' %}The lightest mouse in the lineup. Solid unibody shell, zero honeycomb cutouts.{% else %}Chuột nhẹ nhất trong dòng sản phẩm. Thân liền khối, không đục lỗ thoát khí.{% endif %}</p>
        <div class="hero__ctas">
          <a class="btn btn--primary btn--lg" href="/collections/chuot-choi-game">{% if request.locale.iso_code == 'en' %}Shop now{% else %}Mua ngay{% endif %}</a>
          <a class="btn btn--secondary btn--lg" href="/collections/chuot-choi-game">{% if request.locale.iso_code == 'en' %}View details{% else %}Xem chi tiết{% endif %}</a>
        </div>
      </article>

      <article class="hero__copy" data-slide="2">
        <p class="eyebrow">{% if request.locale.iso_code == 'en' %}Tri-mode Wireless{% else %}Không dây 3 chế độ{% endif %}</p>
        <p class="hero__title">X11 Ultra<br>Carbon</p>
        <p class="hero__sub">{% if request.locale.iso_code == 'en' %}Tri-mode wireless connectivity, desktop charging dock with battery and DPI display.{% else %}Ba chế độ kết nối, dock sạc hiển thị pin và thông số DPI ngay trên bàn làm việc.{% endif %}</p>
        <div class="hero__ctas">
          <a class="btn btn--primary btn--lg" href="/collections/chuot-choi-game">{% if request.locale.iso_code == 'en' %}Shop now{% else %}Mua ngay{% endif %}</a>
          <a class="btn btn--secondary btn--lg" href="/collections/chuot-choi-game">{% if request.locale.iso_code == 'en' %}View details{% else %}Xem chi tiết{% endif %}</a>
        </div>
      </article>
    </div>

    <div class="hero__stagecol">
      <div class="hero__stage is-current" aria-hidden="false" data-slide="0">
        <div class="hero__shot">
          <span class="hero__flag"><span class="badge badge--new">{% if request.locale.iso_code == 'en' %}Pre-order{% else %}Đặt trước{% endif %}</span></span>
          <img src="/storage/store-172/imported/1789490831877248585-1-d5ea6201-0eb8-4943-9379-663808dd8a10.jpg" alt="R86 HE Carbon" width="800" height="600" fetchpriority="high" decoding="async">
        </div>
        <div class="hero__specs">
          <div class="hero__spec"><b>0.005</b><span>mm rapid trigger</span></div>
          <div class="hero__spec"><b>8000</b><span>Hz polling</span></div>
          <div class="hero__spec"><b>0.08</b><span>ms {% if request.locale.iso_code == 'en' %}latency{% else %}độ trễ{% endif %}</span></div>
        </div>
      </div>

      <div class="hero__stage" aria-hidden="true" data-slide="1">
        <div class="hero__shot">
          <span class="hero__flag"><span class="badge badge--stock">{% if request.locale.iso_code == 'en' %}In stock{% else %}Còn hàng{% endif %}</span></span>
          <img src="/storage/store-172/imported/1789490832049215488-1-d8efa54b-fd23-4da9-9c5b-c1d5c21d5bd0.jpg" alt="F1 Air 39g" width="800" height="600" loading="lazy" decoding="async">
        </div>
        <div class="hero__specs">
          <div class="hero__spec"><b>39</b><span>gram</span></div>
          <div class="hero__spec"><b>3955</b><span>PAW MAX</span></div>
          <div class="hero__spec"><b>8000</b><span>Hz polling</span></div>
        </div>
      </div>

      <div class="hero__stage" aria-hidden="true" data-slide="2">
        <div class="hero__shot">
          <span class="hero__flag"><span class="badge badge--neutral">Tri-mode</span></span>
          <img src="/storage/store-172/imported/1789490832221182391-x11ultra-1.jpg" alt="X11 Ultra Carbon" width="800" height="600" loading="lazy" decoding="async">
        </div>
        <div class="hero__specs">
          <div class="hero__spec"><b>63</b><span>gram</span></div>
          <div class="hero__spec"><b>42000</b><span>DPI max</span></div>
          <div class="hero__spec"><b>8000</b><span>Hz polling</span></div>
        </div>
      </div>
    </div>
  </div>
</section>`;

  await call('build_section', {
    spec: {
      name: 'HADAL Hero',
      handle: 'hadal-hero',
      category: 'hero',
      settings: STYLE_SETTINGS,
      body: heroContent
    },
    overwrite: true
  });
  console.log('Updated hadal-hero');

  // =========================================================================
  // 2. HADAL SERVICES
  // =========================================================================
  const servicesContent = `<section class="wrap" aria-label="{% if request.locale.iso_code == 'en' %}Service commitments{% else %}Cam kết dịch vụ{% endif %}">
  <div class="services">
    <div class="service reveal">
      <span class="service__icon"><i class="ph-light ph-truck" aria-hidden="true"></i></span>
      <div>
        <p class="service__title">{% if request.locale.iso_code == 'en' %}Standard Shipping{% else %}Vận chuyển tiêu chuẩn{% endif %}</p>
        <p class="service__text">{% if request.locale.iso_code == 'en' %}Free for orders over 1,500,000₫. Local warehouse delivery in 2 to 4 business days.{% else %}Miễn phí cho đơn từ 1.500.000đ. Kho địa phương giao nhanh trong 2 đến 4 ngày làm việc.{% endif %}</p>
      </div>
    </div>
    <div class="service reveal">
      <span class="service__icon"><i class="ph-light ph-arrow-u-up-left" aria-hidden="true"></i></span>
      <div>
        <p class="service__title">{% if request.locale.iso_code == 'en' %}15-Day Returns{% else %}Đổi trả 15 ngày{% endif %}</p>
        <p class="service__text">{% if request.locale.iso_code == 'en' %}No questions asked. Ample time to test grip, weight, and switch actuation on your desk.{% else %}Không cần lý do. Đủ thời gian để thử và cảm nhận xem có hợp tay và bàn di chuột không.{% endif %}</p>
      </div>
    </div>
    <div class="service reveal">
      <span class="service__icon"><i class="ph-light ph-shield-check" aria-hidden="true"></i></span>
      <div>
        <p class="service__title">{% if request.locale.iso_code == 'en' %}24-Month Warranty{% else %}Bảo hành 24 tháng{% endif %}</p>
        <p class="service__text">{% if request.locale.iso_code == 'en' %}Full coverage for keyboards, mice, and accessories. Dedicated support via Discord and email.{% else %}Áp dụng cho bàn phím, chuột và phụ kiện. Hỗ trợ kỹ thuật trực tiếp qua email và Discord.{% endif %}</p>
      </div>
    </div>
  </div>
</section>`;

  await call('build_section', {
    spec: {
      name: 'HADAL Services',
      handle: 'hadal-services',
      category: 'features',
      settings: STYLE_SETTINGS,
      body: servicesContent
    },
    overwrite: true
  });
  console.log('Updated hadal-services');

  // =========================================================================
  // 3. HADAL FRESH FINDS (Snap Rail with .pcard)
  // =========================================================================
  const freshContent = `<section class="section section--tight" aria-labelledby="fresh-h">
  <div class="wrap">
    <div class="section-head">
      <div class="section-head__text">
        <h2 class="section-head__title" id="fresh-h">{% if request.locale.iso_code == 'en' %}Fresh Arrivals{% else %}Hàng mới về{% endif %}</h2>
        <p class="muted">{% if request.locale.iso_code == 'en' %}The newest drops in competitive hardware. Scroll sideways for more.{% else %}Những model vừa lên kệ. Kéo ngang để xem thêm.{% endif %}</p>
      </div>
      <div class="row rail-nav">
        <a class="link" href="/collections/hang-moi"><span>{% if request.locale.iso_code == 'en' %}View all{% else %}Xem tất cả{% endif %}</span> <i class="ph-light ph-arrow-right" aria-hidden="true"></i></a>
        <button type="button" class="icon-btn icon-btn--bordered" data-fresh-prev aria-label="{% if request.locale.iso_code == 'en' %}Scroll left{% else %}Cuộn sang trái{% endif %}"><i class="ph-light ph-arrow-left" aria-hidden="true"></i></button>
        <button type="button" class="icon-btn icon-btn--bordered" data-fresh-next aria-label="{% if request.locale.iso_code == 'en' %}Scroll right{% else %}Cuộn sang phải{% endif %}"><i class="ph-light ph-arrow-right" aria-hidden="true"></i></button>
      </div>
    </div>
    <div class="rail" data-fresh>
      {% for product in collections['hang-moi'].products limit: 10 %}
        <article class="pcard reveal" data-handle="{{ product.handle }}">
          <div class="pcard__media">
            <a class="pcard__link" href="{{ product.url }}">
              <img class="pcard__img pcard__img--main" src="{{ product.featured_image | default: product.image }}" alt="{{ product.title | escape }}" loading="lazy" decoding="async" width="600" height="600">
              {% if product.images.size > 1 %}
                <img class="pcard__img pcard__img--alt" src="{{ product.images[1].url }}" alt="{{ product.title | escape }}" loading="lazy" decoding="async" width="600" height="600">
              {% endif %}
            </a>
            <div class="pcard__flags">
              <span class="badge badge--new">{% if request.locale.iso_code == 'en' %}New{% else %}Mới{% endif %}</span>
            </div>
            <div class="pcard__tools">
              <button type="button" class="pcard__tool" data-wishlist-toggle data-product-id="{{ product.id }}" aria-label="{% if request.locale.iso_code == 'en' %}Add to wishlist{% else %}Thêm vào yêu thích{% endif %}">
                <i class="ph-light ph-heart" aria-hidden="true"></i>
              </button>
              <button type="button" class="pcard__tool" data-quickview-open data-product-id="{{ product.id }}" data-product-handle="{{ product.handle }}" aria-label="{% if request.locale.iso_code == 'en' %}Quick view{% else %}Xem nhanh{% endif %}">
                <i class="ph-light ph-eye" aria-hidden="true"></i>
              </button>
            </div>
            <div class="pcard__quick">
              <button type="button" class="btn btn--contrast btn--block" data-quickview-open data-product-id="{{ product.id }}" data-product-handle="{{ product.handle }}">
                {% if request.locale.iso_code == 'en' %}Quick View{% else %}Xem nhanh & Thêm{% endif %}
              </button>
            </div>
          </div>
          <div class="pcard__body">
            <p class="pcard__cat">{{ product.type | default: 'HADAL' }}</p>
            <h3 class="pcard__title"><a href="{{ product.url }}">{{ product.title }}</a></h3>
            <div class="pcard__foot">
              <div class="price"><span class="price__now">{{ product.price | money }}</span></div>
            </div>
          </div>
        </article>
      {% else %}
        {% for product in collections['featured'].products limit: 10 %}
          <article class="pcard reveal" data-handle="{{ product.handle }}">
            <div class="pcard__media">
              <a class="pcard__link" href="{{ product.url }}">
                <img class="pcard__img pcard__img--main" src="{{ product.featured_image | default: product.image }}" alt="{{ product.title | escape }}" loading="lazy" decoding="async" width="600" height="600">
                {% if product.images.size > 1 %}
                  <img class="pcard__img pcard__img--alt" src="{{ product.images[1].url }}" alt="{{ product.title | escape }}" loading="lazy" decoding="async" width="600" height="600">
                {% endif %}
              </a>
              <div class="pcard__flags">
                <span class="badge badge--new">{% if request.locale.iso_code == 'en' %}New{% else %}Mới{% endif %}</span>
              </div>
              <div class="pcard__tools">
                <button type="button" class="pcard__tool" data-wishlist-toggle data-product-id="{{ product.id }}" aria-label="Wishlist">
                  <i class="ph-light ph-heart" aria-hidden="true"></i>
                </button>
                <button type="button" class="pcard__tool" data-quickview-open data-product-id="{{ product.id }}" data-product-handle="{{ product.handle }}" aria-label="Quickview">
                  <i class="ph-light ph-eye" aria-hidden="true"></i>
                </button>
              </div>
              <div class="pcard__quick">
                <button type="button" class="btn btn--contrast btn--block" data-quickview-open data-product-id="{{ product.id }}" data-product-handle="{{ product.handle }}">
                  {% if request.locale.iso_code == 'en' %}Quick View{% else %}Xem nhanh & Thêm{% endif %}
                </button>
              </div>
            </div>
            <div class="pcard__body">
              <p class="pcard__cat">{{ product.type | default: 'HADAL' }}</p>
              <h3 class="pcard__title"><a href="{{ product.url }}">{{ product.title }}</a></h3>
              <div class="pcard__foot">
                <div class="price"><span class="price__now">{{ product.price | money }}</span></div>
              </div>
            </div>
          </article>
        {% endfor %}
      {% endfor %}
    </div>
  </div>
</section>`;

  await call('build_section', {
    spec: {
      name: 'HADAL Fresh',
      handle: 'hadal-fresh',
      category: 'products',
      settings: STYLE_SETTINGS,
      body: freshContent
    },
    overwrite: true
  });
  console.log('Updated hadal-fresh');

  // =========================================================================
  // 4. HADAL SPOTLIGHT BENTO
  // =========================================================================
  const spotlightContent = `<section class="section section--tight" aria-labelledby="spot-h">
  <div class="wrap">
    <div class="section-head">
      <div class="section-head__text">
        <p class="eyebrow">{% if request.locale.iso_code == 'en' %}Three standout models this quarter{% else %}Ba model đáng chú ý nhất quý này{% endif %}</p>
        <h2 class="section-head__title" id="spot-h">{% if request.locale.iso_code == 'en' %}Curated Spotlight{% else %}Được chọn ra{% endif %}</h2>
      </div>
    </div>
    <div class="bento">
      <a class="bento__cell bento__cell--lead reveal" href="/products/r86-he-carbon-fiber-rapid-trigger-keyboard-magnetic-switch">
        <img class="bento__bg" src="/storage/store-172/imported/1789490831877248585-1-d5ea6201-0eb8-4943-9379-663808dd8a10.jpg" alt="R86 HE Carbon" loading="lazy" decoding="async" width="900" height="700">
        <h3 class="bento__name">R86 HE Carbon</h3>
        <p class="bento__line">{% if request.locale.iso_code == 'en' %}Forged carbon fiber case with HUANO Glass Jade magnetic switches.{% else %}Vỏ sợi carbon rèn nguyên khối, switch từ tính HUANO Glass Jade và rapid trigger 0.005mm.{% endif %}</p>
        <span class="bento__cta">{% if request.locale.iso_code == 'en' %}View details{% else %}Xem chi tiết{% endif %} <i class="ph-light ph-arrow-right" aria-hidden="true"></i></span>
      </a>

      <a class="bento__cell reveal" href="/collections/chuot-choi-game">
        <img class="bento__bg" src="/storage/store-172/imported/1789490832049215488-1-d8efa54b-fd23-4da9-9c5b-c1d5c21d5bd0.jpg" alt="F1 Air 39g" loading="lazy" decoding="async" width="900" height="700">
        <h3 class="bento__name">F1 Air 39G</h3>
        <p class="bento__line">{% if request.locale.iso_code == 'en' %}Solid unibody ultralight gaming mouse without holes, PAW3950MAX sensor.{% else %}Chuột siêu nhẹ 39g thân liền khối không đục lỗ, cảm biến quang học PAW3950MAX 8000Hz.{% endif %}</p>
        <span class="bento__cta">{% if request.locale.iso_code == 'en' %}View details{% else %}Xem chi tiết{% endif %} <i class="ph-light ph-arrow-right" aria-hidden="true"></i></span>
      </a>

      <a class="bento__cell reveal" href="/collections/ban-phim-he">
        <img class="bento__bg" src="/storage/store-172/imported/1789490832221182391-x11ultra-1.jpg" alt="X11 Ultra" loading="lazy" decoding="async" width="900" height="700">
        <h3 class="bento__name">X11 Ultra</h3>
        <p class="bento__line">{% if request.locale.iso_code == 'en' %}Tri-mode connectivity with desktop charging display dock, 42000 DPI.{% else %}Ba chế độ kết nối, dock sạc thông minh hiển thị pin và thông số DPI trực tiếp.{% endif %}</p>
        <span class="bento__cta">{% if request.locale.iso_code == 'en' %}View details{% else %}Xem chi tiết{% endif %} <i class="ph-light ph-arrow-right" aria-hidden="true"></i></span>
      </a>
    </div>
  </div>
</section>`;

  await call('build_section', {
    spec: {
      name: 'HADAL Spotlight',
      handle: 'hadal-spotlight',
      category: 'features',
      settings: STYLE_SETTINGS,
      body: spotlightContent
    },
    overwrite: true
  });
  console.log('Updated hadal-spotlight');

  // =========================================================================
  // 5. HADAL CATEGORIES (7 tiles)
  // =========================================================================
  const catsContent = `<section class="section section--tight" aria-labelledby="cats-h">
  <div class="wrap">
    <div class="section-head">
      <div class="section-head__text">
        <h2 class="section-head__title" id="cats-h">{% if request.locale.iso_code == 'en' %}Shop by Category{% else %}Mua theo danh mục{% endif %}</h2>
        <p class="muted">{% if request.locale.iso_code == 'en' %}Engineered peripherals, precision surfaces, and custom tuning accessories.{% else %}Thiết bị ngoại vi, bề mặt di chuột và phụ kiện tùy biến chuyên nghiệp.{% endif %}</p>
      </div>
      <a class="link" href="/collections"><span>{% if request.locale.iso_code == 'en' %}All categories{% else %}Tất cả danh mục{% endif %}</span> <i class="ph-light ph-arrow-right" aria-hidden="true"></i></a>
    </div>
    <div class="cats">
      <a class="cats__tile reveal" href="/collections/ban-phim-co">
        <img src="/storage/store-172/imported/1789490831877248585-1-d5ea6201-0eb8-4943-9379-663808dd8a10.jpg" alt="Bàn phím cơ" loading="lazy" decoding="async" width="800" height="600">
        <span class="cats__label">{% if request.locale.iso_code == 'en' %}Mechanical Keyboards{% else %}Bàn phím cơ{% endif %} <span class="cats__count">28 {% if request.locale.iso_code == 'en' %}items{% else %}sản phẩm{% endif %}</span></span>
      </a>
      <a class="cats__tile reveal" href="/collections/chuot-choi-game">
        <img src="/storage/store-172/imported/1789490832049215488-1-d8efa54b-fd23-4da9-9c5b-c1d5c21d5bd0.jpg" alt="Chuột chơi game" loading="lazy" decoding="async" width="800" height="600">
        <span class="cats__label">{% if request.locale.iso_code == 'en' %}Gaming Mice{% else %}Chuột chơi game{% endif %} <span class="cats__count">43 {% if request.locale.iso_code == 'en' %}items{% else %}sản phẩm{% endif %}</span></span>
      </a>
      <a class="cats__tile reveal" href="/collections/ban-phim-he">
        <img src="/storage/store-172/imported/1789490833333049215-2026-37-r86-he.jpg" alt="Bàn phím từ tính HE" loading="lazy" decoding="async" width="800" height="600">
        <span class="cats__label">{% if request.locale.iso_code == 'en' %}Magnetic HE Keyboards{% else %}Bàn phím từ tính HE{% endif %} <span class="cats__count">17 {% if request.locale.iso_code == 'en' %}items{% else %}sản phẩm{% endif %}</span></span>
      </a>
      <a class="cats__tile reveal" href="/collections/tai-nghe">
        <img src="/storage/store-172/imported/1789490832621182391-headset.jpg" alt="Tai nghe" loading="lazy" decoding="async" width="800" height="600">
        <span class="cats__label">{% if request.locale.iso_code == 'en' %}Gaming Headsets{% else %}Tai nghe gaming{% endif %} <span class="cats__count">9 {% if request.locale.iso_code == 'en' %}items{% else %}sản phẩm{% endif %}</span></span>
      </a>
      <a class="cats__tile reveal" href="/collections/lot-chuot">
        <img src="/storage/store-172/imported/1789490832821182391-mousepad.jpg" alt="Lót chuột" loading="lazy" decoding="async" width="800" height="600">
        <span class="cats__label">{% if request.locale.iso_code == 'en' %}Mousepads & Surfaces{% else %}Lót chuột chuyên dụng{% endif %} <span class="cats__count">7 {% if request.locale.iso_code == 'en' %}items{% else %}sản phẩm{% endif %}</span></span>
      </a>
      <a class="cats__tile reveal" href="/collections/cap-xoan">
        <img src="/storage/store-172/imported/1789490832421182391-cables.jpg" alt="Cáp xoắn" loading="lazy" decoding="async" width="800" height="600">
        <span class="cats__label">{% if request.locale.iso_code == 'en' %}Coiled Aviator Cables{% else %}Cáp xoắn phi công{% endif %} <span class="cats__count">24 {% if request.locale.iso_code == 'en' %}items{% else %}sản phẩm{% endif %}</span></span>
      </a>
      <a class="cats__tile reveal" href="/collections/keycap">
        <img src="/storage/store-172/imported/1789490833021182391-keycaps.jpg" alt="Keycaps" loading="lazy" decoding="async" width="800" height="600">
        <span class="cats__label">{% if request.locale.iso_code == 'en' %}PBT Keycaps & Switches{% else %}Keycaps & Switches{% endif %} <span class="cats__count">16 {% if request.locale.iso_code == 'en' %}items{% else %}sản phẩm{% endif %}</span></span>
      </a>
    </div>
  </div>
</section>`;

  await call('build_section', {
    spec: {
      name: 'HADAL Categories',
      handle: 'hadal-categories',
      category: 'collections',
      settings: STYLE_SETTINGS,
      body: catsContent
    },
    overwrite: true
  });
  console.log('Updated hadal-categories');

  // =========================================================================
  // 6. HADAL BEST SELLERS (with tabs)
  // =========================================================================
  const bestSellersContent = `<section class="section" aria-labelledby="best-h" data-tabs>
  <div class="wrap">
    <div class="section-head">
      <div class="section-head__text">
        <h2 class="section-head__title" id="best-h">{% if request.locale.iso_code == 'en' %}Best Sellers{% else %}Bán chạy nhất{% endif %}</h2>
        <p class="muted">{% if request.locale.iso_code == 'en' %}Ranked by unit sales across competitive communities over the last 12 months.{% else %}Xếp theo số lượng bán ra trong một năm gần nhất.{% endif %}</p>
      </div>
      <a class="link" href="/collections/ban-chay"><span>{% if request.locale.iso_code == 'en' %}View all{% else %}Xem tất cả{% endif %}</span> <i class="ph-light ph-arrow-right" aria-hidden="true"></i></a>
    </div>

    <div class="tabs" role="tablist" aria-label="{% if request.locale.iso_code == 'en' %}Filter by category{% else %}Lọc theo danh mục{% endif %}" data-best-tabs>
      <button type="button" class="tab" role="tab" id="bt-all" aria-selected="true" data-tab-target="tab-all">{% if request.locale.iso_code == 'en' %}All Categories{% else %}Tất cả{% endif %}</button>
      <button type="button" class="tab" role="tab" id="bt-mice" aria-selected="false" data-tab-target="tab-mice">{% if request.locale.iso_code == 'en' %}Gaming Mice{% else %}Chuột{% endif %}</button>
      <button type="button" class="tab" role="tab" id="bt-kb" aria-selected="false" data-tab-target="tab-kb">{% if request.locale.iso_code == 'en' %}Mechanical Keyboards{% else %}Bàn phím cơ{% endif %}</button>
      <button type="button" class="tab" role="tab" id="bt-he" aria-selected="false" data-tab-target="tab-he">{% if request.locale.iso_code == 'en' %}Magnetic HE{% else %}Bàn phím HE{% endif %}</button>
      <button type="button" class="tab" role="tab" id="bt-acc" aria-selected="false" data-tab-target="tab-acc">{% if request.locale.iso_code == 'en' %}Accessories{% else %}Phụ kiện{% endif %}</button>
    </div>

    <div style="padding-block-start:var(--space-8)">
      <!-- Tab All -->
      <div class="tabpanel" id="tab-all" role="tabpanel" aria-labelledby="bt-all">
        <div class="grid-products grid-products--4">
          {% for product in collections['ban-chay'].products limit: 8 %}
            <article class="pcard reveal" data-handle="{{ product.handle }}">
              <div class="pcard__media">
                <a class="pcard__link" href="{{ product.url }}">
                  <img class="pcard__img pcard__img--main" src="{{ product.featured_image | default: product.image }}" alt="{{ product.title | escape }}" loading="lazy" decoding="async" width="600" height="600">
                  {% if product.images.size > 1 %}
                    <img class="pcard__img pcard__img--alt" src="{{ product.images[1].url }}" alt="{{ product.title | escape }}" loading="lazy" decoding="async" width="600" height="600">
                  {% endif %}
                </a>
                <div class="pcard__flags">
                  <span class="badge badge--accent">Hot</span>
                </div>
                <div class="pcard__tools">
                  <button type="button" class="pcard__tool" data-wishlist-toggle data-product-id="{{ product.id }}" aria-label="Wishlist"><i class="ph-light ph-heart" aria-hidden="true"></i></button>
                  <button type="button" class="pcard__tool" data-quickview-open data-product-id="{{ product.id }}" data-product-handle="{{ product.handle }}" aria-label="Quickview"><i class="ph-light ph-eye" aria-hidden="true"></i></button>
                </div>
                <div class="pcard__quick">
                  <button type="button" class="btn btn--contrast btn--block" data-quickview-open data-product-id="{{ product.id }}" data-product-handle="{{ product.handle }}">{% if request.locale.iso_code == 'en' %}Quick View{% else %}Xem nhanh & Thêm{% endif %}</button>
                </div>
              </div>
              <div class="pcard__body">
                <p class="pcard__cat">{{ product.type | default: 'HADAL' }}</p>
                <h3 class="pcard__title"><a href="{{ product.url }}">{{ product.title }}</a></h3>
                <div class="pcard__foot">
                  <div class="price"><span class="price__now">{{ product.price | money }}</span></div>
                </div>
              </div>
            </article>
          {% endfor %}
        </div>
      </div>

      <!-- Tab Mice -->
      <div class="tabpanel" id="tab-mice" role="tabpanel" aria-labelledby="bt-mice" hidden>
        <div class="grid-products grid-products--4">
          {% for product in collections['chuot-choi-game'].products limit: 8 %}
            <article class="pcard reveal" data-handle="{{ product.handle }}">
              <div class="pcard__media">
                <a class="pcard__link" href="{{ product.url }}">
                  <img class="pcard__img pcard__img--main" src="{{ product.featured_image | default: product.image }}" alt="{{ product.title | escape }}" loading="lazy" decoding="async" width="600" height="600">
                  {% if product.images.size > 1 %}
                    <img class="pcard__img pcard__img--alt" src="{{ product.images[1].url }}" alt="{{ product.title | escape }}" loading="lazy" decoding="async" width="600" height="600">
                  {% endif %}
                </a>
                <div class="pcard__tools">
                  <button type="button" class="pcard__tool" data-wishlist-toggle data-product-id="{{ product.id }}" aria-label="Wishlist"><i class="ph-light ph-heart" aria-hidden="true"></i></button>
                  <button type="button" class="pcard__tool" data-quickview-open data-product-id="{{ product.id }}" data-product-handle="{{ product.handle }}" aria-label="Quickview"><i class="ph-light ph-eye" aria-hidden="true"></i></button>
                </div>
                <div class="pcard__quick">
                  <button type="button" class="btn btn--contrast btn--block" data-quickview-open data-product-id="{{ product.id }}" data-product-handle="{{ product.handle }}">{% if request.locale.iso_code == 'en' %}Quick View{% else %}Xem nhanh & Thêm{% endif %}</button>
                </div>
              </div>
              <div class="pcard__body">
                <p class="pcard__cat">{% if request.locale.iso_code == 'en' %}Gaming Mice{% else %}Chuột chơi game{% endif %}</p>
                <h3 class="pcard__title"><a href="{{ product.url }}">{{ product.title }}</a></h3>
                <div class="pcard__foot">
                  <div class="price"><span class="price__now">{{ product.price | money }}</span></div>
                </div>
              </div>
            </article>
          {% endfor %}
        </div>
      </div>

      <!-- Tab Keyboards -->
      <div class="tabpanel" id="tab-kb" role="tabpanel" aria-labelledby="bt-kb" hidden>
        <div class="grid-products grid-products--4">
          {% for product in collections['ban-phim-co'].products limit: 8 %}
            <article class="pcard reveal" data-handle="{{ product.handle }}">
              <div class="pcard__media">
                <a class="pcard__link" href="{{ product.url }}">
                  <img class="pcard__img pcard__img--main" src="{{ product.featured_image | default: product.image }}" alt="{{ product.title | escape }}" loading="lazy" decoding="async" width="600" height="600">
                  {% if product.images.size > 1 %}
                    <img class="pcard__img pcard__img--alt" src="{{ product.images[1].url }}" alt="{{ product.title | escape }}" loading="lazy" decoding="async" width="600" height="600">
                  {% endif %}
                </a>
                <div class="pcard__tools">
                  <button type="button" class="pcard__tool" data-wishlist-toggle data-product-id="{{ product.id }}" aria-label="Wishlist"><i class="ph-light ph-heart" aria-hidden="true"></i></button>
                  <button type="button" class="pcard__tool" data-quickview-open data-product-id="{{ product.id }}" data-product-handle="{{ product.handle }}" aria-label="Quickview"><i class="ph-light ph-eye" aria-hidden="true"></i></button>
                </div>
                <div class="pcard__quick">
                  <button type="button" class="btn btn--contrast btn--block" data-quickview-open data-product-id="{{ product.id }}" data-product-handle="{{ product.handle }}">{% if request.locale.iso_code == 'en' %}Quick View{% else %}Xem nhanh & Thêm{% endif %}</button>
                </div>
              </div>
              <div class="pcard__body">
                <p class="pcard__cat">{% if request.locale.iso_code == 'en' %}Mechanical Keyboards{% else %}Bàn phím cơ{% endif %}</p>
                <h3 class="pcard__title"><a href="{{ product.url }}">{{ product.title }}</a></h3>
                <div class="pcard__foot">
                  <div class="price"><span class="price__now">{{ product.price | money }}</span></div>
                </div>
              </div>
            </article>
          {% endfor %}
        </div>
      </div>

      <!-- Tab HE Keyboards -->
      <div class="tabpanel" id="tab-he" role="tabpanel" aria-labelledby="bt-he" hidden>
        <div class="grid-products grid-products--4">
          {% for product in collections['ban-phim-he'].products limit: 8 %}
            <article class="pcard reveal" data-handle="{{ product.handle }}">
              <div class="pcard__media">
                <a class="pcard__link" href="{{ product.url }}">
                  <img class="pcard__img pcard__img--main" src="{{ product.featured_image | default: product.image }}" alt="{{ product.title | escape }}" loading="lazy" decoding="async" width="600" height="600">
                  {% if product.images.size > 1 %}
                    <img class="pcard__img pcard__img--alt" src="{{ product.images[1].url }}" alt="{{ product.title | escape }}" loading="lazy" decoding="async" width="600" height="600">
                  {% endif %}
                </a>
                <div class="pcard__tools">
                  <button type="button" class="pcard__tool" data-wishlist-toggle data-product-id="{{ product.id }}" aria-label="Wishlist"><i class="ph-light ph-heart" aria-hidden="true"></i></button>
                  <button type="button" class="pcard__tool" data-quickview-open data-product-id="{{ product.id }}" data-product-handle="{{ product.handle }}" aria-label="Quickview"><i class="ph-light ph-eye" aria-hidden="true"></i></button>
                </div>
                <div class="pcard__quick">
                  <button type="button" class="btn btn--contrast btn--block" data-quickview-open data-product-id="{{ product.id }}" data-product-handle="{{ product.handle }}">{% if request.locale.iso_code == 'en' %}Quick View{% else %}Xem nhanh & Thêm{% endif %}</button>
                </div>
              </div>
              <div class="pcard__body">
                <p class="pcard__cat">{% if request.locale.iso_code == 'en' %}Magnetic Switch HE{% else %}Bàn phím từ tính HE{% endif %}</p>
                <h3 class="pcard__title"><a href="{{ product.url }}">{{ product.title }}</a></h3>
                <div class="pcard__foot">
                  <div class="price"><span class="price__now">{{ product.price | money }}</span></div>
                </div>
              </div>
            </article>
          {% endfor %}
        </div>
      </div>

      <!-- Tab Accessories -->
      <div class="tabpanel" id="tab-acc" role="tabpanel" aria-labelledby="bt-acc" hidden>
        <div class="grid-products grid-products--4">
          {% for product in collections['cap-xoan'].products limit: 8 %}
            <article class="pcard reveal" data-handle="{{ product.handle }}">
              <div class="pcard__media">
                <a class="pcard__link" href="{{ product.url }}">
                  <img class="pcard__img pcard__img--main" src="{{ product.featured_image | default: product.image }}" alt="{{ product.title | escape }}" loading="lazy" decoding="async" width="600" height="600">
                  {% if product.images.size > 1 %}
                    <img class="pcard__img pcard__img--alt" src="{{ product.images[1].url }}" alt="{{ product.title | escape }}" loading="lazy" decoding="async" width="600" height="600">
                  {% endif %}
                </a>
                <div class="pcard__tools">
                  <button type="button" class="pcard__tool" data-wishlist-toggle data-product-id="{{ product.id }}" aria-label="Wishlist"><i class="ph-light ph-heart" aria-hidden="true"></i></button>
                  <button type="button" class="pcard__tool" data-quickview-open data-product-id="{{ product.id }}" data-product-handle="{{ product.handle }}" aria-label="Quickview"><i class="ph-light ph-eye" aria-hidden="true"></i></button>
                </div>
                <div class="pcard__quick">
                  <button type="button" class="btn btn--contrast btn--block" data-quickview-open data-product-id="{{ product.id }}" data-product-handle="{{ product.handle }}">{% if request.locale.iso_code == 'en' %}Quick View{% else %}Xem nhanh & Thêm{% endif %}</button>
                </div>
              </div>
              <div class="pcard__body">
                <p class="pcard__cat">{% if request.locale.iso_code == 'en' %}Accessories{% else %}Phụ kiện & Cáp xoắn{% endif %}</p>
                <h3 class="pcard__title"><a href="{{ product.url }}">{{ product.title }}</a></h3>
                <div class="pcard__foot">
                  <div class="price"><span class="price__now">{{ product.price | money }}</span></div>
                </div>
              </div>
            </article>
          {% endfor %}
        </div>
      </div>
    </div>
  </div>
</section>`;

  await call('build_section', {
    spec: {
      name: 'HADAL Best Sellers',
      handle: 'hadal-best-sellers',
      category: 'products',
      settings: STYLE_SETTINGS,
      body: bestSellersContent
    },
    overwrite: true
  });
  console.log('Updated hadal-best-sellers');

  // =========================================================================
  // 7. HADAL GIVEAWAY
  // =========================================================================
  const giveawayContent = `<section class="section section--tight" aria-labelledby="draw-h">
  <div class="wrap">
    <div class="giveaway reveal">
      <div class="giveaway__media">
        <img src="/storage/store-172/imported/1789490833333049215-2026-37-r86-he.jpg" alt="R86 HE Giveaway" width="1200" height="900" loading="lazy" decoding="async">
      </div>
      <div class="giveaway__body">
        <p class="eyebrow">{% if request.locale.iso_code == 'en' %}Round 37 &bull; Live Now{% else %}Vòng 37 &bull; Đang diễn ra{% endif %}</p>
        <h2 class="giveaway__title" id="draw-h">{% if request.locale.iso_code == 'en' %}Win an R86 HE Carbon Keyboard{% else %}Quay số nhận R86 HE Carbon{% endif %}</h2>
        <p class="muted">{% if request.locale.iso_code == 'en' %}Three lucky winners every round. Enter via Discord, no purchase required.{% else %}Ba người thắng giải mỗi vòng. Tham gia bằng tài khoản Discord, không cần mua hàng.{% endif %}</p>
        <div class="countdown" data-countdown aria-label="{% if request.locale.iso_code == 'en' %}Time remaining{% else %}Thời gian còn lại{% endif %}">
          <div class="countdown__unit"><span class="countdown__num" data-cd="d">04</span><span class="countdown__lbl">{% if request.locale.iso_code == 'en' %}days{% else %}ngày{% endif %}</span></div>
          <div class="countdown__unit"><span class="countdown__num" data-cd="h">18</span><span class="countdown__lbl">{% if request.locale.iso_code == 'en' %}hours{% else %}giờ{% endif %}</span></div>
          <div class="countdown__unit"><span class="countdown__num" data-cd="m">42</span><span class="countdown__lbl">{% if request.locale.iso_code == 'en' %}mins{% else %}phút{% endif %}</span></div>
          <div class="countdown__unit"><span class="countdown__num" data-cd="s">55</span><span class="countdown__lbl">{% if request.locale.iso_code == 'en' %}secs{% else %}giây{% endif %}</span></div>
        </div>
        <div class="giveaway__perks">
          <p class="giveaway__perk"><i class="ph-light ph-check" aria-hidden="true"></i><span>{% if request.locale.iso_code == 'en' %}Forged carbon fiber case with CNC aluminum chassis{% else %}Vỏ sợi carbon rèn và khung nhôm CNC nguyên khối{% endif %}</span></p>
          <p class="giveaway__perk"><i class="ph-light ph-check" aria-hidden="true"></i><span>{% if request.locale.iso_code == 'en' %}8000Hz polling rate, ultra-low 0.08ms latency{% else %}Polling 8000Hz, độ trễ tín hiệu cực thấp 0.08ms{% endif %}</span></p>
          <p class="giveaway__perk"><i class="ph-light ph-check" aria-hidden="true"></i><span>{% if request.locale.iso_code == 'en' %}0.005mm rapid trigger, snap tap, adjustable actuation{% else %}Rapid trigger 0.005mm, snap tap, tùy biến điểm kích hoạt{% endif %}</span></p>
          <p class="giveaway__perk"><i class="ph-light ph-check" aria-hidden="true"></i><span>{% if request.locale.iso_code == 'en' %}HUANO Glass Jade magnetic switches{% else %}Switch từ tính thế hệ mới HUANO Glass Jade{% endif %}</span></p>
        </div>
        <div class="row row--wrap">
          <a class="btn btn--primary" href="https://discord.com/invite/wJrgv72YMh" target="_blank" rel="noopener">{% if request.locale.iso_code == 'en' %}Enter Giveaway via Discord{% else %}Tham gia quay số qua Discord{% endif %}</a>
          <a class="btn btn--secondary" href="/products/r86-he-carbon-fiber-rapid-trigger-keyboard-magnetic-switch">{% if request.locale.iso_code == 'en' %}View Specs{% else %}Xem chi tiết{% endif %}</a>
        </div>
      </div>
    </div>
  </div>
</section>`;

  await call('build_section', {
    spec: {
      name: 'HADAL Giveaway',
      handle: 'hadal-giveaway',
      category: 'promotions',
      settings: STYLE_SETTINGS,
      body: giveawayContent
    },
    overwrite: true
  });
  console.log('Updated hadal-giveaway');

  // =========================================================================
  // 8. HADAL COMMUNITY UGC
  // =========================================================================
  const communityContent = `<section class="section section--tight" aria-labelledby="ugc-h">
  <div class="wrap">
    <div class="section-head">
      <div class="section-head__text">
        <h2 class="section-head__title" id="ugc-h">{% if request.locale.iso_code == 'en' %}Community Setups{% else %}Setup của cộng đồng{% endif %}</h2>
        <p class="muted">{% if request.locale.iso_code == 'en' %}Real desks and battlestations shared by community members on Instagram & Discord.{% else %}Ảnh do người dùng chia sẻ trên Instagram và Discord.{% endif %}</p>
      </div>
      <a class="link" href="https://www.instagram.com/" target="_blank" rel="noopener"><span>{% if request.locale.iso_code == 'en' %}Follow on Instagram{% else %}Theo dõi Instagram{% endif %}</span> <i class="ph-light ph-arrow-up-right" aria-hidden="true"></i></a>
    </div>
    <div class="ugc reveal">
      <a class="ugc__cell" href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Setup 1">
        <img src="/storage/store-172/imported/1789490833509215488-ugc-1.png" alt="Setup 1" loading="lazy" decoding="async" width="800" height="800">
      </a>
      <a class="ugc__cell" href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Setup 2">
        <img src="/storage/store-172/imported/1789490833681182391-ugc-2.png" alt="Setup 2" loading="lazy" decoding="async" width="600" height="600">
      </a>
      <a class="ugc__cell" href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Setup 3">
        <img src="/storage/store-172/imported/1789490833853149294-ugc-3.png" alt="Setup 3" loading="lazy" decoding="async" width="600" height="600">
      </a>
      <a class="ugc__cell" href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Setup 4">
        <img src="/storage/store-172/imported/1789490834025116197-ugc-4.png" alt="Setup 4" loading="lazy" decoding="async" width="600" height="600">
      </a>
      <a class="ugc__cell" href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Setup 5">
        <img src="/storage/store-172/imported/1789490834197083100-ugc-5.png" alt="Setup 5" loading="lazy" decoding="async" width="600" height="600">
      </a>
      <a class="ugc__cell" href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Setup 6">
        <img src="/storage/store-172/imported/1789490834369050003-ugc-6.png" alt="Setup 6" loading="lazy" decoding="async" width="800" height="800">
      </a>
      <a class="ugc__cell" href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Setup 7">
        <img src="/storage/store-172/imported/1789490834541016906-ugc-7.jpg" alt="Setup 7" loading="lazy" decoding="async" width="600" height="600">
      </a>
      <a class="ugc__cell" href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Setup 8">
        <img src="/storage/store-172/imported/1789490834712983809-ugc-8.jpg" alt="Setup 8" loading="lazy" decoding="async" width="600" height="600">
      </a>
    </div>
  </div>
</section>`;

  await call('build_section', {
    spec: {
      name: 'HADAL Community',
      handle: 'hadal-community',
      category: 'promotions',
      settings: STYLE_SETTINGS,
      body: communityContent
    },
    overwrite: true
  });
  console.log('Updated hadal-community');

  // =========================================================================
  // 9. HADAL PRESS MARQUEE
  // =========================================================================
  const pressContent = `<section class="section--tight" aria-labelledby="press-h">
  <div class="wrap" style="padding-block-end:var(--space-8)">
    <h2 class="section-head__title" id="press-h" style="font-size:var(--fs-3xl)">{% if request.locale.iso_code == 'en' %}Recognized by Technology Publications{% else %}Đã được nhắc đến trên các tạp chí công nghệ{% endif %}</h2>
  </div>
  <div class="marquee">
    <div class="marquee__track">
      <a class="marquee__item" href="https://apnews.com" target="_blank" rel="noopener"><img src="/storage/store-172/imported/1789490835000000001-apnews.svg" alt="AP News" loading="lazy" width="150" height="34"></a>
      <a class="marquee__item" href="https://finance.yahoo.com" target="_blank" rel="noopener"><img src="/storage/store-172/imported/1789490835000000002-yahoo.webp" alt="Yahoo Finance" loading="lazy" width="150" height="34"></a>
      <a class="marquee__item" href="https://www.kitguru.net" target="_blank" rel="noopener"><img src="/storage/store-172/imported/1789490835000000003-kitguru.png" alt="KitGuru" loading="lazy" width="150" height="34"></a>
      <a class="marquee__item" href="https://www.techpowerup.com" target="_blank" rel="noopener"><img src="/storage/store-172/imported/1789490835000000004-techpowerup.webp" alt="TechPowerUp" loading="lazy" width="150" height="34"></a>
      <a class="marquee__item" href="https://gagadget.com" target="_blank" rel="noopener"><img src="/storage/store-172/imported/1789490835000000005-gagadget.png" alt="Gagadget" loading="lazy" width="150" height="34"></a>
      <a class="marquee__item" href="https://www.eteknix.com" target="_blank" rel="noopener"><img src="/storage/store-172/imported/1789490835000000006-eteknix.webp" alt="eTeknix" loading="lazy" width="150" height="34"></a>
      <a class="marquee__item" href="https://www.morningstar.com" target="_blank" rel="noopener"><img src="/storage/store-172/imported/1789490835000000007-morningstar.webp" alt="Morningstar" loading="lazy" width="150" height="34"></a>
      <a class="marquee__item" href="https://www.trendhunter.com" target="_blank" rel="noopener"><img src="/storage/store-172/imported/1789490835000000008-trendhunter.webp" alt="Trend Hunter" loading="lazy" width="150" height="34"></a>

      <!-- Duplicate for loop -->
      <a class="marquee__item" aria-hidden="true" tabindex="-1" href="#"><img src="/storage/store-172/imported/1789490835000000001-apnews.svg" alt="" loading="lazy" width="150" height="34"></a>
      <a class="marquee__item" aria-hidden="true" tabindex="-1" href="#"><img src="/storage/store-172/imported/1789490835000000002-yahoo.webp" alt="" loading="lazy" width="150" height="34"></a>
      <a class="marquee__item" aria-hidden="true" tabindex="-1" href="#"><img src="/storage/store-172/imported/1789490835000000003-kitguru.png" alt="" loading="lazy" width="150" height="34"></a>
      <a class="marquee__item" aria-hidden="true" tabindex="-1" href="#"><img src="/storage/store-172/imported/1789490835000000004-techpowerup.webp" alt="" loading="lazy" width="150" height="34"></a>
      <a class="marquee__item" aria-hidden="true" tabindex="-1" href="#"><img src="/storage/store-172/imported/1789490835000000005-gagadget.png" alt="" loading="lazy" width="150" height="34"></a>
      <a class="marquee__item" aria-hidden="true" tabindex="-1" href="#"><img src="/storage/store-172/imported/1789490835000000006-eteknix.webp" alt="" loading="lazy" width="150" height="34"></a>
      <a class="marquee__item" aria-hidden="true" tabindex="-1" href="#"><img src="/storage/store-172/imported/1789490835000000007-morningstar.webp" alt="" loading="lazy" width="150" height="34"></a>
      <a class="marquee__item" aria-hidden="true" tabindex="-1" href="#"><img src="/storage/store-172/imported/1789490835000000008-trendhunter.webp" alt="" loading="lazy" width="150" height="34"></a>
    </div>
  </div>
</section>`;

  await call('build_section', {
    spec: {
      name: 'HADAL Press',
      handle: 'hadal-press',
      category: 'promotions',
      settings: STYLE_SETTINGS,
      body: pressContent
    },
    overwrite: true
  });
  console.log('Updated hadal-press');

  // =========================================================================
  // 10. HADAL EDITORIAL
  // =========================================================================
  const editorialContent = `<section class="section" aria-labelledby="blog-h">
  <div class="wrap">
    <div class="section-head">
      <div class="section-head__text">
        <h2 class="section-head__title" id="blog-h">{% if request.locale.iso_code == 'en' %}Read Before You Buy{% else %}Đọc thêm trước khi mua{% endif %}</h2>
        <p class="muted">{% if request.locale.iso_code == 'en' %}Hardware guides, technical breakdowns, and in-house benchmarks.{% else %}Hướng dẫn chọn đồ và các phép đo chúng tôi tự chạy.{% endif %}</p>
      </div>
      <a class="link" href="/blogs/news"><span>{% if request.locale.iso_code == 'en' %}All articles{% else %}Tất cả bài viết{% endif %}</span> <i class="ph-light ph-arrow-right" aria-hidden="true"></i></a>
    </div>

    <div class="editorial">
      <a class="post-lead reveal" href="/blogs/news">
        <span class="post-lead__media">
          <img src="/storage/store-172/imported/1789490833333049215-2026-37-r86-he.jpg" alt="Magnetic switches breakdown" loading="lazy" decoding="async" width="900" height="560">
        </span>
        <div class="post-meta">
          <span class="badge badge--neutral">{% if request.locale.iso_code == 'en' %}Tech Guide{% else %}Cẩm nang{% endif %}</span>
          <span class="muted text-sm">6 {% if request.locale.iso_code == 'en' %}min read{% else %}phút đọc{% endif %}</span>
        </div>
        <h3 class="post-lead__title">{% if request.locale.iso_code == 'en' %}Why Rapid Trigger 0.005mm Completely Reshapes Competitive Movement{% else %}Vì sao Rapid Trigger 0.005mm thay đổi hoàn toàn cách di chuyển trong game FPS{% endif %}</h3>
        <p class="muted">{% if request.locale.iso_code == 'en' %}From strafe-stopping to immediate key resets: a measured breakdown of magnetic switches vs traditional mechanical contacts.{% else %}Từ ngắt quán tính di chuyển tức thì đến reset phím chuẩn xác: phân tích kỹ thuật chi tiết giữa switch từ tính Hall Effect và phím cơ truyền thống.{% endif %}</p>
        <span class="link"><span>{% if request.locale.iso_code == 'en' %}Read guide{% else %}Đọc bài viết{% endif %}</span> <i class="ph-light ph-arrow-right" aria-hidden="true"></i></span>
      </a>

      <div class="post-list">
        <article class="post-item reveal">
          <div class="post-meta">
            <span class="badge badge--neutral">{% if request.locale.iso_code == 'en' %}Benchmark{% else %}Đo lường{% endif %}</span>
            <span class="muted text-sm">4 {% if request.locale.iso_code == 'en' %}min read{% else %}phút đọc{% endif %}</span>
          </div>
          <h4 class="post-item__title"><a href="/blogs/news">{% if request.locale.iso_code == 'en' %}8000Hz Polling vs 1000Hz: When Does Sensor Latency Actually Matter?{% else %}Polling 8000Hz so với 1000Hz: Khi nào độ trễ cảm biến tạo nên khác biệt thực tế?{% endif %}</a></h4>
          <p class="muted text-sm">{% if request.locale.iso_code == 'en' %}Oscilloscope measurements and frametime correlations on 360Hz and 540Hz displays.{% else %}Kết quả đo dao động ký và tương quan khung hình trên màn hình tần số quét cao 360Hz và 540Hz.{% endif %}</p>
        </article>

        <article class="post-item reveal">
          <div class="post-meta">
            <span class="badge badge--neutral">{% if request.locale.iso_code == 'en' %}Hardware{% else %}Kỹ thuật{% endif %}</span>
            <span class="muted text-sm">5 {% if request.locale.iso_code == 'en' %}min read{% else %}phút đọc{% endif %}</span>
          </div>
          <h4 class="post-item__title"><a href="/blogs/news">{% if request.locale.iso_code == 'en' %}Forged Carbon Fiber vs CNC Aluminum in Keyboard Shells{% else %}Vỏ sợi carbon rèn và nhôm CNC trong chế tạo bàn phím: Độ cứng và âm hưởng{% endif %}</a></h4>
          <p class="muted text-sm">{% if request.locale.iso_code == 'en' %}Torsional rigidity tests, acoustic spectrum analyses, and thermal conductivity.{% else %}Thử nghiệm độ kháng uốn xoắn, phổ âm thanh gõ phím và độ dẫn nhiệt trong thực tế thi đấu.{% endif %}</p>
        </article>

        <article class="post-item reveal">
          <div class="post-meta">
            <span class="badge badge--neutral">{% if request.locale.iso_code == 'en' %}Guide{% else %}Hướng dẫn{% endif %}</span>
            <span class="muted text-sm">3 {% if request.locale.iso_code == 'en' %}min read{% else %}phút đọc{% endif %}</span>
          </div>
          <h4 class="post-item__title"><a href="/blogs/news">{% if request.locale.iso_code == 'en' %}How to Choose Your Mousepad Surface: Glass vs Control vs Speed Cloth{% else %}Cách chọn bề mặt lót chuột: Kính cường lực, Vải kiểm soát hay Vải tốc độ?{% endif %}</a></h4>
          <p class="muted text-sm">{% if request.locale.iso_code == 'en' %}Static friction vs dynamic friction ratios tested across PTFE and glass skates.{% else %}Hệ số ma sát tĩnh và ma sát động đo đạc trực tiếp trên feet chuột PTFE và feet thủy tinh.{% endif %}</p>
        </article>
      </div>
    </div>
  </div>
</section>`;

  await call('build_section', {
    spec: {
      name: 'HADAL Editorial',
      handle: 'hadal-editorial',
      category: 'promotions',
      settings: STYLE_SETTINGS,
      body: editorialContent
    },
    overwrite: true
  });
  console.log('Updated hadal-editorial');

  await call('clear_storefront_cache', {});
  console.log('All sections updated and cache cleared successfully!');
}

main().catch(console.error);

