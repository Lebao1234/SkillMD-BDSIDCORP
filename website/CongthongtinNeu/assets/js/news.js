/* ==========================================================================
   TRANG TIN TỨC
   ========================================================================== */

(function () {
  'use strict';

  var U = window.__UI, D = window.__DATA, C = window.__CARDS;

  function boot() {
    window.__LISTING({
      all: function () { return D.tin(); },
      moiTrang: 9,
      sortMacDinh: 'moi',
      khung: C.skeletonCards(6),

      facets: [
        { key: 'danhmuc' },
        /* Một bài mang nhiều thẻ, nên mặt này lấy giá trị theo cách khác:
           bản ghi khớp nếu bất kỳ thẻ nào của nó nằm trong lựa chọn. */
        { key: 'the', gia: function (p) { return (p.the || [])[0]; }, toiDa: 8 },
      ],

      timTrong: function (p) {
        return [p.tieude, p.tomtat, p.danhmuc, (p.the || []).join(' ')].join(' ');
      },

      sorts: {
        moi: function (a, b) { return a.ngay < b.ngay ? 1 : -1; },
        cu: function (a, b) { return a.ngay > b.ngay ? 1 : -1; },
        az: function (a, b) { return a.tieude.localeCompare(b.tieude, 'vi'); },
      },

      ve: C.postCard,
      nhanDem: function (n) { return U.fmtNum(n) + ' bài viết'; },
      rongTieuDe: 'Không có bài nào khớp',
      rongNoiDung: 'Thử bỏ bớt một bộ lọc hoặc dùng từ khóa ngắn hơn. Mục Câu chuyện Alumni có thể là thứ bạn đang tìm.',
      rongIcon: 'newspaper',
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
