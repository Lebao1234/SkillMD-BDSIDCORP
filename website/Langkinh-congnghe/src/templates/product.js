/* Template trang sản phẩm: sân khấu ảnh + chọn màu, gói > điểm nổi bật > ảnh mẫu > thông số > sản phẩm liên quan */
module.exports = function ({ p, specs, series, vnd, esc }) {
  const kitPrice = p.kit ? p.kit[1] : 0;
  const perMonth = (n) => vnd(Math.round(n / 12 / 1000) * 1000);
  return `
    <section class="pd" data-pd data-slug="${p.slug}" data-price="${p.price}" data-kit="${kitPrice}">
      <div class="container pd-grid">
        <div class="pd-stage">
          <figure class="pd-frame viewfinder">
            ${p.colors.map((c, i) => `<img src="assets/img/${c[2]}" width="1600" height="1067" alt="${esc(p.name)} màu ${esc(c[0].toLowerCase())}" data-color-img="${i}"${i ? ' loading="lazy"' : ' class="is-on" fetchpriority="high"'}>`).join("\n            ")}
            <span class="vf-corners" aria-hidden="true"></span>
            <p class="vf-read" aria-hidden="true"><span>${esc(p.name)}</span><span>${esc(p.kind === "camera" ? p.specs.sensor : p.specs.focal)}</span></p>
          </figure>
          <ul class="pd-thumbs">
            ${p.gallery.map((g) => `<li><img src="assets/img/${g}" width="1600" height="1067" alt="" loading="lazy"></li>`).join("")}
          </ul>
        </div>
        <div class="pd-info">
          {{crumbs}}
          <p class="eyebrow">${series} · ${esc(p.type)}${p.isNew ? ' · <span class="accent">Mới</span>' : ""}</p>
          <h1>${esc(p.name)}</h1>
          <p class="pd-tag">${esc(p.tagline)}</p>
          <p class="pd-lead">${esc(p.lead)}</p>
          ${p.colors.length > 1 ? `<fieldset class="opt">
            <legend>Màu <span data-color-name>${esc(p.colors[0][0])}</span></legend>
            <div class="swatches">${p.colors.map((c, i) => `<label><input type="radio" name="color" value="${esc(c[0])}" data-color="${i}"${i ? "" : " checked"}><span style="--sw:${c[1]}" title="${esc(c[0])}"></span><em class="sr-only">${esc(c[0])}</em></label>`).join("")}</div>
          </fieldset>` : ""}
          ${p.kit ? `<fieldset class="opt">
            <legend>Gói</legend>
            <div class="kits">
              <label><input type="radio" name="kit" value="body" checked data-kit-opt="0"><span><strong>Chỉ thân máy</strong><small>${vnd(p.price)}</small></span></label>
              <label><input type="radio" name="kit" value="kit" data-kit-opt="1"><span><strong>${esc(p.kit[0])}</strong><small>${vnd(p.price + p.kit[1])}</small></span></label>
            </div>
          </fieldset>` : ""}
          <div class="pd-buy">
            <p class="pd-price"><strong data-pd-price>${vnd(p.price)}</strong><span>hoặc <b data-pd-month>${perMonth(p.price)}</b>/tháng, trả góp 0% trong 12 tháng</span></p>
            <div class="pd-actions">
              <button class="btn btn-primary btn-lg" type="button" data-pd-add>Thêm vào giỏ<span class="btn-ico"><i class="ph ph-bag-simple" aria-hidden="true"></i></span></button>
              <button class="btn btn-ghost btn-lg" type="button" data-compare="${p.slug}" aria-pressed="false"><i class="ph ph-columns" aria-hidden="true"></i><span>So sánh</span></button>
            </div>
          </div>
          <ul class="pd-perks">
            <li><i class="ph ph-shield-check" aria-hidden="true"></i>Bảo hành chính hãng 24 tháng</li>
            <li><i class="ph ph-truck" aria-hidden="true"></i>Giao 2 giờ nội thành Hà Nội, TP.HCM</li>
            <li><i class="ph ph-storefront" aria-hidden="true"></i>Thử máy miễn phí tại 3 cửa hàng</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <p class="eyebrow">Điểm nổi bật</p>
        <h2 class="h2">${esc(p.tagline)}</h2>
        <ol class="hl">
          ${p.highlights.map((h, i) => `<li class="hl-item reveal"><span class="hl-no">0${i + 1}</span><h3>${esc(h[0])}</h3><p>${esc(h[1])}</p></li>`).join("\n          ")}
        </ol>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <div class="sec-head">
          <div><p class="eyebrow">Ảnh mẫu</p><h2 class="h2">Chụp bằng ${esc(p.name)}</h2></div>
          <a class="text-link" href="gia-lap-mau.html">Thử 8 công thức màu <i class="ph ph-arrow-right" aria-hidden="true"></i></a>
        </div>
        <div class="samples">
          ${p.gallery.map((g, i) => `<figure class="sample s${i + 1} reveal"><img src="assets/img/${g}" width="1600" height="1067" alt="Ảnh mẫu minh họa" loading="lazy"><figcaption>${["1/250 · f/2.0 · ISO 160", "1/60 · f/2.8 · ISO 800", "1/1000 · f/5.6 · ISO 200"][i] || ""}</figcaption></figure>`).join("\n          ")}
        </div>
        <p class="note">Ảnh minh họa từ Unsplash, không phải ảnh chụp bằng sản phẩm.</p>
      </div>
    </section>

    <section class="section">
      <div class="container spec-wrap">
        <div><p class="eyebrow">Thông số</p><h2 class="h2">Thông số chính</h2><a class="text-link" href="so-sanh.html">So sánh với máy khác <i class="ph ph-arrow-right" aria-hidden="true"></i></a></div>
        <dl class="spec-list">
          ${specs.map(([l, v]) => `<div><dt>${esc(l)}</dt><dd>${esc(v)}</dd></div>`).join("\n          ")}
        </dl>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <div class="sec-head"><h2 class="h2">Có thể bạn quan tâm</h2></div>
        {{products kind="${p.kind === "camera" ? "lens" : "camera"}" series="${p.series === "g" ? "g" : "x"}" limit="4" class="four"}}
      </div>
    </section>

    <div class="buybar" data-buybar aria-hidden="true">
      <div class="container buybar-inner">
        <p><strong>${esc(p.name)}</strong><span data-pd-price-2>${vnd(p.price)}</span></p>
        <button class="btn btn-primary btn-sm" type="button" data-pd-add tabindex="-1">Thêm vào giỏ</button>
      </div>
    </div>
`;
};
