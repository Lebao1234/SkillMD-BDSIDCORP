/* Template bài viết kỹ thuật */
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
      <div class="container"><figure class="article-cover"><img src="assets/img/${p.image}" width="1600" height="1067" alt="" fetchpriority="high"></figure></div>
      <div class="container article-layout">
        <aside class="article-toc" aria-label="Mục lục">
          <p class="toc-title">Trong bài</p>
          <ol>${toc.map(([id, t]) => `<li><a href="#${id}">${esc(t)}</a></li>`).join("")}</ol>
        </aside>
        <div class="prose">
          ${p.body}
          <div class="article-cta"><p><strong>Có bản vẽ cần báo giá?</strong> Gửi bản vẽ PDF, DWG hoặc STEP, kỹ sư phản hồi trong 24 giờ làm việc.</p><a class="btn btn-primary btn-sm" href="bao-gia.html">Gửi bản vẽ<span class="btn-ico"><i class="ph ph-arrow-up-right" aria-hidden="true"></i></span></a></div>
        </div>
      </div>
    </article>
    <section class="section section-steel">
      <div class="container">
        <div class="section-head section-head-row"><h2>Bài <em>khác</em></h2><a class="text-link" href="tin-tuc.html">Tất cả bài viết <i class="ph ph-arrow-right" aria-hidden="true"></i></a></div>
        {{posts limit="3" exclude="${p.slug}"}}
      </div>
    </section>`;
};
