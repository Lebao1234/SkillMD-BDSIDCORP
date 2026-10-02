/* Template bài viết */
module.exports = function ({ p, esc }) {
  const toc = [];
  p.body.replace(/<h2 id="([^"]+)">([^<]+)<\/h2>/g, (_, id, t) => toc.push([id, t]));
  return `
    <article class="article">
      <header class="container article-head">
        {{crumbs}}
        <p class="post-meta"><span class="post-cat">${esc(p.cat)}</span><span>${p.date}</span><span>${p.read} phút đọc</span></p>
        <h1>${esc(p.title)}</h1>
        <p class="lead">${esc(p.excerpt)}</p>
        <p class="article-author"><i class="ph-light ph-user-circle" aria-hidden="true"></i>${esc(p.author)}</p>
      </header>
      <div class="container"><figure class="article-cover"><img src="assets/img/${p.image}" width="1200" height="800" alt="" fetchpriority="high"></figure></div>
      <div class="container article-layout">
        <aside class="article-toc" aria-label="Mục lục">
          <p class="toc-title">Nội dung</p>
          <ol>${toc.map(([id, t]) => `<li><a href="#${id}">${esc(t)}</a></li>`).join("")}</ol>
        </aside>
        <div class="prose">
          ${p.body}
          <div class="article-cta">
            <p><strong>Không có thời gian tự làm?</strong> K-Lab's nhận giày tận nhà trong nội thành Hà Nội và Đà Nẵng.</p>
            <button class="btn btn-primary" type="button" data-open-booking>Đặt lịch vệ sinh</button>
          </div>
        </div>
      </div>
    </article>
    <section class="section section-muted">
      <div class="container">
        <div class="sec-head"><h2 class="h2">Bài viết khác</h2><a class="text-link" href="blog.html">Tất cả bài viết <i class="ph-light ph-arrow-right" aria-hidden="true"></i></a></div>
        {{posts limit="3" exclude="${p.slug}"}}
      </div>
    </section>
`;
};
