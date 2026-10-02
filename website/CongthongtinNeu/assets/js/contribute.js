/* ==========================================================================
   ĐÓNG GÓP NỘI DUNG

   Người gửi chọn loại nội dung, điền nội dung, và bài vào hàng chờ duyệt của
   CMS. Nhãn của các trường đổi theo loại được chọn, vì "mô tả" của một tin
   tuyển dụng và "mô tả" của một bộ ảnh là hai thứ khác nhau.
   ========================================================================== */

(function () {
  'use strict';

  var U = window.__UI, S = window.__STORE;
  var $ = U.$, $$ = U.$$;

  var THEO_LOAI = {
    cauchuyen: {
      tieude: 'Tiêu đề bài viết',
      noidung: 'Nội dung câu chuyện',
      goi: 'Viết đủ để ban biên tập hiểu mạch bài. Không cần trau chuốt, khâu biên tập sẽ làm.',
      tep: 'Ảnh kèm theo bài, nếu có',
    },
    anh: {
      tieude: 'Tên bộ ảnh',
      noidung: 'Ảnh chụp ở đâu, khi nào, có những ai',
      goi: 'Ghi rõ dịp, năm và khóa để ban quản trị xếp đúng vào kho kỷ niệm.',
      tep: 'Chọn ảnh muốn gửi',
    },
    tulieu: {
      tieude: 'Tên tư liệu',
      noidung: 'Mô tả tư liệu',
      goi: 'Ghi rõ đây là tư liệu gì, của khóa nào, năm nào, và tình trạng bản gốc.',
      tep: 'Bản quét hoặc ảnh chụp tư liệu',
    },
    tuyendung: {
      tieude: 'Chức danh tuyển dụng',
      noidung: 'Mô tả công việc và yêu cầu',
      goi: 'Ghi rõ nơi làm việc, hình thức, mức lương nếu công bố được, và hạn nộp.',
      tep: 'Mô tả công việc dạng tệp, nếu có',
    },
  };

  function boot() {
    var form = $('[data-form]');
    if (!form) return;

    var elTieuDe = $('label[for="tieude"]');
    var elNoiDung = $('label[for="noidung"]');
    var elGoi = $('#noidung').parentNode.querySelector('.field__hint');
    var elTep = $('label[for="tep"]');

    function apLoai() {
      var loai = (form.querySelector('input[name="loai"]:checked') || {}).value || 'cauchuyen';
      var t = THEO_LOAI[loai];
      elTieuDe.innerHTML = U.esc(t.tieude) + ' <span class="req" aria-hidden="true">*</span>';
      elNoiDung.innerHTML = U.esc(t.noidung) + ' <span class="req" aria-hidden="true">*</span>';
      elGoi.textContent = t.goi;
      elTep.textContent = t.tep;
    }

    $$('input[name="loai"]').forEach(function (r) { r.addEventListener('change', apLoai); });
    apLoai();

    /* Tự điền phần người gửi nếu đang đăng nhập. */
    var me = S.getSession();
    if (me) {
      $('#nguoigui').value = me.ten || '';
      $('#emailgui').value = me.email || '';
      if (me.khoa) $('#khoagui').value = me.khoa;
    }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!U.validate(form)) return;

      var btn = $('[data-submit]');
      btn.classList.add('is-loading');
      btn.disabled = true;

      setTimeout(function () {
        var fd = new FormData(form);
        var tep = $('#tep').files;
        var tenTep = [];
        for (var i = 0; i < tep.length; i++) tenTep.push(tep[i].name);

        var rec = S.submit({
          loai: fd.get('loai'),
          tieude: fd.get('tieude'),
          noidung: fd.get('noidung'),
          nguoiGui: fd.get('nguoigui'),
          emailGui: fd.get('emailgui'),
          khoaGui: fd.get('khoagui') || '',
          tenTep: tenTep,
        });

        form.classList.add('hide');
        var done = $('[data-done]');
        done.classList.remove('hide');
        done.innerHTML =
          '<div class="notice notice--success" style="margin-bottom:var(--space-12)">' +
          '<span class="notice__icon" aria-hidden="true"><i class="ph-light ph-paper-plane-tilt"></i></span>' +
          '<span><strong>Đã gửi.</strong> Mã theo dõi của bạn là <strong>' + U.esc(rec.id) + '</strong>.</span></div>' +

          '<h2 style="font-size:var(--fs-3xl);margin-bottom:var(--space-10)">Nội dung đang chờ duyệt</h2>' +
          '<p class="muted" style="max-width:56ch;line-height:var(--lh-relaxed);margin-bottom:var(--space-12)">' +
          'Ban quản trị xem nội dung và phản hồi qua email trong vài ngày làm việc. ' +
          (tenTep.length ? 'Đã nhận ' + tenTep.length + ' tệp đính kèm. ' : '') +
          'Nếu được duyệt, nội dung sẽ xuất hiện ở mục tương ứng trên trang.</p>' +

          '<div style="display:flex;flex-wrap:wrap;gap:var(--space-7)">' +
          '<button class="btn btn--primary" type="button" data-again>Gửi nội dung khác</button>' +
          '<a class="btn btn--ghost" href="admin.html?panel=duyet">Xem hàng chờ duyệt</a>' +
          '</div>' +

          '<div class="notice" style="margin-top:var(--space-13)">' +
          '<span class="notice__icon" aria-hidden="true"><i class="ph-light ph-info"></i></span>' +
          '<span>Bản demo không có máy chủ, nên tệp đính kèm chỉ được đọc tên và không rời khỏi máy bạn. ' +
          'Bài gửi nằm trong trình duyệt này và hiện ngay trong hàng chờ của CMS.</span></div>';

        U.toast('Đã gửi cho ban quản trị.', 'success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 600);
    });

    document.addEventListener('click', function (ev) {
      if (!ev.target.closest('[data-again]')) return;
      form.reset();
      form.classList.remove('hide');
      $('[data-done]').classList.add('hide');
      apLoai();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
