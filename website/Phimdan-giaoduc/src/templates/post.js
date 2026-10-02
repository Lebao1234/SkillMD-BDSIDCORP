/* Template bài viết: tiêu đề > ảnh > nội dung + mục lục > bài liên quan */
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
        <figure class="article-cover"><img src="assets/img/${p.image}" width="1200" height="800" alt="" fetchpriority="high"></figure>
      </div>
      <div class="container article-layout">
        <aside class="article-toc" aria-label="Mục lục">
          <p class="toc-title">Nội dung bài viết</p>
          <ol>${toc.map(([id, t]) => `<li><a href="#${id}">${esc(t)}</a></li>`).join("")}</ol>
          <button class="btn btn-ghost btn-sm" type="button" data-copy-link><i class="ph ph-link" aria-hidden="true"></i><span>Sao chép liên kết</span></button>
        </aside>
        <div class="prose">
          ${p.body}
          <div class="article-cta">
            <p><strong>Muốn có người chỉnh tư thế ngay từ đầu?</strong> Học thử 21 ngày miễn phí tại chi nhánh gần bạn.</p>
            <button class="btn btn-primary" type="button" data-open-register>Đăng ký trải nghiệm</button>
          </div>
        </div>
      </div>
    </article>

    <section class="section section-alt">
      <div class="container">
        <h2 class="h-two">Xem thêm <em>bài viết</em></h2>
        {{posts limit="3" exclude="${p.slug}"}}
        <p class="more-link"><a class="text-link" href="bai-viet.html">Tất cả bài viết <i class="ph ph-arrow-right" aria-hidden="true"></i></a></p>
      </div>
    </section>
`;
};
