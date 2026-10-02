/* Nhã An Thời - main.js (vanilla, dùng chung cho mọi trang) */
(function () {
  "use strict";
  document.documentElement.classList.add("js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var desktop = window.matchMedia("(min-width: 1100px)");
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var vnd = function (n) { return Number(n).toLocaleString("de-DE") + "đ"; };
  var escHtml = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  /* Header đổi nền khi cuộn */
  var header = $("[data-header]");
  if (header && "IntersectionObserver" in window) {
    var sentinel = document.createElement("div");
    sentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;height:24px;pointer-events:none";
    sentinel.setAttribute("aria-hidden", "true");
    document.body.prepend(sentinel);
    new IntersectionObserver(function (e) { header.classList.toggle("is-scrolled", !e[0].isIntersecting); }).observe(sentinel);
  }

  /* Menu mobile toàn màn hình */
  var nav = $("[data-nav]"), toggle = $("[data-nav-toggle]");
  function setNav(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("nav-open", open);
    $(".sr-only", toggle).textContent = open ? "Đóng menu" : "Mở menu";
  }
  if (toggle) {
    toggle.addEventListener("click", function () { setNav(toggle.getAttribute("aria-expanded") !== "true"); });
    desktop.addEventListener("change", function () { setNav(false); });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setNav(false); }); });
  }

  /* Menu thả xuống */
  var drops = $$(".has-drop");
  function setDrop(li, open) { li.classList.toggle("is-open", open); $("[data-drop-toggle]", li).setAttribute("aria-expanded", String(open)); }
  drops.forEach(function (li) {
    var btn = $("[data-drop-toggle]", li), timer;
    btn.addEventListener("click", function () { setDrop(li, !li.classList.contains("is-open")); });
    li.addEventListener("mouseenter", function () { if (desktop.matches) { clearTimeout(timer); setDrop(li, true); } });
    li.addEventListener("mouseleave", function () { if (desktop.matches) timer = setTimeout(function () { setDrop(li, false); }, 150); });
    li.addEventListener("focusout", function (e) { if (desktop.matches && !li.contains(e.relatedTarget)) setDrop(li, false); });
  });
  document.addEventListener("click", function (e) { if (desktop.matches && !e.target.closest(".has-drop")) drops.forEach(function (d) { setDrop(d, false); }); });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var open = drops.filter(function (d) { return d.classList.contains("is-open"); })[0];
    if (open) { setDrop(open, false); $("[data-drop-toggle]", open).focus(); return; }
    if (toggle && toggle.getAttribute("aria-expanded") === "true") { setNav(false); toggle.focus(); }
  });

  /* Dịp mặc: rê chuột, focus hoặc cuộn tới dòng nào thì ảnh vòm đổi theo */
  $$("[data-occ]").forEach(function (box) {
    var imgs = $$("[data-occ-img]", box), items = $$("[data-occ-item]", box);
    function show(i) {
      imgs.forEach(function (im, k) { im.classList.toggle("is-on", k === i); });
      items.forEach(function (it, k) { it.classList.toggle("is-on", k === i); });
    }
    items.forEach(function (it, i) {
      it.addEventListener("mouseenter", function () { show(i); });
      it.addEventListener("focusin", function () { show(i); });
    });
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (en) { if (en.isIntersecting && !box.matches(":hover")) show(Number(en.target.getAttribute("data-occ-item"))); });
      }, { rootMargin: "-45% 0px -45% 0px" });
      items.forEach(function (it) { io.observe(it); });
    }
    show(0);
  });

  /* Giá móc treo áo mới: nút cuộn */
  var track = $("[data-rail-track]");
  if (track) {
    var go = function (d) { track.scrollBy({ left: d * Math.min(track.clientWidth * 0.8, 620), behavior: reduce ? "auto" : "smooth" }); };
    var prev = $("[data-rail-prev]"), next = $("[data-rail-next]");
    if (prev) prev.addEventListener("click", function () { go(-1); });
    if (next) next.addEventListener("click", function () { go(1); });
  }

  /* Túi thử đồ: lưu trong trình duyệt của khách (localStorage, có dự phòng khi bị chặn) */
  var KEY = "nat-bag", memBag = [];
  function readBag() { try { var v = JSON.parse(localStorage.getItem(KEY) || "[]"); return Array.isArray(v) ? v : []; } catch (e) { return memBag; } }
  function writeBag(list) { memBag = list; try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} renderBag(); }
  var toast = $("[data-toast]"), toastTimer;
  function say(msg) { if (!toast) return; toast.textContent = msg; toast.classList.add("is-on"); clearTimeout(toastTimer); toastTimer = setTimeout(function () { toast.classList.remove("is-on"); }, 2600); }
  function renderBag() {
    var bag = readBag();
    $$("[data-bag-count]").forEach(function (c) { c.textContent = String(bag.length); c.classList.toggle("has", bag.length > 0); });
    $$("[data-bag-add]").forEach(function (b) {
      var on = bag.some(function (x) { return x.slug === b.getAttribute("data-slug"); });
      b.classList.toggle("is-in", on); b.setAttribute("aria-pressed", String(on));
      $("span", b).textContent = on ? "Đã có trong túi thử" : "Thêm vào túi thử";
    });
    $$("[data-bag-panel]").forEach(function (panel) {
      var list = $("[data-bag-list]", panel), empty = $("[data-bag-empty]", panel), field = $("[data-bag-field]", panel);
      list.innerHTML = bag.map(function (x) {
        return '<li><img src="assets/img/' + escHtml(x.img) + '" alt="" width="60" height="84"><a href="' + escHtml(x.slug) + '.html">' + escHtml(x.name) + "</a><span>" + vnd(x.price) + '</span><button type="button" data-bag-remove="' + escHtml(x.slug) + '" aria-label="Bỏ ' + escHtml(x.name) + ' khỏi túi thử"><i class="ph-light ph-x" aria-hidden="true"></i></button></li>';
      }).join("");
      empty.hidden = bag.length > 0;
      field.value = bag.map(function (x) { return x.name; }).join("; ");
    });
  }
  document.addEventListener("click", function (e) {
    var add = e.target.closest("[data-bag-add]");
    if (add) {
      var slug = add.getAttribute("data-slug"), bag = readBag();
      if (bag.some(function (x) { return x.slug === slug; })) { writeBag(bag.filter(function (x) { return x.slug !== slug; })); say("Đã bỏ khỏi túi thử"); }
      else if (bag.length >= 12) say("Túi thử tối đa 12 mẫu cho một buổi thử");
      else { bag.push({ slug: slug, name: add.getAttribute("data-name"), img: add.getAttribute("data-img"), price: Number(add.getAttribute("data-price")) }); writeBag(bag); say("Đã thêm vào túi thử (" + bag.length + " mẫu)"); }
      return;
    }
    var rm = e.target.closest("[data-bag-remove]");
    if (rm) { var s = rm.getAttribute("data-bag-remove"); writeBag(readBag().filter(function (x) { return x.slug !== s; })); }
  });
  renderBag();

  /* Lọc theo chip + sắp xếp theo giá */
  $$("[data-filter-scope]").forEach(function (scope) {
    var key = scope.getAttribute("data-filter-key") || "col";
    var chips = $$("[data-filter-value]", scope), grid = $("[data-filter-target]", scope), empty = $("[data-empty]", scope), sort = $("[data-sort]", scope);
    var items = $$("[data-filter-target] > *", scope), original = items.slice();
    function apply(v) {
      var shown = 0;
      chips.forEach(function (c) { var on = c.getAttribute("data-filter-value") === v; c.classList.toggle("is-active", on); c.setAttribute("aria-pressed", String(on)); });
      items.forEach(function (it) { var ok = v === "all" || it.getAttribute("data-" + key) === v; it.hidden = !ok; if (ok) shown++; });
      if (empty) empty.hidden = shown > 0;
    }
    chips.forEach(function (c) { c.addEventListener("click", function () { apply(c.getAttribute("data-filter-value")); }); });
    if (sort) sort.addEventListener("change", function () {
      var list = original.slice();
      if (sort.value !== "default") list.sort(function (a, b) { var d = Number(a.getAttribute("data-price")) - Number(b.getAttribute("data-price")); return sort.value === "asc" ? d : -d; });
      list.forEach(function (el) { grid.appendChild(el); });
    });
    var q = new URLSearchParams(location.search).get("dip");
    if (q && $('[data-filter-value="' + q + '"]', scope)) apply(q);
  });

  /* Gợi ý size theo chiều cao, cân nặng */
  var SIZES = {
    nu: [["S", 46, "Vòng ngực 78-82 cm, vòng eo 62-66 cm."], ["M", 52, "Vòng ngực 82-86 cm, vòng eo 66-70 cm."], ["L", 58, "Vòng ngực 86-90 cm, vòng eo 70-74 cm."], ["XL", 64, "Vòng ngực 90-95 cm, vòng eo 74-79 cm."], ["XXL", 72, "Vòng ngực 95-100 cm, vòng eo 79-85 cm."], ["3XL", 999, "Vòng ngực 100-108 cm. Nhiều mẫu bà sui, áo tay loe có size này."]],
    nam: [["S", 57, "Vòng ngực 86-90 cm, rộng vai 40 cm."], ["M", 64, "Vòng ngực 90-95 cm, rộng vai 42 cm."], ["L", 72, "Vòng ngực 95-100 cm, rộng vai 44 cm."], ["XL", 80, "Vòng ngực 100-106 cm, rộng vai 46 cm."], ["XXL", 999, "Vòng ngực 106-112 cm, rộng vai 48 cm."]]
  };
  $$("[data-size-tool]").forEach(function (f) {
    var h = $("[data-sz-h]", f), w = $("[data-sz-w]", f), out = $("[data-sz-out]", f), note = $("[data-sz-note]", f);
    function calc() {
      var g = $('input[name="sz-g"]:checked', f).value, hv = Number(h.value), wv = Number(w.value), table = SIZES[g];
      $("[data-sz-h-out]", f).textContent = hv + " cm"; $("[data-sz-w-out]", f).textContent = wv + " kg";
      var i = 0; while (i < table.length - 1 && wv > table[i][1]) i++;
      if (g === "nu" && hv >= 166 && i < table.length - 1) i++;
      if (g === "nam" && hv >= 180 && i < table.length - 1) i++;
      out.textContent = table[i][0];
      note.textContent = table[i][2] + (hv >= 166 && g === "nu" ? " Người cao nên chọn mẫu tà dài." : "");
    }
    [h, w].forEach(function (el) { el.addEventListener("input", calc); });
    $$('input[name="sz-g"]', f).forEach(function (r) { r.addEventListener("change", calc); });
    calc();
  });

  /* Ngày hẹn không được ở quá khứ */
  var today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  var todayStr = today.toISOString().slice(0, 10);
  $$("[data-date-min]").forEach(function (d) { d.min = todayStr; });

  /* Form đặt lịch thử áo */
  var rules = {
    name: function (v) { return !v.trim() ? "Vui lòng nhập họ và tên." : v.trim().length < 2 ? "Họ tên cần ít nhất 2 ký tự." : ""; },
    phone: function (v) { var d = v.replace(/[\s.\-()]/g, "").replace(/^\+84/, "0"); return !d ? "Vui lòng nhập số điện thoại." : /^0\d{9}$/.test(d) ? "" : "Số điện thoại gồm 10 chữ số, ví dụ 0912 345 678."; },
    tryDate: function (v) { return !v ? "Chọn ngày bạn muốn đến thử." : v < todayStr ? "Ngày thử không được ở quá khứ." : ""; },
    eventDate: function (v, el, form) { if (!v) return ""; var t = form.elements.tryDate.value; return t && v < t ? "Ngày mặc phải sau ngày thử áo." : ""; }
  };
  $$("[data-form]").forEach(function (form) {
    var names = Object.keys(rules).filter(function (n) { return form.elements[n]; });
    var submit = $("[data-submit]", form), body = $("[data-form-body]", form), ok = $("[data-form-success]", form), fe = $("[data-form-error]", form);
    function validate(n) {
      var el = form.elements[n], msg = rules[n](el.value, el, form), field = el.closest(".field");
      field.classList.toggle("has-error", !!msg); el.setAttribute("aria-invalid", msg ? "true" : "false");
      var e = $(".error", field); if (e) e.textContent = msg; return !msg;
    }
    names.forEach(function (n) {
      var el = form.elements[n];
      el.addEventListener("blur", function () { if (el.value) validate(n); });
      el.addEventListener("change", function () { if (el.value) validate(n); });
      el.addEventListener("input", function () { if (el.closest(".field").classList.contains("has-error")) validate(n); });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault(); if (fe) fe.hidden = true;
      var bad = null; names.forEach(function (n) { if (!validate(n) && !bad) bad = form.elements[n]; });
      if (bad) { bad.focus(); return; }
      var data = {}; new FormData(form).forEach(function (v, k) { data[k] = String(v).trim(); });
      data.page = location.pathname.split("/").pop() || "index.html";
      submit.disabled = true; submit.classList.add("is-loading"); submit.setAttribute("aria-busy", "true");
      var ep = form.getAttribute("data-endpoint");
      var req = ep ? fetch(ep, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(function (r) { if (!r.ok) throw new Error(r.status); }) : new Promise(function (r) { setTimeout(r, 900); }); // chưa có máy chủ: mô phỏng gửi thành công
      req.then(function () {
        $("[data-success-name]", form).textContent = data.name;
        $("[data-success-phone]", form).textContent = data.phone;
        body.hidden = true; ok.hidden = false; ok.focus();
      }).catch(function () { if (fe) fe.hidden = false; })
        .then(function () { submit.disabled = false; submit.classList.remove("is-loading"); submit.removeAttribute("aria-busy"); });
    });
    var reset = $("[data-form-reset]", form);
    if (reset) reset.addEventListener("click", function () {
      form.reset(); $$(".field", form).forEach(function (f) { f.classList.remove("has-error"); });
      renderBag(); ok.hidden = true; body.hidden = false; form.elements.name.focus();
    });
  });

  /* Tiêu đề trồi lên từng từ: bọc mỗi từ trong span, giữ nguyên thẻ em */
  /* Trang chi tiết mẫu áo (body[data-calm]): không chạy hiệu ứng chữ, ảnh, parallax, hiện dần */
  var calm = document.body.hasAttribute("data-calm");
  var splitTargets = calm ? [] : $$("[data-split], .page-head h1, .col-hero h1, .pd-info h1, .article-head h1, .h2, .booking-info h2");
  splitTargets.forEach(function (h) {
    if (h.hasAttribute("data-split-done")) return;
    var n = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var parts = c.textContent.split(/(\s+)/), frag = document.createDocumentFragment();
          parts.forEach(function (t) {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(" ")); return; }
            var w = document.createElement("span"), inner = document.createElement("span");
            w.className = "w"; inner.textContent = t; inner.style.setProperty("--wi", String(n++));
            w.appendChild(inner); frag.appendChild(w);
          });
          c.parentNode.replaceChild(frag, c);
        } else if (c.nodeType === 1) walk(c);
      });
    })(h);
    h.setAttribute("data-split", ""); h.setAttribute("data-split-done", "");
    h.setAttribute("aria-label", h.textContent.replace(/\s+/g, " ").trim());
  });

  /* Ảnh vòm mở như vén rèm */
  if (!calm) $$(".arch-pair .arch, .story-media, .pd-media, .article-cover, .fabric-arch").forEach(function (el) { el.classList.add("unveil"); });
  /* Ảnh bị clip-path che kín thì IntersectionObserver không thấy, nên theo dõi phần tử cha rồi mở các ảnh bên trong */
  var inTargets = $$("[data-split]").concat($$(".unveil"));
  if (!reduce && "IntersectionObserver" in window) {
    var ioIn = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        (en.target._reveal || [en.target]).forEach(function (el) { el.classList.add("is-in"); });
        ioIn.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });
    inTargets.forEach(function (el) {
      if (!el.classList.contains("unveil")) { ioIn.observe(el); return; }
      var host = el.parentElement;
      (host._reveal = host._reveal || []).push(el);
      ioIn.observe(host);
    });
  } else inTargets.forEach(function (el) { el.classList.add("is-in"); });

  /* Thanh tiến độ đọc, parallax khung vòm, phần vải cuộn theo nhịp: dùng chung một vòng rAF */
  var bar = document.createElement("div"); bar.className = "scroll-progress"; bar.setAttribute("aria-hidden", "true"); document.body.appendChild(bar);
  var para = $$("[data-parallax]"), fab = $("[data-fabric]");
  var fabImgs = fab ? $$("[data-fab-img]", fab) : [], fabSteps = fab ? $$("[data-fab-step]", fab) : [], fabNo = fab ? $("[data-fab-no]", fab) : null, thread = fab ? $("[data-thread]", fab) : null;
  var fabIdx = -1;
  function setFab(i) {
    if (i === fabIdx) return; fabIdx = i;
    fabImgs.forEach(function (im, k) { im.classList.toggle("is-on", k === i); });
    fabSteps.forEach(function (st, k) { st.classList.toggle("is-on", k === i); });
    if (fabNo) fabNo.textContent = "0" + (i + 1);
  }
  var ticking = false;
  function frame() {
    ticking = false;
    var doc = document.documentElement, max = doc.scrollHeight - innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? scrollY / max : 0).toFixed(4) + ")";
    if (!reduce && !calm) para.forEach(function (el) {
      var r = el.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
      var mid = r.top + r.height / 2 - innerHeight / 2;
      el.style.translate = "0 " + (mid * Number(el.getAttribute("data-parallax"))).toFixed(1) + "px";
    });
    if (fab && desktop.matches) {
      var fr = fab.getBoundingClientRect(), span = fr.height - innerHeight;
      var p = span > 0 ? Math.min(1, Math.max(0, -fr.top / span)) : 0;
      setFab(Math.min(2, Math.floor(p * 3)));
      if (thread) thread.style.setProperty("--draw", (1 - p).toFixed(3));
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  frame();
  if (fab && "IntersectionObserver" in window) {
    var ioFab = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting && !desktop.matches) setFab(Number(en.target.getAttribute("data-fab-step"))); }); }, { rootMargin: "-40% 0px -40% 0px" });
    fabSteps.forEach(function (st) { ioFab.observe(st); });
  }
  if (fab) setFab(0);

  /* Hiện dần khi cuộn */
  var rv = $$(".reveal");
  if (!reduce && !calm && "IntersectionObserver" in window) {
    rv.forEach(function (el) { var sib = $$(":scope > .reveal", el.parentElement); el.style.setProperty("--i", String(Math.max(0, sib.indexOf(el)))); });
    var io2 = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); io2.unobserve(en.target); } }); }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
    rv.forEach(function (el) { io2.observe(el); });
  } else rv.forEach(function (el) { el.classList.add("is-visible"); });

  $$("[data-year]").forEach(function (y) { y.textContent = String(new Date().getFullYear()); });
})();
