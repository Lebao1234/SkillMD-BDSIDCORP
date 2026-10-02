#!/usr/bin/env node
/*
 * BBE English - static site builder (không phụ thuộc thư viện)
 *
 *   node tools/build.js
 *
 * - src/pages/*.html      : nội dung từng trang, dòng đầu là <!--meta {...JSON...}-->
 * - src/partials/*.html   : header, footer, form đăng ký dùng chung
 * - src/data/*.js         : khóa học, lịch khai giảng, bài viết, thông tin chung
 * Kết quả ghi ra thư mục gốc dự án (index.html, khoa-hoc.html, ...).
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const site = require(path.join(SRC, "data/site.js"));
const courses = require(path.join(SRC, "data/courses.js"));
const schedule = require(path.join(SRC, "data/schedule.js"));
const posts = require(path.join(SRC, "data/posts.js"));

const read = (p) => fs.readFileSync(path.join(SRC, p), "utf8");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ---------------------------------------------------------------- helpers */

function crumbs(list) {
  if (!list || !list.length) return "";
  const items = [["Trang chủ", "index.html"]].concat(list);
  return `<nav class="crumbs" aria-label="Đường dẫn trang"><ol>${items
    .map((c, i) =>
      i === items.length - 1
        ? `<li aria-current="page">${esc(c[0])}</li>`
        : `<li><a href="${c[1]}">${esc(c[0])}</a></li>`
    )
    .join("")}</ol></nav>`;
}

function classCard(c) {
  const low = c.seats <= 3 ? " seats-low" : "";
  const seatText = c.seats > 0 ? `Còn ${c.seats} chỗ` : "Đã đủ lớp";
  const btn =
    c.seats > 0
      ? `<button class="btn btn-outline btn-sm" type="button" data-pick-class="${esc(c.label)}" data-course-index="${courses.findIndex((x) => x.key === c.cat) + 1}">Chọn lớp này</button>`
      : `<button class="btn btn-outline btn-sm" type="button" disabled>Đã đủ lớp</button>`;
  return `<article class="class-card" data-category="${c.cat}" data-branch="${c.branchKey}">
            <div class="class-top"><span class="class-code">${c.code}</span><span class="seats${low}">${seatText}</span></div>
            <h3>${esc(c.name)}</h3>
            <ul class="class-info">
              <li><i class="ph ph-calendar-blank" aria-hidden="true"></i>Khai giảng ${c.start}</li>
              <li><i class="ph ph-clock" aria-hidden="true"></i>${c.time}</li>
              <li><i class="ph ph-map-pin" aria-hidden="true"></i>${c.branch}</li>
            </ul>
            ${btn}
          </article>`;
}

function scheduleGrid(opts) {
  let list = schedule;
  if (opts.category) list = list.filter((c) => c.cat === opts.category);
  if (opts.limit) list = list.slice(0, Number(opts.limit));
  return `<div class="class-grid" data-filter-target>${list.map(classCard).join("\n")}</div>`;
}

function postCard(p, featured) {
  return `<article class="post-card${featured ? " post-featured" : ""}" data-category="${p.catKey}">
            <a class="post-media" href="${p.slug}.html" tabindex="-1" aria-hidden="true"><img src="assets/img/${p.image}" width="1000" height="667" alt="" loading="lazy"></a>
            <div class="post-body">
              <p class="post-meta"><span class="post-cat">${esc(p.cat)}</span><span>${p.date}</span><span>${p.read} phút đọc</span></p>
              <h3><a href="${p.slug}.html">${esc(p.title)}</a></h3>
              <p>${esc(p.excerpt)}</p>
            </div>
          </article>`;
}

function postsGrid(opts) {
  let list = posts.slice();
  if (opts.exclude) list = list.filter((p) => p.slug !== opts.exclude);
  if (opts.skip) list = list.slice(Number(opts.skip));
  if (opts.limit) list = list.slice(0, Number(opts.limit));
  return `<div class="post-grid" data-filter-target>${list.map((p) => postCard(p)).join("\n")}</div>`;
}

function postLead(p) {
  return `<article class="post-lead">
          <a class="post-media" href="${p.slug}.html" tabindex="-1" aria-hidden="true"><img src="assets/img/${p.image}" width="1000" height="667" alt="" loading="lazy"></a>
          <div>
            <p class="post-meta"><span class="post-cat">${esc(p.cat)}</span><span>${p.date}</span><span>${p.read} phút đọc</span></p>
            <h2><a href="${p.slug}.html">${esc(p.title)}</a></h2>
            <p class="excerpt">${esc(p.excerpt)}</p>
            <a class="text-link" href="${p.slug}.html">Đọc bài viết <i class="ph ph-arrow-right" aria-hidden="true"></i></a>
          </div>
        </article>`;
}

function courseCard(c) {
  return `<article class="course-card" data-category="${c.audience}">
            <a class="course-media" href="${c.slug}.html" tabindex="-1" aria-hidden="true"><img src="assets/img/${c.image}" width="1200" height="800" alt="" loading="lazy" style="object-position:${c.imagePos || "50% 50%"}"></a>
            <div class="course-body">
              <p class="course-age"><i class="ph ${c.icon}" aria-hidden="true"></i>${esc(c.age)}</p>
              <h3><a href="${c.slug}.html">${esc(c.name)}</a></h3>
              <p>${esc(c.cardText)}</p>
              <dl class="course-meta">
                <div><dt>Thời lượng</dt><dd>${esc(c.meta.duration)}</dd></div>
                <div><dt>Học phí</dt><dd>${esc(c.meta.fee)}</dd></div>
              </dl>
              <a class="text-link" href="${c.slug}.html">Xem chi tiết khóa học <i class="ph ph-arrow-right" aria-hidden="true"></i></a>
            </div>
          </article>`;
}

function faqList(items, openFirst) {
  return `<div class="faq-list">${items
    .map(
      (f, i) => `<details class="faq-item"${openFirst && i === 0 ? " open" : ""}>
            <summary>${esc(f.q)}<i class="ph ph-plus" aria-hidden="true"></i></summary>
            <p>${f.a}</p>
          </details>`
    )
    .join("\n")}</div>`;
}

/* Thay các token {{...}} trong nội dung trang */
function tokens(html, ctx) {
  return html.replace(/\{\{\s*([\w-]+)([^}]*)\}\}/g, (m, name, rawArgs) => {
    const opts = {};
    rawArgs.replace(/([\w-]+)="([^"]*)"/g, (_, k, v) => (opts[k] = v));
    switch (name) {
      case "crumbs": return crumbs(ctx.meta.crumbs);
      case "schedule": return scheduleGrid(opts);
      case "posts": return postsGrid(opts);
      case "post-lead": return postLead(posts[0]);
      case "courses": return `<div class="course-grid" data-filter-target>${courses.map(courseCard).join("\n")}</div>`;
      case "course-options": return courseOptions();
      case "hotline": return site.hotline;
      case "hotline-tel": return site.hotlineTel;
      case "email": return site.email;
      case "year": return String(new Date().getFullYear());
      default: return m;
    }
  });
}

function courseOptions() {
  return ['<option value="">Chọn khóa học</option>']
    .concat(courses.map((c) => `<option>${esc(c.formLabel)}</option>`))
    .concat(["<option>Chưa rõ, cần tư vấn</option>"])
    .join("");
}

/* ---------------------------------------------------------------- layout */

const partials = {
  header: read("partials/header.html"),
  footer: read("partials/footer.html"),
  cta: read("partials/cta.html"),
};

function layout(meta, body) {
  let header = partials.header;
  // Đánh dấu mục menu đang mở
  if (meta.nav) header = header.replace(`data-nav-key="${meta.nav}"`, `data-nav-key="${meta.nav}" data-active`);
  header = header.replace(new RegExp(`href="${meta.file}"`, "g"), `href="${meta.file}" aria-current="page"`);

  const cta = meta.cta === false ? "" : partials.cta;
  const title = meta.file === "index.html" ? meta.title : `${meta.title} | ${site.shortName}`;
  const ogImage = meta.image || "assets/img/hero-lop-giao-tiep.jpg";
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
  <meta property="og:image" content="${ogImage}">
  <meta property="og:type" content="${meta.ogType || "website"}">
  <meta property="og:locale" content="vi_VN">${meta.noindex ? '\n  <meta name="robots" content="noindex">' : ""}

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300..700&family=Noto+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
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
  // Trang không có form đăng ký: nút CTA dẫn sang trang liên hệ
  const finalHtml = !cta && !body.includes('id="dang-ky"') ? html.replace(/href="#dang-ky"/g, 'href="lien-he.html#dang-ky"') : html;
  return tokens(finalHtml, { meta }).replace(/class="ph /g, 'class="ph-light ');
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

// 1) Trang viết tay
for (const file of fs.readdirSync(path.join(SRC, "pages")).filter((f) => f.endsWith(".html"))) {
  const { meta, body } = parsePage(file);
  write(file, layout(meta, tokens(body, { meta })));
}

// 2) Trang chi tiết khóa học (từ src/data/courses.js)
const courseTpl = require(path.join(SRC, "templates/course.js"));
for (const c of courses) {
  const meta = {
    file: `${c.slug}.html`,
    title: c.seoTitle,
    description: c.lead,
    nav: "khoa-hoc",
    image: `assets/img/${c.image}`,
    preload: `assets/img/${c.image}`,
    crumbs: [["Khóa học", "khoa-hoc.html"], [c.name, `${c.slug}.html`]],
  };
  const related = courses.filter((x) => x.slug !== c.slug).slice(0, 3);
  const body = courseTpl({ c, related, crumbs, scheduleGrid, faqList, courseCard, esc });
  write(meta.file, layout(meta, tokens(body, { meta })));
}

// 3) Bài viết (từ src/data/posts.js)
const postTpl = require(path.join(SRC, "templates/post.js"));
for (const p of posts) {
  const meta = {
    file: `${p.slug}.html`,
    title: p.title,
    description: p.excerpt,
    nav: "tai-nguyen",
    ogType: "article",
    image: `assets/img/${p.image}`,
    crumbs: [["Tin tức & bài học", "tin-tuc.html"], [p.title, `${p.slug}.html`]],
  };
  const body = postTpl({ p, crumbs, postsGrid, esc });
  write(meta.file, layout(meta, tokens(body, { meta })));
}

// 4) sitemap.xml
const today = new Date().toISOString().slice(0, 10);
const urls = out.filter((f) => f !== "404.html").map((f) => `  <url><loc>${site.url}/${f === "index.html" ? "" : f}</loc><lastmod>${today}</lastmod></url>`);
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`);

console.log(`Đã build ${out.length} trang:\n  ` + out.join("\n  "));
