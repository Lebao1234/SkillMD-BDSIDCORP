/* ==========================================================================
   CHI TIẾT SỰ KIỆN VÀ ĐĂNG KÝ THAM GIA
   ========================================================================== */

(function () {
  'use strict';

  var U = window.__UI, D = window.__DATA, C = window.__CARDS, S = window.__STORE;
  var $ = U.$;
  var ev = null;

  function blocks(list) {
    return (list || []).map(function (b) {
      if (b.type === 'h2') return '<h2>' + U.esc(b.text) + '</h2>';
      return '<p>' + U.esc(b.text) + '</p>';
    }).join('');
  }

  function metaRow(icon, k, v) {
    return '<div class="evmeta__row">' +
      '<span class="evmeta__icon" aria-hidden="true"><i class="ph-light ph-' + icon + '"></i></span>' +
      '<span><span class="evmeta__k">' + U.esc(k) + '</span><br><span class="evmeta__v">' + v + '</span></span></div>';
  }

  function panel() {
    var da = D.soDaDangKy(ev);
    var con = Math.max(0, ev.succhua - da);
    var phanTram = Math.min(100, Math.round((da / ev.succhua) * 100));
    var sapToi = new Date(ev.batdau).getTime() >= Date.now();
    var cuaToi = S.getRegistrations().filter(function (r) { return r.eventId === ev.id; })[0];

    var khoi;
    if (cuaToi) {
      khoi = '<div class="notice notice--success">' +
        '<span class="notice__icon" aria-hidden="true"><i class="ph-light ph-check-circle"></i></span>' +
        '<span>Bạn đã đăng ký với địa chỉ <strong>' + U.esc(cuaToi.email) + '</strong>.<br>' +
        'Mã đăng ký <strong>' + U.esc(cuaToi.id) + '</strong>.</span></div>' +
        '<button class="btn btn--ghost btn--block" type="button" data-cancel="' + U.esc(cuaToi.id) + '">Hủy đăng ký</button>';
    } else if (!sapToi) {
      khoi = '<div class="notice"><span class="notice__icon" aria-hidden="true"><i class="ph-light ph-clock-counter-clockwise"></i></span>' +
        '<span>Sự kiện đã diễn ra. Ảnh và tư liệu được đưa vào <a class="link" href="ky-niem.html">kho kỷ niệm</a>.</span></div>';
    } else if (!ev.moDangKy || con === 0) {
      khoi = '<div class="notice notice--warning"><span class="notice__icon" aria-hidden="true"><i class="ph-light ph-warning"></i></span>' +
        '<span>Đã hết chỗ. Bạn có thể liên hệ ban tổ chức để vào danh sách chờ.</span></div>' +
        '<button class="btn btn--ghost btn--block" type="button" disabled>Đăng ký tham gia</button>';
    } else {
      khoi = '<button class="btn btn--primary btn--block btn--lg" type="button" data-open-reg>Đăng ký tham gia</button>';
    }

    return '<aside class="evdetail__panel">' +
      '<div class="evmeta">' +
      metaRow('calendar-blank', 'Thời gian', U.fmtDate(ev.batdau) + '<br>' + U.fmtTime(ev.batdau) + ' tới ' + U.fmtTime(ev.ketthuc)) +
      metaRow('map-pin', 'Địa điểm', U.esc(ev.diadiem) + '<br>' + U.esc(ev.thanhpho)) +
      metaRow('ticket', 'Phí tham dự', U.fmtMoney(ev.phi)) +
      metaRow('users', 'Chỗ ngồi', U.fmtNum(da) + ' trên ' + U.fmtNum(ev.succhua) + ' đã nhận') +
      '</div>' +
      '<div><div class="seatbar"><div class="seatbar__fill" style="width:' + phanTram + '%"></div></div>' +
      '<p class="dim" style="font-size:var(--fs-xs);margin-top:var(--space-5)">Còn ' + U.fmtNum(con) + ' chỗ</p></div>' +
      khoi +
      '</aside>';
  }

  function regForm() {
    var me = S.getSession();
    return '<form class="drawer__body" data-reg novalidate>' +
      '<div class="fieldset" style="gap:var(--space-10)">' +
      '<div class="field">' +
      '<label class="field__label" for="r-ten">Họ và tên <span class="req" aria-hidden="true">*</span></label>' +
      '<input class="input" id="r-ten" name="ten" type="text" autocomplete="name" data-rule="required|min:3" value="' + U.esc(me ? me.ten : '') + '">' +
      '</div>' +
      '<div class="field">' +
      '<label class="field__label" for="r-email">Email <span class="req" aria-hidden="true">*</span></label>' +
      '<input class="input" id="r-email" name="email" type="email" autocomplete="email" data-rule="required|email" value="' + U.esc(me ? me.email : '') + '">' +
      '<p class="field__hint">Thư xác nhận và mã đăng ký gửi về địa chỉ này.</p>' +
      '</div>' +
      '<div class="field">' +
      '<label class="field__label" for="r-khoa">Khóa</label>' +
      '<input class="input" id="r-khoa" name="khoa" type="text" inputmode="numeric" placeholder="Ví dụ: 52" value="' + U.esc(me && me.khoa ? me.khoa : '') + '">' +
      '</div>' +
      '<div class="field">' +
      '<label class="field__label" for="r-nguoi">Số người đi cùng</label>' +
      '<select class="select" id="r-nguoi" name="nguoi">' +
      '<option value="0">Chỉ mình tôi</option><option value="1">Thêm 1 người</option>' +
      '<option value="2">Thêm 2 người</option><option value="3">Thêm 3 người</option></select>' +
      '</div>' +
      '<div class="field">' +
      '<label class="field__label" for="r-ghichu">Ghi chú cho ban tổ chức</label>' +
      '<textarea class="textarea" id="r-ghichu" name="ghichu" style="min-height:88px" placeholder="Nhu cầu ăn uống, hỗ trợ đi lại, hoặc bất cứ điều gì cần lưu ý"></textarea>' +
      '</div>' +
      '</div></form>';
  }

  function boot() {
    var wrap = $('[data-event]');
    if (!wrap) return;

    ev = D.bySlug(D.events(), U.param('slug'));
    if (!ev) {
      wrap.innerHTML = C.empty(
        'Không tìm thấy sự kiện',
        'Sự kiện có thể đã kết thúc và được gỡ, hoặc đường dẫn đã cũ.',
        'calendar-x',
        '<a class="btn btn--primary" href="su-kien.html">Về lịch sự kiện</a>',
        'h1'
      );
      return;
    }

    document.title = ev.tieude + ' | Sự kiện NEU Alumni';
    var md = document.head.querySelector('meta[name="description"]');
    if (md) md.content = ev.tomtat;

    var ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: ev.tieude,
      startDate: ev.batdau,
      endDate: ev.ketthuc,
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: { '@type': 'Place', name: ev.diadiem, address: ev.thanhpho },
      description: ev.tomtat,
      image: ev.anh,
      organizer: { '@type': 'Organization', name: 'Mạng lưới Cựu sinh viên Đại học Kinh tế Quốc dân' },
    });
    document.head.appendChild(ld);

    render();
  }

  function render() {
    var wrap = $('[data-event]');
    wrap.innerHTML =
      '<nav class="crumbs" aria-label="Đường dẫn">' +
      '<a href="index.html">Trang chủ</a><span class="crumbs__sep" aria-hidden="true">/</span>' +
      '<a href="su-kien.html">Sự kiện</a><span class="crumbs__sep" aria-hidden="true">/</span>' +
      '<span aria-current="page">' + U.esc(ev.tieude) + '</span></nav>' +

      '<div class="evdetail">' +
      '<div>' +
      '<span class="tag tag--accent">' + U.esc(ev.loai) + '</span>' +
      '<h1 style="font-size:var(--fs-5xl);margin-block:var(--space-9) var(--space-11)">' + U.esc(ev.tieude) + '</h1>' +
      '<div class="article__hero" style="margin:0 0 var(--space-12)">' +
      C.imgTag(ev.anh, ev.tieude, ev.slug, 1000, 562, true) + '</div>' +
      '<div class="prose"><p><strong>' + U.esc(ev.tomtat) + '</strong></p>' + blocks(ev.noidung) + '</div>' +
      '</div>' +
      panel() +
      '</div>' +

      lienQuan();

    /* Ngăn kéo đăng ký, dựng một lần và dùng lại. */
    if (!$('[data-reg-drawer]')) {
      document.body.insertAdjacentHTML('beforeend',
        '<div class="scrim" data-reg-scrim></div>' +
        '<aside class="drawer" data-reg-drawer role="dialog" aria-modal="true" aria-label="Đăng ký tham gia sự kiện" hidden>' +
        '<div class="drawer__head"><h2 class="drawer__title">Đăng ký tham gia</h2>' +
        '<button class="iconbtn" type="button" data-reg-close aria-label="Đóng"><i class="ph-light ph-x" aria-hidden="true"></i></button></div>' +
        regForm() +
        '<div class="drawer__foot">' +
        '<button class="btn btn--primary btn--block" type="button" data-reg-submit>Xác nhận đăng ký</button>' +
        '<p class="dim" style="font-size:var(--fs-xs);text-align:center">Trong bản demo, đăng ký lưu trong trình duyệt này và không gửi đi đâu.</p>' +
        '</div></aside>');
    }
  }

  function lienQuan() {
    var khac = D.sapToi().filter(function (e) { return e.id !== ev.id; }).slice(0, 3);
    if (!khac.length) return '';
    return '<section class="section--tight" style="border-top:1px solid var(--border)">' +
      '<h2 style="font-size:var(--fs-2xl);margin-bottom:var(--space-11)">Sự kiện khác</h2>' +
      '<div class="rail" style="grid-auto-flow:row;grid-auto-columns:auto;overflow:visible">' +
      khac.map(C.eventCard).join('') + '</div></section>';
  }

  /* ------------------------------------------------------------------------
     Mở, đóng và gửi biểu mẫu đăng ký
     ------------------------------------------------------------------------ */
  var nha = null;

  function openReg() {
    var d = $('[data-reg-drawer]'), sc = $('[data-reg-scrim]');
    d.hidden = false;
    requestAnimationFrame(function () { d.classList.add('is-open'); });
    sc.classList.add('is-open');
    document.body.classList.add('is-locked');
    nha = U.trapFocus(d, closeReg);
  }

  function closeReg() {
    var d = $('[data-reg-drawer]'), sc = $('[data-reg-scrim]');
    d.classList.remove('is-open');
    sc.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    setTimeout(function () { d.hidden = true; }, 240);
    if (nha) { nha(); nha = null; }
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-open-reg]')) { openReg(); return; }
    if (e.target.closest('[data-reg-close]') || e.target.closest('[data-reg-scrim]')) { closeReg(); return; }

    var huy = e.target.closest('[data-cancel]');
    if (huy) {
      S.cancelRegistration(huy.dataset.cancel);
      U.toast('Đã hủy đăng ký.', 'success');
      render();
      return;
    }

    var gui = e.target.closest('[data-reg-submit]');
    if (gui) {
      var form = $('[data-reg]');
      if (!U.validate(form)) return;

      gui.classList.add('is-loading');
      gui.disabled = true;

      /* Độ trễ giả để trạng thái đang tải của nút thực sự nhìn thấy được.
         Trong bản chạy thật, đây là chỗ gọi tới máy chủ. */
      setTimeout(function () {
        var fd = new FormData(form);
        var kq = S.register({
          eventId: ev.id,
          ten: fd.get('ten'),
          email: fd.get('email'),
          khoa: fd.get('khoa'),
          nguoi: Number(fd.get('nguoi') || 0),
          ghichu: fd.get('ghichu'),
        });

        gui.classList.remove('is-loading');
        gui.disabled = false;

        if (!kq.ok) {
          U.fieldError($('#r-email'), 'Địa chỉ này đã đăng ký sự kiện trên rồi.');
          return;
        }
        closeReg();
        U.toast('Đăng ký thành công. Mã xác nhận đã hiện trong khung bên phải.', 'success');
        render();
      }, 550);
    }
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
