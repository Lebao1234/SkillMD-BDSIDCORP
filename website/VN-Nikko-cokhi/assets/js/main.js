/* Cơ khí VN - NIKKO - main.js (vanilla, dùng chung cho mọi trang) */
(function () {
  "use strict";
  document.documentElement.classList.add("js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var desktop = window.matchMedia("(min-width: 1201px)");
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var io = function (cb, o) { return "IntersectionObserver" in window ? new IntersectionObserver(cb, o) : null; };
  /* Chuỗi giao diện theo ngôn ngữ trang (tiếng Việt là gốc) */
  var LANG = (document.documentElement.lang || "vi").slice(0, 2);
  var STR = {
    en: {
      "Đóng menu": "Close menu", "Mở menu": "Open menu", "{n} / {t} sản phẩm": "{n} / {t} products",
      "Đường kính ngoài D (mm)": "Outer diameter D (mm)", "Đường kính D (mm)": "Diameter D (mm)",
      "Nhập đường kính lớn hơn 0.": "Enter a diameter greater than 0.", "Nhập đường kính ngoài lớn hơn 0.": "Enter an outer diameter greater than 0.",
      "Đường kính trong phải nhỏ hơn đường kính ngoài.": "The inner diameter must be smaller than the outer diameter.",
      "Nhập rộng và dày lớn hơn 0.": "Enter a width and thickness greater than 0.", "Nhập chiều dài lớn hơn 0.": "Enter a length greater than 0.",
      "V = rộng × dày × dài": "V = width × thickness × length", "{w} tấn": "{w} t", "{w} cho {q} chiếc": "{w} for {q} pcs",
      "Vui lòng nhập họ và tên.": "Please enter your full name.", "Họ tên cần ít nhất 2 ký tự.": "Name must be at least 2 characters.",
      "Vui lòng nhập số điện thoại.": "Please enter a phone number.", "PHONE": "Enter a valid phone number, e.g. +84 912 345 678.",
      "Email chưa đúng, ví dụ ten@congty.vn.": "Invalid email, e.g. name@company.com.", "Số lượng tối thiểu là 1.": "Minimum quantity is 1.",
      "Hỏi giá chi tiết tương tự mẫu {sp} trên website.": "Requesting a quote for a part similar to item {sp} on the website.",
      "Bỏ": "Remove", "Tối đa {n} tệp.": "Up to {n} files.", "Tệp {f} không đúng định dạng. Dùng PDF, DWG, DXF, STEP hoặc ảnh.": "{f} is not a supported format. Use PDF, DWG, DXF, STEP or an image.",
      "Tệp {f} lớn hơn 20 MB.": "{f} is larger than 20 MB."
    },
    ja: {
      "Đóng menu": "メニューを閉じる", "Mở menu": "メニューを開く", "{n} / {t} sản phẩm": "{n} / {t} 件",
      "Đường kính ngoài D (mm)": "外径 D (mm)", "Đường kính D (mm)": "直径 D (mm)",
      "Nhập đường kính lớn hơn 0.": "0より大きい直径を入力してください。", "Nhập đường kính ngoài lớn hơn 0.": "0より大きい外径を入力してください。",
      "Đường kính trong phải nhỏ hơn đường kính ngoài.": "内径は外径より小さくしてください。",
      "Nhập rộng và dày lớn hơn 0.": "0より大きい幅と厚さを入力してください。", "Nhập chiều dài lớn hơn 0.": "0より大きい長さを入力してください。",
      "V = rộng × dày × dài": "V = 幅 × 厚さ × 長さ", "{w} tấn": "{w} t", "{w} cho {q} chiếc": "{q} 個で {w}",
      "Vui lòng nhập họ và tên.": "氏名を入力してください。", "Họ tên cần ít nhất 2 ký tự.": "氏名は2文字以上で入力してください。",
      "Vui lòng nhập số điện thoại.": "電話番号を入力してください。", "PHONE": "正しい電話番号を入力してください（例: +84 912 345 678）。",
      "Email chưa đúng, ví dụ ten@congty.vn.": "メールアドレスが正しくありません（例: name@company.co.jp）。", "Số lượng tối thiểu là 1.": "数量は1以上です。",
      "Hỏi giá chi tiết tương tự mẫu {sp} trên website.": "ウェブサイト掲載の {sp} と同様の部品の見積もりを希望します。",
      "Bỏ": "削除", "Tối đa {n} tệp.": "ファイルは最大 {n} 件です。", "Tệp {f} không đúng định dạng. Dùng PDF, DWG, DXF, STEP hoặc ảnh.": "{f} は対応していない形式です。PDF、DWG、DXF、STEP または画像をご使用ください。",
      "Tệp {f} lớn hơn 20 MB.": "{f} は 20 MB を超えています。"
    },
    ko: {
      "Đóng menu": "메뉴 닫기", "Mở menu": "메뉴 열기", "{n} / {t} sản phẩm": "{n} / {t}개 제품",
      "Đường kính ngoài D (mm)": "외경 D (mm)", "Đường kính D (mm)": "직경 D (mm)",
      "Nhập đường kính lớn hơn 0.": "0보다 큰 직경을 입력하십시오.", "Nhập đường kính ngoài lớn hơn 0.": "0보다 큰 외경을 입력하십시오.",
      "Đường kính trong phải nhỏ hơn đường kính ngoài.": "내경은 외경보다 작아야 합니다.",
      "Nhập rộng và dày lớn hơn 0.": "0보다 큰 폭과 두께를 입력하십시오.", "Nhập chiều dài lớn hơn 0.": "0보다 큰 길이를 입력하십시오.",
      "V = rộng × dày × dài": "V = 폭 × 두께 × 길이", "{w} tấn": "{w} t", "{w} cho {q} chiếc": "{q}개 기준 {w}",
      "Vui lòng nhập họ và tên.": "성함을 입력하십시오.", "Họ tên cần ít nhất 2 ký tự.": "성함은 2자 이상 입력하십시오.",
      "Vui lòng nhập số điện thoại.": "전화번호를 입력하십시오.", "PHONE": "올바른 전화번호를 입력하십시오 (예: +84 912 345 678).",
      "Email chưa đúng, ví dụ ten@congty.vn.": "이메일 형식이 올바르지 않습니다 (예: name@company.co.kr).", "Số lượng tối thiểu là 1.": "최소 수량은 1입니다.",
      "Hỏi giá chi tiết tương tự mẫu {sp} trên website.": "웹사이트의 {sp} 와 유사한 부품의 견적을 요청합니다.",
      "Bỏ": "삭제", "Tối đa {n} tệp.": "파일은 최대 {n}개입니다.", "Tệp {f} không đúng định dạng. Dùng PDF, DWG, DXF, STEP hoặc ảnh.": "{f} 은(는) 지원하지 않는 형식입니다. PDF, DWG, DXF, STEP 또는 이미지를 사용하십시오.",
      "Tệp {f} lớn hơn 20 MB.": "{f} 이(가) 20 MB를 초과합니다."
    }
  }[LANG] || {};
  var t = function (k, v) { var s = STR[k] || (k === "PHONE" ? "Số điện thoại gồm 10 chữ số, ví dụ 0912 345 678." : k); if (v) Object.keys(v).forEach(function (x) { s = s.split("{" + x + "}").join(v[x]); }); return s; };
  var fmt = function (n, d) { return n.toLocaleString({ vi: "de-DE", en: "en-US", ja: "ja-JP", ko: "ko-KR" }[LANG] || "de-DE", { minimumFractionDigits: d, maximumFractionDigits: d }); };

  /* Header có bóng khi cuộn */
  var header = $("[data-header]");
  if (header) { var sc = function () { header.classList.toggle("is-scrolled", scrollY > 8); }; addEventListener("scroll", sc, { passive: true }); sc(); }

  /* Menu điện thoại */
  var nav = $("[data-nav]"), toggle = $("[data-nav-toggle]");
  function setNav(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open); toggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("nav-open", open);
    $(".sr-only", toggle).textContent = t(open ? "Đóng menu" : "Mở menu");
    if (open) nav.removeAttribute("inert"); else nav.setAttribute("inert", "");
  }
  if (nav) nav.setAttribute("inert", "");
  if (toggle) { toggle.addEventListener("click", function () { setNav(toggle.getAttribute("aria-expanded") !== "true"); }); desktop.addEventListener("change", function () { setNav(false); }); }

  /* Menu thả */
  var drops = $$(".has-drop");
  function setDrop(li, open) { li.classList.toggle("is-open", open); $("[data-drop-toggle]", li).setAttribute("aria-expanded", String(open)); }
  drops.forEach(function (li) {
    var btn = $("[data-drop-toggle]", li), t;
    btn.addEventListener("click", function () { setDrop(li, !li.classList.contains("is-open")); });
    li.addEventListener("mouseenter", function () { if (desktop.matches) { clearTimeout(t); setDrop(li, true); } });
    li.addEventListener("mouseleave", function () { if (desktop.matches) t = setTimeout(function () { setDrop(li, false); }, 160); });
    li.addEventListener("focusout", function (e) { if (!li.contains(e.relatedTarget)) setDrop(li, false); });
  });
  document.addEventListener("click", function (e) { drops.forEach(function (d) { if (!d.contains(e.target)) setDrop(d, false); }); });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var open = drops.filter(function (d) { return d.classList.contains("is-open"); })[0];
    if (open) { setDrop(open, false); $("[data-drop-toggle]", open).focus(); return; }
    if (toggle && toggle.getAttribute("aria-expanded") === "true") { setNav(false); toggle.focus(); }
  });

  /* Tấm lĩnh vực: tấm được rê chuột hoặc focus thì mở rộng */
  $$(".panels").forEach(function (box) {
    var panels = $$(".panel", box);
    var open = function (p) { panels.forEach(function (x) { x.classList.toggle("is-open", x === p); }); };
    panels.forEach(function (p) { p.addEventListener("mouseenter", function () { open(p); }); p.addEventListener("focusin", function () { open(p); }); });
  });

  /* Quy trình: bước ở giữa màn hình thì ảnh và số đếm đổi theo */
  $$("[data-proc]").forEach(function (box) {
    var steps = $$(".proc-step", box), imgs = $$(".proc-media img", box), n = $("[data-proc-n]", box);
    var show = function (i) {
      steps.forEach(function (s, k) { s.classList.toggle("is-on", k === i); });
      imgs.forEach(function (im, k) { im.classList.toggle("is-on", k === i); });
      n.textContent = String(i + 1).padStart(2, "0");
    };
    var sio = io(function (es) { es.forEach(function (en) { if (en.isIntersecting) show(steps.indexOf(en.target)); }); }, { rootMargin: "-45% 0px -45% 0px" });
    if (sio) steps.forEach(function (s) { sio.observe(s); });
    steps.forEach(function (s, i) { s.addEventListener("click", function () { show(i); }); });
  });

  /* Dải sản phẩm cuộn ngang: nút trước / sau */
  $$("[data-rail-scope]").forEach(function (scope) {
    var rail = $(".prail", scope), prev = $("[data-rail-prev]", scope), next = $("[data-rail-next]", scope);
    if (!rail) return;
    var step = function () { var c = $(".pcard", rail); return c ? c.getBoundingClientRect().width + 20 : 320; };
    var sync = function () { prev.disabled = rail.scrollLeft < 4; next.disabled = rail.scrollLeft + rail.clientWidth > rail.scrollWidth - 4; };
    prev.addEventListener("click", function () { rail.scrollBy({ left: -step(), behavior: reduce ? "auto" : "smooth" }); });
    next.addEventListener("click", function () { rail.scrollBy({ left: step(), behavior: reduce ? "auto" : "smooth" }); });
    rail.addEventListener("scroll", sync, { passive: true }); addEventListener("resize", sync); sync();
  });

  /* Lọc sản phẩm theo công nghệ và vật liệu */
  $$("[data-filter-scope]").forEach(function (scope) {
    var state = {}, empty = $("[data-empty]", scope), cnt = $("[data-fcount]", scope);
    var chips = $$("[data-filter]", scope), items = $$("[data-filter-target] > *", scope);
    chips.forEach(function (c) { state[c.getAttribute("data-filter")] = "all"; });
    var pre = new URLSearchParams(location.search).get("nhom");
    if (pre && chips.some(function (c) { return c.getAttribute("data-filter-value") === pre; })) state.seg = pre;
    function apply() {
      var n = 0;
      chips.forEach(function (c) { var on = state[c.getAttribute("data-filter")] === c.getAttribute("data-filter-value"); c.classList.toggle("is-active", on); c.setAttribute("aria-pressed", String(on)); });
      items.forEach(function (it) { var ok = Object.keys(state).every(function (k) { return state[k] === "all" || it.getAttribute("data-" + k) === state[k]; }); it.hidden = !ok; if (ok) { n++; it.classList.add("is-visible"); } });
      if (empty) empty.hidden = n > 0; if (cnt) cnt.textContent = t("{n} / {t} sản phẩm", { n: n, t: items.length });
    }
    chips.forEach(function (c) { c.addEventListener("click", function () { state[c.getAttribute("data-filter")] = c.getAttribute("data-filter-value"); apply(); }); });
    apply();
  });

  /* Tính khối lượng phôi: V (mm³) × ρ (g/cm³) / 1.000.000 = kg */
  $$("[data-wcalc]").forEach(function (f) {
    var el = f.elements, dims = { tron: ["d"], ong: ["d", "di"], khoi: ["a", "b"] };
    var run = function () {
      var shape = $('input[name="shape"]:checked', f).value, rho = Number(el.mat.value), L = Number(el.l.value), q = Math.max(1, Math.floor(Number(el.q.value) || 1));
      $$("[data-dim]", f).forEach(function (d) { var k = d.getAttribute("data-dim"); if (k === "d" || k === "di" || k === "a" || k === "b") d.hidden = dims[shape].indexOf(k) < 0; });
      $('label[for="w-d"]', f).textContent = t(shape === "ong" ? "Đường kính ngoài D (mm)" : "Đường kính D (mm)");
      var V = 0, rule = "", err = "";
      if (shape === "tron") { var D = Number(el.d.value); V = Math.PI * D * D / 4 * L; rule = "V = π × D² / 4 × L"; if (!(D > 0)) err = t("Nhập đường kính lớn hơn 0."); }
      if (shape === "ong") { var Do = Number(el.d.value), Di = Number(el.di.value); V = Math.PI * (Do * Do - Di * Di) / 4 * L; rule = "V = π × (D² - d²) / 4 × L"; if (!(Do > 0)) err = t("Nhập đường kính ngoài lớn hơn 0."); else if (Di >= Do) err = t("Đường kính trong phải nhỏ hơn đường kính ngoài."); }
      if (shape === "khoi") { var a = Number(el.a.value), b = Number(el.b.value); V = a * b * L; rule = t("V = rộng × dày × dài"); if (!(a > 0 && b > 0)) err = t("Nhập rộng và dày lớn hơn 0."); }
      if (!(L > 0)) err = err || t("Nhập chiều dài lớn hơn 0.");
      var e = $("[data-w-err]", f); e.hidden = !err; e.textContent = err;
      var kg = err ? 0 : V * rho / 1e6;
      $("[data-w-one]", f).textContent = (kg < 10 ? fmt(kg, 3) : fmt(kg, 2)) + " kg";
      $("[data-w-all]", f).textContent = t("{w} cho {q} chiếc", { w: kg * q >= 1000 ? t("{w} tấn", { w: fmt(kg * q / 1000, 3) }) : fmt(kg * q, 2) + " kg", q: q });
      $("[data-w-rule]", f).textContent = rule + ", ρ = " + fmt(rho, 2).replace(/[.,]?0+$/, "") + " g/cm³";
    };
    f.addEventListener("input", run); f.addEventListener("change", run); f.addEventListener("submit", function (e) { e.preventDefault(); }); run();
  });

  /* Form báo giá: điền sẵn từ URL (?hm=lĩnh vực, ?sp=mã sản phẩm), đính kèm tệp, kiểm tra */
  var params = new URLSearchParams(location.search);
  var rules = {
    name: function (v) { return !v.trim() ? t("Vui lòng nhập họ và tên.") : v.trim().length < 2 ? t("Họ tên cần ít nhất 2 ký tự.") : ""; },
    phone: function (v) { var d = v.replace(/[\s.\-()]/g, "").replace(/^\+84/, "0"); return !d ? t("Vui lòng nhập số điện thoại.") : (LANG === "vi" ? /^0\d{9}$/ : /^(0\d{9}|\+?\d{8,15})$/).test(d) ? "" : t("PHONE"); },
    email: function (v) { return !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : t("Email chưa đúng, ví dụ ten@congty.vn."); },
    qty: function (v) { return !v || Number(v) >= 1 ? "" : t("Số lượng tối thiểu là 1."); }
  };
  var MAX = 5, MAXB = 20 * 1024 * 1024, OK_EXT = /\.(pdf|dwg|dxf|step|stp|igs|iges|jpe?g|png)$/i;
  $$("[data-form]").forEach(function (form) {
    var names = Object.keys(rules).filter(function (n) { return form.elements[n]; }), submit = $("[data-submit]", form);
    var hm = params.get("hm"), sp = params.get("sp");
    if (hm && form.elements.service) { var opt = form.elements.service.querySelector('option[data-key="' + hm.replace(/[^a-z0-9-]/g, "") + '"]'); if (opt) opt.selected = true; }
    if (sp && form.elements.note) form.elements.note.value = t("Hỏi giá chi tiết tương tự mẫu {sp} trên website.", { sp: sp.replace(/[^\w-]/g, "") });
    var files = [], fileIn = form.elements.files, list = $("[data-file-list]", form), dz = $("[data-drop]", form), fErr = fileIn ? $("#" + fileIn.getAttribute("aria-describedby")) : null;
    function renderFiles() {
      if (!list) return;
      list.innerHTML = files.map(function (f, i) { return "<li><span>" + f.name.replace(/</g, "&lt;") + " · " + fmt(f.size / 1048576, 1) + " MB</span><button type=\"button\" data-rm-file=\"" + i + "\">" + t("Bỏ") + "</button></li>"; }).join("");
    }
    function addFiles(fl) {
      var msg = "";
      Array.prototype.forEach.call(fl, function (f) {
        if (files.length >= MAX) { msg = t("Tối đa {n} tệp.", { n: MAX }); return; }
        if (!OK_EXT.test(f.name)) { msg = t("Tệp {f} không đúng định dạng. Dùng PDF, DWG, DXF, STEP hoặc ảnh.", { f: f.name }); return; }
        if (f.size > MAXB) { msg = t("Tệp {f} lớn hơn 20 MB.", { f: f.name }); return; }
        files.push(f);
      });
      if (fErr) fErr.textContent = msg; renderFiles();
    }
    if (fileIn) {
      fileIn.addEventListener("change", function () { addFiles(fileIn.files); fileIn.value = ""; });
      list.addEventListener("click", function (e) { var b = e.target.closest("[data-rm-file]"); if (b) { files.splice(Number(b.getAttribute("data-rm-file")), 1); renderFiles(); } });
      ["dragenter", "dragover"].forEach(function (t) { dz.addEventListener(t, function (e) { e.preventDefault(); dz.classList.add("is-over"); }); });
      ["dragleave", "drop"].forEach(function (t) { dz.addEventListener(t, function (e) { e.preventDefault(); dz.classList.remove("is-over"); }); });
      dz.addEventListener("drop", function (e) { if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files); });
    }
    function validate(n) {
      var el = form.elements[n], msg = rules[n](el.value), f = el.closest(".field");
      f.classList.toggle("has-error", !!msg); el.setAttribute("aria-invalid", msg ? "true" : "false");
      var e = $(".error", f); if (e) e.textContent = msg; return !msg;
    }
    names.forEach(function (n) {
      var el = form.elements[n];
      el.addEventListener("input", function () { if (el.closest(".field").classList.contains("has-error")) validate(n); });
      el.addEventListener("blur", function () { if (el.value) validate(n); });
    });
    var d = form.elements.date; if (d) d.min = new Date().toISOString().slice(0, 10);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fe = $("[data-form-error]", form); fe.hidden = true;
      var bad = null; names.forEach(function (n) { if (!validate(n) && !bad) bad = form.elements[n]; });
      if (bad) { bad.focus(); return; }
      var fd = new FormData(form); fd.delete("files"); files.forEach(function (f) { fd.append("files", f); });
      submit.disabled = true; submit.classList.add("is-loading");
      var ep = form.getAttribute("data-endpoint");
      var req = ep ? fetch(ep, { method: "POST", body: fd }).then(function (r) { if (!r.ok) throw new Error(r.status); }) : new Promise(function (r) { setTimeout(r, 900); }); // chưa có máy chủ: mô phỏng gửi thành công
      req.then(function () {
        $("[data-success-name]", form).textContent = form.elements.name.value.trim();
        $("[data-success-phone]", form).textContent = form.elements.phone.value.trim();
        $("[data-success-code]", form).textContent = "RFQ-" + String(Date.now()).slice(-6);
        $("[data-form-body]", form).hidden = true; var ok = $("[data-form-success]", form); ok.hidden = false; ok.focus();
      }).catch(function () { fe.hidden = false; }).then(function () { submit.disabled = false; submit.classList.remove("is-loading"); });
    });
    var again = $("[data-form-again]", form);
    if (again) again.addEventListener("click", function () {
      form.reset(); files = []; renderFiles();
      $$(".field", form).forEach(function (f) { f.classList.remove("has-error"); var e = $(".error", f); if (e) e.textContent = ""; });
      $("[data-form-body]", form).hidden = false; $("[data-form-success]", form).hidden = true; form.elements.name.focus();
    });
  });

  /* Mục lục bài viết */
  var tocLinks = $$(".article-toc ol a");
  if (tocLinks.length) {
    var tio = io(function (es) { es.forEach(function (en) { if (en.isIntersecting) tocLinks.forEach(function (a) { a.classList.toggle("is-on", a.getAttribute("href") === "#" + en.target.id); }); }); }, { rootMargin: "-20% 0px -65% 0px" });
    if (tio) tocLinks.forEach(function (a) { var t = document.getElementById(a.getAttribute("href").slice(1)); if (t) tio.observe(t); });
  }

  /* Hiện dần khi cuộn */
  var rio = !reduce && io(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); rio.unobserve(en.target); } }); }, { rootMargin: "0px 0px -8% 0px", threshold: .06 });
  $$(".reveal").forEach(function (el) {
    var sib = $$(":scope > .reveal", el.parentElement); el.style.setProperty("--i", String(Math.min(4, sib.indexOf(el))));
    if (rio) rio.observe(el); else el.classList.add("is-visible");
  });

  $$("[data-year]").forEach(function (y) { y.textContent = String(new Date().getFullYear()); });
})();
