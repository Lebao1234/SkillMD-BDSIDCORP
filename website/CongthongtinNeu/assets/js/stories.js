/* ==========================================================================
   TRANG CÂU CHUYỆN ALUMNI

   Một câu chuyện nổi bật ở trên, phần còn lại là lưới thẻ. Hai họ bố cục khác
   nhau trên cùng một trang, nên danh sách không đọc thành một khối đều đều.
   ========================================================================== */

(function () {
  'use strict';

  var U = window.__UI, D = window.__DATA, C = window.__CARDS;
  var $ = U.$;

  function storyCard(p) {
    var nv = D.byId(D.alumni(), p.nhanVatId);
    var ten = nv ? nv.name : '';
    return '<article class="card">' +
      '<div class="card__media">' + C.imgTag(p.anh, p.tieude, p.slug, 600, 375) + '</div>' +
      '<div class="card__body">' +
      '<h3 class="card__title"><a href="bai-viet.html?slug=' + encodeURIComponent(p.slug) + '">' + U.esc(p.tieude) + '</a></h3>' +
      '<p class="card__excerpt">' + U.esc(p.tomtat) + '</p>' +
      '<div class="card__foot">' +
      (ten
        ? '<span class="avatar avatar--sm" data-name="' + U.esc(ten) + '" style="' + U.avatarStyle(ten) + '" aria-hidden="true">' + U.esc(U.initials(ten)) + '</span>' +
          '<span style="font-size:var(--fs-xs)"><strong>' + U.esc(ten) + '</strong>' +
          (nv ? '<br><span class="dim">Khóa ' + nv.khoa + ', ' + U.esc(nv.nganh) + '</span>' : '') + '</span>'
        : '<span class="dim" style="font-size:var(--fs-xs)">' + U.fmtDate(p.ngay) + '</span>') +
      '</div></div></article>';
  }

  function featured(p) {
    if (!p) return '';
    var nv = D.byId(D.alumni(), p.nhanVatId);
    var ten = nv ? nv.name : 'Cựu sinh viên';
    return '<div class="storyfeature" style="margin-bottom:var(--space-14)">' +
      '<div class="storyfeature__media">' +
      C.imgTag(p.anhChanDung || p.anh, 'Chân dung ' + ten, p.slug + '-cd', 700, 875, true) + '</div>' +
      '<div>' +
      '<blockquote class="storyfeature__quote">' + U.esc(p.trichdan || p.tomtat) + '</blockquote>' +
      '<div class="storyfeature__who">' +
      '<span class="avatar avatar--lg" data-name="' + U.esc(ten) + '" style="' + U.avatarStyle(ten) + '" aria-hidden="true">' + U.esc(U.initials(ten)) + '</span>' +
      '<span><span class="storyfeature__name">' + U.esc(ten) + '</span><br>' +
      '<span class="storyfeature__role">' + U.esc(nv ? nv.chucdanh + ', ' + nv.congty : '') + '</span></span>' +
      '</div>' +
      '<p class="storyfeature__body">' + U.esc(p.tomtat) + '</p>' +
      '<div class="storyfeature__more">' +
      '<a class="btn btn--primary" href="bai-viet.html?slug=' + encodeURIComponent(p.slug) + '">Đọc câu chuyện</a></div>' +
      '</div></div>';
  }

  function boot() {
    var elList = $('[data-list]');
    var elFeat = $('[data-featured]');
    var elCount = $('[data-count]');
    var elQ = $('[data-q]');

    function draw() {
      var q = U.fold(String(elQ.value || '').trim());
      var all = D.cauChuyen();

      var items = !q || q.length < 2 ? all : all.filter(function (p) {
        var nv = D.byId(D.alumni(), p.nhanVatId);
        var hay = U.fold([p.tieude, p.tomtat, p.trichdan, nv ? nv.name : '', nv ? nv.congty : '', nv ? nv.nganh : ''].join(' '));
        return q.split(/\s+/).every(function (w) { return hay.indexOf(w) >= 0; });
      });

      elCount.textContent = U.fmtNum(items.length) + ' câu chuyện';

      /* Chỉ dựng phần nổi bật khi người dùng chưa lọc. Lọc rồi mà vẫn giữ một
         bài to ở trên thì kết quả đọc lệch. */
      var dung = !q && items.length > 1;
      elFeat.innerHTML = dung ? featured(items[0]) : '';

      var conLai = dung ? items.slice(1) : items;
      if (!conLai.length) {
        elList.style.display = 'block';
        elList.innerHTML = C.empty(
          'Không có câu chuyện nào khớp',
          'Thử một từ khóa ngắn hơn, hoặc gửi câu chuyện của chính bạn qua mục Đóng góp nội dung.',
          'user-focus',
          '<a class="btn btn--ghost" href="dong-gop.html">Gửi câu chuyện</a>'
        );
      } else {
        elList.style.display = '';
        elList.innerHTML = conLai.map(storyCard).join('');
      }
    }

    elList.innerHTML = C.skeletonCards(6);
    var timer;
    elQ.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        U.setParams({ q: elQ.value }, true);
        draw();
      }, 200);
    });

    elQ.value = U.param('q', '');
    draw();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
