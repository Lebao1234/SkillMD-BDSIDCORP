/* Template trang chương trình học. Bố cục tham khảo onepiano.vn/chuong-trinh-chung/*:
   hero chia đôi > "dành cho bạn nếu bạn là" (hoặc chọn không gian) > tính năng > 3 bước > giáo trình > hỏi đáp > chương trình khác */
module.exports = function ({ p, others, faqList, programCard, esc }) {
  const two = (arr) => `${esc(arr[0])} <em>${esc(arr[1])}</em>`;

  const personas = p.personas
    ? `
    <section class="section">
      <div class="container">
        <h2 class="h-two">${two(p.personasTitle)}</h2>
        <div class="persona-grid">
          ${p.personas
            .map(
              (x) => `<article class="persona reveal">
            <i class="ph ${x.icon} persona-icon" aria-hidden="true"></i>
            <h3>${esc(x.title)}</h3>
            <p>${esc(x.q)}</p>
            <details class="persona-more">
              <summary>Xem thêm</summary>
              <p>${esc(x.a)}</p>
            </details>
          </article>`
            )
            .join("\n          ")}
        </div>
      </div>
    </section>`
    : "";

  const spaces = p.spaces
    ? `
    <section class="section">
      <div class="container">
        <h2 class="h-two">Chọn <em>không gian</em> lớp phù hợp với bạn</h2>
        <div class="space-grid">
          ${p.spaces
            .map(
              (s) => `<article class="space-card reveal">
            <figure class="space-media"><img src="assets/img/${s.image}" width="1200" height="900" alt="" loading="lazy"></figure>
            <div class="space-body">
              <h3>${esc(s.title)}</h3>
              <p class="program-price">${esc(s.price)}</p>
              <ul class="dot-list">${s.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
              <button class="btn btn-ghost" type="button" data-open-register data-need="Tư vấn khóa học piano">Tư vấn ngay<span class="btn-ico"><i class="ph ph-arrow-up-right" aria-hidden="true"></i></span></button>
            </div>
          </article>`
            )
            .join("\n          ")}
        </div>
      </div>
    </section>`
    : "";

  const features = p.features
    ? `
    <section class="section section-alt">
      <div class="container">
        <h2 class="h-two">${two(p.featuresTitle)}</h2>
        <div class="feature-grid">
          ${p.features
            .map(
              (f) => `<article class="feature reveal">
            <figure class="feature-media"><img src="assets/img/${f.image}" width="1200" height="900" alt="" loading="lazy"></figure>
            <h3><i class="ph ${f.icon}" aria-hidden="true"></i>${esc(f.title)}</h3>
            <p>${esc(f.text)}</p>
          </article>`
            )
            .join("\n          ")}
        </div>
      </div>
    </section>`
    : "";

  return `
    <section class="phero">
      <div class="container phero-grid">
        <div class="phero-copy">
          {{crumbs}}
          <h1>${esc(p.titleA)}<br><em>${esc(p.titleB)}</em></h1>
          <p class="lead">${esc(p.lead)}</p>
          <p class="muted">${esc(p.body)}</p>
          <p class="phero-price">${esc(p.price)}</p>
          <div class="hero-ctas">
            <button class="btn btn-primary btn-lg" type="button" data-open-register>Đăng ký học thử<span class="btn-ico"><i class="ph ph-arrow-up-right" aria-hidden="true"></i></span></button>
            <a class="text-link" href="bang-gia.html">Xem học phí <i class="ph ph-arrow-right" aria-hidden="true"></i></a>
          </div>
        </div>
        <figure class="bezel phero-media"><div class="bezel-core">
          <img src="assets/img/${p.heroImage || p.image}" width="1200" height="1400" alt="${esc(p.imageAlt)}" fetchpriority="high">
        </div></figure>
      </div>
    </section>
${personas}${spaces}${features}
    <section class="section">
      <div class="container">
        <h2 class="h-two">${two(p.stepsTitle)}</h2>
        <ol class="step-grid">
          ${p.steps
            .map(
              (s, i) => `<li class="step-card reveal">
            <span class="step-no">0${i + 1}</span>
            <h3>${esc(s.title)}</h3>
            <p>${esc(s.text)}</p>
          </li>`
            )
            .join("\n          ")}
        </ol>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <h2 class="h-two">${two(p.levelsTitle)}</h2>
        <div class="book-grid">
          ${p.levels
            .map(
              (l) => `<article class="book reveal">
            <div class="book-cover">
              <img src="assets/img/${l.image}" width="1200" height="800" alt="" loading="lazy">
              <span class="book-brand">Phím Đàn</span>
              <p class="book-title">${esc(l.name)}</p>
              <p class="book-sub">${esc(l.weeks)}</p>
            </div>
            <p class="book-text">${esc(l.text)}</p>
          </article>`
            )
            .join("\n          ")}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container faq-split">
        <div class="faq-side">
          <h2 class="h-two">Câu hỏi <em>thường gặp</em></h2>
          <p class="more-link"><a class="text-link" href="cau-hoi-thuong-gap.html">Xem tất cả câu hỏi <i class="ph ph-arrow-right" aria-hidden="true"></i></a></p>
        </div>
        ${faqList(p.faq)}
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <h2 class="h-two">Chương trình <em>khác</em></h2>
        <div class="program-grid">${others.map(programCard).join("\n")}</div>
      </div>
    </section>
`;
};
