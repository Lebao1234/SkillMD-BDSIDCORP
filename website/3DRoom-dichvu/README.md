# Website Xưởng in 3D 3DRoom

Website dịch vụ in 3D bằng HTML, CSS, JS thuần. Cấu trúc trang và nội dung dịch vụ tham khảo 3dcubix.vn (dữ liệu bóc tách nằm trong `.firecrawl/`). Giao diện theo design system trong `.claude/skills/design-system` (Plus Jakarta Sans, màu teal #036080) kết hợp taste skill: nền trắng, IBM Plex Mono cho thông số, lưới bàn in, khung ảnh kỹ thuật, menu nổi.

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
| Footer, nút nổi Gọi / Zalo / Gửi file | `src/partials/footer.html` |
| Khối "Gửi file nhận báo giá" cuối mỗi trang | `src/partials/cta.html` |
| Hotline, email, Zalo, địa chỉ 2 xưởng | `src/data/site.js` |
| 8 trang dịch vụ (FDM, SLA, SLS, SLM, scan, thiết kế, hoàn thiện, quà tặng) | `src/data/services.js` (nội dung, thông số), `src/templates/service.js` (bố cục) |
| 15 vật liệu và đơn giá dùng cho công cụ ước tính | `src/data/materials.js` |
| Dự án | `src/data/projects.js` |
| Bài viết | `src/data/posts.js` |
| Các trang còn lại | `src/pages/*.html` |

Token dùng được trong trang: `{{crumbs}}`, `{{services group="..." exclude="..." limit="..." class="..."}}`, `{{service-options}}`, `{{materials tech="..."}}`, `{{materials-json}}`, `{{projects limit="..."}}`, `{{posts exclude="..." limit="..."}}`, `{{offices}}`, `{{footer-offices}}`, `{{quote-form}}`, `{{hotline}}`, `{{hotline-tel}}`, `{{email}}`, `{{zalo}}`, `{{year}}`. Build dừng với lỗi nếu trang nào còn dấu gạch dài (en dash hoặc em dash), hãy dùng `-`.

## Danh sách trang

| 3dcubix.vn | 3DRoom |
| --- | --- |
| Trang chủ | `index.html` |
| Dịch vụ in 3D FDM, SLA, SLS, SLM | `dich-vu.html` + `in-3d-fdm`, `in-3d-sla`, `in-3d-sls`, `in-3d-slm` |
| Scan 3D, Thiết kế mẫu 3D, Hoàn thiện sản phẩm, Quà tặng in 3D | `scan-3d`, `thiet-ke-3d`, `hoan-thien-san-pham`, `qua-tang-in-3d` |
| Giá in 3D | `bang-gia.html` (có công cụ ước tính giá) |
| Vật liệu in 3D | `vat-lieu.html` (lọc theo công nghệ) |
| Báo giá trực tuyến | `bao-gia.html` (kéo thả file) |
| Dự án đã thực hiện | `du-an.html` (lọc theo ngành) |
| Blog | `blog.html` + 4 bài viết |
| Giới thiệu, Liên hệ, Tuyển dụng, Chính sách | `gioi-thieu.html`, `lien-he.html`, `tuyen-dung.html`, `chinh-sach.html`, `404.html` |

Phần máy in 3D bán lẻ của 3dcubix.vn không đưa vào vì đây là website dịch vụ.

## Trước khi đưa lên mạng

- Tên 3DRoom, địa chỉ, hotline, số liệu xưởng (46 máy, 12.400 đơn...), lịch sử, dự án và giá là **dữ liệu mẫu**. Thay bằng thông tin thật.
- Ảnh dự án đang là ảnh minh họa từ Unsplash, nên thay bằng ảnh thật sản phẩm của xưởng.
- Form báo giá đang mô phỏng gửi thành công. Gắn API bằng `data-endpoint="https://..."` trên thẻ `<form>` trong `src/partials/cta.html`. Form gửi `multipart/form-data` kèm file.
- Link mạng xã hội là link mẫu. Chính sách là văn bản mẫu, cần rà soát pháp lý.
- Ảnh từ Unsplash (Unsplash License), đã tải về `assets/img/`.
