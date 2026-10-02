/* Template trang lĩnh vực: hero ảnh + khung tên bản vẽ > năng lực > công việc > ứng dụng > hỏi đáp > lĩnh vực khác */
module.exports = function ({ s, others, esc, arrow, btnIco, faqList, tag }) {
  return `
    <section class="page-hero">
      <img class="page-hero-bg" src="assets/img/${s.hero}" width="1600" height="1067" alt="" fetchpriority="high">
      <div class="container page-hero-in">
        {{crumbs}}
        <p class="eyebrow">Lĩnh vực hoạt động</p>
        <h1>${esc(s.name)}</h1>
        <p class="lead">${esc(s.lead)}</p>
        <div class="row-actions">
          <a class="btn btn-primary btn-lg" href="bao-gia.html?hm=${s.slug}">Liên hệ báo giá${btnIco()}</a>
          <a class="btn btn-ghost btn-lg" href="tel:{{hotline-tel}}"><i class="ph ph-phone" aria-hidden="true"></i>{{hotline}}</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container split">
        <div>
          <p class="eyebrow">${"Năng lực"}</p>
          <h2>Thông số <em>chính</em></h2>
          <p class="muted">Số liệu tham khảo của dây chuyền hiện tại. Chi tiết vượt phạm vi này, kỹ sư sẽ xem bản vẽ và đề xuất phương án.</p>
        </div>
        <dl class="specs">${s.cap.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
      </div>
    </section>

    <section class="section section-steel">
      <div class="container split">
        <div>
          <p class="eyebrow">${"Phạm vi công việc"}</p>
          <h2>Xưởng <em>làm những gì</em></h2>
          <figure class="side-photo"><img src="assets/img/${s.image}" width="1600" height="1067" alt="" loading="lazy"></figure>
        </div>
        <ol class="worklist">${s.work.map((w, i) => `<li class="reveal"><span>${String(i + 1).padStart(2, "0")}</span>${esc(w)}</li>`).join("")}</ol>
      </div>
    </section>

    <section class="section">
      <div class="container split">
        <div><p class="eyebrow">${"Ứng dụng"}</p><h2>Chi tiết <em>thường làm</em></h2></div>
        <div>
          <ul class="apps">${s.apps.map((a) => `<li><i class="ph ph-check-square" aria-hidden="true"></i>${esc(a)}</li>`).join("")}</ul>
          <a class="text-link" href="san-pham.html">Xem sản phẩm tiêu biểu ${arrow()}</a>
        </div>
      </div>
    </section>

    <section class="section section-steel">
      <div class="container split">
        <div><p class="eyebrow">${"Hỏi đáp"}</p><h2>Câu hỏi <em>thường gặp</em></h2></div>
        ${faqList(s.faq)}
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head section-head-row"><div><p class="eyebrow">${"Lĩnh vực khác"}</p><h2>Một xưởng, <em>bốn khâu</em></h2></div><a class="text-link" href="linh-vuc.html">Tất cả lĩnh vực ${arrow()}</a></div>
        <ol class="srows">${others.map((o) => `<li><a href="${o.slug}.html"><span class="sr-code">${o.no}</span><span class="sr-name">${esc(o.name)}</span><span class="sr-short">${esc(o.short)}</span><span class="sr-go" aria-hidden="true">${arrow("up-right")}</span></a></li>`).join("")}</ol>
      </div>
    </section>`;
};
