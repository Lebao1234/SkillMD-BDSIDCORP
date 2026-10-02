# Website Trung tâm Anh ngữ BBE

Website tĩnh HTML, CSS, JS. Không cần framework. Cấu trúc trang tham khảo wallstreetenglish.com. Giao diện đã thiết kế lại theo taste skill: nền trắng, tiêu đề Lexend (có tiếng Việt), nội dung Noto Sans và màu navy #003359 + đỏ #de1135 giữ theo design system gốc, khung lồng hai lớp, menu nổi dạng viên thuốc, motif bong bóng hội thoại (hero, cảm nhận dạng tin nhắn) và bậc thang CEFR A1-C2 dưới hero.

## Xem website

Mở `index.html` bằng trình duyệt. Các file `.html` ở thư mục gốc là **file đã build**, không sửa trực tiếp.

## Sửa nội dung rồi build lại

```bash
node tools/build.js   # sinh lại toàn bộ trang HTML + sitemap.xml
node tools/check.js   # kiểm tra link hỏng, anchor, ảnh thiếu alt, id trùng
```

Chỉ cần Node.js, không cần `npm install`.

| Muốn sửa | Sửa ở đâu |
| --- | --- |
| Menu, logo | `src/partials/header.html` (ưu đãi tháng đặt ở nhãn đầu hero trong `src/pages/index.html`) |
| Footer | `src/partials/footer.html` |
| Form đăng ký cuối mỗi trang | `src/partials/cta.html` |
| Hotline, email, tên miền | `src/data/site.js` |
| 5 trang khóa học | `src/data/courses.js` (nội dung), `src/templates/course.js` (bố cục) |
| Lịch khai giảng (trang chủ, trang khóa học, trang lịch) | `src/data/schedule.js` |
| Bài viết tin tức | `src/data/posts.js` |
| Các trang còn lại | `src/pages/*.html` |

Dòng đầu mỗi file trong `src/pages` là thông tin trang dạng JSON: `title`, `description`, `nav` (mục menu được tô đậm), `crumbs` (breadcrumb), `"cta": false` để ẩn form đăng ký cuối trang.

Token dùng được trong trang: `{{crumbs}}`, `{{schedule category="ielts" limit="3"}}`, `{{courses}}`, `{{posts limit="3"}}`, `{{post-lead}}`, `{{hotline}}`, `{{email}}`.

Build sẽ báo lỗi nếu nội dung chứa dấu gạch dài (– hoặc —). Hãy dùng dấu `-`.

## Danh sách trang

| Nhóm | Trang |
| --- | --- |
| Trang chủ | `index.html` |
| Phương pháp | `phuong-phap.html`, `giao-vien.html`, `lich-khai-giang.html` |
| Khóa học | `khoa-hoc.html`, `khoa-hoc-thieu-nhi.html`, `khoa-hoc-thieu-nien.html`, `khoa-hoc-ielts.html`, `khoa-hoc-giao-tiep.html`, `khoa-hoc-doanh-nghiep.html` |
| Học phí | `hoc-phi.html`, `uu-dai.html` |
| Tài nguyên | `kiem-tra-trinh-do.html` (bài test tương tác), `trinh-do-cefr.html`, `tin-tuc.html` + 6 bài viết `bai-viet-*.html` |
| Về BBE | `gioi-thieu.html`, `cam-nhan.html`, `co-so.html`, `tuyen-dung.html`, `lien-he.html` |
| Khác | `chinh-sach-bao-mat.html`, `404.html`, `sitemap.xml` |

## Trước khi đưa lên mạng

- Thay dữ liệu mẫu: số liệu, học phí, lịch khai giảng, địa chỉ, tên và ảnh giáo viên, lời cảm nhận, điểm thi, ưu đãi.
- Form đang mô phỏng gửi thành công. Gắn API bằng cách điền `data-endpoint="https://..."` vào thẻ `<form>` trong `src/partials/cta.html` và `src/pages/lien-he.html`. Dữ liệu được gửi dạng JSON.
- Link mạng xã hội trong footer và Zalo trong trang liên hệ đang là `#`.
- Chính sách bảo mật là văn bản mẫu, cần rà soát pháp lý.
- Ảnh lấy từ Unsplash (giấy phép Unsplash License), đã tải về `assets/img/`.
