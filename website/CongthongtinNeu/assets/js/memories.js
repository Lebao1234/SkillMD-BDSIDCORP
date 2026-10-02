/* ==========================================================================
   KHO KỶ NIỆM
   ========================================================================== */

(function () {
  'use strict';

  var U = window.__UI, D = window.__DATA, C = window.__CARDS;
  var $ = U.$, $$ = U.$$;

  function boot() {
    var elList = $('[data-list]');
    var elCount = $('[data-count]');
    var elYears = $('[data-years]');
    var elQ = $('[data-q]');

    var state = {
      loai: U.param('loai', ''),
      nam: U.param('nam', ''),
      q: U.param('q', ''),
    };
    if (elQ) elQ.value = state.q;

    function loc() {
      var q = U.fold(state.q.trim());
      return D.albums().filter(function (a) {
        if (state.loai && a.loai !== state.loai) return false;
        if (state.nam && String(a.nam) !== state.nam) return false;
        if (q.length >= 2) {
          var hay = U.fold([a.tieude, a.mota, 'nam ' + a.nam, a.khoa ? 'khoa ' + a.khoa : ''].join(' '));
          if (!q.split(/\s+/).every(function (w) { return hay.indexOf(w) >= 0; })) return false;
        }
        return true;
      }).sort(function (a, b) { return b.nam - a.nam; });
    }

    function drawYears() {
      /* Năm được đếm trên tập đã lọc bởi LOẠI, không phải bởi năm, nếu không
         chọn một năm sẽ làm các năm khác biến mất khỏi thanh chọn. */
      var tap = D.albums().filter(function (a) { return !state.loai || a.loai === state.loai; });
      var m = new Map();
      tap.forEach(function (a) { m.set(a.nam, (m.get(a.nam) || 0) + 1); });
      var nam = Array.from(m.entries()).sort(function (a, b) { return b[0] - a[0]; });

      elYears.innerHTML =
        '<button class="chip' + (state.nam ? '' : ' is-on') + '" type="button" data-nam="" aria-pressed="' + !state.nam + '">Mọi năm</button>' +
        nam.map(function (e) {
          var on = String(e[0]) === state.nam;
          return '<button class="chip' + (on ? ' is-on' : '') + '" type="button" data-nam="' + e[0] + '" aria-pressed="' + on + '">' +
            e[0] + '<span class="chip__count">' + e[1] + '</span></button>';
        }).join('');
    }

    function draw() {
      var items = loc();
      var tongAnh = items.reduce(function (n, a) { return n + a.anh.length; }, 0);
      elCount.textContent = U.fmtNum(items.length) + ' bộ tư liệu, ' + U.fmtNum(tongAnh) + ' tệp';

      if (!items.length) {
        elList.style.display = 'block';
        elList.innerHTML = C.empty(
          'Chưa có tư liệu nào ở đây',
          'Thử bỏ bộ lọc năm, hoặc gửi ảnh và kỷ yếu của khóa bạn qua mục Đóng góp nội dung để bổ sung vào kho.',
          'images-square',
          '<a class="btn btn--ghost" href="dong-gop.html">Gửi tư liệu</a>'
        );
      } else {
        elList.style.display = '';
        elList.innerHTML = items.map(C.albumCard).join('');
      }

      drawYears();
      U.setParams({ loai: state.loai, nam: state.nam, q: state.q }, true);
    }

    $$('[data-kind-tabs] .tab').forEach(function (t) {
      if (t.dataset.kind === state.loai) {
        $$('[data-kind-tabs] .tab').forEach(function (x) { x.setAttribute('aria-selected', 'false'); });
        t.setAttribute('aria-selected', 'true');
      }
    });

    document.addEventListener('click', function (ev) {
      var tab = ev.target.closest('[data-kind-tabs] .tab');
      if (tab) {
        $$('[data-kind-tabs] .tab').forEach(function (x) { x.setAttribute('aria-selected', 'false'); });
        tab.setAttribute('aria-selected', 'true');
        state.loai = tab.dataset.kind;
        state.nam = '';
        draw();
        return;
      }
      var y = ev.target.closest('[data-nam]');
      if (y) { state.nam = y.dataset.nam; draw(); }
    });

    var timer;
    elQ.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () { state.q = elQ.value; draw(); }, 200);
    });

    draw();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
