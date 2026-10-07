# Quy chuẩn giao diện cho mọi site trong website/

Site tĩnh HTML/CSS/JS thuần, tiếng Việt, mục tiêu bán hàng + giới thiệu doanh nghiệp (không phải dashboard).
Được nạp tự động qua `website/CLAUDE.md`. Cách build/check: xem `CLAUDE.md` gốc và README của từng site.

**Thứ tự ưu tiên:** file này > skill trong `.agents/skills/`. Khi skill mâu thuẫn (font, hero, eyebrow,
dropdown, React/Next, `generate_image`...), làm theo file này. Skill viết cho React: chỉ lấy nguyên tắc thẩm mỹ,
không lấy stack.

Các `DESIGN.md`/`PLAN.md` trong `frontend-themes/giao-duc|dich-vu-chuyen-nghiep|cong-nghe-phan-mem/` là bản
nháp cũ, chưa từng build và có chỗ trái quy chuẩn này: chỉ tham khảo, không làm theo.

---

## 1. Trước khi code
1. Nghiên cứu 2-3 site tham khảo cùng ngành (firecrawl): màu, font, bố cục, giọng văn.
2. Khai báo Design Read: "Reading this as: [loại trang] for [khách hàng], with [vibe] language, leaning toward [trường phái]."
3. Đặt 3 dial (1-10): `DESIGN_VARIANCE`, `MOTION_INTENSITY`, `VISUAL_DENSITY`.
4. Chọn hero archetype, kiểu header, kiểu footer, chế độ nav (mục 4-5) và ghi lý do theo ngành.
5. Khai báo palette + font, đối chiếu bảng mục 3 để KHÔNG trùng site đã có.
6. Viết copy thật cho từng section trước, rồi mới dựng layout.

## 2. Cấm (làm site trông như AI sinh ra)
- Monogram/ô chữ cái giả trong dropdown (`T`, `X`, `G`, `.drop-code`): dùng ảnh thật, icon SVG nét mảnh, hoặc chỉ text.
- Chấm màu nhỏ trang trí (trước eyebrow, "status dot" nhấp nháy).
- Chữ tên thương hiệu khổng lồ làm trang trí ở đáy footer.
- Eyebrow trên mọi section: tối đa khoảng 1 eyebrow / 3 section (hero được có 1).
- Section head chia đôi (tiêu đề trái lớn + đoạn văn phải nhỏ): luôn xếp chồng eyebrow?, tiêu đề, mô tả, link.
- Hero căn giữa trên nền mesh tối; gradient tím/xanh phát sáng kiểu AI; glassmorphism tràn lan.
- 3 card tính năng bằng nhau xếp ngang; zigzag trái-phải quá 2 lần; card lồng card lồng card.
- Div giả làm screenshot/ảnh sản phẩm.
- Số liệu giả vờ chính xác (92%, 4.1x, 48k) khi không có dữ liệu thật; bộ đếm số chạy cho số bịa.
- Font Inter làm font chính; Fraunces/Instrument Serif làm display mặc định.
- `#000` thuần cho nền/chữ/bóng; bóng đổ phải pha màu nền.
- Emoji trong UI. `height: 100vh` cho hero: dùng `min-height: 100dvh`.
- Dấu – hoặc — trong nội dung (build sẽ lỗi): dùng `-`.

## 3. Màu và font
- 1 accent chính, độ bão hòa < 80%, trừ khi đó là màu nhận diện có sẵn của khách (khi đó giữ nguyên và ghi vào README).
- Nền trung tính chọn 1 họ (lạnh hoặc ấm), không trộn.
- Font BẮT BUỘC có bộ ký tự tiếng Việt (Google Fonts có subset `vietnamese`). Nhiều font Fontshare (Satoshi,
  Cabinet Grotesk...) không có dấu tiếng Việt: kiểm tra trước khi dùng.
- Mỗi site mới phải khác các site đã có. Đã dùng:

| Site | Font | Accent |
|---|---|---|
| 3DRoom-dichvu | Plus Jakarta Sans, IBM Plex Mono | #036080 |
| AttackK-congnghe | Space Grotesk, JetBrains Mono | #6073f2 |
| BBE-giaoduc | Lexend, Noto Sans | #003359 + #de1135 |
| BeatBeat-congnghe | Unbounded, Onest, JetBrains Mono | #ff3300 |
| CongthongtinNeu | Roboto, Roboto Condensed | #0076c0 |
| ISZ-giaoduc | Archivo, Plus Jakarta Sans, Noto Serif SC | #d2232a |
| K-Lab's-dichvu | Archivo, JetBrains Mono | #f2523f |
| Langkinh-congnghe | Geist, Geist Mono | #ffb020 |
| Luimiere-dichvu | Cormorant Garamond, Montserrat | #bc955c |
| Nhatanthoi-dichvu | Playfair Display, Be Vietnam Pro | #9e2a2b |
| Phimdan-giaoduc | Bricolage Grotesque, Be Vietnam Pro | #f26b22 |
| VN-Nikko-cokhi | Plus Jakarta Sans, Be Vietnam Pro | #d8262d |

  Đã bão hòa: accent đỏ (5 site), Plus Jakarta Sans và Be Vietnam Pro (3 site mỗi font). Site mới nên tránh.
  Cập nhật bảng này khi thêm site.
- Chữ: tiêu đề section ~`clamp(2.25rem, 5vw, 3.75rem)`, `letter-spacing` âm nhẹ, `line-height` ~1;
  thân bài `max-width: 65ch`, `line-height` 1.6. Tiêu đề hero tối đa 2 dòng trên desktop.

## 4. Hero: luân phiên, không mặc định 2 cột

| Archetype | Hợp nhất với | Đặc điểm |
|---|---|---|
| 1. Carousel/slider tràn viền | Thời trang, cho thuê đồ, studio ảnh, BĐS, resort, showroom, bán lẻ | 2-4 slide ảnh 16:9/21:9, cross-fade, chữ đè ảnh có vignette mềm, điều hướng bằng progress bar/mũi tên mảnh (không chấm tròn to) |
| 2. Centered cinematic | Công nghệ, SaaS, EdTech, sự kiện | Tiêu đề căn giữa tối đa 2 dòng, ảnh/video thật phủ tối dần (không mesh) |
| 3. Bento | Phần mềm, startup, app, agency số | Ô chính chứa tiêu đề + CTA, 2-3 ô phụ có nội dung thật, không ô trống |
| 4. Editorial manifesto | Tư vấn, luật, kiến trúc, tài chính | Tiêu đề rất lớn, nhiều khoảng trắng |
| 5. Split bất đối xứng | Dịch vụ kỹ thuật, cơ khí, y tế | Text + 1 ảnh minh họa duy nhất |

Hero tối đa 4 phần tử chữ (eyebrow, tiêu đề, mô tả, CTA), padding trên tối đa 6rem.
Lưới dùng CSS Grid, khung `max-width: 1400px` hoặc 1280px.

## 5. Header, footer, điều hướng
**Header** (chọn theo ngành, cả hai đều hợp lệ):
- A. Bo tròn nổi: thanh tách khỏi mép trên 1-1.5rem, `border-radius: 999px` hoặc 1rem, nền mờ + viền hairline.
  Hợp: công nghệ, AI, startup, sản phẩm sáng tạo, portfolio.
- B. Thẳng tràn viền: `width: 100%`, không bo, sticky, `border-bottom: 1px`, nội dung căn theo khung lưới.
  Hợp: công nghiệp, cơ khí, bán lẻ lớn, doanh nghiệp truyền thống, tài chính, thời trang editorial, kiến trúc.

**Footer:**
- A. Card bo tròn lọt trong trang (lề 1-2rem, `border-radius` 1.5-2.5rem), có khối CTA trước các cột link.
  Hợp: SaaS, startup, app, thời trang/lifestyle, studio sáng tạo.
- B. Thẳng tràn viền: chạm đáy, `border-top: 1px`, lưới 3-4 cột (pháp nhân/địa chỉ, danh mục, hỗ trợ & chính sách, bản quyền).
  Hợp: sản xuất, cơ khí, tài chính, ngân hàng, y tế, siêu thị/e-commerce lớn, giáo dục/viện nghiên cứu.

**Chế độ nav 1: site giới thiệu/dịch vụ/portfolio = nav phẳng, không dropdown.**
1 dòng, cao 64-80px: `[Logo] --- [Trang chủ] [Về chúng tôi] [Dịch vụ] [Dự án] [Tin tức] [Liên hệ] --- [CTA]`.
Active: gạch chân mảnh hoặc nền pill rất nhạt. Dưới 1024px: hamburger mở overlay toàn màn hình.

**Chế độ nav 2: cửa hàng/catalog nhiều danh mục = mega-dropdown rộng ~80% (`width: min(85vw, 1200px)`).**
- Cột danh mục con (20-25%): link chữ, hover tinh tế.
- Lưới 3-4 sản phẩm (50-55%): ảnh thật 1:1 hoặc 4:3, tên, giá hoặc nhãn (`Mới`, `Bán chạy`).
- Card khuyến mãi (20-25%): ảnh banner + 1 CTA ngắn cụ thể (vd "Xem bộ sưu tập Tết").
- Dải đáy: "Xem toàn bộ [N] sản phẩm".

## 6. Ảnh
- Ảnh thật tải về `assets/img/` (Unsplash, ghi giấy phép trong README) hoặc ảnh khách cung cấp.
  Repo này không có công cụ `generate_image`.
- Mọi `<img>` có `alt` (rỗng nếu chỉ trang trí và chữ bên cạnh đã nói đủ), `width`/`height`, `loading="lazy"` ngoài màn hình đầu.

## 7. Copy
- Tiêu đề tối đa 8 chữ, mô tả tối đa 20 chữ, CTA tối đa 3 chữ; mỗi ý định chỉ 1 CTA trên toàn trang.
- Cấm sáo rỗng: "Khám phá ngay", "Giải pháp toàn diện", "Đồng hành cùng bạn", "Nâng tầm", "Đột phá".
  Viết cụ thể: con số thật, tên sản phẩm, địa điểm, thời gian.

## 8. Xong khi
- [ ] Mỗi trang: `<title>[Từ khóa] | [Thương hiệu]</title>`, meta description 150-160 ký tự, canonical,
      og:title/description/image/url, đúng 1 `h1`, heading không nhảy cấp, Schema.org phù hợp
      (Organization/LocalBusiness/Course/Product).
- [ ] `node tools/build.js` và `node tools/check.js` báo OK.
- [ ] Tương phản WCAG AA, focus nhìn thấy được, form có label, có landmark (`header`, `nav`, `main`, `footer`).
- [ ] Chụp màn hình desktop + mobile (playwright): menu mobile hoạt động, CTA không xuống dòng, không cuộn ngang.
- [ ] Rà lại mục 2 (danh sách cấm).
