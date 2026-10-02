/* ==========================================================================
   ĐĂNG KÝ CỰU SINH VIÊN

   Ba bước. Mỗi bước tự kiểm trước khi cho đi tiếp, nên người dùng không điền
   hết ba màn rồi mới biết trường đầu tiên sai.

   Bước ba là phần đáng chú ý: người đăng ký chọn phạm vi công khai cho từng
   trường. Mặc định của hệ thống là dè dặt, và trang nói rõ mặc định đó là gì
   thay vì im lặng chọn hộ.
   ========================================================================== */

(function () {
  'use strict';

  var U = window.__UI, D = window.__DATA, S = window.__STORE;
  var $ = U.$, $$ = U.$$;

  var TRUONG = [
    ['email', 'Địa chỉ email', 'Cách người khác trong mạng lưới liên hệ với bạn.'],
    ['phone', 'Số điện thoại', 'Nên để riêng tư trừ khi bạn muốn nhận cuộc gọi từ mạng lưới.'],
    ['company', 'Nơi công tác và chức danh', 'Giúp người cùng ngành tìm được bạn trong danh bạ.'],
    ['city', 'Nơi sinh sống', 'Dùng cho các buổi gặp mặt theo khu vực.'],
  ];

  var MUC = [
    ['cong-khai', 'Công khai'],
    ['thanh-vien', 'Chỉ thành viên'],
    ['rieng-tu', 'Riêng tư'],
  ];

  /* Mặc định dè dặt: chỉ nơi công tác và nơi sống là công khai. */
  var MAC_DINH = { email: 'thanh-vien', phone: 'rieng-tu', company: 'cong-khai', city: 'cong-khai' };

  function boot() {
    var form = $('[data-form]');
    if (!form) return;

    var buoc = 1;
    var elSteps = $$('[data-steps] .step');
    var elPrev = $('[data-prev]');
    var elNext = $('[data-next]');
    var elSubmit = $('[data-submit]');

    /* --------------------------------------------------------------------
       Đổ lựa chọn cho các ô chọn, lấy thẳng từ bộ dữ liệu nên không lệch với
       những giá trị đang có trong danh bạ.
       -------------------------------------------------------------------- */
    var al = D.alumni();
    var khoas = Array.from(new Set(al.map(function (a) { return a.khoa; }))).sort(function (a, b) { return b - a; });
    $('#khoa').innerHTML = '<option value="">Chọn khóa</option>' +
      khoas.map(function (k) { return '<option value="' + k + '">Khóa ' + k + ' (nhập học ' + (1955 + k) + ')</option>'; }).join('');

    var nganhs = Array.from(new Set(al.map(function (a) { return a.nganh; }))).sort(function (a, b) { return a.localeCompare(b, 'vi'); });
    $('#nganh').innerHTML = '<option value="">Chọn ngành</option>' +
      nganhs.map(function (n) { return '<option value="' + U.esc(n) + '">' + U.esc(n) + '</option>'; }).join('');

    var lvs = Array.from(new Set(al.map(function (a) { return a.linhvuc; }))).sort(function (a, b) { return a.localeCompare(b, 'vi'); });
    $('#linhvuc').innerHTML = '<option value="">Chọn lĩnh vực</option>' +
      lvs.map(function (n) { return '<option value="' + U.esc(n) + '">' + U.esc(n) + '</option>'; }).join('');

    /* -------------------------------------------------------------------- */
    $('[data-scopes]').innerHTML = TRUONG.map(function (t) {
      return '<div class="scoperow">' +
        '<div><span class="scoperow__k">' + U.esc(t[1]) + '</span>' +
        '<p class="scoperow__note">' + U.esc(t[2]) + '</p></div>' +
        '<div><label class="sr-only" for="pv-' + t[0] + '">Phạm vi công khai cho ' + U.esc(t[1]) + '</label>' +
        '<select class="select" id="pv-' + t[0] + '" data-scope="' + t[0] + '">' +
        MUC.map(function (m) {
          return '<option value="' + m[0] + '"' + (m[0] === MAC_DINH[t[0]] ? ' selected' : '') + '>' + m[1] + '</option>';
        }).join('') + '</select></div></div>';
    }).join('');

    function show(n) {
      buoc = n;
      $$('[data-step]', form).forEach(function (fs) {
        fs.classList.toggle('hide', fs.dataset.step !== String(n));
      });
      elSteps.forEach(function (s, i) {
        s.classList.toggle('is-on', i + 1 === n);
        s.classList.toggle('is-done', i + 1 < n);
      });
      elPrev.disabled = n === 1;
      elNext.classList.toggle('hide', n === 3);
      elSubmit.classList.toggle('hide', n !== 3);

      /* Đưa tiêu điểm vào đầu bước mới để người dùng bàn phím không phải Tab
         ngược lên từ cuối trang. */
      var dau = $('[data-step="' + n + '"] .fieldset__legend', form);
      if (dau) {
        dau.setAttribute('tabindex', '-1');
        dau.focus();
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /* Chỉ kiểm các trường của bước đang mở. validate() bỏ qua trường ẩn nhờ
       kiểm tra offsetParent, nên gọi thẳng là đủ. */
    elNext.addEventListener('click', function () {
      if (!U.validate(form)) return;
      show(buoc + 1);
    });
    elPrev.addEventListener('click', function () { show(buoc - 1); });

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!U.validate(form)) return;

      elSubmit.classList.add('is-loading');
      elSubmit.disabled = true;

      setTimeout(function () {
        var fd = new FormData(form);
        var khoa = Number(fd.get('khoa'));
        var privacy = {};
        $$('[data-scope]').forEach(function (s) { privacy[s.dataset.scope] = s.value; });

        var ho = {
          id: 'al-u-' + Date.now().toString(36),
          slug: U.fold(String(fd.get('hoten'))).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
          name: fd.get('hoten'),
          khoa: khoa,
          lop: fd.get('lop') || '',
          nganh: fd.get('nganh'),
          namNhapHoc: 1955 + khoa,
          namTotNghiep: Number(fd.get('namtn')) || (1955 + khoa + 4),
          linhvuc: fd.get('linhvuc') || 'Khác',
          congty: fd.get('congty') || '',
          chucdanh: fd.get('chucdanh') || '',
          thanhpho: fd.get('thanhpho') || '',
          quocgia: 'Việt Nam',
          email: fd.get('email'),
          dienthoai: fd.get('dienthoai') || '',
          coVanNghiepVu: fd.get('covan') === '1',
          quanTam: [],
          gioiThieu: '',
          privacy: privacy,
          thamGia: new Date().toISOString().slice(0, 10),
        };

        S.saveProfile(ho);
        S.addRecord('alumni', ho);
        S.signIn({ id: 'u-self', ten: ho.name, email: ho.email, vaitro: 'alumni', khoa: ho.khoa, alumniId: ho.id });
        if (window.__SEARCH) window.__SEARCH.invalidate();

        form.classList.add('hide');
        $('[data-steps]').classList.add('hide');

        var done = $('[data-done]');
        done.classList.remove('hide');
        done.innerHTML =
          '<div class="notice notice--success" style="margin-bottom:var(--space-12)">' +
          '<span class="notice__icon" aria-hidden="true"><i class="ph-light ph-check-circle"></i></span>' +
          '<span><strong>Đã tạo hồ sơ.</strong> Bạn đang đăng nhập với tư cách ' + U.esc(ho.name) + '.</span></div>' +

          '<h2 style="font-size:var(--fs-3xl);margin-bottom:var(--space-10)">Bạn đã ở trong mạng lưới</h2>' +
          '<p class="muted" style="margin-bottom:var(--space-12);max-width:56ch;line-height:var(--lh-relaxed)">' +
          'Hồ sơ đã vào danh bạ theo đúng phạm vi công khai bạn chọn. Bạn đổi lựa chọn đó bất cứ lúc nào trong mục Tài khoản.</p>' +

          '<div style="display:flex;flex-wrap:wrap;gap:var(--space-7)">' +
          '<a class="btn btn--primary" href="ho-so.html?id=' + encodeURIComponent(ho.id) + '">Xem hồ sơ của tôi</a>' +
          '<a class="btn btn--ghost" href="tai-khoan.html">Mở tài khoản</a>' +
          '<a class="btn btn--quiet" href="su-kien.html">Xem sự kiện sắp tới</a>' +
          '</div>' +

          '<div class="notice" style="margin-top:var(--space-13)">' +
          '<span class="notice__icon" aria-hidden="true"><i class="ph-light ph-info"></i></span>' +
          '<span>Đây là bản demo không có máy chủ. Hồ sơ nằm trong trình duyệt này và không được gửi đi đâu. ' +
          'Xóa dữ liệu trang web sẽ xóa luôn hồ sơ.</span></div>';

        U.toast('Đăng ký thành công.', 'success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 650);
    });

    show(1);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
