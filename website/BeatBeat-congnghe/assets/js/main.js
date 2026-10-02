/* BeatBeat - main.js (vanilla, dùng chung cho mọi trang) */
(function () {
  "use strict";
  document.documentElement.classList.add("js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var desktop = window.matchMedia("(min-width: 1181px)");
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var vnd = function (n) { return Math.round(n).toLocaleString("de-DE") + "đ"; };
  var escH = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var norm = function (t) { return String(t).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d"); };
  var dataEl = $("#bb-products");
  var PRODUCTS = dataEl ? JSON.parse(dataEl.textContent) : [];
  var bySlug = function (s) { return PRODUCTS.filter(function (p) { return p.slug === s; })[0]; };
  var io = function (cb, o) { return "IntersectionObserver" in window ? new IntersectionObserver(cb, o) : null; };
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
    if (header) header.classList.toggle("is-hidden", y > 320 && y > lastY && !document.body.classList.contains("nav-open") && !$(".has-drop.is-open"));
    lastY = y;
  }, { passive: true });

  /* Menu điện thoại */
  var nav = $("[data-nav]"), toggle = $("[data-nav-toggle]");
  function setNav(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("nav-open", open);
    $(".sr-only", toggle).textContent = open ? "Đóng menu" : "Mở menu";
    if (open) nav.removeAttribute("inert"); else nav.setAttribute("inert", "");
  }
  if (nav) nav.setAttribute("inert", "");
  if (toggle) {
    toggle.addEventListener("click", function () { setNav(toggle.getAttribute("aria-expanded") !== "true"); });
    desktop.addEventListener("change", function () { setNav(false); });
  }

  /* Menu thả */
  var drops = $$(".has-drop");
  function setDrop(li, open) { li.classList.toggle("is-open", open); $("[data-drop-toggle]", li).setAttribute("aria-expanded", String(open)); }
  drops.forEach(function (li) {
    var btn = $("[data-drop-toggle]", li), t;
    btn.addEventListener("click", function () { var o = !li.classList.contains("is-open"); drops.forEach(function (d) { setDrop(d, false); }); setDrop(li, o); });
    li.addEventListener("mouseenter", function () { if (desktop.matches) { clearTimeout(t); drops.forEach(function (d) { if (d !== li) setDrop(d, false); }); setDrop(li, true); } });
    li.addEventListener("mouseleave", function () { if (desktop.matches) t = setTimeout(function () { setDrop(li, false); }, 160); });
    li.addEventListener("focusout", function (e) { if (!li.contains(e.relatedTarget)) setDrop(li, false); });
  });
  document.addEventListener("click", function (e) { drops.forEach(function (d) { if (!d.contains(e.target)) setDrop(d, false); }); });

  /* Quầng sáng hero theo chuột */
  var hero = $("[data-glow]");
  if (hero && !reduce && matchMedia("(pointer: fine)").matches) {
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      hero.style.setProperty("--gx", ((e.clientX - r.left) / r.width - .7) * 160 + "px");
      hero.style.setProperty("--gy", ((e.clientY - r.top) / r.height - .3) * 120 + "px");
    });
  }

  /* Thanh trượt: tô phần đã kéo */
  function fillRange(r) { r.style.setProperty("--p", ((r.value - r.min) / (r.max - r.min) * 100) + "%"); }
  $$('input[type="range"]').forEach(function (r) { fillRange(r); r.addEventListener("input", function () { fillRange(r); }); });

  /* Kéo chống ồn (trang chủ) */
  var ancR = $("[data-anc-range]");
  if (ancR) {
    var vis = $("[data-anc-vis]"), out = $("[data-anc-out]");
    var runA = function () { vis.style.setProperty("--a", String(ancR.value / 42)); out.textContent = "-" + ancR.value + " dB"; if (ancR.value === "0") out.textContent = "Tắt"; };
    ancR.addEventListener("input", runA); runA();
  }

  /* Màu trên thẻ sản phẩm: đổi ảnh */
  document.addEventListener("click", function (e) {
    var sw = e.target.closest("[data-card-sw]"); if (!sw) return;
    var card = sw.closest(".card"), i = Number(sw.getAttribute("data-card-sw"));
    $$("[data-card-sw]", card).forEach(function (b) { var on = b === sw; b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", String(on)); });
    $$("[data-card-img]", card).forEach(function (im, k) { im.classList.toggle("is-on", k === i); });
  });

  /* Lọc, sắp xếp danh sách; ?loai= trên URL */
  $$("[data-filter-scope]").forEach(function (scope) {
    var key = scope.getAttribute("data-filter-key") || "cat";
    var chips = $$("[data-filter-value]", scope), grid = $("[data-filter-target]", scope), empty = $("[data-empty]", scope);
    var sort = $("[data-sort]", scope), pmax = $("[data-price-max]", scope), feats = $$("[data-feat]", scope), cnt = $("[data-fcount]", scope);
    var items = $$("[data-filter-target] > *", scope), orig = items.slice(), cur = "all";
    function apply() {
      var n = 0, max = pmax ? Number(pmax.value) : 0;
      chips.forEach(function (c) { var on = c.getAttribute("data-filter-value") === cur; c.classList.toggle("is-active", on); c.setAttribute("aria-pressed", String(on)); });
      items.forEach(function (it) {
        var ok = (cur === "all" || it.getAttribute("data-" + key) === cur) && (!max || Number(it.getAttribute("data-price")) <= max);
        feats.forEach(function (f) { if (f.checked && it.getAttribute("data-" + f.getAttribute("data-feat")) !== "1") ok = false; });
        it.hidden = !ok; if (ok) n++;
      });
      if (empty) empty.hidden = n > 0;
      if (cnt) cnt.textContent = n + " sản phẩm";
    }
    function doSort() {
      var list = orig.slice(), v = sort.value;
      if (v === "asc" || v === "desc") list.sort(function (a, b) { var d = a.getAttribute("data-price") - b.getAttribute("data-price"); return v === "asc" ? d : -d; });
      if (v === "battery") list.sort(function (a, b) { return b.getAttribute("data-battery") - a.getAttribute("data-battery"); });
      list.forEach(function (el) { grid.appendChild(el); });
    }
    chips.forEach(function (c) { c.addEventListener("click", function () { cur = c.getAttribute("data-filter-value"); apply(); }); });
    feats.forEach(function (f) { f.addEventListener("change", apply); });
    if (pmax) pmax.addEventListener("change", apply);
    if (sort) sort.addEventListener("change", doSort);
    var reset = $("[data-filter-reset]", scope);
    if (reset) reset.addEventListener("click", function () { cur = "all"; feats.forEach(function (f) { f.checked = false; }); if (pmax) pmax.value = "0"; apply(); });
    var q = new URLSearchParams(location.search).get("loai");
    if (q && $('[data-filter-value="' + q + '"]', scope)) cur = q;
    apply();
  });

  /* So sánh: tối đa 3, cùng loại */
  var CK = "bb-compare";
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
      $("[data-compare-text]", tray).textContent = list.length + "/3 " + (list[0] && bySlug(list[0]).kind === "loa" ? "loa" : "tai nghe");
      $("[data-compare-list]", tray).innerHTML = list.map(function (s) { var p = bySlug(s); return '<li><img src="assets/img/' + p.img + '" alt="" width="44" height="34">' + escH(p.name) + "</li>"; }).join("");
    }
    renderCmpTable();
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-compare]"); if (!b) return;
    var s = b.getAttribute("data-compare"), p = bySlug(s), list = store.get(CK).filter(bySlug);
    if (list.indexOf(s) > -1) { list = list.filter(function (x) { return x !== s; }); toast("Đã bỏ khỏi so sánh"); }
    else {
      var before = list.length;
      list = list.filter(function (x) { return bySlug(x).kind === p.kind; });
      var dropped = list.length < before;
      if (list.length >= 3) { toast("So sánh tối đa 3 sản phẩm"); return; }
      list.push(s); toast("Đã thêm " + p.name + " vào so sánh (" + list.length + "/3)" + (dropped ? ", đã bỏ sản phẩm khác loại" : ""));
    }
    store.set(CK, list); renderCompare();
  });
  var clr = $("[data-compare-clear]"); if (clr) clr.addEventListener("click", function () { store.set(CK, []); renderCompare(); });

  var cmp = $("[data-cmp]"), cmpKind = "tai-nghe";
  function renderCmpTable() {
    if (!cmp) return;
    var table = $("[data-cmp-table]", cmp), diff = $("[data-cmp-diff]", cmp).checked;
    var chosen = store.get(CK).filter(bySlug).map(bySlug).filter(function (p) { return p.kind === cmpKind; });
    var pool = PRODUCTS.filter(function (p) { return p.kind === cmpKind; });
    while (chosen.length < 3) chosen.push(null);
    var sel = function (p, col) { return '<select data-cmp-col="' + col + '" aria-label="Chọn sản phẩm cột ' + (col + 1) + '"><option value="">Chọn sản phẩm</option>' + pool.map(function (o) { return '<option value="' + o.slug + '"' + (p && p.slug === o.slug ? " selected" : "") + ">" + escH(o.name) + "</option>"; }).join("") + "</select>"; };
    var labels = (chosen.filter(Boolean)[0] || pool[0]).specs.map(function (s) { return s[0]; });
    var head = '<thead><tr><th scope="col"><span class="sr-only">Thông số</span></th>' + chosen.map(function (p, i) {
      return '<th scope="col">' + (p ? '<img src="assets/img/' + p.img + '" alt="" width="200" height="133"><a href="' + p.slug + '.html">' + escH(p.name) + "</a><b>" + vnd(p.price) + "</b>" : '<span class="cmp-empty"><i class="ph-light ph-plus"></i></span>') + sel(p, i) + "</th>";
    }).join("") + "</tr></thead>";
    var rows = [["Loại", function (p) { return p.type; }], ["Đánh giá", function (p) { return p.rating + " / 5"; }]].concat(labels.map(function (l, i) { return [l, function (p) { return p.specs[i][1]; }]; }));
    var body = "<tbody>" + rows.map(function (r) {
      var vals = chosen.map(function (p) { return p ? r[1](p) : ""; }), filled = vals.filter(Boolean);
      var differs = filled.length > 1 && filled.some(function (v) { return v !== filled[0]; });
      if (diff && !differs) return "";
      return '<tr class="' + (differs ? "is-diff" : "") + '"><th scope="row">' + r[0] + "</th>" + vals.map(function (v) { return "<td>" + (v ? escH(v) : '<span class="muted">-</span>') + "</td>"; }).join("") + "</tr>";
    }).join("") + "</tbody>";
    table.innerHTML = head + body;
    $$("[data-cmp-col]", table).forEach(function (s) {
      s.addEventListener("change", function () {
        var col = Number(s.getAttribute("data-cmp-col")), curL = chosen.map(function (p) { return p ? p.slug : ""; });
        curL[col] = s.value;
        store.set(CK, curL.filter(Boolean).filter(function (x, i, a) { return a.indexOf(x) === i; }));
        renderCompare();
      });
    });
  }
  if (cmp) {
    var first = store.get(CK).filter(bySlug)[0]; if (first) cmpKind = bySlug(first).kind;
    var kinds = $$("[data-cmp-kind]", cmp);
    var markKind = function () { kinds.forEach(function (x) { var on = x.getAttribute("data-cmp-kind") === cmpKind; x.classList.toggle("is-active", on); x.setAttribute("aria-pressed", String(on)); }); };
    kinds.forEach(function (b) { b.addEventListener("click", function () { cmpKind = b.getAttribute("data-cmp-kind"); markKind(); renderCmpTable(); }); });
    markKind();
    $("[data-cmp-diff]", cmp).addEventListener("change", renderCmpTable);
  }

  /* Giỏ hàng */
  var KK = "bb-cart", FREE = 500000;
  var drawer = $("[data-drawer]"), lastFocus = null;
  function cart() { return store.get(KK).filter(function (it) { return bySlug(it.slug); }); }
  function addCart(slug, ci) {
    var p = bySlug(slug), list = cart(), c = Math.min(ci || 0, p.colors.length - 1);
    var ex = list.filter(function (x) { return x.slug === slug && x.c === c; })[0];
    if (ex) ex.qty = Math.min(5, ex.qty + 1); else list.push({ slug: slug, c: c, qty: 1 });
    store.set(KK, list); renderCart(); toast("Đã thêm " + p.name + " vào giỏ");
    if (header) header.classList.remove("is-hidden");
    $$("[data-cart-open]").forEach(function (b) { b.classList.remove("is-bump"); void b.offsetWidth; b.classList.add("is-bump"); });
  }
  function totals() {
    var list = cart(), sub = 0, count = 0;
    list.forEach(function (it) { sub += bySlug(it.slug).price * it.qty; count += it.qty; });
    return { list: list, sub: sub, count: count };
  }
  function renderCart() {
    var t = totals();
    $$("[data-cart-count]").forEach(function (c) { c.textContent = t.count; c.classList.toggle("has", t.count > 0); });
    $$("[data-cart-total]").forEach(function (c) { c.textContent = vnd(t.sub); });
    $$("[data-cart-installment]").forEach(function (c) { c.textContent = t.sub >= 3000000 ? "Hoặc " + vnd(Math.round(t.sub / 12 / 1000) * 1000) + "/tháng, trả góp 0% trong 12 tháng" : ""; });
    $$("[data-ship-meter]").forEach(function (m) {
      if (!t.count) { m.innerHTML = ""; return; }
      m.innerHTML = t.sub >= FREE ? "<i class=\"ph-light ph-truck\"></i> Đơn của bạn được <b>miễn phí giao hàng</b>" : "Mua thêm <b>" + vnd(FREE - t.sub) + "</b> để được miễn phí giao hàng" + '<span class="meter"><span style="width:' + (t.sub / FREE * 100) + '%"></span></span>';
    });
    $$("[data-cart-list]").forEach(function (ul) {
      ul.innerHTML = t.list.map(function (it, i) {
        var p = bySlug(it.slug), col = p.colors[it.c] || p.colors[0];
        return '<li class="cart-item"><img src="assets/img/' + col[1] + '" alt="" width="96" height="64"><div><a href="' + p.slug + '.html">' + escH(p.name) + "</a><small>" + escH(col[0]) + '</small><div class="qty"><button type="button" data-qty="' + i + '" data-d="-1" aria-label="Giảm số lượng ' + escH(p.name) + '">-</button><span>' + it.qty + '</span><button type="button" data-qty="' + i + '" data-d="1" aria-label="Tăng số lượng ' + escH(p.name) + '">+</button></div></div><div class="ci-right"><b>' + vnd(p.price * it.qty) + '</b><button type="button" class="ci-rm" data-rm="' + i + '">Xóa</button></div></li>';
      }).join("");
    });
    $$("[data-cart-empty]").forEach(function (e) { e.hidden = t.count > 0; });
    $$("[data-cart-foot]").forEach(function (e) { e.hidden = t.count === 0; });
    var co = $("[data-checkout]"); if (co) { co.hidden = t.count === 0 && !co.classList.contains("is-done"); updateSum(); }
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-add-cart]"); if (a) { addCart(a.getAttribute("data-add-cart"), 0); return; }
    var q = e.target.closest("[data-qty]");
    if (q) { var l = cart(), it = l[Number(q.getAttribute("data-qty"))]; it.qty = Math.max(1, Math.min(5, it.qty + Number(q.getAttribute("data-d")))); store.set(KK, l); renderCart(); return; }
    var r = e.target.closest("[data-rm]"); if (r) { var l2 = cart(), gone = bySlug(l2[Number(r.getAttribute("data-rm"))].slug); l2.splice(Number(r.getAttribute("data-rm")), 1); store.set(KK, l2); renderCart(); toast("Đã xóa " + gone.name); return; }
    if (e.target.closest("[data-cart-open]")) { openDrawer(); return; }
    if (e.target.closest("[data-cart-close]")) closeDrawer();
  });
  function openDrawer() { if (!drawer) return; lastFocus = document.activeElement; drawer.hidden = false; requestAnimationFrame(function () { drawer.classList.add("is-open"); }); document.body.classList.add("drawer-open"); $(".drawer-panel [data-cart-close]", drawer).focus(); }
  function closeDrawer() { if (!drawer || drawer.hidden) return; drawer.classList.remove("is-open"); document.body.classList.remove("drawer-open"); setTimeout(function () { drawer.hidden = true; }, reduce ? 0 : 450); if (lastFocus) lastFocus.focus(); }

  /* Tìm kiếm nhanh (gõ không dấu vẫn tìm được) */
  var search = $("[data-search]"), sq = $("[data-search-q]"), sList = $("[data-search-list]"), sEmpty = $("[data-search-empty]");
  var CATN = { "chup-tai": "chup tai over ear", "nhet-tai": "nhet tai true wireless tws earbuds", "the-thao": "the thao chay bo tai mo", gaming: "gaming choi game", "di-dong": "loa di dong bluetooth", tiec: "loa tiec karaoke party", "gia-dinh": "loa thanh soundbar tv xem phim" };
  function openSearch() { if (!search) return; lastFocus = document.activeElement; search.hidden = false; document.body.classList.add("drawer-open"); sq.value = ""; runSearch(); setTimeout(function () { sq.focus(); }, 30); }
  function closeSearch() { if (!search || search.hidden) return; search.hidden = true; document.body.classList.remove("drawer-open"); if (lastFocus) lastFocus.focus(); }
  function runSearch() {
    var q = norm(sq.value.trim()), words = q.split(/\s+/).filter(Boolean);
    var list = PRODUCTS.filter(function (p) {
      var hay = norm([p.name, p.type, p.kind === "loa" ? "loa speaker" : "tai nghe headphone", CATN[p.cat], p.anc ? "chong on anc" : "", p.ip || "", p.ip ? "chong nuoc" : ""].join(" "));
      var toks = hay.split(/[^a-z0-9]+/);
      return words.every(function (w) { return toks.some(function (t) { return t.indexOf(w) === 0; }); });
    });
    if (!q) list = PRODUCTS.slice(0, 6);
    sList.innerHTML = list.map(function (p) { return '<li><a href="' + p.slug + '.html"><img src="assets/img/' + p.img + '" alt="" width="64" height="48"><span><strong>' + escH(p.name) + "</strong><small>" + escH(p.type) + "</small></span><b>" + vnd(p.price) + "</b></a></li>"; }).join("");
    sEmpty.hidden = list.length > 0;
  }
  if (search) {
    sq.addEventListener("input", runSearch);
    document.addEventListener("click", function (e) { if (e.target.closest("[data-search-open]")) openSearch(); if (e.target.closest("[data-search-close]")) closeSearch(); });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && search && search.hidden && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); return; }
    if (e.key !== "Escape") return;
    if (search && !search.hidden) { closeSearch(); return; }
    if (drawer && !drawer.hidden) { closeDrawer(); return; }
    var open = drops.filter(function (d) { return d.classList.contains("is-open"); })[0];
    if (open) { setDrop(open, false); $("[data-drop-toggle]", open).focus(); return; }
    if (toggle && toggle.getAttribute("aria-expanded") === "true") { setNav(false); toggle.focus(); }
  });

  /* Trang sản phẩm: màu, thanh mua dính */
  var pd = $("[data-pd]");
  if (pd) {
    var p = bySlug(pd.getAttribute("data-slug")), colorIdx = 0;
    $$("[data-color]", pd).forEach(function (r) {
      r.addEventListener("change", function () {
        colorIdx = Number(r.getAttribute("data-color"));
        $$("[data-color-img]", pd).forEach(function (im, k) { im.classList.toggle("is-on", k === colorIdx); });
        $("[data-color-name]", pd).textContent = p.colors[colorIdx][0];
        var bi = $("[data-buybar-img]"); if (bi) bi.src = "assets/img/" + p.colors[colorIdx][1];
      });
    });
    $$("[data-pd-add]").forEach(function (b) { b.addEventListener("click", function () { addCart(p.slug, colorIdx); }); });
    var bar = $("[data-buybar]"), buy = $(".pd-actions", pd);
    var bio = bar && io(function (es) {
      var show = !es[0].isIntersecting && es[0].boundingClientRect.top < 0;
      bar.classList.toggle("is-on", show); bar.setAttribute("aria-hidden", String(!show)); $("button", bar).tabIndex = show ? 0 : -1;
    });
    if (bio) bio.observe(buy);
  }

  /* Thanh toán, mã giảm giá */
  var co = $("[data-checkout]"), promo = null;
  var CODES = {
    BEAT200: function (t) { return t.sub >= 2000000 ? [200000, "Giảm 200.000đ"] : [0, "Mã BEAT200 áp dụng cho đơn từ 2.000.000đ"]; },
    COMBO10: function (t) { return t.count >= 2 ? [Math.min(800000, Math.round(t.sub * .1)), "Giảm 10% cho đơn từ 2 sản phẩm"] : [0, "Mã COMBO10 cần ít nhất 2 sản phẩm trong giỏ"]; },
    SV15: function (t) { return [Math.round(t.sub * .15), "Giảm 15% cho sinh viên, xuất trình thẻ khi nhận hàng"]; }
  };
  function updateSum() {
    if (!co) return;
    var t = totals(), d = 0, msg = $("[data-promo-msg]", co);
    if (promo) { var r = CODES[promo](t); d = r[0]; msg.textContent = r[1]; msg.className = "promo-msg " + (d ? "is-ok" : "is-bad"); }
    var ship = $('input[name="ship"]:checked', co).value === "giao" && t.sub - d < FREE && t.count ? 30000 : 0;
    $("[data-discount-row]", co).hidden = !d; $("[data-discount]", co).textContent = "-" + vnd(d);
    $("[data-ship-fee]", co).textContent = ship ? vnd(ship) : "Miễn phí";
    $("[data-grand]", co).textContent = vnd(Math.max(0, t.sub - d + ship));
  }
  if (co) {
    var addrF = $("[data-addr]", co), phoneOk = function (v) { return /^0\d{9}$/.test(v.replace(/[\s.\-()]/g, "").replace(/^\+84/, "0")); };
    var ship = function () { var g = $('input[name="ship"]:checked', co).value === "giao"; addrF.hidden = !g; co.elements.address.required = g; updateSum(); };
    $$("[data-ship]", co).forEach(function (r) { r.addEventListener("change", ship); }); ship();
    $("[data-promo-apply]", co).addEventListener("click", function () {
      var v = $("[data-promo-input]", co).value.trim().toUpperCase(), msg = $("[data-promo-msg]", co);
      if (!v) { promo = null; msg.textContent = ""; updateSum(); return; }
      if (!CODES[v]) { promo = null; msg.textContent = "Mã " + v + " không tồn tại hoặc đã hết hạn."; msg.className = "promo-msg is-bad"; updateSum(); return; }
      promo = v; updateSum();
    });
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
      var data = { items: cart(), code: promo }; new FormData(co).forEach(function (v, k) { data[k] = String(v).trim(); });
      var req = ep ? fetch(ep, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(function (r) { if (!r.ok) throw new Error(r.status); }) : new Promise(function (r) { setTimeout(r, 900); }); // chưa có máy chủ: mô phỏng
      req.then(function () {
        $("[data-co-code]", co).textContent = "#BB" + String(Date.now()).slice(-6);
        $("[data-co-phone]", co).textContent = data.phone;
        co.classList.add("is-done"); $("[data-co-body]", co).hidden = true; var d = $("[data-co-done]", co); d.hidden = false; d.focus();
        store.set(KK, []); renderCart();
      }).catch(function () { err.hidden = false; }).then(function () { btn.disabled = false; btn.classList.remove("is-loading"); });
    });
  }

  /* ------------------------------------------------------------ Phòng nghe thử (Web Audio) */
  var lab = $("[data-lab]");
  if (lab) (function () {
    var AC = window.AudioContext || window.webkitAudioContext;
    var playBtn = $("[data-lab-play]", lab), sel = $("[data-lab-product]", lab), stateEl = $("[data-lab-state]", lab);
    var noiseT = $("[data-lab-noise]", lab), ancT = $("[data-lab-anc]", lab), dbEl = $("[data-lab-db]", lab);
    var sliders = { bass: $('[data-eq="bass"]', lab), mid: $('[data-eq="mid"]', lab), treble: $('[data-eq="treble"]', lab) };
    var canvas = $("[data-lab-canvas]", lab), g2 = canvas.getContext("2d");
    var ctx, eq = {}, analyser, music, noiseGain, noiseHP, noiseSrc, timer, raf, step = 0, nextT = 0, playing = false;
    var BPM = 96, S16 = 60 / BPM / 4;
    var ROOTS = [55, 43.65, 65.41, 49]; // A1 F1 C2 G1
    var CHORDS = [[220, 261.63, 329.63], [174.61, 220, 261.63], [196, 261.63, 329.63], [196, 246.94, 293.66]];
    var noiseBuf;
    function init() {
      ctx = new AC();
      var comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4;
      var master = ctx.createGain(); master.gain.value = .7;
      eq.bass = ctx.createBiquadFilter(); eq.bass.type = "lowshelf"; eq.bass.frequency.value = 120;
      eq.mid = ctx.createBiquadFilter(); eq.mid.type = "peaking"; eq.mid.frequency.value = 1000; eq.mid.Q.value = .8;
      eq.treble = ctx.createBiquadFilter(); eq.treble.type = "highshelf"; eq.treble.frequency.value = 6000;
      music = ctx.createGain(); music.gain.value = .55;
      analyser = ctx.createAnalyser(); analyser.fftSize = 512; analyser.smoothingTimeConstant = .78; analyser.minDecibels = -105; analyser.maxDecibels = -22;
      music.connect(eq.bass); eq.bass.connect(eq.mid); eq.mid.connect(eq.treble); eq.treble.connect(analyser);
      analyser.connect(comp); comp.connect(master); master.connect(ctx.destination);
      var len = ctx.sampleRate * 2; noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
      var d = noiseBuf.getChannelData(0), last = 0;
      for (var i = 0; i < len; i++) { var w = Math.random() * 2 - 1; last = (last + .02 * w) / 1.02; d[i] = last * 3.5 + w * .08; } // tiếng ồn nâu, trầm như tiếng xe
      noiseHP = ctx.createBiquadFilter(); noiseHP.type = "highpass"; noiseHP.frequency.value = 20;
      noiseGain = ctx.createGain(); noiseGain.gain.value = 0;
      noiseHP.connect(noiseGain); noiseGain.connect(analyser);
      noiseSrc = ctx.createBufferSource(); noiseSrc.buffer = noiseBuf; noiseSrc.loop = true; noiseSrc.connect(noiseHP); noiseSrc.start();
      applyEq(); applyNoise();
    }
    function env(g, t, a, peak, dec) { g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(.0001, t + dec); }
    function kick(t) { var o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(42, t + .14); env(g, t, .004, 1, .4); o.connect(g); g.connect(music); o.start(t); o.stop(t + .45); }
    function noiseHit(t, type, f, peak, dec) { var s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = noiseBuf; fl.type = type; fl.frequency.value = f; env(g, t, .002, peak, dec); s.connect(fl); fl.connect(g); g.connect(music); s.start(t, Math.random()); s.stop(t + dec + .05); }
    function snare(t) { noiseHit(t, "bandpass", 1900, .7, .2); var o = ctx.createOscillator(), g = ctx.createGain(); o.type = "triangle"; o.frequency.value = 185; env(g, t, .002, .35, .12); o.connect(g); g.connect(music); o.start(t); o.stop(t + .15); }
    function hat(t, open) { noiseHit(t, "highpass", 7500, open ? .22 : .14, open ? .18 : .05); }
    function bass(t, f) { var o = ctx.createOscillator(), fl = ctx.createBiquadFilter(), g = ctx.createGain(); o.type = "sawtooth"; o.frequency.value = f; fl.type = "lowpass"; fl.frequency.value = 380; env(g, t, .01, .45, S16 * 3.2); o.connect(fl); fl.connect(g); g.connect(music); o.start(t); o.stop(t + S16 * 3.5); }
    function pad(t, notes) { notes.forEach(function (f) { var o = ctx.createOscillator(), g = ctx.createGain(); o.type = "triangle"; o.frequency.value = f; g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(.06, t + .08); g.gain.linearRampToValueAtTime(.0001, t + S16 * 15); o.connect(g); g.connect(music); o.start(t); o.stop(t + S16 * 16); }); }
    function schedule() {
      while (nextT < ctx.currentTime + .12) {
        var s = step % 16, bar = Math.floor(step / 16) % 4;
        if (s === 0 || s === 10 || (s === 7 && bar % 2)) kick(nextT);
        if (s === 4 || s === 12) snare(nextT);
        if (s % 2 === 0) hat(nextT, s === 14); else if (Math.random() < .3) hat(nextT, false);
        if (s === 0 || s === 3 || s === 8 || s === 11) bass(nextT, ROOTS[bar] * (s === 11 ? 1.5 : 1));
        if (s === 0) pad(nextT, CHORDS[bar]);
        nextT += S16; step++;
      }
    }
    function draw() {
      var w = canvas.clientWidth, h = canvas.clientHeight, dpr = Math.min(2, devicePixelRatio || 1);
      if (canvas.width !== Math.round(w * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); }
      var data = new Uint8Array(analyser.frequencyBinCount); analyser.getByteFrequencyData(data);
      g2.setTransform(dpr, 0, 0, dpr, 0, 0); g2.clearRect(0, 0, w, h);
      var n = 56, gap = 4, bw = (w - 48 - gap * (n - 1)) / n;
      for (var i = 0; i < n; i++) {
        var v = Math.min(1, data[Math.min(data.length - 1, Math.floor(2 * Math.pow(45, i / (n - 1))))] / 255 * (1 + i / n * .6)), bh = Math.max(3, v * (h - 90));
        g2.fillStyle = "rgba(255," + Math.round(51 + v * 60) + ",0," + (.35 + v * .65) + ")";
        g2.beginPath(); if (g2.roundRect) g2.roundRect(24 + i * (bw + gap), (h - 40) / 2 - bh / 2, bw, bh, 3); else g2.rect(24 + i * (bw + gap), (h - 40) / 2 - bh / 2, bw, bh); g2.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    function start() {
      if (!AC) { stateEl.textContent = "Trình duyệt không hỗ trợ Web Audio"; return; }
      if (!ctx) init();
      ctx.resume(); playing = true; step = 0; nextT = ctx.currentTime + .06;
      timer = setInterval(schedule, 25); schedule(); draw();
      lab.classList.add("is-playing"); playBtn.setAttribute("aria-pressed", "true"); $("span", playBtn).textContent = "Dừng"; $("i", playBtn).className = "ph-light ph-pause"; stateEl.textContent = "Đang phát";
    }
    function stop() {
      playing = false; clearInterval(timer); cancelAnimationFrame(raf);
      if (ctx) ctx.suspend();
      lab.classList.remove("is-playing"); playBtn.setAttribute("aria-pressed", "false"); $("span", playBtn).textContent = "Phát beat"; $("i", playBtn).className = "ph-light ph-play"; stateEl.textContent = "Đang dừng";
      g2.clearRect(0, 0, canvas.width, canvas.height);
    }
    playBtn.addEventListener("click", function () { if (playing) stop(); else start(); });
    function applyEq() {
      Object.keys(sliders).forEach(function (k) {
        var v = Number(sliders[k].value); $('[data-eq-out="' + k + '"]', lab).textContent = (v > 0 ? "+" : "") + v + " dB";
        if (ctx) eq[k].gain.setTargetAtTime(v, ctx.currentTime, .05);
      });
    }
    Object.keys(sliders).forEach(function (k) { sliders[k].addEventListener("input", applyEq); });
    function ancAmount() { var o = sel.selectedOptions[0], p = PRODUCTS.filter(function (x) { return x.name === o.textContent; })[0]; return p && p.slug === "pulse-pro" ? 45 : 42; }
    function applyNoise() {
      var on = noiseT.checked, anc = ancT.checked && !ancT.disabled;
      if (ctx) {
        noiseGain.gain.setTargetAtTime(on ? (anc ? .05 : .5) : 0, ctx.currentTime, .12);
        noiseHP.frequency.setTargetAtTime(anc ? 900 : 20, ctx.currentTime, .12);
      }
      dbEl.textContent = !on ? "Ồn xung quanh: tắt" : anc ? "Còn khoảng " + (74 - ancAmount()) + " dB sau khi chống ồn (giảm " + ancAmount() + " dB)" : "Ồn xung quanh khoảng 74 dB, như đứng cạnh đường đông xe";
    }
    noiseT.addEventListener("change", function () { if (noiseT.checked && !playing) start(); applyNoise(); });
    ancT.addEventListener("change", applyNoise);
    function pick() {
      var o = sel.selectedOptions[0], v = o.value.split(",").map(Number);
      ["bass", "mid", "treble"].forEach(function (k, i) { sliders[k].value = v[i]; fillRange(sliders[k]); });
      var hasAnc = o.getAttribute("data-anc") === "1" || sel.selectedIndex === 0;
      ancT.disabled = !hasAnc; if (!hasAnc) ancT.checked = false;
      ancT.closest(".switch").lastElementChild.textContent = hasAnc ? "Bật chống ồn" : "Sản phẩm này không có chống ồn";
      applyEq(); applyNoise();
    }
    sel.addEventListener("change", pick);
    var sp = bySlug(new URLSearchParams(location.search).get("sp") || "");
    if (sp) $$("option", sel).forEach(function (o, i) { if (o.textContent === sp.name) sel.selectedIndex = i; });
    pick();
    document.addEventListener("visibilitychange", function () { if (document.hidden && playing) stop(); });
  })();

  /* ------------------------------------------------------------ Chọn giúp tôi */
  var fd = $("[data-finder]");
  if (fd) {
    var steps = $$(".fq", fd), bar2 = $("[data-finder-bar]", fd), res = $("[data-finder-result]", fd), si = 0;
    var showStep = function (i) { si = i; steps.forEach(function (s, k) { s.hidden = k !== i; }); bar2.style.width = ((i + 1) / (steps.length + 1) * 100) + "%"; var f = $("input:checked", steps[i]) || $("input", steps[i]); if (f && i) f.focus({ preventScroll: true }); };
    var val = function (n) { var c = $('input[name="' + n + '"]:checked', fd); return c ? c.value : ""; };
    var WHY = { anc: "có chống ồn", ip: "chống nước", pin: "pin lâu", bass: "bass mạnh" };
    function score(p) {
      var s = p.rating, why = [], use = val("use"), form = val("form"), budget = Number(val("budget") || 99000000), need = val("need");
      if (form && p.kind !== form) s -= 100;
      if (p.price <= budget) s += 3; else s -= 8 + (p.price - budget) / 500000;
      if (use === "di-chuyen") { if (p.anc) { s += 5; why.push("chống ồn khi đi đường"); } if (p.cat === "nhet-tai" || p.cat === "chup-tai") s += 2; if (p.kind === "loa") s -= 6; }
      if (use === "tap") { if (p.cat === "the-thao") { s += 6; why.push("thiết kế cho tập luyện"); } if (p.ip) s += 2; if (p.cat === "gia-dinh" || p.cat === "tiec" || p.cat === "gaming" || p.slug === "studio-m1") s -= 5; }
      if (use === "game") { if (p.cat === "gaming") { s += 7; why.push("độ trễ thấp, âm thanh vòm"); } if (p.slug === "pulse-mini") { s += 2; why.push("chế độ game 60 ms"); } if (p.kind === "loa" && p.cat !== "gia-dinh") s -= 4; }
      if (use === "nha") { if (p.cat === "gia-dinh") { s += 6; why.push("hợp phòng khách, xem phim"); } if (p.slug === "studio-m1" || p.slug === "aura-max") s += 2; if (p.cat === "the-thao") s -= 4; }
      if (use === "tiec") { if (p.cat === "tiec") { s += 7; why.push("đèn, micro, âm lượng lớn"); } if (p.cat === "di-dong") { s += 4; why.push("mang đi dã ngoại"); } if (p.kind === "tai-nghe") s -= 6; }
      if (need === "anc") { if (p.anc) { s += 4; why.push("chống ồn chủ động"); } else s -= 1; }
      if (need === "pin") { s += (p.battery || 0) / 15; if (p.battery >= 40) why.push(p.battery + " giờ pin"); }
      if (need === "nuoc") { if (p.ip) { s += 4; why.push("chống nước " + p.ip); } else s -= 2; }
      if (need === "bass") { s += p.eq[0] / 1.5; if (p.eq[0] >= 5) why.push("bass mạnh"); }
      return { p: p, s: s, why: why.filter(function (x, i, a) { return a.indexOf(x) === i; }).slice(0, 2) };
    }
    function finish() {
      var ranked = PRODUCTS.map(score).sort(function (a, b) { return b.s - a.s; }).slice(0, 3);
      $("[data-finder-cards]", fd).innerHTML = ranked.map(function (r, i) {
        return '<a class="fr-card' + (i ? "" : " is-top") + '" href="' + r.p.slug + '.html"><img src="assets/img/' + r.p.img + '" alt="" width="400" height="320">' + (i ? "" : '<span class="fr-rank">Hợp nhất</span>') + "<strong>" + escH(r.p.name) + "</strong><span>" + vnd(r.p.price) + "</span><em>" + escH(r.why.length ? "Vì " + r.why.join(", ") : r.p.type) + "</em></a>";
      }).join("");
      steps.forEach(function (s) { s.hidden = true; }); bar2.style.width = "100%"; res.hidden = false; res.focus();
    }
    fd.addEventListener("change", function (e) { if (e.target.type !== "radio") return; setTimeout(function () { if (si < steps.length - 1) showStep(si + 1); else finish(); }, reduce ? 0 : 220); });
    $$("[data-finder-back]", fd).forEach(function (b) { b.addEventListener("click", function () { showStep(Math.max(0, si - 1)); }); });
    $("[data-finder-again]", fd).addEventListener("click", function () { fd.reset(); res.hidden = true; showStep(0); });
    showStep(0);
  }

  /* Đếm ngược Sale */
  var cd = $("[data-countdown]");
  if (cd) {
    var end = new Date(cd.getAttribute("data-countdown")).getTime();
    var tick = function () {
      var ms = end - Date.now();
      if (ms <= 0) { $$("p:not([data-cd-done])", cd).forEach(function (p) { p.hidden = true; }); $("[data-cd-done]", cd).hidden = false; return; }
      var s = Math.floor(ms / 1000), set = function (k, v) { $('[data-cd="' + k + '"]', cd).textContent = String(v).padStart(2, "0"); };
      set("d", Math.floor(s / 86400)); set("h", Math.floor(s % 86400 / 3600)); set("m", Math.floor(s % 3600 / 60)); set("s", s % 60);
      setTimeout(tick, 1000);
    };
    tick();
  }

  /* Sao chép mã giảm giá */
  $$("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.getAttribute("data-copy"), done = function () { b.classList.add("is-copied"); toast("Đã sao chép mã " + v); setTimeout(function () { b.classList.remove("is-copied"); }, 1800); };
      if (navigator.clipboard) navigator.clipboard.writeText(v).then(done, function () { toast("Mã của bạn: " + v); }); else toast("Mã của bạn: " + v);
    });
  });

  /* Tra cứu bảo hành: BB + YYMM (tháng mua) + 4 số */
  var wf = $("[data-warranty]");
  if (wf) {
    wf.addEventListener("submit", function (e) {
      e.preventDefault();
      var inp = $("[data-w-serial]", wf), v = inp.value.replace(/\s/g, "").toUpperCase(), err = $("#w-err"), out = $("[data-w-result]", wf), f = inp.closest(".field");
      var m = v.match(/^BB(\d{2})(\d{2})(\d{4})$/);
      if (!m || Number(m[2]) < 1 || Number(m[2]) > 12) { f.classList.add("has-error"); inp.setAttribute("aria-invalid", "true"); err.textContent = "Số serial gồm BB và 8 chữ số, ví dụ BB26091234."; out.hidden = true; inp.focus(); return; }
      f.classList.remove("has-error"); inp.setAttribute("aria-invalid", "false"); err.textContent = "";
      var y = 2000 + Number(m[1]), mo = Number(m[2]), bought = new Date(y, mo - 1, 15), now = new Date();
      if (bought > now || y < 2023) { out.innerHTML = "<h3>Không tìm thấy số serial này</h3><p class=\"muted\">Kiểm tra lại dưới đáy hộp, hoặc gửi ảnh tem qua Zalo để nhân viên tra giúp.</p>"; out.hidden = false; return; }
      var p = PRODUCTS[Number(m[3]) % PRODUCTS.length], until = new Date(y + 1, mo - 1, 15), okW = until > now;
      out.innerHTML = "<h3>" + escH(p.name) + "</h3><p>Mua tháng " + String(mo).padStart(2, "0") + "/" + y + "</p><p class=\"" + (okW ? "ok" : "muted") + "\">" + (okW ? "Còn bảo hành đến 15/" + String(mo).padStart(2, "0") + "/" + (y + 1) : "Đã hết bảo hành từ 15/" + String(mo).padStart(2, "0") + "/" + (y + 1) + ". Vẫn sửa chữa có phí tại cửa hàng.") + "</p>";
      out.hidden = false;
    });
  }

  /* Đăng ký nhận tin */
  $$("[data-news]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault(); var v = f.elements.email.value.trim(), m = $(".news-msg", f);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { m.textContent = "Email chưa đúng, ví dụ ten@gmail.com."; f.elements.email.focus(); return; }
      m.textContent = "Đã đăng ký. Thư đầu tiên đến vào đầu tháng tới."; f.reset();
    });
  });

  /* Nút cuộn ngang */
  $$("[data-scroll-ctrl]").forEach(function (ctrl) {
    var track = document.getElementById(ctrl.getAttribute("data-scroll-ctrl")); if (!track) return;
    $$("button", ctrl).forEach(function (b) { b.addEventListener("click", function () { track.scrollBy({ left: (b.hasAttribute("data-dir-next") ? 1 : -1) * track.clientWidth * .7, behavior: reduce ? "auto" : "smooth" }); }); });
  });

  /* Mục lục bài viết */
  var tocLinks = $$(".article-toc ol a");
  if (tocLinks.length) {
    var tio = io(function (es) { es.forEach(function (en) { if (en.isIntersecting) tocLinks.forEach(function (a) { a.classList.toggle("is-on", a.getAttribute("href") === "#" + en.target.id); }); }); }, { rootMargin: "0px 0px -70% 0px" });
    if (tio) tocLinks.forEach(function (a) { var t = document.getElementById(a.getAttribute("href").slice(1)); if (t) tio.observe(t); });
  }

  /* Hiện dần, biểu đồ pin chạy khi cuộn tới */
  var rio = !reduce && io(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add(en.target.classList.contains("reveal") ? "is-visible" : "is-in"); rio.unobserve(en.target); } }); }, { rootMargin: "0px 0px -8% 0px", threshold: .08 });
  $$(".reveal").forEach(function (el) {
    var sib = $$(":scope > .reveal", el.parentElement); el.style.setProperty("--i", String(Math.min(4, sib.indexOf(el))));
    if (rio) rio.observe(el); else el.classList.add("is-visible");
  });
  $$("[data-bchart]").forEach(function (el) { if (rio) rio.observe(el); else el.classList.add("is-in"); });

  renderCart(); renderCompare();
  $$("[data-year]").forEach(function (y) { y.textContent = String(new Date().getFullYear()); });
})();
