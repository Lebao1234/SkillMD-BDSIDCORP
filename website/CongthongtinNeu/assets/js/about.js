/* ==========================================================================
   TRANG GIỚI THIỆU

   Ba mục mà menu của trang thật trỏ tới: giới thiệu chung, lịch sử phát triển,
   cơ cấu tổ chức. Thêm khối liên hệ và số liệu ở cột bên.
   ========================================================================== */

(function () {
  'use strict';

  var U = window.__UI, D = window.__DATA, B = window.__BRAND;
  var $ = U.$;

  var MOC = [
    ['2014', 'Mạng lưới Cựu sinh viên, học viên chính thức được thành lập, quy tụ ban liên lạc của các khóa đã có từ trước đó.'],
    ['2016', 'Ra mắt cổng thông tin điện tử và bắt đầu số hóa dữ liệu cựu sinh viên theo khóa và theo ngành.'],
    ['2019', 'Hình thành các ban liên lạc khu vực phía Nam và miền Trung, tổ chức gặp mặt thường niên ở ba miền.'],
    ['2022', 'Khởi động chương trình cố vấn nghề nghiệp, kết nối cựu sinh viên với sinh viên năm cuối.'],
    ['2024', 'Kỷ niệm mười năm thành lập mạng lưới và công bố Quỹ phát triển tài năng kinh tế.'],
    ['2026', 'Hướng tới lễ kỷ niệm 70 năm thành lập trường, mở rộng hoạt động kết nối doanh nghiệp và việc làm.'],
  ];

  var TOCHUC = [
    ['Ban điều hành', 'Chịu trách nhiệm chung về định hướng hoạt động, quan hệ với nhà trường và các đối tác.'],
    ['Ban liên lạc các khóa', 'Đầu mối của từng khóa, tổ chức gặp mặt và cập nhật thông tin thành viên.'],
    ['Ban liên lạc khu vực', 'Phụ trách cộng đồng cựu sinh viên tại miền Bắc, miền Trung, miền Nam và nước ngoài.'],
    ['Ban truyền thông', 'Biên tập nội dung cho cổng thông tin, bản tin và các kênh mạng xã hội.'],
    ['Quỹ phát triển tài năng kinh tế', 'Vận động và quản lý nguồn lực cho học bổng, nghiên cứu và cơ sở vật chất.'],
  ];

  function boot() {
    var wrap = $('[data-about]');
    if (!wrap) return;

    wrap.innerHTML =
      '<section id="chung">' +
      '<h2>Giới thiệu chung</h2>' +
      '<p>Mạng lưới Cựu sinh viên, học viên Đại học Kinh tế Quốc dân là nơi kết nối những người đã học tập ' +
      'tại trường qua nhiều thế hệ, từ các khóa đầu tiên cho tới những khóa vừa tốt nghiệp.</p>' +
      '<p>Mạng lưới hoạt động trên ba trục: giữ liên lạc giữa các thế hệ, chia sẻ cơ hội nghề nghiệp và ' +
      'kinh nghiệm làm việc, và huy động nguồn lực đóng góp trở lại cho nhà trường và cho sinh viên đang học.</p>' +
      '<p>Cổng thông tin này là kênh chính thức của mạng lưới: nơi đăng tin hoạt động, mở đăng ký sự kiện, ' +
      'lưu trữ tư liệu của các khóa, và tra cứu danh bạ thành viên theo phạm vi công khai mà chính mỗi người lựa chọn.</p>' +
      '</section>' +

      '<section id="lich-su">' +
      '<h2>Lịch sử phát triển</h2>' +
      '<div class="doclist">' +
      MOC.map(function (m) {
        return '<div class="docrow" style="grid-template-columns:72px minmax(0,1fr)">' +
          '<span class="docrow__name" style="color:var(--blue);font-size:var(--fs-xl)">' + m[0] + '</span>' +
          '<span class="docrow__meta" style="font-size:var(--fs-md);color:var(--text-primary);line-height:var(--lh-base)">' +
          U.esc(m[1]) + '</span></div>';
      }).join('') +
      '</div></section>' +

      '<section id="to-chuc">' +
      '<h2>Cơ cấu tổ chức</h2>' +
      '<div class="doclist">' +
      TOCHUC.map(function (t) {
        return '<div class="docrow" style="grid-template-columns:minmax(0,1fr)">' +
          '<div><p class="docrow__name">' + U.esc(t[0]) + '</p>' +
          '<p class="docrow__meta" style="line-height:var(--lh-base)">' + U.esc(t[1]) + '</p></div></div>';
      }).join('') +
      '</div></section>' +

      '<section id="lien-he">' +
      '<h2>Liên hệ</h2>' +
      '<p>Mọi đề nghị hợp tác, đóng góp nội dung hoặc yêu cầu chỉnh sửa hồ sơ xin gửi về văn phòng mạng lưới ' +
      'theo địa chỉ ở cột bên. Nội dung gửi qua biểu mẫu <a class="link" href="dong-gop.html">Đóng góp nội dung</a> ' +
      'sẽ vào thẳng hàng chờ duyệt của ban quản trị.</p>' +
      '</section>';

    var lh = $('[data-lienhe]');
    if (lh) {
      lh.innerHTML =
        '<p style="font-size:var(--fs-md);line-height:var(--lh-base);color:var(--text-primary)">' +
        U.esc(B.diaChi) + '</p>' +
        '<p style="font-size:var(--fs-md);margin-top:var(--space-5)">' +
        '<a class="link" href="mailto:' + U.esc(B.email) + '">' + U.esc(B.email) + '</a><br>' +
        U.esc(B.dienThoai) + '</p>';
    }

    var st = $('[data-about-stats]');
    if (st) {
      var al = D.alumni();
      var khoa = al.map(function (a) { return a.khoa; });
      var rows = [
        [U.fmtNum(al.length), 'hồ sơ trong cơ sở dữ liệu'],
        ['K' + Math.min.apply(null, khoa) + ' tới K' + Math.max.apply(null, khoa), 'các khóa đã ghi nhận'],
        [U.fmtNum(new Set(al.map(function (a) { return a.nganh; })).size), 'ngành đào tạo'],
        [U.fmtNum(D.events().length), 'sự kiện đã tổ chức và sắp diễn ra'],
        [U.fmtNum(D.albums().length), 'bộ tư liệu đã số hóa'],
      ];
      st.innerHTML = rows.map(function (r) {
        return '<div style="display:flex;justify-content:space-between;gap:var(--space-6);padding-block:var(--space-4);border-bottom:1px solid var(--border);font-size:var(--fs-md)">' +
          '<span style="color:var(--text-secondary)">' + U.esc(r[1]) + '</span>' +
          '<strong style="font-family:var(--font-display);color:var(--blue);white-space:nowrap">' + r[0] + '</strong></div>';
      }).join('');
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
