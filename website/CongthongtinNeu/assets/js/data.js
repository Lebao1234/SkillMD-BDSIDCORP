/* ==========================================================================
   LỚP TRUY CẬP DỮ LIỆU

   Trang công khai không bao giờ đọc thẳng window.__POSTS. Nó đi qua đây, để
   mọi thay đổi biên tập viên thực hiện trong CMS (sửa, thêm, ẩn) hiện ra ngay
   trên trang công khai mà không phải sinh lại file dữ liệu.
   ========================================================================== */

(function () {
  'use strict';

  var S = window.__STORE;

  function of(kind, global) {
    return function () { return S.merge(kind, (window[global] || []).slice()); };
  }

  var alumni = of('alumni', '__ALUMNI');
  var posts = of('posts', '__POSTS');
  var events = of('events', '__EVENTS');
  var albums = of('albums', '__ALBUMS');
  var jobs = of('jobs', '__JOBS');
  var users = of('users', '__USERS');

  function byId(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function bySlug(list, slug) {
    for (var i = 0; i < list.length; i++) if (list[i].slug === slug) return list[i];
    return null;
  }

  /* Hồ sơ tiêu biểu: nhóm có ảnh chân dung, dùng cho lưới Chân dung ở trang
     chủ và cho bộ lọc noibat trên danh bạ. */
  function noiBat() {
    return alumni().filter(function (a) { return a.noiBat && a.anhChanDung; });
  }

  /* Tin tức và câu chuyện nằm chung một bộ, tách ra bằng trường loai. */
  function tin() { return posts().filter(function (p) { return p.loai === 'tin'; }); }
  function cauChuyen() { return posts().filter(function (p) { return p.loai === 'cauchuyen'; }); }

  function sapToi() {
    var now = Date.now();
    return events()
      .filter(function (e) { return new Date(e.batdau).getTime() >= now; })
      .sort(function (a, b) { return new Date(a.batdau) - new Date(b.batdau); });
  }
  function daQua() {
    var now = Date.now();
    return events()
      .filter(function (e) { return new Date(e.batdau).getTime() < now; })
      .sort(function (a, b) { return new Date(b.batdau) - new Date(a.batdau); });
  }

  /* Số chỗ đã đăng ký gồm cả phần người dùng đăng ký trong trình duyệt này. */
  function soDaDangKy(ev) {
    return (ev.dadangky || 0) + S.registrationsFor(ev.id).length;
  }

  /* --------------------------------------------------------------------------
     Phạm vi công khai của hồ sơ

     Mỗi cựu sinh viên chọn ai được thấy trường nào. Hàm này quyết định một
     trường có được hiện cho người đang xem hay không, dựa trên phiên đăng nhập.
     Khách vãng lai chỉ thấy trường đặt ở mức công khai.
     -------------------------------------------------------------------------- */
  function thayDuoc(ho, truong) {
    var muc = (ho.privacy && ho.privacy[truong]) || 'cong-khai';
    if (muc === 'cong-khai') return true;
    if (muc === 'thanh-vien') return S.isMember();
    return S.isAdmin();     /* rieng-tu: chỉ chủ hồ sơ và quản trị viên */
  }

  /* --------------------------------------------------------------------------
     Đếm giá trị để dựng bộ lọc. Bộ đếm luôn tính trên tập đang xét, nên bộ lọc
     không bao giờ mời một lựa chọn dẫn tới không kết quả nào.
     -------------------------------------------------------------------------- */
  function dem(list, key) {
    var m = new Map();
    list.forEach(function (r) {
      var v = r[key];
      if (v == null || v === '') return;
      m.set(v, (m.get(v) || 0) + 1);
    });
    return Array.from(m.entries())
      .map(function (e) { return { gia: e[0], so: e[1] }; })
      .sort(function (a, b) {
        if (b.so !== a.so) return b.so - a.so;
        return String(a.gia).localeCompare(String(b.gia), 'vi');
      });
  }

  window.__DATA = {
    alumni: alumni, posts: posts, events: events, albums: albums,
    jobs: jobs, users: users,
    tin: tin, cauChuyen: cauChuyen, noiBat: noiBat,
    sapToi: sapToi, daQua: daQua, soDaDangKy: soDaDangKy,
    byId: byId, bySlug: bySlug, thayDuoc: thayDuoc, dem: dem,
  };
})();
