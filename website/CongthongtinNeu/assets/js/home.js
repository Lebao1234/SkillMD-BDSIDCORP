/* ==========================================================================
   TRANG CHỦ

   Bố cục bám theo https://alumni.neu.edu.vn/: khối tiêu điểm xanh chia ba cột,
   ba cột tin bên dưới, lưới chân dung, việc làm, số liệu.
   ========================================================================== */

(function () {
  'use strict';

  var U = window.__UI, D = window.__DATA, C = window.__CARDS;
  var $ = U.$;

  /* Nhãn MỚI cho nội dung đăng trong ba mươi ngày gần nhất. Đây là chỗ thứ hai
     trên trang dùng đỏ thương hiệu, sau nút đăng ký, nên bảng màu có đủ ba màu
     thật sự làm việc chứ không phải hai. */
  function moi(ngay) {
    var d = new Date(ngay);
    if (isNaN(d)) return '';
    var songay = (Date.now() - d.getTime()) / 86400000;
    return songay >= 0 && songay <= 30 ? '<span class="badge-new">Mới</span>' : '';
  }

  function img(src, alt, seed, w, h, eager) {
    return '<img src="' + U.esc(src) + '" alt="' + U.esc(alt) + '"' +
      ' data-seed="' + U.esc(seed) + '" width="' + w + '" height="' + h + '"' +
      (eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async">';
  }

  /* ------------------------------------------------------------------------
     Thẻ dùng trong khối tiêu điểm
     ------------------------------------------------------------------------ */
  function spotLead(p, eager) {
    return '<article class="spotlead">' +
      '<div class="spotlead__media">' + img(p.anh, p.tieude, p.slug, 570, 368, eager) + '</div>' +
      '<div class="spotlead__body">' +
      '<h4 class="spotlead__title"><a href="bai-viet.html?slug=' + encodeURIComponent(p.slug) + '">' + U.esc(p.tieude) + '</a></h4>' +
      '<p class="spotlead__date">' + U.fmtDateShort(p.ngay) + '</p>' +
      '<p class="spotlead__sum">' + U.esc(p.tomtat) + '</p>' +
      '</div></article>';
  }

  function spotCard(p) {
    return '<article class="spotcard">' +
      '<div class="spotcard__media">' + img(p.anh, p.tieude, p.slug, 380, 238) + '</div>' +
      '<div class="spotcard__body">' +
      '<h4 class="spotcard__title"><a href="bai-viet.html?slug=' + encodeURIComponent(p.slug) + '">' + U.esc(p.tieude) + '</a>' + moi(p.ngay) + '</h4>' +
      '<p class="spotcard__date">' + U.fmtDateShort(p.ngay) + '</p>' +
      '</div></article>';
  }

  /* ------------------------------------------------------------------------
     Khối tiêu điểm
     ------------------------------------------------------------------------ */
  function spotlight() {
    var tin = D.tin();
    var chuyen = D.cauChuyen();
    var viec = D.jobs();

    var ketnoi = $('[data-spot-ketnoi]');
    if (ketnoi) {
      var dan = tin[0];
      ketnoi.innerHTML = dan
        ? spotLead(dan, true) + tin.slice(1, 3).map(spotCard).join('')
        : C.empty('Chưa có tin nào', 'Bài do ban truyền thông đăng sẽ hiện ở đây.', 'newspaper');
    }

    var chiase = $('[data-spot-chiase]');
    if (chiase) {
      chiase.innerHTML = chuyen.length
        ? spotCard(chuyen[0])
        : C.empty('Chưa có câu chuyện nào', 'Cựu sinh viên gửi bài qua mục Đóng góp nội dung.', 'user-focus');
    }

    var hoptac = $('[data-spot-hoptac]');
    if (hoptac) {
      var hp = tin.filter(function (p) { return /hợp tác|doanh nghiệp/i.test(p.danhmuc); })[0] || tin[3];
      hoptac.innerHTML = hp
        ? spotCard(hp)
        : C.empty('Chưa có tin hợp tác', 'Tin ký kết và liên kết đơn vị sẽ hiện ở đây.', 'handshake');
    }

    var thanhcong = $('[data-spot-thanhcong]');
    if (thanhcong) {
      var noibat = D.noiBat().slice(0, 5);
      thanhcong.innerHTML = noibat.length
        ? noibat.map(function (a) {
            return '<article class="spotface">' +
              '<img class="spotface__img" src="' + U.esc(a.anhChanDung) + '" alt="Chân dung ' + U.esc(a.name) + '"' +
              ' data-seed="' + U.esc(a.slug) + '" width="124" height="156" loading="lazy" decoding="async">' +
              '<div>' +
              '<h4 class="spotface__name"><a href="ho-so.html?id=' + encodeURIComponent(a.id) + '">' + U.esc(a.name) + '</a></h4>' +
              '<p class="spotface__role">' + U.esc(a.chucdanh) + '</p>' +
              '</div></article>';
          }).join('')
        : C.empty('Chưa có chân dung nào', 'Hồ sơ tiêu biểu do ban quản trị chọn sẽ hiện tại đây.', 'user-circle');
    }
  }

  /* ------------------------------------------------------------------------
     Ba cột tin
     ------------------------------------------------------------------------ */
  function newsRow(o) {
    return '<article class="newsrow">' +
      '<div class="newsrow__media' + (o.video ? ' newsrow__media--video' : '') + '">' +
      img(o.anh, o.tieude, o.seed, 192, 136) + '</div>' +
      '<div><h3 class="newsrow__title"><a href="' + o.href + '">' + U.esc(o.tieude) + '</a>' + moi(o.ngay) + '</h3>' +
      '<p class="newsrow__date">' + U.esc(o.meta) + '</p></div>' +
      '</article>';
  }

  function columns() {
    var elEv = $('[data-col-events]');
    if (elEv) {
      var evs = D.sapToi().slice(0, 5);
      if (!evs.length) evs = D.daQua().slice(0, 5);
      elEv.innerHTML = evs.length
        ? evs.map(function (e) {
            return newsRow({
              anh: e.anh, tieude: e.tieude, seed: e.slug,
              href: 'su-kien-chi-tiet.html?slug=' + encodeURIComponent(e.slug), ngay: e.batdau,
              meta: U.fmtDateShort(e.batdau) + '  ' + e.thanhpho,
            });
          }).join('')
        : C.empty('Chưa có sự kiện nào', 'Lịch của học kỳ tới đang được ban điều phối chốt.', 'calendar-blank');
    }

    var elNews = $('[data-col-news]');
    if (elNews) {
      var ts = D.tin().slice(3, 8);
      elNews.innerHTML = ts.length
        ? ts.map(function (p) {
            return newsRow({
              anh: p.anh, tieude: p.tieude, seed: p.slug,
              href: 'bai-viet.html?slug=' + encodeURIComponent(p.slug), ngay: p.ngay,
              meta: U.fmtDateShort(p.ngay) + '  ' + p.danhmuc,
            });
          }).join('')
        : C.empty('Chưa có tin nào', 'Bài mới sẽ hiện ở đây.', 'newspaper');
    }

    var elMedia = $('[data-col-media]');
    if (elMedia) {
      var abs = D.albums().slice(0, 5);
      elMedia.innerHTML = abs.length
        ? abs.map(function (a) {
            var loai = a.loai === 'kyyeu' ? 'Kỷ yếu' : a.loai === 'video' ? 'Video' : 'Album ảnh';
            return newsRow({
              anh: a.bia, tieude: a.tieude, seed: a.slug,
              video: a.loai === 'video',
              href: 'album.html?slug=' + encodeURIComponent(a.slug),
              meta: loai + '  năm ' + a.nam + (a.khoa ? '  khóa ' + a.khoa : ''),
            });
          }).join('')
        : C.empty('Kho tư liệu đang trống', 'Ảnh và kỷ yếu do các khóa gửi về sẽ hiện tại đây.', 'images-square');
    }
  }

  /* ------------------------------------------------------------------------
     Lưới chân dung
     ------------------------------------------------------------------------ */
  function faces() {
    var wrap = $('[data-faces]');
    if (!wrap) return;
    var list = D.noiBat().slice(0, 12);
    if (!list.length) {
      wrap.outerHTML = C.empty('Chưa có chân dung nào', 'Hồ sơ tiêu biểu do ban quản trị chọn sẽ hiện tại đây.', 'user-circle');
      return;
    }
    wrap.innerHTML = list.map(function (a) {
      return '<article class="face">' +
        '<div class="face__media">' + img(a.anhChanDung, 'Chân dung ' + a.name, a.slug, 300, 400) + '</div>' +
        '<h3 class="face__name"><a href="ho-so.html?id=' + encodeURIComponent(a.id) + '">' + U.esc(a.name) + '</a></h3>' +
        '<p class="face__role">' + U.esc(a.chucdanh) + (a.congty ? ', ' + U.esc(a.congty) : '') + '</p>' +
        '</article>';
    }).join('');
  }

  /* ------------------------------------------------------------------------
     Việc làm
     ------------------------------------------------------------------------ */
  function jobs() {
    var wrap = $('[data-home-jobs]');
    if (!wrap) return;
    var list = D.jobs().slice().sort(function (a, b) { return a.ngayDang < b.ngayDang ? 1 : -1; }).slice(0, 8);
    if (!list.length) {
      wrap.innerHTML = C.empty(
        'Chưa có vị trí nào đang mở',
        'Nếu doanh nghiệp của bạn đang tuyển, hãy gửi tin qua mục Đóng góp nội dung để ban quản trị duyệt.',
        'briefcase',
        '<a class="btn btn--ghost" href="dong-gop.html">Gửi tin tuyển dụng</a>'
      );
      return;
    }
    var nhom = new Map();
    list.forEach(function (j) {
      if (!nhom.has(j.linhvuc)) nhom.set(j.linhvuc, []);
      nhom.get(j.linhvuc).push(j);
    });
    wrap.innerHTML = Array.from(nhom.entries()).map(function (e) {
      return '<div class="jobgroup"><div class="jobgroup__head">' +
        '<h3 class="jobgroup__name">' + U.esc(e[0]) + '</h3>' +
        '<span class="jobgroup__count">' + e[1].length + ' vị trí</span></div>' +
        e[1].map(C.jobRow).join('') + '</div>';
    }).join('');
  }

  /* ------------------------------------------------------------------------
     Số liệu. Không con số nào gõ tay.
     ------------------------------------------------------------------------ */
  function stats() {
    var wrap = $('[data-home-stats]');
    if (!wrap) return;

    var al = D.alumni();
    var khoa = al.map(function (a) { return a.khoa; });
    var nganh = new Set(al.map(function (a) { return a.nganh; }));
    var coVan = al.filter(function (a) { return a.coVanNghiepVu; }).length;
    var ngoai = new Set(al.filter(function (a) { return a.quocgia !== 'Việt Nam'; }).map(function (a) { return a.quocgia; }));

    var items = [
      [U.fmtNum(al.length), 'hồ sơ cựu sinh viên', 'Trải từ khóa ' + Math.min.apply(null, khoa) + ' đến khóa ' + Math.max.apply(null, khoa) + '.'],
      [U.fmtNum(nganh.size), 'ngành đào tạo', 'Từ kinh tế học tới khoa học dữ liệu.'],
      [U.fmtNum(coVan), 'người nhận làm cố vấn', 'Hướng dẫn sinh viên năm cuối và người mới đi làm.'],
      [U.fmtNum(ngoai.size), 'quốc gia ngoài Việt Nam', 'Nơi thành viên mạng lưới đang làm việc.'],
    ];

    wrap.innerHTML = items.map(function (it) {
      return '<div class="stat"><span class="stat__num">' + it[0] + '</span>' +
        '<span class="stat__label">' + U.esc(it[1]) + '</span>' +
        '<span class="stat__note">' + U.esc(it[2]) + '</span></div>';
    }).join('');
  }

  /* ------------------------------------------------------------------------
     Đơn vị liên kết
     ------------------------------------------------------------------------ */
  /* ------------------------------------------------------------------------
     Dải chuyên mục

     Dùng đúng bộ banner chuyên mục của trang gốc. Hình dựng sẵn theo màu
     thương hiệu trông ra placeholder, mà đây lại là mảng cuối trang nên nó
     kéo cả trang xuống.
     ------------------------------------------------------------------------ */
  var CHUYENMUC = [
    ['Ngân hàng và tài chính', 'nghe-nghiep.html?linhvuc=T%C3%A0i%20ch%C3%ADnh%20v%C3%A0%20ng%C3%A2n%20h%C3%A0ng', 'nganhangtaichinh.png'],
    ['Du lịch và thương mại', 'nghe-nghiep.html', 'dulichthuongmaiedit.png'],
    ['Công nghệ thực phẩm', 'nghe-nghiep.html', 'congnghethucpham.png'],
    ['Công nghiệp và nông nghiệp', 'nghe-nghiep.html', 'congnghiepnongnghiepedit-977999.png'],
    ['Giải trí và thời trang', 'nghe-nghiep.html', 'giaitrithoitrangedit.png'],
    ['Chia sẻ cộng đồng', 'cau-chuyen.html', 'chiasebanner.png'],
  ];

  function partners() {
    var wrap = $('[data-partners]');
    if (!wrap) return;
    var goc = 'https://storage-vnportal.vnpt.vn/sannongnghiep/2832/banner/';
    wrap.innerHTML = CHUYENMUC.map(function (c) {
      var seed = 'chuyenmuc-' + U.fold(c[0]).replace(/[^a-z0-9]+/g, '-');
      return '<a href="' + c[1] + '" title="' + U.esc(c[0]) + '">' +
        '<img src="' + goc + c[2] + '" alt="' + U.esc(c[0]) + '"' +
        ' data-seed="' + seed + '" width="340" height="168" loading="lazy" decoding="async">' +
        '</a>';
    }).join('');
  }

  function boot() {
    spotlight(); columns(); faces(); jobs(); stats(); partners();
    U.reveal();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
