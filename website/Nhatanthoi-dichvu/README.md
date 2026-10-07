# Website tiệm cho thuê áo dài Nhã An Thời

Website giới thiệu dịch vụ cho thuê áo dài bằng HTML, CSS, JS thuần. Cấu trúc danh mục và nội dung tham khảo aodainhaann.com (dữ liệu bóc tách trong `.firecrawl/`). Giao diện theo design system trong `.claude/skills/design-system` (chữ nâu #312a29, kem #fce5c6) kết hợp taste skill: nền trắng, tiêu đề Playfair Display, nội dung Be Vietnam Pro, 1 màu nhấn đỏ son #9e2a2b, ảnh đặt trong khung vòm cửa, giá treo áo mới về.

Font Lato của design system không có bộ ký tự tiếng Việt trên Google Fonts nên được thay bằng Be Vietnam Pro.

## Xem website

Mở `index.html` bằng trình duyệt. Các file `.html` ở thư mục gốc là **file đã build**, không sửa trực tiếp.

## Sửa nội dung rồi build lại

```bash
node tools/build.js   # sinh lại toàn bộ trang + sitemap.xml
node tools/check.js   # kiểm tra link hỏng, anchor, ảnh thiếu alt, id trùng
```

| Muốn sửa | Sửa ở đâu |
| --- | --- |
| Tên tiệm, hotline, địa chỉ, giờ mở cửa | `src/data/site.js` |
| 7 bộ sưu tập (cưới, bà sui, bê quả, đi tiệc, Việt phục, nam, phụ kiện) | `src/data/collections.js`, bố cục `src/templates/collection.js` |
| 34 mẫu áo (tên, giá thuê, tiền cọc, size, chất liệu, ảnh) | `src/data/products.js`, bố cục `src/templates/product.js` |
| Bài viết | `src/data/posts.js` |
| Menu, footer, khối đặt lịch thử áo | `src/partials/*.html` |
| Các trang còn lại | `src/pages/*.html` |

Thêm mẫu áo mới: thêm 1 dòng vào `products.js`, đặt `isNew: true` để hiện trên giá treo "Mới treo lên tuần này", rồi build lại.

Token dùng được trong trang: `{{crumbs}}`, `{{products col="..." new="1" exclude="..." limit="..." class="..."}}`, `{{rail}}`, `{{occasions}}`, `{{collection-chips}}`, `{{occasion-options}}`, `{{posts exclude="..." limit="..."}}`, `{{product-count}}`, `{{booking}}`, `{{hotline}}`, `{{hotline-tel}}`, `{{email}}`, `{{zalo}}`, `{{address}}`, `{{hours}}`, `{{map-q}}`, `{{year}}`. Build dừng với lỗi nếu trang nào còn dấu gạch dài (en dash hoặc em dash), hãy dùng `-`.

## Danh sách trang

55 file `.html` ở thư mục gốc:

| Nhóm | Trang |
| --- | --- |
| Trang chính | `index.html`, `bo-suu-tap.html`, `bang-gia.html`, `chon-size.html`, `dat-lich.html`, `gioi-thieu.html`, `lien-he.html`, `quy-dinh.html`, `bai-viet.html`, `404.html` |
| Bộ sưu tập (7 trang sinh từ `collections.js`) | `ao-dai-cuoi.html`, `ao-dai-ba-sui.html`, `ao-dai-be-qua.html`, `ao-dai-di-tiec.html`, `viet-phuc.html`, `ao-dai-nam.html`, `phu-kien.html` |
| Mẫu áo cưới (5) | `co-dau-do-hy-hoa.html`, `cap-do-tuong-chau.html`, `cap-kem-hao-nhien.html`, `co-dau-trang-bach-an.html`, `cap-do-dao-lien.html` |
| Mẫu áo bà sui (3) | `sui-xanh-thanh-hac.html`, `sui-den-ngoc-lan.html`, `gam-ha-vy.html` |
| Mẫu áo bê quả (2) | `be-qua-hong-truc-dao.html`, `be-qua-kem-nhuoc-van.html` |
| Mẫu áo đi tiệc (12) | `suong-do-man-dao.html`, `truyen-thong-trang-ngoc.html`, `kem-truc-nguyet.html`, `suong-trang-bach-lien.html`, `xanh-lam-y.html`, `cach-tan-hong-mac-uyen.html`, `doi-ban-than-do-mint.html`, `suong-do-cuc-hoa.html`, `gam-hong-hoa-nhi.html`, `trang-non-la-sen.html`, `kem-hoa-thuy-moc.html`, `trang-tuyet-lien.html` |
| Áo dài nam (5) | `nam-xam-phong-vu.html`, `nam-xanh-la-dac-ky.html`, `nam-xanh-lam-van-long.html`, `nam-do-dan-moc.html`, `nam-bac-minh-triet.html` |
| Việt phục (5) | `nhat-binh-lam-dang.html`, `nhat-binh-do-phuong-cac.html`, `ao-tac-doi-lam-truc.html`, `ngu-than-nhom-hoi-an.html`, `ngu-than-vang-dang-hoa.html` |
| Phụ kiện (2) | `quat-giay-cuc-vang.html`, `quat-lua-hoa-dao.html` |
| Bài viết (4 trang sinh từ `posts.js`) | `thue-ao-dai-cuoi-can-biet.html`, `chon-ao-dai-ba-sui.html`, `chup-anh-ao-dai-pho-co.html`, `viet-phuc-khac-ao-dai.html` |

## Tính năng

- **Túi thử đồ:** khách bấm "Thêm vào túi thử" ở mẫu áo, danh sách được lưu trong trình duyệt của khách và tự điền vào form đặt lịch thử áo.
- **Chọn size:** gợi ý size theo chiều cao, cân nặng, có bảng số đo nữ S-3XL và nam S-XXL.
- **Lọc, sắp xếp:** lọc theo dịp hoặc kiểu áo, sắp xếp theo giá.
- **Form đặt lịch:** kiểm tra ngày thử không ở quá khứ, ngày mặc phải sau ngày thử.

## Lớp cổ kính và chuyển động

- Hoa văn hồi văn dưới đầu mỗi trang con và trên footer, con dấu triện đỏ son ở hero, chữ dọc cạnh khung vòm, nhãn "Chương một... Chương năm" cho các phần trang chủ, nền giấy có hạt mịn.
- Tiêu đề trồi lên từng từ, ảnh vòm mở như vén rèm, cánh hoa đào rơi ở hero, dải lụa đỏ chữ chạy, giá treo áo đung đưa, ánh lụa lướt qua ảnh khi rê chuột, thanh tiến độ đọc trên cùng.
- Phần "Từ tấm vải đến tà áo": cuộn tới đâu, ảnh lụa, gấm, nhung đổi theo đó và sợi chỉ đỏ được vẽ dần (desktop).
- Người dùng bật "giảm chuyển động" trong hệ điều hành sẽ thấy trang tĩnh, đầy đủ nội dung.

## Trước khi đưa lên mạng

- **Ảnh là ảnh minh họa từ Unsplash**, không phải áo của tiệm. Thay bằng ảnh chụp áo thật (cùng tên file trong `assets/img/` hoặc sửa `img` trong `products.js`).
- Tên tiệm, địa chỉ, hotline, giá, tiền cọc, số liệu, câu chuyện, cảm nhận khách là dữ liệu mẫu.
- Form đang mô phỏng gửi thành công. Gắn API bằng `data-endpoint="https://..."` trên thẻ `<form>` trong `src/partials/cta.html`.
- Quy định thuê áo là văn bản mẫu, cần rà soát trước khi công bố.
