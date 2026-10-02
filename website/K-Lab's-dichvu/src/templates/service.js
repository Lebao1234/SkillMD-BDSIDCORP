/* Template trang dịch vụ: hero > bảng giá gói > chất liệu > quy trình > cam kết > hỏi đáp > dịch vụ liên quan */
module.exports = function ({ s, related, faqList, serviceCard, esc }) {
  return `
    <section class="svc-hero">
      <div class="container svc-hero-grid">
        <div>
          {{crumbs}}
          <p class="kicker"><i class="ph-light ${s.icon}" aria-hidden="true"></i>${s.group === "do-hieu" ? "Dịch vụ đồ hiệu" : "Dịch vụ giày"}</p>
          <h1>${esc(s.name)}</h1>
          <p class="lead">${esc(s.lead)}</p>
          <p class="svc-hero-price">${esc(s.fromPrice)}</p>
          <div class="hero-ctas">
            <button class="btn btn-primary btn-lg" type="button" data-open-booking data-service="${esc(s.name)}">Đặt lịch dịch vụ<span class="btn-ico"><i class="ph-light ph-arrow-up-right" aria-hidden="true"></i></span></button>
            <a class="text-link" href="#bang-gia-goi">Xem bảng giá <i class="ph-light ph-arrow-down" aria-hidden="true"></i></a>
          </div>
        </div>
        <figure class="svc-hero-media"><img src="assets/img/${s.image}" width="1200" height="900" alt="${esc(s.imageAlt)}" fetchpriority="high"></figure>
      </div>
    </section>

    <section class="section" id="bang-gia-goi">
      <div class="container svc-price-wrap">
        <div>
          <h2 class="h2">Bảng giá</h2>
          <p class="muted">Giá cho một đôi hoặc một món. Kỹ thuật viên báo giá chính xác sau khi kiểm tra.</p>
        </div>
        <div class="price-group">
          <ul>${s.options.map((o) => `<li><div><strong>${esc(o.name)}</strong>${o.note ? `<span>${esc(o.note)}</span>` : ""}</div><p class="price-val">${esc(o.price)}</p></li>`).join("")}</ul>
          ${s.priceNote ? `<p class="price-note">${esc(s.priceNote)}</p>` : ""}
        </div>
      </div>
    </section>

    <section class="section section-muted">
      <div class="container">
        <h2 class="h2">Quy trình xử lý</h2>
        <ol class="process">
          ${s.steps.map((st, i) => `<li class="process-step reveal"><span class="process-no">0${i + 1}</span><h3>${esc(st.title)}</h3><p>${esc(st.text)}</p></li>`).join("\n          ")}
        </ol>
      </div>
    </section>

    <section class="section">
      <div class="container two-col">
        <div>
          <h2 class="h2">Chất liệu nhận xử lý</h2>
          <ul class="tag-list">${s.materials.map((m) => `<li>${esc(m)}</li>`).join("")}</ul>
        </div>
        <div>
          <h2 class="h2">Cam kết của K-Lab's</h2>
          <ul class="check-list">${s.promise.map((p) => `<li><i class="ph-fill ph-seal-check" aria-hidden="true"></i>${esc(p)}</li>`).join("")}</ul>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container faq-wrap">
        <h2 class="h2">Câu hỏi thường gặp</h2>
        ${faqList(s.faq)}
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="sec-head"><h2 class="h2">Dịch vụ khác</h2><a class="text-link" href="dich-vu.html">Tất cả dịch vụ <i class="ph-light ph-arrow-right" aria-hidden="true"></i></a></div>
        <div class="svc-grid">${related.map(serviceCard).join("\n")}</div>
      </div>
    </section>
`;
};
