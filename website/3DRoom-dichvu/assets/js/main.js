/* 3DRoom - main.js (vanilla, dùng chung cho mọi trang) */
(function () {
  "use strict";
  document.documentElement.classList.add("js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var desktop = window.matchMedia("(min-width: 1100px)");
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var vnd = function (n) { return Math.round(n).toLocaleString("de-DE"); };

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
    btn.addEventListener("click", function () { var o = !li.classList.contains("is-open"); drops.forEach(function (d) { if (d !== li) setDrop(d, false); }); setDrop(li, o); });
    li.addEventListener("mouseenter", function () { if (desktop.matches) { clearTimeout(timer); drops.forEach(function (d) { if (d !== li) setDrop(d, false); }); setDrop(li, true); } });
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

  /* Hero: ảnh hiện dần từng lớp như đang in, số Z và số lớp chạy theo */
  var printer = $("[data-print]");
  if (printer) {
    var zEl = $("[data-z]", printer), lEl = $("[data-layer]", printer), sEl = $("[data-status]", printer);
    var LAYERS = 240, H = 48, DURATION = 6500;
    var paint = function (p) {
      var layer = Math.round(p * LAYERS);
      printer.style.setProperty("--p", (layer / LAYERS).toFixed(4));
      zEl.textContent = (layer / LAYERS * H).toFixed(1);
      lEl.textContent = String(layer);
    };
    var done = function () { paint(1); printer.classList.add("is-done"); sEl.textContent = "Hoàn thành"; };
    if (reduce || !("IntersectionObserver" in window)) done();
    else {
      paint(0);
      var run = function () {
        var t0 = null;
        var step = function (t) {
          if (t0 === null) t0 = t;
          var p = Math.min(1, (t - t0) / DURATION);
          paint(1 - Math.pow(1 - p, 1.6));
          if (p < 1) requestAnimationFrame(step); else done();
        };
        requestAnimationFrame(step);
      };
      var io0 = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io0.disconnect(); setTimeout(run, 400); } }, { threshold: 0.3 });
      io0.observe(printer);
    }
  }

  /* Chọn công nghệ theo ưu tiên */
  var NOTES = {
    cost: "<strong>FDM</strong>. Rẻ nhất trên mỗi gram, nhất là với chi tiết lớn.",
    detail: "<strong>SLA</strong>. Lớp chỉ 0,05 mm, chữ nổi và hoa văn nhỏ vẫn sắc nét.",
    strength: "<strong>SLM</strong> nếu cần kim loại, <strong>SLS</strong> nếu nhựa nylon là đủ.",
    size: "<strong>FDM</strong>. In liền khối tới 1 mét, không phải ghép.",
    metal: "<strong>SLM</strong>. Thép 316L, nhôm hoặc titan, mật độ trên 99%."
  };
  $$("[data-chooser]").forEach(function (box) {
    var chips = $$("[data-pick]", box), rows = $$(".tt-row[data-cost]", box), note = $("[data-chooser-note]", box);
    function pick(key) {
      chips.forEach(function (c) { var on = c.getAttribute("data-pick") === key; c.classList.toggle("is-active", on); c.setAttribute("aria-pressed", String(on)); });
      var max = Math.max.apply(null, rows.map(function (r) { return Number(r.getAttribute("data-" + key)); }));
      rows.forEach(function (r) { var best = Number(r.getAttribute("data-" + key)) === max; r.classList.toggle("is-best", best); r.classList.toggle("is-dim", !best); });
      box.setAttribute("data-key", key);
      note.innerHTML = "Gợi ý: " + NOTES[key];
    }
    chips.forEach(function (c) { c.addEventListener("click", function () { pick(c.getAttribute("data-pick")); }); });
    pick("cost");
  });

  /* Ước tính giá */
  var matData = $("#mat-data");
  var MATS = matData ? JSON.parse(matData.textContent) : [];
  $$("[data-estimator]").forEach(function (form) {
    var tech = $("[data-e-tech]", form), mat = $("[data-e-mat]", form), gram = $("[data-e-gram]", form), qty = $("[data-e-qty]", form);
    var gOut = $("[data-e-gram-out]", form), out = $("[data-e-out]", form), note = $("[data-e-note]", form);
    function fillMats() {
      mat.innerHTML = MATS.filter(function (m) { return m.tech === tech.value; }).map(function (m) { return '<option value="' + m.key + '">' + m.name + "</option>"; }).join("");
    }
    function calc() {
      var m = MATS.filter(function (x) { return x.key === mat.value; })[0];
      var g = Number(gram.value), q = Math.max(1, Math.min(5000, Math.round(Number(qty.value) || 1)));
      gOut.textContent = g >= 1000 ? (g / 1000).toFixed(g % 1000 ? 2 : 0).replace(".", ",") + " kg" : g + " g";
      if (!m || !m.price) { out.textContent = "Báo giá theo file"; note.textContent = "In kim loại phụ thuộc thời gian máy và gia công tinh. Gửi file để nhận giá trong 2 giờ."; return; }
      var lo = m.price[0], hi = m.price[1], total = g * q, extra = [];
      if (tech.value === "FDM" && total > 10000) { lo = Math.min(lo, 550); hi = Math.min(hi, 650); extra.push("giá khổ lớn trên 10 kg"); }
      var dLo = 1, dHi = 1;
      if (q >= 20) { dLo = 0.75; dHi = 0.9; extra.push("đã trừ chiết khấu số lượng"); }
      var a = Math.round(total * lo * dLo / 1000) * 1000, b = Math.round(total * hi * dHi / 1000) * 1000;
      out.textContent = vnd(Math.max(a, 50000)) + "-" + vnd(Math.max(b, 60000)) + "đ";
      note.textContent = m.name + " · " + vnd(lo) + "-" + vnd(hi) + "đ/gram" + (extra.length ? " · " + extra.join(", ") : "") + (a < 50000 ? " · đơn tối thiểu 50.000đ" : "");
    }
    tech.addEventListener("change", function () { fillMats(); calc(); });
    [mat, gram, qty].forEach(function (el) { el.addEventListener("input", calc); el.addEventListener("change", calc); });
    fillMats(); calc();
  });

  /* Bộ lọc chip: [data-filter-scope] > [data-filter] + [data-filter-target] > item[data-<key>] */
  $$("[data-filter-scope]").forEach(function (scope) {
    var key = scope.getAttribute("data-filter-key") || "category";
    var chips = $$("[data-filter-value]", scope), items = $$("[data-filter-target] > *", scope);
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        var v = c.getAttribute("data-filter-value");
        chips.forEach(function (x) { var on = x === c; x.classList.toggle("is-active", on); x.setAttribute("aria-pressed", String(on)); });
        items.forEach(function (it) { it.hidden = !(v === "all" || it.getAttribute("data-" + key) === v); });
      });
    });
  });

  /* Vùng kéo thả file */
  var OK_EXT = /\.(stl|obj|step|stp|3mf|igs|iges|jpe?g|png|pdf)$/i;
  $$("[data-dropzone]").forEach(function (zone) {
    var input = $("[data-file-input]", zone), list = $("[data-file-list]", zone);
    function render() {
      var files = Array.prototype.slice.call(input.files || []);
      zone.classList.toggle("has-files", files.length > 0);
      list.innerHTML = files.map(function (f) {
        var bad = !OK_EXT.test(f.name) ? "Định dạng chưa hỗ trợ" : f.size > 50 * 1024 * 1024 ? "Lớn hơn 50 MB" : "";
        var size = f.size > 1048576 ? (f.size / 1048576).toFixed(1).replace(".", ",") + " MB" : Math.max(1, Math.round(f.size / 1024)) + " KB";
        return '<li class="' + (bad ? "is-bad" : "") + '"><i class="ph-light ph-' + (bad ? "warning" : "file") + '" aria-hidden="true"></i><span>' + f.name.replace(/</g, "&lt;") + "</span><small>" + (bad || size) + "</small></li>";
      }).join("");
    }
    input.addEventListener("change", render);
    ["dragenter", "dragover"].forEach(function (ev) { zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.add("is-drag"); }); });
    ["dragleave", "drop"].forEach(function (ev) { zone.addEventListener(ev, function () { zone.classList.remove("is-drag"); }); });
    zone.addEventListener("drop", function (e) { e.preventDefault(); if (e.dataTransfer && e.dataTransfer.files.length) { input.files = e.dataTransfer.files; render(); } });
    zone._render = render;
  });

  /* Form báo giá */
  var rules = {
    name: function (v) { return !v.trim() ? "Vui lòng nhập họ và tên." : v.trim().length < 2 ? "Họ tên cần ít nhất 2 ký tự." : ""; },
    phone: function (v) { var d = v.replace(/[\s.\-()]/g, "").replace(/^\+84/, "0"); return !d ? "Vui lòng nhập số điện thoại." : /^0\d{9}$/.test(d) ? "" : "Số điện thoại gồm 10 chữ số, ví dụ 0912 345 678."; },
    note: function (v, el, form) { var f = form.elements.file; return (f && f.files && f.files.length) || v.trim().length >= 10 ? "" : "Hãy tải file lên hoặc mô tả yêu cầu (ít nhất 10 ký tự)."; }
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
      el.addEventListener("input", function () { if (el.closest(".field").classList.contains("has-error")) validate(n); });
    });
    if (form.elements.file) form.elements.file.addEventListener("change", function () { if (form.elements.note && form.elements.note.closest(".field").classList.contains("has-error")) validate("note"); });
    form.addEventListener("submit", function (e) {
      e.preventDefault(); if (fe) fe.hidden = true;
      var bad = null; names.forEach(function (n) { if (!validate(n) && !bad) bad = form.elements[n]; });
      if (bad) { bad.focus(); return; }
      var data = new FormData(form); data.append("page", location.pathname.split("/").pop() || "index.html");
      submit.disabled = true; submit.classList.add("is-loading"); submit.setAttribute("aria-busy", "true");
      var ep = form.getAttribute("data-endpoint");
      var req = ep ? fetch(ep, { method: "POST", body: data }).then(function (r) { if (!r.ok) throw new Error(r.status); }) : new Promise(function (r) { setTimeout(r, 900); }); // chưa có máy chủ: mô phỏng gửi thành công
      req.then(function () {
        $("[data-success-name]", form).textContent = form.elements.name.value.trim();
        $("[data-success-phone]", form).textContent = form.elements.phone.value.trim();
        body.hidden = true; ok.hidden = false; ok.focus();
      }).catch(function () { if (fe) fe.hidden = false; })
        .then(function () { submit.disabled = false; submit.classList.remove("is-loading"); submit.removeAttribute("aria-busy"); });
    });
    var reset = $("[data-form-reset]", form);
    if (reset) reset.addEventListener("click", function () {
      form.reset(); $$(".field", form).forEach(function (f) { f.classList.remove("has-error"); });
      var z = $("[data-dropzone]", form); if (z && z._render) z._render();
      ok.hidden = true; body.hidden = false; form.elements.name.focus();
    });
  });

  /* Hiện dần khi cuộn */
  var rv = $$(".reveal");
  if (!reduce && "IntersectionObserver" in window) {
    rv.forEach(function (el) { var sib = $$(":scope > .reveal", el.parentElement); el.style.setProperty("--i", String(Math.max(0, sib.indexOf(el)))); });
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } }); }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add("is-visible"); });

  /* Sao chép liên kết bài viết */
  $$("[data-copy-link]").forEach(function (b) {
    b.addEventListener("click", function () {
      var l = $("span", b);
      if (!navigator.clipboard) { l.textContent = "Trình duyệt không hỗ trợ"; return; }
      navigator.clipboard.writeText(location.href).then(function () { l.textContent = "Đã sao chép"; setTimeout(function () { l.textContent = "Sao chép liên kết"; }, 2000); });
    });
  });

  $$("[data-year]").forEach(function (y) { y.textContent = String(new Date().getFullYear()); });
})();
