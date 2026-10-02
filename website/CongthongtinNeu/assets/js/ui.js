/* ==========================================================================
   KHUNG DÙNG CHUNG

   Đầu trang và chân trang được dựng ở đây, nên mười sáu trang không phải mang
   mười sáu bản sao của cùng hai trăm dòng. Tiêu đề trang, mô tả, đường dẫn,
   thẻ h1 và phần nội dung chính vẫn nằm trong HTML, vì đó là những phần quan
   trọng với công cụ tìm kiếm và với người đọc khi JavaScript không chạy.
   ========================================================================== */

(function () {
  'use strict';

  var B = window.__BRAND;
  var S = window.__STORE;

  /* ------------------------------------------------------------------------
     Tiện ích nhỏ
     ------------------------------------------------------------------------ */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  var THANG = ['tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6',
               'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'];

  function fmtDate(v) {
    var d = new Date(v);
    if (isNaN(d)) return '';
    return d.getUTCDate() + ' ' + THANG[d.getUTCMonth()] + ', ' + d.getUTCFullYear();
  }
  function fmtDateShort(v) {
    var d = new Date(v);
    if (isNaN(d)) return '';
    return String(d.getUTCDate()).padStart(2, '0') + '.' + String(d.getUTCMonth() + 1).padStart(2, '0') + '.' + d.getUTCFullYear();
  }
  function fmtTime(v) {
    var d = new Date(v);
    if (isNaN(d)) return '';
    return String(d.getUTCHours()).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0');
  }
  function fmtNum(n) { return Number(n || 0).toLocaleString('vi-VN'); }
  function fmtMoney(n) { return n ? fmtNum(n) + ' đồng' : 'Miễn phí'; }

  function relDays(v) {
    var d = new Date(v);
    var diff = Math.round((d - new Date()) / 86400000);
    if (diff === 0) return 'hôm nay';
    if (diff === 1) return 'ngày mai';
    if (diff === -1) return 'hôm qua';
    if (diff > 0) return 'còn ' + diff + ' ngày';
    return Math.abs(diff) + ' ngày trước';
  }

  function param(name, fallback) {
    try {
      var v = new URLSearchParams(location.search).get(name);
      return v === null ? (fallback === undefined ? '' : fallback) : v;
    } catch (e) { return fallback === undefined ? '' : fallback; }
  }

  function setParams(obj, replace) {
    try {
      var u = new URL(location.href);
      Object.keys(obj).forEach(function (k) {
        var v = obj[k];
        if (v === '' || v == null || (Array.isArray(v) && !v.length)) u.searchParams.delete(k);
        else u.searchParams.set(k, Array.isArray(v) ? v.join(',') : v);
      });
      history[replace ? 'replaceState' : 'pushState']({}, '', u);
    } catch (e) {}
  }

  /* Bỏ dấu tiếng Việt, dùng cho tìm kiếm và sắp xếp. */
  function fold(s) {
    return String(s || '')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D')
      .toLowerCase();
  }

  function hash(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return Math.abs(h);
  }

  /* ------------------------------------------------------------------------
     Avatar chữ cái đầu

     Hồ sơ trong bản demo là người bịa. Gắn ảnh khuôn mặt một người thật vào
     một cái tên bịa là thông tin sai, nên avatar dựng từ chữ cái đầu và một
     màu suy ra từ chính cái tên, luôn ra cùng một màu cho cùng một người.
     ------------------------------------------------------------------------ */
  function initials(name) {
    var parts = String(name || '').trim().split(/\s+/);
    if (!parts[0]) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function avatarStyle(name) {
    var hue = hash(fold(name)) % 360;
    var dark = document.documentElement.getAttribute('data-theme') === 'dark' ||
      (!document.documentElement.getAttribute('data-theme') &&
       window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    return dark
      ? '--av-bg:hsl(' + hue + ' 32% 22%);--av-fg:hsl(' + hue + ' 62% 76%)'
      : '--av-bg:hsl(' + hue + ' 54% 93%);--av-fg:hsl(' + hue + ' 48% 32%)';
  }

  function avatar(name, cls) {
    return '<span class="avatar ' + (cls || '') + '" style="' + avatarStyle(name) + '" aria-hidden="true">' +
      esc(initials(name)) + '</span>';
  }

  function orgMark(name, cls) {
    var parts = String(name || '').trim().split(/\s+/).filter(function (w) {
      return ['công', 'ty', 'cp', 'tnhh', 'tmcp', 'tổng', 'tập', 'đoàn', 'viện', 'sở', 'quỹ', 'trường', 'nền', 'tảng'].indexOf(fold(w)) < 0;
    });
    var txt = parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : initials(name);
    return '<span class="orgmark ' + (cls || '') + '" aria-hidden="true">' + esc(txt) + '</span>';
  }

  /* ------------------------------------------------------------------------
     Ảnh dự phòng

     Ảnh minh họa lấy từ picsum theo hạt giống cố định. Khi máy không nối mạng,
     hoặc nguồn ảnh hỏng, trang không được để lại ô vỡ. Hàm dưới dựng một hình
     hình học theo màu thương hiệu, suy ra từ chính hạt giống, nên mỗi mục vẫn
     có một hình riêng và trang vẫn đọc được khi ngoại tuyến.
     ------------------------------------------------------------------------ */
  function artSvg(seed, w, h) {
    var n = hash(String(seed));
    var hue = 202;                        /* giữ trong dải màu NEU */
    var a = 'hsl(' + hue + ' 72% ' + (26 + (n % 12)) + '%)';
    var b = 'hsl(' + (hue + 14) + ' 58% ' + (44 + ((n >> 3) % 16)) + '%)';
    var c = 'hsl(' + (hue - 10) + ' 46% ' + (66 + ((n >> 6) % 12)) + '%)';
    var x1 = 12 + (n % 40), x2 = 48 + ((n >> 4) % 38);
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 100 100" preserveAspectRatio="none">' +
      '<rect width="100" height="100" fill="' + a + '"/>' +
      '<path d="M0 100 L' + x1 + ' 0 L' + (x1 + 26) + ' 0 L' + (x1 - 8) + ' 100 Z" fill="' + b + '" opacity=".85"/>' +
      '<path d="M' + x2 + ' 100 L' + (x2 + 30) + ' 0 L100 0 L100 100 Z" fill="' + c + '" opacity=".55"/>' +
      '<circle cx="' + (70 + (n % 18)) + '" cy="' + (22 + ((n >> 2) % 20)) + '" r="' + (7 + (n % 8)) + '" fill="#ffffff" opacity=".14"/>' +
      '</svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  /* Gắn một lần cho cả trang, ở giai đoạn bắt (capture) vì sự kiện error của
     <img> không nổi bọt lên. */
  document.addEventListener('error', function (ev) {
    var el = ev.target;
    if (!el || el.tagName !== 'IMG' || el.dataset.fallbackDone) return;
    el.dataset.fallbackDone = '1';
    el.removeAttribute('srcset');
    el.src = artSvg(el.dataset.seed || el.alt || el.src, el.width || 800, el.height || 500);
  }, true);

  /* ------------------------------------------------------------------------
     Toast
     ------------------------------------------------------------------------ */
  function toast(msg, kind) {
    var box = $('.toasts');
    if (!box) {
      box = document.createElement('div');
      box.className = 'toasts';
      box.setAttribute('role', 'status');
      box.setAttribute('aria-live', 'polite');
      document.body.appendChild(box);
    }
    var t = document.createElement('div');
    t.className = 'toast' + (kind ? ' toast--' + kind : '');
    t.textContent = msg;
    box.appendChild(t);
    setTimeout(function () {
      t.classList.add('is-out');
      setTimeout(function () { t.remove(); }, 260);
    }, 3600);
  }

  /* ------------------------------------------------------------------------
     Bẫy tiêu điểm cho ngăn kéo, hộp thoại và đèn chiếu ảnh

     Mở ra thì tiêu điểm vào trong, Tab không thoát ra ngoài, Escape đóng lại,
     và tiêu điểm quay về đúng phần tử vừa rời đi.
     ------------------------------------------------------------------------ */
  var FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  var trapStack = [];

  function trapFocus(el, onClose) {
    var prev = document.activeElement;
    function onKey(ev) {
      if (ev.key === 'Escape') { ev.preventDefault(); release(); if (onClose) onClose(); return; }
      if (ev.key !== 'Tab') return;
      var items = $$(FOCUSABLE, el).filter(function (n) { return !n.closest('[hidden], .hide'); });
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
      else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
    }
    function release() {
      document.removeEventListener('keydown', onKey, true);
      trapStack = trapStack.filter(function (t) { return t.el !== el; });
      if (prev && prev.focus) prev.focus();
    }
    document.addEventListener('keydown', onKey, true);
    trapStack.push({ el: el, release: release });
    var target = $(FOCUSABLE, el);
    if (target) target.focus();
    return release;
  }

  /* ------------------------------------------------------------------------
     Dựng đầu trang
     ------------------------------------------------------------------------ */
  /* Logo lockup. Một định nghĩa dùng cho đầu trang, chân trang, thanh bên CMS
     và màn đăng nhập quản trị, nên đổi nhận diện là đổi ở đúng một chỗ. */
  function brandBlock(opts) {
    var o = opts || {};
    return '<a class="brand' + (o.onDark ? ' brand--onDark' : '') + (o.sm ? ' brand--sm' : '') + '"' +
      ' href="' + (o.href || 'index.html') + '"' +
      ' aria-label="' + esc(B.ten + ', ' + B.truong) + '">' +
      '<span class="brand__mark" aria-hidden="true">' + esc(B.vietTat) + '</span>' +
      '<span class="brand__text">' +
      '<span class="brand__name">' + esc(o.ten || B.ten) + '</span>' +
      '<span class="brand__sub">' + esc(o.sub || B.truong) + '</span>' +
      '</span></a>';
  }

  function currentPage() {
    var f = location.pathname.split('/').pop();
    return f || 'index.html';
  }

  /* ------------------------------------------------------------------------
     Đầu trang

     Bốn tầng, đúng thứ tự của trang thật:
       dải banner đối tác, cặp nút tài khoản, thanh điều hướng xanh, dải tiêu đề.
     ------------------------------------------------------------------------ */
  function renderHeader() {
    var slot = $('[data-header]');
    if (!slot) return;
    var here = currentPage();
    var sess = S.getSession();

    /* Một mục được đánh dấu là trang hiện tại nếu chính nó, hoặc một mục con
       của nó, trỏ tới trang đang mở. */
    function dangO(m) {
      if (m.href.split('?')[0].split('#')[0] === here) return true;
      return (m.sub || []).some(function (x) { return x.href.split('?')[0].split('#')[0] === here; });
    }

    /* Banner đầu tiên tải ngay vì nó nằm trên nếp gấp; hai cái sau để lười,
       vì ảnh banner của trang gốc khá nặng. */
    var banner = B.banner.map(function (b, i) {
      return '<a href="' + b.href + '">' +
        '<img src="' + esc(b.src || artSvg(b.seed, 440, 120)) + '" alt="' + esc(b.alt) + '" ' +
        'data-seed="' + esc(b.seed) + '" width="440" height="120" decoding="async"' +
        (i === 0 ? ' fetchpriority="high"' : ' loading="lazy"') + '>' +
        '</a>';
    }).join('');

    var muc = B.menu.filter(function (m) { return !m.icon; }).map(function (m) {
      var on = dangO(m);
      var sub = (m.sub || []).map(function (x) {
        return '<li><a href="' + x.href + '">' + esc(x.nhan) + '</a></li>';
      }).join('');
      return '<li class="nav__item">' +
        '<a class="nav__link" href="' + m.href + '"' + (on ? ' aria-current="page"' : '') + '>' +
        esc(m.nhan) +
        (sub ? '<i class="ph-light ph-caret-down nav__caret" aria-hidden="true"></i>' : '') +
        '</a>' +
        (sub ? '<ul class="nav__sub">' + sub + '</ul>' : '') +
        '</li>';
    }).join('');

    var mnav = B.menu.map(function (m) {
      var on = dangO(m);
      return '<a class="mnav__link" href="' + m.href + '"' + (on ? ' aria-current="page"' : '') + '>' + esc(m.nhan) + '</a>' +
        (m.sub || []).map(function (x) {
          return '<a class="mnav__sub" href="' + x.href + '">' + esc(x.nhan) + '</a>';
        }).join('');
    }).join('');

    slot.outerHTML =
      '<div class="demobar"><div class="container demobar__inner">' +
      '<strong>BẢN DEMO</strong><span>Toàn bộ hồ sơ, doanh nghiệp và số liệu trên trang này là dữ liệu mẫu do máy sinh ra.</span>' +
      '</div></div>' +

      '<div class="topbanner"><div class="container topbanner__inner">' + banner + '</div></div>' +

      '<div class="masthead"><div class="container masthead__inner">' +
      brandBlock() +
      '<div class="masthead__actions">' +
      (sess
        ? '<a class="authbtn authbtn--login" href="tai-khoan.html">' +
          '<i class="ph-light ph-user-circle" aria-hidden="true"></i>' + esc(sess.ten) + '</a>' +
          '<a class="authbtn authbtn--register" href="dang-ky.html">Hồ sơ của tôi</a>'
        : '<a class="authbtn authbtn--register" href="dang-ky.html">Đăng ký thành viên</a>' +
          '<a class="authbtn authbtn--login" href="tai-khoan.html">Đăng nhập</a>') +
      '</div></div></div>' +

      '<header class="header" id="top"><div class="container">' +
      '<nav class="nav" aria-label="Điều hướng chính">' +
      '<a class="nav__home" href="index.html" aria-label="Trang chủ"><i class="ph-light ph-house" aria-hidden="true"></i></a>' +
      '<ul class="nav__list">' + muc + '</ul>' +
      '<div class="nav__tools">' +
      '<button class="iconbtn" type="button" data-open-search aria-label="Tìm kiếm toàn trang" title="Tìm kiếm (phím /)"><i class="ph-light ph-magnifying-glass" aria-hidden="true"></i></button>' +
      '<button class="iconbtn" type="button" data-toggle-theme aria-label="Đổi chế độ sáng tối"><i class="ph-light ph-circle-half" aria-hidden="true"></i></button>' +
      '<button class="burger" type="button" data-open-nav aria-expanded="false" aria-controls="mobilenav" aria-label="Mở menu"><span></span></button>' +
      '</div></nav></div></header>' +

      '<div class="ribbon"><div class="container ribbon__inner">' +
      '<a href="' + B.ribbon.href + '">' + esc(B.ribbon.nhan) + '</a>' +
      '</div></div>' +

      '<div class="scrim" data-scrim></div>' +
      '<div class="drawer drawer--left" id="mobilenav" role="dialog" aria-modal="true" aria-label="Điều hướng" hidden>' +
      '<div class="drawer__head"><span class="drawer__title">Chuyên mục</span>' +
      '<button class="iconbtn" type="button" data-close-nav aria-label="Đóng menu"><i class="ph-light ph-x" aria-hidden="true"></i></button></div>' +
      '<div class="drawer__body" style="padding:0"><nav class="mnav__list" aria-label="Điều hướng phụ">' + mnav + '</nav></div>' +
      '<div class="drawer__foot"><a class="btn btn--primary btn--block" href="dang-ky.html">Đăng ký thành viên</a></div>' +
      '</div>' +

      '<div class="searchlayer" data-searchlayer role="dialog" aria-modal="true" aria-label="Tìm kiếm toàn trang">' +
      '<div class="container"><div class="searchlayer__panel">' +
      '<form class="searchlayer__form" action="tim-kiem.html" method="get" role="search">' +
      '<div class="searchbox">' +
      '<i class="ph-light ph-magnifying-glass searchbox__icon" aria-hidden="true"></i>' +
      '<label class="sr-only" for="sitesearch">Từ khóa tìm kiếm</label>' +
      '<input class="input" id="sitesearch" name="q" type="search" autocomplete="off" placeholder="Tên người, bài viết, sự kiện, việc làm">' +
      '</div>' +
      '<button class="btn btn--primary" type="submit">Tìm</button>' +
      '</form>' +
      '<div class="searchlayer__results" data-searchresults></div>' +
      '<p class="searchlayer__hint">Gõ ít nhất hai ký tự. Nhấn Escape để đóng.</p>' +
      '</div></div></div>';
  }

  /* ------------------------------------------------------------------------
     Chân trang
     ------------------------------------------------------------------------ */
  function renderFooter() {
    var slot = $('[data-footer]');
    if (!slot) return;

    var cols = B.chanTrang.map(function (c) {
      return '<div class="footer__col"><h2 class="footer__h">' + esc(c.tieuDe) + '</h2>' +
        '<ul class="footer__list">' +
        c.muc.map(function (m) { return '<li><a href="' + m.href + '">' + esc(m.nhan) + '</a></li>'; }).join('') +
        '</ul></div>';
    }).join('');

    slot.outerHTML =
      '<footer class="footer"><div class="container">' +
      '<div class="footer__top">' +
      '<div class="footer__about">' +
      brandBlock({ onDark: true }) +
      '<p>' + esc(B.moTa) + '</p>' +
      '<p style="color:var(--on-dark-faint)">' + esc(B.diaChi) + '<br>' +
      esc(B.email) + ' &middot; ' + esc(B.dienThoai) + '</p>' +
      '</div>' + cols +
      '</div>' +
      '<div class="footer__bottom">' +
      '<span>Bản dựng demo. Dữ liệu là dữ liệu mẫu, không phải hồ sơ thật.</span>' +
      '<nav class="footer__legal" aria-label="Liên kết pháp lý">' +
      '<a href="tim-kiem.html">Tìm kiếm</a>' +
      '<a href="dong-gop.html">Gửi nội dung</a>' +
      '<a href="admin.html">Quản trị</a>' +
      '</nav>' +
      '</div>' +
      '</div></footer>' +
      '<button class="totop" type="button" data-totop aria-label="Lên đầu trang"><i class="ph-light ph-arrow-up" aria-hidden="true"></i></button>';
  }

  /* ------------------------------------------------------------------------
     Gắn hành vi
     ------------------------------------------------------------------------ */
  function wire() {
    var header = $('.header');
    var scrim = $('[data-scrim]');
    var nav = $('#mobilenav');
    var layer = $('[data-searchlayer]');
    var releaseNav = null, releaseSearch = null;

    /* Đầu trang thu lại khi cuộn. Dùng IntersectionObserver trên một mốc
       thay vì nghe sự kiện scroll, vì scroll chạy mỗi khung hình. */
    if (header) {
      var sentinel = document.createElement('div');
      sentinel.setAttribute('aria-hidden', 'true');
      sentinel.style.cssText = 'position:absolute;top:0;height:1px;width:1px';
      document.body.prepend(sentinel);
      new IntersectionObserver(function (es) {
        header.classList.toggle('is-stuck', !es[0].isIntersecting);
        var top = $('[data-totop]');
        if (top) top.classList.toggle('is-on', !es[0].isIntersecting);
      }, { rootMargin: '-120px 0px 0px 0px' }).observe(sentinel);
    }

    function closeNav() {
      if (!nav) return;
      nav.classList.remove('is-open');
      scrim.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      var b = $('[data-open-nav]');
      if (b) b.setAttribute('aria-expanded', 'false');
      setTimeout(function () { nav.hidden = true; }, 240);
      if (releaseNav) { releaseNav(); releaseNav = null; }
    }

    function openNav() {
      if (!nav) return;
      nav.hidden = false;
      requestAnimationFrame(function () { nav.classList.add('is-open'); });
      scrim.classList.add('is-open');
      document.body.classList.add('is-locked');
      $('[data-open-nav]').setAttribute('aria-expanded', 'true');
      releaseNav = trapFocus(nav, closeNav);
    }

    function closeSearch() {
      if (!layer) return;
      layer.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      if (releaseSearch) { releaseSearch(); releaseSearch = null; }
    }

    function openSearch() {
      if (!layer) return;
      layer.classList.add('is-open');
      document.body.classList.add('is-locked');
      releaseSearch = trapFocus(layer, closeSearch);
      var f = $('#sitesearch');
      if (f) { f.value = ''; f.focus(); renderQuick(''); }
    }

    document.addEventListener('click', function (ev) {
      var t = ev.target.closest('[data-open-nav],[data-close-nav],[data-open-search],[data-scrim],[data-toggle-theme],[data-totop]');
      if (!t) return;
      if (t.hasAttribute('data-open-nav')) { ev.preventDefault(); nav.classList.contains('is-open') ? closeNav() : openNav(); }
      else if (t.hasAttribute('data-close-nav') || t.hasAttribute('data-scrim')) { closeNav(); }
      else if (t.hasAttribute('data-open-search')) { ev.preventDefault(); openSearch(); }
      else if (t.hasAttribute('data-toggle-theme')) { cycleTheme(); }
      else if (t.hasAttribute('data-totop')) { window.scrollTo({ top: 0, behavior: 'smooth' }); }
    });

    if (layer) {
      layer.addEventListener('click', function (ev) { if (ev.target === layer) closeSearch(); });
    }

    /* Phím / mở tìm kiếm, trừ khi đang gõ trong một ô nhập. */
    document.addEventListener('keydown', function (ev) {
      if (ev.key !== '/' || ev.metaKey || ev.ctrlKey) return;
      var tag = (document.activeElement && document.activeElement.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      ev.preventDefault();
      openSearch();
    });

    /* Gợi ý tức thời trong lớp tìm kiếm */
    var box = $('#sitesearch');
    var out = $('[data-searchresults]');
    if (box && out) {
      var timer;
      box.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(function () { renderQuick(box.value); }, 120);
      });
    }

    function renderQuick(q) {
      if (!out) return;
      if (!window.__SEARCH) { out.innerHTML = ''; return; }
      var term = String(q || '').trim();
      if (term.length < 2) {
        out.innerHTML = '';
        return;
      }
      var hits = window.__SEARCH.query(term).slice(0, 7);
      if (!hits.length) {
        out.innerHTML = '<p class="searchlayer__hint" style="border-top:0">Không có kết quả nào cho "' + esc(term) + '".</p>';
        return;
      }
      out.innerHTML = hits.map(function (h) {
        return '<a class="sresult" href="' + h.href + '">' +
          '<span class="sresult__kind">' + esc(h.nhanLoai) + '</span>' +
          '<span><span class="sresult__title">' + esc(h.tieude) + '</span>' +
          '<span class="sresult__sub">' + esc(h.phu) + '</span></span></a>';
      }).join('');
    }
  }

  function cycleTheme() {
    var order = ['auto', 'light', 'dark'];
    var next = order[(order.indexOf(S.getTheme()) + 1) % 3];
    S.setTheme(next);
    toast(next === 'auto' ? 'Chế độ hiển thị: theo hệ thống'
      : next === 'light' ? 'Chế độ hiển thị: sáng' : 'Chế độ hiển thị: tối');
    /* Avatar lấy màu theo chủ đề, nên vẽ lại chúng. */
    $$('.avatar[data-name]').forEach(function (el) { el.setAttribute('style', avatarStyle(el.dataset.name)); });
  }

  /* ------------------------------------------------------------------------
     Hiện dần khi cuộn. Một lần, nhẹ, và tắt khi người dùng yêu cầu ít chuyển động.
     ------------------------------------------------------------------------ */
  function reveal() {
    if (!window.IntersectionObserver) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------------
     Xác thực biểu mẫu

     Nhãn trên ô nhập, lỗi dưới ô nhập, và thông báo được nối bằng
     aria-describedby để trình đọc màn hình đọc đúng lỗi của đúng trường.
     ------------------------------------------------------------------------ */
  function fieldError(input, msg) {
    var field = input.closest('.field');
    if (!field) return;
    var err = $('.field__error', field);
    if (!err) {
      err = document.createElement('p');
      err.className = 'field__error';
      err.id = (input.id || 'f' + hash(input.name || 'x')) + '-err';
      field.appendChild(err);
    }
    if (msg) {
      field.classList.add('has-error');
      err.textContent = msg;
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', err.id);
    } else {
      field.classList.remove('has-error');
      err.textContent = '';
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
    }
  }

  function validate(form) {
    var ok = true, firstBad = null;
    $$('[data-rule]', form).forEach(function (el) {
      /* Trường của một bước chưa mở thì không kiểm. Dò bằng thuộc tính và lớp
         chứ không bằng offsetParent: offsetParent phụ thuộc vào việc đã có bố
         cục hay chưa, nên nó trả về null cả trong trường hợp trường vẫn hiện. */
      if (el.disabled || el.hidden || el.closest('[hidden], .hide')) { fieldError(el, ''); return; }
      var v = String(el.value || '').trim();
      var rules = el.dataset.rule.split('|');
      var msg = '';
      rules.forEach(function (r) {
        if (msg) return;
        if (r === 'required' && !v) msg = 'Vui lòng điền trường này.';
        else if (r === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = 'Địa chỉ email chưa đúng định dạng.';
        else if (r === 'phone' && v && !/^[0-9+\s().-]{8,}$/.test(v)) msg = 'Số điện thoại chưa đúng định dạng.';
        else if (r === 'year' && v && !/^(19|20)[0-9]{2}$/.test(v)) msg = 'Nhập năm gồm bốn chữ số.';
        else if (r.indexOf('min:') === 0 && v.length < Number(r.slice(4))) msg = 'Cần ít nhất ' + r.slice(4) + ' ký tự.';
      });
      fieldError(el, msg);
      if (msg) { ok = false; if (!firstBad) firstBad = el; }
    });
    if (firstBad) firstBad.focus();
    return ok;
  }

  /* Xóa lỗi ngay khi người dùng bắt đầu sửa, thay vì bắt họ bấm gửi lại. */
  document.addEventListener('input', function (ev) {
    var el = ev.target;
    if (el.dataset && el.dataset.rule && el.closest('.field.has-error')) fieldError(el, '');
  });

  /* ------------------------------------------------------------------------
     Khởi động
     ------------------------------------------------------------------------ */
  function boot() {
    renderHeader();
    renderFooter();
    wire();
    reveal();
  }

  window.__UI = {
    $: $, $$: $$, esc: esc, fold: fold, hash: hash,
    fmtDate: fmtDate, fmtDateShort: fmtDateShort, fmtTime: fmtTime,
    fmtNum: fmtNum, fmtMoney: fmtMoney, relDays: relDays,
    param: param, setParams: setParams,
    initials: initials, avatar: avatar, avatarStyle: avatarStyle, orgMark: orgMark,
    artSvg: artSvg, toast: toast, trapFocus: trapFocus,
    validate: validate, fieldError: fieldError, reveal: reveal,
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
