// Kiểm tra nhanh sau khi build: link nội bộ, anchor, ảnh, token còn sót, id trùng
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
const pages = fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"));
const ids = {};
for (const f of pages) ids[f] = new Set([...fs.readFileSync(path.join(ROOT, f), "utf8").matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
let problems = 0;
const report = (f, msg) => { problems++; console.log(`${f}: ${msg}`); };
for (const f of pages) {
  const html = fs.readFileSync(path.join(ROOT, f), "utf8");
  if (/\{\{[^}]*\}\}/.test(html)) report(f, "token chưa thay: " + html.match(/\{\{[^}]*\}\}/)[0]);
  const all = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dup = all.filter((x, i) => all.indexOf(x) !== i);
  if (dup.length) report(f, "id trùng: " + [...new Set(dup)].join(", "));
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:|tel:|data:)/.test(url) || url === "#") continue;
    const [file, hash] = url.split("#");
    const target = file || f;
    if (file && !fs.existsSync(path.join(ROOT, file.split("?")[0]))) { report(f, "thiếu file: " + url); continue; }
    if (hash && target.endsWith(".html") && !ids[target.split("?")[0]].has(hash)) report(f, "thiếu anchor: " + url);
  }
  for (const m of html.matchAll(/<img\b[^>]*>/g)) if (!/\salt="/.test(m[0])) report(f, "ảnh thiếu alt: " + m[0].slice(0, 80));
}
console.log(problems ? `\n${problems} vấn đề` : `OK: ${pages.length} trang, không có lỗi.`);
process.exit(problems ? 1 : 0);
