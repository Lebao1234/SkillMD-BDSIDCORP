#!/usr/bin/env node
/*
 * Cơ khí VN - NIKKO - static site builder (không phụ thuộc thư viện)
 *
 *   node tools/build.js
 *
 * - src/pages/*.html     : nội dung từng trang, dòng đầu là <!--meta {...JSON...}-->
 * - src/partials/*.html  : header, footer, khối báo giá cuối trang
 * - src/data/*.js        : lĩnh vực, sản phẩm, vật liệu, bài viết, thông tin công ty
 * - src/templates/*.js   : trang lĩnh vực, trang bài viết
 * Kết quả ghi ra thư mục gốc dự án, kèm sitemap.xml.
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const site = require(path.join(SRC, "data/site.js"));
const services = require(path.join(SRC, "data/services.js"));
const products = require(path.join(SRC, "data/products.js"));
const { SEG, MAT } = products;
const segments = require(path.join(SRC, "data/segments.js"));
const materials = require(path.join(SRC, "data/materials.js"));
const posts = require(path.join(SRC, "data/posts.js"));
const i18n = require("./i18n.js");

/* Ngôn ngữ: tiếng Việt ở thư mục gốc, các tiếng khác ở thư mục con, bản dịch ở src/i18n/<mã>.json */
const LANGS = [
  { code: "vi", dir: "", label: "Tiếng Việt", short: "VI", locale: "vi_VN", aria: "Ngôn ngữ" },
  { code: "en", dir: "en", label: "English", short: "EN", locale: "en_US", aria: "Language" },
  { code: "ja", dir: "ja", label: "日本語", short: "JA", locale: "ja_JP", aria: "言語", font: "Noto+Sans+JP:wght@400;500;600;700" },
  { code: "ko", dir: "ko", label: "한국어", short: "KO", locale: "ko_KR", aria: "언어", font: "Noto+Sans+KR:wght@400;500;600;700" },
];
const EXTRACT = process.argv.includes("--extract");

const read = (p) => fs.readFileSync(path.join(SRC, p), "utf8");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const arrow = (d = "right") => `<i class="ph ph-arrow-${d}" aria-hidden="true"></i>`;
const btnIco = (d = "up-right") => `<span class="btn-ico"><i class="ph ph-arrow-${d}" aria-hidden="true"></i></span>`;

/* Quy trình 7 bước, dùng ở trang chủ và trang năng lực */
const PROCESS = [
  ["Tiếp nhận yêu cầu", "Ngày 0", "Nhận bản vẽ, hàng mẫu, ảnh chụp hoặc bản phác tay. Kỹ sư hỏi rõ vật liệu, số lượng, nơi sử dụng.", "ky-su-ban.jpg"],
  ["Khảo sát, đo đạc", "Khi cần", "Đến công trình hoặc nhà xưởng đo thực tế với lan can, cầu thang, kệ kho, hàng 5S.", "do-khung.jpg"],
  ["Báo giá, bản vẽ", "Trong 24 giờ", "Báo giá kèm bản vẽ hoặc phương án gia công, vật liệu và lớp hoàn thiện để khách duyệt.", "do-dac.jpg"],
  ["Làm mẫu đầu tiên", "2 - 5 ngày", "Với hàng loạt, làm một sản phẩm mẫu để khách kiểm tra kích thước và độ hoàn thiện.", "cat-laser.jpg"],
  ["Sản xuất", "Theo số lượng", "Cắt laser, chấn gấp, hàn, tiện phay theo bản vẽ đã duyệt.", "han-tig.jpg"],
  ["Hoàn thiện bề mặt", "1 - 3 ngày", "Mài, đánh xước, đánh bóng inox; sơn tĩnh điện hoặc mạ kẽm hàng sắt.", "mai-bavia.jpg"],
  ["Kiểm tra, giao, lắp đặt", "1 ngày", "Kiểm tra kích thước, mối hàn, bề mặt. Đóng gói, giao tận nơi và lắp đặt khi có yêu cầu.", "thep-hinh.jpg"],
];

/* Thiết bị (DỮ LIỆU MẪU cho bản demo) */
const EQUIP = [
  ["Cắt", "Máy cắt laser fiber, bàn 1.500 x 3.000 mm", "2"], ["Cắt", "Máy cắt tôn thủy lực 3.200 mm", "1"], ["Cắt", "Máy cắt ống, cưa vòng", "3"],
  ["Chấn, uốn", "Máy chấn CNC 100 tấn, dài 3.200 mm", "2"], ["Chấn, uốn", "Máy uốn ống, máy lốc tôn", "2"], ["Hàn", "Máy hàn TIG inox", "8"],
  ["Hàn", "Máy hàn MIG/CO2", "6"], ["Hàn", "Máy hàn laser cầm tay", "1"], ["Gia công", "Máy tiện CNC, tiện vạn năng", "4"],
  ["Gia công", "Máy phay, máy khoan cần", "4"], ["Hoàn thiện", "Máy đánh xước, đánh bóng inox", "4"], ["Hoàn thiện", "Buồng phun sơn tĩnh điện, lò sấy", "1"],
];

/* ---------------------------------------------------------------- khối dựng sẵn */

function crumbs(list) {
  if (!list || !list.length) return "";
  const items = [["Trang chủ", "index.html"]].concat(list);
  return `<nav class="crumbs" aria-label="Đường dẫn trang"><ol>${items
    .map((c, i) => (i === items.length - 1 ? `<li aria-current="page">${esc(c[0])}</li>` : `<li><a href="${c[1]}">${esc(c[0])}</a></li>`))
    .join("")}</ol></nav>`;
}
/* Nhãn kiểu ký hiệu bản vẽ: [NK-01] Tên */
function tag(code, text) { return `<p class="eyebrow">${esc(text)}</p>`; }

function servicePanels() {
  return `<ol class="panels">${services.map((s, i) => `<li class="panel${i ? "" : " is-open"}">
            <a href="${s.slug}.html">
              <img src="assets/img/${s.image}" width="1600" height="1067" alt="" loading="lazy">
                            <span class="panel-body">
                <span class="panel-name">${esc(s.name)}</span>
                <span class="panel-short">${esc(s.short)}</span>
                <span class="panel-go">Xem năng lực ${arrow("up-right")}</span>
              </span>
            </a>
          </li>`).join("")}</ol>`;
}
function serviceCards() {
  return `<div class="fields">${services.map((s) => `<article class="field-card reveal">
            <a href="${s.slug}.html">
              <figure><img src="assets/img/${s.image}" width="1600" height="1067" alt="" loading="lazy"></figure>
              <div class="field-body">
                <span class="field-no">${s.no}</span>
                <h3>${esc(s.name)}</h3>
                <p>${esc(s.short)}.</p>
                <span class="field-go">Xem chi tiết ${arrow()}</span>
              </div>
            </a>
          </article>`).join("")}</div>`;
}
function segmentCards() {
  return `<div class="segs">${segments.map((g, i) => `<article class="seg-card reveal">
            <a href="san-pham.html?nhom=${g.key}">
              <figure><img src="assets/img/${g.image}" width="1600" height="1067" alt="" loading="lazy"></figure>
              <div class="seg-body">
                <span class="seg-no">0${i + 1}</span>
                <h3>${esc(g.name)}</h3>
                <p>${esc(g.short)}.</p>
                <span class="seg-go">Xem sản phẩm ${arrow()}</span>
              </div>
            </a>
          </article>`).join("")}</div>`;
}
function productFilters() {
  const chips = (key, label, map) => `<div class="fchips" role="group" aria-label="Lọc theo ${label.toLowerCase()}"><span class="fbar-k">${label}</span><button type="button" class="fchip is-active" aria-pressed="true" data-filter="${key}" data-filter-value="all">Tất cả</button>${Object.entries(map).map(([k, v]) => `<button type="button" class="fchip" aria-pressed="false" data-filter="${key}" data-filter-value="${k}">${esc(v)}</button>`).join("")}</div>`;
  return `<div class="fbar">${chips("seg", "Nhóm", SEG)}${chips("mat", "Vật liệu", MAT)}</div>`;
}
function serviceRows() {
  return `<ol class="srows">${services.map((s) => `<li><a href="${s.slug}.html"><span class="sr-code">${s.no}</span><span class="sr-name">${esc(s.name)}</span><span class="sr-short">${esc(s.short)}</span><span class="sr-go" aria-hidden="true">${arrow("up-right")}</span></a></li>`).join("")}</ol>`;
}

function productCard(p) {
  return `<article class="pcard reveal" data-seg="${p.seg}" data-mat="${p.mat}">
            <figure class="pcard-media"><img src="assets/img/${p.img}" width="1600" height="1067" alt="${esc(p.name)}" loading="lazy"></figure>
            <div class="pcard-body">
              <p class="pcard-meta"><span>${esc(SEG[p.seg])}</span><span>${esc(MAT[p.mat])}</span></p>
              <h3>${esc(p.name)}</h3>
              <p class="pcard-spec">${esc(p.spec)}</p>
              <p class="pcard-note">${esc(p.note)}</p>
              <a class="text-link" href="bao-gia.html?sp=${encodeURIComponent(p.code)}">Hỏi giá chi tiết tương tự ${arrow()}</a>
            </div>
          </article>`;
}
function productGrid(opts) {
  let list = products.slice();
  if (opts.pick) list = opts.pick.split(",").map((c) => products.find((p) => p.code === c.trim())).filter(Boolean);
  if (opts.limit) list = list.slice(0, Number(opts.limit));
  return `<div class="pgrid${opts.class ? " " + opts.class : ""}" data-filter-target>${list.map(productCard).join("")}</div>`;
}

function materialTable() {
  return `<div class="table-wrap" tabindex="0" role="region" aria-label="Bảng vật liệu">
          <table class="mtable">
            <thead><tr><th scope="col">Nhóm</th><th scope="col">Mác</th><th scope="col">Tiêu chuẩn</th><th scope="col">Tương đương</th><th scope="col" class="num">Độ bền kéo (MPa)</th><th scope="col" class="num">Độ giãn dài (%)</th><th scope="col" class="num">Độ cứng (HB)</th><th scope="col" class="num">Khối lượng riêng (g/cm³)</th><th scope="col">Ứng dụng</th></tr></thead>
            <tbody>${materials.map((m) => `<tr data-group="${esc(m.group)}"><td>${esc(m.group)}</td><th scope="row">${esc(m.name)}</th><td>${esc(m.std)}</td><td>${esc(m.alt)}</td><td class="num">${esc(m.ts)}</td><td class="num">${esc(m.el)}</td><td class="num">${esc(m.hb)}</td><td class="num">${String(m.rho).replace(".", ",")}</td><td>${esc(m.use)}</td></tr>`).join("")}</tbody>
          </table>
        </div>`;
}

/* Công cụ tính khối lượng phôi */
function weightCalc() {
  return `<form class="wcalc" data-wcalc novalidate>
          <div class="wcalc-in">
            <fieldset class="field">
              <legend>Hình dạng phôi</legend>
              <div class="shapes">
                <label class="shape"><input type="radio" name="shape" value="tron" checked><span><svg viewBox="0 0 48 32" aria-hidden="true"><ellipse cx="10" cy="16" rx="6" ry="12"/><path d="M10 4h28M10 28h28"/><ellipse cx="38" cy="16" rx="6" ry="12"/></svg>Thanh tròn đặc</span></label>
                <label class="shape"><input type="radio" name="shape" value="ong"><span><svg viewBox="0 0 48 32" aria-hidden="true"><ellipse cx="10" cy="16" rx="6" ry="12"/><ellipse cx="10" cy="16" rx="3" ry="6"/><path d="M10 4h28M10 28h28"/><ellipse cx="38" cy="16" rx="6" ry="12"/></svg>Ống</span></label>
                <label class="shape"><input type="radio" name="shape" value="khoi"><span><svg viewBox="0 0 48 32" aria-hidden="true"><path d="M6 10h28v18H6zM6 10l8-6h28l-8 6M42 4v18l-8 6"/></svg>Tấm, khối</span></label>
              </div>
            </fieldset>
            <div class="field"><label for="w-mat">Vật liệu</label><select id="w-mat" name="mat">${materials.map((m, i) => `<option value="${m.rho}"${m.key === "s45c" ? " selected" : ""}>${esc(m.group)} ${esc(m.name)} (${String(m.rho).replace(".", ",")} g/cm³)</option>`).join("")}</select></div>
            <div class="dims">
              <div class="field" data-dim="d"><label for="w-d">Đường kính ngoài D (mm)</label><input id="w-d" name="d" type="number" min="0" step="0.1" value="80" inputmode="decimal"></div>
              <div class="field" data-dim="di" hidden><label for="w-di">Đường kính trong d (mm)</label><input id="w-di" name="di" type="number" min="0" step="0.1" value="40" inputmode="decimal"></div>
              <div class="field" data-dim="a" hidden><label for="w-a">Rộng (mm)</label><input id="w-a" name="a" type="number" min="0" step="0.1" value="200" inputmode="decimal"></div>
              <div class="field" data-dim="b" hidden><label for="w-b">Dày (mm)</label><input id="w-b" name="b" type="number" min="0" step="0.1" value="20" inputmode="decimal"></div>
              <div class="field"><label for="w-l">Dài L (mm)</label><input id="w-l" name="l" type="number" min="0" step="1" value="500" inputmode="decimal"></div>
              <div class="field"><label for="w-q">Số lượng</label><input id="w-q" name="q" type="number" min="1" step="1" value="1" inputmode="numeric"></div>
            </div>
          </div>
          <div class="wcalc-out" aria-live="polite">
            <p class="wcalc-k">Khối lượng mỗi chiếc</p>
            <p class="wcalc-big" data-w-one>19,72 kg</p>
            <p class="wcalc-sub">Tổng <strong data-w-all>19,72 kg</strong></p>
            <p class="wcalc-rule" data-w-rule>V = π × D² / 4 × L</p>
            <p class="wcalc-err" data-w-err hidden role="alert"></p>
          </div>
        </form>`;
}

function processRail() {
  return `<div class="proc" data-proc>
          <div class="proc-media" aria-hidden="true">${PROCESS.map((s, i) => `<img src="assets/img/${s[3]}" width="1600" height="1067" alt="" loading="lazy"${i ? "" : ' class="is-on"'}>`).join("")}<span class="proc-count"><b data-proc-n>01</b>/0${PROCESS.length}</span></div>
          <ol class="proc-steps">${PROCESS.map(([t, time, d], i) => `<li class="proc-step${i ? "" : " is-on"}" data-i="${i}"><span class="ps-n">${String(i + 1).padStart(2, "0")}</span><div><p class="ps-time">${esc(time)}</p><h3>${esc(t)}</h3><p>${esc(d)}</p></div></li>`).join("")}</ol>
        </div>`;
}

function equipTable() {
  return `<div class="table-wrap" tabindex="0" role="region" aria-label="Danh mục thiết bị"><table class="etable"><thead><tr><th scope="col">Khâu</th><th scope="col">Thiết bị</th><th scope="col" class="num">Số lượng</th></tr></thead><tbody>${EQUIP.map(([g, n, q]) => `<tr><td>${esc(g)}</td><th scope="row">${esc(n)}</th><td class="num">${q}</td></tr>`).join("")}</tbody></table></div>`;
}

function postCard(p) {
  return `<article class="post-card reveal">
            <a class="post-media" href="${p.slug}.html" tabindex="-1" aria-hidden="true"><img src="assets/img/${p.image}" width="1600" height="1067" alt="" loading="lazy"></a>
            <p class="post-meta"><span>${esc(p.cat)}</span><span>${p.date}</span><span>${p.read} phút đọc</span></p>
            <h3><a href="${p.slug}.html">${esc(p.title)}</a></h3>
            <p>${esc(p.excerpt)}</p>
          </article>`;
}

function faqList(items) {
  return `<div class="faq-list">${items.map((f) => `<details class="faq-item"><summary>${esc(f[0])}<i class="ph ph-plus" aria-hidden="true"></i></summary><div class="faq-answer"><p>${f[1]}</p></div></details>`).join("\n")}</div>`;
}

/* Thẻ thông tin pháp lý của công ty */
function companyCard() {
  return `<dl class="company">
          <div><dt>Tên doanh nghiệp</dt><dd>${esc(site.nameUpper)}</dd></div>
          <div><dt>Mã số thuế</dt><dd class="mono">${esc(site.taxCode)}</dd></div>
          <div><dt>Địa chỉ</dt><dd>${esc(site.address)}</dd></div>
          <div><dt>Ngành nghề chính</dt><dd><ul>${site.industries.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></dd></div>
        </dl>`;
}

/* Form yêu cầu báo giá */
function rfqForm(id, opts = {}) {
  const f = (n) => `${id}-${n}`;
  return `<form class="rfq" data-form novalidate${opts.endpoint ? ` data-endpoint="${opts.endpoint}"` : ""}>
          <div data-form-body>
            <div class="form-grid">
              <div class="field"><label for="${f("name")}">Họ và tên <span aria-hidden="true">*</span></label><input id="${f("name")}" name="name" autocomplete="name" required aria-describedby="${f("name")}-e"><p class="error" id="${f("name")}-e" aria-live="polite"></p></div>
              <div class="field"><label for="${f("company")}">Công ty</label><input id="${f("company")}" name="company" autocomplete="organization"></div>
              <div class="field"><label for="${f("phone")}">Số điện thoại <span aria-hidden="true">*</span></label><input id="${f("phone")}" name="phone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="0912 345 678" aria-describedby="${f("phone")}-e"><p class="error" id="${f("phone")}-e" aria-live="polite"></p></div>
              <div class="field"><label for="${f("email")}">Email</label><input id="${f("email")}" name="email" type="email" autocomplete="email" aria-describedby="${f("email")}-e"><p class="error" id="${f("email")}-e" aria-live="polite"></p></div>
              <div class="field"><label for="${f("service")}">Hạng mục</label><select id="${f("service")}" name="service"><optgroup label="Sản phẩm">${segments.map((g) => `<option data-key="${g.key}">${esc(g.name)}</option>`).join("")}</optgroup><optgroup label="Lĩnh vực">${services.map((s) => `<option data-key="${s.slug}">${esc(s.name)}</option>`).join("")}</optgroup><option>Chưa rõ, cần kỹ sư tư vấn</option></select></div>
              <div class="field"><label for="${f("mat")}">Vật liệu</label><select id="${f("mat")}" name="material"><option value="">Theo bản vẽ</option>${materials.map((m) => `<option>${esc(m.group)} ${esc(m.name)}</option>`).join("")}<option>Khác</option></select></div>
              <div class="field"><label for="${f("qty")}">Số lượng</label><input id="${f("qty")}" name="qty" type="number" min="1" inputmode="numeric" placeholder="Ví dụ 200" aria-describedby="${f("qty")}-e"><p class="error" id="${f("qty")}-e" aria-live="polite"></p></div>
              <div class="field"><label for="${f("date")}">Cần hàng trước ngày</label><input id="${f("date")}" name="date" type="date"></div>
            </div>
            <div class="field drop-zone" data-drop>
              <label for="${f("file")}"><i class="ph ph-file-arrow-up" aria-hidden="true"></i><span><strong>Đính kèm bản vẽ</strong> PDF, DWG, DXF, STEP, ảnh mẫu. Tối đa 5 tệp, mỗi tệp 20 MB.</span></label>
              <input id="${f("file")}" name="files" type="file" multiple accept=".pdf,.dwg,.dxf,.step,.stp,.igs,.iges,.jpg,.jpeg,.png" aria-describedby="${f("file")}-e">
              <ul class="file-list" data-file-list></ul>
              <p class="error" id="${f("file")}-e" aria-live="polite"></p>
            </div>
            <div class="field"><label for="${f("note")}">Yêu cầu kỹ thuật</label><textarea id="${f("note")}" name="note" rows="3" placeholder="Dung sai, độ cứng, xử lý bề mặt, điều kiện làm việc của chi tiết..."></textarea></div>
            <p class="form-error" data-form-error hidden role="alert">Chưa gửi được. Kiểm tra kết nối mạng rồi thử lại, hoặc gọi <a href="tel:${site.hotlineTel}">${site.hotline}</a>.</p>
            <button class="btn btn-primary btn-lg" type="submit" data-submit><span class="btn-label">Gửi yêu cầu báo giá</span>${btnIco()}</button>
            <p class="form-note">Kỹ sư phản hồi báo giá trong 24 giờ làm việc. Bản vẽ của bạn chỉ dùng để báo giá và sản xuất, không chia sẻ cho bên thứ ba.</p>
          </div>
          <div class="form-success" data-form-success hidden tabindex="-1">
            <p class="eyebrow">Đã nhận yêu cầu · mã <span data-success-code>RFQ</span></p>
            <h3>Cảm ơn <span data-success-name></span></h3>
            <p>Kỹ sư sẽ gọi số <strong data-success-phone></strong> và gửi báo giá trong 24 giờ làm việc.</p>
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
      case "tag": return tag(opts.code, opts.text);
      case "service-panels": return servicePanels();
      case "service-rows": return serviceRows();
      case "service-cards": return serviceCards();
      case "segments": return segmentCards();
      case "segment-list": return `<ol>${segments.map((g, i) => `<li><a href="san-pham.html?nhom=${g.key}"><span><b>0${i + 1}</b>${esc(g.name)}</span>${arrow("up-right")}</a></li>`).join("")}</ol>`;
      case "segment-drop": return segments.map((g) => `<a href="san-pham.html?nhom=${g.key}"><span class="dd-code"><i class="ph ${g.icon}" aria-hidden="true"></i></span><span><strong>${esc(g.name)}</strong><small>${esc(g.short)}</small></span></a>`).join("");
      case "product-filters": return productFilters();
      case "service-drop": return services.map((s) => `<a href="${s.slug}.html"><span class="dd-code"><i class="ph ${s.icon}" aria-hidden="true"></i></span><span><strong>${esc(s.name)}</strong><small>${esc(s.short)}</small></span></a>`).join("");
      case "products": return productGrid(opts);
      case "product-count": return String(products.length);
      case "materials": return materialTable();
      case "weight-calc": return weightCalc();
      case "process": return processRail();
      case "equipment": return equipTable();
      case "posts": return `<div class="post-grid">${posts.filter((p) => p.slug !== opts.exclude).slice(0, Number(opts.limit || 9)).map(postCard).join("")}</div>`;
      case "faq": return faqList(JSON.parse(opts.items.replace(/'/g, '"')));
      case "company": return companyCard();
      case "rfq-form": return rfqForm(opts.id || "f", opts);
      case "name": return site.name;
      case "name-upper": return site.nameUpper;
      case "tax": return site.taxCode;
      case "address": return site.address;
      case "address-short": return site.addressShort;
      case "map-query": return encodeURIComponent(site.mapQuery);
      case "hotline": return site.hotline;
      case "hotline-tel": return site.hotlineTel;
      case "email": return site.email;
      case "hours": return site.hours;
      case "zalo": return site.zalo;
      case "facebook": return site.facebook;
      case "youtube": return site.youtube;
      default: return m;
    }
  });
}

/* ---------------------------------------------------------------- layout */

const partials = { header: read("partials/header.html"), footer: read("partials/footer.html"), cta: read("partials/cta.html") };

function layout(meta, body) {
  let header = meta.header ? read(`partials/header-${meta.header}.html`) : partials.header;
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
  <meta name="theme-color" content="#f0f1f1">
  <link rel="canonical" href="${site.url}/${meta.file === "index.html" ? "" : meta.file}">
  <meta property="og:title" content="${esc(meta.title)}">
  <meta property="og:description" content="${esc(meta.description)}">
  <meta property="og:image" content="${meta.image || "assets/img/hero-rot-khuon.jpg"}">
  <meta property="og:type" content="${meta.ogType || "website"}">
  <meta property="og:locale" content="vi_VN">${meta.noindex ? '\n  <meta name="robots" content="noindex">' : ""}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400..700;1,400..600&family=Be+Vietnam+Pro:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/light/style.css">${meta.preload ? `\n  <link rel="preload" as="image" href="${meta.preload}">` : ""}
  <link rel="stylesheet" href="assets/css/style.css">
  <link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
</head>
<body data-page="${meta.file.replace(".html", "")}"${meta.bodyClass ? ` class="${meta.bodyClass}"` : ""}>
  <a class="skip-link" href="#main">Bỏ qua điều hướng</a>
${header}
  <main id="main">
${body}
  </main>
${meta.cta === false ? "" : partials.cta}
${partials.footer}
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
const built = {}; /* file -> HTML tiếng Việt, dùng để dịch */
const hidden = new Set(["404.html"]); /* trang noindex không đưa vào sitemap */
function save(rel, html) {
  if (/[–—―]/.test(html)) throw new Error(`${rel} chứa dấu gạch dài (–, — hoặc ―), hãy thay bằng "-"`);
  fs.mkdirSync(path.dirname(path.join(ROOT, rel)), { recursive: true });
  fs.writeFileSync(path.join(ROOT, rel), html, "utf8");
}
function write(file, html) { built[file] = html; out.push(file); }

/* Gắn ngôn ngữ cho một trang: lang, đường dẫn tài nguyên, canonical, hreflang, nút chuyển ngôn ngữ */
const pageUrl = (L, file) => `${site.url}/${L.dir ? L.dir + "/" : ""}${file === "index.html" ? "" : file}`;
function localize(html, file, L) {
  const up = L.dir ? "../" : "";
  const rel = (T) => (T.dir === L.dir ? "" : up + (T.dir ? T.dir + "/" : "")) + file;
  const alt = LANGS.map((T) => `\n  <link rel="alternate" hreflang="${T.code}" href="${pageUrl(T, file)}">`).join("") + `\n  <link rel="alternate" hreflang="x-default" href="${pageUrl(LANGS[0], file)}">`;
  const sw = (cls) => `<nav class="${cls}" aria-label="${L.aria}">${LANGS.map((T) => `<a href="${rel(T)}" hreflang="${T.code}" lang="${T.code}"${T.code === L.code ? ' aria-current="true"' : ""}>${cls === "langs" ? T.short : T.label}</a>`).join("")}</nav>`;
  let h = html
    .replace('<html lang="vi">', `<html lang="${L.code}">`)
    .replace('content="vi_VN"', `content="${L.locale}"`)
    .replace(/<link rel="canonical" href="[^"]*">/, (m) => `<link rel="canonical" href="${pageUrl(L, file)}">${alt}`)
    .replace("<!--LANGS-->", () => sw("langs"))
    .replace("<!--LANGS-MOBILE-->", () => sw("mobile-langs"));
  if (L.font) h = h.replace('<link rel="stylesheet" href="assets/css/style.css">', `<link href="https://fonts.googleapis.com/css2?family=${L.font}&display=swap" rel="stylesheet">\n  <link rel="stylesheet" href="assets/css/style.css">`);
  if (up) h = h.replace(/((?:href|src|content)=")assets\//g, "$1../assets/");
  return h;
}

for (const file of fs.readdirSync(path.join(SRC, "pages")).filter((f) => f.endsWith(".html"))) {
  const { meta, body } = parsePage(file);
  if (meta.noindex) hidden.add(file);
  write(file, layout(meta, tokens(body, { meta })));
}

const serviceTpl = require(path.join(SRC, "templates/service.js"));
services.forEach((s) => {
  const meta = {
    file: `${s.slug}.html`, title: s.name, description: s.lead, nav: "linh-vuc",
    image: `assets/img/${s.hero}`, preload: `assets/img/${s.hero}`,
    crumbs: [["Lĩnh vực", "linh-vuc.html"], [s.name, `${s.slug}.html`]],
  };
  const others = services.filter((x) => x.slug !== s.slug);
  write(meta.file, layout(meta, tokens(serviceTpl({ s, others, esc, arrow, btnIco, faqList, tag }), { meta })));
});

const postTpl = require(path.join(SRC, "templates/post.js"));
for (const p of posts) {
  const meta = {
    file: `${p.slug}.html`, title: p.title, description: p.excerpt, nav: "tin-tuc", ogType: "article",
    image: `assets/img/${p.image}`, crumbs: [["Tin tức", "tin-tuc.html"], [p.title, `${p.slug}.html`]],
  };
  write(meta.file, layout(meta, tokens(postTpl({ p, esc }), { meta })));
}

/* Ghi trang tiếng Việt, rồi các bản dịch */
const I18N = path.join(SRC, "i18n");
if (EXTRACT) {
  const keys = new Set();
  for (const f of out) i18n.extract(built[f], keys);
  fs.mkdirSync(I18N, { recursive: true });
  fs.writeFileSync(path.join(I18N, "source.json"), JSON.stringify([...keys], null, 1), "utf8");
  console.log(`Đã tách ${keys.size} chuỗi vào src/i18n/source.json`);
}
const done = [];
for (const L of LANGS) {
  let dict = null;
  if (L.dir) {
    const p = path.join(I18N, `${L.code}.json`);
    if (!fs.existsSync(p)) { console.log(`Bỏ qua ${L.code}: chưa có src/i18n/${L.code}.json`); continue; }
    dict = JSON.parse(fs.readFileSync(p, "utf8"));
  }
  const missing = new Set();
  for (const f of out) save((L.dir ? L.dir + "/" : "") + f, localize(dict ? i18n.translate(built[f], dict, missing) : built[f], f, L));
  if (missing.size) console.log(`${L.code}: thiếu ${missing.size} chuỗi, đang để tiếng Việt:\n    ` + [...missing].slice(0, 15).join("\n    "));
  done.push(L);
}

const today = new Date().toISOString().slice(0, 10);
const urls = done.flatMap((L) => out.filter((f) => !hidden.has(f)).map((f) => `  <url><loc>${pageUrl(L, f)}</loc><lastmod>${today}</lastmod></url>`));
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`);
console.log(`Đã build ${out.length} trang x ${done.length} ngôn ngữ (${done.map((L) => L.code).join(", ")})`);
