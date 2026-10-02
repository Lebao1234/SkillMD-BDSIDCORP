/* ==========================================================================
   TÌM KIẾM TOÀN TRANG

   Một chỉ mục phẳng gồm mọi thứ có thể tìm: hồ sơ cựu sinh viên, tin tức,
   câu chuyện, sự kiện, album và tin tuyển dụng. Chỉ mục dựng một lần khi cần
   lần đầu, rồi giữ lại trong bộ nhớ của trang.

   Từ khóa được bỏ dấu trước khi so khớp, nên gõ "nguyen van" vẫn ra
   "Nguyễn Văn", và gõ "ky niem" vẫn ra "Kỷ niệm".
   ========================================================================== */

(function () {
  'use strict';

  var U = window.__UI;
  var D = window.__DATA;
  var index = null;

  var NHAN = {
    alumni: 'Cựu sinh viên',
    tin: 'Tin tức',
    cauchuyen: 'Câu chuyện',
    sukien: 'Sự kiện',
    album: 'Kỷ niệm',
    vieclam: 'Việc làm',
  };

  function build() {
    var out = [];

    D.alumni().forEach(function (a) {
      out.push({
        loai: 'alumni',
        nhanLoai: NHAN.alumni,
        id: a.id,
        tieude: a.name,
        phu: 'Khóa ' + a.khoa + ', ' + a.nganh,
        href: 'ho-so.html?id=' + encodeURIComponent(a.id),
        text: U.fold([a.name, 'khoa ' + a.khoa, 'k' + a.khoa, a.nganh, a.lop, a.congty, a.chucdanh, a.linhvuc, a.thanhpho, a.quocgia].join(' ')),
        trong: 3,
      });
    });

    D.posts().forEach(function (p) {
      out.push({
        loai: p.loai,
        nhanLoai: p.loai === 'tin' ? NHAN.tin : NHAN.cauchuyen,
        id: p.id,
        tieude: p.tieude,
        phu: p.danhmuc + ', ' + U.fmtDate(p.ngay),
        href: 'bai-viet.html?slug=' + encodeURIComponent(p.slug),
        text: U.fold([p.tieude, p.tomtat, p.danhmuc, (p.the || []).join(' '), (p.noidung || []).map(function (b) { return b.text; }).join(' ')].join(' ')),
        trong: 2,
      });
    });

    D.events().forEach(function (e) {
      out.push({
        loai: 'sukien',
        nhanLoai: NHAN.sukien,
        id: e.id,
        tieude: e.tieude,
        phu: U.fmtDate(e.batdau) + ', ' + e.thanhpho,
        href: 'su-kien-chi-tiet.html?slug=' + encodeURIComponent(e.slug),
        text: U.fold([e.tieude, e.tomtat, e.diadiem, e.thanhpho, e.loai].join(' ')),
        trong: 2,
      });
    });

    D.albums().forEach(function (a) {
      out.push({
        loai: 'album',
        nhanLoai: NHAN.album,
        id: a.id,
        tieude: a.tieude,
        phu: 'Năm ' + a.nam + (a.khoa ? ', khóa ' + a.khoa : '') + ', ' + a.anh.length + ' tư liệu',
        href: 'album.html?slug=' + encodeURIComponent(a.slug),
        text: U.fold([a.tieude, a.mota, 'nam ' + a.nam, a.khoa ? 'khoa ' + a.khoa : '', a.loai].join(' ')),
        trong: 1,
      });
    });

    D.jobs().forEach(function (j) {
      out.push({
        loai: 'vieclam',
        nhanLoai: NHAN.vieclam,
        id: j.id,
        tieude: j.tieude,
        phu: j.congty + ', ' + j.thanhpho,
        href: 'nghe-nghiep.html?viec=' + encodeURIComponent(j.slug),
        text: U.fold([j.tieude, j.congty, j.linhvuc, j.capbac, j.hinhthuc, j.thanhpho, j.mota].join(' ')),
        trong: 2,
      });
    });

    return out;
  }

  function ensure() {
    if (!index) index = build();
    return index;
  }

  /* Chỉ mục phải dựng lại sau khi CMS đổi dữ liệu. */
  function invalidate() { index = null; }

  function query(q, loai) {
    var term = U.fold(String(q || '').trim());
    if (term.length < 2) return [];
    var words = term.split(/\s+/).filter(Boolean);

    return ensure()
      .filter(function (r) { return !loai || r.loai === loai; })
      .map(function (r) {
        var diem = 0;
        var tieudeFold = U.fold(r.tieude);
        for (var i = 0; i < words.length; i++) {
          var w = words[i];
          if (r.text.indexOf(w) < 0) return null;         /* mọi từ đều phải có */
          diem += 1;
          if (tieudeFold.indexOf(w) >= 0) diem += 4;      /* khớp ở tiêu đề nặng hơn */
          if (tieudeFold.indexOf(w) === 0) diem += 3;     /* khớp ngay đầu tiêu đề nặng nhất */
        }
        return { r: r, diem: diem * r.trong };
      })
      .filter(Boolean)
      .sort(function (a, b) { return b.diem - a.diem; })
      .map(function (x) { return x.r; });
  }

  function groupByKind(hits) {
    var order = ['alumni', 'tin', 'cauchuyen', 'sukien', 'vieclam', 'album'];
    var m = {};
    hits.forEach(function (h) { (m[h.loai] = m[h.loai] || []).push(h); });
    return order.filter(function (k) { return m[k]; }).map(function (k) {
      return { loai: k, nhan: NHAN[k], muc: m[k] };
    });
  }

  /* Bôi vàng đoạn khớp, có tính tới việc từ khóa không dấu vẫn phải tô đúng
     chỗ trong chuỗi có dấu. Vì bỏ dấu không đổi số ký tự, vị trí trùng khớp. */
  function highlight(text, q) {
    var term = U.fold(String(q || '').trim());
    if (term.length < 2) return U.esc(text);
    var hay = U.fold(text);
    var words = term.split(/\s+/).filter(Boolean).sort(function (a, b) { return b.length - a.length; });
    var marks = [];
    words.forEach(function (w) {
      var from = 0, at;
      while ((at = hay.indexOf(w, from)) >= 0) {
        marks.push([at, at + w.length]);
        from = at + w.length;
      }
    });
    if (!marks.length) return U.esc(text);
    marks.sort(function (a, b) { return a[0] - b[0]; });

    var merged = [marks[0]];
    for (var i = 1; i < marks.length; i++) {
      var last = merged[merged.length - 1];
      if (marks[i][0] <= last[1]) last[1] = Math.max(last[1], marks[i][1]);
      else merged.push(marks[i]);
    }

    var out = '', pos = 0;
    merged.forEach(function (m) {
      out += U.esc(text.slice(pos, m[0])) + '<mark>' + U.esc(text.slice(m[0], m[1])) + '</mark>';
      pos = m[1];
    });
    return out + U.esc(text.slice(pos));
  }

  window.__SEARCH = {
    query: query, groupByKind: groupByKind, highlight: highlight,
    invalidate: invalidate, nhan: NHAN,
  };
})();
