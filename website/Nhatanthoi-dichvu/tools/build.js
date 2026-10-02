#!/usr/bin/env node
/*
 * Nhã An Thời - static site builder (không phụ thuộc thư viện)
 *
 *   node tools/build.js
 *
 * - src/pages/*.html     : nội dung từng trang, dòng đầu là <!--meta {...JSON...}-->
 * - src/partials/*.html  : header, footer, khối đặt lịch thử áo cuối trang
 * - src/data/*.js        : bộ sưu tập, mẫu áo, bài viết, thông tin chung
 * - src/templates/*.js   : trang bộ sưu tập, trang mẫu áo, bài viết
 * Kết quả ghi ra thư mục gốc dự án, kèm sitemap.xml.
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const site = require(path.join(SRC, "data/site.js"));
const collections = require(path.join(SRC, "data/collections.js"));
const products = require(path.join(SRC, "data/products.js"));
const posts = require(path.join(SRC, "data/posts.js"));

const read = (p) => fs.readFileSync(path.join(SRC, p), "utf8");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const vnd = (n) => n.toLocaleString("de-DE") + "đ";
const colOf = (key) => collections.find((c) => c.key === key);

/* ---------------------------------------------------------------- khối dựng sẵn */

function crumbs(list) {
  if (!list || !list.length) return "";
  const items = [["Trang chủ", "index.html"]].concat(list);
  return `<nav class="crumbs" aria-label="Đường dẫn trang"><ol>${items
    .map((c, i) => (i === items.length - 1 ? `<li aria-current="page">${esc(c[0])}</li>` : `<li><a href="${c[1]}">${esc(c[0])}</a></li>`))
    .join("")}</ol></nav>`;
}

function bagButton(p, cls) {
  return `<button class="${cls || "bag-btn"}" type="button" data-bag-add data-slug="${p.slug}" data-name="${esc(p.name)}" data-img="${p.img}" data-price="${p.price}" aria-pressed="false"><i class="ph ph-coat-hanger" aria-hidden="true"></i><span>Thêm vào túi thử</span></button>`;
}

function productCard(p) {
  const c = colOf(p.col);
  return `<article class="card" data-col="${p.col}" data-sub="${esc(p.sub)}" data-price="${p.price}">
            <a class="card-media" href="${p.slug}.html" tabindex="-1" aria-hidden="true"><img src="assets/img/${p.img}" width="700" height="1000" alt="" loading="lazy">${p.isNew ? '<span class="tag-new">Mới về</span>' : ""}</a>
            <div class="card-body">
              <p class="card-cat">${esc(c.short)} · ${esc(p.sub)}</p>
              <h3><a href="${p.slug}.html">${esc(p.name)}</a></h3>
              <p class="card-price"><strong>${vnd(p.price)}</strong><span>/ ${p.days} ngày</span></p>
              ${bagButton(p, "bag-mini")}
            </div>
          </article>`;
}

function productGrid(opts) {
  let list = products.slice();
  if (opts.col) list = list.filter((p) => p.col === opts.col);
  if (opts.new) list = list.filter((p) => p.isNew);
  if (opts.exclude) list = list.filter((p) => p.slug !== opts.exclude);
  if (opts.limit) list = list.slice(0, Number(opts.limit));
  return `<div class="card-grid${opts.class ? " " + opts.class : ""}" data-filter-target>${list.map(productCard).join("\n")}</div>`;
}

/* Giá móc treo: áo mới về treo trên thanh ngang */
function rail() {
  const list = products.filter((p) => p.isNew);
  return `<div class="rail" data-rail>
          <ul class="rail-track" data-rail-track>${list
            .map((p) => `<li class="hang">
              <a href="${p.slug}.html" class="hang-link">
                <span class="hanger" aria-hidden="true"></span>
                <span class="hang-img"><img src="assets/img/${p.img}" width="700" height="1000" alt="${esc(p.alt)}" loading="lazy"></span>
                <span class="hang-tag"><span>${esc(colOf(p.col).short)}</span><strong>${esc(p.name)}</strong><em>${vnd(p.price)}</em></span>
              </a>
            </li>`)
            .join("")}</ul>
        </div>`;
}

function occasionList() {
  return `<div class="occ" data-occ>
          <div class="occ-media" aria-hidden="true">${collections
            .map((c, i) => `<img src="assets/img/${c.image}" width="700" height="1000" alt="" loading="lazy"${i ? "" : ' class="is-on"'} data-occ-img="${i}">`)
            .join("")}</div>
          <ol class="occ-list">${collections
            .map((c, i) => `<li class="occ-item" data-occ-item="${i}">
              <a href="${c.slug}.html">
                <span class="occ-no">${c.no}</span>
                <span class="occ-name">${esc(c.name)}</span>
                <span class="occ-meta">${esc(c.subs.join(" · "))}</span>
                <span class="occ-price">${esc(c.price)}</span>
              </a>
              <img class="occ-thumb" src="assets/img/${c.image}" width="700" height="1000" alt="" loading="lazy">
            </li>`)
            .join("")}</ol>
        </div>`;
}

function postCard(p) {
  return `<article class="post">
            <a class="post-media" href="${p.slug}.html" tabindex="-1" aria-hidden="true"><img src="assets/img/${p.image}" width="700" height="900" alt="" loading="lazy"></a>
            <p class="post-meta"><span>${esc(p.cat)}</span><span>${p.date}</span></p>
            <h3><a href="${p.slug}.html">${esc(p.title)}</a></h3>
            <p>${esc(p.excerpt)}</p>
          </article>`;
}

function faqList(items) {
  return `<div class="faq-list">${items
    .map((f) => `<details class="faq-item">
            <summary>${esc(f.q)}<i class="ph ph-plus" aria-hidden="true"></i></summary>
            <div class="faq-answer"><p>${f.a}</p></div>
          </details>`)
    .join("\n")}</div>`;
}

function occasionOptions() {
  return ['<option value="">Chọn dịp</option>'].concat(collections.filter((c) => c.key !== "phukien").map((c) => `<option>${esc(c.name)}</option>`)).concat(["<option>Khác</option>"]).join("");
}

function tokens(html, ctx) {
  return html.replace(/\{\{\s*([\w-]+)([^}]*)\}\}/g, (m, name, rawArgs) => {
    const opts = {};
    rawArgs.replace(/([\w-]+)="([^"]*)"/g, (_, k, v) => (opts[k] = v));
    switch (name) {
      case "crumbs": return crumbs(ctx.meta.crumbs);
      case "products": return productGrid(opts);
      case "rail": return rail();
      case "occasions": return occasionList();
      case "collection-chips": return collections.map((c) => `<button class="chip" type="button" data-filter-value="${c.key}" aria-pressed="false">${esc(c.short)}</button>`).join("");
      case "occasion-options": return occasionOptions();
      case "posts": {
        let list = posts.slice();
        if (opts.exclude) list = list.filter((p) => p.slug !== opts.exclude);
        if (opts.limit) list = list.slice(0, Number(opts.limit));
        return `<div class="post-grid">${list.map(postCard).join("\n")}</div>`;
      }
      case "product-count": return String(products.length);
      case "booking": return tokens(partials.cta, ctx);
      case "hotline": return site.hotline;
      case "hotline-tel": return site.hotlineTel;
      case "email": return site.email;
      case "zalo": return site.zalo;
      case "address": return site.address;
      case "hours": return site.hours;
      case "map-q": return encodeURIComponent(site.map);
      case "year": return String(new Date().getFullYear());
      default: return m;
    }
  });
}

/* ---------------------------------------------------------------- khung trang */

const partials = { header: read("partials/header.html"), footer: read("partials/footer.html"), cta: read("partials/cta.html") };

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
  <meta property="og:image" content="${meta.image || "assets/img/hero-do.jpg"}">
  <meta property="og:type" content="${meta.ogType || "website"}">
  <meta property="og:locale" content="vi_VN">${meta.noindex ? '\n  <meta name="robots" content="noindex">' : ""}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..700;1,400..600&family=Be+Vietnam+Pro:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/light/style.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/fill/style.css">${meta.preload ? `\n  <link rel="preload" as="image" href="${meta.preload}">` : ""}
  <link rel="stylesheet" href="assets/css/style.css">
  <link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
</head>
<body data-page="${meta.file.replace(".html", "")}"${meta.calm ? " data-calm" : ""}>
  <a class="skip-link" href="#main">Bỏ qua điều hướng</a>
${header}
  <main id="main">
${body}
${cta}
  </main>
${partials.footer}
  <script src="assets/js/main.js" defer></script>
</body>
</html>
`;
  return tokens(html, { meta }).replace(/class="ph /g, 'class="ph-light ');
}

/* ---------------------------------------------------------------- trang */

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

const colTpl = require(path.join(SRC, "templates/collection.js"));
for (const c of collections) {
  const meta = {
    file: `${c.slug}.html`, title: `${c.name} cho thuê`, description: c.lead, nav: "bo-suu-tap",
    image: `assets/img/${c.image}`, preload: `assets/img/${c.image}`,
    crumbs: [["Bộ sưu tập", "bo-suu-tap.html"], [c.name, `${c.slug}.html`]],
  };
  const mine = products.filter((p) => p.col === c.key);
  const subs = c.subs.filter((s) => mine.some((p) => p.sub === s));
  write(meta.file, layout(meta, tokens(colTpl({ c, count: mine.length, subs, collections, faqList, esc }), { meta })));
}

const productTpl = require(path.join(SRC, "templates/product.js"));
for (const p of products) {
  const c = colOf(p.col);
  const meta = {
    file: `${p.slug}.html`, title: `${p.name}, cho thuê ${vnd(p.price)}`, description: p.desc, nav: "bo-suu-tap", calm: true,
    image: `assets/img/${p.img}`, preload: `assets/img/${p.img}`,
    crumbs: [["Bộ sưu tập", "bo-suu-tap.html"], [c.name, `${c.slug}.html`], [p.name, `${p.slug}.html`]],
  };
  write(meta.file, layout(meta, tokens(productTpl({ p, c, vnd, esc, bagButton }), { meta })));
}

const postTpl = require(path.join(SRC, "templates/post.js"));
for (const p of posts) {
  const meta = {
    file: `${p.slug}.html`, title: p.title, description: p.excerpt, nav: "bai-viet", ogType: "article",
    image: `assets/img/${p.image}`, crumbs: [["Bài viết", "bai-viet.html"], [p.title, `${p.slug}.html`]],
  };
  write(meta.file, layout(meta, tokens(postTpl({ p, esc }), { meta })));
}

const today = new Date().toISOString().slice(0, 10);
const urls = out.filter((f) => f !== "404.html").map((f) => `  <url><loc>${site.url}/${f === "index.html" ? "" : f}</loc><lastmod>${today}</lastmod></url>`);
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`);
console.log(`Đã build ${out.length} trang`);
