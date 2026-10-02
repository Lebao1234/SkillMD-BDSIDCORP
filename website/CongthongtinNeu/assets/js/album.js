/* ==========================================================================
   ALBUM VÀ ĐÈN CHIẾU ẢNH

   Đèn chiếu bẫy tiêu điểm, đóng bằng Escape, chuyển ảnh bằng phím mũi tên, và
   trả tiêu điểm về đúng tấm ảnh vừa mở. Không có cái nào trong số đó là tùy
   chọn: SKILL.md của dự án yêu cầu điều hướng bàn phím cho mọi lớp phủ.
   ========================================================================== */

(function () {
  'use strict';

  var U = window.__UI, D = window.__DATA, C = window.__CARDS;
  var $ = U.$, $$ = U.$$;

  var album = null, anhs = [], viTri = 0, nhaTieuDiem = null, moTu = null;

  function boot() {
    var wrap = $('[data-album]');
    if (!wrap) return;

    album = D.bySlug(D.albums(), U.param('slug'));
    if (!album) {
      wrap.innerHTML = C.empty(
        'Không tìm thấy album',
        'Album có thể đã được gỡ hoặc đường dẫn đã cũ. Quay lại kho kỷ niệm để tra theo năm và khóa.',
        'image-broken',
        '<a class="btn btn--primary" href="ky-niem.html">Về kho kỷ niệm</a>',
        'h1'
      );
      return;
    }

    anhs = album.anh || [];
    document.title = album.tieude + ' | Kho kỷ niệm NEU Alumni';
    var loai = album.loai === 'kyyeu' ? 'Kỷ yếu' : album.loai === 'video' ? 'Video' : 'Album ảnh';

    wrap.innerHTML =
      '<nav class="crumbs" aria-label="Đường dẫn">' +
      '<a href="index.html">Trang chủ</a><span class="crumbs__sep" aria-hidden="true">/</span>' +
      '<a href="ky-niem.html">Kỷ niệm</a><span class="crumbs__sep" aria-hidden="true">/</span>' +
      '<span aria-current="page">' + U.esc(album.tieude) + '</span></nav>' +

      '<div class="section--tight">' +
      '<h1 style="font-size:var(--fs-5xl);max-width:22ch">' + U.esc(album.tieude) + '</h1>' +
      '<div style="display:flex;flex-wrap:wrap;gap:var(--space-4);margin-top:var(--space-9)">' +
      '<span class="tag tag--accent">' + loai + '</span>' +
      '<span class="tag">Năm ' + album.nam + '</span>' +
      (album.khoa ? '<span class="tag">Khóa ' + album.khoa + '</span>' : '') +
      '<span class="tag">' + anhs.length + ' tệp</span>' +
      '</div>' +
      '<p class="muted" style="margin-top:var(--space-10);max-width:64ch;line-height:var(--lh-relaxed)">' + U.esc(album.mota) + '</p>' +
      '</div>' +

      (anhs.length
        ? '<div class="photos">' + anhs.map(function (a, i) {
            return '<button class="photo" type="button" data-photo="' + i + '" aria-label="Xem ảnh lớn: ' + U.esc(a.chuthich) + '">' +
              '<img src="' + U.esc(a.thumb || a.src) + '" alt="' + U.esc(a.chuthich) + '" data-seed="' + U.esc(album.slug + '-' + i) + '" width="400" height="400" loading="lazy" decoding="async">' +
              '</button>';
          }).join('') + '</div>'
        : C.empty('Album chưa có ảnh nào', 'Ảnh sẽ xuất hiện sau khi ban quản trị duyệt phần tư liệu gửi lên.', 'image-square')) +

      ((album.tulieu && album.tulieu.length)
        ? '<section style="margin-top:var(--space-14)" aria-labelledby="h-tulieu">' +
          '<h2 id="h-tulieu" style="font-size:var(--fs-2xl);margin-bottom:var(--space-10)">Tư liệu tải về</h2>' +
          '<div class="doclist">' + album.tulieu.map(function (t) {
            return '<article class="docrow">' +
              '<span class="docrow__icon" aria-hidden="true"><i class="ph-light ph-file-pdf"></i></span>' +
              '<div><p class="docrow__name">' + U.esc(t.ten) + '</p>' +
              '<p class="docrow__meta">' + U.esc(t.dinhdang) + ', ' + U.esc(t.dungluong) + '</p></div>' +
              '<button class="btn btn--ghost btn--sm" type="button" data-doc>Tải về</button></article>';
          }).join('') + '</div></section>'
        : '') +

      '<div style="margin-top:var(--space-14);padding-top:var(--space-11);border-top:1px solid var(--border);display:flex;flex-wrap:wrap;gap:var(--space-8);align-items:center">' +
      '<a class="btn btn--quiet" href="ky-niem.html">Tất cả kho kỷ niệm</a>' +
      '<a class="btn btn--ghost" href="dong-gop.html">Gửi thêm ảnh cho album này</a>' +
      '</div>';

    wireLightbox();
  }

  /* ------------------------------------------------------------------------
     Đèn chiếu ảnh
     ------------------------------------------------------------------------ */
  function wireLightbox() {
    var lb = $('[data-lightbox]');
    if (!lb) return;
    var img = $('[data-lb-img]', lb);
    var cap = $('[data-lb-cap]', lb);

    function show(i) {
      viTri = (i + anhs.length) % anhs.length;
      var a = anhs[viTri];
      img.src = a.src;
      img.alt = a.chuthich;
      img.dataset.seed = album.slug + '-' + viTri;
      delete img.dataset.fallbackDone;
      cap.textContent = a.chuthich + '  (' + (viTri + 1) + ' trên ' + anhs.length + ')';
    }

    function open(i) {
      moTu = $('[data-photo="' + i + '"]');
      show(i);
      lb.classList.add('is-open');
      document.body.classList.add('is-locked');
      nhaTieuDiem = U.trapFocus(lb, close);
    }

    function close() {
      lb.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      if (nhaTieuDiem) { nhaTieuDiem(); nhaTieuDiem = null; }
      else if (moTu) moTu.focus();
    }

    document.addEventListener('click', function (ev) {
      var p = ev.target.closest('[data-photo]');
      if (p) { open(Number(p.dataset.photo)); return; }
      if (ev.target.closest('[data-lb-close]')) { close(); return; }
      if (ev.target.closest('[data-lb-prev]')) { show(viTri - 1); return; }
      if (ev.target.closest('[data-lb-next]')) { show(viTri + 1); return; }
      if (ev.target === lb) { close(); return; }
      if (ev.target.closest('[data-doc]')) {
        U.toast('Bản demo không kèm tệp thật. Trong bản chạy thật, nút này trả về tệp đã số hóa.');
      }
    });

    document.addEventListener('keydown', function (ev) {
      if (!lb.classList.contains('is-open')) return;
      if (ev.key === 'ArrowLeft') { ev.preventDefault(); show(viTri - 1); }
      else if (ev.key === 'ArrowRight') { ev.preventDefault(); show(viTri + 1); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
