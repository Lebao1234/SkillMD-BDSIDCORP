/* ==========================================================================
   TÀI KHOẢN CỦA TÔI

   Chưa đăng nhập thì trang này là màn chọn tài khoản. Bản demo không có mật
   khẩu và không kiểm gì cả: nó bày sẵn vài tài khoản mẫu để xem trang đổi ra
   sao với quyền khác nhau. Trang nói thẳng điều đó thay vì dựng một ô mật
   khẩu giả.
   ========================================================================== */

(function () {
  'use strict';

  var U = window.__UI, D = window.__DATA, C = window.__CARDS, S = window.__STORE;
  var $ = U.$, $$ = U.$$;

  var MUC = [['cong-khai', 'Công khai'], ['thanh-vien', 'Chỉ thành viên'], ['rieng-tu', 'Riêng tư']];
  var TRUONG = [
    ['email', 'Địa chỉ email'],
    ['phone', 'Số điện thoại'],
    ['company', 'Nơi công tác và chức danh'],
    ['city', 'Nơi sinh sống'],
  ];

  function chonTaiKhoan(wrap) {
    var us = D.users();
    var mau = [
      us.filter(function (u) { return u.vaitro === 'admin'; })[0],
      us.filter(function (u) { return u.vaitro === 'editor' && u.hoatdong; })[0],
      us.filter(function (u) { return u.vaitro === 'alumni'; })[0],
    ].filter(Boolean);

    var VAITRO = { admin: 'Quản trị viên', editor: 'Biên tập viên', alumni: 'Cựu sinh viên' };
    var MOTA = {
      admin: 'Thấy toàn bộ CMS, quản lý người dùng, phân quyền và sao lưu.',
      editor: 'Soạn và duyệt nội dung, nhưng không đụng được vào người dùng và sao lưu.',
      alumni: 'Xem được thông tin dành cho thành viên và quản lý hồ sơ của chính mình.',
    };

    wrap.innerHTML =
      '<div style="max-width:640px">' +
      '<div class="notice notice--accent" style="margin-bottom:var(--space-12)">' +
      '<span class="notice__icon" aria-hidden="true"><i class="ph-light ph-info"></i></span>' +
      '<span>Bản demo không có máy chủ nên không có đăng nhập thật. Chọn một tài khoản mẫu bên dưới để xem trang ' +
      'thay đổi thế nào theo từng quyền.</span></div>' +

      '<h2 style="font-size:var(--fs-2xl);margin-bottom:var(--space-10)">Chọn tài khoản mẫu</h2>' +
      '<div class="scopes">' +
      mau.map(function (u) {
        return '<button class="choice" type="button" data-signin="' + U.esc(u.id) + '" style="width:100%;text-align:left">' +
          '<span class="avatar" data-name="' + U.esc(u.ten) + '" style="' + U.avatarStyle(u.ten) + '" aria-hidden="true">' + U.esc(U.initials(u.ten)) + '</span>' +
          '<span class="choice__body"><span class="choice__title">' + U.esc(u.ten) + ' (' + VAITRO[u.vaitro] + ')</span>' +
          '<span class="choice__note">' + U.esc(MOTA[u.vaitro]) + '</span></span></button>';
      }).join('') +
      '</div>' +

      '<p class="dim" style="font-size:var(--fs-xs);margin-top:var(--space-12)">Chưa có hồ sơ? ' +
      '<a class="link" href="dang-ky.html">Đăng ký cựu sinh viên</a> để tự tạo một hồ sơ và đăng nhập bằng nó.</p>' +
      '</div>';
  }

  function trangCuaToi(wrap, me) {
    var ho = me.alumniId ? D.byId(D.alumni(), me.alumniId) : null;
    var dk = S.getRegistrations();
    var gui = S.getSubmissions().filter(function (s) { return s.emailGui === me.email; });
    var VAITRO = { admin: 'Quản trị viên', editor: 'Biên tập viên', alumni: 'Cựu sinh viên' };

    wrap.innerHTML =
      /* ---------------------------------------------------------- Đầu trang */
      '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:var(--space-10);padding-bottom:var(--space-12);border-bottom:1px solid var(--border)">' +
      '<span class="avatar avatar--lg" data-name="' + U.esc(me.ten) + '" style="' + U.avatarStyle(me.ten) + '" aria-hidden="true">' + U.esc(U.initials(me.ten)) + '</span>' +
      '<div style="flex:1;min-width:200px">' +
      '<h2 style="font-size:var(--fs-2xl)">' + U.esc(me.ten) + '</h2>' +
      '<p class="dim" style="font-size:var(--fs-sm)">' + U.esc(me.email) + '</p></div>' +
      '<span class="tag tag--accent">' + (VAITRO[me.vaitro] || me.vaitro) + '</span>' +
      (S.isEditor() ? '<a class="btn btn--ghost btn--sm" href="admin.html">Mở CMS</a>' : '') +
      '<button class="btn btn--quiet btn--sm" type="button" data-signout>Đăng xuất</button>' +
      '</div>' +

      /* ------------------------------------------------- Sự kiện đã đăng ký */
      '<section style="margin-top:var(--space-13)" aria-labelledby="h-dk">' +
      '<h2 id="h-dk" style="font-size:var(--fs-2xl);margin-bottom:var(--space-11)">Sự kiện đã đăng ký</h2>' +
      (dk.length
        ? '<div class="doclist">' + dk.map(function (r) {
            var e = D.byId(D.events(), r.eventId);
            if (!e) return '';
            return '<div class="docrow">' +
              '<span class="docrow__icon" aria-hidden="true"><i class="ph-light ph-calendar-check"></i></span>' +
              '<div><p class="docrow__name">' + U.esc(e.tieude) + '</p>' +
              '<p class="docrow__meta">' + U.fmtDate(e.batdau) + ', ' + U.esc(e.thanhpho) +
              ' &middot; mã ' + U.esc(r.id) + (r.nguoi ? ' &middot; thêm ' + r.nguoi + ' người' : '') + '</p></div>' +
              '<div style="display:flex;gap:var(--space-5)">' +
              '<a class="btn btn--quiet btn--sm" href="su-kien-chi-tiet.html?slug=' + encodeURIComponent(e.slug) + '">Xem</a>' +
              '<button class="btn btn--quiet btn--sm" type="button" data-huy="' + U.esc(r.id) + '">Hủy</button></div></div>';
          }).join('') + '</div>'
        : C.empty('Chưa đăng ký sự kiện nào', 'Mở mục Sự kiện, chọn một chương trình sắp diễn ra và bấm đăng ký.', 'calendar-blank',
            '<a class="btn btn--ghost" href="su-kien.html">Xem sự kiện</a>')) +
      '</section>' +

      /* --------------------------------------------------- Nội dung đã gửi */
      '<section style="margin-top:var(--space-14)" aria-labelledby="h-gui">' +
      '<h2 id="h-gui" style="font-size:var(--fs-2xl);margin-bottom:var(--space-11)">Nội dung đã gửi</h2>' +
      (gui.length
        ? '<div class="doclist">' + gui.map(function (s) {
            var t = s.trangthai === 'da-duyet' ? ['tag--success', 'Đã duyệt']
              : s.trangthai === 'tu-choi' ? ['tag--danger', 'Không duyệt'] : ['tag--warning', 'Chờ duyệt'];
            return '<div class="docrow">' +
              '<span class="docrow__icon" aria-hidden="true"><i class="ph-light ph-paper-plane-tilt"></i></span>' +
              '<div><p class="docrow__name">' + U.esc(s.tieude) + '</p>' +
              '<p class="docrow__meta">Gửi ' + U.fmtDate(s.ngayGui) + ' &middot; mã ' + U.esc(s.id) + '</p></div>' +
              '<span class="tag ' + t[0] + '">' + t[1] + '</span></div>';
          }).join('') + '</div>'
        : C.empty('Chưa gửi nội dung nào', 'Bạn có thể gửi câu chuyện, ảnh kỷ niệm, tư liệu hoặc tin tuyển dụng cho ban quản trị.', 'paper-plane-tilt',
            '<a class="btn btn--ghost" href="dong-gop.html">Gửi nội dung</a>')) +
      '</section>' +

      /* ---------------------------------------------------- Phạm vi công khai */
      (ho
        ? '<section style="margin-top:var(--space-14)" aria-labelledby="h-pv">' +
          '<h2 id="h-pv" style="font-size:var(--fs-2xl);margin-bottom:var(--space-8)">Phạm vi công khai</h2>' +
          '<p class="muted" style="max-width:60ch;margin-bottom:var(--space-11);line-height:var(--lh-relaxed)">' +
          'Bạn quyết định ai thấy được gì. Thay đổi có hiệu lực ngay trên danh bạ và trang hồ sơ của bạn.</p>' +
          '<div class="scopes">' + TRUONG.map(function (t) {
            var cur = (ho.privacy && ho.privacy[t[0]]) || 'cong-khai';
            return '<div class="scoperow">' +
              '<div><span class="scoperow__k">' + U.esc(t[1]) + '</span></div>' +
              '<div><label class="sr-only" for="pv-' + t[0] + '">Phạm vi cho ' + U.esc(t[1]) + '</label>' +
              '<select class="select" id="pv-' + t[0] + '" data-pv="' + t[0] + '">' +
              MUC.map(function (m) {
                return '<option value="' + m[0] + '"' + (m[0] === cur ? ' selected' : '') + '>' + m[1] + '</option>';
              }).join('') + '</select></div></div>';
          }).join('') + '</div>' +
          '<div style="margin-top:var(--space-11);display:flex;flex-wrap:wrap;gap:var(--space-7)">' +
          '<a class="btn btn--ghost" href="ho-so.html?id=' + encodeURIComponent(ho.id) + '">Xem hồ sơ của tôi</a>' +
          '</div></section>'
        : '') +

      /* ------------------------------------------------------- Dữ liệu của tôi */
      '<section style="margin-top:var(--space-14);padding-top:var(--space-12);border-top:1px solid var(--border)" aria-labelledby="h-dl">' +
      '<h2 id="h-dl" style="font-size:var(--fs-2xl);margin-bottom:var(--space-8)">Dữ liệu của tôi</h2>' +
      '<p class="muted" style="max-width:60ch;margin-bottom:var(--space-11);line-height:var(--lh-relaxed)">' +
      'Mọi thứ bạn tạo ra trên bản demo này nằm trong trình duyệt của chính bạn. Bạn tải nó về hoặc xóa hẳn bất cứ lúc nào.</p>' +
      '<div style="display:flex;flex-wrap:wrap;gap:var(--space-7)">' +
      '<button class="btn btn--ghost" type="button" data-export>Tải dữ liệu của tôi về</button>' +
      '<button class="btn btn--quiet" type="button" data-wipe>Xóa toàn bộ dữ liệu demo</button>' +
      '</div></section>';
  }

  function boot() {
    var wrap = $('[data-account]');
    if (!wrap) return;

    function render() {
      var me = S.getSession();
      if (me) trangCuaToi(wrap, me); else chonTaiKhoan(wrap);
    }

    document.addEventListener('click', function (ev) {
      var vao = ev.target.closest('[data-signin]');
      if (vao) {
        var u = D.byId(D.users(), vao.dataset.signin);
        if (u) {
          S.signIn(u);
          U.toast('Đang xem với tư cách ' + u.ten + '.', 'success');
          render();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }
      if (ev.target.closest('[data-signout]')) {
        S.signOut();
        U.toast('Đã đăng xuất.');
        render();
        return;
      }
      var huy = ev.target.closest('[data-huy]');
      if (huy) {
        S.cancelRegistration(huy.dataset.huy);
        U.toast('Đã hủy đăng ký.', 'success');
        render();
        return;
      }
      if (ev.target.closest('[data-export]')) {
        var blob = new Blob([JSON.stringify(S.exportAll(), null, 2)], { type: 'application/json' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'neu-alumni-du-lieu-cua-toi.json';
        a.click();
        URL.revokeObjectURL(a.href);
        U.toast('Đã tải tệp dữ liệu về.', 'success');
        return;
      }
      if (ev.target.closest('[data-wipe]')) {
        if (!window.confirm('Xóa toàn bộ dữ liệu demo trong trình duyệt này? Thao tác này không hoàn tác được.')) return;
        S.resetAll();
        if (window.__SEARCH) window.__SEARCH.invalidate();
        U.toast('Đã xóa. Trang trở về dữ liệu mẫu ban đầu.', 'success');
        render();
      }
    });

    document.addEventListener('change', function (ev) {
      var sel = ev.target.closest('[data-pv]');
      if (!sel) return;
      var me = S.getSession();
      var ho = me && me.alumniId ? D.byId(D.alumni(), me.alumniId) : null;
      if (!ho) return;
      var pv = Object.assign({}, ho.privacy);
      pv[sel.dataset.pv] = sel.value;
      S.patchRecord('alumni', ho.id, { privacy: pv });
      U.toast('Đã lưu phạm vi công khai.', 'success');
    });

    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
