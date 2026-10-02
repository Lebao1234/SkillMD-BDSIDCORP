/* Template bài hướng dẫn: tiêu đề > ảnh > nội dung + mục lục > sản phẩm liên quan > bài khác */
module.exports = function ({ p, esc }) {
  const toc = [];
  p.body.replace(/<h2 id="([^"]+)">([^<]+)<\/h2>/g, (_, id, text) => toc.push([id, text]));
  return `
    <article class="article">
      <header class="article-head">
        <div class="container article-narrow">
          {{crumbs}}
          <p class="post-meta"><span>${esc(p.cat)}</span><span>${p.date}</span><span>${p.read} phút đọc</span></p>
          <h1>${esc(p.title)}</h1>
          <p class="lead">${esc(p.excerpt)}</p>
        </div>
      </header>
      <div class="container">
        <figure class="article-cover"><img src="assets/img/${p.image}" width="1600" height="1067" alt="" fetchpriority="high"></figure>
      </div>
      <div class="container article-layout">
        <aside class="article-toc" aria-label="Mục lục">
          <p class="toc-title">Trong bài</p>
          <ol>${toc.map(([id, t]) => `<li><a href="#${id}">${esc(t)}</a></li>`).join("")}</ol>
        </aside>
        <div class="prose">${p.body}</div>
      </div>
    </article>
    <section class="section section-line">
      <div class="container">
        <div class="section-head"><p class="eyebrow">Sản phẩm trong bài</p><h2>Xem chi tiết</h2></div>
        {{products slugs="${p.related.join(",")}"}}
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="section-head section-head-row"><h2>Đọc tiếp</h2><a class="text-link" href="bai-viet.html">Tất cả hướng dẫn <i class="ph ph-arrow-right" aria-hidden="true"></i></a></div>
        {{posts limit="3" exclude="${p.slug}"}}
      </div>
    </section>`;
};
