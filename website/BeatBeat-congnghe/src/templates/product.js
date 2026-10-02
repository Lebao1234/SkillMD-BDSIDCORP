/* Template trang sản phẩm: ảnh theo màu + khung mua > điểm nổi bật > chữ ký âm thanh > thông số > trong hộp > bài liên quan > sản phẩm khác */
module.exports = function ({ p, specList, vnd, esc, discount, stars, arrow, btnIco, related, others, cat, wave }) {
  const d = discount(p);
  const month = Math.round(p.price / 12 / 1000) * 1000;
  const eqNames = ["Trầm", "Trung", "Cao"];
  const sig = p.eq.every((x) => x === 0) ? "Phẳng, trung thực" : p.eq[0] >= 6 ? "Bass mạnh" : p.eq[0] >= 3 ? "Ấm, bass dày" : p.eq[2] >= p.eq[0] ? "Sáng, chi tiết" : "Cân bằng";
  return `
    <section class="pd" data-pd data-slug="${p.slug}">
      <div class="container pd-grid">
        <div class="pd-gallery">
          <div class="pd-stage">
            ${p.colors.map((c, i) => `<img src="assets/img/${c[2]}" width="1600" height="1067" alt="${esc(p.name)} màu ${esc(c[0])}"${i ? ' loading="lazy"' : ' class="is-on" fetchpriority="high"'} data-color-img>`).join("")}
            <span class="card-tags">${p.isNew ? '<span class="tag">Mới</span>' : ""}${d ? `<span class="tag tag-hot">-${d}%</span>` : ""}</span>
          </div>
          ${wave(56, "pd-wave")}
        </div>
        <div class="pd-buy">
          {{crumbs}}
          <p class="pd-type">${esc(cat)} · ${esc(p.type)}</p>
          <h1>${esc(p.name)}</h1>
          <p class="pd-rate">${stars(p.rating)}<strong>${p.rating}</strong><a href="#danh-gia">${p.reviews.toLocaleString("de-DE")} đánh giá</a></p>
          <p class="pd-tagline">${esc(p.tagline)}</p>
          <p class="pd-lead">${esc(p.lead)}</p>
          <div class="pd-price"><strong data-pd-price>${vnd(p.price)}</strong>${p.oldPrice ? `<s>${vnd(p.oldPrice)}</s><span class="tag tag-hot">Tiết kiệm ${vnd(p.oldPrice - p.price)}</span>` : ""}</div>
          <p class="pd-month">Hoặc <strong>${vnd(month)}</strong>/tháng, trả góp 0% trong 12 tháng</p>
          <fieldset class="pd-colors">
            <legend>Màu: <strong data-color-name>${esc(p.colors[0][0])}</strong></legend>
            <div class="swatches swatches-lg">${p.colors.map((c, i) => `<label class="sw-lg"><input type="radio" name="color" value="${i}"${i ? "" : " checked"} data-color="${i}"><span class="sw" style="--c:${c[1]}"></span><span class="sr-only">${esc(c[0])}</span></label>`).join("")}</div>
          </fieldset>
          <div class="pd-actions">
            <button class="btn btn-primary btn-lg" type="button" data-pd-add>Thêm vào giỏ${btnIco("plus")}</button>
            <button class="btn btn-ghost btn-lg" type="button" data-compare="${p.slug}" aria-pressed="false"><i class="ph ph-columns" aria-hidden="true"></i><span>So sánh</span></button>
          </div>
          <ul class="pd-promise">
            <li><i class="ph ph-truck" aria-hidden="true"></i><span><strong>Giao 2 giờ</strong> nội thành Hà Nội, TP.HCM, Đà Nẵng</span></li>
            <li><i class="ph ph-arrows-counter-clockwise" aria-hidden="true"></i><span><strong>Đổi trả 30 ngày</strong> nếu không hợp tai, kể cả đã mở hộp</span></li>
            <li><i class="ph ph-shield-check" aria-hidden="true"></i><span><strong>Bảo hành 12 tháng</strong> 1 đổi 1 trong 30 ngày đầu</span></li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head"><p class="eyebrow">Điểm nổi bật</p><h2>${esc(p.tagline)}</h2></div>
        <div class="hl-grid">${p.highlights.map(([ic, t, x], i) => `<article class="hl${i === 0 ? " hl-wide" : ""} reveal"><i class="ph ${ic}" aria-hidden="true"></i><h3>${esc(t)}</h3><p>${esc(x)}</p></article>`).join("")}</div>
      </div>
    </section>

    <section class="section section-line">
      <div class="container sig">
        <div>
          <p class="eyebrow">Chữ ký âm thanh</p>
          <h2>${esc(sig)}</h2>
          <p class="muted">Mức tăng giảm so với âm gốc ở ba dải tần, đo trên mẫu thử của BeatBeat. Mở phòng nghe thử để nghe beat mẫu qua đúng cấu hình này.</p>
          <a class="btn btn-ghost" href="phong-nghe-thu.html?sp=${p.slug}"><i class="ph ph-headphones" aria-hidden="true"></i>Nghe thử cấu hình ${esc(p.name.replace("BeatBeat ", ""))}</a>
        </div>
        <ol class="sig-bars">${p.eq.map((v, i) => `<li style="--v:${v}"><span class="sig-val">${v > 0 ? "+" : ""}${v} dB</span><span class="sig-col"><span></span></span><span class="sig-name">${eqNames[i]}</span></li>`).join("")}</ol>
      </div>
    </section>

    <section class="section">
      <div class="container specs-wrap">
        <div>
          <p class="eyebrow">Thông số</p>
          <h2>Thông số kỹ thuật</h2>
          <dl class="specs">${specList(p).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
        </div>
        <aside class="inbox">
          <h3>Trong hộp</h3>
          <ul>${p.inBox.map((x) => `<li><i class="ph ph-check" aria-hidden="true"></i>${esc(x)}</li>`).join("")}</ul>
          <p class="muted">Tải ứng dụng BeatBeat để chỉnh EQ, cập nhật phần mềm và kích hoạt bảo hành điện tử.</p>
        </aside>
      </div>
    </section>

    <section class="section section-line" id="danh-gia">
      <div class="container reviews">
        <div class="rv-score"><p class="rv-big">${p.rating}</p>${stars(p.rating)}<p class="muted">${p.reviews.toLocaleString("de-DE")} đánh giá đã mua hàng</p></div>
        <div class="rv-bars">${[5, 4, 3, 2, 1].map((s) => { const share = s === 5 ? Math.round((p.rating - 4) * 90) : s === 4 ? Math.round(100 - (p.rating - 4) * 90 - 8) : s === 3 ? 5 : s === 2 ? 2 : 1; return `<p><span>${s} sao</span><span class="rv-bar" style="--w:${Math.max(1, share)}%"></span><span>${Math.max(1, share)}%</span></p>`; }).join("")}</div>
      </div>
    </section>

    ${related.length ? `<section class="section">
      <div class="container">
        <div class="section-head section-head-row"><div><p class="eyebrow">Đọc trước khi mua</p><h2>Hướng dẫn liên quan</h2></div><a class="text-link" href="bai-viet.html">Tất cả hướng dẫn ${arrow()}</a></div>
        <div class="post-grid post-grid-sm">${related.map((x) => `<article class="post-card"><a class="post-media" href="${x.slug}.html" tabindex="-1" aria-hidden="true"><img src="assets/img/${x.image}" width="1600" height="1067" alt="" loading="lazy"></a><p class="post-meta"><span>${esc(x.cat)}</span><span>${x.read} phút đọc</span></p><h3><a href="${x.slug}.html">${esc(x.title)}</a></h3></article>`).join("")}</div>
      </div>
    </section>` : ""}

    <section class="section section-line">
      <div class="container">
        <div class="section-head section-head-row"><div><p class="eyebrow">Cùng dòng</p><h2>Có thể bạn cũng thích</h2></div><a class="text-link" href="so-sanh.html">So sánh sản phẩm ${arrow()}</a></div>
        {{products slugs="${others}"}}
      </div>
    </section>

    <div class="buybar" data-buybar aria-hidden="true">
      <div class="container buybar-in">
        <img src="assets/img/${p.colors[0][2]}" width="96" height="64" alt="" data-buybar-img>
        <p><strong>${esc(p.name)}</strong><span data-pd-price-2>${vnd(p.price)}</span></p>
        <button class="btn btn-primary" type="button" data-pd-add tabindex="-1">Thêm vào giỏ${btnIco("plus")}</button>
      </div>
    </div>`;
};
