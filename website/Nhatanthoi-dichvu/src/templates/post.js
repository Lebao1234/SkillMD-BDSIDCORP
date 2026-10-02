/* Template bài viết: tiêu đề > ảnh vòm > nội dung + mục lục > bài khác */
module.exports = function ({ p, esc }) {
  const toc = [];
  p.body.replace(/<h2 id="([^"]+)">([^<]+)<\/h2>/g, (_, id, text) => toc.push([id, text]));
  return `
    <article class="article">
      <header class="article-head">
        <div class="container article-head-grid">
          <div>
            {{crumbs}}
            <p class="post-meta"><span>${esc(p.cat)}</span><span>${p.date}</span><span>${p.read} phút đọc</span></p>
            <h1>${esc(p.title)}</h1>
            <p class="lead">${esc(p.excerpt)}</p>
            <p class="article-author">${esc(p.author)}</p>
          </div>
          <figure class="arch article-cover"><img src="assets/img/${p.image}" width="700" height="1000" alt="" fetchpriority="high"></figure>
        </div>
      </header>
      <div class="container article-layout">
        <aside class="article-toc" aria-label="Mục lục">
          <p class="toc-title">Trong bài</p>
          <ol>${toc.map(([id, t]) => `<li><a href="#${id}">${esc(t)}</a></li>`).join("")}</ol>
        </aside>
        <div class="prose">${p.body}</div>
      </div>
    </article>

    <section class="section section-soft">
      <div class="container">
        <div class="sec-head">
          <h2 class="h2">Đọc thêm</h2>
          <a class="text-link" href="bai-viet.html">Tất cả bài viết <i class="ph ph-arrow-right" aria-hidden="true"></i></a>
        </div>
        {{posts limit="3" exclude="${p.slug}"}}
      </div>
    </section>
`;
};
