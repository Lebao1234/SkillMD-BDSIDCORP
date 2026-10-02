# DESIGN.md

Hệ thống thiết kế của Cổng thông tin Mạng lưới Cựu sinh viên Đại học Kinh tế Quốc dân.

Nguồn quy tắc, theo thứ tự ưu tiên:

1. **Đo trực tiếp từ <https://alumni.neu.edu.vn/>** ngày 17/09/2026. Bằng chứng lưu
   trong `.firecrawl/`: token thương hiệu, danh sách ảnh, HTML, CSS chủ đề và một
   ảnh chụp toàn trang.
2. `.claude/skills/design-system/SKILL.md`, skill của dự án.
3. `frontend-themes/CLAUDE.md`, quy ước dựng giao diện của kho mã này.
4. Skill `design-taste-frontend`, quy tắc chống giao diện AI generic.

Khi mâu thuẫn, **trang thật thắng**. Skill chống AI slop là bộ quy tắc cho một
trang dựng mới không có thương hiệu sẵn; ở đây đã có một trang thật để bám theo.

---

## Bản dựng đầu đã sai ở đâu

Bản đầu là một diễn giải hiện đại hóa: nền trắng thoáng, bo góc 12px, nhiều
khoảng trắng, một accent dùng dè dặt, hero ảnh lớn phủ gradient. Nó trông như
một trang SaaS chứ không như cổng thông tin của một trường đại học, và đó chính
là cảm giác "AI quá" mà người dùng chỉ ra.

Trang thật chạy trên nền tảng portal của VNPT. Ngôn ngữ thị giác của nó ngược lại
gần như hoàn toàn:

- **Khối màu đặc lớn.** Thanh điều hướng và khối tiêu điểm là những mảng xanh kín
  chiếm hết bề ngang, không phải đường viền nhạt trên nền trắng.
- **Góc vuông tuyệt đối.** Đo được bán kính 0 ở mọi thành phần.
- **Chữ hoa condensed** cho mọi nhãn, mục menu và tiêu đề khối.
- **Dày đặc thông tin.** Nhiều cột, nhiều mục trên một màn, cỡ chữ nhỏ.
- **Tiêu đề khối nằm trong một hộp xanh**, kèm thanh gạch chân kéo hết bề ngang cột.
- **Thân tin căn đều.**
- **Cặp nút tài khoản đỏ và xanh** đặt ngay trên thanh điều hướng.

---

## Đo được gì

| Thuộc tính | Giá trị đo | Dùng ở đâu |
| --- | --- | --- |
| `color.primary` | `#0076c0` | Nền thanh điều hướng, nền khối tiêu điểm, hộp tiêu đề, dải số liệu |
| `color.secondary` | `#ff0000` | Nút Đăng ký thành viên |
| `color.accent` và màu liên kết | `#1b7b57` | Liên kết trong nội dung, đường dẫn |
| `color.textPrimary` | `#444444` | Thân bài |
| `background` | `#ffffff` | Nền trang |
| `borderRadius` | `0px` | Mọi thành phần |
| `spacing.baseUnit` | `4px` | Thang khoảng cách |
| Họ chữ | Roboto Condensed, Roboto | Tiêu đề và thân bài |

Sáu phép kiểm trong bộ kiểm thử khoá ba màu này và ba token bán kính lại, nên
giao diện không thể lặng lẽ trôi về phong cách bo tròn ở lần sửa sau.

### Một chỗ cố ý lệch khỏi trang thật

Đỏ thương hiệu `#ff0000` với chữ trắng chỉ đạt tương phản 3.99:1, dưới ngưỡng
WCAG AA cho chữ thường. Nút dùng `#cc0000` để đạt 5.2:1, mắt thường vẫn đọc ra
cùng một màu đỏ. Giá trị gốc giữ nguyên ở token `--red-brand` cho các dùng không
phải chữ. SKILL.md đặt WCAG 2.2 AA là yêu cầu bắt buộc, nên chỗ này ưu tiên tiếp
cận hơn là sao chép tuyệt đối.

### Dial

| Dial | Giá trị | Lý do |
| --- | --- | --- |
| `DESIGN_VARIANCE` | 3 | Chế độ redesign giữ nguyên nhận diện. Bố cục bám lưới của trang gốc. |
| `MOTION_INTENSITY` | 2 | Trang gốc gần như không có chuyển động. Chỉ giữ hover và hiện dần khi cuộn. |
| `VISUAL_DENSITY` | 7 | Portal tin tức, nhiều cột, nhiều mục trên một màn. |

---

## Chữ

| Vai trò | Stack | Lý do |
| --- | --- | --- |
| Tiêu đề, nhãn, menu | `Roboto Condensed` | Đo được trên trang thật. Dùng chữ hoa cho nhãn và tiêu đề khối. |
| Thân bài, biểu mẫu | `Roboto` | Cùng siêu họ, cùng khung xương, chỉ khác bề ngang. Roboto Condensed với dấu tiếng Việt chồng tầng thì chật ở cỡ thân bài. |

Cả hai đều có subset `vietnamese`, nên dấu thanh lấy từ chính file font chứ không
rơi sang font dự phòng.

Thang chữ nhỏ hơn bản đầu khá nhiều: thân bài 14 tới 15px, tiêu đề khối 16px,
tiêu đề trang 20px. Trang gốc đặt gần như mọi thứ ở 16px trở xuống vì nó là
portal tin tức chứ không phải trang giới thiệu.

---

## Bố cục trang chủ

Theo đúng thứ tự của trang gốc:

1. **Dải banner** ba ảnh ngang.
2. **Cặp nút tài khoản**, đỏ và xanh nhạt, góc vuông.
3. **Thanh điều hướng** nền xanh đặc, chín mục cộng nút về trang chủ, có menu con đổ xuống.
4. **Dải tiêu đề** nền xanh, chữ hoa trắng.
5. **Khối tiêu điểm**: một mảng xanh chia ba cột. Cột trái rộng nhất mang thẻ dẫn
   ảnh lớn; cột giữa xếp chồng hai mục Chia sẻ và Hợp tác; cột phải là danh sách
   chân dung. Mỗi cột có đầu mục chữ hoa trắng gạch chân.
6. **Ba cột tin** nền trắng, mỗi cột có tiêu đề trong hộp xanh và danh sách hàng
   tin ảnh nhỏ bên trái, tiêu đề chữ hoa căn đều bên phải.
7. **Lưới chân dung** cựu sinh viên tiêu biểu, mười hai ô, ảnh dọc gạch chân xanh.
8. **Việc làm** nhóm theo lĩnh vực.
9. **Dải số liệu** nền xanh.
10. **Kêu gọi đăng ký** và **đơn vị liên kết**.

Container rộng 1350px, đúng như trang gốc, chứ không phải 1240px của bản đầu.

---

## Trạng thái bắt buộc cho mọi component

SKILL.md yêu cầu mọi component định nghĩa đủ: default, hover, focus-visible,
active, disabled, loading, error. `components.css` cài đặt đủ bảy trạng thái cho
nút, ô nhập, select, chip, card và bảng.

Ngoài ra mọi mặt danh sách đều có ba trạng thái nội dung:

- **có dữ liệu**
- **đang tải**: khung xương có hình dạng khớp kết quả thật, không phải con quay tròn
- **rỗng**: nói rõ vì sao rỗng và làm gì để hết rỗng, kèm một nút dẫn tới việc đó

---

## Tiếp cận (WCAG 2.2 AA, kiểm được bằng máy)

- Tương phản chữ thân từ 4.5:1. Nút xanh `#0076c0` với chữ trắng đạt 4.6:1, nút đỏ
  `#cc0000` đạt 5.2:1.
- `:focus-visible` hiện vòng 2px, offset 2px. Không bao giờ bỏ outline mà không
  thay bằng thứ khác.
- Mọi trang có liên kết bỏ qua tới `#main`.
- Menu con của thanh điều hướng mở bằng cả `:hover` lẫn `:focus-within`, nên đi
  bằng phím Tab vẫn vào được.
- Ngăn kéo, hộp thoại và đèn chiếu ảnh đều bẫy tiêu điểm, đóng bằng `Escape`, và
  trả tiêu điểm về đúng nơi vừa rời đi.
- Ảnh có `alt` thật. Ảnh trang trí dùng `alt=""`.
- Mọi ô nhập có nhãn đặt **trên** ô. Không bao giờ dùng placeholder thay nhãn. Lỗi
  hiện **dưới** ô và nối bằng `aria-describedby`.
- Mọi chuyển động nằm trong `@media (prefers-reduced-motion: no-preference)`.

Bốn quy tắc được kiểm bằng máy trên cả mười bảy trang: đúng một `h1`, mọi ảnh có
`alt`, mọi ô nhập có nhãn, và không có dấu gạch ngang dài.

---

## Chế độ sáng tối

Trang gốc chỉ có chế độ sáng. Bản này thêm chế độ tối vì skill yêu cầu, mặc định
theo `prefers-color-scheme` kèm nút chuyển thủ công. Xanh NEU sáng lên thành
`#3ea0e0` để đạt tương phản trên nền tối nhưng vẫn đọc ra màu của trường.

Chủ đề được áp bằng một đoạn script nội tuyến trong `<head>`, trước khi trang vẽ
lần đầu, nên không có cảnh lóe sáng rồi mới chuyển sang tối.

---

## Ảnh

Bản demo dùng **chính ảnh của trang gốc**, lấy từ kho công khai của nó và liệt kê
trong `tools/neu-images.json`. Lý do là yêu cầu trực tiếp: bản demo phải trông
đúng như trang sẽ thay thế nó, và ảnh phong cảnh ngẫu nhiên là thứ khiến bản đầu
trông giả.

Điều này có hai hệ quả phải nói rõ:

- Nó phụ thuộc vào máy chủ của bên thứ ba. Khi bàn giao, thay bằng thư viện ảnh
  của trường: chỉ cần đổi nội dung `tools/neu-images.json` rồi chạy lại
  `node tools/build-data.js`.
- Ảnh banner của trang gốc khá nặng, có tấm gần 3MB. Banner đầu tải ngay, hai
  banner sau để lười.

Khi máy không nối mạng hoặc ảnh hỏng, `ui.js` bắt sự kiện `error` ở giai đoạn
capture và thay bằng một hình hình học dựng theo màu thương hiệu, suy ra từ hạt
giống của chính mục đó. Nhờ vậy trang không bao giờ để lại ô ảnh vỡ.

**Chân dung chỉ gắn cho hồ sơ tiêu biểu.** Mười tám hồ sơ được đánh dấu tiêu biểu
có ảnh chân dung; phần còn lại dùng avatar chữ cái đầu, với màu suy ra từ chính
cái tên. Gán ảnh khuôn mặt cho mọi hồ sơ bịa là thông tin sai.

---

## Những điều cố ý không làm

- **Không một dấu gạch ngang dài nào.** Bộ kiểm thử kiểm điều này trên cả nội dung
  hiển thị lẫn mã nguồn HTML.
- Không bo góc ở đâu, trừ avatar tròn.
- Không glassmorphism, không gradient trang trí, không đổ bóng lớn.
- Không số liệu chính xác giả. Mọi con số trên trang chủ đều tính trực tiếp từ bộ
  dữ liệu lúc render, và bộ kiểm thử đối chiếu con số hiển thị với độ dài mảng.
- Không emoji trong giao diện.
- Tên người trong dữ liệu demo là tên Việt nghe được, không phải "Nguyễn Văn A".
- Tên doanh nghiệp là tên hư cấu, vì gắn một người bịa vào một tổ chức có thật là
  thông tin sai.

---

## Phạm vi của CMS

Skill `design-taste-frontend` tự ghi trong phần Out of scope rằng nó **không dành
cho dashboard và bảng dữ liệu**. Vì vậy `admin.html` không chạy theo skill đó. Nó
chạy theo SKILL.md của dự án: đặc hơn, bảng dữ liệu thật, thao tác hàng loạt,
trạng thái rỗng rõ ràng, và phân quyền hiển thị ngay trên giao diện.

Nó vẫn dùng chung bộ token và chung `components.css`, nên đây vẫn là một hệ thống
chứ không phải hai.
