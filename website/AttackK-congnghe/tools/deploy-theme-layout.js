const { init, call } = require('./mcp');

async function main() {
  await init();

  const layoutContent = `<!doctype html>
<html lang="{{ request.locale.iso_code }}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>
    {%- if page_title and page_title != blank -%}
      {{ page_title }} — HADAL Peripherals
    {%- elsif request.locale.iso_code == 'en' -%}
      HADAL Peripherals — Precision Gaming Mice & Keyboards
    {%- else -%}
      HADAL Peripherals — Chuột và bàn phím chơi game độ chính xác cao
    {%- endif -%}
  </title>
  <meta name="description" content="{{ page_description | default: shop.description }}">
  
  {{ content_for_header }}

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/light/style.css">

  <link rel="stylesheet" href="/assets/theme.css">
  <link rel="stylesheet" href="/assets/theme-skin.css">
  <link rel="stylesheet" href="/assets/tailwind.css">

  <script>
    /* Prevent theme flash */
    (function () {
      try {
        var t = JSON.parse(localStorage.getItem('as.theme'));
        if (t) document.documentElement.setAttribute('data-theme', t);
      } catch (e) {}
    })();
  </script>

  <style id="theme-settings-vars">:root{
    --accent:{{ settings.color_accent | default: '#6073f2' }};
    --accent-ink:#05060f;
    --accent-soft:#171c33;
    --ink:#f5f5f7;
    --ink-2:#c9c9d2;
    --mute:#a6a6b0;
    --mute-2:#74747f;
    --paper:#000000;
    --cream:#0b0b0d;
    --cream-2:#131317;
    --white:#ffffff;
    --line:#1f1f26;
    --line-2:#2b2b33;
    --sale:#ff6b6b;
    --font-display:var(--font-primary);
    --font-sans:var(--font-primary);
    --font-serif:var(--font-primary);
    --font-mono:"JetBrains Mono",ui-monospace,monospace;
    --section-y:96px;
    --gutter:24px;
    --radius:8px;
    --radius-sm:6px;
    --radius-lg:14px;
    --radius-pill:999px;
    --sh-1:0 1px 2px rgba(0,0,0,.6);
    --sh-2:0 8px 24px rgba(0,0,0,.55);
    --sh-3:0 16px 48px rgba(0,0,0,.6);
  }</style>
</head>
<body data-store-slug="{{ shop.permanent_domain | default: 'hadal-peripherals' }}" data-currency-code="{{ cart.currency.iso_code | default: 'VND' }}">
  {% section 'announcement-bar' %}
  {% section 'header' %}

  <main id="main">
    {{ content_for_layout }}
  </main>

  {% section 'footer' %}

  <!-- OVERLAYS & DRAWERS -->
  <div class="backdrop" data-backdrop></div>

  <!-- Search Modal -->
  <div class="searchbox" data-searchbox role="dialog" aria-modal="true" aria-label="{% if request.locale.iso_code == 'en' %}Search hardware{% else %}Tìm kiếm thiết bị{% endif %}">
    <div class="wrap searchbox__inner">
      <div class="searchbox__field">
        <span class="searchbox__icon"><i class="ph-light ph-magnifying-glass" aria-hidden="true"></i></span>
        <label class="visually-hidden" for="search-modal-input">{% if request.locale.iso_code == 'en' %}Search{% else %}Tìm kiếm{% endif %}</label>
        <input class="searchbox__input" id="search-modal-input" type="search" placeholder="{% if request.locale.iso_code == 'en' %}Search mice, keyboards, accessories...{% else %}Tìm chuột, bàn phím, phụ kiện...{% endif %}" autocomplete="off" data-search-input>
        <button type="button" class="icon-btn" data-close-search aria-label="{% if request.locale.iso_code == 'en' %}Close search{% else %}Đóng tìm kiếm{% endif %}"><i class="ph-light ph-x" aria-hidden="true"></i></button>
      </div>
      <div class="searchbox__suggest">
        <span class="dim text-sm">{% if request.locale.iso_code == 'en' %}Popular searches:{% else %}Tìm kiếm phổ biến:{% endif %}</span>
        <button type="button" class="chip" data-suggest="8K polling">8K polling</button>
        <button type="button" class="chip" data-suggest="carbon fiber">carbon fiber</button>
        <button type="button" class="chip" data-suggest="rapid trigger">rapid trigger</button>
        <button type="button" class="chip" data-suggest="PAW3950MAX">PAW3950MAX</button>
        <button type="button" class="chip" data-suggest="39g">39g</button>
        <button type="button" class="chip" data-suggest="glass pad">glass pad</button>
      </div>
      <div class="searchbox__results" data-search-results aria-live="polite"></div>
    </div>
  </div>

  <!-- Mobile Drawer -->
  <aside class="drawer drawer--left" data-drawer="mobilenav" id="mobilenav" role="dialog" aria-modal="true" aria-label="{% if request.locale.iso_code == 'en' %}Navigation menu{% else %}Danh mục điều hướng{% endif %}">
    <div class="drawer__head">
      <p class="drawer__title">{% if request.locale.iso_code == 'en' %}Catalog{% else %}Danh mục thiết bị{% endif %}</p>
      <button type="button" class="icon-btn" data-close-drawer aria-label="{% if request.locale.iso_code == 'en' %}Close menu{% else %}Đóng menu{% endif %}"><i class="ph-light ph-x" aria-hidden="true"></i></button>
    </div>
    <div class="drawer__body">
      <div class="mobilenav__group">
        <button type="button" class="mobilenav__toggle" aria-expanded="true" aria-controls="mnav-0">
          {% if request.locale.iso_code == 'en' %}Gaming Mice{% else %}Chuột chơi game{% endif %} <i class="ph-light ph-plus" aria-hidden="true"></i>
        </button>
        <div class="mobilenav__panel" id="mnav-0">
          <div class="mobilenav__links">
            <a href="/collections/chuot-choi-game">{% if request.locale.iso_code == 'en' %}All Gaming Mice{% else %}Tất cả chuột{% endif %}</a>
            <a href="/collections/chuot-choi-game">{% if request.locale.iso_code == 'en' %}Tri-mode Wireless{% else %}Tri-mode không dây{% endif %}</a>
            <a href="/collections/chuot-choi-game">{% if request.locale.iso_code == 'en' %}8000Hz Polling{% else %}Polling 8000Hz{% endif %}</a>
            <a href="/collections/chuot-choi-game">{% if request.locale.iso_code == 'en' %}Under 50g Ultralight{% else %}Dưới 50g siêu nhẹ{% endif %}</a>
          </div>
        </div>
      </div>

      <div class="mobilenav__group">
        <button type="button" class="mobilenav__toggle" aria-expanded="false" aria-controls="mnav-1">
          {% if request.locale.iso_code == 'en' %}Keyboards{% else %}Bàn phím{% endif %} <i class="ph-light ph-plus" aria-hidden="true"></i>
        </button>
        <div class="mobilenav__panel" id="mnav-1">
          <div class="mobilenav__links">
            <a href="/collections/ban-phim-co">{% if request.locale.iso_code == 'en' %}Mechanical Keyboards{% else %}Bàn phím cơ{% endif %}</a>
            <a href="/collections/ban-phim-he">{% if request.locale.iso_code == 'en' %}Magnetic HE Keyboards{% else %}Bàn phím từ tính HE{% endif %}</a>
            <a href="/collections/keycap">{% if request.locale.iso_code == 'en' %}Keycaps PBT{% else %}Keycaps PBT{% endif %}</a>
            <a href="/collections/switch">{% if request.locale.iso_code == 'en' %}Switches{% else %}Switches cơ & từ tính{% endif %}</a>
          </div>
        </div>
      </div>

      <div class="mobilenav__group">
        <button type="button" class="mobilenav__toggle" aria-expanded="false" aria-controls="mnav-2">
          {% if request.locale.iso_code == 'en' %}Audio & Surfaces{% else %}Âm thanh & Lót chuột{% endif %} <i class="ph-light ph-plus" aria-hidden="true"></i>
        </button>
        <div class="mobilenav__panel" id="mnav-2">
          <div class="mobilenav__links">
            <a href="/collections/tai-nghe">{% if request.locale.iso_code == 'en' %}Headsets{% else %}Tai nghe gaming{% endif %}</a>
            <a href="/collections/lot-chuot">{% if request.locale.iso_code == 'en' %}Mousepads{% else %}Lót chuột chuyên dụng{% endif %}</a>
          </div>
        </div>
      </div>

      <div class="mobilenav__group">
        <button type="button" class="mobilenav__toggle" aria-expanded="false" aria-controls="mnav-3">
          {% if request.locale.iso_code == 'en' %}Accessories{% else %}Phụ kiện & Combo{% endif %} <i class="ph-light ph-plus" aria-hidden="true"></i>
        </button>
        <div class="mobilenav__panel" id="mnav-3">
          <div class="mobilenav__links">
            <a href="/collections/cap-xoan">{% if request.locale.iso_code == 'en' %}Coiled Cables{% else %}Cáp xoắn phi công{% endif %}</a>
            <a href="/collections/ke-tay">{% if request.locale.iso_code == 'en' %}Wrist Rests & Grip{% else %}Kê tay & Grip tape{% endif %}</a>
            <a href="/collections/combo">{% if request.locale.iso_code == 'en' %}Bundles{% else %}Combo trọn bộ{% endif %}</a>
          </div>
        </div>
      </div>

      <div class="mobilenav__group">
        <a class="mobilenav__toggle" href="/collections/hang-moi">
          {% if request.locale.iso_code == 'en' %}New In{% else %}Mới về{% endif %} <i class="ph-light ph-arrow-right" aria-hidden="true"></i>
        </a>
      </div>
      <div class="mobilenav__group">
        <a class="mobilenav__toggle" href="/collections/giam-gia">
          {% if request.locale.iso_code == 'en' %}On Sale{% else %}Giảm giá{% endif %} <i class="ph-light ph-arrow-right" aria-hidden="true"></i>
        </a>
      </div>
      <div class="mobilenav__group">
        <a class="mobilenav__toggle" href="/blogs/news">
          {% if request.locale.iso_code == 'en' %}Journal{% else %}Bài viết{% endif %} <i class="ph-light ph-arrow-right" aria-hidden="true"></i>
        </a>
      </div>
      <div class="mobilenav__group">
        <a class="mobilenav__toggle" href="/pages/support">
          {% if request.locale.iso_code == 'en' %}Support{% else %}Hỗ trợ{% endif %} <i class="ph-light ph-arrow-right" aria-hidden="true"></i>
        </a>
      </div>

      <div class="stack stack-4" style="padding-block-start:var(--space-8)">
        <a class="btn btn--secondary btn--block" href="/account"><i class="ph-light ph-user" aria-hidden="true"></i> {% if request.locale.iso_code == 'en' %}Account{% else %}Tài khoản{% endif %}</a>
        <a class="btn btn--secondary btn--block" href="/pages/support"><i class="ph-light ph-lifebuoy" aria-hidden="true"></i> {% if request.locale.iso_code == 'en' %}Support{% else %}Hỗ trợ kỹ thuật{% endif %}</a>
      </div>
    </div>
  </aside>

  <button type="button" class="totop" data-totop aria-label="{% if request.locale.iso_code == 'en' %}Back to top{% else %}Về đầu trang{% endif %}">
    <i class="ph-light ph-arrow-up" aria-hidden="true"></i>
  </button>
  <div class="grain" aria-hidden="true"></div>

  <script src="/assets/theme.js" defer></script>
  <script>
    /* ========================================================================
       HADAL STOREFRONT CONTROLLER
       Interactive behaviors for Header, Hero, Mega-menu, Tabs, Drawer, and i18n
       ======================================================================== */
    document.addEventListener('DOMContentLoaded', function() {
      // 1. Sticky Header
      var header = document.querySelector('.header');
      if (header) {
        window.addEventListener('scroll', function() {
          if (window.scrollY > 30) {
            header.classList.add('is-stuck');
          } else {
            header.classList.remove('is-stuck');
          }
        }, { passive: true });
      }

      // 2. Mega Menu Toggle
      var catBtn = document.querySelector('.catbtn.js-mega');
      var megaPanel = document.querySelector('#mega-catalog');
      if (catBtn && megaPanel) {
        catBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          var isOpen = catBtn.getAttribute('aria-expanded') === 'true';
          catBtn.setAttribute('aria-expanded', !isOpen);
          megaPanel.classList.toggle('is-open', !isOpen);
        });

        document.addEventListener('click', function(e) {
          if (!megaPanel.contains(e.target) && !catBtn.contains(e.target)) {
            catBtn.setAttribute('aria-expanded', 'false');
            megaPanel.classList.remove('is-open');
          }
        });

        document.addEventListener('keydown', function(e) {
          if (e.key === 'Escape') {
            catBtn.setAttribute('aria-expanded', 'false');
            megaPanel.classList.remove('is-open');
          }
        });
      }

      // 3. Announcement Ticker
      var announceItems = document.querySelectorAll('.announce__item');
      var annPrev = document.querySelector('[data-announce-prev]');
      var annNext = document.querySelector('[data-announce-next]');
      if (announceItems.length > 1) {
        var annIndex = 0;
        var annTimer = null;
        function showAnn(n) {
          annIndex = (n + announceItems.length) % announceItems.length;
          announceItems.forEach(function(item, idx) {
            item.classList.toggle('is-current', idx === annIndex);
            item.classList.toggle('is-prev', idx === (annIndex - 1 + announceItems.length) % announceItems.length);
          });
        }
        function startAnn() {
          stopAnn();
          annTimer = setInterval(function() { showAnn(annIndex + 1); }, 5500);
        }
        function stopAnn() {
          if (annTimer) clearInterval(annTimer);
        }
        if (annPrev) annPrev.addEventListener('click', function() { showAnn(annIndex - 1); startAnn(); });
        if (annNext) annNext.addEventListener('click', function() { showAnn(annIndex + 1); startAnn(); });
        startAnn();
      }

      // 4. Hero Carousel
      var hero = document.querySelector('[data-hero]');
      if (hero) {
        var copies = hero.querySelectorAll('.hero__copy');
        var stages = hero.querySelectorAll('.hero__stage');
        var nums = hero.querySelectorAll('.hero__num');
        if (copies.length > 1) {
          var hIndex = 0;
          var hTimer = null;
          function setHeroSlide(idx) {
            hIndex = (idx + copies.length) % copies.length;
            copies.forEach(function(c, i) { c.classList.toggle('is-current', i === hIndex); });
            stages.forEach(function(s, i) {
              s.classList.toggle('is-current', i === hIndex);
              s.setAttribute('aria-hidden', String(i !== hIndex));
            });
            nums.forEach(function(n, i) {
              n.setAttribute('aria-current', String(i === hIndex));
            });
          }
          function startHero() {
            stopHero();
            hTimer = setInterval(function() { setHeroSlide(hIndex + 1); }, 6800);
          }
          function stopHero() {
            if (hTimer) clearInterval(hTimer);
          }
          nums.forEach(function(btn, i) {
            btn.addEventListener('click', function() {
              setHeroSlide(i);
              startHero();
            });
          });
          hero.addEventListener('mouseenter', stopHero);
          hero.addEventListener('mouseleave', startHero);
          startHero();
        }
      }

      // 5. Fresh Finds Snap Rail
      var rail = document.querySelector('[data-fresh]');
      var freshPrev = document.querySelector('[data-fresh-prev]');
      var freshNext = document.querySelector('[data-fresh-next]');
      if (rail) {
        if (freshPrev) {
          freshPrev.addEventListener('click', function() {
            rail.scrollBy({ left: -320, behavior: 'smooth' });
          });
        }
        if (freshNext) {
          freshNext.addEventListener('click', function() {
            rail.scrollBy({ left: 320, behavior: 'smooth' });
          });
        }
      }

      // 6. Best Sellers Tabs
      var tabButtons = document.querySelectorAll('[data-best-tabs] [data-tab-target]');
      if (tabButtons.length) {
        tabButtons.forEach(function(btn) {
          btn.addEventListener('click', function() {
            var targetId = btn.getAttribute('data-tab-target');
            tabButtons.forEach(function(b) { b.setAttribute('aria-selected', 'false'); });
            btn.setAttribute('aria-selected', 'true');
            var panels = document.querySelectorAll('.tabpanel');
            panels.forEach(function(p) {
              if (p.id === targetId) {
                p.removeAttribute('hidden');
              } else {
                p.setAttribute('hidden', '');
              }
            });
          });
        });
      }

      // 7. Giveaway Countdown
      var cdHost = document.querySelector('[data-countdown]');
      if (cdHost) {
        var end = new Date();
        end.setDate(end.getDate() + ((7 - end.getDay()) % 7 || 7));
        end.setHours(23, 59, 59, 0);
        function pad(n) { return String(n).padStart(2, '0'); }
        function tick() {
          var diff = Math.max(0, end - new Date());
          var s = Math.floor(diff / 1000);
          var d = Math.floor(s / 86400);
          var h = Math.floor((s % 86400) / 3600);
          var m = Math.floor((s % 3600) / 60);
          var sec = s % 60;
          var elD = cdHost.querySelector('[data-cd="d"]');
          var elH = cdHost.querySelector('[data-cd="h"]');
          var elM = cdHost.querySelector('[data-cd="m"]');
          var elS = cdHost.querySelector('[data-cd="s"]');
          if (elD) elD.textContent = pad(d);
          if (elH) elH.textContent = pad(h);
          if (elM) elM.textContent = pad(m);
          if (elS) elS.textContent = pad(sec);
        }
        tick();
        setInterval(tick, 1000);
      }

      // 8. Mobile Navigation Drawer & Accordion
      var burger = document.querySelector('[data-mobilenav]');
      var mobileDrawer = document.querySelector('#mobilenav');
      var backdrop = document.querySelector('[data-backdrop]');
      var drawerCloses = document.querySelectorAll('[data-close-drawer]');
      if (burger && mobileDrawer && backdrop) {
        function openDrawer() {
          mobileDrawer.classList.add('is-open');
          backdrop.classList.add('is-open');
          burger.setAttribute('aria-expanded', 'true');
          document.body.style.overflow = 'hidden';
        }
        function closeDrawer() {
          mobileDrawer.classList.remove('is-open');
          backdrop.classList.remove('is-open');
          burger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
        burger.addEventListener('click', openDrawer);
        backdrop.addEventListener('click', closeDrawer);
        drawerCloses.forEach(function(btn) { btn.addEventListener('click', closeDrawer); });

        var mnavToggles = mobileDrawer.querySelectorAll('.mobilenav__toggle');
        mnavToggles.forEach(function(toggle) {
          toggle.addEventListener('click', function() {
            var expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', !expanded);
          });
        });
      }

      // 9. Search Box Modal & Shortcut "/"
      var searchBox = document.querySelector('[data-searchbox]');
      var searchOpenBtn = document.querySelector('[data-open-search]');
      var searchCloseBtn = document.querySelector('[data-close-search]');
      var searchInput = document.querySelector('#search-modal-input');
      if (searchBox && backdrop) {
        function openSearch() {
          searchBox.classList.add('is-open');
          backdrop.classList.add('is-open');
          if (searchInput) { searchInput.focus(); }
          document.body.style.overflow = 'hidden';
        }
        function closeSearch() {
          searchBox.classList.remove('is-open');
          backdrop.classList.remove('is-open');
          document.body.style.overflow = '';
        }
        if (searchOpenBtn) searchOpenBtn.addEventListener('click', openSearch);
        if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearch);

        document.addEventListener('keydown', function(e) {
          if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            var inlineInput = document.querySelector('#hsearch-input');
            if (inlineInput && window.innerWidth >= 1024) {
              inlineInput.focus();
            } else {
              openSearch();
            }
          }
        });

        // Search suggestions
        var chips = document.querySelectorAll('[data-suggest]');
        chips.forEach(function(c) {
          c.addEventListener('click', function() {
            var q = c.getAttribute('data-suggest');
            window.location.href = '/search?q=' + encodeURIComponent(q);
          });
        });

        if (searchInput) {
          searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && searchInput.value.trim()) {
              window.location.href = '/search?q=' + encodeURIComponent(searchInput.value.trim());
            }
          });
        }
      }

      // 10. Theme Dark/Light Toggle
      var themeBtn = document.querySelector('[data-theme-toggle]');
      if (themeBtn) {
        themeBtn.addEventListener('click', function() {
          var curr = document.documentElement.getAttribute('data-theme') || 'dark';
          var next = (curr === 'light') ? 'dark' : 'light';
          document.documentElement.setAttribute('data-theme', next);
          try { localStorage.setItem('as.theme', JSON.stringify(next)); } catch(e) {}
        });
      }

      // 11. Language Selector Navigation
      var langSelect = document.querySelector('#lang-select');
      if (langSelect) {
        langSelect.addEventListener('change', function() {
          var val = langSelect.value;
          var path = window.location.pathname;
          if (val === 'en') {
            if (!path.startsWith('/en')) {
              window.location.href = '/en' + (path === '/' ? '' : path);
            }
          } else {
            if (path.startsWith('/en')) {
              var newPath = path.replace(/^\\/en/, '') || '/';
              window.location.href = newPath;
            }
          }
        });
      }

      // 12. Back to Top Button
      var toTop = document.querySelector('[data-totop]');
      if (toTop) {
        window.addEventListener('scroll', function() {
          if (window.scrollY > 400) {
            toTop.classList.add('is-visible');
          } else {
            toTop.classList.remove('is-visible');
          }
        }, { passive: true });
        toTop.addEventListener('click', function() {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    });

    /* Real-time category badge & filter translator on English /en */
    (function() {
      if (document.documentElement.lang.startsWith('en') || location.pathname.startsWith('/en')) {
        var MAP = {
          'Chuột chơi game': 'Gaming mice',
          'Bàn phím cơ': 'Mechanical keyboards',
          'Bàn phím từ tính HE': 'Hall effect keyboards',
          'Tai nghe': 'Headsets',
          'Lót chuột': 'Mousepads',
          'Cáp xoắn': 'Coiled cables',
          'Combo': 'Bundles',
          'Combo tiết kiệm': 'Value bundles',
          'Phụ kiện': 'Accessories',
          'Mới': 'New',
          'Giảm giá': 'Sale',
          'Còn hàng': 'In stock',
          'Hết hàng': 'Sold out',
          'Đặt trước': 'Pre-order',
          'Mua ngay': 'Buy now',
          'Xem chi tiết': 'View details',
          'Thêm vào giỏ': 'Add to cart',
          'Xem tất cả': 'View all'
        };
        function translateBadges() {
          var nodes = document.querySelectorAll('.badge, [data-category-badge], .card__badge, .product-card__badge, .tag, em, .cats__tile em, .cats__tile b, .pcard__cat');
          for (var i = 0; i < nodes.length; i++) {
            var el = nodes[i];
            var t = (el.textContent || '').trim();
            if (MAP[t]) {
              el.textContent = MAP[t];
            }
          }
        }
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', translateBadges);
        } else {
          translateBadges();
        }
        var observer = new MutationObserver(function() { translateBadges(); });
        observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
      }
    })();
  </script>
</body>
</html>`;

  await call('upsert_theme_file', {
    path: 'layout/theme.liquid',
    content: layoutContent
  });
  console.log('Upserted layout/theme.liquid successfully');

  await call('clear_storefront_cache', {});
  console.log('Storefront cache cleared!');
}

main().catch(console.error);

