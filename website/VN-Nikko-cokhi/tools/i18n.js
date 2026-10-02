/*
 * Đa ngôn ngữ: tách chuỗi từ HTML tiếng Việt đã build và thay bằng bản dịch.
 *
 * Đơn vị dịch là một "đoạn": phần nội dung nằm giữa hai thẻ khối, gồm chữ và các thẻ
 * trong dòng (em, strong, a, span...). Thẻ trong dòng được đổi thành ký hiệu <0>...</0>,
 * thẻ rỗng (biểu tượng, br) thành <1/>, để người dịch đổi trật tự câu mà không đụng HTML.
 * Thuộc tính alt, title, placeholder, aria-label, label và nội dung thẻ meta mô tả cũng được dịch.
 */
"use strict";

const INLINE = new Set(["a", "em", "strong", "b", "i", "span", "small", "br", "code", "sup", "sub", "abbr", "mark", "u", "s", "time", "wbr", "kbd"]);
const VOID = new Set(["br", "wbr", "img", "input", "meta", "link", "hr", "source"]);
const ATTRS = ["alt", "title", "placeholder", "aria-label", "label"];
const META_CONTENT = /^<meta\b[^>]*(?:name="description"|property="og:(?:title|description)")/;
const HAS_WORD = /[A-Za-zÀ-ỹĐđ]{2,}/;

const TOKEN = /<!--[\s\S]*?-->|<![^>]*>|<(script|style)\b[\s\S]*?<\/\1\s*>|<\/?[a-zA-Z][^>]*>|[^<]+/g;

function tagName(raw) { const m = raw.match(/^<\/?([a-zA-Z][\w-]*)/); return m ? m[1].toLowerCase() : ""; }

/* Dịch thuộc tính trong một thẻ */
function mapAttrs(raw, fn) {
  let out = raw.replace(new RegExp(`\\s(${ATTRS.join("|")})="([^"]*)"`, "g"), (m, k, v) => (HAS_WORD.test(v) ? ` ${k}="${fn(v)}"` : m));
  if (META_CONTENT.test(raw)) out = out.replace(/\scontent="([^"]*)"/, (m, v) => (HAS_WORD.test(v) ? ` content="${fn(v)}"` : m));
  return out;
}

const raw = (arr) => arr.map((x) => x.raw).join("");
const letters = (arr) => HAS_WORD.test(arr.map((x) => (x.t === "text" ? x.raw : "")).join(""));

/* Xử lý một đoạn chữ + thẻ trong dòng */
function mapRun(items, fn) {
  // ghép thẻ mở + đóng liền nhau (biểu tượng) thành thẻ rỗng
  const merged = [];
  for (let k = 0; k < items.length; k++) {
    const a = items[k], b = items[k + 1];
    if (a.t === "open" && b && b.t === "close" && b.name === a.name) { merged.push({ t: "empty", raw: a.raw + b.raw }); k++; }
    else merged.push(a);
  }
  // thẻ không có cặp trong đoạn (mở trước thẻ khối, đóng sau thẻ khối) là ranh giới
  const st = [], bad = new Set();
  merged.forEach((x, k) => { if (x.t === "open") st.push(k); else if (x.t === "close") { if (st.length) st.pop(); else bad.add(k); } });
  st.forEach((k) => bad.add(k));
  if (bad.size) {
    let o = "", part = [];
    merged.forEach((x, k) => { if (bad.has(k)) { o += part.length ? unit(part, fn) : ""; part = []; o += x.raw; } else part.push(x); });
    return o + (part.length ? unit(part, fn) : "");
  }
  return unit(merged, fn);
}

/* Một đoạn đã cân bằng thẻ */
function unit(it, fn) {
  const blank = (x) => x.t === "empty" || x.t === "void" || (x.t === "text" && !x.raw.trim());
  let s = 0, e = it.length;
  for (;;) {
    while (s < e && blank(it[s])) s++;
    while (e > s && blank(it[e - 1])) e--;
    if (s < e && it[s].t === "open" && it[e - 1].t === "close") {
      // thẻ mở đầu có đóng đúng ở cuối không
      let d = 0, k = s;
      for (; k < e; k++) { if (it[k].t === "open") d++; else if (it[k].t === "close") { d--; if (d === 0) break; } }
      if (k === e - 1) { s++; e--; continue; }
    }
    break;
  }
  const core = it.slice(s, e);
  const pre = raw(it.slice(0, s)), post = raw(it.slice(e));
  if (!letters(core)) return raw(it);
  // nhiều phần tử liền nhau, không có chữ trần ở ngoài (menu, danh sách link): dịch từng phần tử
  const groups = []; let d = 0, cur = [], loose = false;
  for (const x of core) {
    if (d === 0 && x.t === "text") { if (x.raw.trim()) loose = true; groups.push({ ws: x }); continue; }
    cur.push(x);
    if (x.t === "open") d++; else if (x.t === "close") d--;
    if (d === 0) { groups.push({ g: cur }); cur = []; }
  }
  if (!loose && groups.filter((g) => g.g).length > 1) return pre + groups.map((g) => (g.ws ? g.ws.raw : unit(g.g, fn))).join("") + post;
  // chuỗi khóa có ký hiệu thẻ
  const slots = {}; const stack = []; let n = 0, key = "";
  for (const x of core) {
    if (x.t === "text") key += x.raw;
    else if (x.t === "open") { stack.push(n); slots[`<${n}>`] = x.raw; key += `<${n}>`; n++; }
    else if (x.t === "close") { const m = stack.pop(); slots[`</${m}>`] = x.raw; key += `</${m}>`; }
    else { slots[`<${n}/>`] = x.raw; key += `<${n}/>`; n++; }
  }
  const lead = (key.match(/^\s*/) || [""])[0], trail = (key.match(/\s*$/) || [""])[0];
  key = key.replace(/\s+/g, " ").trim();
  const tr = fn(key);
  const body = tr.replace(/<\/?\d+\/?>/g, (p) => (p in slots ? slots[p] : ""));
  return pre + lead + body + trail + post;
}

/* Duyệt toàn trang, fn(chuỗi) trả về chuỗi thay thế */
function walk(html, fn) {
  let out = "", run = [];
  const flush = () => { if (run.length) { out += mapRun(run, fn); run = []; } };
  let m; TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(html))) {
    const raw = m[0];
    if (raw.startsWith("<!") || m[1]) { flush(); out += raw; continue; }
    if (raw[0] !== "<") { run.push({ t: "text", raw }); continue; }
    const name = tagName(raw), close = raw[1] === "/";
    const tag = mapAttrs(raw, fn);
    if (!INLINE.has(name)) { flush(); out += tag; continue; }
    if (VOID.has(name) || /\/>$/.test(raw)) run.push({ t: "void", raw: tag });
    else run.push({ t: close ? "close" : "open", name, raw: tag });
  }
  flush();
  return out;
}

/* Lấy toàn bộ chuỗi cần dịch */
function extract(html, into) { walk(html, (k) => { into.add(k); return k; }); return into; }

/* Thay bằng bản dịch, trả về chuỗi thiếu */
function translate(html, dict, missing) {
  return walk(html, (k) => {
    if (Object.prototype.hasOwnProperty.call(dict, k)) return dict[k];
    missing.add(k); return k;
  });
}

module.exports = { extract, translate };
