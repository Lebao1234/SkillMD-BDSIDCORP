/* Template trang dịch vụ / công nghệ in. Bố cục tham khảo các trang dịch vụ của 3dcubix.vn:
   hero + thông số > nguyên lý từng bước > ưu điểm, hạn chế > ứng dụng + ảnh sản phẩm > hỏi đáp > dịch vụ khác */
module.exports = function ({ s, related, materials, faqList, serviceCard, esc, dots }) {
  const mats = materials.filter((m) => s.materials.includes(m.name));
  const matBlock = mats.length
    ? `
          <div class="svc-mats">
            <p class="mono-label">Vật liệu dùng cho ${esc(s.code)}</p>
            <ul>${mats.map((m) => `<li><span class="mat-swatch" style="--sw:${m.swatch}" aria-hidden="true"></span><strong>${esc(m.name)}</strong><small>${esc(m.note)}</small></li>`).join("")}</ul>
            <a class="text-link" href="vat-lieu.html">So sánh tất cả vật liệu <i class="ph ph-arrow-right" aria-hidden="true"></i></a>
          </div>`
    : "";
  const [g1, g2, g3] = s.gallery;

  return `
    <section class="svc-hero">
      <div class="container svc-hero-grid">
        <div class="svc-hero-copy">
          {{crumbs}}
          <p class="code-chip"><span>${esc(s.code)}</span>${s.group === "tech" ? "Công nghệ in" : "Dịch vụ"}</p>
          <h1>${esc(s.title)}, <em>${esc(s.titleEm)}</em></h1>
          <p class="lead">${esc(s.lead)}</p>
          <div class="hero-ctas">
            <a class="btn btn-primary btn-lg" href="#gui-file">Gửi file báo giá<span class="btn-ico"><i class="ph ph-upload-simple" aria-hidden="true"></i></span></a>
            <a class="text-link" href="bang-gia.html">${esc(s.priceFrom)} <i class="ph ph-arrow-right" aria-hidden="true"></i></a>
          </div>
        </div>
        <div class="svc-hero-media">
          <figure class="frame"><img src="assets/img/${s.heroImage}" width="1200" height="1400" alt="${esc(s.imageAlt)}" fetchpriority="high"></figure>
          <dl class="spec-sheet" aria-label="Thông số ${esc(s.name)}">
            <p class="spec-title">Thông số ${esc(s.code)}</p>
            ${s.specs.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}
          </dl>
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container layers-wrap">
        <div class="layers-head">
          <p class="mono-label">Quy trình</p>
          <h2 class="h2">${esc(s.stepsTitle)}</h2>
        </div>
        <ol class="layers">
          ${s.steps.map(([t, d], i) => `<li class="layer reveal"><span class="layer-no">L${String(i + 1).padStart(2, "0")}</span><div><h3>${esc(t)}</h3><p>${esc(d)}</p></div></li>`).join("\n          ")}
        </ol>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2 class="h2">Khi nào nên chọn <em>${esc(s.name)}</em></h2>
        <div class="procon">
          <div class="pro reveal">
            <p class="mono-label">Làm tốt</p>
            <ul>${s.pros.map((x) => `<li><i class="ph ph-plus" aria-hidden="true"></i>${esc(x)}</li>`).join("")}</ul>
          </div>
          <div class="con reveal">
            <p class="mono-label">Cần lưu ý</p>
            <ul>${s.cons.map((x) => `<li><i class="ph ph-minus" aria-hidden="true"></i>${esc(x)}</li>`).join("")}</ul>
          </div>
          <div class="fit reveal">
            <p class="mono-label">Thường dùng cho</p>
            <ul>${s.fit.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <div class="sec-head">
          <h2 class="h2">Sản phẩm <em>ra lò</em></h2>
          <a class="text-link" href="du-an.html">Xem các dự án khác <i class="ph ph-arrow-right" aria-hidden="true"></i></a>
        </div>
        <div class="svc-gallery">
          <figure class="frame g-big reveal"><img src="assets/img/${g1[0]}" width="1200" height="800" alt="${esc(g1[1])}" loading="lazy"><figcaption>${esc(g1[1])}</figcaption></figure>
          <figure class="frame reveal"><img src="assets/img/${g2[0]}" width="1200" height="800" alt="${esc(g2[1])}" loading="lazy"><figcaption>${esc(g2[1])}</figcaption></figure>
          <figure class="frame reveal"><img src="assets/img/${g3[0]}" width="1200" height="800" alt="${esc(g3[1])}" loading="lazy"><figcaption>${esc(g3[1])}</figcaption></figure>
        </div>${matBlock}
      </div>
    </section>

    <section class="section">
      <div class="container faq-split">
        <div class="faq-side">
          <h2 class="h2">Câu hỏi về <em>${esc(s.name)}</em></h2>
          <p class="muted">Chưa thấy câu trả lời? Gọi <a href="tel:{{hotline-tel}}">{{hotline}}</a>, kỹ sư trả lời trong giờ làm việc.</p>
        </div>
        ${faqList(s.faq)}
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <h2 class="h2">Dịch vụ <em>liên quan</em></h2>
        <div class="svc-grid">${related.map(serviceCard).join("\n")}</div>
      </div>
    </section>
`;
};
