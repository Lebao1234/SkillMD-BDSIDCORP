/* Template bài viết: tiêu đề > ảnh bìa > mục lục + nội dung > bài liên quan */
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
          <p class="article-author"><i class="ph ph-user-circle" aria-hidden="true"></i>${esc(p.author)}</p>
        </div>
      </header>
      <div class="container">
        <figure class="frame article-cover"><img src="assets/img/${p.image}" width="1200" height="800" alt="" fetchpriority="high"></figure>
      </div>
      <div class="container article-layout">
        <aside class="article-toc" aria-label="Mục lục">
          <p class="mono-label">Nội dung</p>
          <ol>${toc.map(([id, t]) => `<li><a href="#${id}">${esc(t)}</a></li>`).join("")}</ol>
          <button class="btn btn-ghost btn-sm" type="button" data-copy-link><i class="ph ph-link" aria-hidden="true"></i><span>Sao chép liên kết</span></button>
        </aside>
        <div class="prose">
          ${p.body}
        </div>
      </div>
    </article>

    <section class="section section-alt">
      <div class="container">
        <div class="sec-head">
          <h2 class="h2">Đọc tiếp</h2>
          <a class="text-link" href="blog.html">Tất cả bài viết <i class="ph ph-arrow-right" aria-hidden="true"></i></a>
        </div>
        {{posts limit="3" exclude="${p.slug}"}}
      </div>
    </section>
`;
};
