#!/usr/bin/env node
/*
 * K-Lab's Sneaker Care - static site builder (không phụ thuộc thư viện)
 *
 *   node tools/build.js
 *
 * - src/pages/*.html     : nội dung từng trang, dòng đầu là <!--meta {...JSON...}-->
 * - src/partials/*.html  : topbar + header, footer, dải CTA, popup đặt lịch, nút nổi
 * - src/data/*.js        : dịch vụ, chi nhánh, sản phẩm, bài viết, thông tin chung
 * Kết quả ghi ra thư mục gốc dự án.
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const site = require(path.join(SRC, "data/site.js"));
const services = require(path.join(SRC, "data/services.js"));
const branches = require(path.join(SRC, "data/branches.js"));
const products = require(path.join(SRC, "data/products.js"));
const posts = require(path.join(SRC, "data/posts.js"));

const read = (p) => fs.readFileSync(path.join(SRC, p), "utf8");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const vnd = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";

/* ---------------------------------------------------------------- helpers */

function crumbs(list) {
  if (!list || !list.length) return "";
  const items = [["Trang chủ", "index.html"]].concat(list);
  return `<nav class="crumbs" aria-label="Đường dẫn trang"><ol>${items
    .map((c, i) => (i === items.length - 1 ? `<li aria-current="page">${esc(c[0])}</li>` : `<li><a href="${c[1]}">${esc(c[0])}</a></li>`))
    .join("")}</ol></nav>`;
}

function serviceCard(s) {
  return `<article class="svc-card" data-category="${s.group}">
            <a class="svc-media" href="${s.slug}.html" tabindex="-1" aria-hidden="true"><img src="assets/img/${s.image}" width="1200" height="900" alt="" loading="lazy"></a>
            <div class="svc-body">
              <h3><a href="${s.slug}.html">${esc(s.name)}</a></h3>
              <p>${esc(s.cardText)}</p>
              <p class="svc-price">${esc(s.fromPrice)}</p>
            </div>
          </article>`;
}

function branchItem(b, i) {
  return `<li class="branch-item">
            <p class="branch-no">CS${i + 1}</p>
            <div>
              <h3>${esc(b.name)}</h3>
              <p>${esc(b.address)}</p>
              <p class="branch-links"><a href="tel:${b.phone.replace(/\s/g, "")}"><i class="ph-light ph-phone" aria-hidden="true"></i>${esc(b.phone)}</a><a href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(b.mapQuery)}" target="_blank" rel="noopener"><i class="ph-light ph-map-trifold" aria-hidden="true"></i>Chỉ đường</a></p>
            </div>
          </li>`;
}

function productCard(p) {
  const sale = p.oldPrice ? `<span class="pd-old">${vnd(p.oldPrice)}</span>` : "";
  const off = p.oldPrice ? `<span class="pd-off">-${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>` : "";
  return `<article class="pd-card" data-category="${p.cat}">
            <figure class="pd-media"><img src="assets/img/${p.image}" width="900" height="1100" alt="${esc(p.imageAlt)}" loading="lazy">${off}</figure>
            <div class="pd-body">
              <p class="pd-cat">${esc(p.catName)}</p>
              <h3>${esc(p.name)}</h3>
              <p class="pd-price"><strong>${vnd(p.price)}</strong>${sale}</p>
              <button class="btn btn-outline btn-sm btn-block" type="button" data-open-booking data-need="Mua sản phẩm: ${esc(p.name)}">Đặt mua</button>
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
            </div>
          </article>`;
}

function faqList(items) {
  return `<div class="faq-list">${items
    .map((f) => `<details class="faq-item"><summary>${esc(f.q)}<i class="ph-light ph-plus" aria-hidden="true"></i></summary><div class="faq-answer"><p>${f.a}</p></div></details>`)
    .join("\n")}</div>`;
}

function priceGroups(list) {
  return list
    .map(
      (s) => `<section class="price-group" id="gia-${s.slug}">
          <header><h3>${esc(s.name)}</h3><a class="text-link" href="${s.slug}.html">Chi tiết <i class="ph-light ph-arrow-right" aria-hidden="true"></i></a></header>
          <ul>${s.options
            .map((o) => `<li><div><strong>${esc(o.name)}</strong>${o.note ? `<span>${esc(o.note)}</span>` : ""}</div><p class="price-val">${esc(o.price)}</p></li>`)
            .join("")}</ul>
          ${s.priceNote ? `<p class="price-note">${esc(s.priceNote)}</p>` : ""}
        </section>`
    )
    .join("\n");
}

function tokens(html, ctx) {
  return html.replace(/\{\{\s*([\w-]+)([^}]*)\}\}/g, (m, name, rawArgs) => {
    const opts = {};
    rawArgs.replace(/([\w-]+)="([^"]*)"/g, (_, k, v) => (opts[k] = v));
    switch (name) {
      case "crumbs": return crumbs(ctx.meta.crumbs);
      case "services": {
        let list = services;
        if (opts.group) list = list.filter((s) => s.group === opts.group);
        if (opts.limit) list = list.slice(0, Number(opts.limit));
        return `<div class="svc-grid" data-filter-target>${list.map(serviceCard).join("\n")}</div>`;
      }
      case "service-index":
        return `<div class="svc-index" data-svc-index>${services
          .map((s) => `<a class="svc-row" href="${s.slug}.html" data-preview="assets/img/${s.image}"><h3>${esc(s.name)}</h3><p>${esc(s.cardText)}</p><span class="svc-from">${esc(s.fromPrice)}</span><span class="svc-go" aria-hidden="true"><i class="ph-light ph-arrow-right"></i></span></a>`)
          .join("\n")}</div>`;
      case "service-options": return ['<option value="">Chọn dịch vụ</option>'].concat(services.map((s) => `<option>${esc(s.name)}</option>`)).concat(["<option>Chưa rõ, cần tư vấn</option>"]).join("");
      case "branches": return `<ol class="branch-list">${branches.map(branchItem).join("\n")}</ol>`;
      case "branch-options": return ['<option value="">Chọn cơ sở</option>'].concat(branches.map((b, i) => `<option>CS${i + 1}: ${esc(b.address)}</option>`)).concat(["<option>Nhận trả giày tại nhà</option>"]).join("");
      case "branch-count": return String(branches.length);
      case "topbar-branches": return branches.map((b, i) => `<li><strong>CS${i + 1}</strong> ${esc(b.short)} <a href="tel:${b.phone.replace(/\s/g, "")}">${esc(b.phone)}</a></li>`).join("");
      case "footer-branches": return branches.map((b, i) => `<li><strong>CS${i + 1}:</strong> ${esc(b.address)}<br><a href="tel:${b.phone.replace(/\s/g, "")}">${esc(b.phone)}</a></li>`).join("");
      case "products": {
        let list = products;
        if (opts.limit) list = list.slice(0, Number(opts.limit));
        return `<div class="pd-grid" data-filter-target>${list.map(productCard).join("\n")}</div>`;
      }
      case "price-groups": return priceGroups(services);
      case "posts": {
        let list = posts.slice();
        if (opts.exclude) list = list.filter((p) => p.slug !== opts.exclude);
        if (opts.limit) list = list.slice(0, Number(opts.limit));
        return `<div class="post-grid" data-filter-target>${list.map(postCard).join("\n")}</div>`;
      }
      case "hotline": return site.hotline;
      case "hotline-tel": return site.hotline.replace(/\s/g, "");
      case "email": return site.email;
      case "zalo": return site.zalo;
      case "year": return String(new Date().getFullYear());
      default: return m;
    }
  });
}

/* ---------------------------------------------------------------- layout */

const partials = { header: read("partials/header.html"), footer: read("partials/footer.html"), cta: read("partials/cta.html"), modal: read("partials/modal.html") };

function layout(meta, body) {
  let header = partials.header;
  if (meta.nav) header = header.replace(`data-nav-key="${meta.nav}"`, `data-nav-key="${meta.nav}" data-active`);
  header = header.replace(new RegExp(`href="${meta.file}"`, "g"), `href="${meta.file}" aria-current="page"`);
  const cta = meta.cta === false ? "" : partials.cta;
  const title = meta.file === "index.html" ? meta.title : `${meta.title} | ${site.shortName}`;
  return tokens(`<!doctype html>
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
  <meta property="og:image" content="${meta.image || "assets/img/hero-af1.jpg"}">
  <meta property="og:type" content="${meta.ogType || "website"}">
  <meta property="og:locale" content="vi_VN">${meta.noindex ? '\n  <meta name="robots" content="noindex">' : ""}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
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
`, { meta });
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

const serviceTpl = require(path.join(SRC, "templates/service.js"));
for (const s of services) {
  const meta = { file: `${s.slug}.html`, title: s.seoTitle, description: s.lead, nav: "dich-vu", image: `assets/img/${s.image}`, preload: `assets/img/${s.image}`, crumbs: [["Dịch vụ", "dich-vu.html"], [s.name, `${s.slug}.html`]] };
  const related = services.filter((x) => x.slug !== s.slug && x.group === s.group).concat(services.filter((x) => x.group !== s.group)).slice(0, 3);
  write(meta.file, layout(meta, tokens(serviceTpl({ s, related, faqList, serviceCard, esc }), { meta })));
}

const postTpl = require(path.join(SRC, "templates/post.js"));
for (const p of posts) {
  const meta = { file: `${p.slug}.html`, title: p.title, description: p.excerpt, nav: "blog", ogType: "article", image: `assets/img/${p.image}`, crumbs: [["Blog", "blog.html"], [p.title, `${p.slug}.html`]] };
  write(meta.file, layout(meta, tokens(postTpl({ p, esc }), { meta })));
}

const today = new Date().toISOString().slice(0, 10);
const urls = out.filter((f) => f !== "404.html").map((f) => `  <url><loc>${site.url}/${f === "index.html" ? "" : f}</loc><lastmod>${today}</lastmod></url>`);
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`);
console.log(`Đã build ${out.length} trang:\n  ` + out.join("\n  "));
