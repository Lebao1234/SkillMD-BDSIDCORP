#!/usr/bin/env node
/*
 * Lăng Kính - static site builder (không phụ thuộc thư viện)
 *
 *   node tools/build.js
 *
 * - src/pages/*.html     : nội dung từng trang, dòng đầu là <!--meta {...JSON...}-->
 * - src/partials/*.html  : header, footer (ngăn giỏ hàng nằm trong footer)
 * - src/data/*.js        : sản phẩm, câu chuyện, thông tin chung
 * - src/templates/*.js   : trang sản phẩm, trang câu chuyện
 * Kết quả ghi ra thư mục gốc dự án, kèm sitemap.xml.
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const site = require(path.join(SRC, "data/site.js"));
const products = require(path.join(SRC, "data/products.js"));
const stories = require(path.join(SRC, "data/stories.js"));

const read = (p) => fs.readFileSync(path.join(SRC, p), "utf8");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const vnd = (n) => n.toLocaleString("de-DE") + "đ";
const SERIES = { tinh: "Dòng Tinh", x: "Dòng X", g: "Dòng G" };
const CAM_SPECS = [["sensor", "Cảm biến"], ["ibis", "Chống rung"], ["video", "Quay phim"], ["evf", "Kính ngắm"], ["screen", "Màn hình"], ["weight", "Trọng lượng"], ["battery", "Pin"], ["mount", "Ngàm, ống kính"]];
const LENS_SPECS = [["focal", "Tiêu cự"], ["aperture", "Khẩu độ"], ["elements", "Cấu tạo"], ["af", "Lấy nét"], ["filter", "Ren kính lọc"], ["weight", "Trọng lượng"], ["wr", "Chống bụi nước"]];

/* ---------------------------------------------------------------- khối dựng sẵn */

function crumbs(list) {
  if (!list || !list.length) return "";
  const items = [["Trang chủ", "index.html"]].concat(list);
  return `<nav class="crumbs" aria-label="Đường dẫn trang"><ol>${items
    .map((c, i) => (i === items.length - 1 ? `<li aria-current="page">${esc(c[0])}</li>` : `<li><a href="${c[1]}">${esc(c[0])}</a></li>`))
    .join("")}</ol></nav>`;
}

function card(p) {
  const img = p.colors[0][2];
  const key = p.kind === "camera" ? p.specs.sensor : p.specs.focal;
  return `<article class="card" data-series="${p.series}" data-kind="${p.kind}" data-type="${esc(p.type)}" data-price="${p.price}">
            <a class="card-media" href="${p.slug}.html" tabindex="-1" aria-hidden="true">
              <img src="assets/img/${img}" width="1200" height="800" alt="" loading="lazy">
              ${p.isNew ? '<span class="tag">Mới</span>' : ""}
            </a>
            <div class="card-body">
              <p class="card-meta"><span>${SERIES[p.series]}</span><span>${esc(p.type)}</span></p>
              <h3><a href="${p.slug}.html">${esc(p.name)}</a></h3>
              <p class="card-key">${esc(key)}</p>
              <div class="card-foot">
                <p class="card-price">${vnd(p.price)}</p>
                <div class="card-actions">
                  <button class="icon-btn" type="button" data-compare="${p.slug}" aria-pressed="false" aria-label="So sánh ${esc(p.name)}" title="So sánh"><i class="ph ph-columns" aria-hidden="true"></i></button>
                  <button class="icon-btn icon-btn-solid" type="button" data-add-cart="${p.slug}" aria-label="Thêm ${esc(p.name)} vào giỏ" title="Thêm vào giỏ"><i class="ph ph-plus" aria-hidden="true"></i></button>
                </div>
              </div>
            </div>
          </article>`;
}

function grid(opts) {
  let list = products.slice();
  if (opts.kind) list = list.filter((p) => p.kind === opts.kind);
  if (opts.series) list = list.filter((p) => p.series === opts.series);
  if (opts.new) list = list.filter((p) => p.isNew);
  if (opts.exclude) list = list.filter((p) => p.slug !== opts.exclude);
  if (opts.limit) list = list.slice(0, Number(opts.limit));
  return `<div class="card-grid${opts.class ? " " + opts.class : ""}" data-filter-target>${list.map(card).join("\n")}</div>`;
}

function storyCard(s) {
  return `<article class="story-card">
            <a class="story-media" href="${s.slug}.html" tabindex="-1" aria-hidden="true"><img src="assets/img/${s.cover}" width="1200" height="800" alt="" loading="lazy"></a>
            <p class="story-meta"><span>${esc(s.camera)}</span><span>Công thức ${esc(s.recipe)}</span></p>
            <h3><a href="${s.slug}.html">${esc(s.title)}</a></h3>
            <p class="muted">${esc(s.author)}, ${esc(s.role.toLowerCase())}</p>
          </article>`;
}

function faqList(items) {
  return `<div class="faq-list">${items
    .map((f) => `<details class="faq-item"><summary>${esc(f[0])}<i class="ph ph-plus" aria-hidden="true"></i></summary><div class="faq-answer"><p>${f[1]}</p></div></details>`)
    .join("\n")}</div>`;
}

/* Dữ liệu gọn cho giỏ hàng, so sánh (đọc bởi main.js) */
function productJson() {
  const data = products.map((p) => ({
    slug: p.slug, name: p.name, kind: p.kind, series: SERIES[p.series], type: p.type, price: p.price, img: p.colors[0][2],
    kit: p.kit || null, colors: p.colors.map((c) => c[0]),
    specs: (p.kind === "camera" ? CAM_SPECS : LENS_SPECS).map(([k, l]) => [l, p.specs[k]]),
  }));
  return `<script type="application/json" id="lk-products">${JSON.stringify(data)}</script>`;
}

function tokens(html, ctx) {
  return html.replace(/\{\{\s*([\w-]+)([^}]*)\}\}/g, (m, name, rawArgs) => {
    const opts = {};
    rawArgs.replace(/([\w-]+)="([^"]*)"/g, (_, k, v) => (opts[k] = v));
    switch (name) {
      case "crumbs": return crumbs(ctx.meta.crumbs);
      case "products": return grid(opts);
      case "count": return String(products.filter((p) => !opts.kind || p.kind === opts.kind).length);
      case "stories": return `<div class="story-grid">${stories.filter((s) => s.slug !== opts.exclude).slice(0, Number(opts.limit || 9)).map(storyCard).join("\n")}</div>`;
      case "showrooms": return `<div class="rooms">${site.showrooms.map((r, i) => `<article class="room">
            <figure class="room-media"><img src="assets/img/${r.img}" width="1200" height="800" alt="" loading="lazy"><span>0${i + 1}</span></figure>
            <div class="room-body">
              <p class="eyebrow">${esc(r.city)}</p>
              <h3>${esc(r.name)}</h3>
              <ul class="room-info">
                <li><i class="ph ph-map-pin" aria-hidden="true"></i>${esc(r.address)}</li>
                <li><i class="ph ph-clock" aria-hidden="true"></i>${esc(r.hours)}</li>
                <li><i class="ph ph-phone" aria-hidden="true"></i><a href="tel:${r.phone.replace(/\s/g, "")}">${r.phone}</a></li>
              </ul>
              <p class="muted">${esc(r.note)}</p>
              <a class="text-link" href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(r.map)}" target="_blank" rel="noopener">Chỉ đường <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a>
            </div>
          </article>`).join("\n")}</div>`;
      case "product-json": return productJson();
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

const partials = { header: read("partials/header.html"), footer: read("partials/footer.html") };

function layout(meta, body) {
  let header = partials.header;
  if (meta.nav) header = header.replace(`data-nav-key="${meta.nav}"`, `data-nav-key="${meta.nav}" data-active`);
  header = header.replace(new RegExp(`href="${meta.file}"`, "g"), `href="${meta.file}" aria-current="page"`);
  const title = meta.file === "index.html" ? meta.title : `${meta.title} | ${site.shortName}`;
  const html = `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(meta.description)}">
  <meta name="theme-color" content="#0b0b0b">
  <link rel="canonical" href="${site.url}/${meta.file === "index.html" ? "" : meta.file}">
  <meta property="og:title" content="${esc(meta.title)}">
  <meta property="og:description" content="${esc(meta.description)}">
  <meta property="og:image" content="${meta.image || "assets/img/hero-cam.jpg"}">
  <meta property="og:type" content="${meta.ogType || "website"}">
  <meta property="og:locale" content="vi_VN">${meta.noindex ? '\n  <meta name="robots" content="noindex">' : ""}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300..700&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
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
${partials.footer}
  {{product-json}}
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

const productTpl = require(path.join(SRC, "templates/product.js"));
for (const p of products) {
  const list = p.kind === "camera" ? ["Máy ảnh", "may-anh.html"] : ["Ống kính", "ong-kinh.html"];
  const meta = {
    file: `${p.slug}.html`, title: `${p.name}: ${p.tagline}`, description: p.lead, nav: p.kind === "camera" ? "may-anh" : "ong-kinh",
    image: `assets/img/${p.colors[0][2]}`, preload: `assets/img/${p.colors[0][2]}`,
    crumbs: [list, [p.name, `${p.slug}.html`]],
  };
  const specs = (p.kind === "camera" ? CAM_SPECS : LENS_SPECS).map(([k, l]) => [l, p.specs[k]]);
  write(meta.file, layout(meta, tokens(productTpl({ p, specs, series: SERIES[p.series], vnd, esc }), { meta })));
}

const storyTpl = require(path.join(SRC, "templates/story.js"));
for (const s of stories) {
  const meta = {
    file: `${s.slug}.html`, title: s.title, description: s.excerpt, nav: "cau-chuyen", ogType: "article",
    image: `assets/img/${s.cover}`, preload: `assets/img/${s.cover}`, crumbs: [["Câu chuyện", "cau-chuyen.html"], [s.title, `${s.slug}.html`]],
  };
  const cam = products.find((p) => p.name === s.camera);
  write(meta.file, layout(meta, tokens(storyTpl({ s, cam, esc, vnd }), { meta })));
}

const today = new Date().toISOString().slice(0, 10);
const urls = out.filter((f) => f !== "404.html" && f !== "gio-hang.html").map((f) => `  <url><loc>${site.url}/${f === "index.html" ? "" : f}</loc><lastmod>${today}</lastmod></url>`);
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`);
console.log(`Đã build ${out.length} trang`);
module.exports = { faqList };
