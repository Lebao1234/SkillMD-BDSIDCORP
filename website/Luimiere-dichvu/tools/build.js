#!/usr/bin/env node
/*
 * Luimiere - static site builder (không phụ thuộc thư viện)
 *
 *   node tools/build.js
 *
 * - src/pages/*.html     : nội dung từng trang, dòng đầu là <!--meta {...JSON...}-->
 * - src/partials/*.html  : header, footer, khối CTA, popup đặt lịch
 * - src/data/*.js        : sảnh, thực đơn, ngày cưới, bài viết, thông tin chung
 * - src/templates/*.js   : trang từng sảnh, trang bài viết
 * Kết quả ghi ra thư mục gốc dự án.
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const site = require(path.join(SRC, "data/site.js"));
const halls = require(path.join(SRC, "data/halls.js"));
const menus = require(path.join(SRC, "data/menus.js"));
const dates = require(path.join(SRC, "data/dates.js"));
const posts = require(path.join(SRC, "data/posts.js"));

const read = (p) => fs.readFileSync(path.join(SRC, p), "utf8");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const money = (n) => n.toLocaleString("de-DE") + "đ";
const hallByKey = Object.fromEntries(halls.map((h) => [h.key, h]));

/* ---------------------------------------------------------------- helpers */

function crumbs(list) {
  if (!list || !list.length) return "";
  const items = [["Trang chủ", "index.html"]].concat(list);
  return `<nav class="crumbs" aria-label="Đường dẫn trang"><ol>${items
    .map((c, i) => (i === items.length - 1 ? `<li aria-current="page">${esc(c[0])}</li>` : `<li><a href="${c[1]}">${esc(c[0])}</a></li>`))
    .join("")}</ol></nav>`;
}

/* Sơ đồ bàn: mỗi chấm là một bàn 10 khách. Chấm sáng = số bàn tối thiểu cuối tuần. */
function dots(h, extra = "") {
  const [min, max] = h.tables;
  let s = "";
  for (let i = 0; i < max; i++) s += `<i${i < min ? ' class="is-min"' : ""}></i>`;
  return `<div class="dots ${extra}" style="--cols:${h.cols}" aria-hidden="true" data-dots>${s}</div>`;
}

function hallStat(h) {
  return `<dl class="hall-stats">
              <div><dt>Sức chứa</dt><dd>${h.tables[0]} - ${h.tables[1]} bàn</dd></div>
              <div><dt>Diện tích</dt><dd>${h.area} m²</dd></div>
              <div><dt>Vị trí</dt><dd>${esc(h.floor)}</dd></div>
            </dl>`;
}

function hallStack() {
  return `<div class="stack">${halls.map((h, i) => `
          <article class="stack-card" style="--n:${i}">
            <div class="bezel"><div class="bezel-core stack-core">
              <img src="assets/img/${h.image}" width="1600" height="1067" alt="${esc(h.imageAlt)}" loading="lazy">
              <div class="stack-body">
                <p class="stack-no">0${i + 1} <span>${esc(h.tag)}</span></p>
                <h3><a href="${h.slug}.html">Sảnh ${esc(h.name)}</a></h3>
                <p class="stack-meaning">${esc(h.name)}, tiếng Pháp nghĩa là ${esc(h.meaning)}</p>
                <p class="stack-text">${esc(h.short)}</p>
                ${hallStat(h)}
                <a class="text-link" href="${h.slug}.html">Xem sảnh ${esc(h.name)} <i class="ph ph-arrow-right" aria-hidden="true"></i></a>
              </div>
              <div class="stack-plan">
                <p class="plan-label"><span>${h.tables[1]} bàn</span> tối đa, mỗi chấm là một bàn 10 khách</p>
                ${dots(h)}
              </div>
            </div></div>
          </article>`).join("")}
        </div>`;
}

function hallCard(h, i) {
  return `<article class="hall-card reveal" data-min="${h.tables[0] * 10}" data-max="${h.tables[1] * 10}" data-hall-card>
            <a class="hall-card-media bezel" href="${h.slug}.html" tabindex="-1" aria-hidden="true"><span class="bezel-core"><img src="assets/img/${h.image}" width="1600" height="1067" alt="" loading="lazy"></span></a>
            <div class="hall-card-body">
              <p class="hall-card-tag"><span class="fit-chip" data-fit hidden>Vừa số khách của bạn</span>${esc(h.tag)} · ${esc(h.floor)}</p>
              <h3><a href="${h.slug}.html">Sảnh ${esc(h.name)}</a></h3>
              <p>${esc(h.short)}</p>
              ${hallStat(h)}
              <div class="hall-card-plan">${dots(h, "dots-sm")}<p>Thực đơn từ <strong>${esc(h.menuFrom)}</strong></p></div>
              <div class="row-actions">
                <a class="btn btn-ghost btn-sm" href="${h.slug}.html">Xem chi tiết</a>
                <button class="btn btn-outline btn-sm" type="button" data-open-book data-hall="${esc(h.name)}">Đặt lịch xem sảnh này</button>
              </div>
            </div>
          </article>`;
}

function hallOptions() {
  return ['<option value="">Chưa chọn, cần tư vấn</option>']
    .concat(halls.map((h) => `<option value="${esc(h.name)}">Sảnh ${esc(h.name)} (${h.tables[0]} - ${h.tables[1]} bàn)</option>`))
    .join("");
}

function menuOptions() {
  return menus.map((m) => `<option value="${m.key}" data-price="${m.price}"${m.popular ? " selected" : ""}>${esc(m.name)}, ${money(m.price)}/bàn</option>`).join("");
}

function menuCard(m, opts = {}) {
  return `<div class="menu-paper${opts.compact ? " is-compact" : ""}">
              <p class="menu-kicker">Thực đơn tiệc cưới</p>
              <h3>${esc(m.name)}</h3>
              <p class="menu-price">${money(m.price)} <span>/ bàn 10 khách</span></p>
              <span class="menu-orn" aria-hidden="true"><i></i><b></b><i></i></span>
              ${m.courses.map(([c, list]) => `<div class="menu-course"><p class="menu-course-name">${esc(c)}</p><ul>${list.map((d) => `<li>${esc(d)}</li>`).join("")}</ul></div>`).join("")}
              <p class="menu-foot">Bia Tiger, nước ngọt, nước suối phục vụ không giới hạn trong 3 giờ</p>
            </div>`;
}

function menuTabs() {
  const pop = Math.max(0, menus.findIndex((m) => m.popular));
  return `<div class="menu-tabs" data-tabs>
          <div class="tab-list" role="tablist" aria-label="Chọn thực đơn">${menus.map((m, i) => `<button type="button" role="tab" id="tab-${m.key}" aria-controls="panel-${m.key}" aria-selected="${i === pop}"${i === pop ? "" : ' tabindex="-1"'}><span>${esc(m.name)}</span><small>${money(m.price)}</small></button>`).join("")}</div>
          ${menus.map((m, i) => `<div class="menu-panel" role="tabpanel" id="panel-${m.key}" aria-labelledby="tab-${m.key}"${i === pop ? "" : " hidden"}>
            <div class="menu-panel-grid">
              <div class="bezel menu-bezel"><div class="bezel-core">${menuCard(m)}</div></div>
              <div class="menu-side">
                ${m.popular ? '<p class="pill-tag">Được chọn nhiều nhất</p>' : ""}
                <p class="menu-side-lead">${esc(m.note)}</p>
                <dl class="menu-facts">
                  <div><dt>Số món</dt><dd>${m.dishes} món</dd></div>
                  <div><dt>Giá một khách</dt><dd>${money(Math.round(m.price / 10 / 1000) * 1000)}</dd></div>
                  <div><dt>Tiệc 30 bàn</dt><dd>${money(m.price * 30)}</dd></div>
                </dl>
                <div class="row-actions">
                  <button class="btn btn-primary" type="button" data-open-book data-note="Muốn nếm thử thực đơn ${esc(m.name)}">Đặt buổi nếm thử<span class="btn-ico"><i class="ph ph-arrow-up-right" aria-hidden="true"></i></span></button>
                  <a class="text-link" href="#du-toan" data-pick-menu="${m.key}">Tính chi phí với thực đơn này <i class="ph ph-arrow-down" aria-hidden="true"></i></a>
                </div>
              </div>
            </div>
          </div>`).join("")}
        </div>`;
}

function menuRail() {
  return `<ol class="menu-rail">${menus.map((m) => `<li${m.popular ? ' class="is-pop"' : ""}><a href="thuc-don.html#tab-${m.key}"><span class="mr-name">${esc(m.name)}</span><span class="mr-dishes">${m.dishes} món</span><span class="mr-price">${money(m.price)}</span></a></li>`).join("")}</ol>`;
}

function dateRail() {
  return `<ol class="date-rail" id="date-rail" tabindex="0" aria-label="Ngày cưới sắp tới">${dates.map((d) => {
    const [y, mo, da] = d.date.split("-");
    const full = !d.free.length;
    return `<li class="date-card${full ? " is-full" : ""}">
            <p class="date-dow">${esc(d.dow)}</p>
            <p class="date-day">${da}<span>/${mo}</span></p>
            <p class="date-year">${y} · <span>${esc(d.lunar)} âm lịch</span></p>
            <ul class="date-halls">${halls.map((h) => `<li class="${d.free.includes(h.key) ? "is-free" : "is-taken"}"><span class="sr-only">Sảnh ${esc(h.name)}: ${d.free.includes(h.key) ? "còn trống" : "đã kín"}</span><span aria-hidden="true">${esc(h.name)}</span></li>`).join("")}</ul>
            ${full ? '<p class="date-status">Đã kín cả 4 sảnh buổi tối</p>' : `<button class="btn btn-ghost btn-sm" type="button" data-open-book data-date="${d.date}">Giữ ngày này</button>`}
          </li>`;
  }).join("")}</ol>`;
}

function postCard(p) {
  return `<article class="post-card reveal" data-category="${p.catKey}">
            <a class="post-media" href="${p.slug}.html" tabindex="-1" aria-hidden="true"><img src="assets/img/${p.image}" width="1200" height="800" alt="" loading="lazy"></a>
            <div class="post-body">
              <p class="post-meta"><span class="post-cat">${esc(p.cat)}</span><span>${p.date}</span></p>
              <h3><a href="${p.slug}.html">${esc(p.title)}</a></h3>
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
  return `<div class="faq-list">${items
    .map((f) => `<details class="faq-item">
            <summary>${esc(f.q)}<i class="ph ph-plus" aria-hidden="true"></i></summary>
            <div class="faq-answer"><p>${f.a}</p></div>
          </details>`)
    .join("\n")}</div>`;
}

/* Form đặt lịch dùng chung (popup, trang liên hệ). id tránh trùng giữa các form trên một trang. */
function bookForm(id, opts = {}) {
  const f = (n) => `${id}-${n}`;
  return `<form class="book-form" data-form novalidate${opts.endpoint ? ` data-endpoint="${opts.endpoint}"` : ""}>
          <div data-form-body>
            <div class="form-grid">
              <div class="field"><label for="${f("name")}">Họ và tên <span aria-hidden="true">*</span></label><input id="${f("name")}" name="name" type="text" autocomplete="name" required aria-describedby="${f("name")}-e"><p class="error" id="${f("name")}-e" aria-live="polite"></p></div>
              <div class="field"><label for="${f("phone")}">Số điện thoại <span aria-hidden="true">*</span></label><input id="${f("phone")}" name="phone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="0912 345 678" aria-describedby="${f("phone")}-e"><p class="error" id="${f("phone")}-e" aria-live="polite"></p></div>
              <div class="field"><label for="${f("type")}">Loại tiệc</label><select id="${f("type")}" name="type"><option>Tiệc cưới</option><option>Lễ ăn hỏi, lễ gia tiên</option><option>Hội nghị, sự kiện</option><option>Sinh nhật, họp mặt</option></select></div>
              <div class="field"><label for="${f("date")}">Ngày dự kiến</label><input id="${f("date")}" name="date" type="date" aria-describedby="${f("date")}-e"><p class="error" id="${f("date")}-e" aria-live="polite"></p></div>
              <div class="field"><label for="${f("guests")}">Số khách dự kiến</label><input id="${f("guests")}" name="guests" type="number" inputmode="numeric" min="20" max="1000" step="10" placeholder="Ví dụ 300" aria-describedby="${f("guests")}-e"><p class="error" id="${f("guests")}-e" aria-live="polite"></p></div>
              <div class="field"><label for="${f("hall")}">Sảnh quan tâm</label><select id="${f("hall")}" name="hall">${hallOptions()}</select></div>
            </div>
            <fieldset class="field want">
              <legend>Bạn muốn</legend>
              <div class="chips">
                <label class="chip"><input type="radio" name="want" value="Đến xem sảnh" checked><span>Đến xem sảnh</span></label>
                <label class="chip"><input type="radio" name="want" value="Gọi tư vấn báo giá"><span>Gọi tư vấn báo giá</span></label>
                <label class="chip"><input type="radio" name="want" value="Đặt buổi nếm thử"><span>Đặt buổi nếm thử</span></label>
              </div>
            </fieldset>
            <div class="field"><label for="${f("note")}">Ghi chú</label><textarea id="${f("note")}" name="note" rows="2" placeholder="Giờ tốt, số bàn chay, câu hỏi cho tư vấn viên..."></textarea></div>
            <div class="field field-check"><label class="check"><input type="checkbox" name="agree" aria-describedby="${f("agree")}-e"><span>Tôi đồng ý để Luimiere gọi lại và lưu thông tin theo <a href="chinh-sach.html#bao-mat">chính sách bảo mật</a>.</span></label><p class="error" id="${f("agree")}-e" aria-live="polite"></p></div>
            <p class="form-error" data-form-error hidden role="alert">Chưa gửi được. Kiểm tra kết nối mạng rồi thử lại, hoặc gọi <a href="tel:${site.hotlineTel}">${site.hotline}</a>.</p>
            <button class="btn btn-primary btn-lg btn-block" type="submit" data-submit><span class="btn-label">${opts.submit || "Gửi yêu cầu"}</span><span class="btn-ico"><i class="ph ph-arrow-up-right" aria-hidden="true"></i></span></button>
            <p class="form-note">Tư vấn viên gọi lại trong 30 phút, từ 8:00 đến 21:00 mỗi ngày.</p>
          </div>
          <div class="form-success" data-form-success hidden tabindex="-1">
            <span class="success-ico" aria-hidden="true"><i class="ph ph-check"></i></span>
            <h3>Đã nhận yêu cầu của <span data-success-name></span></h3>
            <p>Tư vấn viên sẽ gọi số <strong data-success-phone></strong> trong 30 phút tới. Nếu gửi ngoài giờ, chúng tôi gọi lại lúc 8:00 sáng hôm sau.</p>
            <button class="btn btn-ghost btn-sm" type="button" data-form-again>Gửi yêu cầu khác</button>
          </div>
        </form>`;
}

function tokens(html, ctx) {
  return html.replace(/\{\{\s*([\w-]+)([^}]*)\}\}/g, (m, name, rawArgs) => {
    const opts = {};
    rawArgs.replace(/([\w-]+)="([^"]*)"/g, (_, k, v) => (opts[k] = v));
    switch (name) {
      case "crumbs": return crumbs(ctx.meta.crumbs);
      case "hall-stack": return hallStack();
      case "hall-grid": return `<div class="hall-grid" data-hall-grid>${halls.map(hallCard).join("\n")}</div>`;
      case "hall-options": return hallOptions();
      case "hall-options-est": return halls.map((h) => `<option value="${esc(h.name)}" data-min="${h.tables[0]}" data-max="${h.tables[1]}"${h.key === "soleil" ? " selected" : ""}>Sảnh ${esc(h.name)} (${h.tables[0]} - ${h.tables[1]} bàn)</option>`).join("");
      case "hall-compare": return `<div class="table-wrap"><table class="cmp-table">
            <caption class="sr-only">So sánh 4 sảnh tiệc</caption>
            <thead><tr><th scope="col">Sảnh</th><th scope="col">Bàn tiệc cưới</th><th scope="col">Khách</th><th scope="col">Diện tích</th><th scope="col">Trần</th><th scope="col">Vị trí</th><th scope="col">Hợp nhất với</th></tr></thead>
            <tbody>${halls.map((h) => `<tr><th scope="row"><a href="${h.slug}.html">${esc(h.name)}</a></th><td class="num">${h.tables[0]} - ${h.tables[1]}</td><td class="num">đến ${h.tables[1] * 10}</td><td class="num">${h.area} m²</td><td class="num">${esc(h.ceiling)}</td><td>${esc(h.floor)}</td><td>${esc(h.bestFor[0])}</td></tr>`).join("")}</tbody>
          </table></div>`;
      case "event-table": return `<div class="table-wrap"><table class="cmp-table">
            <caption class="sr-only">Sức chứa theo kiểu bố trí</caption>
            <thead><tr><th scope="col">Kiểu bố trí</th>${halls.map((h) => `<th scope="col" class="num">${esc(h.name)}</th>`).join("")}</tr></thead>
            <tbody>${halls[0].layouts.map((l, i) => `<tr><th scope="row">${esc(l[0])}</th>${halls.map((h) => `<td class="num">${esc(h.layouts[i][1])}</td>`).join("")}</tr>`).join("")}</tbody>
          </table></div>`;
      case "book-form": return bookForm(opts.id || "f", opts);
      case "menu-options": return menuOptions();
      case "menu-tabs": return menuTabs();
      case "menu-rail": return menuRail();
      case "menu-card": return menuCard(menus.find((m) => m.key === opts.key) || menus[0], { compact: true });
      case "menu-min": return money(Math.min(...menus.map((m) => m.price)));
      case "date-rail": return dateRail();
      case "hall-count": return String(halls.length);
      case "posts": return postsGrid(opts);
      case "hotline": return site.hotline;
      case "hotline-tel": return site.hotlineTel;
      case "mobile": return site.mobile;
      case "mobile-tel": return site.mobileTel;
      case "email": return site.email;
      case "address": return site.address;
      case "map-query": return encodeURIComponent(site.mapQuery);
      case "visit-hours": return site.visitHours;
      case "zalo": return site.zalo;
      case "facebook": return site.facebook;
      case "instagram": return site.instagram;
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
  if (meta.nav) header = header.replace(`data-nav-key="${meta.nav}"`, `data-nav-key="${meta.nav}" data-active`);
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
  <meta name="theme-color" content="#0f0e0c">
  <meta name="color-scheme" content="dark">
  <link rel="canonical" href="${site.url}/${meta.file === "index.html" ? "" : meta.file}">
  <meta property="og:title" content="${esc(meta.title)}">
  <meta property="og:description" content="${esc(meta.description)}">
  <meta property="og:image" content="${meta.image || "assets/img/hero-sanh-den-chum.jpg"}">
  <meta property="og:type" content="${meta.ogType || "website"}">
  <meta property="og:locale" content="vi_VN">${meta.noindex ? '\n  <meta name="robots" content="noindex">' : ""}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Montserrat:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
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

const hallTpl = require(path.join(SRC, "templates/hall.js"));
halls.forEach((h, i) => {
  const meta = {
    file: `${h.slug}.html`, title: `Sảnh ${h.name}: ${h.tables[0]} - ${h.tables[1]} bàn, ${h.area} m²`, description: h.lead, nav: "sanh-tiec",
    image: `assets/img/${h.image}`, preload: `assets/img/${h.image}`,
    crumbs: [["Sảnh tiệc", "sanh-tiec.html"], [`Sảnh ${h.name}`, `${h.slug}.html`]],
  };
  const others = halls.filter((x) => x.slug !== h.slug);
  write(meta.file, layout(meta, tokens(hallTpl({ h, i, others, menus, dots, hallStat, money, esc }), { meta })));
});

const postTpl = require(path.join(SRC, "templates/post.js"));
for (const p of posts) {
  const meta = {
    file: `${p.slug}.html`, title: p.title, description: p.excerpt, nav: "cam-nang", ogType: "article",
    image: `assets/img/${p.image}`, crumbs: [["Cẩm nang cưới", "cam-nang.html"], [p.title, `${p.slug}.html`]],
  };
  write(meta.file, layout(meta, tokens(postTpl({ p, esc }), { meta })));
}

const today = new Date().toISOString().slice(0, 10);
const urls = out.filter((f) => f !== "404.html").map((f) => `  <url><loc>${site.url}/${f === "index.html" ? "" : f}</loc><lastmod>${today}</lastmod></url>`);
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`);
console.log(`Đã build ${out.length} trang:\n  ` + out.join("\n  "));
