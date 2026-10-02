#!/usr/bin/env node
/*
 * Hoa ngữ ISZ - static site builder (không phụ thuộc thư viện)
 *
 *   node tools/build.js
 *
 * - src/pages/*.html     : nội dung từng trang, dòng đầu là <!--meta {...JSON...}-->
 * - src/partials/*.html  : header, footer, khối CTA, popup đăng ký
 * - src/data/*.js        : chương trình, lịch khai giảng, chi nhánh, giáo viên, cảm nhận, bài viết, công cụ học
 * - src/templates/*.js   : trang từng chương trình, trang bài viết
 * Kết quả ghi ra thư mục gốc dự án.
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const data = (n) => require(path.join(SRC, "data", n + ".js"));
const site = data("site");
const programs = data("programs");
const branches = data("branches");
const teachers = data("teachers");
const reviews = data("reviews");
const posts = data("posts");
const learn = data("learn");
const today = new Date().toISOString().slice(0, 10);
const classes = data("classes").filter((c) => c.start >= today).sort((a, b) => a.start.localeCompare(b.start));

const read = (p) => fs.readFileSync(path.join(SRC, p), "utf8");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const money = (n) => n.toLocaleString("de-DE") + "đ";
const zh = (t) => `<span class="zh" lang="zh">${t}</span>`;
const progByKey = Object.fromEntries(programs.map((p) => [p.key, p]));
const branchByKey = Object.fromEntries(branches.map((b) => [b.key, b]));
const teacherByKey = Object.fromEntries(teachers.map((t) => [t.key, t]));
const DAYS = { 246: "Thứ 2 - 4 - 6", 357: "Thứ 3 - 5 - 7", "cuoi-tuan": "Thứ 7 và Chủ nhật", cn: "Chủ nhật" };
const mapUrl = (q) => `https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(q)}`;
const arrow = (d = "right") => `<i class="ph ph-arrow-${d}" aria-hidden="true"></i>`;
const btnIco = `<span class="btn-ico"><i class="ph ph-arrow-up-right" aria-hidden="true"></i></span>`;

/* Ô chữ điền (田字格): khung SVG có đường chéo, chữ vẽ bằng hanzi-writer trong main.js */
const gridSvg = `<svg class="tzg-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 50H100M50 0V100M0 0L100 100M100 0L0 100"/></svg>`;
function tzg(char, opts = {}) {
  return `<div class="tzg${opts.cls ? " " + opts.cls : ""}"${opts.attrs || ""}>${gridSvg}<span class="tzg-static zh" lang="zh" aria-hidden="true">${char}</span><div class="tzg-target" data-hanzi-target></div></div>`;
}

/* ---------------------------------------------------------------- helpers */

function crumbs(list) {
  if (!list || !list.length) return "";
  const items = [["Trang chủ", "index.html"]].concat(list);
  return `<nav class="crumbs" aria-label="Đường dẫn trang"><ol>${items
    .map((c, i) => (i === items.length - 1 ? `<li aria-current="page">${esc(c[0])}</li>` : `<li><a href="${c[1]}">${esc(c[0])}</a></li>`))
    .join("")}</ol></nav>`;
}

function fmtDate(d) { const [y, m, dd] = d.split("-"); return `${dd}/${m}/${y}`; }
function dow(d) { return ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"][new Date(d + "T00:00:00").getDay()]; }

function hanziPad() {
  const first = learn.pad[0];
  return `<div class="pad" data-pad>
          <div class="pad-shell"><div class="pad-core">
            <div class="pad-top"><p class="pad-label">Ô chữ điền <span class="zh" lang="zh">田字格</span></p><p class="pad-mode" data-pad-mode aria-live="polite">Xem thứ tự nét</p></div>
            ${tzg(first.c, { cls: "tzg-lg", attrs: ` data-hanzi="${first.c}"` })}
            <div class="pad-info">
              <p class="pad-py" data-pad-py>${first.py}</p>
              <p class="pad-meta"><span>Hán Việt: <strong data-pad-hv>${first.hv}</strong></span><span>Nghĩa: <strong data-pad-vi>${first.vi}</strong></span><span><strong data-pad-n>${first.strokes}</strong> nét</span></p>
            </div>
            <div class="pad-chars" role="group" aria-label="Chọn chữ">${learn.pad.map((p, i) => `<button type="button" class="pad-char zh" lang="zh" aria-pressed="${i === 0}" data-char="${p.c}" data-py="${p.py}" data-hv="${esc(p.hv)}" data-vi="${esc(p.vi)}" data-n="${p.strokes}"><span class="sr-only">Chữ ${esc(p.hv)}, </span>${p.c}</button>`).join("")}</div>
            <div class="pad-actions">
              <button class="btn btn-ghost btn-sm" type="button" data-pad-play><i class="ph ph-play" aria-hidden="true"></i>Xem lại</button>
              <button class="btn btn-ghost btn-sm" type="button" data-pad-quiz><i class="ph ph-hand-pointing" aria-hidden="true"></i>Tự viết thử</button>
              <button class="icon-btn" type="button" data-say-from="[data-pad] .pad-char[aria-pressed=true]" aria-label="Nghe đọc chữ này"><i class="ph ph-speaker-high" aria-hidden="true"></i></button>
            </div>
          </div></div>
        </div>`;
}

function toneLab() {
  return `<div class="tones" data-tones>${learn.tones.map((t) => `
          <button class="tone" type="button" data-say="${t.c}" data-tone="${t.n}">
            <span class="tone-head"><span class="tone-n">${esc(t.name)}</span><span class="tone-pitch">${t.pitch}</span></span>
            <svg class="tone-svg" viewBox="0 0 100 100" aria-hidden="true"><path class="tone-grid" d="M0 12H100M0 32H100M0 52H100M0 72H100M0 92H100"/><path class="tone-line" d="${t.d}" pathLength="1"/></svg>
            <span class="tone-char zh" lang="zh">${t.c}</span>
            <span class="tone-py">${t.py}<small>${esc(t.vi)}</small></span>
            <span class="tone-like">${esc(t.like)}</span>
            <span class="tone-play"><i class="ph ph-speaker-high" aria-hidden="true"></i>Nghe</span>
          </button>`).join("")}
        </div>
        <p class="tones-note" data-voice-note hidden>Trình duyệt của bạn chưa có giọng đọc tiếng Trung. Trên điện thoại, thêm ngôn ngữ Tiếng Trung trong phần cài đặt giọng nói để nghe được.</p>`;
}

function programIndex() {
  return `<ol class="pindex" data-pindex>${programs.map((p, i) => `
          <li class="pindex-row reveal">
            <a href="${p.slug}.html">
              <span class="pindex-han zh" lang="zh" aria-hidden="true">${p.hanzi}</span>
              <span class="pindex-main"><span class="pindex-no">0${i + 1}</span><span class="pindex-name">${esc(p.name)}</span><span class="pindex-text">${esc(p.cardText)}</span></span>
              <span class="pindex-tag">${esc(p.tag)}</span>
              <span class="pindex-fee">${p.feeFrom ? `từ <strong>${money(p.feeFrom)}</strong>` : "<strong>Báo giá theo lớp</strong>"}</span>
              <span class="pindex-go" aria-hidden="true">${arrow("up-right")}</span>
              <img class="pindex-img" src="assets/img/${p.image}" width="1600" height="1067" alt="" loading="lazy">
            </a>
          </li>`).join("")}
        </ol>`;
}

function programCard(p) {
  return `<article class="pcard reveal">
            <a class="pcard-media bezel" href="${p.slug}.html" tabindex="-1" aria-hidden="true"><span class="bezel-core"><img src="assets/img/${p.image}" width="1600" height="1067" alt="" loading="lazy"><span class="pcard-han zh" lang="zh">${p.hanzi}</span></span></a>
            <div class="pcard-body">
              <p class="pcard-tag">${esc(p.tag)}</p>
              <h3><a href="${p.slug}.html">${esc(p.name)}</a></h3>
              <p>${esc(p.cardText)}</p>
              <p class="pcard-fee">${p.feeFrom ? `Học phí từ <strong>${money(p.feeFrom)}</strong>` : "<strong>Báo giá theo số người và lịch học</strong>"}</p>
              <a class="text-link" href="${p.slug}.html">Xem chương trình ${arrow()}</a>
            </div>
          </article>`;
}

/* Bậc thang HSK: chiều cao cột theo số từ vựng tích lũy */
function hskStairs() {
  const hsk = progByKey.hsk.levels;
  const max = Math.sqrt(hsk[hsk.length - 1].words);
  const opts = (sel) => hsk.map((l, i) => `<option value="${i}"${i === sel ? " selected" : ""}>${l.name}</option>`).join("");
  return `<div class="stairs" data-stairs>
          <div class="stairs-chart" role="group" aria-label="Chọn cấp HSK">${hsk.map((l, i) => `
            <button type="button" class="stair${i === 3 ? " is-on" : ""}" aria-pressed="${i === 3}" style="--k:${(Math.sqrt(l.words) / max).toFixed(3)}" data-i="${i}" data-name="${l.name}" data-words="${l.words}" data-weeks="${l.weeks}" data-sessions="${l.sessions}" data-fee="${l.fee}" data-outcome="${esc(l.outcome)}">
              <span class="stair-bar"><span class="stair-words">${l.words.toLocaleString("de-DE")}<small> từ</small></span></span>
              <span class="stair-name">${l.name}</span>
            </button>`).join("")}
          </div>
          <div class="stairs-panel bezel"><div class="bezel-core" aria-live="polite">
            <p class="stairs-kicker">Khi đạt <strong data-st-name>${hsk[3].name}</strong>, bạn có thể</p>
            <p class="stairs-outcome" data-st-outcome>${esc(hsk[3].outcome)}</p>
            <dl class="stairs-facts">
              <div><dt>Khóa học</dt><dd><span data-st-weeks>${hsk[3].weeks}</span> tuần</dd></div>
              <div><dt>Số buổi</dt><dd><span data-st-sessions>${hsk[3].sessions}</span> buổi</dd></div>
              <div><dt>Học phí</dt><dd data-st-fee>${money(hsk[3].fee)}</dd></div>
            </dl>
            <div class="stairs-calc">
              <p class="stairs-calc-title">Tính lộ trình của bạn</p>
              <div class="stairs-calc-row">
                <label>Bây giờ<select data-st-from><option value="-1" selected>Chưa học</option>${opts(-1)}</select></label>
                <i class="ph ph-arrow-right" aria-hidden="true"></i>
                <label>Mục tiêu<select data-st-to>${opts(3)}</select></label>
              </div>
              <p class="stairs-calc-out" data-st-calc>Khoảng <strong>60 tuần</strong>, 180 buổi, học phí 20.680.000đ nếu học liền 4 khóa.</p>
            </div>
            <a class="btn btn-primary btn-sm" href="lich-khai-giang.html?ct=hsk" data-st-link>Xem lớp HSK sắp khai giảng${btnIco}</a>
          </div></div>
        </div>`;
}

/* Một buổi học: thanh chia phút, có tab đổi chương trình */
function sessionBar(p, id) {
  const total = p.sessionTotal || p.session.reduce((s, x) => s + x[1], 0);
  return `<div class="sbar" id="${id}">
            <ol class="sbar-track">${p.session.map(([t, m], i) => `<li style="--w:${(m / total * 100).toFixed(2)}" class="sbar-seg s${i}"><span class="sbar-min">${m}'</span></li>`).join("")}</ol>
            <ol class="sbar-legend">${p.session.map(([t, m], i) => `<li class="s${i}"><span class="sbar-dot" aria-hidden="true"></span>${esc(t)}<span class="sbar-l-min">${m} phút</span></li>`).join("")}</ol>
            <p class="sbar-total">${total} phút mỗi buổi</p>
          </div>`;
}
function sessionTabs() {
  const list = ["hsk", "giao-tiep", "thieu-nhi"].map((k) => progByKey[k]);
  return `<div class="stabs" data-tabs>
          <div class="tab-list" role="tablist" aria-label="Chọn chương trình">${list.map((p, i) => `<button type="button" role="tab" id="tab-s-${p.key}" aria-controls="panel-s-${p.key}" aria-selected="${i === 0}"${i ? ' tabindex="-1"' : ""}>${esc(p.name)}</button>`).join("")}</div>
          ${list.map((p, i) => `<div role="tabpanel" id="panel-s-${p.key}" aria-labelledby="tab-s-${p.key}"${i ? " hidden" : ""}>${sessionBar(p, "sb-" + p.key)}</div>`).join("")}
        </div>`;
}

function classPlace(c) { return c.branch === "online" ? "Online qua Zoom" : branchByKey[c.branch].name; }
function seatsHtml(c) {
  if (!c.seats) return `<span class="seats is-full">Đã đủ, nhận đăng ký chờ</span>`;
  return `<span class="seats${c.seats <= 3 ? " is-low" : ""}">Còn ${c.seats} chỗ</span>`;
}
function classRow(c) {
  const p = progByKey[c.program];
  return `<li class="crow" data-program="${c.program}" data-branch="${c.branch}" data-days="${c.days}" data-start="${c.start}">
            <p class="crow-date"><span class="crow-d">${fmtDate(c.start).slice(0, 5)}</span><span class="crow-dow">${dow(c.start)}</span></p>
            <div class="crow-main">
              <p class="crow-prog"><span class="crow-han zh" lang="zh" aria-hidden="true">${p.hanzi}</span>${esc(c.level)}</p>
              <p class="crow-meta"><span><i class="ph ph-map-pin" aria-hidden="true"></i>${esc(classPlace(c))}</span><span><i class="ph ph-calendar-blank" aria-hidden="true"></i>${DAYS[c.days]}</span><span><i class="ph ph-clock" aria-hidden="true"></i>${c.time}</span></p>
              ${c.promo ? `<p class="crow-promo"><i class="ph ph-tag" aria-hidden="true"></i>${esc(c.promo)}</p>` : ""}
            </div>
            <p class="crow-code">Mã lớp<br><span>${c.code}</span></p>
            <div class="crow-act">${seatsHtml(c)}<button class="btn ${c.seats ? "btn-outline" : "btn-ghost"} btn-sm" type="button" data-open-reg data-program="${esc(p.name)}" data-branch="${esc(classPlace(c))}" data-note="Giữ chỗ lớp ${c.code}, khai giảng ${fmtDate(c.start)}">${c.seats ? "Giữ chỗ" : "Đăng ký chờ"}</button></div>
          </li>`;
}
function classList(opts) {
  let list = classes.slice();
  if (opts.program) list = list.filter((c) => c.program === opts.program || (opts.program === "hsk" && c.program === "online" && /HSK/.test(c.level)));
  if (opts.limit) list = list.slice(0, Number(opts.limit));
  if (!list.length) return `<p class="empty-inline">Chưa có lớp mới trong 6 tuần tới. Để lại số điện thoại, tư vấn viên sẽ báo khi mở lớp.</p>`;
  return `<ol class="clist" data-clist>${list.map(classRow).join("")}</ol>`;
}

function teacherCard(t) {
  return `<article class="tcard">
            <div class="bezel"><div class="bezel-core tcard-core">
              <img src="assets/img/${t.image}" width="900" height="600" alt="Chân dung ${esc(t.name)}" loading="lazy" style="object-position:${t.pos}">
              <span class="tcard-han zh" lang="zh" aria-hidden="true">${t.hanziName}</span>
            </div></div>
            <div class="tcard-body">
              <h3>${esc(t.name)}</h3>
              <p class="tcard-role">${esc(t.role)} · ${t.years} năm dạy</p>
              <p class="tcard-edu">${esc(t.edu)}</p>
              <p class="tcard-cert">${esc(t.cert)}</p>
            </div>
          </article>`;
}
function teacherRail(keys, id) {
  const list = keys ? keys.map((k) => teacherByKey[k]) : teachers;
  if (id === "grid") return `<div class="tgrid">${list.map(teacherCard).join("")}</div>`;
  return `<div class="rail-wrap"><div class="rail" id="${id || "rail-gv"}" tabindex="0" aria-label="Giáo viên">${list.map(teacherCard).join("")}</div></div>`;
}

function reviewCard(r) {
  return `<figure class="rcard reveal${r.image ? " has-img" : ""}">
            ${r.image ? `<img src="assets/img/${r.image}" width="900" height="600" alt="" loading="lazy" style="object-position:${r.pos || "50% 30%"}">` : ""}
            ${r.score ? `<p class="rcard-score">${esc(r.score)}</p>` : ""}
            <blockquote><p>${esc(r.quote)}</p></blockquote>
            <figcaption><strong>${esc(r.name)}</strong><span>${esc(r.role)}</span><span class="rcard-prog">${esc(r.program)}</span></figcaption>
          </figure>`;
}

function branchCard(b) {
  return `<article class="bcard reveal" data-area="${b.area}">
            <figure class="bcard-media bezel"><span class="bezel-core"><img src="assets/img/${b.image}" width="1600" height="1067" alt="" loading="lazy"></span></figure>
            <div class="bcard-body">
              <p class="bcard-area">${esc(b.areaName)} · ${b.rooms} phòng học</p>
              <h3>${esc(b.name)}</h3>
              <p class="bcard-addr"><i class="ph ph-map-pin" aria-hidden="true"></i>${esc(b.address)}</p>
              <p class="bcard-open"><i class="ph ph-clock" aria-hidden="true"></i>${esc(b.open)}</p>
              <p class="bcard-note">${esc(b.note)}</p>
              <div class="row-actions">
                <a class="btn btn-ghost btn-sm" href="${mapUrl(b.address)}" target="_blank" rel="noopener">Chỉ đường ${arrow("up-right")}</a>
                <button class="btn btn-outline btn-sm" type="button" data-open-reg data-branch="${esc(b.name)}">Học thử tại đây</button>
              </div>
            </div>
          </article>`;
}
function branchLines() {
  return `<ol class="blines">${branches.map((b, i) => `<li class="reveal"><span class="blines-no">0${i + 1}</span><div><h3>${esc(b.name)}</h3><p>${esc(b.address)}</p></div><span class="blines-area">${esc(b.areaName)}</span><a class="icon-btn" href="${mapUrl(b.address)}" target="_blank" rel="noopener" aria-label="Chỉ đường đến ${esc(b.name)}">${arrow("up-right")}</a></li>`).join("")}</ol>`;
}

function postCard(p) {
  return `<article class="post-card reveal" data-category="${p.catKey}">
            <a class="post-media bezel" href="${p.slug}.html" tabindex="-1" aria-hidden="true"><span class="bezel-core"><img src="assets/img/${p.image}" width="1600" height="1067" alt="" loading="lazy"></span></a>
            <div class="post-body">
              <p class="post-meta"><span class="post-cat">${esc(p.cat)}</span><span>${p.date}</span></p>
              <h3><a href="${p.slug}.html">${p.title.replace(/([一-鿿]+)/g, (m) => zh(m))}</a></h3>
              <p>${esc(p.excerpt)}</p>
            </div>
          </article>`;
}
function postsGrid(opts) {
  let list = posts.slice();
  if (opts.exclude) list = list.filter((p) => p.slug !== opts.exclude);
  if (opts.limit) list = list.slice(0, Number(opts.limit));
  return `<div class="post-grid${opts.class ? " " + opts.class : ""}" data-filter-target>${list.map(postCard).join("\n")}</div>`;
}

function faqList(items) {
  return `<div class="faq-list">${items.map((f) => `<details class="faq-item">
            <summary>${esc(f.q)}<i class="ph ph-plus" aria-hidden="true"></i></summary>
            <div class="faq-answer"><p>${f.a}</p></div>
          </details>`).join("\n")}</div>`;
}

function programOptions() {
  return ['<option value="">Chưa chắc, cần tư vấn</option>'].concat(programs.map((p) => `<option value="${esc(p.name)}">${esc(p.name)}</option>`)).join("");
}
function branchOptions() {
  return ['<option value="">Cơ sở gần nhất với tôi</option>', '<option value="Online qua Zoom">Học online qua Zoom</option>'].concat(branches.map((b) => `<option value="${esc(b.name)}">${esc(b.name)}, ${esc(b.address.split(",")[0])}</option>`)).join("");
}

/* Form đăng ký dùng chung (popup, trang liên hệ). id tránh trùng giữa các form trên một trang. */
function regForm(id, opts = {}) {
  const f = (n) => `${id}-${n}`;
  return `<form class="reg-form" data-form novalidate${opts.endpoint ? ` data-endpoint="${opts.endpoint}"` : ""}>
          <div data-form-body>
            <div class="form-grid">
              <div class="field"><label for="${f("name")}">Họ và tên <span aria-hidden="true">*</span></label><input id="${f("name")}" name="name" type="text" autocomplete="name" required aria-describedby="${f("name")}-e"><p class="error" id="${f("name")}-e" aria-live="polite"></p></div>
              <div class="field"><label for="${f("phone")}">Số điện thoại <span aria-hidden="true">*</span></label><input id="${f("phone")}" name="phone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="0912 345 678" aria-describedby="${f("phone")}-e"><p class="error" id="${f("phone")}-e" aria-live="polite"></p></div>
              <div class="field"><label for="${f("program")}">Chương trình</label><select id="${f("program")}" name="program">${programOptions()}</select></div>
              <div class="field"><label for="${f("branch")}">Nơi học</label><select id="${f("branch")}" name="branch">${branchOptions()}</select></div>
            </div>
            <fieldset class="field">
              <legend>Trình độ hiện tại</legend>
              <div class="chips">
                <label class="chip"><input type="radio" name="level" value="Chưa học" checked><span>Chưa học</span></label>
                <label class="chip"><input type="radio" name="level" value="Biết một chút"><span>Biết một chút</span></label>
                <label class="chip"><input type="radio" name="level" value="Đã có HSK"><span>Đã có HSK</span></label>
              </div>
            </fieldset>
            <fieldset class="field">
              <legend>Giờ học thuận tiện</legend>
              <div class="chips">
                <label class="chip"><input type="checkbox" name="time" value="Sáng"><span>Sáng</span></label>
                <label class="chip"><input type="checkbox" name="time" value="Trưa"><span>Trưa</span></label>
                <label class="chip"><input type="checkbox" name="time" value="Tối"><span>Tối</span></label>
                <label class="chip"><input type="checkbox" name="time" value="Cuối tuần"><span>Cuối tuần</span></label>
              </div>
            </fieldset>
            <div class="field"><label for="${f("note")}">Ghi chú</label><textarea id="${f("note")}" name="note" rows="2" placeholder="Mục tiêu HSK, thời hạn cần chứng chỉ, tuổi của bé..."></textarea></div>
            <div class="field field-check"><label class="check"><input type="checkbox" name="agree" aria-describedby="${f("agree")}-e"><span>Tôi đồng ý để ISZ gọi lại và lưu thông tin theo <a href="chinh-sach.html#bao-mat">chính sách bảo mật</a>.</span></label><p class="error" id="${f("agree")}-e" aria-live="polite"></p></div>
            <p class="form-error" data-form-error hidden role="alert">Chưa gửi được. Kiểm tra kết nối mạng rồi thử lại, hoặc gọi <a href="tel:${site.hotlineTel}">${site.hotline}</a>.</p>
            <button class="btn btn-primary btn-lg btn-block" type="submit" data-submit><span class="btn-label">${opts.submit || "Đăng ký học thử miễn phí"}</span>${btnIco}</button>
            <p class="form-note">Tư vấn viên gọi lại trong 20 phút, từ 8:00 đến 21:00.</p>
          </div>
          <div class="form-success" data-form-success hidden tabindex="-1">
            <span class="success-ico zh" lang="zh" aria-hidden="true">好</span>
            <h3>Đã nhận đăng ký của <span data-success-name></span></h3>
            <p>Tư vấn viên sẽ gọi số <strong data-success-phone></strong> trong 20 phút để hẹn buổi kiểm tra trình độ và buổi học thử. Nếu gửi ngoài giờ, chúng tôi gọi lúc 8:00 sáng hôm sau.</p>
            <button class="btn btn-ghost btn-sm" type="button" data-form-again>Gửi đăng ký khác</button>
          </div>
        </form>`;
}

function decks() {
  return `<div class="decks" data-tabs>
          <div class="tab-list" role="tablist" aria-label="Chọn chủ đề">${learn.decks.map((d, i) => `<button type="button" role="tab" id="tab-d-${d.key}" aria-controls="panel-d-${d.key}" aria-selected="${i === 0}"${i ? ' tabindex="-1"' : ""}>${esc(d.name)}</button>`).join("")}</div>
          ${learn.decks.map((d, i) => `<div role="tabpanel" id="panel-d-${d.key}" aria-labelledby="tab-d-${d.key}"${i ? " hidden" : ""}>
            <ul class="cards">${d.cards.map(([c, py, vi]) => `<li><button type="button" class="fcard" aria-pressed="false" data-say="${c}">
              <span class="fcard-face fcard-front"><span class="fcard-c zh" lang="zh">${c}</span><span class="fcard-hint">Chạm để lật</span></span>
              <span class="fcard-face fcard-back"><span class="fcard-py">${py}</span><span class="fcard-vi">${esc(vi)}</span><span class="fcard-c-sm zh" lang="zh">${c}</span></span>
            </button></li>`).join("")}</ul>
          </div>`).join("")}
        </div>`;
}
function radicals() {
  return `<ul class="rads">${learn.radicals.map(([r, hv, vi, ex]) => `<li class="rad reveal"><span class="rad-r zh" lang="zh">${r}</span><span class="rad-hv">${esc(hv)}</span><span class="rad-vi">${esc(vi)}</span><span class="rad-ex zh" lang="zh">${ex}</span></li>`).join("")}</ul>`;
}
function quiz() {
  return `<div class="quiz" data-quiz>
          <div class="quiz-progress" aria-hidden="true"><span data-quiz-bar></span></div>
          <p class="quiz-count" data-quiz-count aria-live="polite">Câu 1 / ${learn.quiz.length}</p>
          <ol class="quiz-list">${learn.quiz.map((q, i) => `<li class="quiz-q" data-answer="${q.a}"${i ? " hidden" : ""}>
            <fieldset>
              <legend><span class="quiz-lv">${q.lv}</span>${q.q.replace(/([一-鿿，。！？、]+)/g, (m) => zh(m))}</legend>
              <div class="quiz-opts">${q.o.map((o, k) => `<label class="quiz-opt${q.zh ? " is-zh" : ""}"><input type="radio" name="q${i}" value="${k}"><span>${q.zh ? zh(o) : esc(o)}</span></label>`).join("")}</div>
            </fieldset>
          </li>`).join("")}</ol>
          <div class="quiz-nav"><button class="btn btn-ghost btn-sm" type="button" data-quiz-skip>Tôi không biết, bỏ qua</button><button class="btn btn-primary" type="button" data-quiz-next disabled>Câu tiếp theo${btnIco}</button></div>
          <div class="quiz-result" data-quiz-result hidden tabindex="-1">
            <p class="eyebrow">Kết quả của bạn</p>
            <p class="quiz-score"><span data-quiz-score>0</span><small>/${learn.quiz.length} câu đúng</small></p>
            <h3 data-quiz-level>Nên bắt đầu từ HSK 1</h3>
            <p data-quiz-text></p>
            <div class="row-actions"><button class="btn btn-primary" type="button" data-open-reg data-quiz-reg>Đăng ký học thử lớp này${btnIco}</button><button class="btn btn-ghost" type="button" data-quiz-again>Làm lại</button></div>
          </div>
        </div>`;
}

function tokens(html, ctx) {
  return html.replace(/\{\{\s*([\w-]+)([^}]*)\}\}/g, (m, name, rawArgs) => {
    const opts = {};
    rawArgs.replace(/([\w-]+)="([^"]*)"/g, (_, k, v) => (opts[k] = v));
    switch (name) {
      case "crumbs": return crumbs(ctx.meta.crumbs);
      case "hanzi-pad": return hanziPad();
      case "tzg": return tzg(opts.char || "学", { cls: opts.class || "", attrs: opts.animate ? ` data-hanzi="${opts.char}"` : "" });
      case "tone-lab": return toneLab();
      case "program-index": return programIndex();
      case "program-grid": return `<div class="pgrid">${programs.map(programCard).join("\n")}</div>`;
      case "program-drop": return programs.map((p) => `<a href="${p.slug}.html"><span class="drop-han zh" lang="zh" aria-hidden="true">${p.hanzi}</span><span><strong>${esc(p.name)}</strong><small>${esc(p.tag)}</small></span></a>`).join("");
      case "program-options": return programOptions();
      case "branch-options": return branchOptions();
      case "branch-select": return branches.map((b) => `<option value="${b.key}">${esc(b.name)}</option>`).join("");
      case "program-select": return programs.map((p) => `<option value="${p.key}">${esc(p.name)}</option>`).join("");
      case "hsk-stairs": return hskStairs();
      case "session-tabs": return sessionTabs();
      case "classes": return classList(opts);
      case "class-count": return String(classes.length);
      case "teachers": return teacherRail(opts.keys ? opts.keys.split(",") : null, opts.id);
      case "teacher-grid": return `<div class="tgrid">${teachers.map(teacherCard).join("")}</div>`;
      case "reviews": return `<div class="rwall">${reviews.filter((r) => !opts.home || r.home).map(reviewCard).join("")}</div>`;
      case "branches": return `<div class="bgrid" data-filter-target>${branches.map(branchCard).join("\n")}</div>`;
      case "branch-lines": return branchLines();
      case "branch-count": return String(branches.length);
      case "posts": return postsGrid(opts);
      case "reg-form": return regForm(opts.id || "f", opts);
      case "decks": return decks();
      case "radicals": return radicals();
      case "quiz": return quiz();
      case "quiz-count": return String(learn.quiz.length);
      case "hotline": return site.hotline;
      case "hotline-tel": return site.hotlineTel;
      case "mobile": return site.mobile;
      case "mobile-tel": return site.mobileTel;
      case "email": return site.email;
      case "hours": return site.hours;
      case "zalo": return site.zalo;
      case "facebook": return site.facebook;
      case "youtube": return site.youtube;
      case "tiktok": return site.tiktok;
      case "legal": return site.legal;
      default: return m;
    }
  });
}

/* ---------------------------------------------------------------- layout */

const partials = {
  header: read("partials/header.html"),
  footer: read("partials/footer.html"),
  cta: read("partials/cta.html"),
  modal: read("partials/modal.html"),
};

function layout(meta, body) {
  let header = tokens(partials.header, { meta });
  if (meta.nav) header = header.replace(new RegExp(`data-nav-key="${meta.nav}"`, "g"), `data-nav-key="${meta.nav}" data-active`);
  header = header.replace(new RegExp(`href="${meta.file}"`, "g"), `href="${meta.file}" aria-current="page"`);
  const cta = meta.cta === false ? "" : partials.cta;
  const title = meta.file === "index.html" ? meta.title : `${meta.title} | ${site.shortName}`;
  const html = `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(meta.description)}">
  <meta name="theme-color" content="#f6f8fa">
  <link rel="canonical" href="${site.url}/${meta.file === "index.html" ? "" : meta.file}">
  <meta property="og:title" content="${esc(meta.title)}">
  <meta property="og:description" content="${esc(meta.description)}">
  <meta property="og:image" content="${meta.image || "assets/img/hero-viet-chu.jpg"}">
  <meta property="og:type" content="${meta.ogType || "website"}">
  <meta property="og:locale" content="vi_VN">${meta.noindex ? '\n  <meta name="robots" content="noindex">' : ""}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..800&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Noto+Serif+SC:wght@500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/light/style.css">${meta.preload ? `\n  <link rel="preload" as="image" href="${meta.preload}">` : ""}
  <link rel="stylesheet" href="assets/css/style.css">
  <link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
</head>
<body data-page="${meta.file.replace(".html", "")}">
  <a class="skip-link" href="#main">Bỏ qua điều hướng</a>
${header}
  <main id="main">
${body}
  </main>
${cta}
${partials.footer}
${partials.modal}
  <script src="assets/js/main.js" defer></script>
</body>
</html>
`;
  return tokens(html, { meta }).replace(/class="ph /g, 'class="ph-light ');
}

/* ---------------------------------------------------------------- pages */

function parsePage(file) {
  const raw = read(path.join("pages", file));
  const m = raw.match(/^<!--meta\s*([\s\S]*?)-->\s*/);
  if (!m) throw new Error(`Thiếu <!--meta {...}--> ở ${file}`);
  const meta = JSON.parse(m[1]);
  meta.file = file;
  return { meta, body: raw.slice(m[0].length) };
}

const out = [];
function write(file, html) {
  if (/[–—]/.test(html)) throw new Error(`${file} chứa dấu gạch dài (– hoặc —), hãy thay bằng "-"`);
  fs.writeFileSync(path.join(ROOT, file), html, "utf8");
  out.push(file);
}

for (const file of fs.readdirSync(path.join(SRC, "pages")).filter((f) => f.endsWith(".html"))) {
  const { meta, body } = parsePage(file);
  write(file, layout(meta, tokens(body, { meta })));
}

const programTpl = require(path.join(SRC, "templates/program.js"));
for (const p of programs) {
  const meta = {
    file: `${p.slug}.html`, title: `${p.name}: ${p.tag}`, description: p.lead, nav: "chuong-trinh",
    image: `assets/img/${p.image}`, preload: `assets/img/${p.heroImage}`,
    crumbs: [["Chương trình", "chuong-trinh.html"], [p.name, `${p.slug}.html`]],
  };
  const others = programs.filter((x) => x.slug !== p.slug);
  write(meta.file, layout(meta, tokens(programTpl({ p, others, faqList, programCard, sessionBar, teacherRail, money, esc, arrow, btnIco, tzg }), { meta })));
}

const postTpl = require(path.join(SRC, "templates/post.js"));
for (const p of posts) {
  const meta = {
    file: `${p.slug}.html`, title: p.title, description: p.excerpt, nav: "thu-vien", ogType: "article",
    image: `assets/img/${p.image}`, crumbs: [["Bài viết", "bai-viet.html"], [p.title, `${p.slug}.html`]],
  };
  write(meta.file, layout(meta, tokens(postTpl({ p, esc, zh }), { meta })));
}

const urls = out.filter((f) => f !== "404.html").map((f) => `  <url><loc>${site.url}/${f === "index.html" ? "" : f}</loc><lastmod>${today}</lastmod></url>`);
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`);
console.log(`Đã build ${out.length} trang:\n  ` + out.join("\n  "));
