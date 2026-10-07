/* Template trang một sảnh: hero > ảnh ghép > sơ đồ bàn > điểm riêng > bảng giá theo thực đơn > sảnh khác */
module.exports = function ({ h, i, others, menus, dots, hallStat, money, esc }) {
  const [min, max] = h.tables;
  return `
    <section class="hall-hero">
      <div class="container hall-hero-grid">
        <div class="hall-hero-copy">
          {{crumbs}}
          <p class="eyebrow">Sảnh 0${i + 1} · ${esc(h.tag)}</p>
          <h1>Sảnh <em>${esc(h.name)}</em></h1>
          <p class="hall-meaning">${esc(h.name)}, tiếng Pháp nghĩa là ${esc(h.meaning)}</p>
          <p class="lead">${esc(h.lead)}</p>
          ${hallStat(h)}
          <div class="row-actions">
            <button class="btn btn-primary btn-lg" type="button" data-open-book data-hall="${esc(h.name)}">Đặt lịch xem sảnh ${esc(h.name)}<span class="btn-ico"><i class="ph ph-arrow-up-right" aria-hidden="true"></i></span></button>
            <a class="text-link" href="#bang-gia">Xem giá theo thực đơn <i class="ph ph-arrow-down" aria-hidden="true"></i></a>
          </div>
        </div>
        <figure class="bezel hall-hero-media"><div class="bezel-core"><img src="assets/img/${h.image}" width="1600" height="1067" alt="${esc(h.imageAlt)}" fetchpriority="high"></div></figure>
      </div>
    </section>

    <section class="section">
      <div class="container hall-story">
        <div class="hall-story-text reveal">
          <h2>Sảnh ${esc(h.name)} <em>khác gì</em></h2>
          ${h.story}
          <ul class="best-for">${h.bestFor.map((b) => `<li><i class="ph ph-check" aria-hidden="true"></i>${esc(b)}</li>`).join("")}</ul>
        </div>
        <div class="hall-mosaic reveal">
          <figure class="m-a"><img src="assets/img/${h.image2}" width="1600" height="1067" alt="Một góc khác của sảnh ${esc(h.name)}" loading="lazy"></figure>
          ${h.gallery.map((g, k) => `<figure class="m-${"bcd"[k]}"><img src="assets/img/${g}" width="1200" height="1500" alt="" loading="lazy"></figure>`).join("")}
        </div>
      </div>
    </section>

    <section class="section plan-section" aria-labelledby="plan-title">
      <div class="container plan-grid">
        <div class="plan-copy reveal">
          <h2 id="plan-title">Từ <em>${min} đến ${max} bàn</em></h2>
          <p>Mỗi chấm là một bàn tròn 10 khách. Chấm sáng là số bàn tối thiểu cho tiệc tối thứ Bảy và Chủ nhật. Ngày thường và tiệc trưa, sảnh ${esc(h.name)} nhận từ ${Math.max(4, Math.round(min * 0.6))} bàn.</p>
          <dl class="plan-legend"><div><dt><i class="lg lg-min"></i>Tối thiểu cuối tuần</dt><dd>${min} bàn · ${min * 10} khách</dd></div><div><dt><i class="lg"></i>Tối đa</dt><dd>${max} bàn · ${max * 10} khách</dd></div></dl>
          <p class="muted">Sân khấu, lối đi hoa và khu đón khách đã tính sẵn, không làm giảm số bàn.</p>
        </div>
        <div class="plan-board reveal">
          <p class="plan-stage">Sân khấu</p>
          ${dots(h, "dots-lg")}
          <p class="plan-door">Cửa chính</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head reveal"><h2>Có sẵn <em>ở sảnh ${esc(h.name)}</em></h2></div>
        <div class="feature-rows">${h.features.map(([ic, t, d], k) => `
          <div class="feature-row reveal"><span class="fr-no">0${k + 1}</span><i class="ph ${ic}" aria-hidden="true"></i><h3>${esc(t)}</h3><p>${esc(d)}</p></div>`).join("")}
        </div>
      </div>
    </section>

    <section class="section" id="bang-gia" aria-labelledby="price-title">
      <div class="container">
        <div class="section-head reveal"><h2 id="price-title">Chi phí ước tính <em>ở sảnh ${esc(h.name)}</em></h2><p>Tính cho ${min} bàn, số bàn tối thiểu cuối tuần. Giá đã gồm VAT, trang trí cơ bản, MC, âm thanh ánh sáng và nước uống.</p></div>
        <div class="table-wrap reveal"><table class="cmp-table">
          <caption class="sr-only">Chi phí theo thực đơn ở sảnh ${esc(h.name)}</caption>
          <thead><tr><th scope="col">Thực đơn</th><th scope="col" class="num">Giá một bàn</th><th scope="col" class="num">${min} bàn</th><th scope="col" class="num">${max} bàn</th></tr></thead>
          <tbody>${menus.filter((m) => m.key !== "hoang-kim" || ["etoile", "soleil"].includes(h.key)).map((m) => `<tr><th scope="row"><a href="thuc-don.html#tab-${m.key}">${esc(m.name)}</a></th><td class="num">${money(m.price)}</td><td class="num">${money(m.price * min)}</td><td class="num">${money(m.price * max)}</td></tr>`).join("")}</tbody>
        </table></div>
        <p class="table-note">Muốn tính với số khách của bạn? Dùng <a class="text-link" href="thuc-don.html#du-toan">bảng dự toán chi phí</a>.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head reveal"><h2>Các sảnh <em>khác</em></h2></div>
        <div class="other-halls">${others.map((o) => `
          <a class="other-hall reveal" href="${o.slug}.html">
            <span class="bezel"><span class="bezel-core"><img src="assets/img/${o.image}" width="1600" height="1067" alt="" loading="lazy"></span></span>
            <span class="oh-name">Sảnh ${esc(o.name)}</span>
            <span class="oh-meta">${o.tables[0]} - ${o.tables[1]} bàn · ${o.area} m²</span>
          </a>`).join("")}
        </div>
      </div>
    </section>`;
};
