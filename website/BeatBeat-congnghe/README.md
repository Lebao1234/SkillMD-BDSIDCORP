# Website BeatBeat

Cửa hàng tai nghe và loa bằng HTML, CSS, JS thuần. Cấu trúc tham khảo vn.jbl.com: tai nghe theo loại, loa di động, loa tiệc, loa thanh, khuyến mãi, hỗ trợ.

Giao diện theo design system trong `.claude/skills/design-system` (nền đen, cam đỏ `#ff3300` / `#df2d00`, nút bo tròn) kết hợp taste skill:
- Chữ Roboto của design system gốc được thay: Unbounded cho tiêu đề, Onest cho nội dung, JetBrains Mono cho giá và thông số. Cả ba đều có tiếng Việt.
- Nền đen ấm `#0b0b0c` có lớp hạt nhiễu mờ, chỉ dùng một màu nhấn.
- Menu nổi dạng viên thuốc, icon Phosphor Light.
- Motif sóng âm có ở hero, giỏ trống, trang sản phẩm và trang 404.

## Xem website

Mở `index.html` bằng trình duyệt. Các file `.html` ở thư mục gốc là **file đã build**, không sửa trực tiếp.

## Sửa nội dung rồi build lại

```bash
node tools/build.js   # sinh lại toàn bộ trang + sitemap.xml
node tools/check.js   # kiểm tra link hỏng, anchor, ảnh thiếu alt, id trùng
```

| Muốn sửa | Sửa ở đâu |
| --- | --- |
| Hotline, email, mạng xã hội, 3 cửa hàng | `src/data/site.js` |
| 25 sản phẩm (giá, giá cũ, màu và ảnh, thông số, điểm nổi bật, chữ ký âm thanh `eq`, pin) | `src/data/products.js`. Bố cục trang: `src/templates/product.js` |
| Tên và ảnh 7 danh mục | biến `CATS` trong `tools/build.js` |
| Bài hướng dẫn chọn mua | `src/data/posts.js` |
| Mã giảm giá | trang `src/pages/khuyen-mai.html` và bảng `CODES` trong `assets/js/main.js` (phải sửa cả hai) |
| Ngày Sale 10.10 | `data-countdown` trong `src/pages/khuyen-mai.html` |
| Menu, footer, giỏ hàng, ô tìm kiếm | `src/partials/*.html` |
| Các trang còn lại | `src/pages/*.html` |

Token dùng được trong trang: `{{crumbs}}`, `{{products kind="..." cat="..." sale="1" slugs="..." exclude="..."}}`, `{{count kind="..."}}`, `{{cat-tiles kind="..."}}`, `{{filter-bar kind="..."}}`, `{{battery-chart kind="..."}}`, `{{sound-lab}}`, `{{finder}}`, `{{wave n="48" class="..."}}`, `{{posts exclude="..." limit="..."}}`, `{{faq items="..."}}`, `{{stores}}`, `{{product-options}}`, `{{hotline}}`, `{{hotline-tel}}`, `{{email}}`, `{{hours}}`, `{{zalo}}`, `{{facebook}}`, `{{instagram}}`, `{{youtube}}`, `{{tiktok}}`, `{{legal}}`. Build dừng với lỗi nếu trang nào còn dấu gạch dài (en dash hoặc em dash), hãy dùng `-`.

## Danh sách trang

42 file `.html` ở thư mục gốc:

| Nhóm | Trang |
| --- | --- |
| Trang chính | `index.html`, `tai-nghe.html`, `loa.html`, `khuyen-mai.html`, `phong-nghe-thu.html`, `tim-san-pham.html`, `so-sanh.html` |
| Mua hàng, hỗ trợ | `gio-hang.html`, `cua-hang.html`, `ho-tro.html`, `chinh-sach.html`, `404.html` |
| Tin tức | `bai-viet.html` |
| Tai nghe (14 trang sinh từ `src/data/products.js`) | `aura-max.html`, `aura-2.html`, `studio-m1.html`, `kids-pop.html`, `pulse-pro.html`, `pulse-mini.html`, `pulse-air.html`, `pulse-flow.html`, `run-open.html`, `run-neck.html`, `run-pro.html`, `clash-g7.html`, `clash-g3.html`, `clash-buds.html` |
| Loa (11 trang sinh từ `src/data/products.js`) | `drop-3.html`, `drop-5.html`, `clip-go.html`, `boom-xl.html`, `party-300.html`, `party-go.html`, `party-100.html`, `stage-9.html`, `stage-3.html`, `stage-2.html`, `home-one.html` |
| Bài viết (4 trang sinh từ `src/data/posts.js`) | `chong-on-chu-dong-la-gi.html`, `chong-nuoc-ip67-la-gi.html`, `codec-bluetooth-ldac-aac.html`, `chon-loa-thanh-cho-phong-khach.html` |

## Tính năng

- **Phòng nghe thử** (`phong-nghe-thu.html`):
  - Nhịp beat 96 BPM được tạo ngay trong trình duyệt bằng Web Audio, không dùng file nhạc.
  - Chọn một sản phẩm thì ba thanh trầm, trung, cao nhảy về cấu hình âm thanh của sản phẩm đó.
  - Có công tắc bật tiếng ồn đường phố và bật chống ồn.
  - Biểu đồ phổ âm chạy theo nhạc.
  - Link `?sp=aura-max` mở sẵn cấu hình của một sản phẩm.
- **Chọn giúp tôi:** 4 câu hỏi, chấm điểm 25 sản phẩm và gợi ý 3 sản phẩm hợp nhất, kèm lý do.
- **Danh sách sản phẩm:**
  - Lọc theo loại, chống ồn, chống nước, mức giá.
  - Sắp xếp theo giá hoặc theo thời lượng pin.
  - Link `?loai=nhet-tai` mở sẵn một loại.
- **Thẻ sản phẩm:** đổi màu thì đổi ảnh. Có nút so sánh và nút thêm vào giỏ.
- **Trang sản phẩm:**
  - Chọn màu, xem chữ ký âm thanh, thông số, đánh giá.
  - Thanh mua hàng dính ở đáy khi cuộn qua nút mua.
- **So sánh:** tối đa 3 sản phẩm cùng loại, có chế độ chỉ hiện dòng khác nhau.
- **Giỏ hàng:**
  - Lưu trong trình duyệt, báo số tiền còn thiếu để được miễn phí giao hàng.
  - Nhập mã giảm giá `BEAT200`, `COMBO10`, `SV15`. Trang thanh toán có kiểm tra thông tin.
- **Tìm kiếm:** bấm kính lúp hoặc phím `/`. Gõ không dấu vẫn tìm được.
- **Trang khuyến mãi:** đếm ngược đến Sale 10.10, bấm để sao chép mã giảm giá.
- **Tra cứu bảo hành:** serial dạng `BB` + năm, tháng mua + 4 số. Ví dụ `BB26031234`.

## Trước khi đưa lên mạng

- **BeatBeat, các mẫu sản phẩm, thông số, giá, đánh giá, cửa hàng là dữ liệu mẫu.** Ảnh sản phẩm lấy từ Unsplash (Unsplash License), đã tải về `assets/img/`. Tôi đã chọn ảnh không thấy logo hãng khác, nhưng vẫn nên thay bằng ảnh sản phẩm thật.
- Phòng nghe thử chỉ mô phỏng xu hướng âm thanh bằng bộ lọc EQ, không phải âm thanh thật của sản phẩm (trên trang đã ghi rõ).
- Tra cứu bảo hành đang tính từ số serial theo quy ước mẫu, chưa nối với hệ thống thật.
- Form thanh toán đang mô phỏng gửi thành công. Gắn API bằng `data-endpoint="https://..."` trên thẻ `<form>` trong `src/pages/gio-hang.html`. Đăng ký nhận tin chưa gửi đi đâu.
- Chính sách đổi trả, bảo hành là văn bản mẫu, cần rà soát pháp lý.
