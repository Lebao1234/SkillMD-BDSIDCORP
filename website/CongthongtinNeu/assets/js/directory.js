/* ==========================================================================
   DANH BẠ CỰU SINH VIÊN
   ========================================================================== */

(function () {
  'use strict';

  var U = window.__UI, D = window.__DATA, C = window.__CARDS;

  function boot() {
    window.__LISTING({
      all: function () { return D.alumni(); },
      moiTrang: 24,
      sortMacDinh: 'khoa-moi',
      khung: C.skeletonRows(9),

      facets: [
        {
          key: 'khoa',
          nhan: function (v) { return 'K' + v; },
          toiDa: 16,
          /* Khóa là con số, nên xếp theo số giảm dần thay vì theo số lượng.
             Người tra danh bạ tìm khóa của mình, không tìm khóa đông nhất. */
          xep: function (a, b) { return Number(b.gia) - Number(a.gia); },
        },
        { key: 'nganh', toiDa: 24 },
        { key: 'linhvuc', toiDa: 15 },
        { key: 'thanhpho', toiDa: 21 },
      ],

      co: { chiCoVan: '[data-only-mentor]' },
      loc: function (a, st) { return !st.chiCoVan || a.coVanNghiepVu; },

      timTrong: function (a) {
        return [a.name, a.congty, a.chucdanh, a.nganh, a.lop, 'khoa ' + a.khoa, 'k' + a.khoa, a.thanhpho].join(' ');
      },

      sorts: {
        'khoa-moi': function (a, b) { return b.khoa - a.khoa || a.name.localeCompare(b.name, 'vi'); },
        'khoa-cu': function (a, b) { return a.khoa - b.khoa || a.name.localeCompare(b.name, 'vi'); },
        /* Người Việt sắp theo tên chứ không theo họ. */
        az: function (a, b) {
          var ta = a.name.split(' ').pop(), tb = b.name.split(' ').pop();
          return ta.localeCompare(tb, 'vi') || a.name.localeCompare(b.name, 'vi');
        },
      },

      ve: C.personCard,
      nhanDem: function (n) { return U.fmtNum(n) + ' hồ sơ'; },
      rongTieuDe: 'Không có hồ sơ nào khớp',
      rongNoiDung: 'Thử bỏ bớt một bộ lọc. Nếu bạn là cựu sinh viên và chưa thấy mình ở đây, hãy đăng ký để thêm hồ sơ.',
      rongIcon: 'users-three',
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
