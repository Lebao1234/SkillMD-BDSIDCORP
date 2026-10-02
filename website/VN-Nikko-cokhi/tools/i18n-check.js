// Kiểm tra một file bản dịch: node tools/i18n-check.js en
// Báo chuỗi thiếu, chuỗi thừa, ký hiệu thẻ <0> </0> <1/> không khớp, dấu gạch dài, chữ tiếng Việt còn sót.
const fs = require("fs"), path = require("path");
const lang = process.argv[2];
const D = path.join(__dirname, "../src/i18n");
const src = JSON.parse(fs.readFileSync(path.join(D, "source.json"), "utf8"));
const tr = JSON.parse(fs.readFileSync(path.join(D, `${lang}.json`), "utf8"));
const ph = (s) => (s.match(/<\/?\d+\/?>/g) || []).sort().join(" ");
const VI = /[ăâđêôơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/i;
// chuỗi được phép giữ tiếng Việt: tên pháp lý, địa chỉ, địa danh
const KEEP = /CÔNG TY TNHH|Đường số 2|Võng La|Sáp Mai|Đông Anh/;
let bad = 0; const say = (m) => { bad++; if (bad <= 60) console.log(m); };
for (const k of src) {
  if (!(k in tr)) { say(`THIẾU: ${k}`); continue; }
  const v = tr[k];
  if (typeof v !== "string" || !v.trim()) say(`RỖNG: ${k}`);
  else {
    if (ph(k) !== ph(v)) say(`KÝ HIỆU KHÔNG KHỚP: ${k}\n   -> ${v}`);
    if (/[–—―]/.test(v)) say(`GẠCH DÀI: ${v}`);
    if (/<(?!\/?\d+\/?>)/.test(v.replace(/&lt;/g, ""))) say(`CÓ THẺ HTML LẠ: ${v}`);
    if (VI.test(v) && !KEEP.test(v)) say(`CÒN TIẾNG VIỆT: ${v}`);
  }
}
for (const k of Object.keys(tr)) if (!src.includes(k)) say(`THỪA: ${k}`);
console.log(bad ? `\n${bad} lỗi trong ${lang}.json` : `OK: ${lang}.json đủ ${src.length} chuỗi`);
process.exit(bad ? 1 : 0);
