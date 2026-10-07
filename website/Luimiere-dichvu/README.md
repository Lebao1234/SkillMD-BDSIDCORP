# Website Luimiere Wedding & Events

Website nhà hàng tiệc cưới bằng HTML, CSS, JS thuần. Cấu trúc trang tham khảo huongpho.com.vn (sảnh tiệc, thực đơn, hội nghị, thư viện, tin tức, liên hệ). Giao diện thiết kế lại theo taste skill:
- Toàn trang nền tối như sảnh tiệc buổi tối, không đổi nền sáng/tối giữa các khối.
- Một màu nhấn vàng `#bc955c` giữ theo design system gốc.
- Tiêu đề dùng Cormorant Garamond, nội dung dùng Montserrat (font gốc). Cả hai có đủ dấu tiếng Việt.
- Khung ảnh lồng hai lớp, menu nổi dạng viên thuốc, icon Phosphor Light.
- Menu phẳng một hàng, không có menu thả: Sảnh tiệc, Thực đơn, Tiệc cưới, Hội nghị, Thư viện, Ưu đãi, Cẩm nang và một nút "Đặt lịch xem sảnh". Trang từng sảnh mở từ trang `sanh-tiec.html` và cột "Sảnh tiệc" ở footer. Về Luimiere, Hỏi đáp, Liên hệ nằm ở footer (menu điện thoại có thêm Về Luimiere và Liên hệ).
- Nhãn nhỏ phía trên tiêu đề (eyebrow) chỉ dùng khi mang thông tin thật (khu vực, ngày cập nhật, hạn ưu đãi, số ảnh), không đặt ở mọi khối. Đầu mỗi khối xếp dọc: tiêu đề, đoạn mô tả, link.

Motif "ánh sáng" (Lumière):
- Vệt sáng đi theo chuột ở hero và khối CTA cuối trang.
- Sơ đồ bàn: mỗi chấm là một bàn 10 khách, chấm sáng là số bàn tối thiểu. Các chấm sáng dần khi cuộn tới.
- Mục "Một buổi tối tại Luimiere": ảnh và đồng hồ đổi theo từng mốc giờ khi cuộn.

## Xem website

Mở `index.html` bằng trình duyệt. Các file `.html` ở thư mục gốc là **file đã build**, không sửa trực tiếp.

## Sửa nội dung rồi build lại

```bash
node tools/build.js   # sinh lại toàn bộ trang + sitemap.xml
node tools/check.js   # kiểm tra link hỏng, anchor, ảnh thiếu alt, id trùng
```

| Muốn sửa | Sửa ở đâu |
| --- | --- |
| Menu (phẳng, không menu thả), logo | `src/partials/header.html` |
| Footer, nút gọi/Zalo nổi | `src/partials/footer.html` |
| Khối "Đến xem sảnh" trước footer | `src/partials/cta.html` |
| Popup đặt lịch | `src/partials/modal.html`. Các ô của form nằm ở hàm `bookForm` trong `tools/build.js` |
| Hotline, email, địa chỉ, Zalo | `src/data/site.js` |
| 4 sảnh (sức chứa, diện tích, ảnh, nội dung) | `src/data/halls.js`. Bố cục trang sảnh: `src/templates/hall.js` |
| 4 thực đơn và giá | `src/data/menus.js`. Bảng dự toán, bảng giá ở trang sảnh và menu trang chủ tự tính lại |
| Ngày cưới đẹp và sảnh còn trống | `src/data/dates.js` (cập nhật tay hằng tuần) |
| Bài viết cẩm nang | `src/data/posts.js` |
| Các trang còn lại | `src/pages/*.html` |

Nút đặt lịch: mọi nút có `data-open-book` đều mở popup. Có thể thêm các thuộc tính sau để điền sẵn form:
- `data-hall="Étoile"`
- `data-type="Hội nghị, sự kiện"`
- `data-date="2026-11-14"`
- `data-guests="300"`
- `data-note="..."`

## Danh sách trang

| Trang huongpho.com.vn | Trang Luimiere |
| --- | --- |
| Trang chủ | `index.html` |
| Tiệc cưới: Hương Phố, The Chateau (các sảnh) | `sanh-tiec.html` (lọc theo số khách, bảng so sánh) và 4 trang `sanh-etoile.html`, `sanh-soleil.html`, `sanh-lune.html`, `sanh-aube.html` |
| Thư viện: menu thực đơn | `thuc-don.html` (4 thực đơn dạng tab, bảng dự toán chi phí) |
| (dịch vụ nằm rải rác) | `dich-vu-cuoi.html` (có sẵn trong giá, quy trình, bảng giá dịch vụ thêm) |
| Hội nghị | `hoi-nghi-su-kien.html` |
| Thư viện ảnh | `thu-vien.html` (lọc theo nhóm, xem ảnh lớn bằng phím mũi tên) |
| (không có) | `uu-dai.html` |
| Tin tức | `cam-nang.html` và 6 bài viết |
| Liên hệ, đặt tiệc online | `dat-tiec.html` (form, thông tin, bản đồ) |
| (không có) | `gioi-thieu.html`, `cau-hoi-thuong-gap.html` (tìm không dấu), `chinh-sach.html`, `404.html` |

## Trước khi đưa lên mạng

- Toàn bộ là dữ liệu mẫu, cần thay bằng thông tin thật:
  - tên công ty, mã số thuế, địa chỉ, hotline, email;
  - sức chứa sảnh, giá thực đơn, ưu đãi;
  - tên nhân sự, cảm nhận của các cặp đôi;
  - lịch ngày còn trống.
- Ngày âm lịch trong `dates.js` là tính tay, nên đối chiếu lại với lịch vạn niên.
- Form đang mô phỏng gửi thành công. Gắn API bằng `data-endpoint="https://..."`: truyền `endpoint` cho `{{book-form}}` trong `src/partials/modal.html` và `src/pages/dat-tiec.html`.
- Link Zalo, Facebook, Instagram đang là liên kết mẫu.
- Ảnh lấy từ Unsplash (Unsplash License), đã tải về `assets/img/`. Nên thay bằng ảnh thật của từng sảnh, nhất là ảnh sảnh và ảnh cặp đôi ở phần cảm nhận.

## Bản trên ePod (luimiere.epodsystem.com)

Web đã được đưa lên ePod với giao diện y như bản HTML (theme 2941). Nội dung sửa trong quản trị ePod, không cần build lại:

| Muốn sửa | Sửa ở đâu trên ePod |
| --- | --- |
| 4 sảnh (số bàn, diện tích, ảnh, câu chuyện, điểm riêng) | Content ▸ Sảnh tiệc. Trang `/sanh` và `/sanh/<đường dẫn>` tự cập nhật |
| 4 thực đơn và giá | Content ▸ Thực đơn. Tab thực đơn, bảng dự toán, bảng giá ở trang sảnh tự tính lại |
| Ngày cưới còn trống | Content ▸ Lịch sảnh. Ô "Sảnh còn trống" ghi `etoile, soleil, lune, aube`, để trống = đã kín. Ngày đã qua tự ẩn |
| Đơn đặt lịch của khách | Content ▸ Forms ▸ Đặt lịch xem sảnh |
| Bài viết | Blog. Đường dẫn bài bắt đầu bằng `kinh-nghiem-`, `tin-tuc-` hoặc `su-kien-` để vào đúng chuyên mục |
| Trang Tiệc cưới, Hội nghị, Ưu đãi, Thư viện, Về Luimiere, Liên hệ, Hỏi đáp, Chính sách | Pages (mỗi khối là một section sửa được) |
| Menu | Menus: `luimiere-main`, `luimiere-mobile`, `footer-sanh`, `footer-dich-vu`, `footer-luimiere` |
| Hotline, địa chỉ, ảnh popup | Theme ▸ Footer. Hotline trong menu điện thoại: Theme ▸ Header |
