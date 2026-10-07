# Website K-Lab's Sneaker Care

Website dịch vụ vệ sinh, phục hồi, sửa chữa giày và spa đồ hiệu. HTML, CSS, JS thuần. Cấu trúc tham khảo morino.vn. Giao diện đã được thiết kế lại theo taste skill: nền trắng toàn trang (section phụ xám rất nhạt #f5f5f4), Archivo cho toàn trang (biến `--font`, tiêu đề dùng bản rộng), giá và nhãn JetBrains Mono, một màu nhấn đỏ #f2523f (chữ đỏ trên nền trắng dùng #d0392a cho đủ tương phản), khung lồng hai lớp, menu nổi dạng viên thuốc. Font khác token gốc (Roboto) vì skill cấm Roboto cho giao diện cao cấp.

## Xem website

Mở `index.html` bằng trình duyệt. Các file `.html` ở thư mục gốc là **file đã build**, không sửa trực tiếp.

## Sửa nội dung rồi build lại

```bash
node tools/build.js   # sinh lại toàn bộ trang + sitemap.xml
node tools/check.js   # kiểm tra link hỏng, anchor, ảnh thiếu alt, id trùng
```

| Muốn sửa | Sửa ở đâu |
| --- | --- |
| Thanh cơ sở phía trên, menu, logo | `src/partials/header.html` |
| Footer | `src/partials/footer.html` |
| Dải đỏ "nhận giày tại nhà" trước footer | `src/partials/cta.html` |
| Popup đặt lịch, nút nổi Gọi / Zalo / Đặt lịch | `src/partials/modal.html` |
| Hotline, email, Zalo | `src/data/site.js` |
| 7 trang dịch vụ + bảng giá | `src/data/services.js` (giá, quy trình, hỏi đáp), `src/templates/service.js` (bố cục) |
| Cơ sở (thanh trên, footer, form, trang liên hệ) | `src/data/branches.js` |
| Sản phẩm | `src/data/products.js` |
| Bài blog | `src/data/posts.js` |
| Các trang còn lại | `src/pages/*.html` |

Nút có `data-open-booking` sẽ mở popup đặt lịch. Thêm `data-service="Tên dịch vụ"`, `data-branch="Nhận trả giày tại nhà"` hoặc `data-need="..."` để điền sẵn. Chọn "Nhận trả giày tại nhà" thì form tự hiện ô địa chỉ bắt buộc.

Token dùng được trong trang: `{{crumbs}}`, `{{services group="..." limit="..."}}`, `{{service-index}}`, `{{service-options}}`, `{{branches}}`, `{{branch-options}}`, `{{branch-count}}`, `{{topbar-branches}}`, `{{footer-branches}}`, `{{products limit="..."}}`, `{{price-groups}}`, `{{posts exclude="..." limit="..."}}`, `{{hotline}}`, `{{hotline-tel}}`, `{{email}}`, `{{zalo}}`, `{{year}}`. Build dừng với lỗi nếu trang nào còn dấu gạch dài (en dash hoặc em dash), hãy dùng `-`.

## Danh sách trang

| morino.vn | K-Lab's |
| --- | --- |
| Trang chủ | `index.html` |
| Dịch vụ giày (vệ sinh, custom, sửa chữa, repaint, nhuộm, dán đế) | `dich-vu.html` + `ve-sinh-giay`, `repaint-phuc-hoi-mau`, `dan-bao-ve-de`, `sua-chua-giay`, `chong-nuoc-nano`, `custom-giay` |
| Dịch vụ đồ hiệu cao cấp | `spa-tui-xach.html` |
| Bảng giá chi tiết (ảnh) | `bang-gia.html` (HTML, tự sinh từ dữ liệu dịch vụ) |
| Nhận trả giày tại nhà | `nhan-tra-tai-nha.html` |
| Sản phẩm | `san-pham.html` |
| Đào tạo nghề, nhượng quyền | `dao-tao.html` |
| Ảnh | `thu-vien.html` |
| Giới thiệu (câu chuyện, 6 giá trị cốt lõi, tầm nhìn) | `gioi-thieu.html` |
| Ưu đãi (tích điểm, VIP) | `uu-dai.html` |
| Blog | `blog.html` + 5 bài viết |
| Liên hệ | `lien-he.html` |
| Quy định sử dụng dịch vụ, bảo hành, bảo mật | `quy-dinh.html`, `404.html` |

## Trước khi đưa lên mạng

- **Ảnh trước/sau là ảnh minh họa** (hai đôi giày cùng mẫu nhưng không phải cùng một đôi). Thay bằng ảnh thật của cửa hàng, chụp cùng góc và cùng ánh sáng.
- Thay dữ liệu mẫu: địa chỉ và số điện thoại 4 cơ sở, giá dịch vụ, sản phẩm, số liệu, chương trình thành viên, học phí đào tạo, MST.
- Form đang mô phỏng gửi thành công. Gắn API bằng `data-endpoint="https://..."` trên thẻ `<form>` trong `src/partials/modal.html`, `src/pages/index.html`, `src/pages/lien-he.html`.
- Link Zalo, mạng xã hội đang là link mẫu. Quy định dịch vụ là văn bản mẫu, cần rà soát pháp lý.
- Ảnh từ Unsplash (Unsplash License), đã tải về `assets/img/`.
