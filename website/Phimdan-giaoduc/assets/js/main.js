/* Phím Đàn Piano Studio - main.js (vanilla, dùng chung cho mọi trang) */
(function () {
  "use strict";
  document.documentElement.classList.add("js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var desktop = window.matchMedia("(min-width: 1100px)");
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* Header đổ bóng khi cuộn */
  var header = $("[data-header]");
  if (header && "IntersectionObserver" in window) {
    var s = document.createElement("div");
    s.style.cssText = "position:absolute;top:0;left:0;width:1px;height:10px;pointer-events:none";
    s.setAttribute("aria-hidden", "true");
    document.body.prepend(s);
    new IntersectionObserver(function (e) { header.classList.toggle("is-scrolled", !e[0].isIntersecting); }).observe(s);
  }

  /* Menu mobile */
  var nav = $("[data-nav]"), toggle = $("[data-nav-toggle]");
  function setNav(open) {
    if (!nav) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("nav-open", open);
    toggle.querySelector(".sr-only").textContent = open ? "Đóng menu" : "Mở menu";
  }
  if (toggle) {
    toggle.addEventListener("click", function () { setNav(toggle.getAttribute("aria-expanded") !== "true"); });
    desktop.addEventListener("change", function () { setNav(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("is-open")) { setNav(false); toggle.focus(); } });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setNav(false); }); });
  }

  /* Menu thả xuống "Chương trình" */
  $$(".has-drop").forEach(function (li) {
    var btn = $("[data-drop-toggle]", li), timer;
    function set(open) { li.classList.toggle("is-open", open); btn.setAttribute("aria-expanded", String(open)); }
    btn.addEventListener("click", function () { set(!li.classList.contains("is-open")); });
    li.addEventListener("mouseenter", function () { if (desktop.matches) { clearTimeout(timer); set(true); } });
    li.addEventListener("mouseleave", function () { if (desktop.matches) timer = setTimeout(function () { set(false); }, 150); });
    li.addEventListener("focusout", function (e) { if (desktop.matches && !li.contains(e.relatedTarget)) set(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && li.classList.contains("is-open")) { set(false); btn.focus(); } });
    document.addEventListener("click", function (e) { if (desktop.matches && !li.contains(e.target)) set(false); });
  });

  /* Popup đăng ký */
  var modal = $("[data-modal]");
  var lastTrigger = null;
  function openModal(trigger) {
    if (!modal) return;
    lastTrigger = trigger || null;
    setNav(false);
    var form = $("[data-form]", modal);
    resetForm(form);
    if (trigger) {
      var branch = trigger.getAttribute("data-branch"), need = trigger.getAttribute("data-need");
      if (branch) $$("option", form.elements.branch).forEach(function (o) { if (o.textContent.indexOf(branch + ":") === 0) o.selected = true; });
      if (need) $$("option", form.elements.need).forEach(function (o) { if (o.textContent === need) o.selected = true; });
    }
    if (typeof modal.showModal === "function") modal.showModal(); else modal.setAttribute("open", "");
    setTimeout(function () { form.elements.name.focus(); }, 50);
  }
  function closeModal() {
    if (!modal) return;
    if (typeof modal.close === "function") modal.close(); else modal.removeAttribute("open");
  }
  if (modal) {
    modal.addEventListener("close", function () { if (lastTrigger) lastTrigger.focus(); });
    modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-open-register]");
    if (t) { e.preventDefault(); openModal(t); return; }
    if (e.target.closest("[data-close-modal]")) closeModal();
  });
  if (location.hash === "#dang-ky") openModal();

  /* Slider banner (không tự chạy, người dùng chủ động chuyển) */
  $$("[data-slider]").forEach(function (sl) {
    var slides = $$(".slide", sl), dots = $(".slider-dots", sl), i = 0;
    slides.forEach(function (_, n) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Banner " + (n + 1));
      b.addEventListener("click", function () { go(n); });
      dots.appendChild(b);
    });
    function go(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle("is-active", k === i); s.setAttribute("aria-hidden", String(k !== i)); $$("a,button", s).forEach(function (el) { el.tabIndex = k === i ? 0 : -1; }); });
      $$("button", dots).forEach(function (d, k) { d.setAttribute("aria-current", String(k === i)); });
    }
    $("[data-prev]", sl).addEventListener("click", function () { go(i - 1); });
    $("[data-next]", sl).addEventListener("click", function () { go(i + 1); });
    var x0 = null;
    sl.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    sl.addEventListener("touchend", function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1)); x0 = null; });
    go(0);
  });

  /* Bộ lọc dạng chip: [data-filter-scope] > [data-filter] chip [data-filter-value] + [data-filter-target] */
  $$("[data-filter-scope]").forEach(function (scope) {
    var chips = $$("[data-filter-value]", scope), items = $$("[data-filter-target] > *", scope), empty = $("[data-empty]", scope);
    var key = scope.getAttribute("data-filter-key") || "category";
    function apply(v) {
      var shown = 0;
      chips.forEach(function (c) { var on = c.getAttribute("data-filter-value") === v; c.classList.toggle("is-active", on); c.setAttribute("aria-pressed", String(on)); });
      items.forEach(function (it) { var ok = v === "all" || it.getAttribute("data-" + key) === v; it.hidden = !ok; if (ok) shown++; });
      if (empty) empty.hidden = shown > 0;
    }
    chips.forEach(function (c) { c.addEventListener("click", function () { apply(c.getAttribute("data-filter-value")); }); });
    var sel = $("[data-filter-select]", scope);
    if (sel) sel.addEventListener("change", function () { apply(sel.value); });
    var q = new URLSearchParams(location.search).get("loai");
    if (q && $('[data-filter-value="' + q + '"]', scope)) apply(q);
  });

  /* Tìm kiếm câu hỏi */
  var faqInput = $("[data-faq-search]");
  if (faqInput) {
    var faqs = $$(".faq-item"), groups = $$(".faq-group"), none = $("[data-faq-empty]");
    var norm = function (t) { return t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d"); };
    function search() {
      var q = norm(faqInput.value.trim()), shown = 0;
      faqs.forEach(function (f) { var ok = !q || norm(f.textContent).indexOf(q) > -1; f.hidden = !ok; if (ok) shown++; if (q && ok) f.open = true; });
      groups.forEach(function (g) { g.hidden = !$$(".faq-item:not([hidden])", g).length; });
      if (none) none.hidden = shown > 0;
    }
    faqInput.addEventListener("input", search);
    $$("[data-faq-suggest]").forEach(function (b) { b.addEventListener("click", function () { faqInput.value = b.textContent; search(); faqInput.focus(); }); });
  }

  /* Nút cuộn ngang (cột mốc, chi nhánh) */
  $$("[data-scroll-ctrl]").forEach(function (ctrl) {
    var track = document.getElementById(ctrl.getAttribute("data-scroll-ctrl"));
    $$("button", ctrl).forEach(function (b) {
      b.addEventListener("click", function () {
        var dir = b.hasAttribute("data-dir-next") ? 1 : -1;
        track.scrollBy({ left: dir * track.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
      });
    });
  });

  /* Danh sách chi nhánh: rê chuột hoặc focus vào dòng nào thì ảnh bên trái đổi theo */
  $$("[data-blist]").forEach(function (list) {
    var imgs = $$(".blist-media img", list), rows = $$(".blist-row", list);
    function show(i) {
      imgs.forEach(function (im, k) { im.classList.toggle("is-on", k === i); });
      rows.forEach(function (r, k) { r.classList.toggle("is-on", k === i); });
    }
    rows.forEach(function (r, i) {
      r.addEventListener("mouseenter", function () { show(i); });
      r.addEventListener("focusin", function () { show(i); });
    });
    show(0);
  });

  /* Hiện dần khi cuộn */
  var rv = $$(".reveal");
  if (!reduce && "IntersectionObserver" in window) {
    rv.forEach(function (el) { var sib = $$(":scope > .reveal", el.parentElement); el.style.setProperty("--i", String(Math.max(0, sib.indexOf(el)))); });
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } }); }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add("is-visible"); });

  /* Form */
  var rules = {
    name: function (v) { return !v.trim() ? "Vui lòng nhập họ và tên." : v.trim().length < 2 ? "Họ tên cần ít nhất 2 ký tự." : ""; },
    phone: function (v) {
      var d = v.replace(/[\s.\-()]/g, "").replace(/^\+84/, "0");
      if (!d) return "Vui lòng nhập số điện thoại.";
      return /^0\d{9}$/.test(d) ? "" : "Số điện thoại gồm 10 chữ số, ví dụ 0912 345 678.";
    },
    branch: function (v) { return v ? "" : "Vui lòng chọn chi nhánh."; },
    agree: function (v, el) { return el.checked ? "" : "Vui lòng đồng ý với điều khoản để tiếp tục."; }
  };
  function resetForm(form) {
    if (!form) return;
    form.reset();
    $$(".field", form).forEach(function (f) { f.classList.remove("has-error"); var e = $(".error", f); if (e) e.textContent = ""; });
    $("[data-form-body]", form).hidden = false;
    $("[data-form-success]", form).hidden = true;
    var fe = $("[data-form-error]", form); if (fe) fe.hidden = true;
  }
  $$("[data-form]").forEach(function (form) {
    var names = Object.keys(rules).filter(function (n) { return form.elements[n]; });
    var submit = $("[data-submit]", form);
    function validate(n) {
      var el = form.elements[n], msg = rules[n](el.value, el), f = el.closest(".field");
      f.classList.toggle("has-error", !!msg);
      el.setAttribute("aria-invalid", msg ? "true" : "false");
      var e = $(".error", f); if (e) e.textContent = msg;
      return !msg;
    }
    names.forEach(function (n) {
      var el = form.elements[n];
      el.addEventListener("change", function () { validate(n); });
      el.addEventListener("input", function () { if (el.closest(".field").classList.contains("has-error")) validate(n); });
      el.addEventListener("blur", function () { if (el.value && el.type !== "checkbox") validate(n); });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fe = $("[data-form-error]", form); if (fe) fe.hidden = true;
      var bad = null;
      names.forEach(function (n) { if (!validate(n) && !bad) bad = form.elements[n]; });
      if (bad) { bad.focus(); return; }
      var data = { page: location.pathname.split("/").pop() || "index.html" };
      new FormData(form).forEach(function (v, k) { data[k] = String(v).trim(); });
      submit.disabled = true; submit.classList.add("is-loading"); submit.setAttribute("aria-busy", "true");
      var ep = form.getAttribute("data-endpoint");
      var req = ep
        ? fetch(ep, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(function (r) { if (!r.ok) throw new Error(r.status); })
        : new Promise(function (r) { setTimeout(r, 900); }); // chưa có máy chủ: mô phỏng
      req.then(function () {
        $("[data-success-name]", form).textContent = data.name;
        $("[data-success-phone]", form).textContent = data.phone;
        $("[data-form-body]", form).hidden = true;
        var ok = $("[data-form-success]", form); ok.hidden = false; ok.focus();
      }).catch(function () { if (fe) fe.hidden = false; })
        .then(function () { submit.disabled = false; submit.classList.remove("is-loading"); submit.removeAttribute("aria-busy"); });
    });
    var again = $("[data-form-again]", form);
    if (again) again.addEventListener("click", function () { resetForm(form); form.elements.name.focus(); });
  });

  /* Sao chép liên kết */
  $$("[data-copy-link]").forEach(function (b) {
    b.addEventListener("click", function () {
      var l = $("span", b);
      if (!navigator.clipboard) { l.textContent = "Trình duyệt không hỗ trợ"; return; }
      navigator.clipboard.writeText(location.href).then(function () { l.textContent = "Đã sao chép"; setTimeout(function () { l.textContent = "Sao chép liên kết"; }, 2000); });
    });
  });

  $$("[data-year]").forEach(function (y) { y.textContent = String(new Date().getFullYear()); });
})();
