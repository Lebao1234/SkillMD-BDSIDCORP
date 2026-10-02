/* ==========================================================================
   TRANG KẾT QUẢ TÌM KIẾM

   Kết quả nhóm theo loại, kèm dải tóm tắt để nhảy nhanh tới nhóm cần. Từ khóa
   khớp được bôi vàng, kể cả khi người dùng gõ không dấu.
   ========================================================================== */

(function () {
  'use strict';

  var U = window.__UI, C = window.__CARDS, X = window.__SEARCH;
  var $ = U.$;

  function boot() {
    var form = $('[data-form]');
    var elQ = $('#q');
    var elSum = $('[data-sum]');
    var elOut = $('[data-results]');

    function draw(q) {
      var term = String(q || '').trim();

      if (term.length < 2) {
        elSum.innerHTML = '';
        elOut.innerHTML = C.empty(
          'Nhập từ khóa để bắt đầu',
          'Tìm được tên cựu sinh viên, tiêu đề bài viết, tên sự kiện, tên album và chức danh tuyển dụng. Gõ ít nhất hai ký tự.',
          'magnifying-glass'
        );
        return;
      }

      var hits = X.query(term);
      var nhom = X.groupByKind(hits);

      document.title = 'Tìm "' + term + '" | Mạng lưới Cựu sinh viên NEU';

      if (!hits.length) {
        elSum.innerHTML = '';
        elOut.innerHTML = C.empty(
          'Không có kết quả cho "' + term + '"',
          'Thử từ khóa ngắn hơn, hoặc bỏ dấu. Bạn cũng có thể duyệt trực tiếp trong danh bạ, tin tức hoặc kho kỷ niệm.',
          'magnifying-glass-minus',
          '<div style="display:flex;flex-wrap:wrap;gap:var(--space-6);justify-content:center">' +
          '<a class="btn btn--ghost btn--sm" href="alumni.html">Danh bạ</a>' +
          '<a class="btn btn--ghost btn--sm" href="tin-tuc.html">Tin tức</a>' +
          '<a class="btn btn--ghost btn--sm" href="ky-niem.html">Kỷ niệm</a></div>'
        );
        return;
      }

      elSum.innerHTML =
        '<span class="tag tag--accent">' + U.fmtNum(hits.length) + ' kết quả</span>' +
        nhom.map(function (g) {
          return '<a class="chip" href="#g-' + g.loai + '">' + U.esc(g.nhan) +
            '<span class="chip__count">' + g.muc.length + '</span></a>';
        }).join('');

      elOut.innerHTML = nhom.map(function (g) {
        return '<section class="sgroup" id="g-' + g.loai + '">' +
          '<div class="sgroup__head"><h2 class="sgroup__name">' + U.esc(g.nhan) + '</h2>' +
          '<span class="jobgroup__count">' + g.muc.length + ' kết quả</span></div>' +
          '<div class="doclist">' +
          g.muc.slice(0, 12).map(function (h) {
            return '<a class="docrow" href="' + h.href + '">' +
              '<span class="docrow__icon" aria-hidden="true"><i class="ph-light ph-' + icon(g.loai) + '"></i></span>' +
              '<span><span class="docrow__name">' + X.highlight(h.tieude, term) + '</span>' +
              '<span class="docrow__meta">' + X.highlight(h.phu, term) + '</span></span>' +
              '<span class="dim" aria-hidden="true"><i class="ph-light ph-arrow-right"></i></span></a>';
          }).join('') +
          '</div>' +
          (g.muc.length > 12
            ? '<p class="dim" style="font-size:var(--fs-xs);margin-top:var(--space-7)">Còn ' +
              (g.muc.length - 12) + ' kết quả nữa trong nhóm này. Thu hẹp từ khóa để thấy chính xác hơn.</p>'
            : '') +
          '</section>';
      }).join('');
    }

    function icon(loai) {
      return {
        alumni: 'user', tin: 'newspaper', cauchuyen: 'user-focus',
        sukien: 'calendar-blank', vieclam: 'briefcase', album: 'images-square',
      }[loai] || 'file';
    }

    var timer;
    elQ.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        U.setParams({ q: elQ.value }, true);
        draw(elQ.value);
      }, 200);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      U.setParams({ q: elQ.value }, false);
      draw(elQ.value);
    });

    window.addEventListener('popstate', function () {
      elQ.value = U.param('q', '');
      draw(elQ.value);
    });

    elQ.value = U.param('q', '');
    draw(elQ.value);
    if (!elQ.value) elQ.focus();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
