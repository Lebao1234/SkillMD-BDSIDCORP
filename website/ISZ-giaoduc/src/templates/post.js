/* Template bài viết: tiêu đề > ảnh > nội dung + mục lục > bài khác */
module.exports = function ({ p, esc, zh }) {
  const toc = [];
  p.body.replace(/<h2 id="([^"]+)">([^<]+)<\/h2>/g, (_, id, text) => toc.push([id, text]));
  const title = esc(p.title).replace(/([一-鿿]+)/g, (m) => zh(m));
  return `
    <article class="article">
      <header class="article-head">
        <div class="container article-narrow">
          {{crumbs}}
          <p class="post-meta"><span class="post-cat">${esc(p.cat)}</span><span>${p.date}</span><span>${p.read} phút đọc</span></p>
          <h1>${title}</h1>
          <p class="lead">${esc(p.excerpt).replace(/([一-鿿]+)/g, (m) => zh(m))}</p>
          <p class="article-author"><i class="ph ph-pen-nib" aria-hidden="true"></i>${esc(p.author)}</p>
        </div>
      </header>
      <div class="container">
        <figure class="bezel article-cover"><div class="bezel-core"><img src="assets/img/${p.image}" width="1600" height="1067" alt="" fetchpriority="high"></div></figure>
      </div>
      <div class="container article-layout">
        <aside class="article-toc" aria-label="Mục lục">
          <p class="toc-title">Trong bài này</p>
          <ol>${toc.map(([id, t]) => `<li><a href="#${id}">${t.replace(/([一-鿿]+)/g, (m) => zh(m))}</a></li>`).join("")}</ol>
          <button class="btn btn-ghost btn-sm" type="button" data-copy-link><i class="ph ph-link" aria-hidden="true"></i><span>Sao chép liên kết</span></button>
        </aside>
        <div class="prose">
          ${p.body.replace(/<p data-author>[\s\S]*?<\/p>/, "").replace(/<h2 id="([^"]+)">([^<]+)<\/h2>/g, (_, id, t) => `<h2 id="${id}">${t.replace(/([一-鿿]+)/g, (m) => zh(m))}</h2>`)}
          <div class="article-cta">
            <p><strong>Muốn biết mình đang ở trình độ nào?</strong> Làm bài kiểm tra 12 câu trong 5 phút, hoặc đăng ký một buổi học thử miễn phí tại cơ sở gần nhà.</p>
            <div class="row-actions"><a class="btn btn-ghost btn-sm" href="kiem-tra-trinh-do.html">Kiểm tra trình độ</a><button class="btn btn-primary btn-sm" type="button" data-open-reg>Học thử miễn phí<span class="btn-ico"><i class="ph ph-arrow-up-right" aria-hidden="true"></i></span></button></div>
          </div>
        </div>
      </div>
    </article>
    <section class="section">
      <div class="container">
        <div class="section-head section-head-row"><h2>Đọc <em>tiếp</em></h2><a class="text-link" href="bai-viet.html">Tất cả bài viết <i class="ph ph-arrow-right" aria-hidden="true"></i></a></div>
        {{posts limit="3" exclude="${p.slug}"}}
      </div>
    </section>`;
};
