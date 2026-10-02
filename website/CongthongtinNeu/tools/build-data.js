/* ==========================================================================
   SINH BỘ DỮ LIỆU DEMO

   Toàn bộ dữ liệu của bản dựng này là dữ liệu mẫu do script sinh ra. Không có
   hồ sơ nào là người thật, không có doanh nghiệp nào là doanh nghiệp thật.
   Script dùng một bộ sinh số giả ngẫu nhiên có hạt giống cố định, nên chạy lại
   luôn ra đúng bộ dữ liệu cũ. Nhờ vậy ảnh, liên kết và số liệu không nhảy
   giữa hai lần build.

   Chạy:  node tools/build-data.js
   Ghi:   assets/data/*.json  và  assets/data/*.js  (bản gói cho <script>)
   ========================================================================== */

const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'assets', 'data');

/* Kho ảnh lấy từ chính https://alumni.neu.edu.vn/ (xem .firecrawl/). Dùng ảnh
   thật của trang gốc để bản demo trông đúng như trang sẽ thay thế nó, thay vì
   ảnh phong cảnh ngẫu nhiên. Khi bàn giao, thay bằng thư viện ảnh của trường:
   chỉ cần đổi nội dung tools/neu-images.json.

   Khi máy không nối mạng, ui.js thay mọi ảnh hỏng bằng một hình dựng sẵn theo
   màu thương hiệu, nên trang không bao giờ có ô ảnh vỡ. */
const KHOANH = JSON.parse(fs.readFileSync(path.join(__dirname, 'neu-images.json'), 'utf8'));
const anhTheoThuTu = (kho, i) => kho[i % kho.length];
const NOW = new Date('2026-09-17T00:00:00Z');

/* --------------------------------------------------------------------------
   Bộ sinh số có hạt giống. mulberry32, đủ tốt cho dữ liệu trưng bày.
   -------------------------------------------------------------------------- */
function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const R = rng(20260917);
const pick = (arr) => arr[Math.floor(R() * arr.length)];
const pickN = (arr, n) => {
  const copy = arr.slice();
  const out = [];
  while (out.length < n && copy.length) out.push(copy.splice(Math.floor(R() * copy.length), 1)[0]);
  return out;
};
const int = (lo, hi) => lo + Math.floor(R() * (hi - lo + 1));
const chance = (p) => R() < p;

/* --------------------------------------------------------------------------
   Chuyển tiếng Việt có dấu thành slug
   -------------------------------------------------------------------------- */
function slugify(s) {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function iso(d) { return new Date(d).toISOString().slice(0, 10); }
function daysFrom(base, n) { const d = new Date(base); d.setUTCDate(d.getUTCDate() + n); return d; }

/* --------------------------------------------------------------------------
   Ảnh. Nguồn ảnh là picsum với hạt giống mô tả, nên cùng một mục luôn nhận
   đúng một tấm ảnh. Khi ngoại tuyến, ui.js thay bằng một hình dựng sẵn theo
   màu thương hiệu, nên trang không bao giờ có ô ảnh vỡ.
   -------------------------------------------------------------------------- */
let _imgN = 0;
function img(seed, w, h) {
  return anhTheoThuTu(KHOANH.sukien, _imgN++);
}

/* ==========================================================================
   VỐN TỪ
   ========================================================================== */

const HO = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý', 'Đinh', 'Trịnh', 'Mai', 'Tạ', 'Chu'];
const DEM_NAM = ['Văn', 'Hữu', 'Đức', 'Quang', 'Minh', 'Thành', 'Tuấn', 'Bá', 'Xuân', 'Gia', 'Đình', 'Công', 'Việt', 'Trọng'];
const DEM_NU = ['Thị', 'Ngọc', 'Thu', 'Hồng', 'Thanh', 'Phương', 'Khánh', 'Diệu', 'Bảo', 'Mai', 'Hà', 'Kim', 'Lan'];
const TEN_NAM = ['An', 'Bách', 'Cường', 'Dũng', 'Đạt', 'Hải', 'Hiếu', 'Hoàng', 'Hùng', 'Huy', 'Khoa', 'Kiên', 'Lâm', 'Long', 'Minh', 'Nam', 'Nghĩa', 'Phong', 'Phúc', 'Quân', 'Quyết', 'Sơn', 'Tâm', 'Thắng', 'Thịnh', 'Tiến', 'Trung', 'Tú', 'Tùng', 'Vinh', 'Vũ', 'Đăng', 'Duy', 'Khánh'];
const TEN_NU = ['An', 'Anh', 'Bình', 'Chi', 'Dung', 'Duyên', 'Giang', 'Hà', 'Hạnh', 'Hiền', 'Hoa', 'Huyền', 'Hương', 'Lan', 'Linh', 'Loan', 'Ly', 'Mai', 'My', 'Nga', 'Ngân', 'Nhung', 'Oanh', 'Phương', 'Quỳnh', 'Thảo', 'Thu', 'Thúy', 'Trang', 'Trâm', 'Tuyết', 'Vân', 'Yến', 'Nhi'];

/* Ngành đào tạo của trường */
const NGANH = [
  'Kinh tế học', 'Kinh tế đầu tư', 'Kinh tế quốc tế', 'Quản trị kinh doanh',
  'Quản trị nhân lực', 'Tài chính doanh nghiệp', 'Ngân hàng', 'Kế toán',
  'Kiểm toán', 'Marketing', 'Kinh doanh quốc tế', 'Thương mại điện tử',
  'Hệ thống thông tin quản lý', 'Khoa học dữ liệu trong kinh tế',
  'Bất động sản', 'Bảo hiểm', 'Thống kê kinh tế', 'Toán kinh tế',
  'Luật kinh tế', 'Khoa học quản lý', 'Quản lý công', 'Du lịch và khách sạn',
  'Ngôn ngữ Anh thương mại', 'Logistics và quản lý chuỗi cung ứng',
];

const LINHVUC = [
  'Tài chính và ngân hàng', 'Kiểm toán và kế toán', 'Công nghệ', 'Sản xuất',
  'Bán lẻ và tiêu dùng', 'Bất động sản', 'Logistics', 'Giáo dục',
  'Khu vực công', 'Tư vấn', 'Truyền thông', 'Khởi nghiệp', 'Phi lợi nhuận',
  'Năng lượng', 'Y tế và dược',
];

/* Doanh nghiệp hư cấu. Không dùng tên công ty có thật, vì gắn một người bịa
   vào một tổ chức thật là thông tin sai. */
const CONGTY = [
  ['Ngân hàng TMCP Kim Liên', 'Tài chính và ngân hàng'],
  ['Ngân hàng TMCP Hồng Hà', 'Tài chính và ngân hàng'],
  ['Công ty CP Chứng khoán Bạch Đằng', 'Tài chính và ngân hàng'],
  ['Quỹ đầu tư Lạc Hồng Capital', 'Tài chính và ngân hàng'],
  ['Công ty Tài chính số Sao Khuê', 'Công nghệ'],
  ['Công ty TNHH Kiểm toán Minh Đức', 'Kiểm toán và kế toán'],
  ['Công ty CP Tư vấn Thuế Trường Giang', 'Kiểm toán và kế toán'],
  ['Công ty CP Công nghệ Vọng Các', 'Công nghệ'],
  ['Công ty CP Giải pháp Dữ liệu Hải Vân', 'Công nghệ'],
  ['Tổng công ty Sản xuất Nam Sơn', 'Sản xuất'],
  ['Công ty CP Cơ khí Hồng Lĩnh', 'Sản xuất'],
  ['Công ty CP Bán lẻ Vạn Xuân', 'Bán lẻ và tiêu dùng'],
  ['Công ty CP Thực phẩm Tân An', 'Bán lẻ và tiêu dùng'],
  ['Công ty CP Bất động sản Thăng Long Land', 'Bất động sản'],
  ['Công ty CP Đầu tư Hạ tầng Đông Đô', 'Bất động sản'],
  ['Công ty CP Logistics Đại Việt', 'Logistics'],
  ['Công ty CP Kho vận Cửa Lò', 'Logistics'],
  ['Công ty CP Giáo dục Trí Đức', 'Giáo dục'],
  ['Trường Đại học Kinh tế Quốc dân', 'Giáo dục'],
  ['Viện Nghiên cứu Chính sách Bắc Hà', 'Khu vực công'],
  ['Sở Kế hoạch và Đầu tư Hà Nội', 'Khu vực công'],
  ['Công ty Tư vấn Quản trị Thái Bình Dương', 'Tư vấn'],
  ['Công ty CP Truyền thông Sông Cầu', 'Truyền thông'],
  ['Công ty CP Năng lượng Xanh Phú Yên', 'Năng lượng'],
  ['Công ty CP Dược phẩm Ngọc Hồi', 'Y tế và dược'],
  ['Quỹ Phát triển Cộng đồng Sen Vàng', 'Phi lợi nhuận'],
  ['Nền tảng thương mại Chợ Phiên', 'Khởi nghiệp'],
  ['Công ty CP Nông nghiệp Cao Bằng Xanh', 'Khởi nghiệp'],
];

const THANHPHO = [
  ['Hà Nội', 'Việt Nam'], ['Hà Nội', 'Việt Nam'], ['Hà Nội', 'Việt Nam'],
  ['TP Hồ Chí Minh', 'Việt Nam'], ['TP Hồ Chí Minh', 'Việt Nam'],
  ['Đà Nẵng', 'Việt Nam'], ['Hải Phòng', 'Việt Nam'], ['Cần Thơ', 'Việt Nam'],
  ['Bắc Ninh', 'Việt Nam'], ['Quảng Ninh', 'Việt Nam'], ['Nghệ An', 'Việt Nam'],
  ['Thanh Hóa', 'Việt Nam'], ['Huế', 'Việt Nam'], ['Bình Dương', 'Việt Nam'],
  ['Singapore', 'Singapore'], ['Tokyo', 'Nhật Bản'], ['Seoul', 'Hàn Quốc'],
  ['Sydney', 'Úc'], ['Melbourne', 'Úc'], ['London', 'Anh'], ['Berlin', 'Đức'],
];

const CHUCDANH = {
  moi: ['Chuyên viên', 'Chuyên viên phân tích', 'Nhân viên kinh doanh', 'Trợ lý dự án', 'Kiểm toán viên', 'Chuyên viên marketing'],
  giua: ['Chuyên viên cao cấp', 'Trưởng nhóm', 'Quản lý dự án', 'Kiểm toán viên cao cấp', 'Trưởng bộ phận marketing', 'Chuyên gia phân tích dữ liệu'],
  cao: ['Trưởng phòng', 'Giám đốc chi nhánh', 'Giám đốc tài chính', 'Giám đốc vận hành', 'Trưởng ban kiểm soát', 'Giám đốc nhân sự'],
  dinh: ['Tổng giám đốc', 'Phó tổng giám đốc', 'Thành viên Hội đồng quản trị', 'Nhà sáng lập', 'Giám đốc điều hành', 'Cố vấn cấp cao'],
};

const QUANTAM = [
  'Cố vấn nghề nghiệp', 'Tuyển dụng thực tập sinh', 'Diễn giả hội thảo',
  'Chấm thi khởi nghiệp', 'Kết nối đầu tư', 'Hỗ trợ học bổng',
  'Hướng dẫn luận văn', 'Tổ chức sự kiện khóa',
];

/* ==========================================================================
   CỰU SINH VIÊN
   ========================================================================== */

function makeAlumni(count) {
  const out = [];
  const seen = new Set();

  for (let i = 0; i < count; i++) {
    const nu = chance(0.48);
    const ho = pick(HO);
    const dem = nu ? pick(DEM_NU) : pick(DEM_NAM);
    const ten = nu ? pick(TEN_NU) : pick(TEN_NAM);
    const name = ho + ' ' + dem + ' ' + ten;

    let slug = slugify(name);
    let n = 2;
    while (seen.has(slug)) slug = slugify(name) + '-' + n++;
    seen.add(slug);

    /* Khóa 38 nhập học 1993, khóa 65 nhập học 2020. Tốt nghiệp sau 4 năm. */
    const khoa = int(38, 65);
    const namNhapHoc = 1955 + khoa;
    const namTotNghiep = namNhapHoc + 4;
    const soNam = NOW.getUTCFullYear() - namTotNghiep;

    let bac;
    if (soNam <= 3) bac = 'moi';
    else if (soNam <= 9) bac = 'giua';
    else if (soNam <= 18) bac = 'cao';
    else bac = 'dinh';

    const [congty, linhvuc] = pick(CONGTY);
    const [tp, quocgia] = pick(THANHPHO);
    const nganh = pick(NGANH);

    /* Phạm vi công khai. Mặc định của hệ thống là dè dặt: email và điện thoại
       chỉ hiện với người đã đăng nhập, trừ khi chủ hồ sơ tự mở. */
    const privacy = {
      email: pick(['rieng-tu', 'thanh-vien', 'thanh-vien', 'cong-khai']),
      phone: pick(['rieng-tu', 'rieng-tu', 'thanh-vien']),
      company: pick(['cong-khai', 'cong-khai', 'cong-khai', 'thanh-vien']),
      city: pick(['cong-khai', 'cong-khai', 'thanh-vien']),
    };

    out.push({
      id: 'al-' + String(i + 1).padStart(4, '0'),
      slug,
      name,
      khoa,
      lop: nganh.split(' ')[0].slice(0, 4).toUpperCase() + ' ' + khoa + String.fromCharCode(65 + int(0, 3)),
      nganh,
      namNhapHoc,
      namTotNghiep,
      linhvuc,
      congty,
      chucdanh: pick(CHUCDANH[bac]),
      thanhpho: tp,
      quocgia,
      email: slug.replace(/-/g, '.') + '@alumni.neu.edu.vn',
      dienthoai: '09' + int(10, 89) + ' ' + int(100, 999) + ' ' + int(100, 999),
      coVanNghiepVu: chance(0.22),
      quanTam: pickN(QUANTAM, int(1, 3)),
      gioiThieu:
        'Tốt nghiệp ngành ' + nganh + ' năm ' + namTotNghiep + '. ' +
        'Hiện làm việc tại ' + congty + ' trong lĩnh vực ' + linhvuc.toLowerCase() + '.',
      privacy,
      /* Ảnh chân dung: chỉ những hồ sơ tiêu biểu mới có ảnh thật, phần còn lại
         dùng avatar chữ cái đầu. Gán ảnh khuôn mặt cho mọi hồ sơ bịa là sai. */
      noiBat: false,
      anhChanDung: null,
      thamGia: iso(daysFrom(NOW, -int(20, 1500))),
    });
  }
  /* Chọn ra một nhóm hồ sơ tiêu biểu: người có thâm niên cao nhất trong các
     lĩnh vực khác nhau, để lưới chân dung trên trang chủ không dồn hết vào
     một ngành. Số lượng khớp đúng số ảnh chân dung có trong kho. */
  const theoLinhVuc = new Map();
  out
    .slice()
    .sort((a, b) => a.khoa - b.khoa)
    .forEach((a) => {
      if (!theoLinhVuc.has(a.linhvuc)) theoLinhVuc.set(a.linhvuc, []);
      theoLinhVuc.get(a.linhvuc).push(a);
    });

  const chon = [];
  let vong = 0;
  while (chon.length < KHOANH.chandung.length && vong < 6) {
    for (const ds of theoLinhVuc.values()) {
      if (ds[vong] && chon.length < KHOANH.chandung.length) chon.push(ds[vong]);
    }
    vong++;
  }
  chon.forEach((a, i) => {
    a.noiBat = true;
    a.anhChanDung = KHOANH.chandung[i];
  });

  return out;
}

/* ==========================================================================
   TIN TỨC VÀ CÂU CHUYỆN
   ========================================================================== */

const DANHMUC = ['Hoạt động Khoa', 'Sự kiện', 'Thành tựu', 'Kỷ niệm', 'Học bổng', 'Hợp tác doanh nghiệp'];

const TIN = [
  ['Khoa Kinh tế học công bố chương trình cố vấn khóa 2026', 'Hoạt động Khoa', 'Bốn mươi hai cựu sinh viên nhận hướng dẫn sinh viên năm cuối trong học kỳ tới, mỗi người kèm tối đa hai bạn.'],
  ['Quỹ học bổng Kim Liên trao 120 suất cho tân sinh viên', 'Học bổng', 'Nguồn quỹ đến từ đóng góp của các khóa 45 đến 58, trao theo hai tiêu chí là hoàn cảnh và kết quả đầu vào.'],
  ['Mạng lưới cựu sinh viên khu vực phía Nam họp mặt thường niên', 'Sự kiện', 'Hơn ba trăm người có mặt tại TP Hồ Chí Minh, phần lớn thuộc các khóa 48 đến 60.'],
  ['Ba cựu sinh viên vào danh sách lãnh đạo trẻ ngành tài chính', 'Thành tựu', 'Cả ba đều tốt nghiệp trong khoảng 2008 đến 2013 và hiện giữ vị trí điều hành.'],
  ['Ký kết hợp tác thực tập với chín doanh nghiệp do cựu sinh viên dẫn dắt', 'Hợp tác doanh nghiệp', 'Chỉ tiêu năm đầu là 180 vị trí thực tập, tập trung vào tài chính, kiểm toán và phân tích dữ liệu.'],
  ['Khóa 45 bàn giao phòng đọc cho thư viện trường', 'Kỷ niệm', 'Công trình kỷ niệm hai mươi lăm năm ngày tốt nghiệp, gồm 60 chỗ ngồi và khu thảo luận nhóm.'],
  ['Chuỗi tọa đàm nghề nghiệp mở lại sau kỳ nghỉ hè', 'Hoạt động Khoa', 'Sáu buổi trong học kỳ, mỗi buổi một lĩnh vực, diễn giả đều là cựu sinh viên đang hành nghề.'],
  ['Cựu sinh viên khóa 52 nhận giải thưởng nghiên cứu chính sách công', 'Thành tựu', 'Công trình về chi tiêu công cấp tỉnh được hội đồng đánh giá cao ở phần dữ liệu thực địa.'],
  ['Ngày hội việc làm mùa thu quy tụ 64 nhà tuyển dụng', 'Sự kiện', 'Một nửa số gian hàng do doanh nghiệp có cựu sinh viên giữ vai trò quản lý đăng ký.'],
  ['Số hóa kỷ yếu các khóa 30 đến 45', 'Kỷ niệm', 'Hơn bốn nghìn trang đã được quét và đưa lên kho tư liệu, tra cứu theo khóa và theo lớp.'],
  ['Câu lạc bộ cựu sinh viên ngành Kiểm toán ra mắt', 'Hoạt động Khoa', 'Sinh hoạt hai tháng một lần, nội dung xoay quanh chuẩn mực mới và các tình huống nghề.'],
  ['Trao giải cuộc thi phân tích dữ liệu kinh tế lần thứ tư', 'Thành tựu', 'Ban giám khảo gồm bảy cựu sinh viên hiện làm việc trong ngành dữ liệu và tài chính.'],
  ['Đoàn cựu sinh viên tại Nhật Bản tổ chức gặp mặt tại Tokyo', 'Sự kiện', 'Ba mươi hai người tham dự, phần lớn đang làm việc trong lĩnh vực thương mại và sản xuất.'],
  ['Chương trình hiến máu do mạng lưới cựu sinh viên phát động', 'Hoạt động Khoa', 'Thu được 214 đơn vị máu trong hai ngày tổ chức tại cơ sở chính.'],
  ['Khai trương không gian làm việc chung cho cựu sinh viên khởi nghiệp', 'Hợp tác doanh nghiệp', 'Hai mươi chỗ ngồi, ưu tiên nhóm đã có sản phẩm và đang tìm khách hàng đầu tiên.'],
  ['Hội thảo về chuỗi cung ứng sau biến động thương mại', 'Sự kiện', 'Bốn báo cáo viên, trong đó ba người là cựu sinh viên đang phụ trách vận hành tại doanh nghiệp xuất khẩu.'],
  ['Cập nhật cơ sở dữ liệu cựu sinh viên các khóa 38 đến 50', 'Hoạt động Khoa', 'Chiến dịch rà soát kéo dài sáu tuần, bổ sung thông tin nghề nghiệp cho hơn hai nghìn hồ sơ.'],
  ['Giải chạy gây quỹ học bổng thu hút 900 người đăng ký', 'Sự kiện', 'Toàn bộ phí đăng ký chuyển vào quỹ hỗ trợ sinh viên khó khăn của trường.'],
  ['Cựu sinh viên khóa 40 tài trợ phòng thí nghiệm dữ liệu', 'Kỷ niệm', 'Phòng gồm 30 máy trạm, phục vụ các học phần thống kê và kinh tế lượng.'],
  ['Ra mắt bản tin nghề nghiệp gửi hàng tháng cho mạng lưới', 'Hoạt động Khoa', 'Nội dung gồm vị trí tuyển dụng, lịch sự kiện và một bài phỏng vấn ngắn mỗi số.'],
];

const CAUCHUYEN = [
  ['Từ giảng đường Kim Liên tới phòng giao dịch Singapore', 'Mười bốn năm sau khi tốt nghiệp, hành trình bắt đầu bằng một kỳ thực tập không lương ở bộ phận hậu kiểm.'],
  ['Người chọn ở lại khu vực công sau mười năm làm tư vấn', 'Lương thấp hơn, nhưng công việc chạm tới những con số ảnh hưởng tới cả một tỉnh.'],
  ['Xây một doanh nghiệp logistics từ hai chiếc xe tải', 'Bài học lớn nhất không nằm ở vốn mà ở việc đọc hợp đồng vận chuyển cho kỹ.'],
  ['Nữ kiểm toán viên và quyết định rời hãng lớn ở tuổi ba mươi', 'Câu chuyện về việc mở một hãng nhỏ và giữ đúng nguyên tắc nghề nghiệp.'],
  ['Trở lại trường dạy học sau mười lăm năm làm ngân hàng', 'Điều khó nhất là dịch kinh nghiệm thị trường thành thứ sinh viên năm hai hiểu được.'],
  ['Một nhà phân tích dữ liệu kể về ngày đầu không biết viết truy vấn', 'Từ bảng tính tới kho dữ liệu, và vì sao nền kinh tế lượng ở trường vẫn có ích.'],
  ['Khởi nghiệp nông nghiệp ở Cao Bằng sau tám năm ở Hà Nội', 'Chuyện về giá vốn, về mùa vụ, và về việc thuyết phục hộ dân ký hợp đồng bao tiêu.'],
  ['Người dựng lại hệ thống tài chính cho một doanh nghiệp sắp phá sản', 'Sáu tháng, ba lần tái cấu trúc nợ, và một bảng cân đối cuối cùng cân được.'],
  ['Từ trợ lý dự án tới giám đốc vận hành trong bảy năm', 'Không có bước nhảy nào, chỉ có việc nhận phần khó mà người khác né.'],
  ['Cựu sinh viên khóa 44 và hai mươi năm gắn bó với ngành bảo hiểm', 'Nghề bị hiểu lầm nhiều nhất, theo lời người đã ở trong nó suốt hai thập kỷ.'],
  ['Chuyển từ kiểm toán sang sản phẩm công nghệ tài chính', 'Kỹ năng đọc báo cáo tài chính hóa ra là lợi thế khi thiết kế sản phẩm cho vay.'],
  ['Người phụ trách quỹ học bổng của khóa suốt mười hai năm', 'Mỗi năm gọi hơn hai trăm cuộc điện thoại, và vì sao vẫn tiếp tục.'],
];

function paragraphs(title, n) {
  const mo = [
    'Câu chuyện bắt đầu từ một quyết định nhỏ, kiểu quyết định mà lúc đưa ra không ai nghĩ nó sẽ định hình cả một thập kỷ sau đó.',
    'Nếu nhìn từ bây giờ, con đường trông thẳng. Nhưng ở thời điểm đó, không có gì là hiển nhiên cả.',
    'Điều đáng nói không nằm ở kết quả, mà ở những lần rẽ mà lúc rẽ thì chưa biết là đúng hay sai.',
  ];
  const than = [
    'Giai đoạn đầu gần như chỉ là học lại từ đầu. Những gì học trong trường cho một khung để nghĩ, nhưng công việc thật đòi hỏi biết chỗ nào trong khung đó cần bẻ.',
    'Có một quãng mọi thứ chững lại. Không thất bại hẳn, cũng không tiến được, và đó mới là quãng khó chịu nhất.',
    'Bước ngoặt đến từ một việc rất đời thường: nhận phần việc mà cả nhóm đều muốn né, rồi làm nó cẩn thận hơn mức cần thiết.',
    'Kỹ năng đọc số liệu học được ở trường trở thành lợi thế đúng vào lúc ít ngờ tới nhất, khi phải giải thích một bảng cân đối cho người không làm tài chính.',
    'Mạng lưới cựu sinh viên giúp được ở chỗ không ai nói ra: một cuộc gọi đúng người, đúng lúc, tiết kiệm được hàng tháng dò dẫm.',
    'Nhìn lại, phần lớn thứ tạo ra khác biệt không phải là tài năng mà là việc ở lại đủ lâu để hiểu ngành đang vận hành thế nào.',
  ];
  const ket = [
    'Lời khuyên cho sinh viên năm cuối, nếu có, chỉ gọn trong một câu: chọn nơi mà bạn được làm việc thật sớm, kể cả khi vị trí nghe không oách.',
    'Điều muốn gửi lại cho các khóa sau là hãy giữ liên lạc với nhau. Mạng lưới chỉ có giá trị khi nó được dùng.',
    'Và nếu có một thứ muốn làm lại, đó là hỏi nhiều hơn trong ba năm đầu đi làm.',
  ];
  const out = [{ type: 'p', text: pick(mo) }];
  const body = pickN(than, Math.min(n, than.length));
  body.forEach((t, i) => {
    if (i === 2) out.push({ type: 'h2', text: 'Quãng giữa' });
    out.push({ type: 'p', text: t });
  });
  out.push({ type: 'h2', text: 'Nhìn lại' });
  out.push({ type: 'p', text: pick(ket) });
  return out;
}

function makePosts(alumni) {
  const out = [];
  let i = 0;

  TIN.forEach(([title, danhmuc, excerpt], idx) => {
    const d = daysFrom(NOW, -(idx * 6 + int(0, 4)));
    out.push({
      id: 'p-' + String(++i).padStart(3, '0'),
      slug: slugify(title),
      loai: 'tin',
      danhmuc,
      tieude: title,
      tomtat: excerpt,
      anh: img('tin-' + idx, 1200, 675),
      tacgia: 'Ban Truyền thông Mạng lưới',
      ngay: iso(d),
      the: pickN(['mạng lưới', 'khoa', 'sinh viên', 'doanh nghiệp', 'học bổng', 'nghiên cứu'], 2),
      noibat: idx < 5,
      phut: int(3, 7),
      noidung: paragraphs(title, 4),
    });
  });

  CAUCHUYEN.forEach(([title, excerpt], idx) => {
    const nhanvat = alumni[(idx * 11 + 7) % alumni.length];
    const d = daysFrom(NOW, -(idx * 11 + int(2, 9)));
    out.push({
      id: 'p-' + String(++i).padStart(3, '0'),
      slug: slugify(title),
      loai: 'cauchuyen',
      danhmuc: 'Câu chuyện Alumni',
      tieude: title,
      tomtat: excerpt,
      anh: img('chuyen-' + idx, 1200, 675),
      anhChanDung: img('chandung-' + idx, 800, 1000),
      tacgia: 'Ban Truyền thông Mạng lưới',
      nhanVatId: nhanvat.id,
      ngay: iso(d),
      the: pickN(['nghề nghiệp', 'khởi nghiệp', 'chân dung', 'cố vấn'], 2),
      noibat: idx < 3,
      phut: int(6, 12),
      trichdan: pick([
        'Chọn nơi được làm việc thật sớm, kể cả khi vị trí nghe không oách.',
        'Mạng lưới chỉ có giá trị khi nó được dùng, chứ không phải khi nó được lập ra.',
        'Phần tạo ra khác biệt là ở lại đủ lâu để hiểu ngành vận hành thế nào.',
        'Việc khó mà cả nhóm đều né thường là việc dạy được nhiều nhất.',
      ]),
      noidung: paragraphs(title, 5),
    });
  });

  return out.sort((a, b) => (a.ngay < b.ngay ? 1 : -1));
}

/* ==========================================================================
   SỰ KIỆN
   ========================================================================== */

const SUKIEN = [
  ['Gặp mặt truyền thống toàn mạng lưới 2026', 'Hội trường A2, Đại học Kinh tế Quốc dân', 'Hà Nội', 'Gặp mặt', 800],
  ['Tọa đàm nghề nghiệp: ngành tài chính sau chu kỳ lãi suất', 'Giảng đường D201', 'Hà Nội', 'Tọa đàm', 220],
  ['Ngày hội việc làm mùa thu', 'Nhà thi đấu trường', 'Hà Nội', 'Tuyển dụng', 1500],
  ['Họp mặt cựu sinh viên khu vực phía Nam', 'Khách sạn Bến Nghé, Quận 1', 'TP Hồ Chí Minh', 'Gặp mặt', 350],
  ['Khóa huấn luyện cố vấn cho cựu sinh viên', 'Phòng hội thảo tầng 7, nhà A1', 'Hà Nội', 'Đào tạo', 60],
  ['Giải chạy gây quỹ học bổng Kim Liên', 'Công viên Thống Nhất', 'Hà Nội', 'Thiện nguyện', 1200],
  ['Gặp mặt cựu sinh viên tại Tokyo', 'Trung tâm giao lưu Shinjuku', 'Tokyo', 'Gặp mặt', 80],
  ['Hội thảo chuỗi cung ứng và thương mại khu vực', 'Giảng đường B102', 'Hà Nội', 'Hội thảo', 180],
  ['Lễ kỷ niệm 25 năm tốt nghiệp khóa 45', 'Hội trường A2', 'Hà Nội', 'Kỷ niệm', 400],
  ['Buổi chấm vòng chung kết cuộc thi khởi nghiệp sinh viên', 'Trung tâm khởi nghiệp, nhà A1', 'Hà Nội', 'Cuộc thi', 150],
  ['Gặp mặt cựu sinh viên khu vực miền Trung', 'Trung tâm Hội nghị Đà Nẵng', 'Đà Nẵng', 'Gặp mặt', 200],
  ['Chuyên đề: đọc báo cáo tài chính cho người không làm tài chính', 'Trực tuyến', 'Trực tuyến', 'Đào tạo', 500],
  ['Ngày hội hiến máu của mạng lưới', 'Sân nhà A1', 'Hà Nội', 'Thiện nguyện', 300],
  ['Bàn tròn chính sách công cùng cựu sinh viên khu vực nhà nước', 'Phòng họp 502, nhà A1', 'Hà Nội', 'Tọa đàm', 90],
];

function makeEvents() {
  return SUKIEN.map((e, idx) => {
    const [title, venue, city, type, capacity] = e;
    /* Bảy sự kiện sắp tới, bảy sự kiện đã qua. */
    const offset = idx < 7 ? int(6, 150) : -int(20, 400);
    const start = daysFrom(NOW, offset);
    const sapToi = offset > 0;
    const daDangKy = sapToi ? int(Math.floor(capacity * 0.18), Math.floor(capacity * 0.94)) : int(Math.floor(capacity * 0.6), capacity);

    return {
      id: 'e-' + String(idx + 1).padStart(3, '0'),
      slug: slugify(title),
      tieude: title,
      tomtat: 'Chương trình mở cho cựu sinh viên mọi khóa. Đăng ký trước để ban tổ chức chuẩn bị chỗ ngồi và tài liệu.',
      anh: img('sukien-' + idx, 1200, 675),
      batdau: start.toISOString(),
      ketthuc: new Date(start.getTime() + int(2, 8) * 3600 * 1000).toISOString(),
      diadiem: venue,
      thanhpho: city,
      loai: type,
      succhua: capacity,
      dadangky: daDangKy,
      phi: chance(0.55) ? 0 : int(1, 6) * 50000,
      moDangKy: sapToi,
      noidung: [
        { type: 'p', text: 'Chương trình nằm trong chuỗi hoạt động thường niên của mạng lưới cựu sinh viên. Nội dung được xây dựng dựa trên đề xuất thu thập từ các khóa trong kỳ khảo sát gần nhất.' },
        { type: 'h2', text: 'Nội dung chính' },
        { type: 'p', text: 'Phần đầu là báo cáo ngắn từ ban điều phối. Phần sau dành cho thảo luận mở, chia theo nhóm lĩnh vực để người tham dự trao đổi được sâu hơn.' },
        { type: 'h2', text: 'Lưu ý khi tham dự' },
        { type: 'p', text: 'Vui lòng mang theo giấy tờ tùy thân để đối chiếu với danh sách đăng ký. Ban tổ chức bố trí chỗ gửi xe tại cổng phía đường Giải Phóng.' },
      ],
    };
  });
}

/* ==========================================================================
   KỶ NIỆM: ALBUM ẢNH, VIDEO, KỶ YẾU
   ========================================================================== */

const ALBUM = [
  ['Lễ tốt nghiệp khóa 61', 2023, 61, 'anh'],
  ['Gặp mặt truyền thống 2025', 2025, null, 'anh'],
  ['Hai mươi năm khóa 44 hội ngộ', 2024, 44, 'anh'],
  ['Ngày hội việc làm mùa thu 2025', 2025, null, 'anh'],
  ['Giải chạy gây quỹ học bổng 2026', 2026, null, 'anh'],
  ['Khánh thành phòng đọc khóa 45', 2024, 45, 'anh'],
  ['Kỷ yếu khóa 38', 1997, 38, 'kyyeu'],
  ['Kỷ yếu khóa 45', 2004, 45, 'kyyeu'],
  ['Kỷ yếu khóa 52', 2011, 52, 'kyyeu'],
  ['Phim tài liệu sáu mươi năm truyền thống', 2022, null, 'video'],
  ['Lưu trữ ảnh giảng đường thập niên 2000', 2009, null, 'anh'],
  ['Gặp mặt cựu sinh viên phía Nam 2025', 2025, null, 'anh'],
];

const CAPTIONS = [
  'Toàn cảnh hội trường trước giờ khai mạc',
  'Phần trao chứng nhận cho các cố vấn',
  'Nhóm khóa cũ chụp chung trước sảnh A1',
  'Khu vực đăng ký của ban tổ chức',
  'Phần thảo luận theo nhóm lĩnh vực',
  'Ảnh chung cuối chương trình',
  'Bàn trưng bày tư liệu của các khóa',
  'Khách mời phát biểu mở đầu',
  'Đại diện các khóa trao quà lưu niệm',
  'Khoảnh khắc trước cổng trường',
];

function makeAlbums() {
  return ALBUM.map((a, idx) => {
    const [title, year, khoa, kind] = a;
    const n = kind === 'anh' ? int(8, 16) : kind === 'kyyeu' ? int(4, 8) : 3;
    const photos = [];
    for (let i = 0; i < n; i++) {
      photos.push({
        src: img('album-' + idx + '-' + i, 1200, 900),
        thumb: img('album-' + idx + '-' + i, 500, 500),
        chuthich: CAPTIONS[i % CAPTIONS.length],
      });
    }
    const docs = kind === 'kyyeu'
      ? [
          { ten: 'Kỷ yếu ' + title + ' (bản quét)', dinhdang: 'PDF', dungluong: int(12, 68) + ' MB' },
          { ten: 'Danh sách lớp và ảnh tập thể', dinhdang: 'PDF', dungluong: int(3, 14) + ' MB' },
        ]
      : [];

    return {
      id: 'ab-' + String(idx + 1).padStart(3, '0'),
      slug: slugify(title),
      tieude: title,
      nam: year,
      khoa,
      loai: kind,
      bia: img('album-' + idx + '-0', 1000, 750),
      mota: kind === 'kyyeu'
        ? 'Bản quét kỷ yếu đã được xử lý và đưa vào kho tư liệu, tra cứu theo khóa và theo lớp.'
        : kind === 'video'
        ? 'Tư liệu hình ảnh động do ban truyền thông thực hiện, lưu trong kho của mạng lưới.'
        : 'Ảnh do ban tổ chức và các thành viên gửi về, đã qua bước kiểm duyệt trước khi công bố.',
      anh: photos,
      tulieu: docs,
    };
  });
}

/* ==========================================================================
   CƠ HỘI NGHỀ NGHIỆP
   ========================================================================== */

const VITRI = [
  ['Chuyên viên phân tích tín dụng doanh nghiệp', 'Tài chính và ngân hàng', 'Chuyên viên'],
  ['Kiểm toán viên cấp 2', 'Kiểm toán và kế toán', 'Chuyên viên'],
  ['Chuyên viên phân tích dữ liệu kinh doanh', 'Công nghệ', 'Chuyên viên'],
  ['Trưởng nhóm kế toán tổng hợp', 'Kiểm toán và kế toán', 'Trưởng nhóm'],
  ['Quản lý quan hệ khách hàng doanh nghiệp', 'Tài chính và ngân hàng', 'Quản lý'],
  ['Chuyên viên kế hoạch tài chính', 'Sản xuất', 'Chuyên viên'],
  ['Thực tập sinh phân tích đầu tư', 'Tài chính và ngân hàng', 'Thực tập'],
  ['Chuyên viên marketing thương hiệu', 'Bán lẻ và tiêu dùng', 'Chuyên viên'],
  ['Điều phối viên chuỗi cung ứng', 'Logistics', 'Chuyên viên'],
  ['Chuyên viên thẩm định dự án bất động sản', 'Bất động sản', 'Chuyên viên'],
  ['Trưởng phòng nhân sự', 'Sản xuất', 'Trưởng phòng'],
  ['Chuyên viên tư vấn chiến lược', 'Tư vấn', 'Chuyên viên'],
  ['Thực tập sinh kiểm toán mùa cao điểm', 'Kiểm toán và kế toán', 'Thực tập'],
  ['Chuyên viên nghiên cứu chính sách', 'Khu vực công', 'Chuyên viên'],
  ['Giám đốc tài chính', 'Khởi nghiệp', 'Giám đốc'],
  ['Chuyên viên vận hành sản phẩm cho vay', 'Công nghệ', 'Chuyên viên'],
  ['Trưởng nhóm nội dung số', 'Truyền thông', 'Trưởng nhóm'],
  ['Chuyên viên phát triển đối tác giáo dục', 'Giáo dục', 'Chuyên viên'],
  ['Chuyên viên định phí bảo hiểm', 'Tài chính và ngân hàng', 'Chuyên viên'],
  ['Quản lý dự án năng lượng tái tạo', 'Năng lượng', 'Quản lý'],
];

const HINHTHUC = ['Toàn thời gian', 'Toàn thời gian', 'Toàn thời gian', 'Bán thời gian', 'Thực tập', 'Hợp đồng dự án'];

function makeJobs(alumni) {
  return VITRI.map((v, idx) => {
    const [title, linhvuc, capbac] = v;
    const nguoiDang = alumni[(idx * 17 + 3) % alumni.length];
    const cty = CONGTY.filter((c) => c[1] === linhvuc)[0] || pick(CONGTY);
    const [tp, qg] = pick(THANHPHO);
    const dang = daysFrom(NOW, -int(1, 42));
    const han = daysFrom(NOW, int(7, 70));
    const luongTu = capbac === 'Thực tập' ? 4 : capbac === 'Chuyên viên' ? 15 : capbac === 'Trưởng nhóm' ? 28 : capbac === 'Quản lý' || capbac === 'Trưởng phòng' ? 40 : 70;

    return {
      id: 'j-' + String(idx + 1).padStart(3, '0'),
      slug: slugify(title) + '-' + (idx + 1),
      tieude: title,
      congty: cty[0],
      linhvuc,
      capbac,
      hinhthuc: capbac === 'Thực tập' ? 'Thực tập' : pick(HINHTHUC),
      thanhpho: tp,
      quocgia: qg,
      luong: capbac === 'Thực tập'
        ? luongTu + ' triệu đồng mỗi tháng'
        : luongTu + ' đến ' + (luongTu + int(8, 26)) + ' triệu đồng mỗi tháng',
      ngayDang: iso(dang),
      hanNop: iso(han),
      nguoiDangId: nguoiDang.id,
      mota: 'Vị trí do cựu sinh viên của trường giới thiệu vào mạng lưới. Doanh nghiệp ưu tiên ứng viên tốt nghiệp các ngành kinh tế và quản trị, có khả năng làm việc với số liệu.',
      yeucau: pickN([
        'Tốt nghiệp đại học khối ngành kinh tế, quản trị hoặc tài chính',
        'Thành thạo bảng tính và ít nhất một công cụ trực quan hóa dữ liệu',
        'Giao tiếp tiếng Anh ở mức đọc hiểu tài liệu chuyên ngành',
        'Có kinh nghiệm làm việc với báo cáo tài chính doanh nghiệp',
        'Chủ động trong việc theo dõi tiến độ và báo cáo công việc',
        'Ưu tiên ứng viên đã có chứng chỉ nghề nghiệp liên quan',
      ], int(3, 5)),
      quyenloi: pickN([
        'Bảo hiểm sức khỏe cho nhân viên và người thân',
        'Ngân sách đào tạo hằng năm',
        'Xét tăng lương hai lần mỗi năm',
        'Chế độ làm việc linh hoạt hai ngày mỗi tuần',
        'Hỗ trợ chi phí thi chứng chỉ nghề nghiệp',
      ], int(2, 4)),
      lienhe: 'tuyendung@' + slugify(cty[0]).split('-').slice(-2).join('') + '.example',
    };
  });
}

/* ==========================================================================
   NGƯỜI DÙNG VÀ PHÂN QUYỀN
   ========================================================================== */

function makeUsers(alumni) {
  const users = [
    { id: 'u-001', ten: 'Trần Hoài Thu', email: 'thu.tran@neu.edu.vn', vaitro: 'admin', khoa: 47, hoatdong: true, dangNhapCuoi: iso(daysFrom(NOW, -1)) },
    { id: 'u-002', ten: 'Lê Quang Đạt', email: 'dat.le@neu.edu.vn', vaitro: 'admin', khoa: 43, hoatdong: true, dangNhapCuoi: iso(daysFrom(NOW, -3)) },
    { id: 'u-003', ten: 'Phạm Ngọc Hà', email: 'ha.pham@neu.edu.vn', vaitro: 'editor', khoa: 55, hoatdong: true, dangNhapCuoi: iso(daysFrom(NOW, -1)) },
    { id: 'u-004', ten: 'Nguyễn Đức Kiên', email: 'kien.nguyen@neu.edu.vn', vaitro: 'editor', khoa: 58, hoatdong: true, dangNhapCuoi: iso(daysFrom(NOW, -6)) },
    { id: 'u-005', ten: 'Vũ Thanh Bình', email: 'binh.vu@neu.edu.vn', vaitro: 'editor', khoa: 51, hoatdong: false, dangNhapCuoi: iso(daysFrom(NOW, -94)) },
  ];
  alumni.slice(0, 16).forEach((a, i) => {
    users.push({
      id: 'u-' + String(100 + i).padStart(3, '0'),
      ten: a.name,
      email: a.email,
      vaitro: 'alumni',
      khoa: a.khoa,
      alumniId: a.id,
      hoatdong: chance(0.88),
      dangNhapCuoi: iso(daysFrom(NOW, -int(1, 120))),
    });
  });
  return users;
}

/* ==========================================================================
   NỘI DUNG GỬI LÊN CHỜ DUYỆT
   ========================================================================== */

function makeSubmissions(alumni) {
  const mau = [
    ['cauchuyen', 'Mười năm làm nghề định phí bảo hiểm', 'Tôi muốn gửi một bài viết về nghề định phí, một nghề mà ngay cả người trong ngành tài chính cũng ít khi hiểu rõ. Bài dài khoảng một nghìn hai trăm chữ, có kèm bốn ảnh chụp tại nơi làm việc.'],
    ['anh', 'Ảnh gặp mặt khóa 49 tại Hải Phòng', 'Nhóm khóa 49 vừa họp mặt cuối tuần trước. Gửi ban biên tập hai mươi ba tấm để chọn đưa vào kho kỷ niệm.'],
    ['tuyendung', 'Tuyển hai chuyên viên phân tích tại Đà Nẵng', 'Công ty tôi đang mở chi nhánh miền Trung và cần hai bạn phân tích. Ưu tiên cựu sinh viên trường, có thể nhận người mới ra trường.'],
    ['tulieu', 'Bản quét sổ tay sinh viên khóa 41', 'Tôi giữ được cuốn sổ tay sinh viên in năm 1996, đã quét đủ 84 trang. Nếu ban quản trị thấy có ích thì xin gửi vào kho tư liệu.'],
    ['cauchuyen', 'Chuyện về lớp học buổi tối ở giảng đường D', 'Một bài ngắn kể về những năm học tại chức, viết theo lời kể của ba người cùng lớp.'],
    ['anh', 'Ảnh lễ trao học bổng đợt tháng Tám', 'Ban tổ chức gửi ảnh chính thức của buổi lễ, đã chọn lọc còn mười bốn tấm.'],
    ['tuyendung', 'Thực tập sinh kiểm toán mùa cao điểm', 'Hãng chúng tôi nhận mười hai thực tập sinh cho mùa kiểm toán năm nay, thời gian ba tháng có phụ cấp.'],
  ];

  return mau.map((m, idx) => {
    const [kind, title, body] = m;
    const nguoi = alumni[(idx * 23 + 5) % alumni.length];
    const trangthai = idx < 4 ? 'cho-duyet' : idx === 4 ? 'da-duyet' : idx === 5 ? 'cho-duyet' : 'tu-choi';
    return {
      id: 's-' + String(idx + 1).padStart(3, '0'),
      loai: kind,
      tieude: title,
      noidung: body,
      nguoiGui: nguoi.name,
      emailGui: nguoi.email,
      khoaGui: nguoi.khoa,
      ngayGui: iso(daysFrom(NOW, -int(1, 18))),
      trangthai,
      anh: kind === 'anh' || kind === 'cauchuyen'
        ? [img('gui-' + idx + '-1', 500, 350), img('gui-' + idx + '-2', 500, 350), img('gui-' + idx + '-3', 500, 350)]
        : [],
    };
  });
}

/* ==========================================================================
   GHI RA ĐĨA
   ========================================================================== */

const alumni = makeAlumni(156);
const posts = makePosts(alumni);
const events = makeEvents();
const albums = makeAlbums();
const jobs = makeJobs(alumni);
const users = makeUsers(alumni);
const submissions = makeSubmissions(alumni);

const sets = [
  ['alumni', alumni, '__ALUMNI'],
  ['posts', posts, '__POSTS'],
  ['events', events, '__EVENTS'],
  ['albums', albums, '__ALBUMS'],
  ['jobs', jobs, '__JOBS'],
  ['users', users, '__USERS'],
  ['submissions', submissions, '__SUBMISSIONS'],
];

fs.mkdirSync(OUT, { recursive: true });

for (const [name, data, global] of sets) {
  const json = JSON.stringify(data, null, 1);
  fs.writeFileSync(path.join(OUT, name + '.json'), json + '\n');
  fs.writeFileSync(path.join(OUT, name + '.js'), 'window.' + global + ' = ' + json + ';\n');
  console.log(String(data.length).padStart(4) + '  ' + name);
}

console.log('\nĐã ghi vào ' + path.relative(process.cwd(), OUT));
