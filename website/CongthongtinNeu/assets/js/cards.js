/* ==========================================================================
   BỘ DỰNG THẺ DÙNG CHUNG

   Một bài viết trông như nhau ở trang chủ, trang tin tức và trang kết quả tìm
   kiếm. Đánh dấu của nó được viết một lần ở đây.
   ========================================================================== */

(function () {
  'use strict';

  var U = window.__UI;
  var D = window.__DATA;

  function imgTag(src, alt, seed, w, h, eager) {
    return '<img src="' + U.esc(src) + '" alt="' + U.esc(alt) + '"' +
      ' data-seed="' + U.esc(seed) + '" width="' + w + '" height="' + h + '"' +
      (eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async">';
  }

  /* ------------------------------------------------------------------------
     Bài viết
     ------------------------------------------------------------------------ */
  function postCard(p) {
    return '<article class="card">' +
      '<div class="card__media">' + imgTag(p.anh, p.tieude, p.slug, 600, 375) + '</div>' +
      '<div class="card__body">' +
      '<div class="card__meta"><span class="tag tag--accent">' + U.esc(p.danhmuc) + '</span>' +
      '<time datetime="' + U.esc(p.ngay) + '">' + U.fmtDate(p.ngay) + '</time></div>' +
      '<h3 class="card__title"><a href="bai-viet.html?slug=' + encodeURIComponent(p.slug) + '">' + U.esc(p.tieude) + '</a></h3>' +
      '<p class="card__excerpt">' + U.esc(p.tomtat) + '</p>' +
      '<div class="card__foot"><span class="dim" style="font-size:var(--fs-xs)">Đọc khoảng ' + p.phut + ' phút</span></div>' +
      '</div></article>';
  }

  /* ------------------------------------------------------------------------
     Sự kiện
     ------------------------------------------------------------------------ */
  var THANG_NGAN = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];

  function eventCard(e) {
    var d = new Date(e.batdau);
    var da = D.soDaDangKy(e);
    var con = Math.max(0, e.succhua - da);
    var sapToi = d.getTime() >= Date.now();

    var trangthai = !sapToi
      ? '<span class="tag">Đã diễn ra</span>'
      : con === 0
      ? '<span class="tag tag--danger">Hết chỗ</span>'
      : con < e.succhua * 0.15
      ? '<span class="tag tag--warning">Sắp hết chỗ</span>'
      : '<span class="tag tag--success">Còn nhận đăng ký</span>';

    return '<article class="evcard">' +
      '<div class="evcard__date"><span class="evcard__day">' + d.getUTCDate() + '</span>' +
      '<span class="evcard__mon">' + THANG_NGAN[d.getUTCMonth()] + '</span></div>' +
      '<div class="evcard__body">' +
      '<h3 class="evcard__title"><a href="su-kien-chi-tiet.html?slug=' + encodeURIComponent(e.slug) + '">' + U.esc(e.tieude) + '</a></h3>' +
      '<p class="evcard__where">' + U.esc(e.diadiem) + ', ' + U.esc(e.thanhpho) + '</p>' +
      '<div class="evcard__foot">' + trangthai +
      '<span class="evcard__seats">' + U.fmtNum(da) + '/' + U.fmtNum(e.succhua) + ' chỗ</span>' +
      '</div></div></article>';
  }

  /* ------------------------------------------------------------------------
     Cựu sinh viên
     ------------------------------------------------------------------------ */
  function personCard(a) {
    var congty = D.thayDuoc(a, 'company')
      ? U.esc(a.congty)
      : '<span class="pcard__private">Nơi công tác để ở chế độ riêng tư</span>';
    var noi = D.thayDuoc(a, 'city') ? U.esc(a.thanhpho) : '';

    return '<article class="pcard">' +
      '<span class="avatar" data-name="' + U.esc(a.name) + '" style="' + U.avatarStyle(a.name) + '" aria-hidden="true">' + U.esc(U.initials(a.name)) + '</span>' +
      '<div class="pcard__body">' +
      '<h3 class="pcard__name"><a href="ho-so.html?id=' + encodeURIComponent(a.id) + '">' + U.esc(a.name) + '</a></h3>' +
      '<p class="pcard__role">' + U.esc(a.chucdanh) + '</p>' +
      '<p class="pcard__org">' + congty + '</p>' +
      '<div class="pcard__tags"><span class="tag">Khóa ' + a.khoa + '</span>' +
      (noi ? '<span class="tag">' + noi + '</span>' : '') +
      (a.coVanNghiepVu ? '<span class="tag tag--accent">Cố vấn</span>' : '') +
      '</div></div></article>';
  }

  /* ------------------------------------------------------------------------
     Album
     ------------------------------------------------------------------------ */
  function albumCard(a) {
    var loai = a.loai === 'kyyeu' ? 'Kỷ yếu' : a.loai === 'video' ? 'Video' : 'Album ảnh';
    return '<article class="albumcard">' +
      '<div class="albumcard__media">' + imgTag(a.bia, a.tieude, a.slug, 560, 420) +
      '<span class="albumcard__count">' + a.anh.length + '</span></div>' +
      '<div class="albumcard__body">' +
      '<h3 class="albumcard__title"><a href="album.html?slug=' + encodeURIComponent(a.slug) + '">' + U.esc(a.tieude) + '</a></h3>' +
      '<p class="albumcard__meta">' + loai + ' &middot; năm ' + a.nam + (a.khoa ? ' &middot; khóa ' + a.khoa : '') + '</p>' +
      '</div></article>';
  }

  /* ------------------------------------------------------------------------
     Việc làm
     ------------------------------------------------------------------------ */
  function jobRow(j) {
    return '<article class="jobrow">' + U.orgMark(j.congty) +
      '<div><h3 class="jobrow__title"><a href="nghe-nghiep.html?viec=' + encodeURIComponent(j.slug) + '">' + U.esc(j.tieude) + '</a></h3>' +
      '<p class="jobrow__sub">' + U.esc(j.congty) + ' &middot; ' + U.esc(j.thanhpho) + ' &middot; ' + U.esc(j.hinhthuc) + '</p></div>' +
      '<div class="jobrow__side">' + U.esc(j.luong) + '<br><span class="dim">Hạn ' + U.fmtDateShort(j.hanNop) + '</span></div>' +
      '</article>';
  }

  /* ------------------------------------------------------------------------
     Khung xương và trạng thái rỗng
     ------------------------------------------------------------------------ */
  function skeletonCards(n) {
    var one = '<div class="skel-card"><div class="skeleton skel-card__media"></div>' +
      '<div class="skel-card__body"><div class="skeleton skel-line skel-line--40"></div>' +
      '<div class="skeleton skel-line skel-line--85"></div>' +
      '<div class="skeleton skel-line skel-line--60"></div></div></div>';
    return new Array(n).fill(one).join('');
  }

  function skeletonRows(n) {
    var one = '<div class="pcard"><div class="skeleton" style="width:56px;height:56px;border-radius:999px"></div>' +
      '<div class="pcard__body" style="gap:8px"><div class="skeleton skel-line skel-line--60"></div>' +
      '<div class="skeleton skel-line skel-line--85"></div>' +
      '<div class="skeleton skel-line skel-line--40"></div></div></div>';
    return new Array(n).fill(one).join('');
  }

  /* capDo cho phep trang chi tiet dung h1 o trang thai khong tim thay, de mot
     trang khong bao gio ra doi ma khong co thẻ h1 nao. */
  function empty(title, body, icon, action, capDo) {
    var h = capDo || 'h3';
    return '<div class="empty">' +
      '<span class="empty__icon" aria-hidden="true"><i class="ph-light ph-' + (icon || 'folder-open') + '"></i></span>' +
      '<' + h + ' class="empty__title">' + U.esc(title) + '</' + h + '>' +
      '<p class="empty__body">' + U.esc(body) + '</p>' +
      (action || '') + '</div>';
  }

  window.__CARDS = {
    imgTag: imgTag,
    postCard: postCard,
    eventCard: eventCard, personCard: personCard,
    albumCard: albumCard, jobRow: jobRow,
    skeletonCards: skeletonCards, skeletonRows: skeletonRows, empty: empty,
  };
})();
