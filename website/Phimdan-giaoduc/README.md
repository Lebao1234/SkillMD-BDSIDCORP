# Website Phím Đàn Piano Studio

Website dịch vụ dạy piano bằng HTML, CSS, JS thuần. Cấu trúc trang tham khảo onepiano.vn. Giao diện đã thiết kế lại theo taste skill: nền trắng, tiêu đề Bricolage Grotesque (có tiếng Việt), nội dung Be Vietnam Pro và màu cam #f26b22 giữ theo design system gốc, khung lồng hai lớp, menu nổi dạng viên thuốc, motif phím đàn (dải phím giờ học ở hero, viền phím ở thẻ CTA). Chữ cam nhỏ dùng #b8470a, tiêu đề cam dùng #e0560c để đủ tương phản trên nền trắng.

## Xem website

Mở `index.html` bằng trình duyệt. Các file `.html` ở thư mục gốc là **file đã build**, không sửa trực tiếp.

## Sửa nội dung rồi build lại

```bash
node tools/build.js   # sinh lại toàn bộ trang + sitemap.xml
node tools/check.js   # kiểm tra link hỏng, anchor, ảnh thiếu alt, id trùng
```

| Muốn sửa | Sửa ở đâu |
| --- | --- |
| Menu, logo | `src/partials/header.html` |
| Footer | `src/partials/footer.html` |
| Thẻ cam "21 ngày" có viền phím đàn trước footer | `src/partials/cta.html` |
| Popup đăng ký, nút nổi bên phải | `src/partials/modal.html` |
| Hotline, email, link Zalo | `src/data/site.js` |
| 4 trang chương trình | `src/data/programs.js` (nội dung), `src/templates/program.js` (bố cục) |
| Chi nhánh (danh sách đổi ảnh ở trang chủ, trang hệ thống, ô chọn trong form) | `src/data/branches.js` |
| Bài viết | `src/data/posts.js` |
| Các trang còn lại | `src/pages/*.html` |

Mọi nút có thuộc tính `data-open-register` sẽ mở popup đăng ký. Thêm `data-branch="Tên chi nhánh"` hoặc `data-need="..."` để điền sẵn vào form.

Token dùng được trong trang: `{{crumbs}}`, `{{branches limit="..." layout="scroll" id="..."}}`, `{{branch-list}}`, `{{program-panels}}`, `{{branch-count}}`, `{{branch-options}}`, `{{posts exclude="..." limit="..."}}`, `{{programs class="..."}}`, `{{hotline}}`, `{{hotline-tel}}`, `{{email}}`, `{{zalo}}`, `{{year}}`. Build dừng với lỗi nếu trang nào còn dấu gạch dài (en dash hoặc em dash), hãy dùng `-`.

## Danh sách trang

| Trang onepiano.vn | Trang Phím Đàn |
| --- | --- |
| Trang chủ | `index.html` |
| Về chúng tôi | `ve-chung-toi.html` |
| Chương trình Lớp Nhóm, Lớp 1-1, Phòng luyện đàn 997 | `lop-nhom.html`, `lop-1-1.html`, `phong-luyen-dan.html`, thêm `piano-thieu-nhi.html` và trang tổng `chuong-trinh.html` |
| (giá nằm rải rác) | `bang-gia.html` |
| Hệ thống trung tâm | `he-thong-trung-tam.html` (lọc theo phường) |
| Blog & Sự kiện | `bai-viet.html` + 6 bài viết |
| Câu hỏi thường gặp | `cau-hoi-thuong-gap.html` (có ô tìm kiếm, gõ không dấu vẫn tìm được) |
| Tuyển dụng | `tuyen-dung.html` |
| Chính sách | `chinh-sach.html`, `404.html` |

## Trước khi đưa lên mạng

- Cảm nhận học viên trên trang chủ (chú Bình, chị Ngọc Anh, Minh Khoa) và lịch lớp mẫu trong ô ứng dụng là dữ liệu mẫu, thay bằng nội dung thật.
- Thay dữ liệu mẫu: địa chỉ chi nhánh, học phí, số liệu, cột mốc, mã số doanh nghiệp, hotline.
- Form đang mô phỏng gửi thành công. Gắn API bằng `data-endpoint="https://..."` trên thẻ `<form>` trong `src/partials/modal.html` và `src/pages/index.html`.
- Link Zalo, mạng xã hội và nút tải ứng dụng đang là liên kết mẫu.
- Ảnh từ Unsplash (Unsplash License), đã tải về `assets/img/`. Ảnh chi nhánh hiện là ảnh phòng đàn minh họa, nên thay bằng ảnh thật của từng chi nhánh.
