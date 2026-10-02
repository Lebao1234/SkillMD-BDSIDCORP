/* ==========================================================================
   DANH SÁCH SỰ KIỆN
   ========================================================================== */

(function () {
  'use strict';

  var U = window.__UI, D = window.__DATA, C = window.__CARDS, S = window.__STORE;
  var $ = U.$, $$ = U.$$;

  function boot() {
    var elList = $('[data-list]');
    var elCount = $('[data-count]');
    var elCity = $('[data-city]');

    var state = { khi: U.param('khi', 'sap'), tp: U.param('tp', '') };

    /* Danh sách địa điểm dựng từ chính dữ liệu, nên không có lựa chọn chết. */
    var tps = Array.from(new Set(D.events().map(function (e) { return e.thanhpho; }))).sort(function (a, b) {
      return a.localeCompare(b, 'vi');
    });
    elCity.innerHTML = '<option value="">Mọi địa điểm</option>' +
      tps.map(function (t) { return '<option value="' + U.esc(t) + '"' + (t === state.tp ? ' selected' : '') + '>' + U.esc(t) + '</option>'; }).join('');

    $$('[data-when-tabs] .tab').forEach(function (t) {
      t.setAttribute('aria-selected', String(t.dataset.when === state.khi));
    });

    function tap() {
      if (state.khi === 'cua-toi') {
        var ids = S.getRegistrations().map(function (r) { return r.eventId; });
        return D.events()
          .filter(function (e) { return ids.indexOf(e.id) >= 0; })
          .sort(function (a, b) { return new Date(a.batdau) - new Date(b.batdau); });
      }
      return state.khi === 'qua' ? D.daQua() : D.sapToi();
    }

    function draw() {
      var items = tap().filter(function (e) { return !state.tp || e.thanhpho === state.tp; });
      elCount.textContent = U.fmtNum(items.length) + ' sự kiện';

      if (!items.length) {
        elList.style.display = 'block';
        elList.innerHTML = state.khi === 'cua-toi'
          ? C.empty(
              'Bạn chưa đăng ký sự kiện nào',
              'Mở một sự kiện trong thẻ Sắp diễn ra rồi bấm đăng ký. Danh sách của bạn sẽ hiện ở đây.',
              'calendar-check',
              '<button class="btn btn--primary" type="button" data-goto-sap>Xem sự kiện sắp diễn ra</button>'
            )
          : C.empty(
              state.khi === 'qua' ? 'Chưa có sự kiện đã diễn ra' : 'Chưa có sự kiện nào sắp diễn ra',
              state.tp
                ? 'Không có sự kiện nào ở địa điểm này. Thử chọn Mọi địa điểm.'
                : 'Lịch của học kỳ tới đang được ban điều phối chốt.',
              'calendar-blank'
            );
      } else {
        elList.style.display = '';
        elList.innerHTML = items.map(C.eventCard).join('');
      }
      U.setParams({ khi: state.khi === 'sap' ? '' : state.khi, tp: state.tp }, true);
    }

    document.addEventListener('click', function (ev) {
      var tab = ev.target.closest('[data-when-tabs] .tab');
      if (tab) {
        $$('[data-when-tabs] .tab').forEach(function (x) { x.setAttribute('aria-selected', 'false'); });
        tab.setAttribute('aria-selected', 'true');
        state.khi = tab.dataset.when;
        draw();
        return;
      }
      if (ev.target.closest('[data-goto-sap]')) {
        state.khi = 'sap';
        $$('[data-when-tabs] .tab').forEach(function (x) { x.setAttribute('aria-selected', String(x.dataset.when === 'sap')); });
        draw();
      }
    });

    elCity.addEventListener('change', function () { state.tp = elCity.value; draw(); });

    draw();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
