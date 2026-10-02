/* BBE English - main.js (vanilla, không phụ thuộc thư viện). Dùng chung cho mọi trang. */
(function () {
  "use strict";

  document.documentElement.classList.add("js");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var desktop = window.matchMedia("(min-width: 1024px)");
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var smooth = reduceMotion ? "auto" : "smooth";

  /* ---------- Header: bóng đổ khi cuộn ---------- */
  var header = $("[data-header]");
  if (header && "IntersectionObserver" in window) {
    var sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;height:40px;pointer-events:none;";
    document.body.prepend(sentinel);
    new IntersectionObserver(function (entries) {
      header.classList.toggle("is-scrolled", !entries[0].isIntersecting);
    }).observe(sentinel);
  }

  /* ---------- Menu mobile ---------- */
  var nav = $("[data-nav]");
  var toggle = $("[data-nav-toggle]");
  function setNav(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("nav-open", open);
    toggle.querySelector(".sr-only").textContent = open ? "Đóng menu" : "Mở menu";
    if (!open) closeAllMega();
  }
  if (toggle) {
    toggle.addEventListener("click", function () { setNav(toggle.getAttribute("aria-expanded") !== "true"); });
    desktop.addEventListener("change", function () { setNav(false); });
  }

  /* ---------- Menu mega ---------- */
  var megaItems = $$(".nav-item").filter(function (li) { return $("[data-mega-toggle]", li); });
  function setMega(li, open) {
    li.classList.toggle("is-open", open);
    $("[data-mega-toggle]", li).setAttribute("aria-expanded", String(open));
  }
  function closeAllMega(except) {
    megaItems.forEach(function (li) { if (li !== except) setMega(li, false); });
  }
  megaItems.forEach(function (li) {
    var btn = $("[data-mega-toggle]", li);
    var timer = null;
    btn.addEventListener("click", function () {
      var open = !li.classList.contains("is-open");
      closeAllMega(li);
      setMega(li, open);
    });
    li.addEventListener("mouseenter", function () {
      if (!desktop.matches) return;
      clearTimeout(timer);
      closeAllMega(li);
      setMega(li, true);
    });
    li.addEventListener("mouseleave", function () {
      if (!desktop.matches) return;
      timer = setTimeout(function () { setMega(li, false); }, 140);
    });
    li.addEventListener("focusout", function (e) {
      if (desktop.matches && !li.contains(e.relatedTarget)) setMega(li, false);
    });
  });
  document.addEventListener("click", function (e) {
    if (desktop.matches && !e.target.closest(".nav-item")) closeAllMega();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var openItem = megaItems.filter(function (li) { return li.classList.contains("is-open"); })[0];
    if (openItem) { setMega(openItem, false); $("[data-mega-toggle]", openItem).focus(); return; }
    if (toggle && toggle.getAttribute("aria-expanded") === "true") { setNav(false); toggle.focus(); }
  });
  // Đóng menu mobile khi bấm link cùng trang (ví dụ #dang-ky)
  if (nav) $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setNav(false); }); });

  /* ---------- Tabs (ARIA tabs + phím mũi tên), dùng cho mọi [data-tabs] ---------- */
  function selectTab(tab, focus) {
    var list = tab.closest('[role="tablist"]');
    var tabs = $$('[role="tab"]', list);
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute("aria-controls"));
      if (!panel) return;
      panel.hidden = !on;
      if (on) { panel.classList.remove("is-entering"); void panel.offsetWidth; panel.classList.add("is-entering"); }
    });
    if (focus) tab.focus();
    var box = list.getBoundingClientRect(), r = tab.getBoundingClientRect();
    if (r.left < box.left || r.right > box.right) list.scrollBy({ left: r.left - box.left - 16, behavior: smooth });
  }
  $$('[role="tablist"]').forEach(function (list) {
    var tabs = $$('[role="tab"]', list);
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { selectTab(tab); });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
        if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === "Home") next = tabs[0];
        if (e.key === "End") next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); selectTab(next, true); }
      });
    });
  });
  $$("[data-open-tab]").forEach(function (link) {
    link.addEventListener("click", function () {
      var t = document.getElementById(link.getAttribute("data-open-tab"));
      if (t) selectTab(t);
    });
  });

  /* ---------- Bộ lọc chip (lịch khai giảng, khóa học, tin tức, cảm nhận) ----------
     Cấu trúc: [data-filter-scope] chứa các nhóm [data-filter data-filter-group="category|branch"]
     với nút [data-filter-value], danh sách [data-filter-target] và thông báo trống [data-empty]. */
  $$("[data-filter-scope]").forEach(function (scope) {
    var state = {};
    var groups = $$("[data-filter]", scope);
    var items = $$("[data-filter-target] > *", scope);
    var empty = $("[data-empty]", scope);
    groups.forEach(function (g) { state[g.getAttribute("data-filter-group") || "category"] = "all"; });

    function apply() {
      var shown = 0;
      items.forEach(function (it) {
        var ok = Object.keys(state).every(function (k) { return state[k] === "all" || it.getAttribute("data-" + k) === state[k]; });
        it.hidden = !ok;
        if (ok) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    }
    function set(groupKey, value) {
      state[groupKey] = value;
      groups.forEach(function (g) {
        if ((g.getAttribute("data-filter-group") || "category") !== groupKey) return;
        $$("[data-filter-value]", g).forEach(function (c) {
          var on = c.getAttribute("data-filter-value") === value;
          c.classList.toggle("is-active", on);
          c.setAttribute("aria-pressed", String(on));
        });
      });
      apply();
    }
    groups.forEach(function (g) {
      var key = g.getAttribute("data-filter-group") || "category";
      $$("[data-filter-value]", g).forEach(function (c) {
        c.addEventListener("click", function () { set(key, c.getAttribute("data-filter-value")); });
      });
    });
    scope._setFilter = set;

    // Mở trang với ?loai=ielts để lọc sẵn
    var q = new URLSearchParams(location.search).get("loai");
    if (q && $('[data-filter-value="' + q + '"]', scope)) set("category", q);
  });
  $$("[data-filter-link]").forEach(function (link) {
    link.addEventListener("click", function () {
      var target = document.querySelector(link.getAttribute("href"));
      if (target && target._setFilter) target._setFilter("category", link.getAttribute("data-filter-link"));
    });
  });

  /* ---------- Slider cảm nhận ---------- */
  $$("[data-slider]").forEach(function (slider) {
    var slides = $$(".testi-slide", slider);
    var idx = 0;
    function show(n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.hidden = i !== idx; s.classList.toggle("is-active", i === idx); });
    }
    $("[data-prev]", slider).addEventListener("click", function () { show(idx - 1); });
    $("[data-next]", slider).addEventListener("click", function () { show(idx + 1); });
    var startX = null;
    slider.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
      startX = null;
    });
  });

  /* ---------- Hiện dần khi cuộn tới ---------- */
  var reveals = $$(".reveal");
  if (!reduceMotion && "IntersectionObserver" in window) {
    reveals.forEach(function (el) {
      var siblings = $$(":scope > .reveal", el.parentElement);
      el.style.setProperty("--i", String(Math.max(0, siblings.indexOf(el))));
    });
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); ro.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
    reveals.forEach(function (el) { ro.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Đếm số ---------- */
  var counters = $$("[data-count]");
  if (!reduceMotion && "IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, target = parseFloat(el.getAttribute("data-count"));
        var dec = parseInt(el.getAttribute("data-decimals") || "0", 10);
        var vi = el.getAttribute("data-format") === "vi";
        var t0 = performance.now();
        (function tick(now) {
          var p = Math.min(1, (now - t0) / 1400), v = target * (1 - Math.pow(1 - p, 3));
          el.textContent = vi ? Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : v.toFixed(dec);
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
        co.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* ---------- Nút "Chọn lớp này": điền sẵn form và cuộn tới ---------- */
  function goToForm(courseIndex, note) {
    var form = $("[data-form]");
    if (!form) { location.href = "lien-he.html#dang-ky"; return; }
    if (courseIndex && form.elements.course) form.elements.course.selectedIndex = courseIndex;
    if (note && form.elements.note) form.elements.note.value = note;
    document.getElementById("dang-ky").scrollIntoView({ behavior: smooth });
    setTimeout(function () { form.elements.name.focus({ preventScroll: true }); }, reduceMotion ? 0 : 600);
  }
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-pick-class]");
    if (!btn) return;
    goToForm(parseInt(btn.getAttribute("data-course-index"), 10), "Muốn đăng ký lớp: " + btn.getAttribute("data-pick-class"));
  });

  /* ---------- Form (đăng ký, liên hệ, ứng tuyển) ---------- */
  var rules = {
    name: function (v) { return !v.trim() ? "Vui lòng nhập họ và tên." : v.trim().length < 2 ? "Họ tên cần ít nhất 2 ký tự." : ""; },
    phone: function (v) {
      var d = v.replace(/[\s.\-()]/g, "").replace(/^\+84/, "0");
      if (!d) return "Vui lòng nhập số điện thoại.";
      return /^0\d{9}$/.test(d) ? "" : "Số điện thoại gồm 10 chữ số, ví dụ 0912 345 678.";
    },
    email: function (v, input) {
      if (!v.trim()) return input.required ? "Vui lòng nhập email." : "";
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Email chưa đúng định dạng.";
    },
    course: function (v) { return v ? "" : "Vui lòng chọn khóa học."; },
    topic: function (v) { return v ? "" : "Vui lòng chọn nội dung cần hỗ trợ."; },
    message: function (v) { return v.trim().length >= 10 ? "" : "Nội dung cần ít nhất 10 ký tự."; }
  };

  $$("[data-form]").forEach(function (form) {
    var body = $("[data-form-body]", form);
    var success = $("[data-form-success]", form);
    var formError = $("[data-form-error]", form);
    var submit = $("[data-submit]", form);
    var names = Object.keys(rules).filter(function (n) { return form.elements[n]; });

    function validate(name) {
      var input = form.elements[name];
      var msg = rules[name](input.value, input);
      var field = input.closest(".field");
      field.classList.toggle("has-error", !!msg);
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      var err = $(".error", field);
      if (err) err.textContent = msg;
      return !msg;
    }
    names.forEach(function (name) {
      var input = form.elements[name];
      input.addEventListener("blur", function () { if (input.value) validate(name); });
      input.addEventListener("input", function () { if (input.closest(".field").classList.contains("has-error")) validate(name); });
      input.addEventListener("change", function () { validate(name); });
    });

    function setLoading(on) {
      submit.disabled = on;
      submit.classList.toggle("is-loading", on);
      submit.setAttribute("aria-busy", String(on));
    }
    function send(data) {
      var endpoint = form.getAttribute("data-endpoint");
      if (endpoint) {
        return fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
          .then(function (res) { if (!res.ok) throw new Error("HTTP " + res.status); });
      }
      return new Promise(function (resolve) { setTimeout(resolve, 900); }); // Chưa cấu hình máy chủ: mô phỏng
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (formError) formError.hidden = true;
      var firstBad = null;
      names.forEach(function (n) { if (!validate(n) && !firstBad) firstBad = form.elements[n]; });
      if (firstBad) { firstBad.focus(); return; }
      var data = { page: location.pathname.split("/").pop() || "index.html" };
      new FormData(form).forEach(function (v, k) { data[k] = String(v).trim(); });
      setLoading(true);
      send(data).then(function () {
        var sn = $("[data-success-name]", form), sp = $("[data-success-phone]", form);
        if (sn) sn.textContent = data.name;
        if (sp) sp.textContent = data.phone;
        body.hidden = true;
        success.hidden = false;
        success.focus();
      }).catch(function () {
        if (formError) formError.hidden = false;
      }).then(function () { setLoading(false); });
    });

    var reset = $("[data-form-reset]", form);
    if (reset) reset.addEventListener("click", function () {
      form.reset();
      $$(".field", form).forEach(function (f) { f.classList.remove("has-error"); });
      success.hidden = true;
      body.hidden = false;
      form.elements.name.focus();
    });
  });

  /* ---------- Bài kiểm tra trình độ ---------- */
  var quiz = $("[data-quiz]");
  if (quiz) {
    var QUESTIONS = [
      { q: "My sister ___ a teacher.", o: ["am", "is", "are", "be"], a: 1 },
      { q: "___ you like coffee?", o: ["Do", "Does", "Are", "Is"], a: 0 },
      { q: "There are three ___ on the table.", o: ["apple", "apples", "an apple", "apple's"], a: 1 },
      { q: "I ___ to the cinema last weekend.", o: ["go", "goes", "went", "have gone"], a: 2 },
      { q: "She is ___ than her brother.", o: ["tall", "taller", "tallest", "more tall"], a: 1 },
      { q: "We ___ dinner when the phone rang.", o: ["have", "were having", "are having", "had had"], a: 1 },
      { q: "If it rains tomorrow, we ___ at home.", o: ["stay", "will stay", "would stay", "stayed"], a: 1 },
      { q: "I have lived in Hanoi ___ 2015.", o: ["for", "since", "from", "during"], a: 1 },
      { q: "The report ___ by the manager yesterday.", o: ["wrote", "was written", "is writing", "has written"], a: 1 },
      { q: "I wish I ___ more time to study last year.", o: ["have", "had", "had had", "would have"], a: 2 },
      { q: "She denied ___ the window.", o: ["to break", "breaking", "break", "broke"], a: 1 },
      { q: "Hardly ___ the meeting started when the power went out.", o: ["had", "did", "has", "was"], a: 0 }
    ];
    var LEVELS = [
      { max: 3, level: "A1", title: "Trình độ sơ cấp (A1)", text: "Bạn đã biết một số mẫu câu cơ bản. Nên bắt đầu từ nền tảng để phát âm và ngữ pháp vững ngay từ đầu.", course: "Giao tiếp cơ bản hoặc Cambridge Starters, Movers", link: "khoa-hoc.html" },
      { max: 6, level: "A2", title: "Trình độ sơ trung cấp (A2)", text: "Bạn giao tiếp được trong tình huống quen thuộc. Mục tiêu tiếp theo là nói dài hơn và dùng đúng các thì quá khứ.", course: "Giao tiếp cơ bản, KET hoặc IELTS Foundation", link: "khoa-hoc.html" },
      { max: 9, level: "B1", title: "Trình độ trung cấp (B1)", text: "Bạn đọc hiểu và trao đổi được về nhiều chủ đề. Đây là điểm xuất phát phù hợp cho IELTS 5.5+ hoặc PET.", course: "IELTS 5.5+, PET hoặc Giao tiếp trung cấp", link: "khoa-hoc-ielts.html" },
      { max: 11, level: "B2", title: "Trình độ trung cao cấp (B2)", text: "Bạn dùng được cấu trúc phức tạp. Tập trung vào độ chính xác và từ vựng học thuật để đạt band cao.", course: "IELTS 6.5+ hoặc Giao tiếp nâng cao", link: "khoa-hoc-ielts.html" },
      { max: 12, level: "C1", title: "Trình độ cao cấp (C1)", text: "Kết quả rất tốt. Bài kiểm tra đầy đủ tại trung tâm sẽ đánh giá thêm kỹ năng nói và viết của bạn.", course: "IELTS 6.5+ hoặc kèm 1-1 theo mục tiêu", link: "khoa-hoc-ielts.html" }
    ];
    var intro = $("[data-quiz-intro]", quiz), stage = $("[data-quiz-stage]", quiz), result = $("[data-quiz-result]", quiz);
    var qText = $("[data-quiz-q]", quiz), opts = $("[data-quiz-options]", quiz), count = $("[data-quiz-count]", quiz);
    var bar = $("[data-quiz-bar]", quiz), prev = $("[data-quiz-prev]", quiz), next = $("[data-quiz-next]", quiz), hint = $("[data-quiz-hint]", quiz);
    var answers = [], cur = 0;

    function render() {
      var item = QUESTIONS[cur];
      count.textContent = "Câu " + (cur + 1) + "/" + QUESTIONS.length;
      bar.style.width = ((cur) / QUESTIONS.length * 100) + "%";
      qText.innerHTML = item.q.replace("___", '<span class="sr-only">chỗ trống</span>_____');
      opts.innerHTML = item.o.map(function (o, i) {
        var id = "qo-" + cur + "-" + i;
        return '<div class="quiz-option"><input type="radio" name="q' + cur + '" id="' + id + '" value="' + i + '"' + (answers[cur] === i ? " checked" : "") + '><label for="' + id + '"><span class="key">' + "ABCD"[i] + "</span>" + o + "</label></div>";
      }).join("");
      prev.disabled = cur === 0;
      next.textContent = cur === QUESTIONS.length - 1 ? "Xem kết quả" : "Câu tiếp theo";
      hint.textContent = "";
      $$("input", opts).forEach(function (inp) {
        inp.addEventListener("change", function () { answers[cur] = parseInt(inp.value, 10); hint.textContent = ""; });
      });
    }
    function finish() {
      var score = QUESTIONS.reduce(function (s, item, i) { return s + (answers[i] === item.a ? 1 : 0); }, 0);
      var lv = LEVELS.filter(function (l) { return score <= l.max; })[0];
      bar.style.width = "100%";
      stage.hidden = true;
      result.hidden = false;
      $("[data-r-level]", result).textContent = lv.level;
      $("[data-r-title]", result).textContent = lv.title;
      $("[data-r-score]", result).textContent = "Bạn trả lời đúng " + score + "/" + QUESTIONS.length + " câu.";
      $("[data-r-text]", result).textContent = lv.text;
      $("[data-r-course]", result).textContent = lv.course;
      $("[data-r-link]", result).href = lv.link;
      result.focus();
      var note = document.querySelector("[data-form] [name=note]");
      if (note) note.value = "Kết quả kiểm tra online: " + lv.level + " (" + score + "/" + QUESTIONS.length + " câu). Muốn làm bài kiểm tra đầy đủ.";
    }
    $("[data-quiz-start]", quiz).addEventListener("click", function () {
      intro.hidden = true; stage.hidden = false; cur = 0; answers = []; render();
      qText.focus();
    });
    prev.addEventListener("click", function () { if (cur > 0) { cur--; render(); } });
    next.addEventListener("click", function () {
      if (answers[cur] === undefined) { hint.textContent = "Hãy chọn một đáp án trước khi tiếp tục."; return; }
      if (cur < QUESTIONS.length - 1) { cur++; render(); qText.focus(); } else finish();
    });
    $("[data-quiz-retry]", quiz).addEventListener("click", function () {
      result.hidden = true; stage.hidden = false; cur = 0; answers = []; render();
    });
  }

  /* ---------- Công cụ chọn khóa học ---------- */
  var planner = $("[data-planner]");
  if (planner) {
    var who = $("[name=who]", planner), goal = $("[name=goal]", planner), out = $("[data-planner-result]", planner);
    var MAP = {
      child: { name: "Tiếng Anh thiếu nhi", link: "khoa-hoc-thieu-nhi.html", why: "Lớp 8-10 bé, học qua trò chơi, thi Cambridge Starters, Movers, Flyers." },
      teen: { name: "Tiếng Anh thiếu niên", link: "khoa-hoc-thieu-nien.html", why: "Bám sát chương trình trên lớp, luyện KET, PET và ôn thi vào 10." },
      ielts: { name: "Luyện thi IELTS", link: "khoa-hoc-ielts.html", why: "3 chặng rõ ràng, thi thử hằng tháng, cam kết đầu ra bằng văn bản." },
      work: { name: "Giao tiếp cho người đi làm", link: "khoa-hoc-giao-tiep.html", why: "Lớp tối và cuối tuần, luyện tình huống họp, email, thuyết trình." },
      corp: { name: "Tiếng Anh doanh nghiệp", link: "khoa-hoc-doanh-nghiep.html", why: "Chương trình riêng theo phòng ban, học tại văn phòng hoặc online." }
    };
    function recommend() {
      if (!who.value) { out.hidden = true; return; }
      var g = goal.value, key;
      if (who.value === "child") key = "child";
      else if (who.value === "corp") key = "corp";
      else if (who.value === "teen") key = g === "abroad" ? "ielts" : "teen";
      else key = g === "cert" || g === "abroad" ? "ielts" : "work";
      var r = MAP[key];
      $("[data-p-name]", out).textContent = r.name;
      $("[data-p-why]", out).textContent = r.why;
      $("[data-p-link]", out).href = r.link;
      out.hidden = false;
    }
    who.addEventListener("change", recommend);
    goal.addEventListener("change", recommend);
  }

  /* ---------- Sao chép liên kết bài viết ---------- */
  $$("[data-copy-link]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var label = $("span", btn);
      var done = function () { label.textContent = "Đã sao chép"; setTimeout(function () { label.textContent = "Sao chép liên kết"; }, 2000); };
      if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(done, function () { label.textContent = "Không sao chép được"; });
      else label.textContent = "Trình duyệt không hỗ trợ";
    });
  });

  /* ---------- Năm hiện tại ---------- */
  $$("[data-year]").forEach(function (y) { y.textContent = String(new Date().getFullYear()); });
})();
