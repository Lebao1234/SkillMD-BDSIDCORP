/* ==========================================================================
   TRANG ĐỌC BÀI

   Dùng chung cho tin tức và câu chuyện alumni. Tiêu đề trang, mô tả và thẻ og
   được cập nhật theo bài đang mở, để liên kết chia sẻ ra ngoài hiện đúng nội
   dung chứ không hiện tiêu đề chung của trang.
   ========================================================================== */

(function () {
  'use strict';

  var U = window.__UI, D = window.__DATA, C = window.__CARDS;
  var $ = U.$;

  function meta(name, value, isProperty) {
    var sel = isProperty ? 'meta[property="' + name + '"]' : 'meta[name="' + name + '"]';
    var el = document.head.querySelector(sel);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(isProperty ? 'property' : 'name', name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', value);
  }

  function blocks(list) {
    return (list || []).map(function (b) {
      if (b.type === 'h2') return '<h2>' + U.esc(b.text) + '</h2>';
      if (b.type === 'h3') return '<h3>' + U.esc(b.text) + '</h3>';
      return '<p>' + U.esc(b.text) + '</p>';
    }).join('');
  }

  function notFound(wrap) {
    wrap.innerHTML = C.empty(
      'Không tìm thấy bài viết',
      'Đường dẫn có thể đã cũ, hoặc bài đã được gỡ khỏi trang. Thử tìm lại từ mục tin tức.',
      'file-dashed',
      '<a class="btn btn--primary" href="tin-tuc.html">Về trang tin tức</a>',
        'h1'
    );
  }

  function boot() {
    var wrap = $('[data-article]');
    if (!wrap) return;

    var slug = U.param('slug');
    var p = D.bySlug(D.posts(), slug);
    if (!p) { notFound(wrap); return; }

    /* SEO cho từng bài */
    document.title = p.tieude + ' | Mạng lưới Cựu sinh viên NEU';
    meta('description', p.tomtat);
    meta('og:title', p.tieude, true);
    meta('og:description', p.tomtat, true);
    meta('og:image', p.anh, true);
    var canon = document.head.querySelector('link[rel="canonical"]');
    if (canon) canon.href = 'https://alumni.neu.edu.vn/bai-viet.html?slug=' + encodeURIComponent(p.slug);

    var ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': p.loai === 'cauchuyen' ? 'Article' : 'NewsArticle',
      headline: p.tieude,
      description: p.tomtat,
      image: p.anh,
      datePublished: p.ngay,
      author: { '@type': 'Organization', name: p.tacgia },
      publisher: { '@type': 'Organization', name: 'Mạng lưới Cựu sinh viên Đại học Kinh tế Quốc dân' },
    });
    document.head.appendChild(ld);

    var nv = p.nhanVatId ? D.byId(D.alumni(), p.nhanVatId) : null;
    var veTrang = p.loai === 'cauchuyen' ? 'cau-chuyen.html' : 'tin-tuc.html';
    var veNhan = p.loai === 'cauchuyen' ? 'Câu chuyện Alumni' : 'Tin tức';

    wrap.innerHTML =
      '<nav class="crumbs" aria-label="Đường dẫn" style="padding-inline:0">' +
      '<a href="index.html">Trang chủ</a><span class="crumbs__sep" aria-hidden="true">/</span>' +
      '<a href="' + veTrang + '">' + veNhan + '</a><span class="crumbs__sep" aria-hidden="true">/</span>' +
      '<span aria-current="page">' + U.esc(p.tieude) + '</span></nav>' +

      '<div class="article__head">' +
      '<span class="tag tag--accent" style="justify-self:start">' + U.esc(p.danhmuc) + '</span>' +
      '<h1 class="article__title">' + U.esc(p.tieude) + '</h1>' +
      '<div class="article__meta">' +
      '<time datetime="' + U.esc(p.ngay) + '">' + U.fmtDate(p.ngay) + '</time>' +
      '<span>' + U.esc(p.tacgia) + '</span>' +
      '<span>Đọc khoảng ' + p.phut + ' phút</span>' +
      '</div></div>' +

      '<div class="article__hero">' + C.imgTag(p.anh, p.tieude, p.slug, 1200, 675, true) + '</div>' +

      '<div class="article__body prose">' +
      (p.trichdan ? '<blockquote>' + U.esc(p.trichdan) + '</blockquote>' : '') +
      '<p><strong>' + U.esc(p.tomtat) + '</strong></p>' +
      blocks(p.noidung) +
      '</div>' +

      (nv ? nhanVatBox(nv) : '') +

      '<div class="article__foot">' +
      '<span class="dim" style="font-size:var(--fs-xs)">Thẻ</span>' +
      (p.the || []).map(function (t) { return '<span class="tag">' + U.esc(t) + '</span>'; }).join('') +
      '<a class="btn btn--quiet btn--sm" style="margin-left:auto" href="' + veTrang + '">Tất cả ' + veNhan.toLowerCase() + '</a>' +
      '</div>' +

      lienQuan(p);
  }

  /* Hộp giới thiệu nhân vật, chỉ hiện những trường mà chủ hồ sơ cho phép. */
  function nhanVatBox(nv) {
    var congty = D.thayDuoc(nv, 'company') ? nv.chucdanh + ', ' + nv.congty : nv.chucdanh;
    return '<aside class="article__body" style="margin-top:var(--space-13)">' +
      '<div class="notice notice--accent" style="align-items:center;gap:var(--space-10)">' +
      '<span class="avatar avatar--lg" data-name="' + U.esc(nv.name) + '" style="' + U.avatarStyle(nv.name) + '" aria-hidden="true">' + U.esc(U.initials(nv.name)) + '</span>' +
      '<span><strong style="font-family:var(--font-display);font-size:var(--fs-lg)">' + U.esc(nv.name) + '</strong><br>' +
      U.esc(congty) + '<br>' +
      '<span class="dim">Khóa ' + nv.khoa + ', ngành ' + U.esc(nv.nganh) + '</span><br>' +
      '<a class="link" href="ho-so.html?id=' + encodeURIComponent(nv.id) + '">Xem hồ sơ</a></span>' +
      '</div></aside>';
  }

  function lienQuan(p) {
    var cung = D.posts().filter(function (x) {
      return x.id !== p.id && (x.danhmuc === p.danhmuc || x.loai === p.loai);
    }).slice(0, 3);
    if (!cung.length) return '';
    return '<section class="section--tight" style="margin-top:var(--space-13);border-top:1px solid var(--border);padding-top:var(--space-13)">' +
      '<h2 style="font-size:var(--fs-2xl);margin-bottom:var(--space-11)">Đọc tiếp</h2>' +
      '<div class="grid-cards">' + cung.map(C.postCard).join('') + '</div></section>';
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
