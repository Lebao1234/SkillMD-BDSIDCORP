# Website Hoa ngữ ISZ

Website giới thiệu trung tâm tiếng Trung bằng HTML, CSS, JS thuần. Cấu trúc trang tham khảo shz.edu.vn: chương trình, lịch khai giảng, du học, thư viện, chi nhánh, cảm nhận học viên.

Giao diện thiết kế lại theo taste skill:
- Nền sáng xám lạnh `#f6f8fa`, chữ `#34495e` / `#4a6074` và một màu nhấn đỏ `#d2232a`. Các màu này giữ theo design system gốc.
- Tiêu đề dùng Archivo (trục độ rộng `wdth`), nội dung dùng Plus Jakarta Sans, cả hai đủ dấu tiếng Việt. Font Inter của design system gốc đã được thay. Chữ Hán dùng Noto Serif SC.
- Khung ảnh lồng hai lớp, menu nổi dạng viên thuốc, icon Phosphor Light.

Motif ô chữ điền (田字格) và dấu triện đỏ:
- Ở trang chủ và thư viện, chữ Hán tự viết từng nét. Người xem bấm "Tự viết thử" để viết bằng chuột hoặc ngón tay, ô báo khi viết sai nét. Phần này dùng thư viện hanzi-writer, tải từ jsDelivr khi cần.
- Bảng 4 thanh điệu và thẻ từ đọc được tiếng Trung bằng giọng đọc có sẵn của trình duyệt.
- Bậc thang HSK tính số tuần, số buổi và học phí từ trình độ hiện tại đến mục tiêu.
- Bài kiểm tra trình độ 12 câu gợi ý lớp phù hợp và điền sẵn kết quả vào form đăng ký.

## Xem website

Mở `index.html` bằng trình duyệt. Các file `.html` ở thư mục gốc là **file đã build**, không sửa trực tiếp. Ô chữ điền và font cần kết nối mạng. Khi không có mạng, ô chữ điền hiện chữ tĩnh.

## Sửa nội dung rồi build lại

```bash
node tools/build.js   # sinh lại toàn bộ trang + sitemap.xml
node tools/check.js   # kiểm tra link hỏng, anchor, ảnh thiếu alt, id trùng
```

| Muốn sửa | Sửa ở đâu |
| --- | --- |
| Menu, logo | `src/partials/header.html` |
| Footer | `src/partials/footer.html` |
| Khối đỏ "Ngồi thử một buổi" trước footer | `src/partials/cta.html` |
| Popup đăng ký, nút gọi/Zalo nổi | `src/partials/modal.html`. Các ô của form nằm ở hàm `regForm` trong `tools/build.js` |
| Hotline, email, Zalo, mạng xã hội, tên công ty | `src/data/site.js` |
| 6 chương trình (khóa, học phí, cam kết, một buổi học, hỏi đáp) | `src/data/programs.js`. Bố cục trang: `src/templates/program.js` |
| Lịch khai giảng | `src/data/classes.js`. Cập nhật tay mỗi tuần; lớp đã khai giảng tự ẩn |
| 7 cơ sở | `src/data/branches.js` |
| Giáo viên | `src/data/teachers.js` |
| Cảm nhận học viên | `src/data/reviews.js` (`home: true` = hiện ở trang chủ) |
| Chữ trong ô chữ điền, thanh điệu, thẻ từ, bộ thủ, câu hỏi kiểm tra | `src/data/learn.js` |
| Bài viết | `src/data/posts.js` |
| Các trang còn lại | `src/pages/*.html` |

Mọi nút có `data-open-reg` đều mở popup đăng ký. Có thể thêm các thuộc tính sau để điền sẵn form:
- `data-program="Luyện thi HSK"`
- `data-branch="ISZ Bến Thành"`
- `data-note="..."`

Trang lịch khai giảng nhận tham số `?ct=hsk` (chương trình) và `?cs=ben-thanh` (cơ sở).

Token dùng được trong trang (`src/pages/*.html` và partials): `{{crumbs}}`, `{{hanzi-pad}}`, `{{tzg char="..." class="..." animate="1"}}`, `{{tone-lab}}`, `{{program-index}}`, `{{program-grid}}`, `{{program-drop}}`, `{{program-options}}`, `{{program-select}}`, `{{branch-options}}`, `{{branch-select}}`, `{{hsk-stairs}}`, `{{session-tabs}}`, `{{classes program="..." limit="..."}}`, `{{class-count}}`, `{{teachers keys="..." id="..."}}`, `{{teacher-grid}}`, `{{reviews home="1"}}`, `{{branches}}`, `{{branch-lines}}`, `{{branch-count}}`, `{{posts exclude="slug" limit="..." class="..."}}`, `{{reg-form id="..." endpoint="..."}}`, `{{decks}}`, `{{radicals}}`, `{{quiz}}`, `{{quiz-count}}`, `{{hotline}}`, `{{hotline-tel}}`, `{{mobile}}`, `{{mobile-tel}}`, `{{email}}`, `{{hours}}`, `{{zalo}}`, `{{facebook}}`, `{{youtube}}`, `{{tiktok}}`, `{{legal}}`. Token không có trong danh sách được giữ nguyên trong HTML. Build dừng với lỗi nếu trang nào còn dấu gạch dài (en dash hoặc em dash), hãy dùng `-`.

## Danh sách trang

| Trang shz.edu.vn | Trang ISZ |
| --- | --- |
| Trang chủ | `index.html` |
| Chương trình (HSK, giao tiếp, thiếu nhi, online, doanh nghiệp, thư pháp) | `chuong-trinh.html` (bảng so sánh, tính lộ trình HSK) và 6 trang chương trình |
| Lịch khai giảng | `lich-khai-giang.html` (lọc theo chương trình, cơ sở, ngày học) |
| (không có) | `kiem-tra-trinh-do.html` (12 câu, gợi ý lớp) |
| Du học | `du-hoc-trung-quoc.html` |
| Thư viện | `thu-vien.html` (thanh điệu, thẻ từ, bộ thủ, thứ tự nét) |
| Tin tức | `bai-viet.html` và 6 bài viết |
| Chi nhánh | `chi-nhanh.html` (lọc theo khu vực) |
| Về SHZ, Cảm nhận học viên | `ve-isz.html`, `cam-nhan-hoc-vien.html` |
| Tuyển dụng | `tuyen-dung.html` |
| (không có) | `cau-hoi-thuong-gap.html` (tìm không dấu), `chinh-sach.html`, `404.html` |

## Trước khi đưa lên mạng

- Toàn bộ là dữ liệu mẫu, cần thay bằng thông tin thật:
  - tên công ty, mã số thuế, địa chỉ 7 cơ sở, hotline, email;
  - học phí, lịch khai giảng, số liệu (68.400+ học viên, 91,6%, kết quả các kỳ thi);
  - tên, bằng cấp giáo viên; cảm nhận và điểm thi học viên;
  - câu chuyện thành lập, các cam kết hoàn phí.
- Lịch thi HSK, yêu cầu học bổng và chi phí du học trong bài viết là thông tin tham khảo, cần kiểm tra lại với nguồn chính thức trước khi đăng.
- Form đang mô phỏng gửi thành công. Gắn API bằng `endpoint`: truyền `endpoint="https://..."` cho `{{reg-form}}` trong `src/partials/modal.html`.
- Link Zalo, Facebook, YouTube, TikTok đang là liên kết mẫu.
- Ảnh lấy từ Unsplash (Unsplash License), đã tải về `assets/img/` (42 ảnh jpg, khoảng 9,5 MB; thư mục có 43 tệp vì thêm `favicon.svg`). Nên thay bằng ảnh thật của lớp học, cơ sở và giáo viên.
