/* Lăng Kính - main.js (vanilla, dùng chung cho mọi trang) */
(function () {
  "use strict";
  document.documentElement.classList.add("js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var desktop = window.matchMedia("(min-width: 1100px)");
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var vnd = function (n) { return Math.round(n).toLocaleString("de-DE") + "đ"; };
  var escH = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var dataEl = $("#lk-products");
  var PRODUCTS = dataEl ? JSON.parse(dataEl.textContent) : [];
  var bySlug = function (s) { return PRODUCTS.filter(function (p) { return p.slug === s; })[0]; };
  var store = {
    get: function (k) { try { var v = JSON.parse(localStorage.getItem(k) || "[]"); return Array.isArray(v) ? v : []; } catch (e) { return store.mem[k] || []; } },
    set: function (k, v) { store.mem[k] = v; try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    mem: {}
  };
  var toastEl = $("[data-toast]"), toastT;
  function toast(m) { if (!toastEl) return; toastEl.textContent = m; toastEl.classList.add("is-on"); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("is-on"); }, 2600); }

  /* Header: ẩn khi cuộn xuống, hiện khi cuộn lên */
  var header = $("[data-header]"), lastY = scrollY;
  addEventListener("scroll", function () {
    var y = scrollY;
    if (header) { header.classList.toggle("is-scrolled", y > 20); header.classList.toggle("is-hidden", y > 300 && y > lastY && !document.body.classList.contains("nav-open")); }
    lastY = y;
  }, { passive: true });

  /* Menu mobile, menu thả */
  var nav = $("[data-nav]"), toggle = $("[data-nav-toggle]");
  function setNav(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open); toggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("nav-open", open); $(".sr-only", toggle).textContent = open ? "Đóng menu" : "Mở menu";
  }
  if (toggle) {
    toggle.addEventListener("click", function () { setNav(toggle.getAttribute("aria-expanded") !== "true"); });
    desktop.addEventListener("change", function () { setNav(false); });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setNav(false); }); });
  }
  var drops = $$(".has-drop");
  function setDrop(li, open) { li.classList.toggle("is-open", open); $("[data-drop-toggle]", li).setAttribute("aria-expanded", String(open)); }
  drops.forEach(function (li) {
    var btn = $("[data-drop-toggle]", li), t;
    btn.addEventListener("click", function () { setDrop(li, !li.classList.contains("is-open")); });
    li.addEventListener("mouseenter", function () { if (desktop.matches) { clearTimeout(t); setDrop(li, true); } });
    li.addEventListener("mouseleave", function () { if (desktop.matches) t = setTimeout(function () { setDrop(li, false); }, 150); });
    li.addEventListener("focusout", function (e) { if (desktop.matches && !li.contains(e.relatedTarget)) setDrop(li, false); });
  });
  document.addEventListener("click", function (e) { if (desktop.matches && !e.target.closest(".has-drop")) drops.forEach(function (d) { setDrop(d, false); }); });

  /* Tiêu đề trồi lên từng từ */
  $$("[data-split]").forEach(function (h) {
    var n = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (t) {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(" ")); return; }
            var w = document.createElement("span"), i = document.createElement("span");
            w.className = "w"; i.textContent = t; i.style.setProperty("--wi", String(n++)); w.appendChild(i); frag.appendChild(w);
          });
          c.parentNode.replaceChild(frag, c);
        } else if (c.nodeType === 1) walk(c);
      });
    })(h);
    h.setAttribute("aria-label", h.textContent.replace(/\s+/g, " ").trim());
  });
  var seen = $$("[data-split], .reveal");
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } }); }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    seen.forEach(function (el) { var sib = $$(":scope > .reveal", el.parentElement); el.style.setProperty("--i", String(Math.max(0, sib.indexOf(el)))); io.observe(el); });
  } else seen.forEach(function (el) { el.classList.add("is-in"); });

  /* Hero: màn trập chớp, ô lấy nét dò rồi khóa, số đếm ảnh giảm */
  var hero = $("[data-hero]");
  if (hero) {
    var focus = $("[data-focus]", hero), shots = $("[data-shots]", hero), left = 999;
    if (reduce) hero.classList.add("is-live", "is-locked");
    else {
      requestAnimationFrame(function () { hero.classList.add("is-live"); });
      var pts = [[42, 38], [58, 52], [51, 46]], k = 0;
      var hunt = setInterval(function () {
        if (k < pts.length) { focus.style.left = pts[k][0] + "%"; focus.style.top = pts[k][1] + "%"; k++; }
        else { clearInterval(hunt); hero.classList.add("is-locked"); }
      }, 520);
      hero.addEventListener("click", function (e) {
        if (e.target.closest("a, button")) return;
        hero.classList.remove("is-flash"); void hero.offsetWidth; hero.classList.add("is-flash");
        left = Math.max(0, left - 1); shots.textContent = "[ " + left + " ]";
      });
    }
  }

  /* Vòng xoay chọn dòng máy */
  $$("[data-series-dial]").forEach(function (box) {
    var btns = $$("[data-dial]", box), face = $("[data-dial-face]", box), ticks = $(".d-ticks", face);
    var svgNS = "http://www.w3.org/2000/svg";
    for (var i = 0; i < 60; i++) {
      var l = document.createElementNS(svgNS, "line"), a = i * 6 * Math.PI / 180, r1 = i % 5 ? 86 : 80;
      l.setAttribute("x1", 100 + Math.sin(a) * r1); l.setAttribute("y1", 100 - Math.cos(a) * r1);
      l.setAttribute("x2", 100 + Math.sin(a) * 92); l.setAttribute("y2", 100 - Math.cos(a) * 92); ticks.appendChild(l);
    }
    var ANG = [0, -120, 120];
    function pick(i, f) {
      btns.forEach(function (b, k) { var on = k === i; b.setAttribute("aria-selected", String(on)); b.tabIndex = on ? 0 : -1; $("#" + b.getAttribute("aria-controls")).hidden = !on; });
      face.style.transform = "rotate(" + ANG[i] + "deg)";
      var panel = $("#" + btns[i].getAttribute("aria-controls")); panel.classList.remove("is-enter"); void panel.offsetWidth; panel.classList.add("is-enter");
      if (f) btns[i].focus();
    }
    btns.forEach(function (b, i) {
      b.addEventListener("click", function () { pick(i); });
      b.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); pick((i + 1) % 3, true); }
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); pick((i + 2) % 3, true); }
      });
    });
    face.addEventListener("click", function () { var cur = btns.findIndex(function (b) { return b.getAttribute("aria-selected") === "true"; }); pick((cur + 1) % 3); });
  });

  /* Công thức màu */
  var RECIPES = [
    { key: "chuan", name: "Chuẩn", f: "none", d: "Màu trung tính cho mọi cảnh. Điểm bắt đầu khi chưa biết chọn gì.", use: "Mọi cảnh" },
    { key: "ruc", name: "Rực", f: "saturate(1.5) contrast(1.12)", d: "Màu đậm, tương phản cao như phim dương bản. Hợp phong cảnh, hoa, trời xanh.", use: "Phong cảnh, thiên nhiên" },
    { key: "diu", name: "Dịu", f: "saturate(.88) contrast(.9) brightness(1.05)", d: "Màu mềm, tương phản thấp, da mịn. Hợp chân dung ngoài trời và thời trang.", use: "Chân dung, thời trang" },
    { key: "co-dien", name: "Cổ điển", f: "saturate(.7) contrast(1.14) sepia(.12) hue-rotate(-6deg)", d: "Màu nhạt, bóng tối đậm như tạp chí phóng sự thế kỷ trước. Hợp chụp phố.", use: "Đường phố, phóng sự" },
    { key: "hoai-niem", name: "Hoài niệm", f: "sepia(.32) saturate(1.1) contrast(.94) brightness(1.04) hue-rotate(-10deg)", d: "Vùng sáng ngả vàng hổ phách như ảnh in trong album cũ. Hợp ảnh gia đình, du lịch.", use: "Gia đình, kỷ niệm" },
    { key: "dien-anh", name: "Điện ảnh", f: "saturate(.62) contrast(.88) brightness(1.02) hue-rotate(8deg)", d: "Màu dịu, bóng tối giàu chi tiết như khung hình phim. Hợp video và phố đêm.", use: "Video, phố đêm" },
    { key: "don-sac", name: "Đơn sắc", f: "grayscale(1) contrast(1.2)", d: "Đen trắng hạt mịn, chi tiết bóng tối rõ. Hợp chân dung và kiến trúc.", use: "Chân dung, kiến trúc" },
    { key: "bac", name: "Bạc", f: "saturate(.35) contrast(1.35) brightness(.98)", d: "Bão hòa thấp, tương phản cao như phim tráng bỏ tẩy. Ấn tượng, lạnh, mạnh.", use: "Nghệ thuật, quảng cáo" }
  ];
  $$("[data-lab]").forEach(function (lab) {
    var stage = $("[data-lab-stage]", lab), after = $("[data-lab-after]", lab), range = $("[data-lab-range]", lab);
    var img1 = $("[data-lab-img]", lab), img2 = $("[data-lab-img2]", lab), name = $("[data-lab-name]", lab), desc = $("[data-lab-desc]", lab);
    var box = $("[data-recipes]", lab), grain = $("[data-lab-grain]", lab);
    box.innerHTML = RECIPES.map(function (r, i) {
      return '<button type="button" class="recipe" data-recipe="' + i + '" aria-pressed="false"><span class="recipe-sw" style="filter:' + r.f + '"></span><span>' + r.name + "</span></button>";
    }).join("");
    function setR(i) {
      var r = RECIPES[i];
      $$(".recipe", box).forEach(function (b, k) { b.classList.toggle("is-on", k === i); b.setAttribute("aria-pressed", String(k === i)); });
      img2.style.filter = r.f; name.textContent = r.name; desc.innerHTML = "<strong>" + r.name + ".</strong> " + r.d;
      stage.classList.remove("is-swap"); void stage.offsetWidth; stage.classList.add("is-swap");
    }
    $$(".recipe", box).forEach(function (b) { b.addEventListener("click", function () { setR(Number(b.getAttribute("data-recipe"))); }); });
    function setPos() { stage.style.setProperty("--pos", range.value + "%"); }
    range.addEventListener("input", setPos); setPos();
    $$("[data-photo]", lab).forEach(function (b) {
      b.addEventListener("click", function () {
        $$("[data-photo]", lab).forEach(function (x) { x.classList.toggle("is-on", x === b); x.setAttribute("aria-pressed", String(x === b)); });
        img1.src = img2.src = "assets/img/" + b.getAttribute("data-photo");
        img1.alt = $("img", b).alt;
      });
    });
    if (grain) grain.addEventListener("change", function () { stage.classList.toggle("has-grain", grain.checked); });
    setR(3);
  });
  var rt = $("[data-recipe-table]");
  if (rt) rt.innerHTML = RECIPES.map(function (r, i) {
    return '<article class="rt reveal is-in"><div class="rt-img"><img src="assets/img/pho-xich-lo.jpg" width="1600" height="1300" alt="" loading="lazy" style="filter:' + r.f + '"></div><p class="rt-no">0' + (i + 1) + "</p><h3>" + r.name + '</h3><p class="muted">' + r.d + '</p><p class="rt-use">' + r.use + "</p></article>";
  }).join("");

  /* Lá khẩu: 9 lá, khép lại khi cuộn qua phần ống kính */
  var iris = $("[data-iris]"), irisSec = $("[data-iris-sec]"), irisF = $("[data-iris-f]");
  if (iris) {
    var NS = "http://www.w3.org/2000/svg", blades = [];
    var ring = document.createElementNS(NS, "circle"); ring.setAttribute("r", "96"); ring.setAttribute("class", "iris-ring"); iris.appendChild(ring);
    var g = document.createElementNS(NS, "g"); g.setAttribute("class", "iris-blades"); iris.appendChild(g);
    var clip = document.createElementNS(NS, "clipPath"); clip.id = "iris-clip"; var cc = document.createElementNS(NS, "circle"); cc.setAttribute("r", "90"); clip.appendChild(cc); iris.appendChild(clip);
    g.setAttribute("clip-path", "url(#iris-clip)");
    /* Mỗi lá là nửa mặt phẳng có cạnh cong; 9 lá xoay đều tạo lỗ khẩu hình 9 cạnh */
    for (var b = 0; b < 9; b++) { var pth = document.createElementNS(NS, "path"); pth.setAttribute("d", "M0 -220 Q 26 0 0 220 L 240 220 L 240 -220 Z"); pth.setAttribute("class", b % 2 ? "b-a" : "b-b"); g.appendChild(pth); blades.push(pth); }
    var STOPS = ["1.4", "2", "2.8", "4", "5.6", "8", "11", "16"];
    var setIris = function (p) {
      var r = 10 + (1 - p) * 58;
      blades.forEach(function (bl, i) { bl.setAttribute("transform", "rotate(" + (i * 40 + p * 24) + ") translate(" + r.toFixed(1) + " 0)"); });
      irisF.textContent = STOPS[Math.min(STOPS.length - 1, Math.floor(p * STOPS.length))];
    };
    setIris(0);
    if (!reduce) {
      var tk = false;
      addEventListener("scroll", function () {
        if (tk) return; tk = true;
        requestAnimationFrame(function () {
          tk = false; var r = irisSec.getBoundingClientRect();
          var p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
          setIris(Math.min(1, Math.max(0, (p - .2) / .6)));
        });
      }, { passive: true });
    }
  }

  /* Lọc, sắp xếp; ?dong= trên URL */
  $$("[data-filter-scope]").forEach(function (scope) {
    var key = scope.getAttribute("data-filter-key") || "series";
    var chips = $$("[data-filter-value]", scope), grid = $("[data-filter-target]", scope), empty = $("[data-empty]", scope), sort = $("[data-sort]", scope);
    var items = $$("[data-filter-target] > *", scope), orig = items.slice();
    function apply(v) {
      var n = 0;
      chips.forEach(function (c) { var on = c.getAttribute("data-filter-value") === v; c.classList.toggle("is-active", on); c.setAttribute("aria-pressed", String(on)); });
      items.forEach(function (it) { var ok = v === "all" || it.getAttribute("data-" + key) === v; it.hidden = !ok; if (ok) n++; });
      if (empty) empty.hidden = n > 0;
    }
    chips.forEach(function (c) { c.addEventListener("click", function () { apply(c.getAttribute("data-filter-value")); }); });
    if (sort) sort.addEventListener("change", function () {
      var list = orig.slice();
      if (sort.value !== "default") list.sort(function (a, b) { var d = a.getAttribute("data-price") - b.getAttribute("data-price"); return sort.value === "asc" ? d : -d; });
      list.forEach(function (el) { grid.appendChild(el); });
    });
    var q = new URLSearchParams(location.search).get("dong");
    if (q && $('[data-filter-value="' + q + '"]', scope)) apply(q);
  });

  /* So sánh: tối đa 3, cùng loại */
  var CK = "lk-compare";
  function renderCompare() {
    var list = store.get(CK).filter(bySlug);
    $$("[data-compare-count]").forEach(function (c) { c.textContent = list.length; c.classList.toggle("has", list.length > 0); });
    $$("[data-compare]").forEach(function (b) {
      var on = list.indexOf(b.getAttribute("data-compare")) > -1;
      b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", String(on));
      var s = $("span", b); if (s) s.textContent = on ? "Đang so sánh" : "So sánh";
    });
    var tray = $("[data-compare-tray]");
    if (tray) {
      tray.hidden = list.length === 0 || document.body.getAttribute("data-page") === "so-sanh";
      $("[data-compare-text]", tray).textContent = list.length + "/3 sản phẩm";
      $("[data-compare-list]", tray).innerHTML = list.map(function (s) { var p = bySlug(s); return '<li><img src="assets/img/' + p.img + '" alt="" width="48" height="32">' + escH(p.name) + "</li>"; }).join("");
    }
    renderCmpTable();
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-compare]"); if (!b) return;
    var s = b.getAttribute("data-compare"), p = bySlug(s), list = store.get(CK).filter(bySlug);
    if (list.indexOf(s) > -1) { list = list.filter(function (x) { return x !== s; }); toast("Đã bỏ khỏi so sánh"); }
    else {
      list = list.filter(function (x) { return bySlug(x).kind === p.kind; });
      if (list.length >= 3) { toast("So sánh tối đa 3 sản phẩm"); return; }
      list.push(s); toast("Đã thêm " + p.name + " vào so sánh (" + list.length + "/3)");
    }
    store.set(CK, list); renderCompare();
  });
  var clr = $("[data-compare-clear]"); if (clr) clr.addEventListener("click", function () { store.set(CK, []); renderCompare(); });

  var cmp = $("[data-cmp]"), cmpKind = "camera";
  function renderCmpTable() {
    if (!cmp) return;
    var table = $("[data-cmp-table]", cmp), diff = $("[data-cmp-diff]", cmp).checked;
    var chosen = store.get(CK).filter(bySlug).map(bySlug).filter(function (p) { return p.kind === cmpKind; });
    var pool = PRODUCTS.filter(function (p) { return p.kind === cmpKind; });
    while (chosen.length < 3) chosen.push(null);
    var sel = function (p, col) {
      return '<select data-cmp-col="' + col + '" aria-label="Chọn sản phẩm cột ' + (col + 1) + '"><option value="">Chọn sản phẩm</option>' + pool.map(function (o) { return '<option value="' + o.slug + '"' + (p && p.slug === o.slug ? " selected" : "") + ">" + escH(o.name) + "</option>"; }).join("") + "</select>";
    };
    var labels = (chosen.filter(Boolean)[0] || pool[0]).specs.map(function (s) { return s[0]; });
    var head = '<thead><tr><th scope="col"><span class="sr-only">Thông số</span></th>' + chosen.map(function (p, i) {
      return '<th scope="col">' + (p ? '<img src="assets/img/' + p.img + '" alt="" width="160" height="107"><a href="' + p.slug + '.html">' + escH(p.name) + "</a><b>" + vnd(p.price) + "</b>" : '<span class="cmp-empty"><i class="ph-light ph-plus"></i></span>') + sel(p, i) + "</th>";
    }).join("") + "</tr></thead>";
    var rows = [["Dòng", function (p) { return p.series; }], ["Loại", function (p) { return p.type; }]].concat(labels.map(function (l, i) { return [l, function (p) { return p.specs[i][1]; }]; }));
    var body = "<tbody>" + rows.map(function (r) {
      var vals = chosen.map(function (p) { return p ? r[1](p) : ""; }), filled = vals.filter(Boolean);
      var differs = filled.length > 1 && filled.some(function (v) { return v !== filled[0]; });
      if (diff && !differs) return "";
      return '<tr class="' + (differs ? "is-diff" : "") + '"><th scope="row">' + r[0] + "</th>" + vals.map(function (v) { return "<td>" + (v ? escH(v) : '<span class="muted">-</span>') + "</td>"; }).join("") + "</tr>";
    }).join("") + "</tbody>";
    table.innerHTML = head + body;
    $$("[data-cmp-col]", table).forEach(function (s) {
      s.addEventListener("change", function () {
        var col = Number(s.getAttribute("data-cmp-col")), cur = chosen.map(function (p) { return p ? p.slug : ""; });
        cur[col] = s.value;
        var others = store.get(CK).filter(bySlug).filter(function (x) { return bySlug(x).kind !== cmpKind; });
        store.set(CK, cur.filter(Boolean).filter(function (x, i, a) { return a.indexOf(x) === i; }).concat(others).slice(0, 3));
        renderCompare();
      });
    });
  }
  if (cmp) {
    var first = store.get(CK).filter(bySlug)[0]; if (first) cmpKind = bySlug(first).kind;
    $$("[data-cmp-kind]", cmp).forEach(function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-cmp-kind") === cmpKind); b.setAttribute("aria-pressed", String(b.getAttribute("data-cmp-kind") === cmpKind));
      b.addEventListener("click", function () {
        cmpKind = b.getAttribute("data-cmp-kind");
        $$("[data-cmp-kind]", cmp).forEach(function (x) { x.classList.toggle("is-active", x === b); x.setAttribute("aria-pressed", String(x === b)); });
        renderCmpTable();
      });
    });
    $("[data-cmp-diff]", cmp).addEventListener("change", renderCmpTable);
  }

  /* Giỏ hàng */
  var KK = "lk-cart";
  var drawer = $("[data-drawer]"), lastFocus = null;
  function cart() { return store.get(KK).filter(function (it) { return bySlug(it.slug); }); }
  function lineKey(it) { return it.slug + "|" + (it.color || "") + "|" + (it.kit ? 1 : 0); }
  function linePrice(it) { var p = bySlug(it.slug); return p.price + (it.kit && p.kit ? p.kit[1] : 0); }
  function addCart(slug, color, kit) {
    var p = bySlug(slug), list = cart(), it = { slug: slug, color: color || p.colors[0], kit: !!kit, qty: 1 };
    var ex = list.filter(function (x) { return lineKey(x) === lineKey(it); })[0];
    if (ex) ex.qty = Math.min(5, ex.qty + 1); else list.push(it);
    store.set(KK, list); renderCart(); toast("Đã thêm " + p.name + " vào giỏ");
    if (header) header.classList.remove("is-hidden");
    $$("[data-cart-open]").forEach(function (b) { b.classList.remove("is-bump"); void b.offsetWidth; b.classList.add("is-bump"); });
  }
  function renderCart() {
    var list = cart(), total = 0, count = 0;
    list.forEach(function (it) { total += linePrice(it) * it.qty; count += it.qty; });
    $$("[data-cart-count]").forEach(function (c) { c.textContent = count; c.classList.toggle("has", count > 0); });
    $$("[data-cart-total]").forEach(function (c) { c.textContent = vnd(total); });
    $$("[data-cart-installment]").forEach(function (c) { c.textContent = total ? "Hoặc " + vnd(Math.round(total / 12 / 1000) * 1000) + "/tháng, trả góp 0% trong 12 tháng" : ""; });
    $$("[data-cart-list]").forEach(function (ul) {
      ul.innerHTML = list.map(function (it, i) {
        var p = bySlug(it.slug);
        return '<li class="cart-item"><img src="assets/img/' + p.img + '" alt="" width="96" height="64"><div><a href="' + p.slug + '.html">' + escH(p.name) + "</a><small>" + escH(it.color) + (it.kit && p.kit ? " · " + escH(p.kit[0]) : "") + '</small><div class="qty"><button type="button" data-qty="' + i + '" data-d="-1" aria-label="Giảm số lượng">-</button><span>' + it.qty + '</span><button type="button" data-qty="' + i + '" data-d="1" aria-label="Tăng số lượng">+</button></div></div><div class="ci-right"><b>' + vnd(linePrice(it) * it.qty) + '</b><button type="button" class="ci-rm" data-rm="' + i + '" aria-label="Xóa ' + escH(p.name) + '">Xóa</button></div></li>';
      }).join("");
    });
    $$("[data-cart-empty]").forEach(function (e) { e.hidden = list.length > 0; });
    $$("[data-cart-foot]").forEach(function (e) { e.hidden = list.length === 0; });
    var co = $("[data-checkout]"); if (co) co.hidden = list.length === 0 && !co.classList.contains("is-done");
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-add-cart]"); if (a) { addCart(a.getAttribute("data-add-cart")); return; }
    var q = e.target.closest("[data-qty]");
    if (q) { var l = cart(), it = l[Number(q.getAttribute("data-qty"))]; it.qty = Math.max(1, Math.min(5, it.qty + Number(q.getAttribute("data-d")))); store.set(KK, l); renderCart(); return; }
    var r = e.target.closest("[data-rm]"); if (r) { var l2 = cart(); l2.splice(Number(r.getAttribute("data-rm")), 1); store.set(KK, l2); renderCart(); return; }
    if (e.target.closest("[data-cart-open]")) { openDrawer(); return; }
    if (e.target.closest("[data-cart-close]")) closeDrawer();
  });
  function openDrawer() { if (!drawer) return; lastFocus = document.activeElement; drawer.hidden = false; requestAnimationFrame(function () { drawer.classList.add("is-open"); }); document.body.classList.add("drawer-open"); $(".drawer-panel [data-cart-close]", drawer).focus(); }
  function closeDrawer() { if (!drawer || drawer.hidden) return; drawer.classList.remove("is-open"); document.body.classList.remove("drawer-open"); setTimeout(function () { drawer.hidden = true; }, reduce ? 0 : 450); if (lastFocus) lastFocus.focus(); }
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (drawer && !drawer.hidden) { closeDrawer(); return; }
    var open = drops.filter(function (d) { return d.classList.contains("is-open"); })[0];
    if (open) { setDrop(open, false); $("[data-drop-toggle]", open).focus(); return; }
    if (toggle && toggle.getAttribute("aria-expanded") === "true") { setNav(false); toggle.focus(); }
  });

  /* Trang sản phẩm: màu, gói, thanh mua dính */
  var pd = $("[data-pd]");
  if (pd) {
    var p = bySlug(pd.getAttribute("data-slug")), colorIdx = 0, kit = false;
    var upd = function () {
      var price = p.price + (kit && p.kit ? p.kit[1] : 0);
      $("[data-pd-price]").textContent = vnd(price); $("[data-pd-price-2]").textContent = vnd(price);
      $("[data-pd-month]").textContent = vnd(Math.round(price / 12 / 1000) * 1000);
    };
    $$("[data-color]", pd).forEach(function (r) {
      r.addEventListener("change", function () {
        colorIdx = Number(r.getAttribute("data-color"));
        $$("[data-color-img]", pd).forEach(function (im, k) { im.classList.toggle("is-on", k === colorIdx); });
        $("[data-color-name]", pd).textContent = p.colors[colorIdx];
      });
    });
    $$("[data-kit-opt]", pd).forEach(function (r) { r.addEventListener("change", function () { kit = r.getAttribute("data-kit-opt") === "1"; upd(); }); });
    $$("[data-pd-add]").forEach(function (b) { b.addEventListener("click", function () { addCart(p.slug, p.colors[colorIdx], kit); }); });
    var bar = $("[data-buybar]"), buy = $(".pd-buy", pd);
    if (bar && "IntersectionObserver" in window) new IntersectionObserver(function (es) {
      var show = !es[0].isIntersecting && es[0].boundingClientRect.top < 0;
      bar.classList.toggle("is-on", show); bar.setAttribute("aria-hidden", String(!show)); $("button", bar).tabIndex = show ? 0 : -1;
    }).observe(buy);
  }

  /* Tính trả góp */
  var calc = $("[data-calc]");
  if (calc) {
    var cs = $("[data-calc-p]", calc), out = $("[data-calc-out]", calc);
    cs.innerHTML = PRODUCTS.map(function (x) { return '<option value="' + x.price + '">' + escH(x.name) + " · " + vnd(x.price) + "</option>"; }).join("");
    var run = function () { var t = Number($('input[name="term"]:checked', calc).value); out.textContent = vnd(Math.round(cs.value / t / 1000) * 1000) + " x " + t + " tháng"; };
    cs.addEventListener("change", run); $$('input[name="term"]', calc).forEach(function (r) { r.addEventListener("change", run); }); run();
  }

  /* Thanh toán */
  var co = $("[data-checkout]");
  if (co) {
    var addrF = $("[data-addr]", co), phoneOk = function (v) { return /^0\d{9}$/.test(v.replace(/[\s.\-()]/g, "").replace(/^\+84/, "0")); };
    var ship = function () { var g = $('input[name="ship"]:checked', co).value === "giao"; addrF.hidden = !g; co.elements.address.required = g; };
    $$("[data-ship]", co).forEach(function (r) { r.addEventListener("change", ship); }); ship();
    var rules = {
      name: function (v) { return v.trim().length < 2 ? "Vui lòng nhập họ và tên." : ""; },
      phone: function (v) { return !v.trim() ? "Vui lòng nhập số điện thoại." : phoneOk(v) ? "" : "Số điện thoại gồm 10 chữ số, ví dụ 0912 345 678."; },
      address: function (v) { return co.elements.address.required && v.trim().length < 8 ? "Vui lòng nhập địa chỉ nhận hàng đầy đủ." : ""; }
    };
    var check = function (n) { var el = co.elements[n], m = rules[n](el.value), f = el.closest(".field"); f.classList.toggle("has-error", !!m); el.setAttribute("aria-invalid", m ? "true" : "false"); $(".error", f).textContent = m; return !m; };
    Object.keys(rules).forEach(function (n) {
      var el = co.elements[n];
      el.addEventListener("blur", function () { if (el.value) check(n); });
      el.addEventListener("input", function () { if (el.closest(".field").classList.contains("has-error")) check(n); });
    });
    co.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = null; Object.keys(rules).forEach(function (n) { if (!check(n) && !bad) bad = co.elements[n]; });
      if (bad) { bad.focus(); return; }
      var btn = $("[data-co-submit]", co), ep = co.getAttribute("data-endpoint"), err = $("[data-co-error]", co);
      err.hidden = true; btn.disabled = true; btn.classList.add("is-loading");
      var data = { items: cart() }; new FormData(co).forEach(function (v, k) { data[k] = String(v).trim(); });
      var req = ep ? fetch(ep, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(function (r) { if (!r.ok) throw new Error(r.status); }) : new Promise(function (r) { setTimeout(r, 900); }); // chưa có máy chủ: mô phỏng
      req.then(function () {
        $("[data-co-code]", co).textContent = "#LK" + String(Date.now()).slice(-6);
        $("[data-co-phone]", co).textContent = data.phone;
        co.classList.add("is-done"); $("[data-co-body]", co).hidden = true; var d = $("[data-co-done]", co); d.hidden = false; d.focus();
        store.set(KK, []); renderCart();
      }).catch(function () { err.hidden = false; }).then(function () { btn.disabled = false; btn.classList.remove("is-loading"); });
    });
  }

  /* Đăng ký nhận tin */
  $$("[data-news]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault(); var v = f.elements.email.value.trim(), m = $(".news-msg", f);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { m.textContent = "Email chưa đúng, ví dụ ten@gmail.com."; f.elements.email.focus(); return; }
      m.textContent = "Đã đăng ký. Hẹn gặp bạn trong bản tin đầu tháng."; f.reset();
    });
  });

  renderCart(); renderCompare();
  $$("[data-year]").forEach(function (y) { y.textContent = String(new Date().getFullYear()); });
})();
