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
