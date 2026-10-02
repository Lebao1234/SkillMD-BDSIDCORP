/* Template bài viết: tiêu đề > ảnh > nội dung + mục lục > bài khác */
module.exports = function ({ p, esc }) {
  const toc = [];
  p.body.replace(/<h2 id="([^"]+)">([^<]+)<\/h2>/g, (_, id, text) => toc.push([id, text]));
  return `
    <article class="article">
      <header class="article-head">
        <div class="container article-narrow">
          {{crumbs}}
          <p class="post-meta"><span class="post-cat">${esc(p.cat)}</span><span>${p.date}</span><span>${p.read} phút đọc</span></p>
          <h1>${esc(p.title)}</h1>
          <p class="lead">${esc(p.excerpt)}</p>
          <p class="article-author"><i class="ph ph-pen-nib" aria-hidden="true"></i>${esc(p.author)}</p>
        </div>
      </header>
      <div class="container">
        <figure class="bezel article-cover"><div class="bezel-core"><img src="assets/img/${p.image}" width="1600" height="1067" alt="" fetchpriority="high"></div></figure>
      </div>
      <div class="container article-layout">
        <aside class="article-toc" aria-label="Mục lục">
          <p class="toc-title">Trong bài này</p>
          <ol>${toc.map(([id, t]) => `<li><a href="#${id}">${esc(t)}</a></li>`).join("")}</ol>
          <button class="btn btn-ghost btn-sm" type="button" data-copy-link><i class="ph ph-link" aria-hidden="true"></i><span>Sao chép liên kết</span></button>
        </aside>
        <div class="prose">
          ${p.body.replace(/<p data-author>[\s\S]*?<\/p>/, "")}
          <div class="article-cta">
            <p><strong>Cần người tính giúp cho tiệc của bạn?</strong> Tư vấn viên gọi lại trong 30 phút, kèm báo giá theo số khách và ngày bạn chọn.</p>
            <button class="btn btn-primary" type="button" data-open-book>Nhận tư vấn<span class="btn-ico"><i class="ph ph-arrow-up-right" aria-hidden="true"></i></span></button>
          </div>
        </div>
      </div>
    </article>
    <section class="section">
      <div class="container">
        <div class="section-head section-head-row"><h2>Đọc <em>tiếp</em></h2><a class="text-link" href="cam-nang.html">Tất cả bài viết <i class="ph ph-arrow-right" aria-hidden="true"></i></a></div>
        {{posts limit="3" exclude="${p.slug}"}}
      </div>
    </section>`;
};
