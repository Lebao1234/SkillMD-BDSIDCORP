# Cổng thông tin Mạng lưới Cựu sinh viên NEU

Bản demo đầy đủ chức năng cho cổng thông tin cựu sinh viên Đại học Kinh tế Quốc dân.

Giao diện bám theo trang thật tại <https://alumni.neu.edu.vn/>: cùng bảng màu, cùng
cấu trúc menu, cùng lối bố cục portal khối xanh góc vuông, và dùng chính ảnh của
trang đó. Phần bổ sung là các tính năng mà trang hiện tại chưa có.

Mười bảy trang tiếng Việt, 156 hồ sơ cựu sinh viên, 32 bài viết, 14 sự kiện, 12 bộ tư
liệu, 20 tin tuyển dụng, và một CMS quản trị có phân quyền.

Dựng bằng HTML, CSS và JavaScript thuần, không có bước build và không có framework.

Quy tắc thiết kế nằm trong `.claude/skills/design-system/SKILL.md`. Cách áp dụng được
ghi trong [DESIGN.md](DESIGN.md).

---

## Chạy

Mở `index.html` bằng trình duyệt là chạy được ngay. Trang hoạt động từ hệ thống tệp:
dữ liệu đóng gói thành `assets/data/*.js` thay vì JSON, đúng là để không bao giờ cần
`fetch`, thứ mà trình duyệt chặn trên `file://`.

Một máy chủ cục bộ vẫn dễ chịu hơn:

```bash
cd website/CongthongtinNeu
python -m http.server 5180
# rồi mở http://localhost:5180
```

Hai thứ tải từ CDN: Google Fonts (Roboto Condensed và Roboto) và biểu tượng Phosphor
Light từ jsDelivr. Khi ngoại tuyến, trang rơi về font hệ thống, biểu tượng không hiện,
ảnh minh họa được thay bằng hình dựng sẵn theo màu thương hiệu, và mọi thứ còn lại vẫn
chạy.

---

## Các trang

| Tệp | Nội dung |
| --- | --- |
| `index.html` | Trang chủ. Banner, khối tiêu điểm ba cột, ba cột tin, lưới chân dung, việc làm, số liệu, đơn vị liên kết |
| `tin-tuc.html` | Tin tức. Lọc theo danh mục và thẻ, tìm theo từ khóa, sắp xếp, phân trang |
| `cau-chuyen.html` | Câu chuyện Alumni. Một bài nổi bật cộng lưới thẻ, tìm theo tên nhân vật |
| `bai-viet.html` | Trang đọc bài, dùng chung cho tin tức và câu chuyện |
| `alumni.html` | Danh bạ. Lọc theo khóa, ngành, lĩnh vực, nơi công tác, cố vấn |
| `ho-so.html` | Hồ sơ cựu sinh viên, hiển thị theo phạm vi công khai chủ hồ sơ chọn |
| `ky-niem.html` | Kho kỷ niệm. Lọc theo loại tư liệu và theo năm |
| `album.html` | Album ảnh với đèn chiếu, cộng tư liệu tải về |
| `su-kien.html` | Lịch sự kiện. Sắp diễn ra, đã diễn ra, và những gì tôi đã đăng ký |
| `su-kien-chi-tiet.html` | Chi tiết sự kiện và biểu mẫu đăng ký tham gia |
| `nghe-nghiep.html` | Tin tuyển dụng. Lọc nhiều mặt, chi tiết mở trong ngăn kéo |
| `dang-ky.html` | Đăng ký cựu sinh viên. Ba bước, có chọn phạm vi công khai từng trường |
| `dong-gop.html` | Gửi câu chuyện, ảnh, tư liệu hoặc tin tuyển dụng cho ban quản trị |
| `tim-kiem.html` | Tìm kiếm toàn trang, kết quả nhóm theo loại |
| `gioi-thieu.html` | Giới thiệu chung, lịch sử phát triển, cơ cấu tổ chức, liên hệ |
| `tai-khoan.html` | Hồ sơ, phạm vi công khai, sự kiện đã đăng ký, nội dung đã gửi |
| `admin.html` | CMS quản trị, có phân quyền Quản trị viên và Biên tập viên |

---

## Chức năng

**Trang chủ.** Dựng lại theo đúng thứ tự khối của trang gốc: dải banner, cặp nút tài
khoản đỏ và xanh, thanh điều hướng xanh đặc có menu con, dải tiêu đề, khối tiêu điểm
ba cột trên nền xanh, ba cột tin với tiêu đề trong hộp xanh, lưới chân dung cựu sinh
viên tiêu biểu, việc làm nhóm theo lĩnh vực, dải số liệu, và đơn vị liên kết.

**Tin tức và câu chuyện.** Lọc theo danh mục và thẻ, tìm theo từ khóa có bỏ dấu, sắp xếp
ba kiểu, phân trang. Mọi trạng thái nằm trong query string, nên một danh sách đã lọc gửi
được cho người khác và nút Quay lại hoạt động đúng.

**Danh bạ.** Lọc theo khóa, ngành đào tạo, lĩnh vực nghề nghiệp, nơi công tác, và lọc
riêng người nhận làm cố vấn. Bộ đếm cạnh mỗi lựa chọn tính trên tập đã lọc bởi các mặt
khác, nên bộ lọc không bao giờ mời một lựa chọn dẫn tới không kết quả nào. Sắp theo tên
dùng chữ cuối, đúng cách người Việt sắp tên.

**Phạm vi công khai.** Mỗi cựu sinh viên chọn ai được thấy trường nào: công khai, chỉ
thành viên, hoặc riêng tư. Trường bị ẩn không biến mất lặng lẽ, nó nói ra rằng nó đang
bị ẩn và nói vì sao. Mặc định của hệ thống là dè dặt: điện thoại riêng tư, email chỉ
thành viên.

**Kỷ niệm.** Album ảnh, video và kỷ yếu đã số hóa, lọc theo năm và theo khóa. Đèn chiếu
ảnh bẫy tiêu điểm, chuyển ảnh bằng phím mũi tên, đóng bằng `Escape`.

**Sự kiện.** Lịch sắp diễn ra và đã diễn ra, thanh chỗ ngồi còn lại, biểu mẫu đăng ký có
kiểm tra từng trường, mã xác nhận, và nút hủy đăng ký.

**Nghề nghiệp.** Bảng việc làm nhóm theo lĩnh vực, lọc theo cấp bậc, hình thức và nơi
làm việc. Chi tiết mở trong ngăn kéo và ghi vào URL, nên gửi được một vị trí cụ thể.

**Đóng góp nội dung.** Bốn loại nội dung, nhãn biểu mẫu đổi theo loại được chọn, và bài
gửi vào thẳng hàng chờ duyệt của CMS.

**CMS.** Bảng dữ liệu cho bài viết, sự kiện, album, tuyển dụng và hồ sơ cựu sinh viên,
có tìm kiếm, chọn hàng loạt, hộp thoại soạn thảo và xóa. Hàng chờ duyệt nội dung gửi
lên. Quản lý người dùng và đổi vai trò. Bảng phân quyền. Sao lưu, khôi phục và đặt lại.

**Tìm kiếm toàn trang.** Một chỉ mục phẳng gồm hồ sơ, tin tức, câu chuyện, sự kiện,
album và việc làm. Gõ không dấu vẫn ra kết quả có dấu: tìm "nguyen van" ra "Nguyễn Văn".
Kết quả nhóm theo loại, từ khóa khớp được bôi vàng.

**Responsive.** Mọi lưới nhiều cột đều khai báo rõ cách sắp lại dưới 768px. Nav thu về
ngăn kéo dưới 1200px. Thanh lọc bên thu vào một nút dưới 1000px. Thanh bên CMS trượt ra
như ngăn kéo dưới 900px.

**Chế độ sáng tối.** Mặc định theo hệ thống, kèm nút chuyển thủ công, áp trước khi trang
vẽ lần đầu nên không lóe sáng.

---

## Cấu trúc

```
index.html  tin-tuc.html  cau-chuyen.html  bai-viet.html
alumni.html  ho-so.html  ky-niem.html  album.html
su-kien.html  su-kien-chi-tiet.html  nghe-nghiep.html
dang-ky.html  dong-gop.html  tim-kiem.html  tai-khoan.html
gioi-thieu.html  admin.html

robots.txt   sitemap.xml

assets/
  css/
    tokens.css       token thiết kế, file duy nhất chứa mã màu thô
    base.css         reset, chữ, nguyên thủy tiếp cận
    components.css   nút, ô nhập, chip, card, bảng, ngăn kéo, toast, khung xương
    layout.css       dải demo, đầu trang, điều hướng, tìm kiếm, chân trang
    pages.css        bề mặt của từng trang
    home.css         bố cục trang chủ theo khuôn của trang gốc
    admin.css        riêng cho CMS
  js/
    brand.js         tên, liên hệ, sơ đồ điều hướng
    store.js         localStorage: chủ đề, phiên, đăng ký, lớp đè CMS, sao lưu
    data.js          lớp truy cập dữ liệu, ráp lớp đè của CMS vào dữ liệu gốc
    ui.js            khung chung, đầu và chân trang, toast, bẫy tiêu điểm, xác thực
    search.js        chỉ mục và truy vấn toàn trang
    cards.js         bộ dựng thẻ dùng chung
    listing.js       bộ điều khiển danh sách có lọc, dùng cho ba trang
    home.js news.js stories.js article.js directory.js profile.js
    memories.js album.js eventlist.js event.js jobs.js
    register.js contribute.js sitesearch.js account.js about.js admin.js
  data/
    alumni.js posts.js events.js albums.js jobs.js users.js submissions.js
    (kèm bản .json tương ứng cho mọi mục đích phía máy chủ)

.firecrawl/          bằng chứng trích từ trang gốc: token, ảnh, HTML, CSS chủ đề

tools/
  neu-images.json    kho ảnh lấy từ trang gốc, đổi file này là đổi toàn bộ ảnh
  build-data.js      sinh bộ dữ liệu demo
  build-pages.js     sinh khung HTML cho mười lăm trang trong, và sitemap
  smoke-test.js      bộ kiểm thử
```

Đầu trang và chân trang do `ui.js` dựng, nên mười bảy trang không mang mười bảy bản sao
của cùng hai trăm dòng. Tiêu đề trang, mô tả, đường dẫn, thẻ `h1` và nội dung chính vẫn
nằm trong HTML, vì đó là những phần quan trọng với công cụ tìm kiếm và với người đọc khi
JavaScript không chạy.

Mười lăm trang trong được sinh từ `tools/build-pages.js`. Chúng dùng chung một phần
`<head>` và một danh sách thẻ `<script>`, nên viết tay mười lăm lần thì sớm muộn cũng
lệch: một trang thiếu thẻ og, một trang quên canonical. `index.html` và `admin.html`
viết tay vì có cấu trúc riêng.

---

## Kiểm thử

```bash
npm install
node tools/smoke-test.js
```

376 phép thử chạy mười bảy trang trong jsdom, thực thi script thật của chúng, rồi thao
tác đúng như người dùng thao tác: bấm bộ lọc, gõ tìm kiếm, sang trang, mở đèn chiếu ảnh,
đăng ký sự kiện, gửi nội dung đóng góp, đăng nhập CMS với hai vai trò, sửa một bài, duyệt
một nội dung gửi lên, xóa một bản ghi, và kiểm bản sao lưu có ghi lại đúng thay đổi đó.

Bốn quy tắc được kiểm bằng máy trên mọi trang, chứ không kiểm bằng mắt:

- đúng một thẻ `h1`
- không một dấu gạch ngang dài nào, cả trong nội dung hiển thị lẫn trong mã nguồn
- mọi ảnh có thuộc tính `alt`
- mọi ô nhập có nhãn gắn được, không dùng placeholder thay nhãn

Ngoài ra bộ kiểm thử khoá lại những gì đo được từ trang gốc, để giao diện không lặng lẽ
trôi đi ở lần sửa sau: ba token bán kính phải bằng 0, ba màu thương hiệu `#0076c0`,
`#ff0000` và `#1b7b57` phải còn nguyên, số liệu trang chủ phải khớp độ dài mảng dữ liệu,
chỉ `tokens.css` được chứa mã màu thô, và không file JavaScript nào nghe sự kiện `scroll`
trực tiếp.

jsdom không cài `matchMedia` lẫn `IntersectionObserver`. Cả hai được giả lập trong bộ
kiểm thử chứ không né trong mã đã xuất bản, vì mọi trình duyệt đều đã có chúng từ lâu.

---

## Dựng lại dữ liệu

```bash
node tools/build-data.js     # sinh assets/data/*.json và *.js
node tools/build-pages.js    # sinh 14 trang trong và sitemap.xml
```

`build-data.js` dùng một bộ sinh số giả ngẫu nhiên có hạt giống cố định, nên chạy lại
luôn ra đúng bộ dữ liệu cũ. Nhờ vậy ảnh, liên kết và số liệu không nhảy giữa hai lần
dựng. Muốn một bộ dữ liệu khác thì đổi hạt giống ở dòng `rng(20260917)`.

Muốn đổi tên, liên hệ hoặc menu thì sửa `assets/js/brand.js`. Mười sáu trang tự theo.

---

## Cái gì thật và cái gì không

**Không có hồ sơ nào là người thật.** Tên người và tên doanh nghiệp đều do script sinh
ra; tên công ty cố ý hư cấu, vì gắn một người bịa vào một tổ chức có thật là thông tin
sai. Một dải đen trên đầu mọi trang nói rõ điều này cho người xem.

**Ảnh thì lấy từ trang gốc.** Ảnh tin, ảnh sự kiện, ảnh chân dung và banner đều trỏ tới
kho ảnh công khai của <https://alumni.neu.edu.vn/>, để bản demo trông đúng như trang sẽ
thay thế nó. Hệ quả: nó phụ thuộc vào máy chủ của bên thứ ba, nên khi bàn giao phải đổi
sang thư viện ảnh của trường. Chỉ cần sửa `tools/neu-images.json` rồi chạy lại
`node tools/build-data.js`.

Chỉ mười tám hồ sơ tiêu biểu có ảnh chân dung. Phần còn lại dùng avatar chữ cái đầu, vì
gán ảnh khuôn mặt cho một cái tên bịa cũng là thông tin sai.

Tên trường, địa chỉ, ngành đào tạo và cách đánh số khóa là thật, để bản demo đặt đúng
ngữ cảnh.

**Không có máy chủ.** Không có gì được truyền đi. Đăng ký sự kiện, hồ sơ tự tạo, nội dung
gửi lên và mọi thay đổi trong CMS nằm trong `localStorage` của chính trình duyệt bạn. Mỗi
lần đọc và ghi đều bọc `try/catch`, nên cửa sổ riêng tư hoặc trình duyệt chặn lưu trữ sẽ
rơi về trạng thái trong bộ nhớ cho phiên đó thay vì làm vỡ trang.

---

## Bàn giao quản trị

### Tài khoản mẫu

Bản demo không có xác thực thật. Mở `admin.html` và chọn một trong hai tài khoản mẫu để
xem CMS thay đổi thế nào theo quyền. `tai-khoan.html` có thêm tài khoản cựu sinh viên.

| Vai trò | Thấy gì |
| --- | --- |
| Quản trị viên | Toàn bộ CMS, gồm người dùng, phân quyền và sao lưu |
| Biên tập viên | Soạn, sửa và duyệt nội dung. Không xóa được, không đụng vào người dùng và sao lưu |

### Bảng phân quyền

Bảng hiển thị ở mục Phân quyền **chính là** bảng mà hệ thống dùng để quyết định cho phép
hay từ chối mỗi thao tác. Nó không phải tài liệu mô tả, nên không bao giờ lệch với hành
vi thật.

Quyền được kiểm ở hai chỗ chứ không phải một. Nút và mục menu ngoài tầm quyền bị gỡ khỏi
DOM, nhưng mọi thao tác ghi còn gọi lại hàm kiểm quyền một lần nữa trước khi chạy. Ẩn nút
chỉ là việc của giao diện, không phải kiểm soát truy cập.

### CMS không sửa file dữ liệu gốc

CMS ghi một lớp đè trong `localStorage`: bản vá theo id, danh sách id đã ẩn, và các bản
ghi mới. Trang công khai đọc qua `data.js` nên thấy thay đổi ngay, còn `assets/data/*.js`
vẫn nguyên. Muốn quay về ban đầu thì xóa lớp đè, không phải dựng lại dữ liệu.

### Sao lưu

Mục Sao lưu xuất một tệp JSON gồm toàn bộ thay đổi trong trình duyệt, nạp lại được, và
có nút đặt lại về dữ liệu mẫu. Người dùng thường cũng tải được dữ liệu của riêng mình về
từ `tai-khoan.html`.

---

## SEO

- Mỗi trang có `title`, `meta description` dài 80 tới 250 ký tự, `canonical`, bộ thẻ
  Open Graph và `twitter:card`.
- `bai-viet.html` và `su-kien-chi-tiet.html` cập nhật tiêu đề, mô tả, thẻ og và canonical
  theo đúng bản ghi đang mở, nên liên kết chia sẻ ra ngoài hiện đúng nội dung.
- Dữ liệu có cấu trúc: `EducationalOrganization` ở trang chủ, `NewsArticle` và `Article`
  ở trang đọc bài, `Event` ở trang sự kiện.
- `sitemap.xml` sinh cùng lúc với các trang, gồm 67 URL, nên một bài viết mới không bao
  giờ nằm ngoài sitemap chỉ vì có người quên chạy thêm một lệnh.
- `robots.txt` chặn các trang riêng tư. Bốn trang mang `noindex`: `admin.html`,
  `tai-khoan.html`, `ho-so.html` và `tim-kiem.html`.
- HTML ngữ nghĩa, đúng một `h1` mỗi trang, `alt` trên mọi ảnh, và đường dẫn ở mọi trang
  trong.

---

## Cần làm gì trước khi chạy thật

Đây là điều quan trọng nhất trong tài liệu này. Bản demo trình bày đầy đủ luồng nghiệp
vụ, nhưng **nó không có phần bảo mật**, vì nó không có máy chủ. Những mục dưới đây phải
được làm bằng mã phía máy chủ, không thể làm ở trình duyệt:

1. **Xác thực thật.** Màn chọn tài khoản mẫu phải thay bằng đăng nhập có mật khẩu băm,
   hoặc tốt hơn là SSO của trường. Nên có xác thực hai bước cho tài khoản quản trị.
2. **Phân quyền phía máy chủ.** Bảng quyền hiện nằm trong `assets/js/admin.js` và chạy
   trong trình duyệt, nên bất kỳ ai cũng sửa được. Nó phải được cài đặt lại ở tầng API,
   và tầng đó mới là nơi quyết định.
3. **Phạm vi công khai phải lọc ở máy chủ.** Hiện tại dữ liệu của mọi hồ sơ đều được gửi
   xuống trình duyệt rồi mới ẩn bớt khi hiển thị. Ở bản chạy thật, trường mà người xem
   không có quyền thấy phải không rời khỏi máy chủ.
4. **Kiểm tra dữ liệu đầu vào ở máy chủ.** Kiểm ở trình duyệt là để người dùng đỡ mất
   công, không phải để bảo vệ hệ thống.
5. **Chống spam cho biểu mẫu công khai.** Đăng ký sự kiện và gửi nội dung cần giới hạn
   tần suất và một lớp chống bot.
6. **Tải tệp lên.** Hiện tệp đính kèm chỉ được đọc tên và không rời khỏi máy người dùng.
   Bản thật cần kiểm định dạng, giới hạn dung lượng, quét mã độc và lưu ngoài thư mục web.
7. **Sao lưu thật.** Hai nút xuất và nạp trong CMS cần nối vào lệnh kết xuất và phục hồi
   cơ sở dữ liệu, cộng một lịch chạy tự động hằng đêm và một bản lưu ngoài máy chủ chính.
8. **HTTPS, CSP và security headers.** Cần có trước khi mở công khai.
9. **Nhật ký thao tác quản trị.** Ai sửa gì, lúc nào. Bản demo không ghi nhật ký.

---

## Mở rộng về sau

Cấu trúc đã tính tới hai thứ được nêu trong yêu cầu ban đầu:

- **Networking.** `alumni.js` đã có trường `coVanNghiepVu` và `quanTam`, hiển thị thành
  nhãn Cố vấn trong danh bạ và mục "Sẵn sàng hỗ trợ" trong hồ sơ. Thêm chức năng nhắn tin
  hoặc đặt lịch cố vấn là nối thêm vào hai trường đã có.
- **Cộng đồng theo khóa.** Mọi bản ghi đều mang trường `khoa`, và bộ lọc theo khóa đã chạy
  trên cả danh bạ lẫn kho kỷ niệm. Một trang riêng cho từng khóa là gom lại những gì đã có
  theo một khóa, chứ không phải dựng mới.
