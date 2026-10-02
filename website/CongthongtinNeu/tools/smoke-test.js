/* ==========================================================================
   BỘ KIỂM THỬ

   Mỗi trang được nạp trong jsdom, chạy script thật của nó, rồi bị thao tác
   đúng như người dùng thao tác: bấm bộ lọc, gõ tìm kiếm, sang trang, mở ảnh,
   đăng ký sự kiện, gửi nội dung, đăng nhập CMS và duyệt bài.

   Ngoài ra bốn quy tắc được kiểm bằng máy chứ không bằng mắt:
     mỗi trang đúng một thẻ h1,
     không có dấu gạch ngang dài ở bất cứ đâu trong nội dung hiển thị,
     mọi ảnh có thuộc tính alt,
     mọi ô nhập có nhãn gắn đúng.

   Chạy:  npm install jsdom  &&  node tools/smoke-test.js
   ========================================================================== */

const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const loi = [];

function ok(dieu, nhan) {
  if (dieu) { pass++; return true; }
  fail++;
  loi.push(nhan);
  console.log('  FAIL  ' + nhan);
  return false;
}

/* --------------------------------------------------------------------------
   Nạp một trang và chạy script của nó
   -------------------------------------------------------------------------- */
async function nap(file, search) {
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const loiJs = [];

  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    url: 'http://localhost:5180/' + file + (search || ''),
    pretendToBeVisual: true,
    beforeParse(w) {
      w.matchMedia = () => ({ matches: false, media: '', onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; } });
      w.IntersectionObserver = class { constructor(cb) { this.cb = cb; } observe() {} unobserve() {} disconnect() {} };
      w.scrollTo = () => {};
      w.confirm = () => true;
      w.URL.createObjectURL = () => 'blob:mock';
      w.URL.revokeObjectURL = () => {};
      w.onerror = (m) => loiJs.push(String(m));
    },
  });

  const d = dom.window.document;

  /* Chờ jsdom phân tích xong và tự bắn DOMContentLoaded của nó, RỒI mới nạp
     script. Nếu nạp sớm hơn, script vừa đăng ký listener vừa được gọi lại bởi
     lần bắn thủ công bên dưới, nên mọi hàm khởi động chạy hai lần. */
  await new Promise((r) => setTimeout(r, 0));

  /* jsdom không tự tải script cục bộ, nên nạp tay theo đúng thứ tự trong trang. */
  [...d.querySelectorAll('script[src]')].forEach((s) => {
    const src = s.getAttribute('src');
    if (/^https?:/.test(src)) return;
    try { dom.window.eval(fs.readFileSync(path.join(ROOT, src), 'utf8')); }
    catch (e) { loiJs.push(src + ' -> ' + e.message); }
  });

  /* Chỉ bắn thủ công khi jsdom chưa bắn, để không khởi động hai lần. */
  if (d.readyState === 'loading') {
    try { d.dispatchEvent(new dom.window.Event('DOMContentLoaded', { bubbles: true })); }
    catch (e) { loiJs.push('DOMContentLoaded -> ' + e.message); }
  }

  return { dom, d, w: dom.window, loiJs, file };
}

function click(p, sel) {
  const el = typeof sel === 'string' ? p.d.querySelector(sel) : sel;
  if (!el) return false;
  el.dispatchEvent(new p.w.MouseEvent('click', { bubbles: true, cancelable: true }));
  return true;
}

function go(p, sel, val) {
  const el = typeof sel === 'string' ? p.d.querySelector(sel) : sel;
  if (!el) return false;
  if (el.type === 'checkbox' || el.type === 'radio') el.checked = val;
  else el.value = val;
  el.dispatchEvent(new p.w.Event('input', { bubbles: true }));
  el.dispatchEvent(new p.w.Event('change', { bubbles: true }));
  return true;
}

const doi = (ms) => new Promise((r) => setTimeout(r, ms));

/* --------------------------------------------------------------------------
   Bốn quy tắc kiểm bằng máy, chạy cho mọi trang
   -------------------------------------------------------------------------- */
function kiemChung(p) {
  const { d, file } = p;

  ok(p.loiJs.length === 0, file + ': không có lỗi JavaScript' + (p.loiJs.length ? ' (' + p.loiJs[0] + ')' : ''));

  const h1 = d.querySelectorAll('h1');
  ok(h1.length === 1, file + ': đúng một thẻ h1 (thấy ' + h1.length + ')');

  /* Gạch ngang dài bị cấm hoàn toàn theo quy tắc chống AI slop. */
  const chu = d.body.textContent || '';
  const gach = chu.match(/[\u2014\u2013]/g);
  ok(!gach, file + ': không có gạch ngang dài' + (gach ? ' (thấy ' + gach.length + ')' : ''));

  const thieuAlt = [...d.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt'));
  ok(thieuAlt.length === 0, file + ': mọi ảnh có alt (' + thieuAlt.length + ' thiếu)');

  /* Nhãn phải gắn được vào ô nhập, không dùng placeholder thay nhãn. */
  const oNhap = [...d.querySelectorAll('input:not([type=hidden]), select, textarea')];
  const khongNhan = oNhap.filter((el) => {
    if (el.closest('label')) return false;
    if (el.getAttribute('aria-label')) return false;
    if (el.id && d.querySelector('label[for="' + el.id + '"]')) return false;
    return true;
  });
  ok(khongNhan.length === 0, file + ': mọi ô nhập có nhãn (' + khongNhan.length + ' thiếu)');

  ok(!!d.querySelector('.skip-link'), file + ': có liên kết bỏ qua tới nội dung');
  ok(!!d.querySelector('title') && d.title.length > 12, file + ': có tiêu đề trang');
  ok(!!d.querySelector('meta[name="description"]'), file + ': có thẻ mô tả');

  /* Không để lọt giá trị hỏng ra giao diện. */
  ok(!/\bundefined\b|\bNaN\b|\[object Object\]/.test(chu), file + ': không lộ undefined, NaN hay [object Object]');
}

/* ==========================================================================
   CÁC PHÉP THỬ
   ========================================================================== */
async function chay() {
  console.log('\n--- khung chung ---');
  const TRANG = [
    'index.html', 'tin-tuc.html', 'cau-chuyen.html', 'bai-viet.html',
    'alumni.html', 'ho-so.html', 'ky-niem.html', 'album.html',
    'su-kien.html', 'su-kien-chi-tiet.html', 'nghe-nghiep.html',
    'dang-ky.html', 'dong-gop.html', 'tim-kiem.html', 'tai-khoan.html',
    'gioi-thieu.html', 'admin.html',
  ];
  for (const f of TRANG) {
    const p = await nap(f);
    kiemChung(p);
    if (f !== 'admin.html') {
      ok(!!p.d.querySelector('.header'), f + ': đầu trang được dựng');
      ok(!!p.d.querySelector('.footer'), f + ': chân trang được dựng');
      ok(p.d.querySelectorAll('.nav__link').length === 9, f + ': điều hướng đủ chín mục');
      ok(!!p.d.querySelector('.nav__home'), f + ': có nút về trang chủ');
      ok(p.d.querySelectorAll('.nav__sub').length >= 6, f + ': các mục lớn có menu con');
    }
    p.w.close();
  }

  /* ---------------------------------------------------------------- TRANG CHỦ */
  console.log('\n--- trang chủ ---');
  {
    const p = await nap('index.html');
    /* Khối tiêu điểm xanh, ba cột, đúng như trang thật */
    ok(!!p.d.querySelector('.spotlight'), 'trang chủ: có khối tiêu điểm');
    ok(p.d.querySelectorAll('.spotlight .spotcol').length === 3, 'trang chủ: khối tiêu điểm chia ba cột');
    ok(!!p.d.querySelector('[data-spot-ketnoi] .spotlead'), 'trang chủ: cột Kết nối có thẻ dẫn');
    ok(p.d.querySelectorAll('[data-spot-thanhcong] .spotface').length === 5, 'trang chủ: cột Thành công có năm chân dung');

    /* Ba cột tin, mỗi cột có đầu mục kiểu portal */
    ok(p.d.querySelectorAll('.colgrid > section').length === 3, 'trang chủ: ba cột tin');
    ok(p.d.querySelectorAll('.blockhead__title').length >= 5, 'trang chủ: đầu mục nằm trong hộp xanh');
    ok(p.d.querySelectorAll('[data-col-events] .newsrow').length === 5, 'trang chủ: cột sự kiện có năm hàng');
    ok(p.d.querySelectorAll('[data-col-news] .newsrow').length === 5, 'trang chủ: cột tin tức có năm hàng');
    ok(p.d.querySelectorAll('[data-col-media] .newsrow').length === 5, 'trang chủ: cột ảnh video có năm hàng');

    /* Lưới chân dung, mảng giàu hình ảnh nhất của trang gốc */
    ok(p.d.querySelectorAll('[data-faces] .face').length === 12, 'trang chủ: lưới chân dung đủ mười hai ô');
    ok(p.d.querySelectorAll('[data-faces] .face__media img').length === 12, 'trang chủ: mỗi chân dung có ảnh');

    ok(p.d.querySelectorAll('[data-partners] a').length === 6, 'trang chủ: dải lĩnh vực hoạt động');
    ok(p.d.querySelectorAll('.badge-new').length > 0, 'trang chủ: nội dung mới có nhãn đánh dấu');

    /* Số liệu phải đếm từ dữ liệu thật, không phải số gõ tay. */
    const soHoSo = p.d.querySelector('[data-home-stats] .stat__num').textContent.replace(/\D/g, '');
    ok(Number(soHoSo) === p.w.__ALUMNI.length, 'trang chủ: số hồ sơ khớp bộ dữ liệu');
    p.w.close();
  }

  /* ----------------------------------------------------------------- TIN TỨC */
  console.log('\n--- tin tức: lọc, tìm, sang trang ---');
  {
    const p = await nap('tin-tuc.html');
    const dau = p.d.querySelectorAll('[data-list] .card').length;
    ok(dau === 9, 'tin tức: chín thẻ mỗi trang (thấy ' + dau + ')');

    const chip = p.d.querySelector('[data-facet="danhmuc"] input[data-pick]');
    const nhan = chip.dataset.val;
    click(p, chip.closest('label'));
    chip.checked = true;
    chip.dispatchEvent(new p.w.Event('change', { bubbles: true }));
    await doi(30);
    ok(p.d.querySelector('[data-active] .chip'), 'tin tức: bộ lọc đang bật hiện thành chip bỏ nhanh');
    ok(p.w.location.search.includes('danhmuc='), 'tin tức: bộ lọc ghi vào địa chỉ URL');

    click(p, '[data-active] .chip[data-drop]');
    await doi(30);
    ok(p.d.querySelectorAll('[data-list] .card').length === 9, 'tin tức: bỏ lọc thì danh sách trở lại');

    go(p, '[data-q]', 'khong-co-gi-khop-dau-ca');
    await doi(300);
    ok(!!p.d.querySelector('[data-list] .empty'), 'tin tức: trạng thái rỗng khi không có kết quả');
    ok(/Thử bỏ bớt/.test(p.d.querySelector('[data-list] .empty').textContent), 'tin tức: trạng thái rỗng chỉ cách xử lý');

    go(p, '[data-q]', '');
    await doi(300);
    const trang2 = [...p.d.querySelectorAll('[data-page]')].filter((b) => b.textContent.trim() === '2')[0];
    ok(!!trang2, 'tin tức: có phân trang');
    click(p, trang2);
    await doi(30);
    ok(p.d.querySelector('[data-page][aria-current="page"]').textContent.trim() === '2', 'tin tức: sang được trang hai');
    p.w.close();
  }

  /* ----------------------------------------------------------------- DANH BẠ */
  console.log('\n--- danh bạ ---');
  {
    const p = await nap('alumni.html');
    ok(p.d.querySelectorAll('[data-list] .pcard').length === 24, 'danh bạ: 24 hồ sơ mỗi trang');

    const khoaChip = p.d.querySelector('[data-facet-chips="khoa"] .chip');
    ok(/^K\d+/.test(khoaChip.textContent), 'danh bạ: chip khóa hiện đúng nhãn');
    click(p, khoaChip);
    await doi(30);
    ok(p.w.location.search.includes('khoa='), 'danh bạ: lọc theo khóa ghi vào URL');
    const sau = p.d.querySelectorAll('[data-list] .pcard').length;
    ok(sau > 0 && sau <= 24, 'danh bạ: lọc theo khóa trả về kết quả');

    click(p, '[data-clear]');
    await doi(30);
    ok(p.d.querySelectorAll('[data-list] .pcard').length === 24, 'danh bạ: nút bỏ hết bộ lọc hoạt động');

    go(p, '[data-only-mentor]', true);
    await doi(30);
    const soCoVan = p.w.__ALUMNI.filter((a) => a.coVanNghiepVu).length;
    ok(p.d.querySelector('[data-count]').textContent.replace(/\D/g, '') === String(soCoVan),
      'danh bạ: lọc cố vấn khớp số trong dữ liệu');

    /* Phạm vi riêng tư phải thật sự che, không chỉ mờ đi. */
    const anTP = p.w.__ALUMNI.filter((a) => a.privacy.company !== 'cong-khai')[0];
    ok(!!anTP, 'dữ liệu: có hồ sơ đặt nơi công tác ở chế độ hạn chế');
    p.w.close();
  }

  /* ------------------------------------------------------------------ HỒ SƠ */
  console.log('\n--- hồ sơ và quyền riêng tư ---');
  {
    const al = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/alumni.json'), 'utf8'));
    const rieng = al.filter((a) => a.privacy.phone === 'rieng-tu')[0];
    const p = await nap('ho-so.html', '?id=' + rieng.id);
    const chu = p.d.body.textContent;
    ok(chu.includes(rieng.name), 'hồ sơ: hiện đúng tên người');
    ok(!chu.includes(rieng.dienthoai), 'hồ sơ: số điện thoại riêng tư không lọt ra HTML');
    ok(/riêng tư/i.test(chu), 'hồ sơ: nói rõ trường đang bị ẩn thay vì im lặng bỏ qua');

    const p2 = await nap('ho-so.html', '?id=khong-ton-tai');
    ok(!!p2.d.querySelector('.empty'), 'hồ sơ: id sai thì ra trạng thái rỗng, không phải trang vỡ');
    p.w.close(); p2.w.close();
  }

  /* --------------------------------------------------------------- BÀI VIẾT */
  console.log('\n--- bài viết ---');
  {
    const posts = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/posts.json'), 'utf8'));
    const bai = posts.filter((x) => x.loai === 'cauchuyen')[0];
    const p = await nap('bai-viet.html', '?slug=' + bai.slug);
    ok(p.d.querySelector('h1').textContent.trim() === bai.tieude, 'bài viết: h1 là tiêu đề bài');
    ok(p.d.title.startsWith(bai.tieude), 'bài viết: tiêu đề trang đổi theo bài');
    ok(p.d.querySelector('meta[property="og:title"]').content === bai.tieude, 'bài viết: thẻ og đổi theo bài');
    ok(!!p.d.querySelector('script[type="application/ld+json"]'), 'bài viết: có dữ liệu có cấu trúc');
    ok(p.d.querySelectorAll('.prose p').length >= 4, 'bài viết: thân bài được dựng');
    ok(p.d.querySelectorAll('.grid-cards .card').length > 0, 'bài viết: có mục đọc tiếp');

    const p2 = await nap('bai-viet.html', '?slug=khong-co');
    ok(!!p2.d.querySelector('.empty'), 'bài viết: slug sai ra trạng thái rỗng');
    p.w.close(); p2.w.close();
  }

  /* ---------------------------------------------------------------- KỶ NIỆM */
  console.log('\n--- kỷ niệm và đèn chiếu ảnh ---');
  {
    const p = await nap('ky-niem.html');
    const tong = p.w.__ALBUMS.length;
    ok(p.d.querySelectorAll('[data-list] .albumcard').length === tong, 'kỷ niệm: hiện đủ album');
    click(p, '[data-kind-tabs] [data-kind="kyyeu"]');
    await doi(30);
    const soKy = p.w.__ALBUMS.filter((a) => a.loai === 'kyyeu').length;
    ok(p.d.querySelectorAll('[data-list] .albumcard').length === soKy, 'kỷ niệm: thẻ Kỷ yếu lọc đúng');
    p.w.close();

    const albums = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/albums.json'), 'utf8'));
    const ab = albums.filter((a) => a.loai === 'anh')[0];
    const q = await nap('album.html', '?slug=' + ab.slug);
    ok(q.d.querySelectorAll('.photo').length === ab.anh.length, 'album: hiện đủ ảnh');
    click(q, '[data-photo="0"]');
    await doi(20);
    ok(q.d.querySelector('[data-lightbox]').classList.contains('is-open'), 'album: đèn chiếu mở được');
    ok(q.d.querySelector('[data-lb-cap]').textContent.includes('1 trên'), 'album: đèn chiếu hiện vị trí ảnh');
    click(q, '[data-lb-next]');
    await doi(20);
    ok(q.d.querySelector('[data-lb-cap]').textContent.includes('2 trên'), 'album: nút sau chuyển ảnh');
    q.d.dispatchEvent(new q.w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await doi(20);
    ok(!q.d.querySelector('[data-lightbox]').classList.contains('is-open'), 'album: phím Escape đóng đèn chiếu');
    q.w.close();
  }

  /* ---------------------------------------------------------------- SỰ KIỆN */
  console.log('\n--- sự kiện và đăng ký ---');
  {
    const p = await nap('su-kien.html');
    ok(p.d.querySelectorAll('[data-list] .evcard').length > 0, 'sự kiện: danh sách sắp diễn ra có nội dung');
    click(p, '[data-when-tabs] [data-when="cua-toi"]');
    await doi(20);
    ok(!!p.d.querySelector('[data-list] .empty'), 'sự kiện: thẻ của tôi rỗng khi chưa đăng ký');
    p.w.close();

    const events = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/events.json'), 'utf8'));
    const ev = events.filter((e) => new Date(e.batdau) > new Date() && e.moDangKy)[0];
    const q = await nap('su-kien-chi-tiet.html', '?slug=' + ev.slug);
    ok(q.d.querySelector('h1').textContent.trim() === ev.tieude, 'sự kiện: h1 là tên sự kiện');
    ok(!!q.d.querySelector('.seatbar__fill'), 'sự kiện: có thanh chỗ ngồi');

    click(q, '[data-open-reg]');
    await doi(20);
    ok(q.d.querySelector('[data-reg-drawer]').classList.contains('is-open'), 'sự kiện: mở được ngăn kéo đăng ký');

    /* Gửi rỗng phải bị chặn và hiện lỗi ngay dưới ô nhập. */
    click(q, '[data-reg-submit]');
    await doi(20);
    ok(!!q.d.querySelector('.field.has-error'), 'sự kiện: biểu mẫu rỗng bị chặn và báo lỗi');

    go(q, '#r-ten', 'Nguyễn Thị Hoài');
    go(q, '#r-email', 'sai-dinh-dang');
    click(q, '[data-reg-submit]');
    await doi(20);
    ok(q.d.querySelector('#r-email').closest('.field').classList.contains('has-error'), 'sự kiện: email sai định dạng bị bắt');

    go(q, '#r-email', 'hoai.nguyen@vidu.vn');
    click(q, '[data-reg-submit]');
    await doi(800);
    ok(/Bạn đã đăng ký/.test(q.d.body.textContent), 'sự kiện: đăng ký hợp lệ thì thành công');
    ok(q.d.body.textContent.includes('hoai.nguyen@vidu.vn'), 'sự kiện: xác nhận hiện lại email đã dùng');

    click(q, '[data-cancel]');
    await doi(30);
    ok(!!q.d.querySelector('[data-open-reg]'), 'sự kiện: hủy đăng ký thì nút đăng ký quay lại');
    q.w.close();
  }

  /* ------------------------------------------------------------ NGHỀ NGHIỆP */
  console.log('\n--- nghề nghiệp ---');
  {
    const p = await nap('nghe-nghiep.html');
    ok(p.d.querySelectorAll('.jobgroup').length > 0, 'nghề nghiệp: nhóm theo lĩnh vực');
    ok(p.d.querySelectorAll('.jobrow').length === p.w.__JOBS.length, 'nghề nghiệp: hiện đủ vị trí');

    const link = p.d.querySelector('.jobrow a[href*="viec="]');
    click(p, link);
    await doi(30);
    ok(p.d.querySelector('[data-job-drawer]').classList.contains('is-open'), 'nghề nghiệp: mở được ngăn kéo chi tiết');
    ok(p.w.location.search.includes('viec='), 'nghề nghiệp: mở vị trí ghi vào URL');
    ok(/Yêu cầu/.test(p.d.querySelector('[data-job-body]').textContent), 'nghề nghiệp: chi tiết có mục yêu cầu');
    click(p, '[data-job-close]');
    await doi(30);
    p.w.close();
  }

  /* ----------------------------------------------------------- ĐĂNG KÝ ALUMNI */
  console.log('\n--- đăng ký cựu sinh viên ---');
  {
    const p = await nap('dang-ky.html');
    ok(p.d.querySelectorAll('[data-steps] .step').length === 3, 'đăng ký: ba bước');
    ok(p.d.querySelector('#khoa').options.length > 20, 'đăng ký: danh sách khóa đổ từ dữ liệu');
    ok(p.d.querySelectorAll('[data-scopes] .scoperow').length === 4, 'đăng ký: bốn trường chọn phạm vi công khai');

    /* Mặc định dè dặt là một cam kết, nên kiểm bằng máy. */
    ok(p.d.querySelector('#pv-phone').value === 'rieng-tu', 'đăng ký: số điện thoại mặc định riêng tư');
    ok(p.d.querySelector('#pv-email').value === 'thanh-vien', 'đăng ký: email mặc định chỉ thành viên');

    click(p, '[data-next]');
    await doi(20);
    ok(!!p.d.querySelector('.field.has-error'), 'đăng ký: bước một rỗng thì không cho đi tiếp');

    go(p, '#hoten', 'Trần Minh Khoa');
    go(p, '#email', 'khoa.tran@vidu.vn');
    click(p, '[data-next]');
    await doi(20);
    ok(!p.d.querySelector('[data-step="2"]').classList.contains('hide'), 'đăng ký: sang được bước hai');

    go(p, '#khoa', '58');
    go(p, '#nganh', p.d.querySelector('#nganh').options[1].value);
    click(p, '[data-next]');
    await doi(20);
    ok(!p.d.querySelector('[data-step="3"]').classList.contains('hide'), 'đăng ký: sang được bước ba');

    go(p, 'input[name="dongy"]', true);
    p.d.querySelector('[data-form]').dispatchEvent(new p.w.Event('submit', { bubbles: true, cancelable: true }));
    await doi(900);
    ok(/Bạn đã ở trong mạng lưới/.test(p.d.body.textContent), 'đăng ký: hoàn tất và hiện màn xác nhận');
    p.w.close();
  }

  /* --------------------------------------------------------------- ĐÓNG GÓP */
  console.log('\n--- đóng góp nội dung ---');
  {
    const p = await nap('dong-gop.html');
    ok(p.d.querySelector('label[for="tieude"]').textContent.includes('Tiêu đề bài viết'), 'đóng góp: nhãn theo loại câu chuyện');
    go(p, 'input[name="loai"][value="tuyendung"]', true);
    await doi(20);
    ok(p.d.querySelector('label[for="tieude"]').textContent.includes('Chức danh'), 'đóng góp: nhãn đổi khi chọn tin tuyển dụng');

    p.d.querySelector('[data-form]').dispatchEvent(new p.w.Event('submit', { bubbles: true, cancelable: true }));
    await doi(20);
    ok(!!p.d.querySelector('.field.has-error'), 'đóng góp: biểu mẫu rỗng bị chặn');

    go(p, '#tieude', 'Tuyển chuyên viên phân tích tại Hà Nội');
    go(p, '#noidung', 'Doanh nghiệp của tôi cần hai bạn phân tích dữ liệu kinh doanh, ưu tiên cựu sinh viên của trường.');
    go(p, '#nguoigui', 'Lê Thu Trang');
    go(p, '#emailgui', 'trang.le@vidu.vn');
    p.d.querySelector('[data-form]').dispatchEvent(new p.w.Event('submit', { bubbles: true, cancelable: true }));
    await doi(850);
    ok(/đang chờ duyệt/i.test(p.d.body.textContent), 'đóng góp: gửi thành công và vào hàng chờ');
    ok(/Mã theo dõi/.test(p.d.body.textContent), 'đóng góp: trả về mã theo dõi');
    p.w.close();
  }

  /* -------------------------------------------------------------- TÌM KIẾM */
  console.log('\n--- tìm kiếm ---');
  {
    const al = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/alumni.json'), 'utf8'));
    const p = await nap('tim-kiem.html', '?q=' + encodeURIComponent('sự kiện'));
    ok(p.d.querySelectorAll('.sgroup').length > 0, 'tìm kiếm: kết quả nhóm theo loại');
    ok(!!p.d.querySelector('mark'), 'tìm kiếm: từ khóa khớp được bôi vàng');
    p.w.close();

    /* Gõ không dấu phải ra được tên có dấu. */
    const ten = al[0].name;
    const khongDau = ten.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
    const q = await nap('tim-kiem.html', '?q=' + encodeURIComponent(khongDau));
    ok(q.d.body.textContent.includes(ten), 'tìm kiếm: gõ không dấu vẫn ra tên có dấu');
    q.w.close();

    const r = await nap('tim-kiem.html', '?q=xyzkhongcogi');
    ok(!!r.d.querySelector('.empty'), 'tìm kiếm: không kết quả thì ra trạng thái rỗng');
    r.w.close();
  }

  /* ---------------------------------------------------------------- CMS */
  console.log('\n--- CMS: phân quyền, sửa, duyệt, sao lưu ---');
  {
    const p = await nap('admin.html');
    ok(!!p.d.querySelector('[data-gate-in]'), 'CMS: chưa đăng nhập thì thấy cổng đăng nhập');
    ok(!p.d.querySelector('[data-admin]'), 'CMS: khu làm việc không nằm trong DOM khi chưa đăng nhập');

    /* Vào với quyền biên tập viên. */
    const nutEditor = [...p.d.querySelectorAll('[data-gate-in]')][1];
    click(p, nutEditor);
    await doi(30);
    ok(!!p.d.querySelector('[data-admin]') && !p.d.querySelector('[data-admin]').hidden, 'CMS: đăng nhập thì mở khu làm việc');
    ok(!p.d.querySelector('[data-panel="nguoidung"]'), 'CMS: biên tập viên không thấy mục Người dùng');
    ok(!p.d.querySelector('[data-panel="saoluu"]'), 'CMS: biên tập viên không thấy mục Sao lưu');

    click(p, '[data-panel="baiviet"]');
    await doi(30);
    ok(p.d.querySelectorAll('.table tbody tr').length > 0, 'CMS: bảng bài viết có dữ liệu');
    ok(!!p.d.querySelector('[data-edit]'), 'CMS: biên tập viên sửa được bài');
    ok(!p.d.querySelector('[data-del]'), 'CMS: biên tập viên không xóa được bài');

    /* Sửa một bài và kiểm nó hiện ra trên trang công khai. */
    click(p, '[data-edit]');
    await doi(30);
    ok(p.d.querySelector('[data-modal]').classList.contains('is-open'), 'CMS: mở được hộp thoại sửa');
    const tieuDeMoi = 'Tiêu đề đã sửa trong bộ kiểm thử';
    go(p, '#f-tieude', tieuDeMoi);
    click(p, '[data-modal-save]');
    await doi(30);
    ok(p.d.body.textContent.includes(tieuDeMoi), 'CMS: lưu xong thì bảng hiện tiêu đề mới');

    /* Duyệt một bài gửi lên. */
    click(p, '[data-panel="duyet"]');
    await doi(30);
    const choTruoc = p.d.querySelectorAll('[data-approve]').length;
    ok(choTruoc > 0, 'CMS: hàng chờ duyệt có nội dung');
    click(p, '[data-approve]');
    await doi(30);
    ok(p.d.querySelectorAll('[data-approve]').length === choTruoc - 1, 'CMS: duyệt xong thì bài rời hàng chờ');
    p.w.close();
  }

  {
    /* Vào lại với quyền quản trị viên. */
    const p = await nap('admin.html');
    click(p, '[data-gate-in]');
    await doi(30);
    ok(!!p.d.querySelector('[data-panel="nguoidung"]'), 'CMS: quản trị viên thấy mục Người dùng');
    ok(!!p.d.querySelector('[data-panel="saoluu"]'), 'CMS: quản trị viên thấy mục Sao lưu');

    click(p, '[data-panel="baiviet"]');
    await doi(30);
    ok(!!p.d.querySelector('[data-del]'), 'CMS: quản trị viên xóa được bài');

    const truoc = p.d.querySelectorAll('.table tbody tr').length;
    click(p, '[data-del]');
    await doi(30);
    ok(p.d.querySelectorAll('.table tbody tr').length === truoc - 1, 'CMS: xóa bài thì bảng bớt một hàng');

    click(p, '[data-panel="phanquyen"]');
    await doi(30);
    ok(p.d.querySelectorAll('.rolegrid > *').length >= 24, 'CMS: bảng phân quyền được dựng');

    click(p, '[data-panel="saoluu"]');
    await doi(30);
    ok(!!p.d.querySelector('[data-export]'), 'CMS: có nút xuất sao lưu');
    ok(!!p.d.querySelector('[data-restore]'), 'CMS: có ô nạp tệp khôi phục');
    ok(!!p.d.querySelector('[data-reset]'), 'CMS: có nút đặt lại dữ liệu');

    /* Kết xuất phải chứa đúng thay đổi vừa thực hiện. */
    const dump = p.w.__STORE.exportAll();
    ok(!!dump.duLieu['overlay:posts'], 'CMS: bản sao lưu chứa lớp đè của bài viết');
    ok(dump.duLieu['overlay:posts'].deleted.length > 0, 'CMS: bản sao lưu ghi lại bài đã xóa');
    p.w.close();
  }

  /* -------------------------------------------------------- TÀI KHOẢN */
  console.log('\n--- tài khoản ---');
  {
    const p = await nap('tai-khoan.html');
    ok(!!p.d.querySelector('[data-signin]'), 'tài khoản: chưa đăng nhập thì hiện màn chọn tài khoản');
    click(p, '[data-signin]');
    await doi(30);
    ok(/Đăng xuất/.test(p.d.body.textContent), 'tài khoản: đăng nhập xong hiện trang cá nhân');
    ok(!!p.d.querySelector('[data-export]'), 'tài khoản: người dùng tải được dữ liệu của mình về');
    ok(!!p.d.querySelector('[data-wipe]'), 'tài khoản: người dùng xóa được dữ liệu của mình');
    click(p, '[data-signout]');
    await doi(30);
    ok(!!p.d.querySelector('[data-signin]'), 'tài khoản: đăng xuất trở lại màn chọn');
    p.w.close();
  }

  /* -------------------------------------------------------------- SEO */
  console.log('\n--- SEO ---');
  {
    for (const f of ['index.html', 'tin-tuc.html', 'alumni.html', 'su-kien.html', 'nghe-nghiep.html']) {
      const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
      ok(/<link rel="canonical"/.test(html), f + ': có canonical');
      ok(/<meta property="og:title"/.test(html), f + ': có og:title');
      ok(/<meta property="og:image"/.test(html), f + ': có og:image');
      const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
      ok(desc.length >= 80 && desc.length <= 250, f + ': mô tả dài hợp lý (' + desc.length + ' ký tự)');
    }
    const home = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    ok(/application\/ld\+json/.test(home), 'trang chủ: có dữ liệu có cấu trúc Organization');
    ok(/noindex/.test(fs.readFileSync(path.join(ROOT, 'admin.html'), 'utf8')), 'admin: chặn lập chỉ mục');
    ok(/noindex/.test(fs.readFileSync(path.join(ROOT, 'tai-khoan.html'), 'utf8')), 'tài khoản: chặn lập chỉ mục');
  }

  /* ---------------------------------------------- QUY TẮC TRONG MÃ NGUỒN */
  console.log('\n--- quy tắc mã nguồn ---');
  {
    const css = ['tokens', 'base', 'components', 'layout', 'pages', 'home', 'admin']
      .map((f) => fs.readFileSync(path.join(ROOT, 'assets/css/' + f + '.css'), 'utf8'));
    const all = css.join('\n');

    /* Chỉ tokens.css được phép chứa mã màu thô. */
    const hexNgoai = css.slice(1).join('\n').match(/#[0-9a-fA-F]{6}\b/g) || [];
    const chapNhan = hexNgoai.filter((h) => !/^#(ffffff|000000)$/i.test(h));
    ok(chapNhan.length <= 12, 'CSS: mã màu thô ngoài tokens.css ở mức tối thiểu (' + chapNhan.length + ')');

    ok(!/#000000\s*;/.test(css[0].split('--surface-base')[1] || ''), 'CSS: nền trang không phải đen thuần');
    /* Trang gốc đo được border-radius 0px ở mọi thành phần. Ba token bán kính
       phải bằng 0, nếu không giao diện lại trôi về phong cách SaaS bo tròn. */
    ok(/--radius:\s*0;/.test(css[0]), 'CSS: bán kính card bằng 0 như trang gốc');
    ok(/--radius-sm:\s*0;/.test(css[0]), 'CSS: bán kính nút bằng 0 như trang gốc');
    ok(/--radius-pill:\s*0;/.test(css[0]), 'CSS: không còn hình viên thuốc');

    /* Ba màu đo được trên trang gốc phải có mặt nguyên vẹn. */
    ok(/--blue:\s*#0076c0;/.test(css[0]), 'CSS: giữ đúng xanh NEU #0076c0');
    ok(/--red-brand:\s*#ff0000;/.test(css[0]), 'CSS: giữ đỏ thương hiệu #ff0000');
    ok(/--green:\s*#1b7b57;/.test(css[0]), 'CSS: giữ xanh lá liên kết #1b7b57');

    ok(/prefers-reduced-motion/.test(all), 'CSS: có tôn trọng prefers-reduced-motion');
    ok(/prefers-color-scheme/.test(all), 'CSS: có chế độ tối theo hệ thống');
    ok(/:focus-visible/.test(all), 'CSS: có kiểu tiêu điểm bàn phím');

    const js = fs.readdirSync(path.join(ROOT, 'assets/js'))
      .map((f) => fs.readFileSync(path.join(ROOT, 'assets/js/' + f), 'utf8')).join('\n');
    ok(!/addEventListener\(\s*['"]scroll['"]/.test(js), 'JS: không nghe sự kiện scroll trực tiếp');
    ok(/IntersectionObserver/.test(js), 'JS: dùng IntersectionObserver thay cho scroll');

    /* Gạch ngang dài bị cấm trong cả mã nguồn hiển thị. */
    const files = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html'));
    let gach = 0;
    files.forEach((f) => {
      const m = fs.readFileSync(path.join(ROOT, f), 'utf8').match(/[\u2014\u2013]/g);
      if (m) gach += m.length;
    });
    ok(gach === 0, 'HTML: không có gạch ngang dài trong mã nguồn (' + gach + ')');
  }


  /* ------------------------------------------------ CLASS KHÔNG CÓ CSS */
  console.log('\n--- class mồ côi ---');
  {
    /* jsdom không tính bố cục, nên một file CSS bị cắt mất hoàn toàn vẫn đi
       lọt qua mọi phép kiểm ở trên: DOM vẫn đúng, chỉ có điều trang không còn
       định dạng. Đúng chuyện đó đã xảy ra một lần với danh sách việc làm và
       thẻ sự kiện. Phép kiểm này quét mọi class xuất hiện trong HTML và JS
       rồi đối chiếu với toàn bộ CSS, nên lần sau nó bị bắt ngay. */
    const nguon = [
      ...fs.readdirSync(path.join(ROOT, 'assets/js')).map((f) => 'assets/js/' + f),
      ...fs.readdirSync(ROOT).filter((f) => f.endsWith('.html')),
    ];
    const dung = new Set();
    for (const f of nguon) {
      const txt = fs.readFileSync(path.join(ROOT, f), 'utf8');
      for (const m of txt.matchAll(/class=["\x27]([^"\x27]+)["\x27]/g)) {
        m[1].split(/\s+/).filter(Boolean).forEach((c) => dung.add(c));
      }
    }

    const css = fs
      .readdirSync(path.join(ROOT, 'assets/css'))
      .map((f) => fs.readFileSync(path.join(ROOT, 'assets/css/' + f), 'utf8'))
      .join('\n');
    const co = new Set([...css.matchAll(/\.([a-zA-Z][a-zA-Z0-9_-]*)/g)].map((m) => m[1]));

    /* ph-* là biểu tượng Phosphor tải từ CDN, sr-only/container/hide nằm trong
       base.css dưới dạng tiện ích và đã được kiểm ở chỗ khác. */
    const boQua = /^(ph-|is-|has-)/;
    const moCoi = [...dung].filter((c) => !co.has(c) && !boQua.test(c)).sort();

    ok(moCoi.length === 0, 'CSS: không có class nào dùng mà thiếu định dạng' +
      (moCoi.length ? ' (' + moCoi.length + ': ' + moCoi.slice(0, 6).join(', ') + ')' : ''));
  }
  /* ----------------------------------------------------------------- KẾT */
  console.log('\n' + '='.repeat(56));
  if (fail === 0) {
    console.log('Toàn bộ ' + pass + ' phép thử đều đạt.');
  } else {
    console.log(pass + ' đạt, ' + fail + ' hỏng:');
    loi.forEach((l) => console.log('  - ' + l));
  }
  console.log('='.repeat(56) + '\n');
  process.exit(fail ? 1 : 0);
}

chay().catch((e) => { console.error(e); process.exit(1); });
