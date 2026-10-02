/* Hoa ngữ ISZ - main.js (vanilla, dùng chung cho mọi trang) */
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.add("js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) root.classList.add("reduce");
  var desktop = window.matchMedia("(min-width: 1181px)");
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var money = function (n) { return Math.round(n).toLocaleString("de-DE") + "đ"; };
  var io = function (cb, opts) { return "IntersectionObserver" in window ? new IntersectionObserver(cb, opts) : null; };
  var todayStr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  /* Header đậm hơn khi cuộn */
  var header = $("[data-header]");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 12); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* Menu điện thoại phủ kín màn hình */
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

  /* Menu thả */
  $$(".has-drop").forEach(function (li) {
    var btn = $("[data-drop-toggle]", li), timer;
    function set(open) { li.classList.toggle("is-open", open); btn.setAttribute("aria-expanded", String(open)); }
    btn.addEventListener("click", function () { set(!li.classList.contains("is-open")); });
    li.addEventListener("mouseenter", function () { if (desktop.matches) { clearTimeout(timer); set(true); } });
    li.addEventListener("mouseleave", function () { if (desktop.matches) timer = setTimeout(function () { set(false); }, 160); });
    li.addEventListener("focusout", function (e) { if (!li.contains(e.relatedTarget)) set(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && li.classList.contains("is-open")) { set(false); btn.focus(); } });
    document.addEventListener("click", function (e) { if (!li.contains(e.target)) set(false); });
  });

  /* ------------------------------------------------------------ Đọc tiếng Trung (Web Speech API) */
  var synth = window.speechSynthesis, zhVoice = null;
  function pickVoice() {
    if (!synth) return;
    var vs = synth.getVoices();
    zhVoice = vs.filter(function (v) { return /^zh[-_]CN/i.test(v.lang); })[0] || vs.filter(function (v) { return /^zh/i.test(v.lang) || /cmn/i.test(v.lang); })[0] || null;
  }
  if (synth) { pickVoice(); if (synth.addEventListener) synth.addEventListener("voiceschanged", pickVoice); }
  function say(text) {
    if (!synth || !text) { showVoiceNote(); return; }
    synth.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN"; u.rate = 0.78;
    if (zhVoice) u.voice = zhVoice; else setTimeout(function () { pickVoice(); if (!zhVoice) showVoiceNote(); }, 400);
    synth.speak(u);
  }
  function showVoiceNote() { $$("[data-voice-note]").forEach(function (n) { n.hidden = false; }); }

  /* Thẻ thanh điệu */
  $$("[data-tones] .tone").forEach(function (t) {
    t.addEventListener("click", function () {
      $$("[data-tones] .tone").forEach(function (x) { x.classList.remove("is-playing"); });
      void t.offsetWidth; t.classList.add("is-playing");
      say(t.getAttribute("data-say"));
    });
  });

  /* Thẻ từ: lật và đọc */
  $$(".fcard").forEach(function (c) {
    c.addEventListener("click", function () {
      var on = c.getAttribute("aria-pressed") !== "true";
      c.setAttribute("aria-pressed", String(on));
      if (on) say(c.getAttribute("data-say"));
    });
  });
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-say-from]");
    if (b) { var src = $(b.getAttribute("data-say-from")); if (src) say(src.getAttribute("data-char")); }
  });

  /* ------------------------------------------------------------ Ô chữ điền: hanzi-writer (tải khi cần) */
  var hwPromise = null;
  function loadHW() {
    if (window.HanziWriter) return Promise.resolve(window.HanziWriter);
    if (hwPromise) return hwPromise;
    hwPromise = new Promise(function (res, rej) {
      var s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/hanzi-writer@3.7.2/dist/hanzi-writer.min.js";
      s.async = true; s.onload = function () { res(window.HanziWriter); }; s.onerror = rej;
      document.head.appendChild(s);
    });
    return hwPromise;
  }
  function makeWriter(box, char, done) {
    var target = $("[data-hanzi-target]", box), size = Math.floor(box.clientWidth) - 4;
    if (!target || size < 40) return null;
    target.innerHTML = "";
    var w = window.HanziWriter.create(target, char, {
      width: size, height: size, padding: Math.round(size * 0.07),
      strokeColor: "#16212c", radicalColor: "#d2232a", outlineColor: "#e3e8ee", drawingColor: "#d2232a", highlightColor: "#f1a9a6",
      showOutline: true, showCharacter: false, strokeAnimationSpeed: 1.1, delayBetweenStrokes: 160, drawingWidth: Math.max(14, size / 16),
      onLoadCharDataSuccess: function () { box.classList.add("is-live"); if (done) done(); },
      onLoadCharDataError: function () { box.classList.remove("is-live"); }
    });
    return w;
  }
  var hwBoxes = $$("[data-hanzi]");
  if (hwBoxes.length) {
    var start = function (box) {
      loadHW().then(function () {
        if (box.closest("[data-pad]")) return initPad(box.closest("[data-pad]"), box);
        var ch = box.getAttribute("data-hanzi");
        var w = makeWriter(box, ch, function () {
          if (reduce) { w.showCharacter(); return; }
          if (box.hasAttribute("data-hanzi-loop")) w.loopCharacterAnimation(); else w.animateCharacter();
        });
      }).catch(function () { /* không tải được thư viện: giữ chữ tĩnh */ });
    };
    var hio = io(function (es) { es.forEach(function (en) { if (en.isIntersecting) { hio.unobserve(en.target); start(en.target); } }); }, { rootMargin: "200px" });
    hwBoxes.forEach(function (b) { if (hio) hio.observe(b); else start(b); });
  }
  function initPad(pad, box) {
    var chars = $$(".pad-char", pad), mode = $("[data-pad-mode]", pad), writer = null, cur = chars[0], lastW = 0;
    function setMode(t, cls) { mode.textContent = t; mode.className = "pad-mode" + (cls ? " " + cls : ""); }
    function build(anim) {
      lastW = box.clientWidth;
      writer = makeWriter(box, cur.getAttribute("data-char"), function () {
        if (anim && !reduce) { setMode("Xem thứ tự nét"); writer.animateCharacter(); } else writer.showCharacter();
      });
    }
    function select(btn) {
      cur = btn;
      chars.forEach(function (c) { c.setAttribute("aria-pressed", String(c === btn)); });
      $("[data-pad-py]", pad).textContent = btn.getAttribute("data-py");
      $("[data-pad-hv]", pad).textContent = btn.getAttribute("data-hv");
      $("[data-pad-vi]", pad).textContent = btn.getAttribute("data-vi");
      $("[data-pad-n]", pad).textContent = btn.getAttribute("data-n");
      $(".tzg-static", box).textContent = btn.getAttribute("data-char");
      build(true);
    }
    chars.forEach(function (c) { c.addEventListener("click", function () { select(c); }); });
    $("[data-pad-play]", pad).addEventListener("click", function () { if (!writer) return; writer.cancelQuiz && writer.cancelQuiz(); setMode("Xem thứ tự nét"); writer.hideCharacter(); writer.animateCharacter(); });
    $("[data-pad-quiz]", pad).addEventListener("click", function () {
      if (!writer) return;
      var n = Number(cur.getAttribute("data-n")), mistakes = 0;
      writer.hideCharacter();
      setMode("Viết nét 1 / " + n, "is-quiz");
      writer.quiz({
        showHintAfterMisses: 2, highlightOnComplete: true,
        onCorrectStroke: function (d) { setMode("Viết nét " + Math.min(n, d.strokeNum + 2) + " / " + n, "is-quiz"); },
        onMistake: function () { mistakes++; setMode("Chưa đúng nét, thử lại", "is-quiz"); },
        onComplete: function (d) { setMode(d.totalMistakes ? "Xong, sai " + d.totalMistakes + " lần" : "Đúng hết, giỏi lắm", "is-done"); }
      });
    });
    build(true);
    var rt;
    window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { if (Math.abs(box.clientWidth - lastW) > 8) build(false); }, 200); });
  }

  /* ------------------------------------------------------------ Hiệu ứng khi vào màn hình */
  var inio = !reduce && io(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); inio.unobserve(en.target); } }); }, { threshold: 0.25 });
  $$(".stairs, .sbar").forEach(function (el) { if (inio) inio.observe(el); else el.classList.add("is-in"); });

  var rv = $$(".reveal");
  var rio = !reduce && io(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); rio.unobserve(en.target); } }); }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
  rv.forEach(function (el) {
    var sib = $$(":scope > .reveal", el.parentElement);
    el.style.setProperty("--i", String(Math.min(4, Math.max(0, sib.indexOf(el)))));
    if (rio) rio.observe(el); else el.classList.add("is-visible");
  });

  /* ------------------------------------------------------------ Tab (phím mũi tên chuyển tab) */
  $$("[data-tabs]").forEach(function (box) {
    var tabs = $$(':scope > .tab-list [role="tab"]', box);
    function select(t, focus) {
      tabs.forEach(function (x) {
        var on = x === t, panel = document.getElementById(x.getAttribute("aria-controls"));
        x.setAttribute("aria-selected", String(on)); x.tabIndex = on ? 0 : -1;
        panel.hidden = !on;
        if (on) $$(".sbar", panel).forEach(function (s) { s.classList.add("is-in"); });
      });
      if (focus) t.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t); });
      t.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (d) { e.preventDefault(); select(tabs[(i + d + tabs.length) % tabs.length], true); }
      });
    });
  });

  /* ------------------------------------------------------------ Bậc thang HSK + tính lộ trình */
  $$("[data-stairs]").forEach(function (box) {
    var stairs = $$(".stair", box), from = $("[data-st-from]", box), to = $("[data-st-to]", box);
    var d = function (s, a) { return s.getAttribute("data-" + a); };
    function show(s) {
      stairs.forEach(function (x) { x.classList.toggle("is-on", x === s); x.setAttribute("aria-pressed", String(x === s)); });
      $("[data-st-name]", box).textContent = d(s, "name");
      $("[data-st-outcome]", box).textContent = d(s, "outcome");
      $("[data-st-weeks]", box).textContent = d(s, "weeks");
      $("[data-st-sessions]", box).textContent = d(s, "sessions");
      $("[data-st-fee]", box).textContent = money(Number(d(s, "fee")));
    }
    function calc() {
      var a = Number(from.value), b = Number(to.value), out = $("[data-st-calc]", box);
      stairs.forEach(function (s, i) { s.classList.toggle("is-in-range", i > a && i <= b); });
      if (b <= a) { out.innerHTML = "Bạn đã đạt cấp này. Chọn mục tiêu cao hơn để tính tiếp."; return; }
      var w = 0, n = 0, f = 0;
      for (var i = a + 1; i <= b; i++) { w += Number(d(stairs[i], "weeks")); n += Number(d(stairs[i], "sessions")); f += Number(d(stairs[i], "fee")); }
      var k = b - a;
      out.innerHTML = "Khoảng <strong>" + w + " tuần</strong> (" + (w / 4.3).toFixed(0) + " tháng), " + n + " buổi, học phí " + money(f) + (k > 1 ? " nếu học liền " + k + " khóa." : ".");
      show(stairs[b]);
    }
    stairs.forEach(function (s, i) { s.addEventListener("click", function () { show(s); to.value = String(i); calc(); }); });
    from.addEventListener("change", calc); to.addEventListener("change", calc);
    calc();
  });

  /* ------------------------------------------------------------ Popup đăng ký, điền sẵn từ nút bấm */
  var modal = $("[data-modal]"), lastTrigger = null;
  function openModal(trigger) {
    if (!modal) return;
    lastTrigger = trigger || null;
    setNav(false);
    var form = $("[data-form]", modal);
    resetForm(form);
    if (trigger) {
      var get = function (a) { return trigger.getAttribute(a); }, el = form.elements;
      if (get("data-program")) setSelect(el.program, get("data-program"));
      if (get("data-branch")) setSelect(el.branch, get("data-branch"));
      if (get("data-note")) el.note.value = get("data-note");
      if (get("data-level")) $$('input[name="level"]', form).forEach(function (r) { r.checked = r.value === get("data-level"); });
    }
    if (typeof modal.showModal === "function") modal.showModal(); else modal.setAttribute("open", "");
    setTimeout(function () { form.elements.name.focus(); }, 60);
  }
  function setSelect(sel, v) { var o = $$("option", sel).filter(function (x) { return x.value === v || x.value.indexOf(v) === 0; })[0]; if (o) sel.value = o.value; }
  function closeModal() { if (modal) { if (typeof modal.close === "function") modal.close(); else modal.removeAttribute("open"); } }
  if (modal) {
    modal.addEventListener("close", function () { if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus(); });
    modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-open-reg]");
    if (t) { e.preventDefault(); openModal(t); return; }
    if (e.target.closest("[data-close-modal]")) closeModal();
  });
  if (location.hash === "#dang-ky") openModal();

  /* ------------------------------------------------------------ Lọc bằng chip */
  $$("[data-filter-scope]").forEach(function (scope) {
    var chips = $$("[data-filter-value]", scope), empty = $("[data-empty]", scope);
    var key = scope.getAttribute("data-filter-key") || "category";
    function apply(v) {
      var shown = 0;
      chips.forEach(function (c) { var on = c.getAttribute("data-filter-value") === v; c.classList.toggle("is-active", on); c.setAttribute("aria-pressed", String(on)); });
      $$("[data-filter-target] > *", scope).forEach(function (it) { var ok = v === "all" || it.getAttribute("data-" + key) === v; it.hidden = !ok; if (ok) { shown++; it.classList.add("is-visible"); } });
      if (empty) empty.hidden = shown > 0;
    }
    chips.forEach(function (c) { c.addEventListener("click", function () { apply(c.getAttribute("data-filter-value")); }); });
    var q = new URLSearchParams(location.search).get("loai");
    if (q && $('[data-filter-value="' + q + '"]', scope)) apply(q);
  });

  /* ------------------------------------------------------------ Lịch khai giảng: ẩn lớp đã qua, lọc */
  $$(".crow").forEach(function (r) { if (r.getAttribute("data-start") < todayStr) r.remove(); });
  var cf = $("[data-class-filter]");
  if (cf) {
    var rows = $$(".crow"), count = $("[data-class-count]"), cEmpty = $("[data-class-empty]"), list = $("[data-clist]");
    var params = new URLSearchParams(location.search);
    if (params.get("ct") && $('option[value="' + params.get("ct") + '"]', cf.elements.program)) cf.elements.program.value = params.get("ct");
    if (params.get("cs") && $('option[value="' + params.get("cs") + '"]', cf.elements.branch)) cf.elements.branch.value = params.get("cs");
    var filter = function () {
      var p = cf.elements.program.value, b = cf.elements.branch.value, dv = ($('input[name="days"]:checked', cf) || {}).value || "", n = 0;
      rows.forEach(function (r) {
        var ok = (!p || r.getAttribute("data-program") === p) && (!b || r.getAttribute("data-branch") === b) && (!dv || dv.split(" ").indexOf(r.getAttribute("data-days")) > -1);
        r.hidden = !ok; if (ok) n++;
      });
      count.textContent = n ? "Có " + n + " lớp phù hợp" : "";
      cEmpty.hidden = n > 0; if (list) list.hidden = n === 0;
    };
    cf.addEventListener("change", filter);
    cf.addEventListener("submit", function (e) { e.preventDefault(); });
    var reset = $("[data-class-reset]");
    if (reset) reset.addEventListener("click", function () { cf.reset(); filter(); });
    filter();
  }

  /* ------------------------------------------------------------ Kiểm tra trình độ */
  var quiz = $("[data-quiz]");
  if (quiz) {
    var qs = $$(".quiz-q", quiz), idx = 0, correct = 0, per = {}, next = $("[data-quiz-next]", quiz), skip = $("[data-quiz-skip]", quiz);
    var bar = $("[data-quiz-bar]", quiz), cnt = $("[data-quiz-count]", quiz), result = $("[data-quiz-result]", quiz);
    var LEVELS = [
      [2, "Nên bắt đầu từ HSK 1", "Bạn đã biết một vài từ, nhưng nên học lại từ phát âm và pinyin để có nền chắc. Chọn HSK 1 nếu cần chứng chỉ, hoặc Giao tiếp 1 nếu muốn nói được nhanh.", "Luyện thi HSK", "Kết quả kiểm tra online: nên học HSK 1"],
      [5, "Nên vào lớp HSK 2", "Bạn nắm được câu cơ bản và số đếm. Lớp HSK 2 giúp mở rộng lên 300 từ và các mẫu câu so sánh, thời gian.", "Luyện thi HSK", "Kết quả kiểm tra online: nên học HSK 2"],
      [8, "Nên vào lớp HSK 3", "Bạn đã có nền HSK 2 khá chắc. Lớp HSK 3 tập trung vào ngữ pháp 了, 把, bổ ngữ và đọc không cần pinyin.", "Luyện thi HSK", "Kết quả kiểm tra online: nên học HSK 3"],
      [10, "Nên vào lớp HSK 4", "Bạn đọc hiểu tốt câu dài và từ nối. HSK 4 là cấp nhiều trường và công ty yêu cầu, nên luyện đề ngay từ đầu khóa.", "Luyện thi HSK", "Kết quả kiểm tra online: nên học HSK 4"],
      [99, "Nên vào lớp HSK 5", "Trình độ của bạn đã ở mức trung cao cấp. Buổi kiểm tra nói với giáo viên sẽ giúp chọn giữa HSK 5 và lớp luyện đề riêng.", "Luyện thi HSK", "Kết quả kiểm tra online: nên học HSK 5"]
    ];
    var show = function (i) {
      qs.forEach(function (q, k) { q.hidden = k !== i; });
      bar.style.width = ((i + 1) / qs.length * 100) + "%";
      cnt.textContent = "Câu " + (i + 1) + " / " + qs.length;
      next.disabled = !$("input:checked", qs[i]);
      var f = $("input", qs[i]); if (f && i) f.focus({ preventScroll: true });
    };
    var finish = function () {
      $$(".quiz-list, .quiz-nav, .quiz-progress, .quiz-count", quiz).forEach(function (e) { e.hidden = true; });
      var lv = LEVELS.filter(function (l) { return correct <= l[0]; })[0];
      $("[data-quiz-score]", quiz).textContent = String(correct);
      $("[data-quiz-level]", quiz).textContent = lv[1];
      $("[data-quiz-text]", quiz).textContent = lv[2];
      var reg = $("[data-quiz-reg]", quiz);
      reg.setAttribute("data-program", lv[3]);
      reg.setAttribute("data-note", lv[4] + " (" + correct + "/" + qs.length + " câu đúng)");
      reg.setAttribute("data-level", correct <= 2 ? "Biết một chút" : "Đã có HSK");
      result.hidden = false; result.focus();
    };
    var advance = function (ok) {
      if (ok) correct++;
      idx++;
      if (idx >= qs.length) finish(); else show(idx);
    };
    quiz.addEventListener("change", function (e) { if (e.target.type === "radio") next.disabled = false; });
    next.addEventListener("click", function () {
      var c = $("input:checked", qs[idx]); if (!c) return;
      advance(c.value === qs[idx].getAttribute("data-answer"));
    });
    skip.addEventListener("click", function () { advance(false); });
    $("[data-quiz-again]", quiz).addEventListener("click", function () {
      idx = 0; correct = 0;
      $$("input", quiz).forEach(function (r) { r.checked = false; });
      $$(".quiz-list, .quiz-nav, .quiz-progress, .quiz-count", quiz).forEach(function (e) { e.hidden = false; });
      result.hidden = true; show(0);
      quiz.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
    });
    show(0);
  }

  /* ------------------------------------------------------------ Tìm câu hỏi (gõ không dấu vẫn tìm được) */
  var faqInput = $("[data-faq-search]");
  if (faqInput) {
    var faqs = $$(".faq-item"), groups = $$(".faq-group"), none = $("[data-faq-empty]");
    var norm = function (t) { return t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d"); };
    var search = function () {
      var q = norm(faqInput.value.trim()), shown = 0;
      faqs.forEach(function (f) { var ok = !q || norm(f.textContent).indexOf(q) > -1; f.hidden = !ok; if (ok) shown++; if (q && ok) f.open = true; });
      groups.forEach(function (g) { g.hidden = !$$(".faq-item:not([hidden])", g).length; });
      if (none) none.hidden = shown > 0;
    };
    faqInput.addEventListener("input", search);
    $$("[data-faq-suggest]").forEach(function (b) { b.addEventListener("click", function () { faqInput.value = b.textContent; search(); faqInput.focus(); }); });
  }

  /* Nút cuộn ngang */
  $$("[data-scroll-ctrl]").forEach(function (ctrl) {
    var track = document.getElementById(ctrl.getAttribute("data-scroll-ctrl"));
    if (!track) return;
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

  /* ------------------------------------------------------------ Form đăng ký */
  var rules = {
    name: function (v) { return !v.trim() ? "Vui lòng nhập họ và tên." : v.trim().length < 2 ? "Họ tên cần ít nhất 2 ký tự." : ""; },
    phone: function (v) {
      var d = v.replace(/[\s.\-()]/g, "").replace(/^\+84/, "0");
      if (!d) return "Vui lòng nhập số điện thoại.";
      return /^0\d{9}$/.test(d) ? "" : "Số điện thoại gồm 10 chữ số, ví dụ 0912 345 678.";
    },
    agree: function (v, el) { return el.checked ? "" : "Vui lòng đồng ý để ISZ gọi lại cho bạn."; }
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
      var data = { page: location.pathname.split("/").pop() || "index.html" }, times = [];
      new FormData(form).forEach(function (v, k) { if (k === "time") times.push(v); else if (k !== "agree") data[k] = String(v).trim(); });
      data.time = times.join(", ");
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
