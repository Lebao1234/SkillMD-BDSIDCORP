#!/usr/bin/env node
/*
 * Phím Đàn Piano - static site builder (không phụ thuộc thư viện)
 *
 *   node tools/build.js
 *
 * - src/pages/*.html     : nội dung từng trang, dòng đầu là <!--meta {...JSON...}-->
 * - src/partials/*.html  : header, footer, dải CTA, popup đăng ký, nút nổi
 * - src/data/*.js        : chương trình học, chi nhánh, bài viết, thông tin chung
 * Kết quả ghi ra thư mục gốc dự án.
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const site = require(path.join(SRC, "data/site.js"));
const programs = require(path.join(SRC, "data/programs.js"));
const branches = require(path.join(SRC, "data/branches.js"));
const posts = require(path.join(SRC, "data/posts.js"));

const read = (p) => fs.readFileSync(path.join(SRC, p), "utf8");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ---------------------------------------------------------------- helpers */

function crumbs(list) {
  if (!list || !list.length) return "";
  const items = [["Trang chủ", "index.html"]].concat(list);
  return `<nav class="crumbs" aria-label="Đường dẫn trang"><ol>${items
    .map((c, i) => (i === items.length - 1 ? `<li aria-current="page">${esc(c[0])}</li>` : `<li><a href="${c[1]}">${esc(c[0])}</a></li>`))
    .join("")}</ol></nav>`;
}

function branchCard(b) {
  return `<article class="branch-card" data-area="${b.area}">
            <figure class="branch-media"><img src="assets/img/${b.image}" width="1200" height="900" alt="${esc(b.imageAlt)}" loading="lazy"></figure>
            <div class="branch-body">
              <h3>Chi nhánh ${esc(b.name)}</h3>
              <p class="branch-addr"><i class="ph ph-map-pin" aria-hidden="true"></i>${esc(b.address)}</p>
              ${b.note ? `<p class="branch-note">${esc(b.note)}</p>` : ""}
              <p class="branch-meta"><span><i class="ph ph-piano-keys" aria-hidden="true"></i>${b.pianos} đàn</span><span><i class="ph ph-clock" aria-hidden="true"></i>${esc(b.hours)}</span></p>
              <div class="branch-actions">
                <a class="btn btn-ghost btn-sm" href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(b.mapQuery)}" target="_blank" rel="noopener">Chỉ đường <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a>
                <button class="btn btn-outline btn-sm" type="button" data-open-register data-branch="${esc(b.name)}">Học thử tại đây</button>
              </div>
            </div>
          </article>`;
}

function postCard(p) {
  return `<article class="post-card" data-category="${p.catKey}">
            <a class="post-media" href="${p.slug}.html" tabindex="-1" aria-hidden="true"><img src="assets/img/${p.image}" width="1200" height="800" alt="" loading="lazy"></a>
            <div class="post-body">
              <p class="post-meta"><span class="post-cat">${esc(p.cat)}</span><span>${p.date}</span></p>
              <h3><a href="${p.slug}.html">${esc(p.title)}</a></h3>
              <p>${esc(p.excerpt)}</p>
              <a class="text-link" href="${p.slug}.html">Xem thêm <i class="ph ph-arrow-right" aria-hidden="true"></i></a>
            </div>
          </article>`;
}

function postsGrid(opts) {
  let list = posts.slice();
  if (opts.exclude) list = list.filter((p) => p.slug !== opts.exclude);
  if (opts.limit) list = list.slice(0, Number(opts.limit));
  return `<div class="post-grid" data-filter-target>${list.map(postCard).join("\n")}</div>`;
}

function programCard(p) {
  return `<article class="program-card">
            <a class="program-media" href="${p.slug}.html" tabindex="-1" aria-hidden="true"><img src="assets/img/${p.image}" width="1200" height="900" alt="" loading="lazy"></a>
            <div class="program-body">
              <p class="program-tag">${esc(p.tag)}</p>
              <h3><a href="${p.slug}.html">${esc(p.name)}</a></h3>
              <p>${esc(p.cardText)}</p>
              <p class="program-price">${esc(p.price)}</p>
              <a class="text-link" href="${p.slug}.html">Xem chương trình <i class="ph ph-arrow-right" aria-hidden="true"></i></a>
            </div>
          </article>`;
}

function faqList(items) {
  return `<div class="faq-list">${items
    .map(
      (f) => `<details class="faq-item">
            <summary>${esc(f.q)}<i class="ph ph-plus" aria-hidden="true"></i></summary>
            <div class="faq-answer"><p>${f.a}</p></div>
          </details>`
    )
    .join("\n")}</div>`;
}

function branchOptions() {
  return ['<option value="">Chọn chi nhánh</option>'].concat(branches.map((b) => `<option>${esc(b.name)}: ${esc(b.address)}</option>`)).join("");
}

function tokens(html, ctx) {
  return html.replace(/\{\{\s*([\w-]+)([^}]*)\}\}/g, (m, name, rawArgs) => {
    const opts = {};
    rawArgs.replace(/([\w-]+)="([^"]*)"/g, (_, k, v) => (opts[k] = v));
    switch (name) {
      case "crumbs": return crumbs(ctx.meta.crumbs);
      case "branches": {
        const list = opts.limit ? branches.slice(0, Number(opts.limit)) : branches;
        const cls = opts.layout === "scroll" ? "branch-scroll" : "branch-grid";
        return `<div class="${cls}"${opts.id ? ` id="${opts.id}"` : ""} data-filter-target>${list.map(branchCard).join("\n")}</div>`;
      }
      case "branch-list":
        return `<div class="blist" data-blist>
          <div class="blist-media" aria-hidden="true"><div class="bezel"><div class="bezel-core">${branches.map((b, i) => `<img src="assets/img/${b.image}" width="1200" height="900" alt="" loading="lazy"${i ? "" : ' class="is-on"'}>`).join("")}</div></div></div>
          <ol class="blist-rows">${branches.map((b, i) => `<li class="blist-row" data-i="${i}">
            <span class="blist-no">0${i + 1}</span>
            <div class="blist-main"><h3>${esc(b.name)}</h3><p>${esc(b.address)}</p>${b.note ? `<p class="blist-note">${esc(b.note)}</p>` : ""}</div>
            <p class="blist-meta"><span>${b.pianos} đàn</span><span>${esc(b.hours.split(",")[0])}</span></p>
            <div class="blist-act"><a class="icon-btn" href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(b.mapQuery)}" target="_blank" rel="noopener" aria-label="Chỉ đường đến chi nhánh ${esc(b.name)}"><i class="ph ph-arrow-up-right" aria-hidden="true"></i></a><button class="btn btn-ghost btn-sm" type="button" data-open-register data-branch="${esc(b.name)}">Học thử tại đây</button></div>
          </li>`).join("")}</ol>
        </div>`;
      case "program-panels":
        return `<div class="panels">${programs.map((p, i) => `<article class="panel${i ? "" : " is-default"}">
            <img src="assets/img/${p.image}" width="1200" height="900" alt="" loading="lazy">
            <div class="panel-inner">
              <p class="panel-no">0${i + 1}</p>
              <h3><a href="${p.slug}.html">${esc(p.name)}</a></h3>
              <div class="panel-more">
                <p class="panel-tag">${esc(p.tag)}</p>
                <p>${esc(p.cardText)}</p>
                <p class="panel-price">${esc(p.price)}</p>
              </div>
            </div>
          </article>`).join("")}</div>`;
      case "branch-count": return String(branches.length);
      case "branch-options": return branchOptions();
      case "posts": return postsGrid(opts);
      case "programs": return `<div class="program-grid ${opts.class || ""}">${programs.map(programCard).join("\n")}</div>`;
      case "hotline": return site.hotline;
      case "hotline-tel": return site.hotlineTel;
      case "email": return site.email;
      case "zalo": return site.zalo;
      case "year": return String(new Date().getFullYear());
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
  let header = partials.header;
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
  <meta name="theme-color" content="#ffffff">
  <link rel="canonical" href="${site.url}/${meta.file === "index.html" ? "" : meta.file}">
  <meta property="og:title" content="${esc(meta.title)}">
  <meta property="og:description" content="${esc(meta.description)}">
  <meta property="og:image" content="${meta.image || "assets/img/hero-co-gai-piano.jpg"}">
  <meta property="og:type" content="${meta.ogType || "website"}">
  <meta property="og:locale" content="vi_VN">${meta.noindex ? '\n  <meta name="robots" content="noindex">' : ""}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,300..800&family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/light/style.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/fill/style.css">${meta.preload ? `\n  <link rel="preload" as="image" href="${meta.preload}">` : ""}
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
    file: `${p.slug}.html`, title: p.seoTitle, description: p.lead, nav: "chuong-trinh",
    image: `assets/img/${p.image}`, preload: `assets/img/${p.heroImage || p.image}`,
    crumbs: [["Chương trình", "chuong-trinh.html"], [p.name, `${p.slug}.html`]],
  };
  const others = programs.filter((x) => x.slug !== p.slug);
  write(meta.file, layout(meta, tokens(programTpl({ p, others, faqList, programCard, esc }), { meta })));
}

const postTpl = require(path.join(SRC, "templates/post.js"));
for (const p of posts) {
  const meta = {
    file: `${p.slug}.html`, title: p.title, description: p.excerpt, nav: "bai-viet", ogType: "article",
    image: `assets/img/${p.image}`, crumbs: [["Blog và sự kiện", "bai-viet.html"], [p.title, `${p.slug}.html`]],
  };
  write(meta.file, layout(meta, tokens(postTpl({ p, esc }), { meta })));
}

const today = new Date().toISOString().slice(0, 10);
const urls = out.filter((f) => f !== "404.html").map((f) => `  <url><loc>${site.url}/${f === "index.html" ? "" : f}</loc><lastmod>${today}</lastmod></url>`);
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`);
console.log(`Đã build ${out.length} trang:\n  ` + out.join("\n  "));
