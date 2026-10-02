const { init, call } = require('./mcp');

async function main() {
  await init();

  const body = `<section class="hero" data-hero aria-roledescription="carousel" aria-label="{% if request.locale.iso_code == 'en' %}Featured Hardware{% else %}Sản phẩm nổi bật{% endif %}">
  <div class="wrap hero__grid">

    <div class="hero__rail" role="tablist" aria-label="{% if request.locale.iso_code == 'en' %}Select featured product{% else %}Chọn sản phẩm nổi bật{% endif %}">
      <button type="button" class="hero__num is-active" role="tab" aria-selected="true" data-slide="0" aria-label="{% if request.locale.iso_code == 'en' %}Product 1 of 3{% else %}Sản phẩm 1 trong 3{% endif %}">01</button>
      <button type="button" class="hero__num" role="tab" aria-selected="false" data-slide="1" aria-label="{% if request.locale.iso_code == 'en' %}Product 2 of 3{% else %}Sản phẩm 2 trong 3{% endif %}">02</button>
      <button type="button" class="hero__num" role="tab" aria-selected="false" data-slide="2" aria-label="{% if request.locale.iso_code == 'en' %}Product 3 of 3{% else %}Sản phẩm 3 trong 3{% endif %}">03</button>
    </div>

    <div class="hero__copycol">
      <article class="hero__copy is-current" data-slide="0">
        <p class="eyebrow">{% if request.locale.iso_code == 'en' %}Pre-orders Open{% else %}Đang mở đặt trước{% endif %}</p>
        <h1 class="hero__title">R86 HE<br>Carbon</h1>
        <p class="hero__sub">{% if request.locale.iso_code == 'en' %}Forged carbon fiber case, CNC aluminum frame, HUANO Glass Jade magnetic switches.{% else %}Vỏ sợi carbon rèn, khung nhôm CNC, switch từ tính HUANO Glass Jade.{% endif %}</p>
        <div class="hero__ctas">
          <a class="btn btn--primary btn--lg" href="/collections/ban-phim-he">{% if request.locale.iso_code == 'en' %}Pre-order{% else %}Đặt trước{% endif %}</a>
          <a class="btn btn--secondary btn--lg" href="/collections/ban-phim-he">{% if request.locale.iso_code == 'en' %}View details{% else %}Xem chi tiết{% endif %}</a>
        </div>
      </article>

      <article class="hero__copy" data-slide="1" style="display:none;">
        <p class="eyebrow">{% if request.locale.iso_code == 'en' %}Ultralight Gaming{% else %}Siêu nhẹ 39g{% endif %}</p>
        <p class="hero__title">F1 Air<br>39 gram</p>
        <p class="hero__sub">{% if request.locale.iso_code == 'en' %}The lightest mouse in the lineup. Solid unibody shell, zero honeycomb cutouts.{% else %}Chuột nhẹ nhất trong dòng sản phẩm. Thân liền khối, không đục lỗ thoát khí.{% endif %}</p>
        <div class="hero__ctas">
          <a class="btn btn--primary btn--lg" href="/collections/chuot-choi-game">{% if request.locale.iso_code == 'en' %}Shop now{% else %}Mua ngay{% endif %}</a>
          <a class="btn btn--secondary btn--lg" href="/collections/chuot-choi-game">{% if request.locale.iso_code == 'en' %}View details{% else %}Xem chi tiết{% endif %}</a>
        </div>
      </article>

      <article class="hero__copy" data-slide="2" style="display:none;">
        <p class="eyebrow">{% if request.locale.iso_code == 'en' %}Tri-mode Wireless{% else %}Không dây 3 chế độ{% endif %}</p>
        <p class="hero__title">X11 Ultra<br>Carbon</p>
        <p class="hero__sub">{% if request.locale.iso_code == 'en' %}Tri-mode connectivity, desktop charging dock displaying battery and DPI in real-time.{% else %}Ba chế độ kết nối, dock hiển thị pin và DPI ngay trên bàn.{% endif %}</p>
        <div class="hero__ctas">
          <a class="btn btn--primary btn--lg" href="/collections/chuot-choi-game">{% if request.locale.iso_code == 'en' %}Shop now{% else %}Mua ngay{% endif %}</a>
          <a class="btn btn--secondary btn--lg" href="/collections/chuot-choi-game">{% if request.locale.iso_code == 'en' %}View details{% else %}Xem chi tiết{% endif %}</a>
        </div>
      </article>
    </div>

    <div class="hero__stagecol">
      <div class="hero__stage is-current" data-slide="0">
        <div class="hero__shot">
          <span class="hero__flag"><span class="badge badge--new">{% if request.locale.iso_code == 'en' %}Pre-order{% else %}Đặt trước{% endif %}</span></span>
          <img src="https://attackshark.com/cdn/shop/files/1_d5ea6201-0eb8-4943-9379-663808dd8a10.webp?v=1787796215&width=1000" alt="R86 HE Carbon" width="800" height="600" fetchpriority="high">
        </div>
        <div class="hero__specs">
          <div class="hero__spec"><b>0.005</b><span>{% if request.locale.iso_code == 'en' %}mm rapid trigger{% else %}mm rapid trigger{% endif %}</span></div>
          <div class="hero__spec"><b>8000</b><span>{% if request.locale.iso_code == 'en' %}Hz polling{% else %}Hz polling{% endif %}</span></div>
          <div class="hero__spec"><b>0.08</b><span>{% if request.locale.iso_code == 'en' %}ms latency{% else %}ms độ trễ{% endif %}</span></div>
        </div>
      </div>

      <div class="hero__stage" data-slide="1" style="display:none;">
        <div class="hero__shot">
          <span class="hero__flag"><span class="badge badge--stock">{% if request.locale.iso_code == 'en' %}In stock{% else %}Còn hàng{% endif %}</span></span>
          <img src="https://attackshark.com/cdn/shop/files/1_d8efa54b-fd23-4da9-9c5b-c1d5c21d5bd0.webp?v=1786413087&width=1000" alt="F1 Air 39g" width="800" height="600" loading="lazy">
        </div>
        <div class="hero__specs">
          <div class="hero__spec"><b>39</b><span>{% if request.locale.iso_code == 'en' %}grams{% else %}gram{% endif %}</span></div>
          <div class="hero__spec"><b>3955</b><span>{% if request.locale.iso_code == 'en' %}PAW MAX{% else %}PAW MAX{% endif %}</span></div>
          <div class="hero__spec"><b>8000</b><span>{% if request.locale.iso_code == 'en' %}Hz polling{% else %}Hz polling{% endif %}</span></div>
        </div>
      </div>

      <div class="hero__stage" data-slide="2" style="display:none;">
        <div class="hero__shot">
          <span class="hero__flag"><span class="badge badge--neutral">Tri-mode</span></span>
          <img src="https://attackshark.com/cdn/shop/files/X11ULTRA_1.png?v=1777367958&width=1000" alt="X11 Ultra Carbon" width="800" height="600" loading="lazy">
        </div>
        <div class="hero__specs">
          <div class="hero__spec"><b>63</b><span>{% if request.locale.iso_code == 'en' %}grams{% else %}gram{% endif %}</span></div>
          <div class="hero__spec"><b>42000</b><span>{% if request.locale.iso_code == 'en' %}max DPI{% else %}DPI tối đa{% endif %}</span></div>
          <div class="hero__spec"><b>8000</b><span>{% if request.locale.iso_code == 'en' %}Hz polling{% else %}Hz polling{% endif %}</span></div>
        </div>
      </div>
    </div>

  </div>
</section>

<script>
(function() {
  var root = document.querySelector('[data-hero]');
  if (!root) return;
  var btns = root.querySelectorAll('.hero__num');
  var copies = root.querySelectorAll('.hero__copy');
  var stages = root.querySelectorAll('.hero__stage');
  var cur = 0;
  var timer = null;

  function show(idx) {
    cur = idx;
    btns.forEach(function(b, i) {
      var active = (i === idx);
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    copies.forEach(function(c, i) {
      var active = (i === idx);
      c.classList.toggle('is-current', active);
      c.style.display = active ? 'block' : 'none';
    });
    stages.forEach(function(s, i) {
      var active = (i === idx);
      s.classList.toggle('is-current', active);
      s.style.display = active ? 'block' : 'none';
    });
  }

  btns.forEach(function(b, i) {
    b.addEventListener('click', function() {
      show(i);
      resetAuto();
    });
  });

  function next() {
    show((cur + 1) % 3);
  }

  function resetAuto() {
    if (timer) clearInterval(timer);
    timer = setInterval(next, 5500);
  }

  resetAuto();
})();
</script>`;

  const spec = {
    name: 'HADAL Hero',
    handle: 'hadal-hero',
    category: 'hero',
    settings: [
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
    ],
    body: body
  };

  const res = await call('build_section', { spec, overwrite: true });
  console.log('build_section hadal-hero result:', JSON.stringify(res, null, 2));
}

main().catch(console.error);

