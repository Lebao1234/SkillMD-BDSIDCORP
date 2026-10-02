/* Template câu chuyện nhiếp ảnh gia: ảnh bìa toàn khung > thông tin máy, công thức > nội dung > ảnh > câu chuyện khác */
module.exports = function ({ s, cam, esc, vnd }) {
  return `
    <article class="story">
      <header class="story-hero">
        <img src="assets/img/${s.cover}" width="1600" height="1067" alt="" fetchpriority="high">
        <div class="container story-hero-copy">
          {{crumbs}}
          <p class="eyebrow">${esc(s.author)} · ${esc(s.role)}</p>
          <h1>${esc(s.title)}</h1>
        </div>
      </header>
      <div class="container story-layout">
        <aside class="story-kit">
          <dl>
            <div><dt>Máy</dt><dd>${cam ? `<a href="${cam.slug}.html">${esc(s.camera)}</a>` : esc(s.camera)}</dd></div>
            <div><dt>Công thức màu</dt><dd><a href="gia-lap-mau.html">${esc(s.recipe)}</a></dd></div>
            <div><dt>Ngày đăng</dt><dd>${s.date}</dd></div>
            <div><dt>Thời gian đọc</dt><dd>${s.read} phút</dd></div>
          </dl>
          ${cam ? `<a class="btn btn-ghost btn-sm" href="${cam.slug}.html">Xem ${esc(cam.name)}, ${vnd(cam.price)}</a>` : ""}
        </aside>
        <div class="prose">
          <p class="lead">${esc(s.excerpt)}</p>
          ${s.body}
        </div>
      </div>
      <div class="container story-strip">
        ${s.gallery.map((g) => `<figure class="reveal"><img src="assets/img/${g}" width="1600" height="1067" alt="Ảnh minh họa trong câu chuyện" loading="lazy"></figure>`).join("")}
      </div>
    </article>

    <section class="section section-alt">
      <div class="container">
        <div class="sec-head"><h2 class="h2">Câu chuyện khác</h2><a class="text-link" href="cau-chuyen.html">Tất cả <i class="ph ph-arrow-right" aria-hidden="true"></i></a></div>
        {{stories exclude="${s.slug}" limit="2"}}
      </div>
    </section>
`;
};
