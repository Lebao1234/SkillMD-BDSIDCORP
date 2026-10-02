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

  // 1. SERVICES STRIP
  const servicesBody = `<section class="wrap" aria-label="{% if request.locale.iso_code == 'en' %}Service commitments{% else %}Cam kết dịch vụ{% endif %}">
  <div class="services">
    <div class="service">
      <span class="service__icon"><i class="ph-light ph-truck" aria-hidden="true"></i></span>
      <div>
        <p class="service__title">{% if request.locale.iso_code == 'en' %}Standard Shipping{% else %}Vận chuyển tiêu chuẩn{% endif %}</p>
        <p class="service__text">{% if request.locale.iso_code == 'en' %}Free for orders over 1,500,000₫. Local warehouse delivery in 2 to 4 business days.{% else %}Miễn phí cho đơn từ 1.500.000đ. Giao nhanh toàn quốc trong 2 đến 4 ngày làm việc.{% endif %}</p>
      </div>
    </div>
    <div class="service">
      <span class="service__icon"><i class="ph-light ph-arrow-u-up-left" aria-hidden="true"></i></span>
      <div>
        <p class="service__title">{% if request.locale.iso_code == 'en' %}15-Day Returns{% else %}Đổi trả 15 ngày{% endif %}</p>
        <p class="service__text">{% if request.locale.iso_code == 'en' %}No questions asked. Ample time to test grip, weight, and switch feel on your desk.{% else %}Không cần lý do. Đủ thời gian để thử và cảm nhận xem có hợp tay và bàn di chuột không.{% endif %}</p>
      </div>
    </div>
    <div class="service">
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
      body: servicesBody
    },
    overwrite: true
  });
  console.log('built hadal-services');

  // 2. FRESH FINDS (Snap Rail)
  const freshBody = `<section class="section section--tight" aria-labelledby="fresh-h">
  <div class="wrap">
    <div class="section-head">
      <div class="section-head__text">
        <h2 class="section-head__title" id="fresh-h">{% if request.locale.iso_code == 'en' %}Fresh Arrivals{% else %}Hàng mới về{% endif %}</h2>
        <p class="muted">{% if request.locale.iso_code == 'en' %}The newest drops in competitive hardware. Scroll sideways for more.{% else %}Những model vừa lên kệ. Kéo ngang để xem thêm.{% endif %}</p>
      </div>
      <div class="row rail-nav">
        <a class="link" href="/collections/hang-moi"><span>{% if request.locale.iso_code == 'en' %}View all{% else %}Xem tất cả{% endif %}</span> <i class="ph-light ph-arrow-right" aria-hidden="true"></i></a>
        <button type="button" class="icon-btn icon-btn--bordered" data-fresh-prev aria-label="Cuộn sang trái"><i class="ph-light ph-arrow-left" aria-hidden="true"></i></button>
        <button type="button" class="icon-btn icon-btn--bordered" data-fresh-next aria-label="Cuộn sang phải"><i class="ph-light ph-arrow-right" aria-hidden="true"></i></button>
      </div>
    </div>
    <div class="rail" data-fresh>
      {% for product in collections['hang-moi'].products limit: 8 %}
        <article class="card">
          <div class="card__thumb">
            {% if product.featured_image != blank %}
              <img src="{{ product.featured_image }}" alt="{{ product.title | escape }}" loading="lazy" width="400" height="400">
            {% endif %}
            <span class="card__badge badge badge--new">{% if request.locale.iso_code == 'en' %}New{% else %}Mới{% endif %}</span>
          </div>
          <div class="card__body">
            <h3 class="card__title"><a href="{{ product.url }}">{{ product.title }}</a></h3>
            <div class="card__price">{{ product.price | money }}</div>
          </div>
        </article>
      {% else %}
        {% for product in collections['featured'].products limit: 8 %}
          <article class="card">
            <div class="card__thumb">
              {% if product.featured_image != blank %}
                <img src="{{ product.featured_image }}" alt="{{ product.title | escape }}" loading="lazy" width="400" height="400">
              {% endif %}
              <span class="card__badge badge badge--new">{% if request.locale.iso_code == 'en' %}New{% else %}Mới{% endif %}</span>
            </div>
            <div class="card__body">
              <h3 class="card__title"><a href="{{ product.url }}">{{ product.title }}</a></h3>
              <div class="card__price">{{ product.price | money }}</div>
            </div>
          </article>
        {% endfor %}
      {% endfor %}
    </div>
  </div>
</section>

<script>
(function() {
  var rail = document.querySelector('[data-fresh]');
  var prev = document.querySelector('[data-fresh-prev]');
  var next = document.querySelector('[data-fresh-next]');
  if (!rail) return;
  if (prev) prev.addEventListener('click', function() { rail.scrollBy({ left: -320, behavior: 'smooth' }); });
  if (next) next.addEventListener('click', function() { rail.scrollBy({ left: 320, behavior: 'smooth' }); });
})();
</script>`;

  await call('build_section', {
    spec: {
      name: 'HADAL Fresh Finds',
      handle: 'hadal-fresh',
      category: 'collection',
      settings: STYLE_SETTINGS,
      body: freshBody
    },
    overwrite: true
  });
  console.log('built hadal-fresh');

  // 3. SPOTLIGHT (Asymmetric Bento)
  const spotlightBody = `<section class="section section--tight" aria-labelledby="spot-h">
  <div class="wrap">
    <div class="section-head">
      <div class="section-head__text">
        <p class="eyebrow">{% if request.locale.iso_code == 'en' %}Three standout models this quarter{% else %}Ba model đáng chú ý nhất quý này{% endif %}</p>
        <h2 class="section-head__title" id="spot-h">{% if request.locale.iso_code == 'en' %}Curated Spotlight{% else %}Được chọn ra{% endif %}</h2>
      </div>
    </div>
    <div class="bento">
      <!-- Large primary bento card -->
      <article class="bento__cell bento__cell--large">
        <div class="bento__media">
          <img src="https://attackshark.com/cdn/shop/files/1_d5ea6201-0eb8-4943-9379-663808dd8a10.webp?v=1787796215&width=800" alt="R86 HE Carbon" loading="lazy">
        </div>
        <div class="bento__content">
          <span class="badge badge--accent">Magnetic HE</span>
          <h3 class="bento__title">R86 HE Carbon Fiber</h3>
          <p class="bento__desc">{% if request.locale.iso_code == 'en' %}Rapid trigger down to 0.005mm with custom CNC aluminum chassis and HUANO Glass Jade switches.{% else %}Rapid trigger 0.005mm, khung nhôm CNC nguyên khối và switch từ tính HUANO Glass Jade.{% endif %}</p>
          <div class="bento__meta">
            <span>8000Hz Polling</span> &bull; <span>0.08ms Latency</span>
          </div>
          <a class="btn btn--primary" href="/collections/ban-phim-he">{% if request.locale.iso_code == 'en' %}Explore R86 HE{% else %}Xem R86 HE{% endif %}</a>
        </div>
      </article>

      <!-- Small card 1 -->
      <article class="bento__cell">
        <div class="bento__media">
          <img src="https://attackshark.com/cdn/shop/files/1_d8efa54b-fd23-4da9-9c5b-c1d5c21d5bd0.webp?v=1786413087&width=600" alt="F1 Air 39g" loading="lazy">
        </div>
        <div class="bento__content">
          <span class="badge badge--stock">39g Ultralight</span>
          <h3 class="bento__title">F1 Air Wireless</h3>
          <p class="bento__desc">{% if request.locale.iso_code == 'en' %}Solid unibody build with PAW3950MAX sensor and 8000Hz polling rate.{% else %}Thân đúc liền khối không đục lỗ, cảm biến PAW3950MAX và polling 8000Hz.{% endif %}</p>
          <a class="btn btn--secondary" href="/collections/chuot-choi-game">{% if request.locale.iso_code == 'en' %}Shop now{% else %}Mua ngay{% endif %}</a>
        </div>
      </article>

      <!-- Small card 2 -->
      <article class="bento__cell">
        <div class="bento__media">
          <img src="https://attackshark.com/cdn/shop/files/X11ULTRA_1.png?v=1777367958&width=600" alt="X11 Ultra" loading="lazy">
        </div>
        <div class="bento__content">
          <span class="badge badge--neutral">Tri-mode Dock</span>
          <h3 class="bento__title">X11 Ultra Carbon</h3>
          <p class="bento__desc">{% if request.locale.iso_code == 'en' %}Included desktop dock with live RGB screen showing real-time battery and DPI.{% else %}Kèm dock sạc thông minh màn hình màu theo dõi pin và DPI trực tiếp trên bàn.{% endif %}</p>
          <a class="btn btn--secondary" href="/collections/chuot-choi-game">{% if request.locale.iso_code == 'en' %}Shop now{% else %}Mua ngay{% endif %}</a>
        </div>
      </article>
    </div>
  </div>
</section>`;

  await call('build_section', {
    spec: {
      name: 'HADAL Spotlight',
      handle: 'hadal-spotlight',
      category: 'featured',
      settings: STYLE_SETTINGS,
      body: spotlightBody
    },
    overwrite: true
  });
  console.log('built hadal-spotlight');

  // 4. CATEGORIES TILE WALL (7 tiles)
  const catsBody = `<section class="section section--tight" aria-labelledby="cats-h">
  <div class="wrap">
    <div class="section-head">
      <div class="section-head__text">
        <h2 class="section-head__title" id="cats-h">{% if request.locale.iso_code == 'en' %}Shop by Category{% else %}Mua theo danh mục{% endif %}</h2>
        <p class="muted">{% if request.locale.iso_code == 'en' %}Engineered peripherals, surfaces, and custom tuning accessories.{% else %}Thiết bị ngoại vi, bề mặt di chuột và phụ kiện tùy biến chuyên nghiệp.{% endif %}</p>
      </div>
      <a class="link" href="/collections"><span>{% if request.locale.iso_code == 'en' %}All categories{% else %}Tất cả danh mục{% endif %}</span> <i class="ph-light ph-arrow-right" aria-hidden="true"></i></a>
    </div>
    <div class="cats">
      <a class="cat-tile" href="/collections/chuot-choi-game">
        <span class="cat-tile__icon"><i class="ph-light ph-mouse"></i></span>
        <div class="cat-tile__info">
          <h3 class="cat-tile__title">{% if request.locale.iso_code == 'en' %}Gaming Mice{% else %}Chuột chơi game{% endif %}</h3>
          <p class="cat-tile__meta">{% if request.locale.iso_code == 'en' %}From 39g, PAW3950MAX, 8000Hz{% else %}Từ 39g, PAW3950MAX, 8000Hz{% endif %}</p>
        </div>
        <span class="cat-tile__cta"><i class="ph-light ph-arrow-right"></i></span>
      </a>

      <a class="cat-tile" href="/collections/ban-phim-he">
        <span class="cat-tile__icon"><i class="ph-light ph-keyboard"></i></span>
        <div class="cat-tile__info">
          <h3 class="cat-tile__title">{% if request.locale.iso_code == 'en' %}Hall Effect Keyboards{% else %}Bàn phím từ tính HE{% endif %}</h3>
          <p class="cat-tile__meta">{% if request.locale.iso_code == 'en' %}Rapid trigger, 0.005mm step{% else %}Rapid trigger, bước 0,005mm{% endif %}</p>
        </div>
        <span class="cat-tile__cta"><i class="ph-light ph-arrow-right"></i></span>
      </a>

      <a class="cat-tile" href="/collections/ban-phim-co">
        <span class="cat-tile__icon"><i class="ph-light ph-faders"></i></span>
        <div class="cat-tile__info">
          <h3 class="cat-tile__title">{% if request.locale.iso_code == 'en' %}Mechanical Keyboards{% else %}Bàn phím cơ{% endif %}</h3>
          <p class="cat-tile__meta">{% if request.locale.iso_code == 'en' %}Gasket mount, hot-swap, tri-mode{% else %}Gasket mount, hot-swap, 3 chế độ{% endif %}</p>
        </div>
        <span class="cat-tile__cta"><i class="ph-light ph-arrow-right"></i></span>
      </a>

      <a class="cat-tile" href="/collections/lot-chuot">
        <span class="cat-tile__icon"><i class="ph-light ph-square"></i></span>
        <div class="cat-tile__info">
          <h3 class="cat-tile__title">{% if request.locale.iso_code == 'en' %}Mousepads{% else %}Lót chuột{% endif %}</h3>
          <p class="cat-tile__meta">{% if request.locale.iso_code == 'en' %}Speed cloth and tempered glass{% else %}Vải tốc độ cao và kính cường lực{% endif %}</p>
        </div>
        <span class="cat-tile__cta"><i class="ph-light ph-arrow-right"></i></span>
      </a>

      <a class="cat-tile" href="/collections/cap-xoan">
        <span class="cat-tile__icon"><i class="ph-light ph-plugs"></i></span>
        <div class="cat-tile__info">
          <h3 class="cat-tile__title">{% if request.locale.iso_code == 'en' %}Coiled Cables{% else %}Cáp xoắn{% endif %}</h3>
          <p class="cat-tile__meta">{% if request.locale.iso_code == 'en' %}Paracord with magnetic aviator{% else %}Paracord nhẹ, đầu nối nam châm{% endif %}</p>
        </div>
        <span class="cat-tile__cta"><i class="ph-light ph-arrow-right"></i></span>
      </a>

      <a class="cat-tile" href="/collections/combo">
        <span class="cat-tile__icon"><i class="ph-light ph-stack"></i></span>
        <div class="cat-tile__info">
          <h3 class="cat-tile__title">{% if request.locale.iso_code == 'en' %}Value Bundles{% else %}Combo tiết kiệm{% endif %}</h3>
          <p class="cat-tile__meta">{% if request.locale.iso_code == 'en' %}Curated desk setup packs{% else %}Bộ phụ kiện setup đồng bộ{% endif %}</p>
        </div>
        <span class="cat-tile__cta"><i class="ph-light ph-arrow-right"></i></span>
      </a>

      <a class="cat-tile" href="/collections/phu-kien">
        <span class="cat-tile__icon"><i class="ph-light ph-gear-six"></i></span>
        <div class="cat-tile__info">
          <h3 class="cat-tile__title">{% if request.locale.iso_code == 'en' %}Accessories{% else %}Phụ kiện & Linh kiện{% endif %}</h3>
          <p class="cat-tile__meta">{% if request.locale.iso_code == 'en' %}Switches, keycaps, grip tape{% else %}Switch, keycap, grip tape{% endif %}</p>
        </div>
        <span class="cat-tile__cta"><i class="ph-light ph-arrow-right"></i></span>
      </a>
    </div>
  </div>
</section>`;

  await call('build_section', {
    spec: {
      name: 'HADAL Categories Wall',
      handle: 'hadal-categories',
      category: 'collection',
      settings: STYLE_SETTINGS,
      body: catsBody
    },
    overwrite: true
  });
  console.log('built hadal-categories');

  // 5. BEST SELLERS
  const bestBody = `<section class="section" aria-labelledby="best-h">
  <div class="wrap">
    <div class="section-head">
      <div class="section-head__text">
        <h2 class="section-head__title" id="best-h">{% if request.locale.iso_code == 'en' %}Best Sellers{% else %}Bán chạy nhất{% endif %}</h2>
        <p class="muted">{% if request.locale.iso_code == 'en' %}Ranked by unit sales across competitive communities over the last 12 months.{% else %}Xếp theo số lượng bán ra trong một năm gần nhất.{% endif %}</p>
      </div>
      <a class="link" href="/collections/featured"><span>{% if request.locale.iso_code == 'en' %}View all{% else %}Xem tất cả{% endif %}</span> <i class="ph-light ph-arrow-right" aria-hidden="true"></i></a>
    </div>
    <div class="product-grid" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(260px, 1fr));gap:24px;">
      {% for product in collections['featured'].products limit: 8 %}
        <article class="card">
          <div class="card__thumb">
            {% if product.featured_image != blank %}
              <img src="{{ product.featured_image }}" alt="{{ product.title | escape }}" loading="lazy" width="400" height="400">
            {% endif %}
            <span class="card__badge badge badge--accent">Hot</span>
          </div>
          <div class="card__body">
            <h3 class="card__title"><a href="{{ product.url }}">{{ product.title }}</a></h3>
            <div class="card__price">{{ product.price | money }}</div>
            <a class="btn btn--secondary btn--sm" href="{{ product.url }}" style="margin-top:12px;width:100%;text-align:center;">{% if request.locale.iso_code == 'en' %}View details{% else %}Xem chi tiết{% endif %}</a>
          </div>
        </article>
      {% endfor %}
    </div>
  </div>
</section>`;

  await call('build_section', {
    spec: {
      name: 'HADAL Best Sellers',
      handle: 'hadal-best-sellers',
      category: 'collection',
      settings: STYLE_SETTINGS,
      body: bestBody
    },
    overwrite: true
  });
  console.log('built hadal-best-sellers');

  // 6. GIVEAWAY
  const giveawayBody = `<section class="section section--tight" aria-labelledby="draw-h">
  <div class="wrap">
    <div class="giveaway">
      <div class="giveaway__media">
        <img src="https://attackshark.com/cdn/shop/files/2026_37_-R86_HE.jpg?v=1789040428&width=1200" alt="R86 HE Giveaway" width="1200" height="900" loading="lazy">
      </div>
      <div class="giveaway__body">
        <p class="eyebrow">{% if request.locale.iso_code == 'en' %}Round 37 &bull; Live Now{% else %}Vòng 37 &bull; Đang diễn ra{% endif %}</p>
        <h2 class="giveaway__title" id="draw-h">{% if request.locale.iso_code == 'en' %}Win an R86 HE Carbon Keyboard{% else %}Quay số nhận R86 HE Carbon{% endif %}</h2>
        <p class="muted">{% if request.locale.iso_code == 'en' %}Three lucky winners every round. Enter via Discord, no purchase required.{% else %}Ba người thắng giải mỗi vòng. Tham gia bằng tài khoản Discord, không cần mua hàng.{% endif %}</p>
        
        <div class="countdown" id="hadal-countdown">
          <div class="countdown__item"><b id="cd-days">04</b><span>{% if request.locale.iso_code == 'en' %}Days{% else %}Ngày{% endif %}</span></div>
          <div class="countdown__item"><b id="cd-hours">12</b><span>{% if request.locale.iso_code == 'en' %}Hours{% else %}Giờ{% endif %}</span></div>
          <div class="countdown__item"><b id="cd-mins">45</b><span>{% if request.locale.iso_code == 'en' %}Mins{% else %}Phút{% endif %}</span></div>
          <div class="countdown__item"><b id="cd-secs">30</b><span>{% if request.locale.iso_code == 'en' %}Secs{% else %}Giây{% endif %}</span></div>
        </div>

        <div class="giveaway__perks">
          <p class="giveaway__perk"><i class="ph-light ph-check" aria-hidden="true"></i><span>{% if request.locale.iso_code == 'en' %}Forged carbon fiber unibody with CNC aluminum frame{% else %}Vỏ sợi carbon rèn và khung nhôm CNC{% endif %}</span></p>
          <p class="giveaway__perk"><i class="ph-light ph-check" aria-hidden="true"></i><span>{% if request.locale.iso_code == 'en' %}8000Hz polling rate, ultra-low 0.08ms latency{% else %}Polling 8000Hz, độ trễ 0.08ms{% endif %}</span></p>
          <p class="giveaway__perk"><i class="ph-light ph-check" aria-hidden="true"></i><span>{% if request.locale.iso_code == 'en' %}0.005mm rapid trigger with adjustable actuation{% else %}Rapid trigger 0.005mm, actuation tùy chỉnh{% endif %}</span></p>
          <p class="giveaway__perk"><i class="ph-light ph-check" aria-hidden="true"></i><span>{% if request.locale.iso_code == 'en' %}HUANO Glass Jade magnetic switches{% else %}Switch từ tính HUANO Glass Jade{% endif %}</span></p>
        </div>

        <div class="row row--wrap" style="display:flex;gap:14px;align-items:center;margin-top:24px;">
          <a class="btn btn--primary" href="https://discord.com" target="_blank" rel="noopener">{% if request.locale.iso_code == 'en' %}Enter Giveaway{% else %}Tham gia quay số{% endif %}</a>
          <a class="btn btn--secondary" href="/collections/ban-phim-he">{% if request.locale.iso_code == 'en' %}View R86 HE{% else %}Xem chi tiết{% endif %}</a>
        </div>
      </div>
    </div>
  </div>
</section>

<script>
(function() {
  var target = new Date();
  target.setDate(target.getDate() + 4);
  target.setHours(target.getHours() + 12);
  function tick() {
    var diff = Math.max(0, target - new Date());
    var d = Math.floor(diff / (1000 * 60 * 60 * 24));
    var h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    var m = Math.floor((diff / (1000 * 60)) % 60);
    var s = Math.floor((diff / 1000) % 60);
    var elD = document.getElementById('cd-days');
    var elH = document.getElementById('cd-hours');
    var elM = document.getElementById('cd-mins');
    var elS = document.getElementById('cd-secs');
    if (elD) elD.textContent = String(d).padStart(2, '0');
    if (elH) elH.textContent = String(h).padStart(2, '0');
    if (elM) elM.textContent = String(m).padStart(2, '0');
    if (elS) elS.textContent = String(s).padStart(2, '0');
  }
  tick();
  setInterval(tick, 1000);
})();
</script>`;

  await call('build_section', {
    spec: {
      name: 'HADAL Giveaway',
      handle: 'hadal-giveaway',
      category: 'promo',
      settings: STYLE_SETTINGS,
      body: giveawayBody
    },
    overwrite: true
  });
  console.log('built hadal-giveaway');

  // 7. COMMUNITY (UGC photo masonry)
  const communityBody = `<section class="section section--tight" aria-labelledby="ugc-h">
  <div class="wrap">
    <div class="section-head">
      <div class="section-head__text">
        <h2 class="section-head__title" id="ugc-h">{% if request.locale.iso_code == 'en' %}Community Setups{% else %}Setup của cộng đồng{% endif %}</h2>
        <p class="muted">{% if request.locale.iso_code == 'en' %}Battlestations and creative setups shared on Instagram and Discord.{% else %}Ảnh do người dùng chia sẻ trên Instagram và Discord.{% endif %}</p>
      </div>
      <a class="link" href="https://www.instagram.com/" target="_blank" rel="noopener"><span>{% if request.locale.iso_code == 'en' %}Follow on Instagram{% else %}Theo dõi Instagram{% endif %}</span> <i class="ph-light ph-arrow-up-right" aria-hidden="true"></i></a>
    </div>
    <div class="ugc">
      <a class="ugc__cell" href="https://www.instagram.com/" target="_blank" rel="noopener">
        <img src="https://attackshark.com/cdn/shop/files/PixPin_2026-07-08_11-15-50.png?v=1783480581&width=800" alt="Setup 1" loading="lazy" width="800" height="800">
      </a>
      <a class="ugc__cell" href="https://www.instagram.com/" target="_blank" rel="noopener">
        <img src="https://attackshark.com/cdn/shop/files/PixPin_2026-07-08_11-18-42.png?v=1783480773&width=600" alt="Setup 2" loading="lazy" width="600" height="600">
      </a>
      <a class="ugc__cell" href="https://www.instagram.com/" target="_blank" rel="noopener">
        <img src="https://attackshark.com/cdn/shop/files/PixPin_2026-07-25_09-50-41.png?v=1784944274&width=600" alt="Setup 3" loading="lazy" width="600" height="600">
      </a>
      <a class="ugc__cell" href="https://www.instagram.com/" target="_blank" rel="noopener">
        <img src="https://attackshark.com/cdn/shop/files/PixPin_2026-07-25_09-40-34.png?v=1784943666&width=600" alt="Setup 4" loading="lazy" width="600" height="600">
      </a>
      <a class="ugc__cell" href="https://www.instagram.com/" target="_blank" rel="noopener">
        <img src="https://attackshark.com/cdn/shop/files/PixPin_2026-08-22_10-09-42.png?v=1787364628&width=600" alt="Setup 5" loading="lazy" width="600" height="600">
      </a>
      <a class="ugc__cell" href="https://www.instagram.com/" target="_blank" rel="noopener">
        <img src="https://attackshark.com/cdn/shop/files/PixPin_2026-08-22_10-07-40.png?v=1787364515&width=800" alt="Setup 6" loading="lazy" width="800" height="800">
      </a>
      <a class="ugc__cell" href="https://www.instagram.com/" target="_blank" rel="noopener">
        <img src="https://attackshark.com/cdn/shop/files/ee610c01f535b74fd3f381b54bb5287f_e6f010f7-d321-41bf-aaf1-dbcd05f26954.jpg?v=1742276777&width=600" alt="Setup 7" loading="lazy" width="600" height="600">
      </a>
      <a class="ugc__cell" href="https://www.instagram.com/" target="_blank" rel="noopener">
        <img src="https://attackshark.com/cdn/shop/files/cb875fa2c12380afb8600ca144cba11b_22b28f4a-f43a-40eb-a767-5a94042f2cd6.jpg?v=1742276763&width=600" alt="Setup 8" loading="lazy" width="600" height="600">
      </a>
    </div>
  </div>
</section>`;

  await call('build_section', {
    spec: {
      name: 'HADAL Community',
      handle: 'hadal-community',
      category: 'social',
      settings: STYLE_SETTINGS,
      body: communityBody
    },
    overwrite: true
  });
  console.log('built hadal-community');

  // 8. PRESS MARQUEE
  const pressBody = `<section class="section--tight" aria-labelledby="press-h">
  <div class="wrap" style="padding-bottom: 24px;">
    <h2 class="section-head__title" id="press-h" style="font-size: var(--fs-2xl, 24px); text-align: center;">{% if request.locale.iso_code == 'en' %}Featured In{% else %}Đã được nhắc đến trên{% endif %}</h2>
  </div>
  <div class="marquee">
    <div class="marquee__track">
      <div class="marquee__item"><img src="https://attackshark.com/cdn/shop/files/aplogo.svg?v=1781682589&width=400" alt="AP News" loading="lazy" width="140" height="32"></div>
      <div class="marquee__item"><img src="https://attackshark.com/cdn/shop/files/11_965739a1-a8b2-4038-800d-7ba5c44bd0a1.webp?v=1773624493&width=400" alt="Yahoo Finance" loading="lazy" width="140" height="32"></div>
      <div class="marquee__item"><img src="https://attackshark.com/cdn/shop/files/kitguru_400x200_8ed63a98-b642-4813-9d11-0f9e9c127b4c.png?v=1788155575&width=400" alt="KitGuru" loading="lazy" width="140" height="32"></div>
      <div class="marquee__item"><img src="https://attackshark.com/cdn/shop/files/13_83d5edeb-1c1f-4ef9-b23e-6b10c095240a.webp?v=1773624595&width=400" alt="TechPowerUp" loading="lazy" width="140" height="32"></div>
      <div class="marquee__item"><img src="https://attackshark.com/cdn/shop/files/gagadgets_400x200_eaddf3a4-41ad-412c-9e94-d3e2772379b4.png?v=1788155698&width=400" alt="Gagadget" loading="lazy" width="140" height="32"></div>
      <div class="marquee__item"><img src="https://attackshark.com/cdn/shop/files/6_20ebb831-abda-41fb-bbc8-e0f81435b1a3.webp?v=1773624195&width=400" alt="eTeknix" loading="lazy" width="140" height="32"></div>
      <div class="marquee__item"><img src="https://attackshark.com/cdn/shop/files/9_4ff58284-32f5-4801-9a8a-f65520ebceb7.webp?v=1773624415&width=400" alt="Morningstar" loading="lazy" width="140" height="32"></div>
      <div class="marquee__item"><img src="https://attackshark.com/cdn/shop/files/12_9106b383-c32f-401d-873e-39bd25f5d3b2.webp?v=1773624539&width=400" alt="AOL" loading="lazy" width="140" height="32"></div>
      <!-- duplicate for continuous loop -->
      <div class="marquee__item"><img src="https://attackshark.com/cdn/shop/files/aplogo.svg?v=1781682589&width=400" alt="AP News" loading="lazy" width="140" height="32"></div>
      <div class="marquee__item"><img src="https://attackshark.com/cdn/shop/files/11_965739a1-a8b2-4038-800d-7ba5c44bd0a1.webp?v=1773624493&width=400" alt="Yahoo Finance" loading="lazy" width="140" height="32"></div>
      <div class="marquee__item"><img src="https://attackshark.com/cdn/shop/files/kitguru_400x200_8ed63a98-b642-4813-9d11-0f9e9c127b4c.png?v=1788155575&width=400" alt="KitGuru" loading="lazy" width="140" height="32"></div>
      <div class="marquee__item"><img src="https://attackshark.com/cdn/shop/files/13_83d5edeb-1c1f-4ef9-b23e-6b10c095240a.webp?v=1773624595&width=400" alt="TechPowerUp" loading="lazy" width="140" height="32"></div>
    </div>
  </div>
</section>`;

  await call('build_section', {
    spec: {
      name: 'HADAL Press Marquee',
      handle: 'hadal-press',
      category: 'social',
      settings: STYLE_SETTINGS,
      body: pressBody
    },
    overwrite: true
  });
  console.log('built hadal-press');

  // 9. EDITORIAL / BLOG SECTION
  const blogBody = `<section class="section" aria-labelledby="blog-h">
  <div class="wrap">
    <div class="section-head">
      <div class="section-head__text">
        <h2 class="section-head__title" id="blog-h">{% if request.locale.iso_code == 'en' %}Read Before You Buy{% else %}Đọc thêm trước khi mua{% endif %}</h2>
        <p class="muted">{% if request.locale.iso_code == 'en' %}Hardware guides, technical breakdowns, and in-house benchmarks.{% else %}Hướng dẫn chọn đồ và các phép đo chúng tôi tự chạy.{% endif %}</p>
      </div>
      <a class="link" href="/blogs"><span>{% if request.locale.iso_code == 'en' %}All articles{% else %}Tất cả bài viết{% endif %}</span> <i class="ph-light ph-arrow-right" aria-hidden="true"></i></a>
    </div>

    <div class="editorial">
      {% assign lead = recent_articles | first %}
      {% if lead %}
        <article class="post-lead">
          <div class="post-lead__media">
            {% if lead.featured_image != blank %}
              <img src="{{ lead.featured_image }}" alt="{{ lead.title | escape }}" loading="lazy">
            {% endif %}
          </div>
          <div class="post-lead__body">
            <span class="badge badge--neutral">{% if request.locale.iso_code == 'en' %}Featured Guide{% else %}Bài tiêu điểm{% endif %}</span>
            <h3 class="post-lead__title"><a href="/blogs/{{ lead.slug | default: lead.handle }}">{{ lead.title }}</a></h3>
            <p class="post-lead__desc">{{ lead.excerpt | strip_html | truncate: 160 }}</p>
            <a class="link" href="/blogs/{{ lead.slug | default: lead.handle }}"><span>{% if request.locale.iso_code == 'en' %}Read guide{% else %}Đọc bài viết{% endif %}</span> <i class="ph-light ph-arrow-right"></i></a>
          </div>
        </article>
      {% endif %}

      <div class="post-list">
        {% for a in recent_articles offset: 1 limit: 3 %}
          <article class="post-item">
            <div class="post-item__thumb">
              {% if a.featured_image != blank %}
                <img src="{{ a.featured_image }}" alt="{{ a.title | escape }}" loading="lazy" width="180" height="120">
              {% endif %}
            </div>
            <div class="post-item__body">
              <h4 class="post-item__title"><a href="/blogs/{{ a.slug | default: a.handle }}">{{ a.title }}</a></h4>
              <p class="post-item__desc">{{ a.excerpt | strip_html | truncate: 90 }}</p>
            </div>
          </article>
        {% endfor %}
      </div>
    </div>
  </div>
</section>`;

  await call('build_section', {
    spec: {
      name: 'HADAL Editorial',
      handle: 'hadal-editorial',
      category: 'blog',
      settings: STYLE_SETTINGS,
      body: blogBody
    },
    overwrite: true
  });
  console.log('built hadal-editorial');

  console.log('All bespoke sections built successfully!');
}

main().catch(console.error);

