/* ==========================================================================
   HỒ SƠ CỰU SINH VIÊN

   Trang này là nơi quy tắc phạm vi công khai thể hiện rõ nhất. Mỗi trường
   thông tin chỉ hiện nếu chủ hồ sơ đã cho phép người đang xem thấy nó. Trường
   bị ẩn không biến mất lặng lẽ: nó nói ra rằng nó đang bị ẩn, và nói vì sao.
   ========================================================================== */

(function () {
  'use strict';

  var U = window.__UI, D = window.__DATA, C = window.__CARDS, S = window.__STORE;
  var $ = U.$;

  var LYDO = {
    'thanh-vien': 'Chỉ thành viên đã đăng nhập mới xem được',
    'rieng-tu': 'Chủ hồ sơ để ở chế độ riêng tư',
  };

  function fact(k, v, ho, truong) {
    if (truong && !D.thayDuoc(ho, truong)) {
      var muc = (ho.privacy && ho.privacy[truong]) || 'cong-khai';
      return '<div class="fact"><span class="fact__k">' + U.esc(k) + '</span>' +
        '<span class="fact__v pcard__private">' + U.esc(LYDO[muc] || 'Không hiển thị') + '</span></div>';
    }
    return '<div class="fact"><span class="fact__k">' + U.esc(k) + '</span>' +
      '<span class="fact__v">' + v + '</span></div>';
  }

  function boot() {
    var wrap = $('[data-profile]');
    if (!wrap) return;

    var id = U.param('id');
    var ho = D.byId(D.alumni(), id) || D.bySlug(D.alumni(), U.param('slug'));

    if (!ho) {
      wrap.innerHTML = C.empty(
        'Không tìm thấy hồ sơ',
        'Hồ sơ có thể đã được gỡ, hoặc đường dẫn đã cũ. Thử tra lại trong danh bạ.',
        'user-circle-dashed',
        '<a class="btn btn--primary" href="alumni.html">Về danh bạ</a>',
        'h1'
      );
      return;
    }

    document.title = ho.name + ' | Cựu sinh viên NEU';

    var chuyen = D.cauChuyen().filter(function (p) { return p.nhanVatId === ho.id; });
    var viec = D.jobs().filter(function (j) { return j.nguoiDangId === ho.id; });

    wrap.innerHTML =
      '<nav class="crumbs" aria-label="Đường dẫn">' +
      '<a href="index.html">Trang chủ</a><span class="crumbs__sep" aria-hidden="true">/</span>' +
      '<a href="alumni.html">Danh bạ</a><span class="crumbs__sep" aria-hidden="true">/</span>' +
      '<span aria-current="page">' + U.esc(ho.name) + '</span></nav>' +

      '<div class="profile">' +

      '<aside class="profile__card">' +
      '<span class="avatar avatar--xl" data-name="' + U.esc(ho.name) + '" style="' + U.avatarStyle(ho.name) + '" aria-hidden="true">' + U.esc(U.initials(ho.name)) + '</span>' +
      '<div><h1 class="profile__name">' + U.esc(ho.name) + '</h1>' +
      '<p class="profile__role">' + U.esc(ho.chucdanh) + '</p></div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:var(--space-4);justify-content:center">' +
      '<span class="tag tag--accent">Khóa ' + ho.khoa + '</span>' +
      (ho.coVanNghiepVu ? '<span class="tag tag--success">Nhận làm cố vấn</span>' : '') +
      '</div>' +
      (D.thayDuoc(ho, 'email')
        ? '<a class="btn btn--primary btn--block" href="mailto:' + U.esc(ho.email) + '">Gửi email</a>'
        : '<p class="pcard__private" style="font-size:var(--fs-xs)">' +
          U.esc(LYDO[(ho.privacy && ho.privacy.email) || 'thanh-vien']) + '</p>' +
          (S.isMember() ? '' : '<a class="btn btn--ghost btn--block btn--sm" href="dang-ky.html">Đăng nhập để xem</a>')) +
      '</aside>' +

      '<div>' +
      '<section aria-labelledby="h-hoctap">' +
      '<h2 id="h-hoctap" style="font-size:var(--fs-2xl);margin-bottom:var(--space-11)">Học tập</h2>' +
      '<div class="profile__facts">' +
      fact('Khóa', 'Khóa ' + ho.khoa + ' (' + ho.namNhapHoc + ' tới ' + ho.namTotNghiep + ')') +
      fact('Lớp', U.esc(ho.lop)) +
      fact('Ngành đào tạo', U.esc(ho.nganh)) +
      fact('Năm tốt nghiệp', String(ho.namTotNghiep)) +
      '</div></section>' +

      '<section aria-labelledby="h-nghe" style="margin-top:var(--space-14)">' +
      '<h2 id="h-nghe" style="font-size:var(--fs-2xl);margin-bottom:var(--space-11)">Nghề nghiệp</h2>' +
      '<div class="profile__facts">' +
      fact('Nơi công tác', U.esc(ho.congty), ho, 'company') +
      fact('Chức danh', U.esc(ho.chucdanh)) +
      fact('Lĩnh vực', U.esc(ho.linhvuc)) +
      fact('Nơi làm việc', U.esc(ho.thanhpho) + ', ' + U.esc(ho.quocgia), ho, 'city') +
      fact('Điện thoại', U.esc(ho.dienthoai), ho, 'phone') +
      '</div></section>' +

      (ho.quanTam && ho.quanTam.length
        ? '<section aria-labelledby="h-quantam" style="margin-top:var(--space-14)">' +
          '<h2 id="h-quantam" style="font-size:var(--fs-2xl);margin-bottom:var(--space-10)">Sẵn sàng hỗ trợ</h2>' +
          '<div style="display:flex;flex-wrap:wrap;gap:var(--space-4)">' +
          ho.quanTam.map(function (q) { return '<span class="tag tag--accent">' + U.esc(q) + '</span>'; }).join('') +
          '</div></section>'
        : '') +

      '<section aria-labelledby="h-gt" style="margin-top:var(--space-14)">' +
      '<h2 id="h-gt" style="font-size:var(--fs-2xl);margin-bottom:var(--space-10)">Giới thiệu</h2>' +
      '<p class="muted" style="line-height:var(--lh-relaxed);max-width:60ch">' + U.esc(ho.gioiThieu) + '</p>' +
      '</section>' +

      (chuyen.length
        ? '<section aria-labelledby="h-bai" style="margin-top:var(--space-14)">' +
          '<h2 id="h-bai" style="font-size:var(--fs-2xl);margin-bottom:var(--space-11)">Câu chuyện trên trang</h2>' +
          '<div class="grid-cards">' + chuyen.map(C.postCard).join('') + '</div></section>'
        : '') +

      (viec.length
        ? '<section aria-labelledby="h-viec" style="margin-top:var(--space-14)">' +
          '<h2 id="h-viec" style="font-size:var(--fs-2xl);margin-bottom:var(--space-11)">Vị trí đang giới thiệu</h2>' +
          '<div class="joblist">' + viec.map(C.jobRow).join('') + '</div></section>'
        : '') +

      '<div class="notice notice--accent" style="margin-top:var(--space-14)">' +
      '<span class="notice__icon" aria-hidden="true"><i class="ph-light ph-shield-check"></i></span>' +
      '<span>Một số trường có thể đang ẩn. Mỗi cựu sinh viên tự chọn thông tin nào công khai, ' +
      'thông tin nào chỉ thành viên thấy, và thông tin nào giữ riêng. Bạn đổi lựa chọn của mình trong mục ' +
      '<a class="link" href="tai-khoan.html">Tài khoản</a>.</span></div>' +

      '</div></div>';
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
