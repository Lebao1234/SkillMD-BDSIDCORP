/* ==========================================================================
   HẰNG SỐ THƯƠNG HIỆU VÀ SƠ ĐỒ ĐIỀU HƯỚNG

   Sơ đồ menu bám theo đúng cấu trúc của https://alumni.neu.edu.vn/: mười mục
   cấp một, mỗi mục có menu con đổ xuống. Tên mục giữ nguyên như trang thật để
   người đã quen trang cũ không phải học lại.

   Phần bổ sung của bản demo (danh bạ tra cứu, đăng ký thành viên, đóng góp
   nội dung, quản trị) được gắn vào đúng nhánh nghiệp vụ của nó thay vì dựng
   thêm một mục cấp một mới.
   ========================================================================== */

window.__BRAND = {
  ten: 'Mạng lưới Cựu sinh viên',
  truong: 'Đại học Kinh tế Quốc dân',
  vietTat: 'NEU',
  moTa:
    'Cổng thông tin Mạng lưới Cựu sinh viên, học viên Đại học Kinh tế Quốc dân. ' +
    'Tin tức, kết nối, chia sẻ, hợp tác và tôn vinh những cựu sinh viên thành công.',
  diaChi: '207 đường Giải Phóng, phường Đồng Tâm, quận Hai Bà Trưng, Hà Nội',
  email: 'alumni@neu.edu.vn',
  dienThoai: '024 3628 0280',
  web: 'https://alumni.neu.edu.vn',

  /* Băng chữ chạy ngay dưới thanh điều hướng, như trang thật. */
  ribbon: {
    nhan: 'Kỷ niệm 10 năm thành lập Mạng lưới cựu sinh viên, học viên và công bố Quỹ phát triển tài năng kinh tế',
    href: 'su-kien.html',
  },

  /* Ba banner ngang trên cùng, đúng vị trí và đúng ảnh của trang gốc.
     Khi bàn giao, thay bằng banner của trường. Nếu ảnh không tải được,
     ui.js dựng một hình thay thế theo màu thương hiệu. */
  banner: [
    { alt: 'Quỹ phát triển tài năng kinh tế', href: 'su-kien.html', seed: 'banner-r1',
      src: 'https://storage-vnportal.vnpt.vn/sannongnghiep/2832/banner/R1.png' },
    { alt: 'Mạng lưới cựu sinh viên, học viên', href: 'alumni.html', seed: 'banner-r2',
      src: 'https://storage-vnportal.vnpt.vn/sannongnghiep/2832/banner/R2.png' },
    { alt: 'Kỷ niệm 10 năm thành lập mạng lưới', href: 'su-kien.html', seed: 'banner-r3',
      src: 'https://storage-vnportal.vnpt.vn/sannongnghiep/2832/banner/R3.png' },
  ],

  /* Điều hướng chính. Cấu trúc và tên mục lấy từ trang thật. */
  menu: [
    { nhan: 'Trang chủ', href: 'index.html', icon: 'house' },
    {
      nhan: 'Giới thiệu', href: 'gioi-thieu.html',
      sub: [
        { nhan: 'Giới thiệu chung', href: 'gioi-thieu.html#chung' },
        { nhan: 'Lịch sử phát triển', href: 'gioi-thieu.html#lich-su' },
        { nhan: 'Cơ cấu tổ chức', href: 'gioi-thieu.html#to-chuc' },
      ],
    },
    {
      nhan: 'Tin tức', href: 'tin-tuc.html',
      sub: [
        { nhan: 'ĐH KTQD hôm nay', href: 'tin-tuc.html?danhmuc=Ho%E1%BA%A1t%20%C4%91%E1%BB%99ng%20Khoa' },
        { nhan: 'Sự kiện, tiêu điểm', href: 'tin-tuc.html?danhmuc=S%E1%BB%B1%20ki%E1%BB%87n' },
        { nhan: 'Thành tựu', href: 'tin-tuc.html?danhmuc=Th%C3%A0nh%20t%E1%BB%B1u' },
      ],
    },
    {
      nhan: 'Kết nối', href: 'alumni.html',
      sub: [
        { nhan: 'Danh bạ cựu sinh viên', href: 'alumni.html' },
        { nhan: 'Sự kiện gặp gỡ cựu sinh viên', href: 'su-kien.html' },
        { nhan: 'Đăng ký thành viên', href: 'dang-ky.html' },
        { nhan: 'Tài khoản của tôi', href: 'tai-khoan.html' },
      ],
    },
    {
      nhan: 'Chia sẻ', href: 'cau-chuyen.html',
      sub: [
        { nhan: 'Kinh nghiệm thành công', href: 'cau-chuyen.html' },
        { nhan: 'Việc làm', href: 'nghe-nghiep.html' },
        { nhan: 'Đóng góp nội dung', href: 'dong-gop.html' },
      ],
    },
    {
      nhan: 'Hợp tác', href: 'nghe-nghiep.html',
      sub: [
        { nhan: 'Doanh nghiệp tuyển dụng', href: 'nghe-nghiep.html' },
        { nhan: 'Hội thảo, hội nghị', href: 'su-kien.html?khi=sap' },
      ],
    },
    {
      nhan: 'Thành công', href: 'cau-chuyen.html',
      sub: [
        { nhan: 'Chân dung', href: 'alumni.html?noibat=1' },
        { nhan: 'Câu chuyện thành công', href: 'cau-chuyen.html' },
      ],
    },
    {
      nhan: 'Hình ảnh - video', href: 'ky-niem.html',
      sub: [
        { nhan: 'Hình ảnh', href: 'ky-niem.html?loai=anh' },
        { nhan: 'Video', href: 'ky-niem.html?loai=video' },
        { nhan: 'Kỷ yếu', href: 'ky-niem.html?loai=kyyeu' },
      ],
    },
    { nhan: 'Quỹ phát triển tài năng kinh tế', href: 'su-kien.html' },
    { nhan: 'Liên hệ', href: 'gioi-thieu.html#lien-he' },
  ],

  chanTrang: [
    {
      tieuDe: 'Kết nối',
      muc: [
        { nhan: 'Danh bạ cựu sinh viên', href: 'alumni.html' },
        { nhan: 'Sự kiện gặp gỡ', href: 'su-kien.html' },
        { nhan: 'Đăng ký thành viên', href: 'dang-ky.html' },
        { nhan: 'Tài khoản của tôi', href: 'tai-khoan.html' },
      ],
    },
    {
      tieuDe: 'Chia sẻ',
      muc: [
        { nhan: 'Tin tức', href: 'tin-tuc.html' },
        { nhan: 'Câu chuyện thành công', href: 'cau-chuyen.html' },
        { nhan: 'Việc làm', href: 'nghe-nghiep.html' },
        { nhan: 'Đóng góp nội dung', href: 'dong-gop.html' },
      ],
    },
    {
      tieuDe: 'Tư liệu',
      muc: [
        { nhan: 'Hình ảnh và video', href: 'ky-niem.html' },
        { nhan: 'Giới thiệu mạng lưới', href: 'gioi-thieu.html' },
        { nhan: 'Tìm kiếm', href: 'tim-kiem.html' },
        { nhan: 'Quản trị nội dung', href: 'admin.html' },
      ],
    },
  ],
};
