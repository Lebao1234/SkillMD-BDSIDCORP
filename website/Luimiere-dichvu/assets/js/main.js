/* Luimiere - main.js (vanilla, dùng chung cho mọi trang) */
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.add("js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) root.classList.add("reduce");
  var desktop = window.matchMedia("(min-width: 1181px)");
  var fine = window.matchMedia("(pointer: fine)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var money = function (n) { return Math.round(n).toLocaleString("de-DE") + "đ"; };
  var io = function (cb, opts) { return "IntersectionObserver" in window ? new IntersectionObserver(cb, opts) : null; };

  /* Header đậm hơn khi cuộn */
  var header = $("[data-header]");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 12); document.body.classList.toggle("is-past", window.scrollY > window.innerHeight * 0.7); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* Menu mobile phủ kín màn hình */
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
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("is-open")) { setNav(false); toggle.focus(); } });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setNav(false); }); });
  }

  /* Vệt sáng theo chuột (hero, khối CTA) */
  if (fine && !reduce) {
    $$("[data-glow]").forEach(function (el) {
      var raf = 0, x = 0, y = 0;
      var target = el.classList.contains("cta-core") ? el.closest(".cta-band") : el;
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect(); x = e.clientX - r.left; y = e.clientY - r.top;
        if (!raf) raf = requestAnimationFrame(function () { raf = 0; target.style.setProperty("--mx", x + "px"); target.style.setProperty("--my", y + "px"); });
      });
    });
  }

  /* Thanh trượt có ô hiển thị số khách */
  function syncRange(r) {
    var out = document.getElementById(r.getAttribute("data-range-out"));
    var p = (r.value - r.min) / (r.max - r.min) * 100;
    r.style.setProperty("--p", p + "%");
    if (out) out.textContent = Number(r.value).toLocaleString("de-DE") + " khách";
  }
  $$("[data-range-out]").forEach(function (r) { r.addEventListener("input", function () { syncRange(r); }); syncRange(r); });
  $$('input[type="date"]').forEach(function (d) { d.min = new Date().toISOString().slice(0, 10); });

  /* Trang sảnh: lọc theo số khách (?khach=300 từ ô tìm ở trang chủ) */
  var hg = $("[data-hall-grid]"), gf = $("[data-guest-filter]");
  if (hg && gf) {
    var gr = $("input", gf), msg = $("[data-guest-msg]", gf), cards = $$("[data-hall-card]", hg);
    var q = new URLSearchParams(location.search);
    if (q.get("khach")) { gr.value = q.get("khach"); syncRange(gr); }
    function fit() {
      var g = Number(gr.value), n = 0, names = [];
      cards.forEach(function (c) {
        var ok = g >= Number(c.getAttribute("data-min")) * 0.6 && g <= Number(c.getAttribute("data-max"));
        c.classList.toggle("is-fit", ok); $("[data-fit]", c).hidden = !ok;
        if (ok) { n++; names.push($("h3", c).textContent.trim()); }
      });
      hg.classList.add("is-filtering");
      msg.innerHTML = n ? "Với " + g + " khách (khoảng " + Math.ceil(g / 10) + " bàn), phù hợp nhất: <strong>" + names.join(", ") + "</strong>."
        : "Tiệc " + g + " khách vượt sức chứa một sảnh. Gọi chúng tôi để ghép sảnh Soleil và Lune.";
    }
    gr.addEventListener("input", fit);
    if (q.get("khach")) { fit(); if (q.get("ngay")) gf.setAttribute("data-date", q.get("ngay")); }
  }

  /* Sơ đồ bàn sáng dần khi cuộn tới */
  var dotsList = $$("[data-dots]");
  var dio = !reduce && io(function (es) {
    es.forEach(function (en) {
      if (!en.isIntersecting) return;
      $$("i", en.target).forEach(function (d, k) { d.style.transitionDelay = (k * 22) + "ms"; });
      en.target.classList.add("is-lit"); dio.unobserve(en.target);
    });
  }, { threshold: 0.4 });
  dotsList.forEach(function (d) { if (dio) dio.observe(d); else d.classList.add("is-lit"); });

  /* Một buổi tối: bước nào đang ở giữa màn hình thì ảnh và đồng hồ đổi theo */
  $$("[data-steps]").forEach(function (box) {
    var steps = $$(".step", box), imgs = $$(".evening-media img", box), clock = $("[data-clock]", box);
    function show(i) {
      steps.forEach(function (s, k) { s.classList.toggle("is-on", k === i); });
      imgs.forEach(function (im, k) { im.classList.toggle("is-on", k === i); });
      if (clock) clock.textContent = steps[i].getAttribute("data-time");
    }
    var sio = io(function (es) { es.forEach(function (en) { if (en.isIntersecting) show(steps.indexOf(en.target)); }); }, { rootMargin: "-45% 0px -45% 0px" });
    if (sio) steps.forEach(function (s) { sio.observe(s); });
  });

  /* Tab thực đơn (phím mũi tên chuyển tab) */
  $$("[data-tabs]").forEach(function (box) {
    var tabs = $$('[role="tab"]', box);
    function select(t, focus) {
      tabs.forEach(function (x) {
        var on = x === t;
        x.setAttribute("aria-selected", String(on)); x.tabIndex = on ? 0 : -1;
        document.getElementById(x.getAttribute("aria-controls")).hidden = !on;
      });
      if (focus) t.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t); history.replaceState(null, "", "#" + t.id); });
      t.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (d) { e.preventDefault(); select(tabs[(i + d + tabs.length) % tabs.length], true); }
      });
    });
    var h = location.hash && document.getElementById(location.hash.slice(1));
    if (h && tabs.indexOf(h) > -1) { select(h); setTimeout(function () { box.scrollIntoView({ block: "start" }); }, 60); }
  });

  /* Dự toán chi phí */
  var est = $("[data-estimator]");
  if (est) {
    var el = function (n) { return est.elements[n]; };
    var outs = { total: $("[data-est-total]", est), per: $("[data-est-per]", est), lines: $("[data-est-lines]", est), warn: $("[data-est-warn]", est) };
    function calc() {
      var guests = Number(el("guests").value), tables = Math.ceil(guests / 10);
      var opt = el("menu").selectedOptions[0], price = Number(opt.getAttribute("data-price"));
      var slot = el("slot").value, hallOpt = el("hall").selectedOptions[0];
      var hmin = Number(hallOpt.getAttribute("data-min")), hmax = Number(hallOpt.getAttribute("data-max"));
      var food = tables * price, lines = [["Thực đơn " + opt.textContent.split(",")[0] + " × " + tables + " bàn", food]];
      var disc = 0;
      if (slot === "trua") { disc = food * 0.06; lines.push(["Ưu đãi tiệc trưa, giảm 6% thực đơn", -disc]); }
      if (slot === "thuong") { disc = food * 0.1; lines.push(["Ưu đãi thứ Hai đến thứ Năm, giảm 10% thực đơn", -disc]); }
      var add = 0;
      $$('input[name="addon"]:checked', est).forEach(function (c) {
        var v = Number(c.value) * (c.hasAttribute("data-per-table") ? tables : 1); add += v;
        lines.push([c.getAttribute("data-label"), v]);
      });
      var total = food - disc + add;
      outs.total.textContent = money(total);
      outs.per.textContent = "Khoảng " + money(total / Math.max(guests, 1)) + " cho mỗi khách, " + tables + " bàn";
      outs.lines.innerHTML = lines.map(function (l) { return '<li' + (l[1] < 0 ? ' class="is-discount"' : "") + '><span>' + l[0] + '</span><span>' + (l[1] < 0 ? "-" : "") + money(Math.abs(l[1])) + '</span></li>'; }).join("");
      var w = "";
      if (hmin && tables < Math.round(hmin * (slot === "toi" ? 1 : 0.6))) w = "Sảnh " + hallOpt.value + " nhận từ " + Math.round(hmin * (slot === "toi" ? 1 : 0.6)) + " bàn cho khung giờ này.";
      if (hmax && tables > hmax) w = "Sảnh " + hallOpt.value + " chứa tối đa " + hmax + " bàn. Hãy chọn sảnh lớn hơn.";
      outs.warn.textContent = w; outs.warn.hidden = !w;
      est.setAttribute("data-summary", tables + " bàn, thực đơn " + opt.textContent.split(",")[0] + ", sảnh " + hallOpt.value + ", dự toán " + money(total));
    }
    est.addEventListener("input", calc); est.addEventListener("change", calc);
    $$("[data-pick-menu]").forEach(function (a) { a.addEventListener("click", function () { el("menu").value = a.getAttribute("data-pick-menu"); calc(); }); });
    var send = $("[data-est-send]", est);
    if (send) send.addEventListener("click", function () { send.setAttribute("data-note", "Dự toán: " + est.getAttribute("data-summary")); send.setAttribute("data-guests", el("guests").value); });
    calc();
  }

  /* Popup đặt lịch, điền sẵn từ nút bấm: data-hall, data-type, data-date, data-guests, data-note */
  var modal = $("[data-modal]"), lastTrigger = null;
  function openModal(trigger) {
    if (!modal) return;
    lastTrigger = trigger || null;
    setNav(false);
    var form = $("[data-form]", modal);
    resetForm(form);
    if (trigger) {
      var get = function (a) { return trigger.getAttribute(a); };
      if (get("data-hall")) form.elements.hall.value = get("data-hall");
      if (get("data-type")) form.elements.type.value = get("data-type");
      if (get("data-date")) form.elements.date.value = get("data-date");
      if (get("data-guests")) form.elements.guests.value = get("data-guests");
      if (get("data-note")) form.elements.note.value = get("data-note");
      if (/nếm thử/i.test(get("data-note") || "")) form.elements.want[2].checked = true;
    }
    var gfd = gf && gf.getAttribute("data-date");
    if (gfd && !form.elements.date.value) form.elements.date.value = gfd;
    if (typeof modal.showModal === "function") modal.showModal(); else modal.setAttribute("open", "");
    setTimeout(function () { form.elements.name.focus(); }, 60);
  }
  function closeModal() { if (modal) { if (typeof modal.close === "function") modal.close(); else modal.removeAttribute("open"); } }
  if (modal) {
    modal.addEventListener("close", function () { if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus(); });
    modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-open-book]");
    if (t) { e.preventDefault(); openModal(t); return; }
    if (e.target.closest("[data-close-modal]")) closeModal();
  });
  if (location.hash === "#dat-lich") openModal();

  /* Lọc bằng chip: [data-filter-scope] > [data-filter-value] + [data-filter-target] */
  $$("[data-filter-scope]").forEach(function (scope) {
    var chips = $$("[data-filter-value]", scope), empty = $("[data-empty]", scope);
    var key = scope.getAttribute("data-filter-key") || "category";
    function apply(v) {
      var shown = 0;
      chips.forEach(function (c) { var on = c.getAttribute("data-filter-value") === v; c.classList.toggle("is-active", on); c.setAttribute("aria-pressed", String(on)); });
      $$("[data-filter-target] > *", scope).forEach(function (it) { var ok = v === "all" || (it.getAttribute("data-" + key) || "").split(" ").indexOf(v) > -1; it.hidden = !ok; if (ok) shown++; });
      if (empty) empty.hidden = shown > 0;
    }
    chips.forEach(function (c) { c.addEventListener("click", function () { apply(c.getAttribute("data-filter-value")); }); });
    var q = new URLSearchParams(location.search).get("loai");
    if (q && $('[data-filter-value="' + q + '"]', scope)) apply(q);
  });

  /* Xem ảnh lớn trong thư viện */
  var lb = $("[data-lightbox]");
  if (lb) {
    var items = [], cur = 0, lbImg = $("img", lb), lbCap = $("figcaption", lb);
    function visible() { return $$(".g-item:not([hidden]) button"); }
    function show(i) {
      items = visible(); cur = (i + items.length) % items.length;
      var b = items[cur], im = $("img", b);
      lbImg.src = im.src; lbImg.alt = im.alt; lbCap.textContent = b.getAttribute("data-caption") || im.alt;
    }
    document.addEventListener("click", function (e) {
      var b = e.target.closest(".g-item button");
      if (b) { show(visible().indexOf(b)); lb.showModal(); }
    });
    $("[data-lb-prev]", lb).addEventListener("click", function () { show(cur - 1); });
    $("[data-lb-next]", lb).addEventListener("click", function () { show(cur + 1); });
    $("[data-lb-close]", lb).addEventListener("click", function () { lb.close(); });
    lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") show(cur + 1); if (e.key === "ArrowLeft") show(cur - 1); });
  }

  /* Tìm câu hỏi (gõ không dấu vẫn tìm được) */
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

  /* Nút cuộn ngang */
  $$("[data-scroll-ctrl]").forEach(function (ctrl) {
    var track = document.getElementById(ctrl.getAttribute("data-scroll-ctrl"));
    $$("button", ctrl).forEach(function (b) {
      b.addEventListener("click", function () { track.scrollBy({ left: (b.hasAttribute("data-dir-next") ? 1 : -1) * track.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" }); });
    });
  });

  /* Mục lục bài viết: đánh dấu mục đang đọc */
  var tocLinks = $$(".article-toc ol a");
  if (tocLinks.length) {
    var tio = io(function (es) { es.forEach(function (en) { if (en.isIntersecting) tocLinks.forEach(function (a) { a.classList.toggle("is-on", a.getAttribute("href") === "#" + en.target.id); }); }); }, { rootMargin: "0px 0px -70% 0px" });
    if (tio) tocLinks.forEach(function (a) { var t = document.getElementById(a.getAttribute("href").slice(1)); if (t) tio.observe(t); });
  }

  /* Hiện dần khi cuộn */
  var rv = $$(".reveal");
  var rio = !reduce && io(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); rio.unobserve(en.target); } }); }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  rv.forEach(function (el) {
    var sib = $$(":scope > .reveal", el.parentElement);
    el.style.setProperty("--i", String(Math.min(4, Math.max(0, sib.indexOf(el)))));
    if (rio) rio.observe(el); else el.classList.add("is-visible");
  });

  /* Form đặt lịch */
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var rules = {
    name: function (v) { return !v.trim() ? "Vui lòng nhập họ và tên." : v.trim().length < 2 ? "Họ tên cần ít nhất 2 ký tự." : ""; },
    phone: function (v) {
      var d = v.replace(/[\s.\-()]/g, "").replace(/^\+84/, "0");
      if (!d) return "Vui lòng nhập số điện thoại.";
      return /^0\d{9}$/.test(d) ? "" : "Số điện thoại gồm 10 chữ số, ví dụ 0912 345 678.";
    },
    date: function (v) { return v && new Date(v + "T00:00:00") < today ? "Ngày dự kiến đã qua, vui lòng chọn lại." : ""; },
    guests: function (v) { return v && (Number(v) < 20 || Number(v) > 1000) ? "Số khách từ 20 đến 1.000." : ""; },
    agree: function (v, el) { return el.checked ? "" : "Vui lòng đồng ý để chúng tôi gọi lại cho bạn."; }
  };
  function resetForm(form) {
    if (!form) return;
    form.reset();
    $$(".field", form).forEach(function (f) { f.classList.remove("has-error"); var e = $(".error", f); if (e) e.textContent = ""; });
    $$("[aria-invalid]", form).forEach(function (x) { x.removeAttribute("aria-invalid"); });
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
      new FormData(form).forEach(function (v, k) { if (k !== "agree") data[k] = String(v).trim(); });
      submit.disabled = true; submit.classList.add("is-loading"); submit.setAttribute("aria-busy", "true");
      var ep = form.getAttribute("data-endpoint");
      var req = ep
        ? fetch(ep, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(function (r) { if (!r.ok) throw new Error(r.status); })
        : new Promise(function (r) { setTimeout(r, 900); }); // chưa có máy chủ: mô phỏng gửi thành công
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
