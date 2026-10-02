/* ==========================================================================
   CƠ HỘI NGHỀ NGHIỆP

   Danh sách nhóm theo lĩnh vực, chi tiết mở trong ngăn kéo bên phải. Mở một
   vị trí có ghi vào địa chỉ URL, nên một vị trí cụ thể có thể gửi cho người
   khác và nút Quay lại đóng ngăn kéo thay vì rời khỏi trang.
   ========================================================================== */

(function () {
  'use strict';

  var U = window.__UI, D = window.__DATA, C = window.__CARDS, S = window.__STORE;
  var $ = U.$;
  var nha = null;

  function nhomTheoLinhVuc(items) {
    var m = new Map();
    items.forEach(function (j) {
      if (!m.has(j.linhvuc)) m.set(j.linhvuc, []);
      m.get(j.linhvuc).push(j);
    });
    return Array.from(m.entries()).map(function (e) {
      return '<div class="jobgroup"><div class="jobgroup__head">' +
        '<h2 class="jobgroup__name">' + U.esc(e[0]) + '</h2>' +
        '<span class="jobgroup__count">' + e[1].length + ' vị trí</span></div>' +
        e[1].map(C.jobRow).join('') + '</div>';
    }).join('');
  }

  /* ------------------------------------------------------------------------
     Ngăn kéo chi tiết
     ------------------------------------------------------------------------ */
  function openJob(slug) {
    var j = D.bySlug(D.jobs(), slug);
    if (!j) return;

    var d = $('[data-job-drawer]'), sc = $('[data-job-scrim]');
    var nguoi = D.byId(D.alumni(), j.nguoiDangId);
    var hetHan = new Date(j.hanNop).getTime() < Date.now();

    $('[data-job-title]').textContent = j.tieude;

    $('[data-job-body]').innerHTML =
      '<div style="display:flex;align-items:center;gap:var(--space-9);margin-bottom:var(--space-11)">' +
      U.orgMark(j.congty, 'orgmark--lg') +
      '<div><strong style="font-family:var(--font-display);font-size:var(--fs-lg)">' + U.esc(j.congty) + '</strong>' +
      '<p class="dim" style="font-size:var(--fs-xs)">' + U.esc(j.thanhpho) + ', ' + U.esc(j.quocgia) + '</p></div></div>' +

      '<div style="display:flex;flex-wrap:wrap;gap:var(--space-4);margin-bottom:var(--space-11)">' +
      '<span class="tag tag--accent">' + U.esc(j.capbac) + '</span>' +
      '<span class="tag">' + U.esc(j.hinhthuc) + '</span>' +
      '<span class="tag">' + U.esc(j.linhvuc) + '</span>' +
      (hetHan ? '<span class="tag tag--danger">Đã hết hạn</span>'
              : '<span class="tag tag--success">Hạn ' + U.fmtDateShort(j.hanNop) + '</span>') +
      '</div>' +

      '<div class="profile__facts" style="margin-bottom:var(--space-11)">' +
      '<div class="fact"><span class="fact__k">Mức lương</span><span class="fact__v">' + U.esc(j.luong) + '</span></div>' +
      '<div class="fact"><span class="fact__k">Ngày đăng</span><span class="fact__v">' + U.fmtDate(j.ngayDang) + '</span></div>' +
      '<div class="fact"><span class="fact__k">Hạn nộp</span><span class="fact__v">' + U.fmtDate(j.hanNop) + ' (' + U.relDays(j.hanNop) + ')</span></div>' +
      '</div>' +

      '<div class="prose" style="max-width:none"><p>' + U.esc(j.mota) + '</p>' +
      '<h3 style="font-size:var(--fs-lg);margin-top:var(--space-11)">Yêu cầu</h3>' +
      '<ul>' + j.yeucau.map(function (y) { return '<li>' + U.esc(y) + '</li>'; }).join('') + '</ul>' +
      '<h3 style="font-size:var(--fs-lg);margin-top:var(--space-11)">Quyền lợi</h3>' +
      '<ul>' + j.quyenloi.map(function (y) { return '<li>' + U.esc(y) + '</li>'; }).join('') + '</ul></div>' +

      (nguoi
        ? '<div class="notice notice--accent" style="margin-top:var(--space-11);align-items:center">' +
          '<span class="avatar" data-name="' + U.esc(nguoi.name) + '" style="' + U.avatarStyle(nguoi.name) + '" aria-hidden="true">' + U.esc(U.initials(nguoi.name)) + '</span>' +
          '<span>Giới thiệu bởi <strong>' + U.esc(nguoi.name) + '</strong>, khóa ' + nguoi.khoa + '.<br>' +
          '<a class="link" href="ho-so.html?id=' + encodeURIComponent(nguoi.id) + '">Xem hồ sơ người giới thiệu</a></span></div>'
        : '');

    $('[data-job-foot]').innerHTML = hetHan
      ? '<button class="btn btn--primary btn--block" type="button" disabled>Vị trí đã hết hạn nộp</button>'
      : '<a class="btn btn--primary btn--block" href="mailto:' + U.esc(j.lienhe) + '?subject=' + encodeURIComponent('Ứng tuyển: ' + j.tieude) + '">Gửi hồ sơ ứng tuyển</a>' +
        '<p class="dim" style="font-size:var(--fs-xs);text-align:center">Địa chỉ liên hệ là địa chỉ mẫu của bản demo.</p>';

    d.hidden = false;
    requestAnimationFrame(function () { d.classList.add('is-open'); });
    sc.classList.add('is-open');
    document.body.classList.add('is-locked');
    nha = U.trapFocus(d, function () { closeJob(true); });
  }

  function closeJob(pushUrl) {
    var d = $('[data-job-drawer]'), sc = $('[data-job-scrim]');
    if (!d || d.hidden) return;
    d.classList.remove('is-open');
    sc.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    setTimeout(function () { d.hidden = true; }, 240);
    if (nha) { nha(); nha = null; }
    if (pushUrl) U.setParams({ viec: '' }, false);
  }

  function boot() {
    window.__LISTING({
      all: function () { return D.jobs(); },
      moiTrang: 40,
      sortMacDinh: 'moi',

      facets: [
        { key: 'linhvuc', toiDa: 15 },
        { key: 'capbac' },
        { key: 'hinhthuc' },
        { key: 'thanhpho', toiDa: 21 },
      ],

      timTrong: function (j) {
        return [j.tieude, j.congty, j.linhvuc, j.capbac, j.hinhthuc, j.thanhpho, j.mota].join(' ');
      },

      sorts: {
        moi: function (a, b) { return a.ngayDang < b.ngayDang ? 1 : -1; },
        han: function (a, b) { return a.hanNop > b.hanNop ? 1 : -1; },
      },

      /* Danh sách này vẽ theo nhóm, nên bộ điều khiển nhận nguyên mảng thay vì
         từng bản ghi. ve() được gọi trên từng phần tử, nên gom nhóm ở đây bằng
         cách trả về chuỗi rỗng cho mọi phần tử trừ phần tử đầu. */
      ve: function (j, i, arr) { return i === 0 ? nhomTheoLinhVuc(arr) : ''; },

      nhanDem: function (n) { return U.fmtNum(n) + ' vị trí đang mở'; },
      rongTieuDe: 'Không có vị trí nào khớp',
      rongNoiDung: 'Thử bỏ bớt một bộ lọc. Nếu doanh nghiệp của bạn đang tuyển, hãy gửi tin qua mục Đóng góp nội dung.',
      rongIcon: 'briefcase',
    });

    document.addEventListener('click', function (e) {
      var row = e.target.closest('.jobrow a[href*="viec="]');
      if (row) {
        e.preventDefault();
        var slug = new URL(row.href, location.href).searchParams.get('viec');
        U.setParams({ viec: slug }, false);
        openJob(slug);
        return;
      }
      if (e.target.closest('[data-job-close]') || e.target.closest('[data-job-scrim]')) closeJob(true);
    });

    window.addEventListener('popstate', function () {
      var slug = U.param('viec');
      if (slug) openJob(slug); else closeJob(false);
    });

    var mo = U.param('viec');
    if (mo) openJob(mo);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
