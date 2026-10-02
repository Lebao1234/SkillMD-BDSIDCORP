/* ==========================================================================
   BỘ ĐIỀU KHIỂN DANH SÁCH CÓ LỌC

   Trang tin tức, danh bạ và tin tuyển dụng đều làm cùng một việc: lọc theo
   nhiều mặt, tìm theo từ khóa, sắp xếp, phân trang, và giữ toàn bộ trạng thái
   trong địa chỉ URL. Logic đó viết một lần ở đây.

   Hai điểm đáng nói:

   Bộ đếm bên cạnh mỗi lựa chọn được tính trên tập đã lọc bởi các mặt KHÁC,
   chứ không phải trên toàn bộ dữ liệu. Nhờ vậy bộ lọc không bao giờ mời một
   lựa chọn dẫn tới không kết quả nào.

   Mọi trạng thái nằm trong query string, nên một danh sách đã lọc có thể gửi
   cho người khác, và nút Quay lại của trình duyệt hoạt động đúng.
   ========================================================================== */

(function () {
  'use strict';

  var U = window.__UI, C = window.__CARDS;
  var $ = U.$, $$ = U.$$;

  function Listing(cfg) {
    var root = document;
    var elList = $('[data-list]', root);
    var elCount = $('[data-count]', root);
    var elPager = $('[data-pager]', root);
    var elActive = $('[data-active]', root);
    var elSort = $('[data-sort]', root);
    var elQ = $('[data-q]', root);
    var shell = $('[data-shell]', root);

    var state = { q: '', sort: cfg.sortMacDinh || '', trang: 1, mat: {} };
    cfg.facets.forEach(function (f) { state.mat[f.key] = []; });

    /* ---------------------------------------------------------------------
       Đọc trạng thái từ URL
       --------------------------------------------------------------------- */
    function readUrl() {
      state.q = U.param('q', '');
      state.sort = U.param('sort', cfg.sortMacDinh || '');
      state.trang = Math.max(1, parseInt(U.param('trang', '1'), 10) || 1);
      cfg.facets.forEach(function (f) {
        var raw = U.param(f.key, '');
        state.mat[f.key] = raw ? raw.split(',').filter(Boolean) : [];
      });
      if (cfg.co) Object.keys(cfg.co).forEach(function (k) { state[k] = U.param(k, '') === '1'; });
      if (elQ) elQ.value = state.q;
      if (elSort && state.sort) elSort.value = state.sort;
      if (cfg.co) Object.keys(cfg.co).forEach(function (k) {
        var el = $(cfg.co[k], root);
        if (el) el.checked = !!state[k];
      });
    }

    function writeUrl(replace) {
      var o = { q: state.q, sort: state.sort === (cfg.sortMacDinh || '') ? '' : state.sort, trang: state.trang > 1 ? state.trang : '' };
      cfg.facets.forEach(function (f) { o[f.key] = state.mat[f.key]; });
      if (cfg.co) Object.keys(cfg.co).forEach(function (k) { o[k] = state[k] ? '1' : ''; });
      U.setParams(o, replace);
    }

    /* ---------------------------------------------------------------------
       Lọc
       --------------------------------------------------------------------- */
    function khopMat(rec, bo) {
      for (var i = 0; i < cfg.facets.length; i++) {
        var f = cfg.facets[i];
        if (f.key === bo) continue;
        var chon = state.mat[f.key];
        if (!chon.length) continue;
        var v = f.gia ? f.gia(rec) : rec[f.key];
        if (chon.indexOf(String(v)) < 0) return false;
      }
      return true;
    }

    function khopTim(rec) {
      if (!state.q || state.q.trim().length < 2) return true;
      var term = U.fold(state.q.trim());
      var words = term.split(/\s+/).filter(Boolean);
      var hay = U.fold(cfg.timTrong(rec));
      for (var i = 0; i < words.length; i++) if (hay.indexOf(words[i]) < 0) return false;
      return true;
    }

    function khopThem(rec) {
      if (!cfg.loc) return true;
      return cfg.loc(rec, state);
    }

    function locAll(bo) {
      return cfg.all().filter(function (r) {
        return khopTim(r) && khopThem(r) && khopMat(r, bo);
      });
    }

    /* ---------------------------------------------------------------------
       Dựng mặt lọc. Đếm trên tập đã lọc bởi các mặt khác.
       --------------------------------------------------------------------- */
    function renderFacets() {
      cfg.facets.forEach(function (f) {
        var box = $('[data-facet="' + f.key + '"]', root) || $('[data-facet-chips="' + f.key + '"]', root);
        if (!box) return;

        var tap = locAll(f.key);
        var m = new Map();
        tap.forEach(function (r) {
          var v = f.gia ? f.gia(r) : r[f.key];
          if (v == null || v === '') return;
          m.set(String(v), (m.get(String(v)) || 0) + 1);
        });

        /* Giá trị đang chọn phải luôn hiện, kể cả khi bộ đếm về 0, nếu không
           người dùng mất chỗ để bỏ chọn nó. */
        state.mat[f.key].forEach(function (v) { if (!m.has(v)) m.set(v, 0); });

        var muc = Array.from(m.entries()).map(function (e) { return { gia: e[0], so: e[1] }; });
        muc.sort(f.xep || function (a, b) {
          if (b.so !== a.so) return b.so - a.so;
          return a.gia.localeCompare(b.gia, 'vi');
        });
        if (f.toiDa) muc = muc.slice(0, f.toiDa);

        var chips = box.hasAttribute('data-facet-chips');
        box.innerHTML = muc.map(function (it) {
          var on = state.mat[f.key].indexOf(it.gia) >= 0;
          var nhan = f.nhan ? f.nhan(it.gia) : it.gia;
          if (chips) {
            return '<button class="chip" type="button" data-pick="' + U.esc(f.key) + '" data-val="' + U.esc(it.gia) + '"' +
              ' aria-pressed="' + on + '">' + U.esc(nhan) + '<span class="chip__count">' + it.so + '</span></button>';
          }
          return '<label class="fcheck"><input type="checkbox" data-pick="' + U.esc(f.key) + '" data-val="' + U.esc(it.gia) + '"' +
            (on ? ' checked' : '') + '> <span>' + U.esc(nhan) + '</span>' +
            '<span class="fcheck__count">' + it.so + '</span></label>';
        }).join('');
      });
    }

    /* ---------------------------------------------------------------------
       Chip của các bộ lọc đang bật, để bỏ nhanh từng cái
       --------------------------------------------------------------------- */
    function renderActive() {
      if (!elActive) return;
      var bits = [];
      cfg.facets.forEach(function (f) {
        state.mat[f.key].forEach(function (v) {
          var nhan = f.nhan ? f.nhan(v) : v;
          bits.push('<button class="chip is-on" type="button" data-drop="' + U.esc(f.key) + '" data-val="' + U.esc(v) + '">' +
            U.esc(nhan) + ' <i class="ph-light ph-x" aria-hidden="true"></i>' +
            '<span class="sr-only">Bỏ bộ lọc này</span></button>');
        });
      });
      if (state.q) {
        bits.push('<button class="chip is-on" type="button" data-drop="q">Từ khóa: ' + U.esc(state.q) +
          ' <i class="ph-light ph-x" aria-hidden="true"></i><span class="sr-only">Bỏ từ khóa</span></button>');
      }
      elActive.innerHTML = bits.join('');
    }

    /* ---------------------------------------------------------------------
       Vẽ kết quả
       --------------------------------------------------------------------- */
    function draw() {
      var items = locAll(null);
      var cmp = cfg.sorts[state.sort] || cfg.sorts[cfg.sortMacDinh];
      if (cmp) items = items.slice().sort(cmp);

      var size = cfg.moiTrang || 12;
      var tong = items.length;
      var soTrang = Math.max(1, Math.ceil(tong / size));
      if (state.trang > soTrang) state.trang = soTrang;
      var lat = items.slice((state.trang - 1) * size, state.trang * size);

      if (elCount) elCount.textContent = cfg.nhanDem ? cfg.nhanDem(tong) : (U.fmtNum(tong) + ' kết quả');

      if (!tong) {
        elList.innerHTML = '';
        elList.insertAdjacentHTML('beforeend', C.empty(
          cfg.rongTieuDe || 'Không có kết quả nào',
          cfg.rongNoiDung || 'Thử bỏ bớt một vài bộ lọc, hoặc tìm bằng từ khóa ngắn hơn.',
          cfg.rongIcon || 'funnel',
          '<button class="btn btn--ghost" type="button" data-clear>Bỏ hết bộ lọc</button>'
        ));
        elList.style.display = 'block';
      } else {
        elList.style.display = '';
        elList.innerHTML = lat.map(cfg.ve).join('');
      }

      renderPager(soTrang);
      renderActive();
      renderFacets();
    }

    function renderPager(soTrang) {
      if (!elPager) return;
      if (soTrang < 2) { elPager.innerHTML = ''; return; }
      var t = state.trang;
      var so = [];
      for (var i = 1; i <= soTrang; i++) {
        if (i === 1 || i === soTrang || Math.abs(i - t) <= 1) so.push(i);
        else if (so[so.length - 1] !== '...') so.push('...');
      }
      elPager.innerHTML =
        '<button class="pager__btn" type="button" data-page="' + (t - 1) + '"' + (t === 1 ? ' disabled' : '') +
        ' aria-label="Trang trước"><i class="ph-light ph-caret-left" aria-hidden="true"></i></button>' +
        so.map(function (n) {
          if (n === '...') return '<span class="pager__btn" aria-hidden="true" style="border:0">...</span>';
          return '<button class="pager__btn" type="button" data-page="' + n + '"' +
            (n === t ? ' aria-current="page"' : '') + '>' + n + '</button>';
        }).join('') +
        '<button class="pager__btn" type="button" data-page="' + (t + 1) + '"' + (t === soTrang ? ' disabled' : '') +
        ' aria-label="Trang sau"><i class="ph-light ph-caret-right" aria-hidden="true"></i></button>';
    }

    /* ---------------------------------------------------------------------
       Sự kiện
       --------------------------------------------------------------------- */
    function apply(resetTrang) {
      if (resetTrang !== false) state.trang = 1;
      writeUrl(false);
      draw();
    }

    document.addEventListener('click', function (ev) {
      var t = ev.target.closest('[data-pick],[data-drop],[data-page],[data-clear],[data-toggle-filters]');
      if (!t) return;

      if (t.hasAttribute('data-toggle-filters')) {
        if (shell) shell.classList.toggle('is-filters-open');
        return;
      }
      if (t.hasAttribute('data-clear')) {
        state.q = '';
        state.trang = 1;
        cfg.facets.forEach(function (f) { state.mat[f.key] = []; });
        if (cfg.co) Object.keys(cfg.co).forEach(function (k) {
          state[k] = false;
          var el = $(cfg.co[k], root);
          if (el) el.checked = false;
        });
        if (elQ) elQ.value = '';
        apply();
        return;
      }
      if (t.hasAttribute('data-page')) {
        var n = parseInt(t.dataset.page, 10);
        if (!n || t.disabled) return;
        state.trang = n;
        writeUrl(false);
        draw();
        window.scrollTo({ top: (elList.getBoundingClientRect().top + window.scrollY - 120), behavior: 'smooth' });
        return;
      }
      if (t.hasAttribute('data-drop')) {
        var k = t.dataset.drop;
        if (k === 'q') { state.q = ''; if (elQ) elQ.value = ''; }
        else state.mat[k] = state.mat[k].filter(function (v) { return v !== t.dataset.val; });
        apply();
        return;
      }
      if (t.hasAttribute('data-pick') && t.tagName === 'BUTTON') {
        toggle(t.dataset.pick, t.dataset.val);
      }
    });

    document.addEventListener('change', function (ev) {
      var el = ev.target;
      if (el.matches('input[data-pick]')) { toggle(el.dataset.pick, el.dataset.val); return; }
      if (elSort && el === elSort) { state.sort = el.value; apply(); return; }
      if (cfg.co) {
        Object.keys(cfg.co).forEach(function (k) {
          if (el.matches(cfg.co[k])) { state[k] = el.checked; apply(); }
        });
      }
    });

    function toggle(key, val) {
      var cur = state.mat[key];
      var i = cur.indexOf(val);
      if (i >= 0) cur.splice(i, 1); else cur.push(val);
      apply();
    }

    if (elQ) {
      var timer;
      elQ.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(function () { state.q = elQ.value; apply(); }, 200);
      });
    }

    window.addEventListener('popstate', function () { readUrl(); draw(); });

    /* Khung xương trong lúc dữ liệu chưa vẽ xong, hình dạng khớp kết quả thật. */
    if (elList && cfg.khung) elList.innerHTML = cfg.khung;

    readUrl();
    writeUrl(true);
    draw();

    return { draw: draw, state: state };
  }

  window.__LISTING = Listing;
})();
