/* Template trang chi tiết khóa học. Bố cục tham khảo trang khóa học của Wall Street English:
   hero > hộp 3 câu hỏi > lộ trình cấp độ (tabs) > chu kỳ học > điểm nổi bật > cảm nhận > lịch > hỏi đáp > khóa liên quan */
module.exports = function ({ c, related, crumbs, scheduleGrid, faqList, courseCard, esc }) {
  const levelTabs = c.levels
    .map(
      (l, i) => `<button class="tab" role="tab" id="lv-${i}" aria-controls="lv-panel-${i}" aria-selected="${i === 0}"${i ? ' tabindex="-1"' : ""} type="button">${esc(l.name)} <span>${esc(l.cefr)}</span></button>`
    )
    .join("\n");
  const levelPanels = c.levels
    .map(
      (l, i) => `<div class="level-panel" role="tabpanel" id="lv-panel-${i}" aria-labelledby="lv-${i}"${i ? " hidden" : ""}>
            <div class="level-head">
              <h3>${esc(l.name)}</h3>
              <p class="level-tags"><span>Trình độ ${esc(l.cefr)}</span><span>${esc(l.dur)}</span></p>
            </div>
            <p class="level-desc">${esc(l.desc)}</p>
            <div class="level-out">
              <p class="level-out-title">Sau cấp độ này, học viên có thể</p>
              <ul class="check-list">${l.outcomes.map((o) => `<li><i class="ph-fill ph-check-circle" aria-hidden="true"></i>${esc(o)}</li>`).join("")}</ul>
            </div>
          </div>`
    )
    .join("\n");

  const hasSchedule = ["kids", "teens", "ielts", "work"].includes(c.key);

  return `
    <section class="page-hero-split">
      <div class="container phs-grid">
        <div class="phs-copy">
          {{crumbs}}
          <p class="course-age"><i class="ph ${c.icon}" aria-hidden="true"></i>${esc(c.age)}</p>
          <h1>${esc(c.title)}</h1>
          <p class="lead">${esc(c.lead)}</p>
          <div class="hero-ctas">
            <a class="btn btn-primary btn-lg" href="#dang-ky">Đăng ký học thử<span class="btn-ico"><i class="ph ph-arrow-up-right" aria-hidden="true"></i></span></a>
            <a class="text-link" href="hoc-phi.html">Xem học phí <i class="ph ph-arrow-right" aria-hidden="true"></i></a>
          </div>
        </div>
        <figure class="bezel phs-media"><div class="bezel-core">
          <img src="assets/img/${c.image}" width="1200" height="800" alt="${esc(c.imageAlt)}" fetchpriority="high" style="object-position:${c.imagePos || "50% 50%"}">
        </div></figure>
      </div>
    </section>

    <section class="section-tight">
      <div class="container">
        <div class="info-box">
          <div class="info-cols">
            ${c.info
              .map(
                (x) => `<div class="info-col">
              <i class="ph ${x.icon}" aria-hidden="true"></i>
              <h2>${esc(x.q)}</h2>
              <p>${esc(x.a)}</p>
            </div>`
              )
              .join("\n            ")}
          </div>
          <div class="info-foot">
            <div class="fit">
              <span class="fit-label">Phù hợp khi</span>
              <ul>${c.fit.map((f) => `<li><i class="ph ph-check" aria-hidden="true"></i>${esc(f)}</li>`).join("")}</ul>
            </div>
            <dl class="course-meta">
              <div><dt>Thời lượng</dt><dd>${esc(c.meta.duration)}</dd></div>
              <div><dt>Sĩ số</dt><dd>${esc(c.meta.size)}</dd></div>
              <div><dt>Học phí</dt><dd>${esc(c.meta.fee)}</dd></div>
            </dl>
          </div>
        </div>
      </div>
    </section>

    <section class="section levels">
      <div class="container">
        <div class="section-head">
          <h2>${esc(c.levelsTitle)}</h2>
          <p>Học viên làm bài kiểm tra đầu vào miễn phí và bắt đầu từ đúng cấp độ của mình.</p>
        </div>
        <div class="level-tabs" data-tabs>
          <div class="tab-list" role="tablist" aria-label="${esc(c.levelsTitle)}">
            ${levelTabs}
          </div>
          ${levelPanels}
        </div>
      </div>
    </section>

    <section class="section cycle-section">
      <div class="container">
        <div class="section-head">
          <h2>${esc(c.cycleTitle)}</h2>
        </div>
        <ol class="cycle">
          ${c.cycle
            .map(
              (s) => `<li class="cycle-step reveal">
            <h3>${esc(s.title)}</h3>
            <ul>${s.items.map((it) => `<li>${esc(it)}</li>`).join("")}</ul>
          </li>`
            )
            .join("\n          ")}
        </ol>
      </div>
    </section>

    <section class="section highlight">
      <div class="container split">
        <figure class="split-media reveal">
          <img src="assets/img/${c.highlight.image}" width="1200" height="800" alt="${esc(c.highlight.alt)}" loading="lazy">
        </figure>
        <div class="split-copy">
          <h2>${esc(c.highlight.title)}</h2>
          <p>${esc(c.highlight.text)}</p>
          <ul class="check-list">${c.highlight.bullets.map((b) => `<li><i class="ph-fill ph-check-circle" aria-hidden="true"></i>${esc(b)}</li>`).join("")}</ul>
        </div>
      </div>
    </section>

    <section class="quote-band">
      <div class="container">
        <figure class="quote-big">
          <blockquote><p>“${esc(c.quote.text)}”</p></blockquote>
          <figcaption><strong>${esc(c.quote.name)}</strong><span>${esc(c.quote.role)}</span></figcaption>
        </figure>
      </div>
    </section>
${
  hasSchedule
    ? `
    <section class="section schedule">
      <div class="container">
        <div class="section-head">
          <h2>${esc(({ kids: "Lớp thiếu nhi", teens: "Lớp thiếu niên", ielts: "Lớp IELTS", work: "Lớp giao tiếp" })[c.key])} sắp khai giảng</h2>
        </div>
        {{schedule category="${c.key}"}}
        <p class="more-link"><a class="text-link" href="lich-khai-giang.html">Xem toàn bộ lịch khai giảng <i class="ph ph-arrow-right" aria-hidden="true"></i></a></p>
      </div>
    </section>`
    : ""
}

    <section class="section faq">
      <div class="container faq-wrap">
        <h2>Câu hỏi thường gặp</h2>
        ${faqList(c.faq, true)}
      </div>
    </section>

    <section class="section related">
      <div class="container">
        <div class="section-head"><h2>Các khóa học khác</h2></div>
        <div class="course-grid">${related.map(courseCard).join("\n")}</div>
      </div>
    </section>
`;
};
