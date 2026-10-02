#!/usr/bin/env node
/*
 * 3DRoom - static site builder (không phụ thuộc thư viện)
 *
 *   node tools/build.js
 *
 * - src/pages/*.html     : nội dung từng trang, dòng đầu là <!--meta {...JSON...}-->
 * - src/partials/*.html  : header, footer, khối báo giá cuối trang
 * - src/data/*.js        : dịch vụ, vật liệu, dự án, bài viết, thông tin chung
 * - src/templates/*.js   : trang dịch vụ và bài viết
 * Kết quả ghi ra thư mục gốc dự án, kèm sitemap.xml.
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const site = require(path.join(SRC, "data/site.js"));
const services = require(path.join(SRC, "data/services.js"));
const materials = require(path.join(SRC, "data/materials.js"));
const projects = require(path.join(SRC, "data/projects.js"));
const posts = require(path.join(SRC, "data/posts.js"));

const read = (p) => fs.readFileSync(path.join(SRC, p), "utf8");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const money = (n) => n.toLocaleString("de-DE");
const dots = (n) => `<span class="dots" aria-label="${n} trên 5">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= n ? "on" : ""}"></i>`).join("")}</span>`;

/* ---------------------------------------------------------------- khối dựng sẵn */

function crumbs(list) {
  if (!list || !list.length) return "";
  const items = [["Trang chủ", "index.html"]].concat(list);
  return `<nav class="crumbs" aria-label="Đường dẫn trang"><ol>${items
    .map((c, i) => (i === items.length - 1 ? `<li aria-current="page">${esc(c[0])}</li>` : `<li><a href="${c[1]}">${esc(c[0])}</a></li>`))
    .join("")}</ol></nav>`;
}

function serviceCard(s) {
  return `<article class="svc-card">
            <a class="svc-media" href="${s.slug}.html" tabindex="-1" aria-hidden="true"><img src="assets/img/${s.image}" width="1200" height="800" alt="" loading="lazy"></a>
            <div class="svc-body">
              <p class="svc-code">${s.code}</p>
              <h3><a href="${s.slug}.html">${esc(s.name)}</a></h3>
              <p>${esc(s.cardText)}</p>
              <p class="svc-price">${esc(s.priceFrom)}</p>
            </div>
          </article>`;
}

function postCard(p) {
  return `<article class="post-card" data-category="${p.catKey}">
            <a class="post-media" href="${p.slug}.html" tabindex="-1" aria-hidden="true"><img src="assets/img/${p.image}" width="1200" height="800" alt="" loading="lazy"></a>
            <div class="post-body">
              <p class="post-meta"><span class="post-cat">${esc(p.cat)}</span><span>${p.date}</span><span>${p.read} phút đọc</span></p>
              <h3><a href="${p.slug}.html">${esc(p.title)}</a></h3>
              <p>${esc(p.excerpt)}</p>
            </div>
          </article>`;
}

function projectCard(p) {
  return `<figure class="proj${p.tall ? " proj-tall" : ""}" data-industry="${p.industry}">
            <img src="assets/img/${p.img}" width="1200" height="${p.tall ? 1600 : 800}" alt="${esc(p.title)}" loading="lazy">
            <figcaption><strong>${esc(p.title)}</strong><span>${p.tech} · ${esc(p.material)} · ${esc(p.time)}</span></figcaption>
          </figure>`;
}

function materialCard(m) {
  const price = m.price ? `${money(m.price[0])}-${money(m.price[1])}đ/g` : "Báo giá theo file";
  return `<article class="mat" data-tech="${m.tech.toLowerCase()}">
            <div class="mat-top"><span class="mat-swatch" style="--sw:${m.swatch}" aria-hidden="true"></span><p class="mat-tech">${m.tech}</p></div>
            <h3>${esc(m.name)}</h3>
            <p class="mat-note">${esc(m.note)}</p>
            <dl class="mat-props">
              <div><dt>Độ bền</dt><dd>${dots(m.strength)}</dd></div>
              <div><dt>Độ chi tiết</dt><dd>${dots(m.detail)}</dd></div>
              <div><dt>Chịu nhiệt</dt><dd>${dots(m.heat)}</dd></div>
            </dl>
            <p class="mat-use"><span>Dùng cho</span>${esc(m.use)}</p>
            <p class="mat-foot"><span>${esc(m.temp)}</span><strong>${price}</strong></p>
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

function serviceOptions() {
  return ['<option value="">Chọn dịch vụ</option>'].concat(services.map((s) => `<option>${esc(s.name)}</option>`)).concat(["<option>Chưa rõ, cần tư vấn</option>"]).join("");
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
        if (opts.exclude) list = list.filter((s) => s.slug !== opts.exclude);
        if (opts.limit) list = list.slice(0, Number(opts.limit));
        return `<div class="svc-grid${opts.class ? " " + opts.class : ""}">${list.map(serviceCard).join("\n")}</div>`;
      }
      case "service-options": return serviceOptions();
      case "materials": {
        const list = opts.tech ? materials.filter((m) => m.tech === opts.tech) : materials;
        return `<div class="mat-grid" data-filter-target>${list.map(materialCard).join("\n")}</div>`;
      }
      case "materials-json":
        return `<script type="application/json" id="mat-data">${JSON.stringify(materials.map((m) => ({ key: m.key, name: m.name, tech: m.tech, price: m.price })))}</script>`;
      case "projects": {
        const list = opts.limit ? projects.slice(0, Number(opts.limit)) : projects;
        return `<div class="proj-grid" data-filter-target>${list.map(projectCard).join("\n")}</div>`;
      }
      case "posts": {
        let list = posts.slice();
        if (opts.exclude) list = list.filter((p) => p.slug !== opts.exclude);
        if (opts.limit) list = list.slice(0, Number(opts.limit));
        return `<div class="post-grid" data-filter-target>${list.map(postCard).join("\n")}</div>`;
      }
      case "offices":
        return `<div class="offices">${site.offices.map((o) => `<article class="office">
            <p class="office-coord">${o.coord}</p>
            <h3>${esc(o.city)} <span>${esc(o.label)}</span></h3>
            <ul>
              <li><i class="ph ph-map-pin" aria-hidden="true"></i>${esc(o.address)}</li>
              <li><i class="ph ph-clock" aria-hidden="true"></i>${esc(o.hours)}</li>
              <li><i class="ph ph-phone" aria-hidden="true"></i><a href="tel:${o.phone.replace(/\s/g, "")}">${o.phone}</a></li>
            </ul>
            <a class="text-link" href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(o.map)}" target="_blank" rel="noopener">Chỉ đường <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a>
          </article>`).join("\n")}</div>`;
      case "footer-offices":
        return site.offices.map((o) => `<li><strong>${esc(o.city)}</strong>${esc(o.address)}</li>`).join("");
      case "quote-form": return tokens(partials.cta, ctx);
      case "hotline": return site.hotline;
      case "hotline-tel": return site.hotlineTel;
      case "email": return site.email;
      case "zalo": return site.zalo;
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
  <meta property="og:image" content="${meta.image || "assets/img/hero-dau-in.jpg"}">
  <meta property="og:type" content="${meta.ogType || "website"}">
  <meta property="og:locale" content="vi_VN">${meta.noindex ? '\n  <meta name="robots" content="noindex">' : ""}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
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

const serviceTpl = require(path.join(SRC, "templates/service.js"));
for (const s of services) {
  const meta = {
    file: `${s.slug}.html`, title: s.seoTitle, description: s.lead, nav: "dich-vu",
    image: `assets/img/${s.image}`, preload: `assets/img/${s.heroImage}`,
    crumbs: [["Dịch vụ", "dich-vu.html"], [s.name, `${s.slug}.html`]],
  };
  const related = services.filter((x) => x.slug !== s.slug && x.group === s.group).concat(services.filter((x) => x.group !== s.group)).slice(0, 3);
  write(meta.file, layout(meta, tokens(serviceTpl({ s, related, materials, faqList, serviceCard, esc, dots }), { meta })));
}

const postTpl = require(path.join(SRC, "templates/post.js"));
for (const p of posts) {
  const meta = {
    file: `${p.slug}.html`, title: p.title, description: p.excerpt, nav: "blog", ogType: "article",
    image: `assets/img/${p.image}`, crumbs: [["Blog", "blog.html"], [p.title, `${p.slug}.html`]],
  };
  write(meta.file, layout(meta, tokens(postTpl({ p, esc }), { meta })));
}

const today = new Date().toISOString().slice(0, 10);
const urls = out.filter((f) => f !== "404.html").map((f) => `  <url><loc>${site.url}/${f === "index.html" ? "" : f}</loc><lastmod>${today}</lastmod></url>`);
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`);
console.log(`Đã build ${out.length} trang:\n  ` + out.join("\n  "));
