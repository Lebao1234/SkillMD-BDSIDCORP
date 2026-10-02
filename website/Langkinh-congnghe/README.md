# Website máy ảnh Lăng Kính

Website thương hiệu kiêm cửa hàng máy ảnh bằng HTML, CSS, JS thuần. Cấu trúc tham khảo fujifilm-x.com (dữ liệu bóc tách trong `.firecrawl/`): máy ảnh theo dòng, ống kính, công thức màu mô phỏng phim, câu chuyện nhiếp ảnh gia, hỗ trợ. Giao diện theo design system trong `.claude/skills/design-system` (nền đen, viền trắng, góc 2px, nút tròn 9999px) kết hợp taste skill: chữ Geist và Geist Mono (có tiếng Việt), một màu nhấn hổ phách #ffb020, giao diện khung ngắm máy ảnh.

## Xem website

Mở `index.html` bằng trình duyệt. Các file `.html` ở thư mục gốc là **file đã build**, không sửa trực tiếp.

## Sửa nội dung rồi build lại

```bash
node tools/build.js   # sinh lại toàn bộ trang + sitemap.xml
node tools/check.js   # kiểm tra link hỏng, anchor, ảnh thiếu alt, id trùng
```

| Muốn sửa | Sửa ở đâu |
| --- | --- |
| Hotline, email, 3 cửa hàng | `src/data/site.js` |
| 8 máy ảnh, 8 ống kính (giá, màu, gói kèm ống kính, thông số, điểm nổi bật) | `src/data/products.js`, bố cục `src/templates/product.js` |
| Câu chuyện nhiếp ảnh gia | `src/data/stories.js`, bố cục `src/templates/story.js` |
| 8 công thức màu | mảng `RECIPES` trong `assets/js/main.js` (bộ lọc CSS) |
| Menu, footer, ngăn giỏ hàng | `src/partials/*.html` |
| Các trang còn lại | `src/pages/*.html` |

## Tính năng

- **Hero khung ngắm:** màn trập mở, ô lấy nét dò rồi khóa, dải thông số phơi sáng. Bấm vào ảnh để "chụp", bộ đếm số ảnh giảm.
- **Vòng xoay chọn dòng máy** (Tinh, X, G), dùng được bằng phím mũi tên.
- **Phòng thử công thức màu:** 8 công thức, thanh kéo so sánh trước sau, 6 ảnh mẫu, thêm hạt phim.
- **Lá khẩu 9 lá** khép từ f/1.4 đến f/16 khi cuộn qua phần ống kính.
- **Giỏ hàng** (lưu trong trình duyệt), chọn màu và gói kèm ống kính, trang thanh toán có kiểm tra thông tin.
- **So sánh** tối đa 3 sản phẩm cùng loại, tô sáng dòng khác nhau.
- **Tính trả góp** 6 hoặc 12 tháng, lọc và sắp xếp sản phẩm, thanh mua hàng dính ở trang sản phẩm.

## Trước khi đưa lên mạng

- **Lăng Kính, các mẫu máy, ống kính, thông số, giá là dữ liệu mẫu.** Ảnh máy ảnh là ảnh minh họa từ Unsplash, một số ảnh thấy logo hãng khác. Thay bằng ảnh sản phẩm thật.
- Nhiếp ảnh gia và câu chuyện là hư cấu. Công thức màu trên web là mô phỏng bằng bộ lọc CSS.
- Form thanh toán đang mô phỏng gửi thành công. Gắn API bằng `data-endpoint="https://..."` trên thẻ `<form>` trong `src/pages/gio-hang.html`. Đăng ký nhận tin chưa gửi đi đâu.
- Chính sách là văn bản mẫu, cần rà soát pháp lý.
