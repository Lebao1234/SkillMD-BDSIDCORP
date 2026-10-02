/* ==========================================================================
   CMS QUẢN TRỊ

   Hai điều đáng nói về cách nó lưu.

   CMS không sửa file dữ liệu gốc. Nó ghi một lớp đè trong localStorage: bản vá
   theo id, danh sách id đã ẩn, và các bản ghi mới. Trang công khai đọc qua
   data.js nên thấy ngay thay đổi, còn assets/data/*.js vẫn nguyên. Muốn quay
   về ban đầu thì xóa lớp đè, không phải dựng lại dữ liệu.

   Phân quyền được kiểm ở hai chỗ chứ không phải một. Nút và mục menu ngoài
   tầm quyền bị ẩn, nhưng mọi thao tác ghi còn gọi lại quyen() một lần nữa
   trước khi chạy. Ẩn nút chỉ là giao diện, không phải kiểm soát truy cập.
   ========================================================================== */

(function () {
  'use strict';

  var U = window.__UI, D = window.__DATA, C = window.__CARDS, S = window.__STORE;
  var $ = U.$, $$ = U.$$;

  /* ------------------------------------------------------------------------
     Quyền

     Bảng này cũng là nguồn dữ liệu cho màn Phân quyền, nên tài liệu hiển thị
     cho người dùng không bao giờ lệch với hành vi thật của hệ thống.
     ------------------------------------------------------------------------ */
  var QUYEN = [
    ['noidung.doc', 'Xem nội dung', ['admin', 'editor']],
    ['noidung.sua', 'Thêm và sửa bài viết, sự kiện, album, tuyển dụng', ['admin', 'editor']],
    ['noidung.xoa', 'Xóa nội dung', ['admin']],
    ['duyet', 'Duyệt nội dung gửi lên', ['admin', 'editor']],
    ['alumni.sua', 'Sửa hồ sơ cựu sinh viên', ['admin', 'editor']],
    ['alumni.xoa', 'Xóa hồ sơ cựu sinh viên', ['admin']],
    ['nguoidung', 'Quản lý người dùng và phân quyền', ['admin']],
    ['saoluu', 'Sao lưu và khôi phục dữ liệu', ['admin']],
  ];

  function quyen(ma) {
    var me = S.getSession();
    if (!me) return false;
    var row = QUYEN.filter(function (q) { return q[0] === ma; })[0];
    return !!row && row[2].indexOf(me.vaitro) >= 0;
  }

  function chan(ma) {
    if (quyen(ma)) return false;
    U.toast('Tài khoản của bạn không có quyền thực hiện thao tác này.', 'error');
    return true;
  }

  /* ------------------------------------------------------------------------
     Định nghĩa từng loại bản ghi, để bảng và hộp thoại soạn thảo dùng chung
     một mô tả thay vì mỗi nơi viết lại.
     ------------------------------------------------------------------------ */
  var LOAI = {
    posts: {
      nhan: 'Bài viết',
      lay: function () { return D.posts(); },
      cot: ['Tiêu đề', 'Danh mục', 'Loại', 'Ngày đăng'],
      hang: function (r) {
        return [
          '<div class="table__cell-main">' +
          '<img class="table__thumb" src="' + U.esc(r.anh) + '" alt="" data-seed="' + U.esc(r.slug) + '" loading="lazy">' +
          '<div><div class="table__name">' + U.esc(r.tieude) + '</div>' +
          '<div class="table__sub">' + U.esc(r.slug) + '</div></div></div>',
          '<span class="tag">' + U.esc(r.danhmuc) + '</span>',
          r.loai === 'tin' ? 'Tin tức' : 'Câu chuyện',
          U.fmtDateShort(r.ngay),
        ];
      },
      truong: [
        ['tieude', 'Tiêu đề', 'text', 'required|min:6'],
        ['danhmuc', 'Danh mục', 'text', 'required'],
        ['tomtat', 'Tóm tắt', 'textarea', 'required|min:20'],
        ['ngay', 'Ngày đăng', 'date', 'required'],
        ['anh', 'Đường dẫn ảnh bìa', 'text', ''],
      ],
      moi: function () {
        return {
          id: 'p-u-' + Date.now().toString(36),
          slug: 'bai-moi-' + Date.now().toString(36),
          loai: 'tin', danhmuc: 'Hoạt động Khoa', tieude: '', tomtat: '',
          anh: 'https://picsum.photos/seed/neu-bai-moi/1200/675',
          tacgia: 'Ban Truyền thông Mạng lưới',
          ngay: new Date().toISOString().slice(0, 10),
          the: [], noibat: false, phut: 4, noidung: [],
        };
      },
      tim: function (r) { return [r.tieude, r.danhmuc, r.tomtat].join(' '); },
    },

    events: {
      nhan: 'Sự kiện',
      lay: function () { return D.events(); },
      cot: ['Sự kiện', 'Thời gian', 'Địa điểm', 'Đăng ký'],
      hang: function (r) {
        var da = D.soDaDangKy(r);
        return [
          '<div class="table__cell-main"><div>' +
          '<div class="table__name">' + U.esc(r.tieude) + '</div>' +
          '<div class="table__sub">' + U.esc(r.loai) + '</div></div></div>',
          U.fmtDateShort(r.batdau),
          U.esc(r.thanhpho),
          '<span class="tabular">' + U.fmtNum(da) + ' / ' + U.fmtNum(r.succhua) + '</span>' +
          (da >= r.succhua ? ' <span class="tag tag--danger">Hết chỗ</span>' : ''),
        ];
      },
      truong: [
        ['tieude', 'Tên sự kiện', 'text', 'required|min:6'],
        ['diadiem', 'Địa điểm', 'text', 'required'],
        ['thanhpho', 'Thành phố', 'text', 'required'],
        ['loai', 'Loại sự kiện', 'text', ''],
        ['succhua', 'Sức chứa', 'number', 'required'],
        ['tomtat', 'Tóm tắt', 'textarea', 'required|min:20'],
      ],
      moi: function () {
        var d = new Date(Date.now() + 30 * 86400000);
        return {
          id: 'e-u-' + Date.now().toString(36),
          slug: 'su-kien-moi-' + Date.now().toString(36),
          tieude: '', tomtat: '',
          anh: 'https://picsum.photos/seed/neu-sukien-moi/1200/675',
          batdau: d.toISOString(), ketthuc: new Date(d.getTime() + 3 * 3600000).toISOString(),
          diadiem: '', thanhpho: 'Hà Nội', loai: 'Gặp mặt',
          succhua: 100, dadangky: 0, phi: 0, moDangKy: true, noidung: [],
        };
      },
      tim: function (r) { return [r.tieude, r.diadiem, r.thanhpho, r.loai].join(' '); },
    },

    albums: {
      nhan: 'Album',
      lay: function () { return D.albums(); },
      cot: ['Album', 'Loại', 'Năm', 'Số tệp'],
      hang: function (r) {
        return [
          '<div class="table__cell-main">' +
          '<img class="table__thumb" src="' + U.esc(r.bia) + '" alt="" data-seed="' + U.esc(r.slug) + '" loading="lazy">' +
          '<div><div class="table__name">' + U.esc(r.tieude) + '</div>' +
          '<div class="table__sub">' + (r.khoa ? 'Khóa ' + r.khoa : 'Không theo khóa') + '</div></div></div>',
          r.loai === 'kyyeu' ? 'Kỷ yếu' : r.loai === 'video' ? 'Video' : 'Ảnh',
          String(r.nam),
          '<span class="tabular">' + r.anh.length + '</span>',
        ];
      },
      truong: [
        ['tieude', 'Tên album', 'text', 'required|min:4'],
        ['nam', 'Năm', 'number', 'required|year'],
        ['khoa', 'Khóa', 'number', ''],
        ['mota', 'Mô tả', 'textarea', ''],
      ],
      moi: function () {
        return {
          id: 'ab-u-' + Date.now().toString(36),
          slug: 'album-moi-' + Date.now().toString(36),
          tieude: '', nam: new Date().getFullYear(), khoa: null, loai: 'anh',
          bia: 'https://picsum.photos/seed/neu-album-moi/1000/750',
          mota: '', anh: [], tulieu: [],
        };
      },
      tim: function (r) { return [r.tieude, r.mota, r.nam, r.khoa].join(' '); },
    },

    jobs: {
      nhan: 'Tuyển dụng',
      lay: function () { return D.jobs(); },
      cot: ['Vị trí', 'Lĩnh vực', 'Nơi làm việc', 'Hạn nộp'],
      hang: function (r) {
        var het = new Date(r.hanNop).getTime() < Date.now();
        return [
          '<div class="table__cell-main">' + U.orgMark(r.congty, 'orgmark--sm') +
          '<div><div class="table__name">' + U.esc(r.tieude) + '</div>' +
          '<div class="table__sub">' + U.esc(r.congty) + '</div></div></div>',
          U.esc(r.linhvuc),
          U.esc(r.thanhpho),
          het ? '<span class="tag tag--danger">Hết hạn</span>' : U.fmtDateShort(r.hanNop),
        ];
      },
      truong: [
        ['tieude', 'Chức danh', 'text', 'required|min:6'],
        ['congty', 'Doanh nghiệp', 'text', 'required'],
        ['linhvuc', 'Lĩnh vực', 'text', 'required'],
        ['thanhpho', 'Nơi làm việc', 'text', 'required'],
        ['luong', 'Mức lương', 'text', ''],
        ['hanNop', 'Hạn nộp', 'date', 'required'],
        ['mota', 'Mô tả', 'textarea', ''],
      ],
      moi: function () {
        return {
          id: 'j-u-' + Date.now().toString(36),
          slug: 'vi-tri-moi-' + Date.now().toString(36),
          tieude: '', congty: '', linhvuc: 'Tài chính và ngân hàng',
          capbac: 'Chuyên viên', hinhthuc: 'Toàn thời gian',
          thanhpho: 'Hà Nội', quocgia: 'Việt Nam', luong: '',
          ngayDang: new Date().toISOString().slice(0, 10),
          hanNop: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
          nguoiDangId: null, mota: '', yeucau: [], quyenloi: [], lienhe: '',
        };
      },
      tim: function (r) { return [r.tieude, r.congty, r.linhvuc, r.thanhpho].join(' '); },
    },

    alumni: {
      nhan: 'Cựu sinh viên',
      lay: function () { return D.alumni(); },
      cot: ['Họ tên', 'Khóa', 'Ngành', 'Nơi công tác'],
      hang: function (r) {
        return [
          '<div class="table__cell-main">' +
          '<span class="avatar avatar--sm" data-name="' + U.esc(r.name) + '" style="' + U.avatarStyle(r.name) + '" aria-hidden="true">' + U.esc(U.initials(r.name)) + '</span>' +
          '<div><div class="table__name">' + U.esc(r.name) + '</div>' +
          '<div class="table__sub">' + U.esc(r.email) + '</div></div></div>',
          'K' + r.khoa,
          U.esc(r.nganh),
          U.esc(r.congty || 'Chưa cập nhật'),
        ];
      },
      truong: [
        ['name', 'Họ và tên', 'text', 'required|min:3'],
        ['khoa', 'Khóa', 'number', 'required'],
        ['nganh', 'Ngành đào tạo', 'text', 'required'],
        ['congty', 'Nơi công tác', 'text', ''],
        ['chucdanh', 'Chức danh', 'text', ''],
        ['thanhpho', 'Nơi sinh sống', 'text', ''],
        ['email', 'Email', 'email', 'required|email'],
      ],
      moi: function () {
        return {
          id: 'al-u-' + Date.now().toString(36), slug: 'ho-so-moi-' + Date.now().toString(36),
          name: '', khoa: 60, lop: '', nganh: 'Kinh tế học',
          namNhapHoc: 2015, namTotNghiep: 2019, linhvuc: 'Khác',
          congty: '', chucdanh: '', thanhpho: 'Hà Nội', quocgia: 'Việt Nam',
          email: '', dienthoai: '', coVanNghiepVu: false, quanTam: [], gioiThieu: '',
          privacy: { email: 'thanh-vien', phone: 'rieng-tu', company: 'cong-khai', city: 'cong-khai' },
          thamGia: new Date().toISOString().slice(0, 10),
        };
      },
      tim: function (r) { return [r.name, r.congty, r.nganh, r.email, 'k' + r.khoa].join(' '); },
    },
  };

  /* ------------------------------------------------------------------------
     Trạng thái màn hình
     ------------------------------------------------------------------------ */
  var panel = U.param('panel', 'tongquan');
  var tim = '';
  var chon = [];

  var NHAN_PANEL = {
    tongquan: 'Tổng quan', baiviet: 'Bài viết', sukien: 'Sự kiện', album: 'Album',
    vieclam: 'Tuyển dụng', duyet: 'Nội dung chờ duyệt', alumni: 'Cựu sinh viên',
    nguoidung: 'Người dùng', phanquyen: 'Phân quyền', saoluu: 'Sao lưu và khôi phục',
  };
  var PANEL_LOAI = { baiviet: 'posts', sukien: 'events', album: 'albums', vieclam: 'jobs', alumni: 'alumni' };

  /* ------------------------------------------------------------------------
     Bảng dữ liệu dùng chung
     ------------------------------------------------------------------------ */
  function bang(key) {
    var L = LOAI[key];
    var all = L.lay();
    var q = U.fold(tim.trim());
    var items = q.length < 2 ? all : all.filter(function (r) {
      var hay = U.fold(L.tim(r));
      return q.split(/\s+/).every(function (w) { return hay.indexOf(w) >= 0; });
    });

    var suaDuoc = quyen(key === 'alumni' ? 'alumni.sua' : 'noidung.sua');
    var xoaDuoc = quyen(key === 'alumni' ? 'alumni.xoa' : 'noidung.xoa');

    var tbar =
      '<div class="tbar' + (chon.length ? ' has-sel' : '') + '">' +
      '<div class="tbar__idle">' +
      '<div class="searchbox"><i class="ph-light ph-magnifying-glass searchbox__icon" aria-hidden="true"></i>' +
      '<label class="sr-only" for="tq">Tìm trong ' + U.esc(L.nhan.toLowerCase()) + '</label>' +
      '<input class="input" id="tq" type="search" placeholder="Tìm trong ' + U.esc(L.nhan.toLowerCase()) + '" value="' + U.esc(tim) + '" data-tq></div>' +
      '<span class="dim" style="font-size:var(--fs-xs)">' + U.fmtNum(items.length) + ' bản ghi</span>' +
      (suaDuoc ? '<button class="btn btn--primary btn--sm" style="margin-left:auto" type="button" data-new="' + key + '">Thêm mới</button>' : '') +
      '</div>' +
      '<div class="tbar__sel">' +
      '<strong>' + chon.length + ' mục đã chọn</strong>' +
      (xoaDuoc ? '<button class="btn btn--danger btn--sm" type="button" data-bulk-del="' + key + '">Xóa mục đã chọn</button>' : '') +
      '<button class="btn btn--quiet btn--sm" type="button" data-unsel>Bỏ chọn</button>' +
      '</div></div>';

    if (!items.length) {
      return tbar + '<div class="table-wrap" style="border-radius:0 0 12px 12px">' +
        C.empty(
          q ? 'Không có bản ghi nào khớp' : 'Chưa có ' + L.nhan.toLowerCase() + ' nào',
          q ? 'Thử từ khóa ngắn hơn, hoặc xóa ô tìm kiếm để xem lại toàn bộ.'
            : 'Bấm Thêm mới để tạo bản ghi đầu tiên.',
          'table'
        ) + '</div>';
    }

    return tbar +
      '<div class="table-wrap"><table class="table">' +
      '<thead><tr>' +
      '<th style="width:40px"><input type="checkbox" data-sel-all aria-label="Chọn tất cả"></th>' +
      L.cot.map(function (c) { return '<th>' + U.esc(c) + '</th>'; }).join('') +
      '<th style="width:140px"><span class="sr-only">Thao tác</span></th>' +
      '</tr></thead><tbody>' +
      items.map(function (r) {
        var o = chon.indexOf(r.id) >= 0;
        return '<tr' + (suaDuoc ? '' : ' class="is-locked"') + '>' +
          '<td><input type="checkbox" data-sel="' + U.esc(r.id) + '"' + (o ? ' checked' : '') +
          ' aria-label="Chọn bản ghi"' + (suaDuoc ? '' : ' disabled') + '></td>' +
          L.hang(r).map(function (c) { return '<td>' + c + '</td>'; }).join('') +
          '<td><div class="table__actions">' +
          (suaDuoc ? '<button class="btn btn--quiet btn--sm" type="button" data-edit="' + key + ':' + U.esc(r.id) + '">Sửa</button>' : '') +
          (xoaDuoc ? '<button class="btn btn--quiet btn--sm" type="button" data-del="' + key + ':' + U.esc(r.id) + '" style="color:var(--danger)">Xóa</button>' : '') +
          (!suaDuoc && !xoaDuoc ? '<span class="dim" style="font-size:var(--fs-xs)">Chỉ đọc</span>' : '') +
          '</div></td></tr>';
      }).join('') +
      '</tbody></table></div>';
  }

  /* ------------------------------------------------------------------------
     Các màn riêng
     ------------------------------------------------------------------------ */
  function manTongQuan() {
    var cho = S.getSubmissions().filter(function (s) { return s.trangthai === 'cho-duyet'; });
    var sapToi = D.sapToi();
    var dk = S.getRegistrations();
    var moiNhat = D.posts().slice(0, 5);

    return '<div class="kpis">' +
      kpi(D.posts().length, 'Bài viết') +
      kpi(D.alumni().length, 'Hồ sơ cựu sinh viên') +
      kpi(sapToi.length, 'Sự kiện sắp diễn ra') +
      kpi(D.jobs().length, 'Tin tuyển dụng') +
      kpi(cho.length, 'Chờ duyệt', cho.length > 0) +
      kpi(dk.length, 'Lượt đăng ký mới') +
      '</div>' +

      '<section aria-labelledby="h-cho">' +
      '<h2 id="h-cho" style="font-size:var(--fs-xl);margin-bottom:var(--space-9)">Cần xử lý</h2>' +
      (cho.length
        ? '<div class="doclist">' + cho.slice(0, 4).map(function (s) {
            return '<div class="docrow"><span class="docrow__icon" aria-hidden="true"><i class="ph-light ph-tray"></i></span>' +
              '<div><p class="docrow__name">' + U.esc(s.tieude) + '</p>' +
              '<p class="docrow__meta">' + U.esc(s.nguoiGui) + ' gửi ngày ' + U.fmtDateShort(s.ngayGui) + '</p></div>' +
              '<button class="btn btn--ghost btn--sm" type="button" data-panel="duyet">Mở hàng chờ</button></div>';
          }).join('') + '</div>'
        : C.empty('Hàng chờ trống', 'Không có nội dung nào đang đợi duyệt. Nội dung do cựu sinh viên gửi lên sẽ hiện ở đây.', 'check-circle')) +
      '</section>' +

      '<section aria-labelledby="h-moi">' +
      '<h2 id="h-moi" style="font-size:var(--fs-xl);margin-bottom:var(--space-9)">Bài đăng gần nhất</h2>' +
      '<div class="table-wrap"><table class="table"><thead><tr><th>Tiêu đề</th><th>Danh mục</th><th>Ngày</th></tr></thead><tbody>' +
      moiNhat.map(function (p) {
        return '<tr><td><span class="table__name">' + U.esc(p.tieude) + '</span></td>' +
          '<td><span class="tag">' + U.esc(p.danhmuc) + '</span></td>' +
          '<td>' + U.fmtDateShort(p.ngay) + '</td></tr>';
      }).join('') +
      '</tbody></table></div></section>';
  }

  function kpi(n, nhan, canh) {
    return '<div class="kpi' + (canh ? ' kpi--alert' : '') + '">' +
      '<span class="kpi__num">' + U.fmtNum(n) + '</span>' +
      '<span class="kpi__label">' + U.esc(nhan) + '</span></div>';
  }

  function manDuyet() {
    var all = S.getSubmissions();
    var cho = all.filter(function (s) { return s.trangthai === 'cho-duyet'; });
    var khac = all.filter(function (s) { return s.trangthai !== 'cho-duyet'; });
    var NHAN = { cauchuyen: 'Câu chuyện', anh: 'Ảnh kỷ niệm', tulieu: 'Tư liệu', tuyendung: 'Tin tuyển dụng' };
    var duyetDuoc = quyen('duyet');

    function the(s) {
      var t = s.trangthai === 'da-duyet' ? ['tag--success', 'Đã duyệt']
        : s.trangthai === 'tu-choi' ? ['tag--danger', 'Không duyệt'] : ['tag--warning', 'Chờ duyệt'];
      return '<article class="subcard">' +
        '<div class="subcard__head">' +
        '<span class="tag tag--accent">' + U.esc(NHAN[s.loai] || s.loai) + '</span>' +
        '<h3 class="subcard__title">' + U.esc(s.tieude) + '</h3>' +
        '<span class="tag ' + t[0] + '" style="margin-left:auto">' + t[1] + '</span></div>' +
        '<p class="subcard__by">' + U.esc(s.nguoiGui) +
        (s.khoaGui ? ', khóa ' + U.esc(s.khoaGui) : '') +
        ' &middot; ' + U.esc(s.emailGui) + ' &middot; gửi ngày ' + U.fmtDateShort(s.ngayGui) + '</p>' +
        '<p class="subcard__body">' + U.esc(s.noidung) + '</p>' +
        ((s.anh && s.anh.length)
          ? '<div class="subcard__media">' + s.anh.map(function (a, i) {
              return '<img src="' + U.esc(a) + '" alt="Ảnh đính kèm ' + (i + 1) + '" data-seed="' + U.esc(s.id + '-' + i) + '" loading="lazy">';
            }).join('') + '</div>'
          : '') +
        ((s.tenTep && s.tenTep.length)
          ? '<p class="dim" style="font-size:var(--fs-xs)">Tệp đính kèm: ' + U.esc(s.tenTep.join(', ')) + '</p>'
          : '') +
        (duyetDuoc && s.trangthai === 'cho-duyet'
          ? '<div class="subcard__acts">' +
            '<button class="btn btn--primary btn--sm" type="button" data-approve="' + U.esc(s.id) + '">Duyệt và đăng</button>' +
            '<button class="btn btn--ghost btn--sm" type="button" data-reject="' + U.esc(s.id) + '">Không duyệt</button>' +
            '</div>'
          : duyetDuoc
          ? '<div class="subcard__acts"><button class="btn btn--quiet btn--sm" type="button" data-reset-sub="' + U.esc(s.id) + '">Trả về chờ duyệt</button></div>'
          : '') +
        '</article>';
    }

    return '<section aria-labelledby="h-q1">' +
      '<h2 id="h-q1" style="font-size:var(--fs-xl);margin-bottom:var(--space-9)">Đang chờ (' + cho.length + ')</h2>' +
      (cho.length
        ? '<div style="display:grid;gap:var(--space-10)">' + cho.map(the).join('') + '</div>'
        : C.empty('Không còn gì để duyệt', 'Mọi nội dung gửi lên đã được xử lý. Nội dung mới sẽ xuất hiện tại đây.', 'check-circle')) +
      '</section>' +
      (khac.length
        ? '<section aria-labelledby="h-q2"><h2 id="h-q2" style="font-size:var(--fs-xl);margin-bottom:var(--space-9)">Đã xử lý</h2>' +
          '<div style="display:grid;gap:var(--space-10)">' + khac.map(the).join('') + '</div></section>'
        : '');
  }

  function manNguoiDung() {
    var us = D.users();
    var VAITRO = { admin: 'Quản trị viên', editor: 'Biên tập viên', alumni: 'Cựu sinh viên' };
    return '<div class="table-wrap"><table class="table">' +
      '<thead><tr><th>Người dùng</th><th>Vai trò</th><th>Khóa</th><th>Đăng nhập gần nhất</th><th>Trạng thái</th></tr></thead><tbody>' +
      us.map(function (u) {
        return '<tr>' +
          '<td><div class="table__cell-main">' +
          '<span class="avatar avatar--sm" data-name="' + U.esc(u.ten) + '" style="' + U.avatarStyle(u.ten) + '" aria-hidden="true">' + U.esc(U.initials(u.ten)) + '</span>' +
          '<div><div class="table__name">' + U.esc(u.ten) + '</div>' +
          '<div class="table__sub">' + U.esc(u.email) + '</div></div></div></td>' +
          '<td><label class="sr-only" for="vt-' + u.id + '">Vai trò của ' + U.esc(u.ten) + '</label>' +
          '<select class="select" id="vt-' + u.id + '" data-role="' + U.esc(u.id) + '" style="min-width:150px">' +
          Object.keys(VAITRO).map(function (k) {
            return '<option value="' + k + '"' + (k === u.vaitro ? ' selected' : '') + '>' + VAITRO[k] + '</option>';
          }).join('') + '</select></td>' +
          '<td>' + (u.khoa ? 'K' + u.khoa : '') + '</td>' +
          '<td>' + U.fmtDateShort(u.dangNhapCuoi) + '</td>' +
          '<td>' + (u.hoatdong ? '<span class="tag tag--success">Đang hoạt động</span>' : '<span class="tag">Đã khóa</span>') + '</td>' +
          '</tr>';
      }).join('') +
      '</tbody></table></div>' +
      '<div class="notice notice--accent"><span class="notice__icon" aria-hidden="true"><i class="ph-light ph-info"></i></span>' +
      '<span>Đổi vai trò có hiệu lực ngay trong phiên này. Bảng quyền chi tiết nằm ở mục Phân quyền.</span></div>';
  }

  function manPhanQuyen() {
    return '<p class="muted" style="max-width:64ch;line-height:var(--lh-relaxed)">' +
      'Bảng dưới đây chính là bảng mà hệ thống dùng để quyết định cho phép hay từ chối mỗi thao tác. ' +
      'Nó không phải tài liệu mô tả, nên không bao giờ lệch với hành vi thật.</p>' +
      '<div class="rolegrid">' +
      '<div class="rolegrid__h">Thao tác</div>' +
      '<div class="rolegrid__h">Quản trị</div>' +
      '<div class="rolegrid__h">Biên tập</div>' +
      QUYEN.map(function (q) {
        return '<div>' + U.esc(q[1]) + '</div>' +
          '<div class="rolegrid__cell ' + (q[2].indexOf('admin') >= 0 ? 'rolegrid__yes">Có' : 'rolegrid__no">Không') + '</div>' +
          '<div class="rolegrid__cell ' + (q[2].indexOf('editor') >= 0 ? 'rolegrid__yes">Có' : 'rolegrid__no">Không') + '</div>';
      }).join('') +
      '</div>' +
      '<div class="notice"><span class="notice__icon" aria-hidden="true"><i class="ph-light ph-shield-check"></i></span>' +
      '<span>Nút và mục menu ngoài tầm quyền được ẩn đi, nhưng mọi thao tác ghi còn kiểm quyền một lần nữa trước khi chạy. ' +
      'Ẩn nút là việc của giao diện, không phải kiểm soát truy cập.</span></div>';
  }

  function manSaoLuu() {
    var d = S.exportAll();
    var soMuc = Object.keys(d.duLieu).length;
    return '<div class="backup">' +

      '<div class="backup__card">' +
      '<h2 class="backup__title">Xuất dữ liệu</h2>' +
      '<p class="backup__note">Tải về một tệp JSON gồm toàn bộ thay đổi đang lưu trong trình duyệt này: ' +
      'bản vá nội dung, bản ghi mới, hồ sơ, đăng ký sự kiện và hàng chờ duyệt. ' +
      'Hiện có <strong>' + soMuc + '</strong> nhóm dữ liệu.</p>' +
      '<button class="btn btn--primary" type="button" data-export>Tải tệp sao lưu</button>' +
      '</div>' +

      '<div class="backup__card">' +
      '<h2 class="backup__title">Khôi phục</h2>' +
      '<p class="backup__note">Nạp lại một tệp sao lưu đã tải trước đó. Dữ liệu trong tệp ghi đè lên dữ liệu hiện tại.</p>' +
      '<div class="field"><label class="field__label" for="restore">Chọn tệp sao lưu</label>' +
      '<input class="input" id="restore" type="file" accept="application/json,.json" data-restore></div>' +
      '</div>' +

      '<div class="backup__card">' +
      '<h2 class="backup__title">Đặt lại</h2>' +
      '<p class="backup__note">Xóa mọi thay đổi và đưa trang về đúng bộ dữ liệu mẫu ban đầu. ' +
      'Thao tác này không hoàn tác được, nên hãy xuất một bản sao lưu trước.</p>' +
      '<button class="btn btn--danger" type="button" data-reset>Xóa toàn bộ thay đổi</button>' +
      '</div>' +

      '</div>' +

      '<div class="notice notice--accent">' +
      '<span class="notice__icon" aria-hidden="true"><i class="ph-light ph-database"></i></span>' +
      '<span>Bản demo không có máy chủ, nên "sao lưu" ở đây là kết xuất trạng thái trong trình duyệt. ' +
      'Trong bản chạy thật, đúng hai nút này nối vào lệnh kết xuất và nạp lại cơ sở dữ liệu, ' +
      'cộng thêm một lịch chạy tự động hằng đêm.</span></div>';
  }

  /* ------------------------------------------------------------------------
     Vẽ
     ------------------------------------------------------------------------ */
  function ve() {
    var body = $('[data-work]');
    $('[data-title]').textContent = NHAN_PANEL[panel] || 'Quản trị';

    $$('[data-panel]').forEach(function (b) { b.classList.toggle('is-on', b.dataset.panel === panel); });

    var cho = S.getSubmissions().filter(function (s) { return s.trangthai === 'cho-duyet'; }).length;
    var badge = $('[data-badge-duyet]');
    badge.textContent = cho;
    badge.style.display = cho ? '' : 'none';

    if (panel === 'tongquan') body.innerHTML = manTongQuan();
    else if (panel === 'duyet') body.innerHTML = manDuyet();
    else if (panel === 'nguoidung') body.innerHTML = quyen('nguoidung') ? manNguoiDung() : khongPhep();
    else if (panel === 'phanquyen') body.innerHTML = quyen('nguoidung') ? manPhanQuyen() : khongPhep();
    else if (panel === 'saoluu') body.innerHTML = quyen('saoluu') ? manSaoLuu() : khongPhep();
    else if (PANEL_LOAI[panel]) body.innerHTML = bang(PANEL_LOAI[panel]);
    else body.innerHTML = manTongQuan();

    U.setParams({ panel: panel === 'tongquan' ? '' : panel }, true);
  }

  function khongPhep() {
    return C.empty(
      'Khu vực này dành cho quản trị viên',
      'Tài khoản biên tập viên soạn và duyệt được nội dung, nhưng không quản lý người dùng, phân quyền và sao lưu.',
      'lock-key'
    );
  }

  /* ------------------------------------------------------------------------
     Hộp thoại soạn thảo
     ------------------------------------------------------------------------ */
  var dangSua = null, nhaModal = null;

  function moModal(key, id) {
    var L = LOAI[key];
    var rec = id ? D.byId(L.lay(), id) : L.moi();
    if (!rec) return;
    dangSua = { key: key, id: id, rec: rec };

    $('[data-modal-title]').textContent = (id ? 'Sửa ' : 'Thêm ') + L.nhan.toLowerCase();
    $('[data-modal-body]').innerHTML = L.truong.map(function (t) {
      var ten = t[0], nhan = t[1], kieu = t[2], rule = t[3];
      var gia = rec[ten] == null ? '' : rec[ten];
      var req = rule.indexOf('required') >= 0 ? ' <span class="req" aria-hidden="true">*</span>' : '';
      if (kieu === 'textarea') {
        return '<div class="field"><label class="field__label" for="f-' + ten + '">' + U.esc(nhan) + req + '</label>' +
          '<textarea class="textarea" id="f-' + ten + '" name="' + ten + '" data-rule="' + rule + '">' + U.esc(gia) + '</textarea></div>';
      }
      return '<div class="field"><label class="field__label" for="f-' + ten + '">' + U.esc(nhan) + req + '</label>' +
        '<input class="input" id="f-' + ten + '" name="' + ten + '" type="' + kieu + '" value="' + U.esc(gia) + '" data-rule="' + rule + '"></div>';
    }).join('');

    var m = $('[data-modal]');
    m.classList.add('is-open');
    $('[data-scrim]').classList.add('is-open');
    document.body.classList.add('is-locked');
    nhaModal = U.trapFocus(m, dongModal);
  }

  function dongModal() {
    $('[data-modal]').classList.remove('is-open');
    $('[data-scrim]').classList.remove('is-open');
    document.body.classList.remove('is-locked');
    if (nhaModal) { nhaModal(); nhaModal = null; }
    dangSua = null;
  }

  function luuModal() {
    if (!dangSua) return;
    var L = LOAI[dangSua.key];
    var form = $('[data-modal-body]');
    if (!U.validate(form)) return;

    var fields = {};
    L.truong.forEach(function (t) {
      var el = form.querySelector('[name="' + t[0] + '"]');
      fields[t[0]] = t[2] === 'number' ? Number(el.value) : el.value;
    });

    if (dangSua.id) {
      S.patchRecord(dangSua.key, dangSua.id, fields);
      U.toast('Đã lưu thay đổi.', 'success');
    } else {
      S.addRecord(dangSua.key, Object.assign({}, dangSua.rec, fields));
      U.toast('Đã thêm bản ghi mới.', 'success');
    }
    if (window.__SEARCH) window.__SEARCH.invalidate();
    dongModal();
    ve();
  }

  /* ------------------------------------------------------------------------
     Cổng đăng nhập
     ------------------------------------------------------------------------ */
  /* Màn đăng nhập và khu làm việc mỗi bên có một thẻ h1 của riêng nó. Để cả
     hai cùng nằm trong DOM là trang có hai h1, thứ mà trình đọc màn hình và
     công cụ tìm kiếm đều đọc sai. Nên bên nào không dùng thì gỡ hẳn ra, và
     giữ lại tham chiếu để gắn lại khi cần. */
  var khuLamViec = null;

  function cong() {
    var g = $('[data-gate]');
    var adm = $('[data-admin]');
    if (adm) { khuLamViec = adm; adm.remove(); }
    var us = D.users();
    var mau = [
      us.filter(function (u) { return u.vaitro === 'admin'; })[0],
      us.filter(function (u) { return u.vaitro === 'editor' && u.hoatdong; })[0],
    ].filter(Boolean);

    g.hidden = false;
    g.innerHTML =
      '<a class="brand" href="index.html" style="margin-bottom:var(--space-12)" aria-label="Về trang công khai">' +
      '<span class="brand__mark" aria-hidden="true">NEU</span>' +
      '<span class="brand__text"><span class="brand__name">Quản trị nội dung</span>' +
      '<span class="brand__sub">Mạng lưới Cựu sinh viên</span></span></a>' +

      '<h1 style="font-size:var(--fs-4xl);margin-bottom:var(--space-9)">Đăng nhập quản trị</h1>' +
      '<div class="notice notice--accent" style="margin-bottom:var(--space-12)">' +
      '<span class="notice__icon" aria-hidden="true"><i class="ph-light ph-info"></i></span>' +
      '<span>Bản demo không có máy chủ nên không có xác thực thật. Chọn một tài khoản mẫu để xem CMS ' +
      'thay đổi thế nào giữa quản trị viên và biên tập viên.</span></div>' +

      '<div class="scopes">' + mau.map(function (u) {
        return '<button class="choice" type="button" data-gate-in="' + U.esc(u.id) + '" style="width:100%;text-align:left">' +
          '<span class="avatar" data-name="' + U.esc(u.ten) + '" style="' + U.avatarStyle(u.ten) + '" aria-hidden="true">' + U.esc(U.initials(u.ten)) + '</span>' +
          '<span class="choice__body"><span class="choice__title">' + U.esc(u.ten) + '</span>' +
          '<span class="choice__note">' + (u.vaitro === 'admin'
            ? 'Quản trị viên. Toàn quyền, gồm người dùng, phân quyền và sao lưu.'
            : 'Biên tập viên. Soạn và duyệt nội dung, không đụng vào người dùng và sao lưu.') +
          '</span></span></button>';
      }).join('') + '</div>' +

      '<p class="dim" style="font-size:var(--fs-xs);margin-top:var(--space-12)">' +
      '<a class="link" href="index.html">Quay lại trang công khai</a></p>';
  }

  function vaoCms() {
    var me = S.getSession();

    /* Gỡ hẳn màn đăng nhập khỏi DOM chứ không chỉ ẩn nó. Hai khối này mỗi
       khối có một thẻ h1 của riêng nó, nên để cả hai cùng tồn tại là trang có
       hai h1, điều mà trình đọc màn hình và công cụ tìm kiếm đều đọc sai. */
    var gate = $('[data-gate]');
    if (gate) gate.remove();
    if (khuLamViec && !khuLamViec.isConnected) {
      document.body.insertBefore(khuLamViec, document.body.firstChild);
      khuLamViec = null;
    }
    $('[data-admin]').hidden = false;

    var VAITRO = { admin: 'Quản trị viên', editor: 'Biên tập viên', alumni: 'Cựu sinh viên' };
    $('[data-me]').innerHTML =
      '<span class="avatar avatar--sm" data-name="' + U.esc(me.ten) + '" style="' + U.avatarStyle(me.ten) + '" aria-hidden="true">' + U.esc(U.initials(me.ten)) + '</span>' +
      '<span><span class="aside__mename">' + U.esc(me.ten) + '</span><br>' +
      '<span class="aside__merole">' + (VAITRO[me.vaitro] || me.vaitro) + '</span></span>';

    /* Mục menu ngoài tầm quyền bị gỡ khỏi DOM, không chỉ ẩn bằng CSS. */
    $$('[data-admin-only]').forEach(function (b) {
      if (!quyen('nguoidung') && !quyen('saoluu')) b.remove();
    });

    ve();
  }

  /* ------------------------------------------------------------------------
     Sự kiện
     ------------------------------------------------------------------------ */
  function wire() {
    document.addEventListener('click', function (ev) {
      var t = ev.target;

      var vao = t.closest('[data-gate-in]');
      if (vao) {
        var u = D.byId(D.users(), vao.dataset.gateIn);
        if (u) { S.signIn(u); vaoCms(); }
        return;
      }

      var nav = t.closest('[data-panel]');
      if (nav) { panel = nav.dataset.panel; chon = []; tim = ''; ve(); $('[data-aside]').classList.remove('is-open'); return; }

      if (t.closest('[data-open-aside]')) {
        var a = $('[data-aside]');
        a.classList.toggle('is-open');
        $('[data-open-aside]').setAttribute('aria-expanded', String(a.classList.contains('is-open')));
        return;
      }

      /* Đăng xuất tải lại trang. Vừa dựng lại đúng màn đăng nhập, vừa dọn
         sạch mọi trạng thái đang giữ trong bộ nhớ của phiên quản trị. */
      if (t.closest('[data-signout]')) { S.signOut(); location.reload(); return; }

      var moi = t.closest('[data-new]');
      if (moi) {
        if (chan(moi.dataset.new === 'alumni' ? 'alumni.sua' : 'noidung.sua')) return;
        moModal(moi.dataset.new, null);
        return;
      }

      var sua = t.closest('[data-edit]');
      if (sua) {
        var p1 = sua.dataset.edit.split(':');
        if (chan(p1[0] === 'alumni' ? 'alumni.sua' : 'noidung.sua')) return;
        moModal(p1[0], p1[1]);
        return;
      }

      var xoa = t.closest('[data-del]');
      if (xoa) {
        var p2 = xoa.dataset.del.split(':');
        if (chan(p2[0] === 'alumni' ? 'alumni.xoa' : 'noidung.xoa')) return;
        if (!window.confirm('Xóa bản ghi này khỏi trang công khai?')) return;
        S.deleteRecord(p2[0], p2[1]);
        chon = chon.filter(function (id) { return id !== p2[1]; });
        if (window.__SEARCH) window.__SEARCH.invalidate();
        U.toast('Đã xóa bản ghi.', 'success');
        ve();
        return;
      }

      var hangLoat = t.closest('[data-bulk-del]');
      if (hangLoat) {
        var key = hangLoat.dataset.bulkDel;
        if (chan(key === 'alumni' ? 'alumni.xoa' : 'noidung.xoa')) return;
        if (!window.confirm('Xóa ' + chon.length + ' bản ghi đã chọn?')) return;
        chon.forEach(function (id) { S.deleteRecord(key, id); });
        U.toast('Đã xóa ' + chon.length + ' bản ghi.', 'success');
        chon = [];
        if (window.__SEARCH) window.__SEARCH.invalidate();
        ve();
        return;
      }

      if (t.closest('[data-unsel]')) { chon = []; ve(); return; }

      if (t.closest('[data-modal-close]')) { dongModal(); return; }
      if (t.closest('[data-modal-save]')) { luuModal(); return; }
      if (t.closest('[data-scrim]')) { dongModal(); $('[data-aside]').classList.remove('is-open'); return; }

      var ok = t.closest('[data-approve]');
      if (ok) {
        if (chan('duyet')) return;
        S.setSubmissionStatus(ok.dataset.approve, 'da-duyet');
        U.toast('Đã duyệt. Nội dung được chuyển sang mục tương ứng.', 'success');
        ve();
        return;
      }
      var no = t.closest('[data-reject]');
      if (no) {
        if (chan('duyet')) return;
        S.setSubmissionStatus(no.dataset.reject, 'tu-choi');
        U.toast('Đã đánh dấu không duyệt.');
        ve();
        return;
      }
      var lai = t.closest('[data-reset-sub]');
      if (lai) {
        if (chan('duyet')) return;
        S.setSubmissionStatus(lai.dataset.resetSub, 'cho-duyet');
        ve();
        return;
      }

      if (t.closest('[data-export]')) {
        if (chan('saoluu')) return;
        var blob = new Blob([JSON.stringify(S.exportAll(), null, 2)], { type: 'application/json' });
        var a2 = document.createElement('a');
        a2.href = URL.createObjectURL(blob);
        a2.download = 'neu-alumni-saoluu-' + new Date().toISOString().slice(0, 10) + '.json';
        a2.click();
        URL.revokeObjectURL(a2.href);
        U.toast('Đã tải tệp sao lưu.', 'success');
        return;
      }

      if (t.closest('[data-reset]')) {
        if (chan('saoluu')) return;
        if (!window.confirm('Xóa mọi thay đổi và trở về bộ dữ liệu mẫu ban đầu?')) return;
        var me2 = S.getSession();
        S.resetAll();
        S.signIn(me2);
        if (window.__SEARCH) window.__SEARCH.invalidate();
        U.toast('Đã đặt lại về dữ liệu mẫu.', 'success');
        ve();
      }
    });

    document.addEventListener('change', function (ev) {
      var el = ev.target;

      var sel = el.closest('[data-sel]');
      if (sel) {
        var id = sel.dataset.sel;
        if (sel.checked) { if (chon.indexOf(id) < 0) chon.push(id); }
        else chon = chon.filter(function (x) { return x !== id; });
        var tbar = $('.tbar');
        if (tbar) {
          tbar.classList.toggle('has-sel', chon.length > 0);
          var n = $('.tbar__sel strong');
          if (n) n.textContent = chon.length + ' mục đã chọn';
        }
        return;
      }

      if (el.matches('[data-sel-all]')) {
        $$('[data-sel]').forEach(function (b) {
          if (b.disabled) return;
          b.checked = el.checked;
          var id2 = b.dataset.sel;
          if (el.checked) { if (chon.indexOf(id2) < 0) chon.push(id2); }
          else chon = chon.filter(function (x) { return x !== id2; });
        });
        ve();
        return;
      }

      var vt = el.closest('[data-role]');
      if (vt) {
        if (chan('nguoidung')) { ve(); return; }
        S.patchRecord('users', vt.dataset.role, { vaitro: vt.value });
        U.toast('Đã đổi vai trò.', 'success');
        return;
      }

      var rf = el.closest('[data-restore]');
      if (rf && rf.files && rf.files[0]) {
        if (chan('saoluu')) return;
        var fr = new FileReader();
        fr.onload = function () {
          var kq;
          try { kq = S.importAll(JSON.parse(fr.result)); }
          catch (e) { kq = { ok: false, lyDo: 'Tệp không phải JSON hợp lệ.' }; }
          if (!kq.ok) { U.toast(kq.lyDo, 'error'); return; }
          if (window.__SEARCH) window.__SEARCH.invalidate();
          U.toast('Đã khôi phục ' + kq.soMuc + ' nhóm dữ liệu.', 'success');
          ve();
        };
        fr.readAsText(rf.files[0]);
      }
    });

    /* Ô tìm trong bảng. Vẽ lại rồi trả tiêu điểm về đúng ô, nếu không người
       dùng gõ được một ký tự là mất chỗ. */
    document.addEventListener('input', function (ev) {
      if (!ev.target.matches('[data-tq]')) return;
      tim = ev.target.value;
      clearTimeout(window.__admTimer);
      window.__admTimer = setTimeout(function () {
        var at = ev.target.selectionStart;
        ve();
        var lai = $('[data-tq]');
        if (lai) { lai.focus(); try { lai.setSelectionRange(at, at); } catch (e) {} }
      }, 220);
    });
  }

  function boot() {
    wire();
    if (S.isEditor()) vaoCms(); else cong();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
