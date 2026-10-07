# Các website

12 site tĩnh HTML/CSS/JS, tiếng Việt, không framework. Quy chuẩn giao diện: `../frontend-themes/CLAUDE.md`.
Chi tiết từng site (sửa gì ở đâu, token, danh sách trang): `README.md` trong thư mục site.

| Ngành | Site |
| --- | --- |
| Giáo dục | BBE-giaoduc, ISZ-giaoduc, Phimdan-giaoduc, CongthongtinNeu |
| Công nghệ | AttackK-congnghe, BeatBeat-congnghe, Langkinh-congnghe |
| Dịch vụ | 3DRoom-dichvu, K-Lab's-dichvu, Luimiere-dichvu, Nhatanthoi-dichvu |
| Cơ khí | VN-Nikko-cokhi (vi/en/ja/ko) |

`EnSchool-giaoduc` và `Phusong-congnghe` hiện đang trống.

## Quy trình build chung (10 site có `tools/build.js`)

Chỉ cần Node.js, không cần `npm install`.

```bash
node tools/build.js   # sinh lại toàn bộ trang HTML ở gốc site + sitemap.xml
node tools/check.js   # kiểm tra lỗi
```

- Sửa trong `src/`, không sửa file `.html` ở gốc site (bị ghi đè khi build).
  - `src/pages/*.html`: từng trang. Dòng đầu là `<!--meta {JSON}-->` với `title`, `description`, `nav`, `crumbs`,
    `cta` (một số site có thêm `image`, `preload`, `ogType`, `noindex`).
  - `src/partials/`: header, footer, form cuối trang...
  - `src/data/`, `src/templates/`: dữ liệu (khóa học, sản phẩm, bài viết) và bố cục sinh ra nhiều trang.
- Token trong trang có dạng `{{ten khoa="gia-tri"}}`. Mỗi site hỗ trợ bộ token riêng, xem README của site.
- `build.js` của mỗi site khác nhau, chỉ chung khung xử lý. Sửa một site không làm thay đổi site khác.
- **Dấu gạch dài:** build dừng nếu nội dung có `–` hoặc `—` (VN-Nikko thêm `―`). Dùng `-`. Khi dừng, các trang
  trước lỗi đã bị ghi lại còn `sitemap.xml` thì chưa, nên sửa xong phải build lại ngay.
- `check.js` (giống nhau ở 9 site, VN-Nikko có bản riêng quét thêm `en/`, `ja/`, `ko/`) báo: token `{{...}}` còn sót,
  id trùng, file local bị thiếu, `#anchor` không tồn tại, `<img>` thiếu `alt`. Nó không kiểm tra link ngoài,
  sitemap hay trang mồ côi.

## Hai site đi theo cách khác

- `CongthongtinNeu`: `node tools/build-data.js` (sinh `assets/data/`) rồi `node tools/build-pages.js` (sinh các trang
  trong + sitemap); `index.html` và `admin.html` viết tay. Kiểm tra bằng `node tools/smoke-test.js` (cần `jsdom`).
- `AttackK-congnghe`: HTML sửa trực tiếp, kiểm tra bằng `node tools/smoke-test.js` (cần `jsdom`). Các script
  `deploy-*`, `inspect-*`, `mcp.js` trong `tools/` đẩy giao diện lên ePod và đọc token từ `.mcp.json`.

## Bảo mật

File `.mcp.json` trong các site chứa token API: đã nằm trong `.gitignore`, không bao giờ commit.
