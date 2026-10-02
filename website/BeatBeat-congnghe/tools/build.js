#!/usr/bin/env node
/*
 * BeatBeat - static site builder (không phụ thuộc thư viện)
 *
 *   node tools/build.js
 *
 * - src/pages/*.html     : nội dung từng trang, dòng đầu là <!--meta {...JSON...}-->
 * - src/partials/*.html  : header, footer, ngăn giỏ hàng, tìm kiếm
 * - src/data/*.js        : sản phẩm, bài viết, thông tin chung
 * - src/templates/*.js   : trang sản phẩm, trang bài viết
 * Kết quả ghi ra thư mục gốc dự án, kèm sitemap.xml.
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const site = require(path.join(SRC, "data/site.js"));
const products = require(path.join(SRC, "data/products.js"));
const posts = require(path.join(SRC, "data/posts.js"));

const read = (p) => fs.readFileSync(path.join(SRC, p), "utf8");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const vnd = (n) => n.toLocaleString("de-DE") + "đ";
const bySlug = Object.fromEntries(products.map((p) => [p.slug, p]));
const CATS = {
  "chup-tai": ["Chụp tai", "tai-nghe", "aura-max-den.jpg"], "nhet-tai": ["Nhét tai True Wireless", "tai-nghe", "pulse-pro-den.jpg"],
  "the-thao": ["Thể thao, tai mở", "tai-nghe", "ls-chay.jpg"], gaming: ["Gaming", "tai-nghe", "clash-g7-neon.jpg"],
  "di-dong": ["Loa di động", "loa", "drop-5-xam.jpg"], tiec: ["Loa tiệc", "loa", "party-300.jpg"], "gia-dinh": ["Loa thanh, gia đình", "loa", "stage-9.jpg"],
};
const KIND_PAGE = { "tai-nghe": ["Tai nghe", "tai-nghe.html"], loa: ["Loa", "loa.html"] };
const HP_SPECS = [["driver", "Driver"], ["freq", "Dải tần"], ["anc", "Chống ồn"], ["battery", "Thời lượng pin"], ["charge", "Sạc"], ["bt", "Kết nối, codec"], ["mic", "Micro"], ["water", "Chống nước"], ["weight", "Trọng lượng"]];
const SPK_SPECS = [["power", "Công suất"], ["freq", "Dải tần"], ["battery", "Thời lượng pin"], ["water", "Chống nước"], ["bt", "Kết nối"], ["party", "Ghép loa, cổng"], ["light", "Đèn"], ["weight", "Trọng lượng"], ["size", "Kích thước"]];
const specList = (p) => (p.kind === "tai-nghe" ? HP_SPECS : SPK_SPECS).map(([k, l]) => [l, p.specs[k]]);
const discount = (p) => (p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0);
const arrow = (d = "right") => `<i class="ph ph-arrow-${d}" aria-hidden="true"></i>`;
const btnIco = (d = "up-right") => `<span class="btn-ico"><i class="ph ${d === "plus" ? "ph-plus" : "ph-arrow-" + d}" aria-hidden="true"></i></span>`;

/* Sóng âm dùng làm hoạ tiết (SVG, nhiều cột cao thấp) */
function wave(n = 48, cls = "") {
  let s = "";
  for (let i = 0; i < n; i++) {
    const h = 18 + Math.round(Math.abs(Math.sin(i * 0.55) * Math.cos(i * 0.21)) * 70 + (i % 5) * 3);
    s += `<i style="--h:${h}%;--d:${(i % 12) * 60}ms"></i>`;
  }
  return `<span class="wave ${cls}" aria-hidden="true">${s}</span>`;
}

/* ---------------------------------------------------------------- khối dựng sẵn */

function crumbs(list) {
  if (!list || !list.length) return "";
  const items = [["Trang chủ", "index.html"]].concat(list);
  return `<nav class="crumbs" aria-label="Đường dẫn trang"><ol>${items
    .map((c, i) => (i === items.length - 1 ? `<li aria-current="page">${esc(c[0])}</li>` : `<li><a href="${c[1]}">${esc(c[0])}</a></li>`))
    .join("")}</ol></nav>`;
}

function stars(r) { return `<span class="stars" style="--r:${(r / 5 * 100).toFixed(0)}%" aria-label="${r} trên 5 sao"></span>`; }
function chips(p) {
  const c = [];
  if (p.anc) c.push("Chống ồn");
  if (p.ip) c.push(p.ip);
  c.push(p.battery ? `${p.battery} giờ` : p.kind === "tai-nghe" ? "Có dây" : "Cắm điện");
  return `<ul class="card-chips">${c.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
}
function card(p) {
  const d = discount(p);
  return `<article class="card" data-kind="${p.kind}" data-cat="${p.cat}" data-price="${p.price}" data-anc="${p.anc ? 1 : 0}" data-ip="${p.ip ? 1 : 0}" data-battery="${p.battery}" data-new="${p.isNew ? 1 : 0}" data-slug="${p.slug}">
            <a class="card-media" href="${p.slug}.html" tabindex="-1" aria-hidden="true">
              ${p.colors.map((c, i) => `<img src="assets/img/${c[2]}" width="1600" height="1067" alt="" loading="lazy"${i ? "" : ' class="is-on"'} data-card-img="${i}">`).join("")}
              <span class="card-tags">${p.isNew ? '<span class="tag">Mới</span>' : ""}${d ? `<span class="tag tag-hot">-${d}%</span>` : ""}</span>
            </a>
            <div class="card-body">
              <p class="card-meta"><span>${esc(p.type)}</span><span class="card-rate">${stars(p.rating)}<span>${p.rating}</span></span></p>
              <h3><a href="${p.slug}.html">${esc(p.name.replace("BeatBeat ", ""))}</a></h3>
              ${chips(p)}
              ${p.colors.length > 1 ? `<div class="swatches" role="group" aria-label="Màu của ${esc(p.name)}">${p.colors.map((c, i) => `<button type="button" class="sw${i ? "" : " is-on"}" style="--c:${c[1]}" data-card-sw="${i}" aria-pressed="${i === 0}" aria-label="${esc(c[0])}"></button>`).join("")}</div>` : `<p class="swatch-one"><span class="sw sw-static" style="--c:${p.colors[0][1]}" aria-hidden="true"></span>${esc(p.colors[0][0])}</p>`}
              <div class="card-foot">
                <p class="card-price"><strong>${vnd(p.price)}</strong>${p.oldPrice ? `<s>${vnd(p.oldPrice)}</s>` : ""}</p>
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
  if (opts.cat) list = list.filter((p) => p.cat === opts.cat);
  if (opts.sale) list = list.filter((p) => p.oldPrice);
  if (opts.slugs) list = opts.slugs.split(",").map((s) => bySlug[s]);
  if (opts.exclude) list = list.filter((p) => p.slug !== opts.exclude);
  if (opts.limit) list = list.slice(0, Number(opts.limit));
  return `<div class="card-grid${opts.class ? " " + opts.class : ""}" data-filter-target>${list.map(card).join("\n")}</div>`;
}

function catTiles(kind) {
  return `<ul class="cat-tiles">${Object.entries(CATS).filter(([, v]) => !kind || v[1] === kind).map(([k, [name, kd, img]]) => {
    const n = products.filter((p) => p.cat === k).length;
    return `<li><a href="${KIND_PAGE[kd][1]}?loai=${k}"><img src="assets/img/${img}" width="1600" height="1067" alt="" loading="lazy"><span class="cat-name">${esc(name)}</span><span class="cat-n">${n} mẫu</span><span class="cat-go" aria-hidden="true">${arrow("up-right")}</span></a></li>`;
  }).join("")}</ul>`;
}

function filterBar(kind) {
  const cats = Object.entries(CATS).filter(([, v]) => v[1] === kind);
  return `<div class="fbar">
          <div class="fchips" role="group" aria-label="Lọc theo loại">
            <button type="button" class="fchip is-active" aria-pressed="true" data-filter-value="all">Tất cả</button>
            ${cats.map(([k, v]) => `<button type="button" class="fchip" aria-pressed="false" data-filter-value="${k}">${esc(v[0])}</button>`).join("")}
          </div>
          <div class="fopts">
            <label class="ftoggle"><input type="checkbox" data-feat="anc"${kind === "loa" ? " hidden disabled" : ""}><span${kind === "loa" ? " hidden" : ""}>Chống ồn</span></label>
            <label class="ftoggle"><input type="checkbox" data-feat="ip"><span>Chống nước</span></label>
            <label class="fsel"><span class="sr-only">Mức giá</span><select data-price-max><option value="0">Mọi mức giá</option><option value="1500000">Dưới 1,5 triệu</option><option value="3500000">Dưới 3,5 triệu</option><option value="7000000">Dưới 7 triệu</option></select></label>
            <label class="fsel"><span class="sr-only">Sắp xếp</span><select data-sort><option value="default">Nổi bật</option><option value="asc">Giá thấp đến cao</option><option value="desc">Giá cao đến thấp</option><option value="battery">Pin lâu nhất</option></select></label>
          </div>
        </div>
        <p class="fcount" data-fcount aria-live="polite"></p>`;
}

function postCard(p) {
  return `<article class="post-card">
            <a class="post-media" href="${p.slug}.html" tabindex="-1" aria-hidden="true"><img src="assets/img/${p.image}" width="1600" height="1067" alt="" loading="lazy"></a>
            <p class="post-meta"><span>${esc(p.cat)}</span><span>${p.date}</span><span>${p.read} phút đọc</span></p>
            <h3><a href="${p.slug}.html">${esc(p.title)}</a></h3>
            <p>${esc(p.excerpt)}</p>
          </article>`;
}

function faqList(items) {
  return `<div class="faq-list">${items.map((f) => `<details class="faq-item"><summary>${esc(f[0])}<i class="ph ph-plus" aria-hidden="true"></i></summary><div class="faq-answer"><p>${f[1]}</p></div></details>`).join("\n")}</div>`;
}

/* Biểu đồ thời lượng pin tai nghe */
function batteryChart(kind) {
  const list = products.filter((p) => p.kind === kind && p.battery).sort((a, b) => b.battery - a.battery);
  const max = list[0].battery;
  return `<ol class="bchart" data-bchart>${list.map((p) => `<li><a href="${p.slug}.html"><span class="bc-name">${esc(p.name.replace("BeatBeat ", ""))}</span><span class="bc-bar" style="--w:${(p.battery / max * 100).toFixed(1)}%"><span class="bc-fill"></span></span><span class="bc-h">${p.battery}<small> giờ</small></span></a></li>`).join("")}</ol>`;
}

/* Phòng nghe thử: beat tự tổng hợp bằng Web Audio, EQ theo sản phẩm, tiếng ồn + chống ồn */
function soundLab() {
  const list = products.filter((p) => p.slug !== "studio-m1");
  return `<div class="lab" data-lab>
          <div class="lab-screen">
            <canvas class="lab-canvas" width="1200" height="360" data-lab-canvas aria-hidden="true"></canvas>
            <div class="lab-idle" data-lab-idle>${wave(64, "wave-idle")}</div>
            <p class="lab-readout"><span data-lab-bpm>96 BPM</span><span data-lab-state>Đang dừng</span></p>
          </div>
          <div class="lab-panel">
            <div class="lab-row">
              <button class="lab-play" type="button" data-lab-play aria-pressed="false"><i class="ph ph-play" aria-hidden="true"></i><span>Phát beat</span></button>
              <label class="lab-field"><span>Nghe như trên</span><select data-lab-product><option value="0,0,0">Âm gốc, chưa chỉnh</option>${list.map((p) => `<option value="${p.eq.join(",")}" data-anc="${p.anc ? 1 : 0}">${esc(p.name)}</option>`).join("")}</select></label>
            </div>
            <div class="lab-eq" role="group" aria-label="Chỉnh âm">
              ${[["bass", "Trầm", "80 Hz"], ["mid", "Trung", "1 kHz"], ["treble", "Cao", "8 kHz"]].map(([k, l, f]) => `<label class="eq"><span class="eq-top"><span>${l}</span><output data-eq-out="${k}">0 dB</output></span><input type="range" min="-8" max="8" step="1" value="0" data-eq="${k}" aria-label="${l} ${f}"><span class="eq-f">${f}</span></label>`).join("")}
            </div>
            <div class="lab-row lab-noise">
              <label class="switch"><input type="checkbox" data-lab-noise><span class="switch-ui" aria-hidden="true"></span><span>Tiếng ồn đường phố</span></label>
              <label class="switch"><input type="checkbox" data-lab-anc><span class="switch-ui" aria-hidden="true"></span><span>Bật chống ồn</span></label>
              <p class="lab-db" data-lab-db aria-live="polite">Ồn xung quanh: tắt</p>
            </div>
            <p class="lab-note">Beat được tạo ngay trong trình duyệt bằng Web Audio, không phải bản thu. Chỉnh âm chỉ mô phỏng xu hướng âm thanh của từng sản phẩm; nghe thật tại cửa hàng mới chính xác. Nên đeo tai nghe và để âm lượng vừa phải.</p>
          </div>
        </div>`;
}

/* Tìm sản phẩm hợp với bạn: 4 câu hỏi */
function finder() {
  const Q = [
    ["use", "Bạn sẽ dùng nhiều nhất khi", [["di-chuyen", "Đi làm, đi máy bay", "ph-airplane-tilt"], ["tap", "Tập thể thao", "ph-person-simple-run"], ["game", "Chơi game", "ph-game-controller"], ["nha", "Nghe ở nhà, xem phim", "ph-house"], ["tiec", "Tụ tập, dã ngoại", "ph-confetti"]]],
    ["form", "Bạn thích", [["tai-nghe", "Tai nghe, nghe một mình", "ph-headphones"], ["loa", "Loa, nghe cùng mọi người", "ph-speaker-hifi"], ["", "Chưa biết, gợi ý giúp tôi", "ph-question"]]],
    ["budget", "Ngân sách", [["1500000", "Dưới 1,5 triệu", "ph-coins"], ["3500000", "Dưới 3,5 triệu", "ph-coins"], ["7000000", "Dưới 7 triệu", "ph-coins"], ["99000000", "Không giới hạn", "ph-diamond"]]],
    ["need", "Điều quan trọng nhất", [["anc", "Chống ồn", "ph-waveform"], ["pin", "Pin thật lâu", "ph-battery-full"], ["nuoc", "Chống nước", "ph-drop"], ["bass", "Bass mạnh", "ph-speaker-high"]]],
  ];
  return `<form class="finder" data-finder novalidate>
          <div class="finder-progress" aria-hidden="true"><span data-finder-bar></span></div>
          ${Q.map(([name, q, opts], i) => `<fieldset class="fq" data-step="${i}"${i ? " hidden" : ""}>
            <legend><span class="fq-n">${i + 1}/${Q.length}</span>${esc(q)}</legend>
            <div class="fq-opts">${opts.map(([v, l, ic]) => `<label class="fq-opt"><input type="radio" name="${name}" value="${v}"><span><i class="ph ${ic}" aria-hidden="true"></i>${esc(l)}</span></label>`).join("")}</div>
            ${i ? '<button class="text-link fq-back" type="button" data-finder-back><i class="ph ph-arrow-left" aria-hidden="true"></i>Câu trước</button>' : ""}
          </fieldset>`).join("")}
          <div class="finder-result" data-finder-result hidden tabindex="-1">
            <p class="eyebrow">Hợp với bạn nhất</p>
            <div class="finder-cards" data-finder-cards></div>
            <button class="btn btn-ghost" type="button" data-finder-again>Làm lại</button>
          </div>
        </form>`;
}

/* Dữ liệu gọn cho giỏ hàng, so sánh, tìm kiếm, gợi ý (đọc bởi main.js) */
function productJson() {
  const data = products.map((p) => ({
    slug: p.slug, name: p.name, kind: p.kind, cat: p.cat, type: p.type, price: p.price, oldPrice: p.oldPrice || 0,
    img: p.colors[0][2], colors: p.colors.map((c) => [c[0], c[2]]), battery: p.battery, anc: p.anc, ip: p.ip, eq: p.eq, rating: p.rating,
    specs: specList(p),
  }));
  return `<script type="application/json" id="bb-products">${JSON.stringify(data)}</script>`;
}

function tokens(html, ctx) {
  return html.replace(/\{\{\s*([\w-]+)([^}]*)\}\}/g, (m, name, rawArgs) => {
    const opts = {};
    rawArgs.replace(/([\w-]+)="([^"]*)"/g, (_, k, v) => (opts[k] = v));
    switch (name) {
      case "crumbs": return crumbs(ctx.meta.crumbs);
      case "products": return grid(opts);
      case "count": return String(products.filter((p) => !opts.kind || p.kind === opts.kind).length);
      case "cat-tiles": return catTiles(opts.kind);
      case "filter-bar": return filterBar(opts.kind);
      case "battery-chart": return batteryChart(opts.kind || "tai-nghe");
      case "sound-lab": return soundLab();
      case "finder": return finder();
      case "wave": return wave(Number(opts.n || 48), opts.class || "");
      case "posts": return `<div class="post-grid">${posts.filter((p) => p.slug !== opts.exclude).slice(0, Number(opts.limit || 9)).map(postCard).join("\n")}</div>`;
      case "faq": return faqList(JSON.parse(opts.items.replace(/'/g, '"')));
      case "stores": return `<div class="stores">${site.stores.map((r, i) => `<article class="store">
            <figure class="store-media"><img src="assets/img/${r.img}" width="1600" height="1067" alt="" loading="lazy"><span>0${i + 1}</span></figure>
            <div class="store-body">
              <p class="eyebrow">${esc(r.city)}</p>
              <h3>${esc(r.name)}</h3>
              <ul class="store-info">
                <li><i class="ph ph-map-pin" aria-hidden="true"></i>${esc(r.address)}</li>
                <li><i class="ph ph-clock" aria-hidden="true"></i>${esc(r.hours)} mỗi ngày</li>
                <li><i class="ph ph-phone" aria-hidden="true"></i><a href="tel:${r.phone.replace(/\s/g, "")}">${r.phone}</a></li>
              </ul>
              <p class="muted">${esc(r.note)}</p>
              <a class="text-link" href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(r.address)}" target="_blank" rel="noopener">Chỉ đường <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a>
            </div>
          </article>`).join("\n")}</div>`;
      case "product-options": return products.map((p) => `<option value="${esc(p.name)}">${esc(p.name)}</option>`).join("");
      case "hotline": return site.hotline;
      case "hotline-tel": return site.hotlineTel;
      case "email": return site.email;
      case "hours": return site.hours;
      case "zalo": return site.zalo;
      case "facebook": return site.facebook;
      case "instagram": return site.instagram;
      case "youtube": return site.youtube;
      case "tiktok": return site.tiktok;
      case "legal": return site.legal;
      default: return m;
    }
  });
}

/* ---------------------------------------------------------------- layout */

const partials = { header: read("partials/header.html"), footer: read("partials/footer.html"), drawer: read("partials/drawer.html") };

function layout(meta, body) {
  let header = partials.header;
  if (meta.nav) header = header.replace(new RegExp(`data-nav-key="${meta.nav}"`, "g"), `data-nav-key="${meta.nav}" data-active`);
  header = header.replace(new RegExp(`href="${meta.file}"`, "g"), `href="${meta.file}" aria-current="page"`);
  const title = meta.file === "index.html" ? meta.title : `${meta.title} | ${site.shortName}`;
  const html = `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(meta.description)}">
  <meta name="theme-color" content="#0b0b0c">
  <meta name="color-scheme" content="dark">
  <link rel="canonical" href="${site.url}/${meta.file === "index.html" ? "" : meta.file}">
  <meta property="og:title" content="${esc(meta.title)}">
  <meta property="og:description" content="${esc(meta.description)}">
  <meta property="og:image" content="${meta.image || "assets/img/hero-tai-nghe.jpg"}">
  <meta property="og:type" content="${meta.ogType || "website"}">
  <meta property="og:locale" content="vi_VN">${meta.noindex ? '\n  <meta name="robots" content="noindex">' : ""}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400..800&family=Onest:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
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
${partials.drawer}
${productJson()}
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

const productTpl = require(path.join(SRC, "templates/product.js"));
for (const p of products) {
  const [kname, kfile] = KIND_PAGE[p.kind];
  const meta = {
    file: `${p.slug}.html`, title: `${p.name}: ${p.type}`, description: p.lead, nav: p.kind,
    image: `assets/img/${p.colors[0][2]}`, preload: `assets/img/${p.colors[0][2]}`,
    crumbs: [[kname, kfile], [p.name, `${p.slug}.html`]],
  };
  const related = posts.filter((x) => x.related.includes(p.slug));
  const others = products.filter((x) => x.kind === p.kind && x.slug !== p.slug).slice(0, 4).map((x) => x.slug).join(",");
  write(meta.file, layout(meta, tokens(productTpl({ p, specList, vnd, esc, discount, stars, arrow, btnIco, related, others, cat: CATS[p.cat][0], wave }), { meta })));
}

const postTpl = require(path.join(SRC, "templates/post.js"));
for (const p of posts) {
  const meta = {
    file: `${p.slug}.html`, title: p.title, description: p.excerpt, nav: "bai-viet", ogType: "article",
    image: `assets/img/${p.image}`, crumbs: [["Hướng dẫn chọn mua", "bai-viet.html"], [p.title, `${p.slug}.html`]],
  };
  write(meta.file, layout(meta, tokens(postTpl({ p, esc }), { meta })));
}

const today = new Date().toISOString().slice(0, 10);
const urls = out.filter((f) => !["404.html", "gio-hang.html"].includes(f)).map((f) => `  <url><loc>${site.url}/${f === "index.html" ? "" : f}</loc><lastmod>${today}</lastmod></url>`);
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`);
console.log(`Đã build ${out.length} trang:\n  ` + out.join("\n  "));
