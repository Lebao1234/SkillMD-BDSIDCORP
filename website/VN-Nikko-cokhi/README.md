# Website Công ty TNHH Cơ khí VN - NIKKO (bản demo)

Website giới thiệu doanh nghiệp cơ khí bằng HTML, CSS, JS thuần. Giao diện theo design system trong `.claude/skills/design-system` (mẫu cokhimori.com.vn: nhấn đỏ #de252c, bo góc 6px) kết hợp taste skill, theo phong cách website giới thiệu công ty:
- Doanh nghiệp: xưởng gia công inox, sắt theo đơn đặt hàng và hàng mẫu cho 6 mảng: gia dụng, dân dụng, nội thất, hàng 5S, hàng khu công nghiệp, chi tiết theo đơn. 4 ngành nghề đăng ký vẫn có trang riêng ở mục Lĩnh vực.
- Giao diện kiểu 2 (khách đã chọn): header thanh ngang toàn khổ có hotline; banner chia đôi, chữ bên trái, ảnh tràn mép phải kèm thẻ 6 mảng sản phẩm.
- Chữ Plus Jakarta Sans cho tiêu đề, Be Vietnam Pro cho nội dung (đều có tiếng Việt); tiêu đề cỡ vừa, nhãn viết thường, đường kẻ nhạt để giao diện nhẹ, không thô.
- Nền trắng xám lạnh, chữ than chì, một màu đỏ nhấn duy nhất.
- Trang chủ: banner chia đôi; giới thiệu ngắn; bento 6 mảng sản phẩm; hai vật liệu inox và sắt; năng lực gia công; dải tầm nhìn; con số; quy trình 7 bước; dải sản phẩm cuộn ngang; tin tức.

**Tên công ty viết "VN - NIKKO" (gạch ngắn có khoảng trắng)** thay cho gạch dài "VN – NIKKO", vì quy ước của các website này không dùng gạch dài. Cần viết đúng như giấy đăng ký kinh doanh thì sửa trong `src/data/site.js` và bỏ kiểm tra gạch dài trong `tools/build.js`.

## Xem website

Mở `index.html` bằng trình duyệt. Các file `.html` ở thư mục gốc là **file đã build**, không sửa trực tiếp.

## Sửa nội dung rồi build lại

```bash
node tools/build.js   # sinh lại toàn bộ trang + sitemap.xml
node tools/check.js   # kiểm tra link hỏng, anchor, ảnh thiếu alt, id trùng
```

| Muốn sửa | Sửa ở đâu |
| --- | --- |
| Tên, mã số thuế, địa chỉ, ngành nghề, hotline, email | `src/data/site.js` |
| 4 lĩnh vực (năng lực, phạm vi công việc, ứng dụng, hỏi đáp) | `src/data/services.js`. Bố cục trang: `src/templates/service.js` |
| 18 sản phẩm tiêu biểu (nhóm, vật liệu) | `src/data/products.js` |
| 6 mảng sản phẩm | `src/data/segments.js` |
| Bảng vật liệu và khối lượng riêng | `src/data/materials.js` |
| Quy trình 7 bước, danh mục thiết bị | mảng `PROCESS` và `EQUIP` trong `tools/build.js` |
| Bài viết kỹ thuật | `src/data/posts.js` |
| Menu, footer, khối đỏ "Gửi bản vẽ" | `src/partials/*.html` |
| Các trang còn lại | `src/pages/*.html` |

## Tính năng

- **4 tấm lĩnh vực ở trang Lĩnh vực:** rê chuột hoặc dùng phím Tab, tấm nào được chọn thì mở rộng.
- **Dải sản phẩm ở trang chủ:** cuộn ngang, có nút trước và sau.
- **Quy trình 7 bước:** ảnh và số bước đổi theo bước đang ở giữa màn hình.
- **Lọc sản phẩm** theo nhóm (6 mảng) và vật liệu (inox, sắt). Link `san-pham.html?nhom=5s` mở sẵn nhóm tương ứng.
- **Tính khối lượng phôi:**
  - hình dạng thanh tròn đặc, ống, tấm/khối;
  - 10 mác inox, thép và kim loại màu, nhập số lượng để tính tổng;
  - báo lỗi khi kích thước không hợp lệ, ví dụ đường kính trong lớn hơn đường kính ngoài.
- **Bảng cơ tính** inox SUS304, 201, 316, 430, thép SS400, SPCC, SGCC, S45C, nhôm, đồng theo JIS.
- **Form yêu cầu báo giá:**
  - đính kèm bản vẽ bằng nút chọn hoặc kéo thả; nhận PDF, DWG, DXF, STEP, ảnh; tối đa 5 tệp, mỗi tệp 20 MB;
  - kiểm tra số điện thoại, email, số lượng;
  - điền sẵn hạng mục khi mở từ trang lĩnh vực (?hm=), điền sẵn mã sản phẩm khi mở từ trang sản phẩm (?sp=).

## Trước khi đưa lên mạng

- **Thông tin thật do khách hàng cung cấp:** tên công ty, mã số thuế 0109788075, địa chỉ và 4 ngành nghề.
- **Dữ liệu mẫu, phải thay:**
  - hotline, email, mạng xã hội;
  - thông số năng lực (độ dày cắt laser, chiều dài chấn, số lượng tối thiểu);
  - danh mục và số lượng thiết bị;
  - sản phẩm tiêu biểu, tin tuyển dụng.
- **Ảnh** lấy từ Unsplash (Unsplash License), tải về `assets/img/`. Đây là ảnh minh họa, phải thay bằng ảnh thật của nhà xưởng và sản phẩm.
- **Bảng vật liệu** là giá trị tham khảo theo tiêu chuẩn. Kỹ sư của công ty nên đối chiếu trước khi đăng.
- **Sơ đồ đường đi** ở trang Liên hệ là hình minh họa, không theo tỷ lệ. Nút "Chỉ đường" mở Google Maps thật.
- **Form báo giá đang mô phỏng gửi thành công.** Gắn API bằng cách truyền `endpoint="https://..."` cho `{{rfq-form}}` trong `src/pages/bao-gia.html` và `src/pages/lien-he.html`. Tệp đính kèm được gửi dạng `multipart/form-data`.

## Đa ngôn ngữ (vi / en / ja / ko)

- Tiếng Việt ở thư mục gốc; bản dịch ở `en/`, `ja/`, `ko/` (cùng tên file). Mọi trang có nút chuyển ngôn ngữ, `hreflang`, canonical riêng; sitemap gồm cả 4 ngôn ngữ.
- Bản dịch nằm ở `src/i18n/<mã>.json` (chuỗi tiếng Việt -> bản dịch). Ký hiệu `<0>...</0>`, `<1/>` là thẻ HTML, phải giữ nguyên.
- Sửa nội dung tiếng Việt xong: `node tools/build.js --extract` để cập nhật `src/i18n/source.json`, build sẽ in ra các chuỗi còn thiếu bản dịch; thêm vào file json rồi chạy `node tools/i18n-check.js en` (ja, ko) để kiểm tra.
- Chuỗi trong JavaScript (lỗi form, máy tính khối lượng) dịch trong bảng `STR` đầu file `assets/js/main.js`.
