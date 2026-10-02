/* K-Lab's Sneaker Care - main.js (vanilla, dùng chung) */
(function () {
  "use strict";
  document.documentElement.classList.add("js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var desktop = window.matchMedia("(min-width: 1100px)");
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var PICKUP = "Nhận trả giày tại nhà";

  /* Header */
  var header = $("[data-header]");
  if (header && "IntersectionObserver" in window) {
    var sn = document.createElement("div");
    sn.style.cssText = "position:absolute;top:0;left:0;width:1px;height:40px;pointer-events:none";
    sn.setAttribute("aria-hidden", "true");
    document.body.prepend(sn);
    new IntersectionObserver(function (e) { header.classList.toggle("is-scrolled", !e[0].isIntersecting); }).observe(sn);
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
  }

  /* Menu thả xuống */
  var drops = $$(".has-drop");
  function setDrop(li, open) { li.classList.toggle("is-open", open); $("[data-drop-toggle]", li).setAttribute("aria-expanded", String(open)); }
  drops.forEach(function (li) {
    var btn = $("[data-drop-toggle]", li), t;
    btn.addEventListener("click", function () { var o = !li.classList.contains("is-open"); drops.forEach(function (d) { if (d !== li) setDrop(d, false); }); setDrop(li, o); });
    li.addEventListener("mouseenter", function () { if (desktop.matches) { clearTimeout(t); drops.forEach(function (d) { if (d !== li) setDrop(d, false); }); setDrop(li, true); } });
    li.addEventListener("mouseleave", function () { if (desktop.matches) t = setTimeout(function () { setDrop(li, false); }, 150); });
    li.addEventListener("focusout", function (e) { if (desktop.matches && !li.contains(e.relatedTarget)) setDrop(li, false); });
  });
  document.addEventListener("click", function (e) { if (desktop.matches && !e.target.closest(".has-drop")) drops.forEach(function (d) { setDrop(d, false); }); });

  /* Popup đặt lịch */
  var modal = $("[data-modal]"), lastTrigger = null;
  function selectByText(sel, text) {
    if (!sel || !text) return;
    $$("option", sel).forEach(function (o) { if (o.textContent === text || o.textContent.indexOf(text) === 0) o.selected = true; });
  }
  function syncAddress(form) {
    var sel = $("[data-branch-select]", form), box = $("[data-address-field]", form);
    if (!sel || !box) return;
    var on = sel.value === PICKUP;
    box.hidden = !on;
    form.elements.address.required = on;
  }
  function resetForm(form) {
    form.reset();
    $$(".field", form).forEach(function (f) { f.classList.remove("has-error"); var e = $(".error", f); if (e) e.textContent = ""; });
    $("[data-form-body]", form).hidden = false;
    $("[data-form-success]", form).hidden = true;
    var fe = $("[data-form-error]", form); if (fe) fe.hidden = true;
    syncAddress(form);
  }
  function openModal(trigger) {
    if (!modal) return;
    lastTrigger = trigger || null;
    setNav(false);
    var form = $("[data-form]", modal);
    resetForm(form);
    if (trigger) {
      selectByText(form.elements.service, trigger.getAttribute("data-service"));
      selectByText(form.elements.branch, trigger.getAttribute("data-branch"));
      var need = trigger.getAttribute("data-need");
      if (need) { form.elements.note.value = need; selectByText(form.elements.service, "Chưa rõ, cần tư vấn"); }
      syncAddress(form);
    }
    if (modal.showModal) modal.showModal(); else modal.setAttribute("open", "");
    setTimeout(function () { form.elements.name.focus(); }, 50);
  }
  function closeModal() { if (modal) { if (modal.close) modal.close(); else modal.removeAttribute("open"); } }
  if (modal) {
    modal.addEventListener("close", function () { if (lastTrigger) lastTrigger.focus(); });
    modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-open-booking]");
    if (t) { e.preventDefault(); openModal(t); return; }
    if (e.target.closest("[data-close-modal]")) closeModal();
  });
  if (location.hash === "#dat-lich") openModal();

  /* Tabs */
  $$('[role="tablist"]').forEach(function (list) {
    var tabs = $$('[role="tab"]', list);
    function sel(tab, focus) {
      tabs.forEach(function (t) { var on = t === tab; t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1; var p = document.getElementById(t.getAttribute("aria-controls")); if (p) p.hidden = !on; });
      if (focus) tab.focus();
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { sel(tab); });
      tab.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowRight") n = tabs[(i + 1) % tabs.length];
        if (e.key === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (n) { e.preventDefault(); sel(n, true); }
      });
    });
  });

  /* Bộ lọc: [data-filter-scope] > [data-filter-value] + [data-filter-target] > * */
  $$("[data-filter-scope]").forEach(function (scope) {
    var btns = $$("[data-filter-value]", scope), items = $$("[data-filter-target] > *", scope), empty = $("[data-empty]", scope);
    function apply(v) {
      var n = 0;
      btns.forEach(function (b) { var on = b.getAttribute("data-filter-value") === v; b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", String(on)); });
      items.forEach(function (it) { var ok = v === "all" || it.getAttribute("data-category") === v; it.hidden = !ok; if (ok) n++; });
      if (empty) empty.hidden = n > 0;
    }
    btns.forEach(function (b) { b.addEventListener("click", function () { apply(b.getAttribute("data-filter-value")); }); });
    var q = new URLSearchParams(location.search).get("loai");
    if (q && $('[data-filter-value="' + q + '"]', scope)) apply(q);
  });

  /* Hiện dần */
  var rv = $$(".reveal");
  if (!reduce && "IntersectionObserver" in window) {
    rv.forEach(function (el) { var sib = $$(":scope > .reveal", el.parentElement); el.style.setProperty("--i", String(Math.max(0, sib.indexOf(el)))); });
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } }); }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add("is-visible"); });

  /* Form */
  var rules = {
    name: function (v) { return !v.trim() ? "Vui lòng nhập họ và tên." : v.trim().length < 2 ? "Họ tên cần ít nhất 2 ký tự." : ""; },
    phone: function (v) { var d = v.replace(/[\s.\-()]/g, "").replace(/^\+84/, "0"); if (!d) return "Vui lòng nhập số điện thoại."; return /^0\d{9}$/.test(d) ? "" : "Số điện thoại gồm 10 chữ số, ví dụ 0912 345 678."; },
    service: function (v) { return v ? "" : "Vui lòng chọn dịch vụ."; },
    branch: function (v) { return v ? "" : "Vui lòng chọn cơ sở hoặc nhận tại nhà."; },
    address: function (v, el) { return !el.required || v.trim().length >= 6 ? "" : "Vui lòng nhập địa chỉ để shipper đến nhận giày."; },
    message: function (v) { return v.trim().length >= 10 ? "" : "Nội dung cần ít nhất 10 ký tự."; }
  };
  $$("[data-form]").forEach(function (form) {
    var names = Object.keys(rules).filter(function (n) { return form.elements[n]; });
    var submit = $("[data-submit]", form);
    var bsel = $("[data-branch-select]", form);
    if (bsel) bsel.addEventListener("change", function () { syncAddress(form); });
    syncAddress(form);
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
      var req = ep ? fetch(ep, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(function (r) { if (!r.ok) throw new Error(r.status); })
        : new Promise(function (r) { setTimeout(r, 900); }); // chưa có máy chủ: mô phỏng
      req.then(function () {
        var sn = $("[data-success-name]", form), sp = $("[data-success-phone]", form);
        if (sn) sn.textContent = data.name;
        if (sp) sp.textContent = data.phone;
        $("[data-form-body]", form).hidden = true;
        var ok = $("[data-form-success]", form); ok.hidden = false; ok.focus();
      }).catch(function () { if (fe) fe.hidden = false; })
        .then(function () { submit.disabled = false; submit.classList.remove("is-loading"); submit.removeAttribute("aria-busy"); });
    });
    var again = $("[data-form-again]", form);
    if (again) again.addEventListener("click", function () { resetForm(form); form.elements.name.focus(); });
  });

  /* Esc đóng menu toàn màn hình */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && toggle && toggle.getAttribute("aria-expanded") === "true") { setNav(false); toggle.focus(); }
  });
  if (nav) $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setNav(false); }); });

  /* Ảnh xem trước bám theo con trỏ ở danh mục dịch vụ (chỉ chuột, không chạy khi giảm chuyển động) */
  var idx = $("[data-svc-index]"), fine = window.matchMedia("(pointer: fine)").matches;
  if (idx && fine && !reduce) {
    var pv = document.createElement("figure"), pimg = document.createElement("img");
    pv.className = "svc-preview"; pv.setAttribute("aria-hidden", "true"); pimg.alt = "";
    pv.appendChild(pimg); document.body.appendChild(pv);
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
    function loop() {
      cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
      pv.style.transform = "translate3d(" + (cx + 28) + "px," + (cy - 110) + "px,0) rotate(" + Math.max(-6, Math.min(6, (tx - cx) * 0.05)) + "deg)";
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.5 ? requestAnimationFrame(loop) : null;
    }
    $$(".svc-row", idx).forEach(function (row) {
      row.addEventListener("mouseenter", function (e) { pimg.src = row.getAttribute("data-preview"); tx = cx = e.clientX; ty = cy = e.clientY; pv.classList.add("is-on"); });
      row.addEventListener("mouseleave", function () { pv.classList.remove("is-on"); });
    });
    idx.addEventListener("mousemove", function (e) { tx = e.clientX; ty = e.clientY; if (!raf) raf = requestAnimationFrame(loop); });
  }

  /* Quy trình: bước đang xem sáng lên */
  var steps = $$(".flow-step");
  if (steps.length && "IntersectionObserver" in window) {
    var so = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) en.target.classList.add("is-active"); }); }, { rootMargin: "0px 0px -45% 0px" });
    steps.forEach(function (s) { so.observe(s); });
  } else steps.forEach(function (s) { s.classList.add("is-active"); });

  /* Nút cuộn dải ngang */
  $$("[data-rail-ctrl]").forEach(function (ctrl) {
    var track = $(ctrl.getAttribute("data-rail-ctrl"));
    $$("button", ctrl).forEach(function (b) {
      b.addEventListener("click", function () { track.scrollBy({ left: (b.hasAttribute("data-next") ? 1 : -1) * track.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" }); });
    });
  });

  $$("[data-year]").forEach(function (y) { y.textContent = String(new Date().getFullYear()); });
})();
