/* ==========================================================================
   SINH KHUNG HTML CHO CÁC TRANG TRONG

   Mười lăm trang dùng chung một phần <head>, một dải đường dẫn và một danh
   sách thẻ <script>. Viết tay mười lăm lần thì sớm muộn cũng lệch: một trang
   thiếu thẻ og, một trang quên canonical. Script này sinh phần khung, còn
   phần <main> của mỗi trang thì viết riêng trong mảng PAGES bên dưới.

   Trang chủ không nằm ở đây. Nó có banner và cấu trúc riêng nên được viết tay.

   Chạy: node tools/build-pages.js
   ========================================================================== */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = 'https://alumni.neu.edu.vn/';

const CORE_SCRIPTS = ['brand', 'store', 'data', 'ui', 'search', 'cards'];

function head(p) {
  const og = p.ogImage || 'https://picsum.photos/seed/neu-banner-chinh/1200/630';
  return `<!doctype html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${p.title}</title>
<meta name="description" content="${p.desc}">
<link rel="canonical" href="${SITE}${p.file}">
<meta property="og:type" content="${p.ogType || 'website'}">
<meta property="og:title" content="${p.title}">
<meta property="og:description" content="${p.desc}">
<meta property="og:url" content="${SITE}${p.file}">
<meta property="og:image" content="${og}">
<meta property="og:locale" content="vi_VN">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0076c0">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="mask-icon" href="favicon.svg" color="#0076c0">
${p.noindex ? '<meta name="robots" content="noindex, nofollow">\n' : ''}
<script>
  /* Áp chủ đề trước khi trang vẽ lần đầu, để không chớp sáng rồi mới tối. */
  try {
    var t = JSON.parse(localStorage.getItem('neu-alumni:theme') || '"auto"');
    if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
  } catch (e) {}
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;500;700&family=Roboto:wght@400;500;700&display=swap">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/light/style.css">
<link rel="stylesheet" href="assets/css/tokens.css">
<link rel="stylesheet" href="assets/css/base.css">
<link rel="stylesheet" href="assets/css/components.css">
<link rel="stylesheet" href="assets/css/layout.css">
<link rel="stylesheet" href="assets/css/pages.css">
<link rel="stylesheet" href="assets/css/lists.css">
${(p.css || []).map((c) => `<link rel="stylesheet" href="assets/css/${c}.css">`).join('\n')}
<link rel="stylesheet" href="assets/css/polish.css">
</head>
`;
}

function crumbs(p) {
  if (p.bare) return '';
  return `  <nav class="container crumbs" aria-label="Đường dẫn">
    <a href="index.html">Trang chủ</a>
    <span class="crumbs__sep" aria-hidden="true">/</span>
    <span aria-current="page">${p.crumb || p.h1}</span>
  </nav>
`;
}

function pagehead(p) {
  if (p.bare || p.noHead) return '';
  return `  <div class="pagehead">
    <div class="container pagehead__inner">
      <h1 class="pagehead__title">${p.h1}</h1>
      <div class="pagehead__rule"></div>
${p.lede ? `      <p class="pagehead__lede">${p.lede}</p>\n` : ''}    </div>
  </div>
`;
}

function scripts(p) {
  const data = (p.data || []).map((d) => `<script src="assets/data/${d}.js"></script>`).join('\n');
  const core = CORE_SCRIPTS.map((s) => `<script src="assets/js/${s}.js"></script>`).join('\n');
  const own = (p.js || []).map((s) => `<script src="assets/js/${s}.js"></script>`).join('\n');
  return `${data}\n${core}\n${own}`;
}

function render(p) {
  return head(p) +
`<body>
<a class="skip-link" href="#main">Bỏ qua tới nội dung chính</a>
<div data-header></div>

<main id="main">
${crumbs(p)}${pagehead(p)}${p.main}
</main>

<div data-footer></div>

${scripts(p)}
</body>
</html>
`;
}

/* ==========================================================================
   ĐẶC TẢ TỪNG TRANG
   ========================================================================== */

const PAGES = [];

/* ------------------------------------------------------------------- TIN TỨC */
PAGES.push({
  file: 'tin-tuc.html',
  title: 'Tin tức | Mạng lưới Cựu sinh viên NEU',
  desc: 'Tin hoạt động của khoa, sự kiện, thành tựu cựu sinh viên, học bổng và hợp tác doanh nghiệp trong mạng lưới cựu sinh viên Đại học Kinh tế Quốc dân.',
  h1: 'Tin tức',
  lede: 'Hoạt động của khoa, sự kiện của mạng lưới, thành tựu của cựu sinh viên và các chương trình học bổng.',
  data: ['alumni', 'posts', 'events', 'albums', 'jobs'],
  js: ['listing', 'news'],
  main: `  <div class="container shell" data-shell>
    <aside class="filters" aria-label="Lọc tin tức">
      <div class="fgroup">
        <h2 class="fgroup__title">Tìm trong tin</h2>
        <div class="searchbox">
          <i class="ph-light ph-magnifying-glass searchbox__icon" aria-hidden="true"></i>
          <label class="sr-only" for="q">Từ khóa</label>
          <input class="input" id="q" type="search" autocomplete="off" placeholder="Tiêu đề hoặc nội dung" data-q>
        </div>
      </div>
      <div class="fgroup">
        <h2 class="fgroup__title">Danh mục</h2>
        <div class="fgroup__list" data-facet="danhmuc"></div>
      </div>
      <div class="fgroup">
        <h2 class="fgroup__title">Thẻ</h2>
        <div class="fgroup__chips" data-facet-chips="the"></div>
      </div>
      <button class="btn btn--quiet btn--sm" type="button" data-clear>Bỏ hết bộ lọc</button>
    </aside>

    <div>
      <div class="results__bar">
        <p class="results__count" data-count aria-live="polite">Đang tải</p>
        <div class="results__tools">
          <label class="sr-only" for="sort">Sắp xếp</label>
          <select class="select" id="sort" data-sort>
            <option value="moi">Mới nhất trước</option>
            <option value="cu">Cũ nhất trước</option>
            <option value="az">Theo tên A tới Z</option>
          </select>
          <button class="btn btn--ghost btn--sm hide-desktop" type="button" data-toggle-filters>Bộ lọc</button>
        </div>
      </div>
      <div class="results__active" data-active></div>
      <div class="grid-cards" data-list></div>
      <nav class="pager" data-pager aria-label="Phân trang"></nav>
    </div>
  </div>`,
});

/* --------------------------------------------------------------- CÂU CHUYỆN */
PAGES.push({
  file: 'cau-chuyen.html',
  title: 'Câu chuyện Alumni | Mạng lưới Cựu sinh viên NEU',
  desc: 'Chân dung và hành trình nghề nghiệp của cựu sinh viên Đại học Kinh tế Quốc dân: từ giảng đường tới vị trí hiện tại, kể bằng lời của chính họ.',
  h1: 'Câu chuyện Alumni',
  lede: 'Hành trình nghề nghiệp của những người đã đi trước, kể lại đủ dài để người đi sau dùng được.',
  data: ['alumni', 'posts', 'events', 'albums', 'jobs'],
  js: ['stories'],
  main: `  <section class="container section--tight">
    <div class="results__bar">
      <p class="results__count" data-count aria-live="polite">Đang tải</p>
      <div class="results__tools">
        <div class="searchbox">
          <i class="ph-light ph-magnifying-glass searchbox__icon" aria-hidden="true"></i>
          <label class="sr-only" for="q">Tìm trong câu chuyện</label>
          <input class="input" id="q" type="search" autocomplete="off" placeholder="Tên người hoặc từ khóa" data-q>
        </div>
      </div>
    </div>
    <div data-featured></div>
    <div class="grid-cards" data-list></div>
  </section>`,
});

/* ------------------------------------------------------------------ BÀI VIẾT */
PAGES.push({
  file: 'bai-viet.html',
  title: 'Bài viết | Mạng lưới Cựu sinh viên NEU',
  desc: 'Nội dung bài viết thuộc cổng thông tin cựu sinh viên Đại học Kinh tế Quốc dân.',
  ogType: 'article',
  bare: true,
  data: ['alumni', 'posts', 'events', 'albums', 'jobs'],
  js: ['article'],
  main: `  <article class="container article" data-article>
    <div class="article__head">
      <div class="skeleton skel-line skel-line--40" style="height:14px"></div>
      <div class="skeleton" style="height:44px"></div>
      <div class="skeleton skel-line skel-line--60"></div>
    </div>
  </article>`,
});

/* ------------------------------------------------------------------- DANH BẠ */
PAGES.push({
  file: 'alumni.html',
  title: 'Danh bạ cựu sinh viên | Mạng lưới Cựu sinh viên NEU',
  desc: 'Tra cứu cựu sinh viên Đại học Kinh tế Quốc dân theo khóa, lớp, ngành đào tạo, lĩnh vực nghề nghiệp, doanh nghiệp và nơi công tác.',
  h1: 'Danh bạ cựu sinh viên',
  lede: 'Tìm theo khóa, ngành, lĩnh vực hoặc nơi công tác. Mỗi người tự chọn thông tin nào của mình được hiện ra.',
  data: ['alumni', 'posts', 'events', 'albums', 'jobs'],
  js: ['listing', 'directory'],
  main: `  <div class="container shell" data-shell>
    <aside class="filters" aria-label="Lọc danh bạ">
      <div class="fgroup">
        <h2 class="fgroup__title">Tìm theo tên</h2>
        <div class="searchbox">
          <i class="ph-light ph-magnifying-glass searchbox__icon" aria-hidden="true"></i>
          <label class="sr-only" for="q">Tên, công ty hoặc chức danh</label>
          <input class="input" id="q" type="search" autocomplete="off" placeholder="Tên, công ty, chức danh" data-q>
        </div>
      </div>
      <div class="fgroup">
        <h2 class="fgroup__title">Khóa</h2>
        <div class="fgroup__chips" data-facet-chips="khoa"></div>
      </div>
      <div class="fgroup">
        <h2 class="fgroup__title">Ngành đào tạo</h2>
        <div class="fgroup__list" data-facet="nganh"></div>
      </div>
      <div class="fgroup">
        <h2 class="fgroup__title">Lĩnh vực nghề nghiệp</h2>
        <div class="fgroup__list" data-facet="linhvuc"></div>
      </div>
      <div class="fgroup">
        <h2 class="fgroup__title">Nơi công tác</h2>
        <div class="fgroup__list" data-facet="thanhpho"></div>
      </div>
      <div class="fgroup">
        <h2 class="fgroup__title">Khác</h2>
        <label class="fcheck"><input type="checkbox" data-only-mentor> Chỉ hiện người nhận làm cố vấn</label>
      </div>
      <button class="btn btn--quiet btn--sm" type="button" data-clear>Bỏ hết bộ lọc</button>
    </aside>

    <div>
      <div class="results__bar">
        <p class="results__count" data-count aria-live="polite">Đang tải</p>
        <div class="results__tools">
          <label class="sr-only" for="sort">Sắp xếp</label>
          <select class="select" id="sort" data-sort>
            <option value="khoa-moi">Khóa mới nhất trước</option>
            <option value="khoa-cu">Khóa cũ nhất trước</option>
            <option value="az">Theo tên A tới Z</option>
          </select>
          <button class="btn btn--ghost btn--sm hide-desktop" type="button" data-toggle-filters>Bộ lọc</button>
        </div>
      </div>
      <div class="results__active" data-active></div>
      <div class="people" data-list></div>
      <nav class="pager" data-pager aria-label="Phân trang"></nav>
    </div>
  </div>`,
});

/* -------------------------------------------------------------------- HỒ SƠ */
PAGES.push({
  file: 'ho-so.html',
  title: 'Hồ sơ cựu sinh viên | Mạng lưới Cựu sinh viên NEU',
  desc: 'Hồ sơ cựu sinh viên Đại học Kinh tế Quốc dân với thông tin khóa học, ngành đào tạo và nghề nghiệp, hiển thị theo phạm vi công khai do chính người đó chọn.',
  ogType: 'profile',
  bare: true,
  noindex: true,
  data: ['alumni', 'posts', 'events', 'albums', 'jobs'],
  js: ['profile'],
  main: `  <div class="container" data-profile>
    <div class="profile">
      <div class="skeleton" style="height:320px;border-radius:12px"></div>
      <div style="display:grid;gap:16px">
        <div class="skeleton" style="height:40px"></div>
        <div class="skeleton skel-line skel-line--85"></div>
        <div class="skeleton skel-line skel-line--60"></div>
      </div>
    </div>
  </div>`,
});

/* ------------------------------------------------------------------ KỶ NIỆM */
PAGES.push({
  file: 'ky-niem.html',
  title: 'Kho kỷ niệm | Mạng lưới Cựu sinh viên NEU',
  desc: 'Kho ảnh, video, kỷ yếu và tư liệu của các khóa Đại học Kinh tế Quốc dân, sắp xếp theo năm và theo khóa, đã số hóa và tra cứu được.',
  h1: 'Kho kỷ niệm',
  lede: 'Ảnh, video, kỷ yếu và tư liệu của các khóa, đã số hóa và sắp theo năm.',
  data: ['alumni', 'posts', 'events', 'albums', 'jobs'],
  js: ['memories'],
  main: `  <section class="container section--tight">
    <div class="tabs" role="tablist" aria-label="Loại tư liệu" data-kind-tabs>
      <button class="tab" role="tab" aria-selected="true" data-kind="">Tất cả</button>
      <button class="tab" role="tab" aria-selected="false" data-kind="anh">Album ảnh</button>
      <button class="tab" role="tab" aria-selected="false" data-kind="kyyeu">Kỷ yếu</button>
      <button class="tab" role="tab" aria-selected="false" data-kind="video">Video</button>
    </div>

    <div class="yearnav" data-years aria-label="Lọc theo năm"></div>

    <div class="results__bar">
      <p class="results__count" data-count aria-live="polite">Đang tải</p>
      <div class="results__tools">
        <div class="searchbox">
          <i class="ph-light ph-magnifying-glass searchbox__icon" aria-hidden="true"></i>
          <label class="sr-only" for="q">Tìm trong kho kỷ niệm</label>
          <input class="input" id="q" type="search" autocomplete="off" placeholder="Tên album hoặc khóa" data-q>
        </div>
      </div>
    </div>

    <div class="albumgrid" data-list></div>
  </section>`,
});

/* -------------------------------------------------------------------- ALBUM */
PAGES.push({
  file: 'album.html',
  title: 'Album | Kho kỷ niệm NEU Alumni',
  desc: 'Album ảnh và tư liệu thuộc kho kỷ niệm của mạng lưới cựu sinh viên Đại học Kinh tế Quốc dân.',
  bare: true,
  data: ['alumni', 'posts', 'events', 'albums', 'jobs'],
  js: ['album'],
  main: `  <div class="container" data-album>
    <div class="section--tight"><div class="skeleton" style="height:40px;max-width:420px"></div></div>
    <div class="photos">
      <div class="skeleton photo"></div><div class="skeleton photo"></div>
      <div class="skeleton photo"></div><div class="skeleton photo"></div>
    </div>
  </div>

  <div class="lightbox" data-lightbox role="dialog" aria-modal="true" aria-label="Xem ảnh lớn">
    <button class="iconbtn lightbox__close" type="button" data-lb-close aria-label="Đóng"><i class="ph-light ph-x" aria-hidden="true"></i></button>
    <button class="lightbox__nav lightbox__nav--prev" type="button" data-lb-prev aria-label="Ảnh trước"><i class="ph-light ph-caret-left" aria-hidden="true"></i></button>
    <button class="lightbox__nav lightbox__nav--next" type="button" data-lb-next aria-label="Ảnh sau"><i class="ph-light ph-caret-right" aria-hidden="true"></i></button>
    <div>
      <img class="lightbox__img" data-lb-img src="" alt="">
      <p class="lightbox__cap" data-lb-cap></p>
    </div>
  </div>`,
});

/* ------------------------------------------------------------------ SỰ KIỆN */
PAGES.push({
  file: 'su-kien.html',
  title: 'Sự kiện | Mạng lưới Cựu sinh viên NEU',
  desc: 'Lịch sự kiện của mạng lưới cựu sinh viên Đại học Kinh tế Quốc dân: gặp mặt truyền thống, tọa đàm nghề nghiệp, ngày hội việc làm và hoạt động thiện nguyện.',
  h1: 'Sự kiện',
  lede: 'Gặp mặt, tọa đàm, ngày hội việc làm và hoạt động thiện nguyện của mạng lưới.',
  data: ['alumni', 'posts', 'events', 'albums', 'jobs'],
  js: ['eventlist'],
  main: `  <section class="container section--tight">
    <div class="tabs" role="tablist" aria-label="Trạng thái sự kiện" data-when-tabs>
      <button class="tab" role="tab" aria-selected="true" data-when="sap">Sắp diễn ra</button>
      <button class="tab" role="tab" aria-selected="false" data-when="qua">Đã diễn ra</button>
      <button class="tab" role="tab" aria-selected="false" data-when="cua-toi">Tôi đã đăng ký</button>
    </div>

    <div class="results__bar">
      <p class="results__count" data-count aria-live="polite">Đang tải</p>
      <div class="results__tools">
        <label class="sr-only" for="city">Địa điểm</label>
        <select class="select" id="city" data-city><option value="">Mọi địa điểm</option></select>
      </div>
    </div>

    <div class="rail" style="grid-auto-flow:row;grid-auto-columns:auto;overflow:visible" data-list></div>
  </section>`,
});

/* -------------------------------------------------------- SỰ KIỆN CHI TIẾT */
PAGES.push({
  file: 'su-kien-chi-tiet.html',
  title: 'Chi tiết sự kiện | Mạng lưới Cựu sinh viên NEU',
  desc: 'Thông tin chi tiết và đăng ký tham gia sự kiện của mạng lưới cựu sinh viên Đại học Kinh tế Quốc dân.',
  ogType: 'article',
  bare: true,
  data: ['alumni', 'posts', 'events', 'albums', 'jobs'],
  js: ['event'],
  main: `  <div class="container" data-event>
    <div class="evdetail">
      <div style="display:grid;gap:16px">
        <div class="skeleton" style="height:44px"></div>
        <div class="skeleton" style="height:280px;border-radius:12px"></div>
      </div>
      <div class="skeleton" style="height:320px;border-radius:12px"></div>
    </div>
  </div>`,
});

/* -------------------------------------------------------------- NGHỀ NGHIỆP */
PAGES.push({
  file: 'nghe-nghiep.html',
  title: 'Cơ hội nghề nghiệp | Mạng lưới Cựu sinh viên NEU',
  desc: 'Tin tuyển dụng và cơ hội việc làm do cựu sinh viên và doanh nghiệp đối tác của Đại học Kinh tế Quốc dân giới thiệu vào mạng lưới.',
  h1: 'Cơ hội nghề nghiệp',
  lede: 'Vị trí do cựu sinh viên và doanh nghiệp trong mạng lưới giới thiệu, lọc theo lĩnh vực, cấp bậc và nơi làm việc.',
  data: ['alumni', 'posts', 'events', 'albums', 'jobs'],
  js: ['listing', 'jobs'],
  main: `  <div class="container shell" data-shell>
    <aside class="filters" aria-label="Lọc tin tuyển dụng">
      <div class="fgroup">
        <h2 class="fgroup__title">Tìm vị trí</h2>
        <div class="searchbox">
          <i class="ph-light ph-magnifying-glass searchbox__icon" aria-hidden="true"></i>
          <label class="sr-only" for="q">Chức danh hoặc doanh nghiệp</label>
          <input class="input" id="q" type="search" autocomplete="off" placeholder="Chức danh hoặc doanh nghiệp" data-q>
        </div>
      </div>
      <div class="fgroup">
        <h2 class="fgroup__title">Lĩnh vực</h2>
        <div class="fgroup__list" data-facet="linhvuc"></div>
      </div>
      <div class="fgroup">
        <h2 class="fgroup__title">Cấp bậc</h2>
        <div class="fgroup__chips" data-facet-chips="capbac"></div>
      </div>
      <div class="fgroup">
        <h2 class="fgroup__title">Hình thức</h2>
        <div class="fgroup__list" data-facet="hinhthuc"></div>
      </div>
      <div class="fgroup">
        <h2 class="fgroup__title">Nơi làm việc</h2>
        <div class="fgroup__list" data-facet="thanhpho"></div>
      </div>
      <button class="btn btn--quiet btn--sm" type="button" data-clear>Bỏ hết bộ lọc</button>
    </aside>

    <div>
      <div class="results__bar">
        <p class="results__count" data-count aria-live="polite">Đang tải</p>
        <div class="results__tools">
          <label class="sr-only" for="sort">Sắp xếp</label>
          <select class="select" id="sort" data-sort>
            <option value="moi">Đăng gần nhất</option>
            <option value="han">Sắp hết hạn</option>
          </select>
          <button class="btn btn--ghost btn--sm hide-desktop" type="button" data-toggle-filters>Bộ lọc</button>
        </div>
      </div>
      <div class="results__active" data-active></div>
      <div class="joblist" data-list></div>
    </div>
  </div>

  <div class="scrim" data-job-scrim></div>
  <aside class="drawer" data-job-drawer role="dialog" aria-modal="true" aria-label="Chi tiết vị trí" hidden>
    <div class="drawer__head">
      <h2 class="drawer__title" data-job-title>Chi tiết vị trí</h2>
      <button class="iconbtn" type="button" data-job-close aria-label="Đóng"><i class="ph-light ph-x" aria-hidden="true"></i></button>
    </div>
    <div class="drawer__body" data-job-body></div>
    <div class="drawer__foot" data-job-foot></div>
  </aside>`,
});

/* -------------------------------------------------------------------- ĐĂNG KÝ */
PAGES.push({
  file: 'dang-ky.html',
  title: 'Đăng ký cựu sinh viên | Mạng lưới Cựu sinh viên NEU',
  desc: 'Tạo hồ sơ cựu sinh viên Đại học Kinh tế Quốc dân, cập nhật thông tin nghề nghiệp và chọn phạm vi công khai cho từng trường thông tin.',
  h1: 'Đăng ký cựu sinh viên',
  lede: 'Ba bước. Bạn quyết định từng thông tin của mình hiện với ai.',
  data: ['alumni', 'posts', 'events', 'albums', 'jobs'],
  js: ['register'],
  main: `  <div class="container formwrap">
    <div class="steps" data-steps>
      <div class="step is-on"><span class="step__name">Thông tin cơ bản</span><span>Họ tên và liên hệ</span></div>
      <div class="step"><span class="step__name">Học tập và nghề nghiệp</span><span>Khóa, ngành, nơi công tác</span></div>
      <div class="step"><span class="step__name">Phạm vi công khai</span><span>Ai thấy được gì</span></div>
    </div>

    <form data-form novalidate>
      <!-- Bước 1 -->
      <fieldset class="fieldset" data-step="1">
        <legend class="fieldset__legend">Thông tin cơ bản</legend>
        <div class="formrow">
          <div class="field">
            <label class="field__label" for="hoten">Họ và tên <span class="req" aria-hidden="true">*</span></label>
            <input class="input" id="hoten" name="hoten" type="text" autocomplete="name" data-rule="required|min:3">
          </div>
          <div class="field">
            <label class="field__label" for="email">Email <span class="req" aria-hidden="true">*</span></label>
            <input class="input" id="email" name="email" type="email" autocomplete="email" data-rule="required|email">
            <p class="field__hint">Dùng để xác nhận đăng ký sự kiện và nhận bản tin.</p>
          </div>
        </div>
        <div class="formrow">
          <div class="field">
            <label class="field__label" for="dienthoai">Điện thoại</label>
            <input class="input" id="dienthoai" name="dienthoai" type="tel" autocomplete="tel" data-rule="phone">
          </div>
          <div class="field">
            <label class="field__label" for="thanhpho">Nơi sinh sống</label>
            <input class="input" id="thanhpho" name="thanhpho" type="text" autocomplete="address-level2">
          </div>
        </div>
      </fieldset>

      <!-- Bước 2 -->
      <fieldset class="fieldset hide" data-step="2">
        <legend class="fieldset__legend">Học tập và nghề nghiệp</legend>
        <div class="formrow">
          <div class="field">
            <label class="field__label" for="khoa">Khóa <span class="req" aria-hidden="true">*</span></label>
            <select class="select" id="khoa" name="khoa" data-rule="required"><option value="">Chọn khóa</option></select>
          </div>
          <div class="field">
            <label class="field__label" for="lop">Lớp</label>
            <input class="input" id="lop" name="lop" type="text" placeholder="Ví dụ: KTE 58A">
          </div>
        </div>
        <div class="formrow">
          <div class="field">
            <label class="field__label" for="nganh">Ngành đào tạo <span class="req" aria-hidden="true">*</span></label>
            <select class="select" id="nganh" name="nganh" data-rule="required"><option value="">Chọn ngành</option></select>
          </div>
          <div class="field">
            <label class="field__label" for="namtn">Năm tốt nghiệp</label>
            <input class="input" id="namtn" name="namtn" type="text" inputmode="numeric" placeholder="2015" data-rule="year">
          </div>
        </div>
        <div class="formrow">
          <div class="field">
            <label class="field__label" for="congty">Nơi công tác</label>
            <input class="input" id="congty" name="congty" type="text" autocomplete="organization">
          </div>
          <div class="field">
            <label class="field__label" for="chucdanh">Chức danh</label>
            <input class="input" id="chucdanh" name="chucdanh" type="text" autocomplete="organization-title">
          </div>
        </div>
        <div class="field">
          <label class="field__label" for="linhvuc">Lĩnh vực</label>
          <select class="select" id="linhvuc" name="linhvuc"><option value="">Chọn lĩnh vực</option></select>
        </div>
        <label class="choice">
          <input type="checkbox" name="covan" value="1">
          <span class="choice__body">
            <span class="choice__title">Tôi nhận làm cố vấn cho sinh viên và người mới đi làm</span>
            <span class="choice__note">Hồ sơ của bạn sẽ mang nhãn Cố vấn trong danh bạ. Bạn có thể tắt bất cứ lúc nào.</span>
          </span>
        </label>
      </fieldset>

      <!-- Bước 3 -->
      <fieldset class="fieldset hide" data-step="3">
        <legend class="fieldset__legend">Phạm vi công khai</legend>
        <p class="fieldset__note">Mặc định của hệ thống là dè dặt. Bạn mở rộng tới đâu là quyền của bạn, và đổi lại được bất cứ lúc nào trong mục Tài khoản.</p>
        <div class="scopes" data-scopes></div>
        <label class="choice">
          <input type="checkbox" name="dongy" value="1" data-rule="required">
          <span class="choice__body">
            <span class="choice__title">Tôi xác nhận thông tin trên là của tôi và đồng ý cho mạng lưới lưu trữ</span>
            <span class="choice__note">Bạn có quyền yêu cầu sửa hoặc xóa hồ sơ bất cứ lúc nào bằng cách liên hệ ban quản trị.</span>
          </span>
        </label>
      </fieldset>

      <div class="formnav">
        <button class="btn btn--quiet" type="button" data-prev disabled>Quay lại</button>
        <button class="btn btn--primary" type="button" data-next>Tiếp tục</button>
        <button class="btn btn--primary hide" type="submit" data-submit>Hoàn tất đăng ký</button>
      </div>
    </form>

    <div class="hide" data-done></div>
  </div>`,
});

/* ------------------------------------------------------------------- ĐÓNG GÓP */
PAGES.push({
  file: 'dong-gop.html',
  title: 'Đóng góp nội dung | Mạng lưới Cựu sinh viên NEU',
  desc: 'Gửi câu chuyện, ảnh kỷ niệm, tư liệu hoặc tin tuyển dụng cho mạng lưới cựu sinh viên Đại học Kinh tế Quốc dân. Ban quản trị duyệt trước khi đăng.',
  h1: 'Đóng góp nội dung',
  lede: 'Gửi câu chuyện, ảnh, tư liệu hoặc tin tuyển dụng. Ban quản trị duyệt trước khi công bố.',
  data: ['alumni', 'posts', 'events', 'albums', 'jobs', 'submissions'],
  js: ['contribute'],
  main: `  <div class="container formwrap">
    <form data-form novalidate>
      <fieldset class="fieldset">
        <legend class="fieldset__legend">Bạn muốn gửi gì</legend>
        <div class="scopes">
          <label class="choice"><input type="radio" name="loai" value="cauchuyen" checked>
            <span class="choice__body"><span class="choice__title">Câu chuyện hoặc bài viết</span>
            <span class="choice__note">Chân dung, hành trình nghề nghiệp, hồi ức về thời đi học.</span></span></label>
          <label class="choice"><input type="radio" name="loai" value="anh">
            <span class="choice__body"><span class="choice__title">Ảnh kỷ niệm</span>
            <span class="choice__note">Ảnh gặp mặt khóa, lễ tốt nghiệp, hoạt động của lớp.</span></span></label>
          <label class="choice"><input type="radio" name="loai" value="tulieu">
            <span class="choice__body"><span class="choice__title">Tư liệu và kỷ yếu</span>
            <span class="choice__note">Bản quét kỷ yếu, sổ tay, ảnh tập thể, giấy tờ lưu niệm.</span></span></label>
          <label class="choice"><input type="radio" name="loai" value="tuyendung">
            <span class="choice__body"><span class="choice__title">Tin tuyển dụng</span>
            <span class="choice__note">Vị trí đang mở tại doanh nghiệp của bạn.</span></span></label>
        </div>
      </fieldset>

      <fieldset class="fieldset" style="margin-top:var(--space-13)">
        <legend class="fieldset__legend">Nội dung</legend>
        <div class="field">
          <label class="field__label" for="tieude">Tiêu đề <span class="req" aria-hidden="true">*</span></label>
          <input class="input" id="tieude" name="tieude" type="text" data-rule="required|min:6">
        </div>
        <div class="field">
          <label class="field__label" for="noidung">Mô tả <span class="req" aria-hidden="true">*</span></label>
          <textarea class="textarea" id="noidung" name="noidung" data-rule="required|min:30"></textarea>
          <p class="field__hint">Viết đủ để ban biên tập hiểu nội dung. Tối thiểu 30 ký tự.</p>
        </div>
        <div class="field" data-file-field>
          <label class="field__label" for="tep">Tệp đính kèm</label>
          <input class="input" id="tep" name="tep" type="file" accept="image/*,.pdf" multiple>
          <p class="field__hint">Trong bản demo, tệp chỉ được đọc tên và không rời khỏi máy bạn.</p>
        </div>
      </fieldset>

      <fieldset class="fieldset" style="margin-top:var(--space-13)">
        <legend class="fieldset__legend">Người gửi</legend>
        <div class="formrow">
          <div class="field">
            <label class="field__label" for="nguoigui">Họ và tên <span class="req" aria-hidden="true">*</span></label>
            <input class="input" id="nguoigui" name="nguoigui" type="text" autocomplete="name" data-rule="required|min:3">
          </div>
          <div class="field">
            <label class="field__label" for="emailgui">Email <span class="req" aria-hidden="true">*</span></label>
            <input class="input" id="emailgui" name="emailgui" type="email" autocomplete="email" data-rule="required|email">
          </div>
        </div>
        <div class="field">
          <label class="field__label" for="khoagui">Khóa</label>
          <input class="input" id="khoagui" name="khoagui" type="text" inputmode="numeric" placeholder="Ví dụ: 52">
        </div>
      </fieldset>

      <div class="formnav">
        <p class="dim" style="font-size:var(--fs-xs);max-width:40ch">Nội dung vào hàng chờ duyệt. Ban quản trị phản hồi qua email trong vài ngày làm việc.</p>
        <button class="btn btn--primary" type="submit" data-submit>Gửi cho ban quản trị</button>
      </div>
    </form>

    <div class="hide" data-done></div>
  </div>`,
});

/* ------------------------------------------------------------------ TÌM KIẾM */
PAGES.push({
  file: 'tim-kiem.html',
  title: 'Tìm kiếm | Mạng lưới Cựu sinh viên NEU',
  desc: 'Tìm kiếm toàn bộ cổng thông tin cựu sinh viên Đại học Kinh tế Quốc dân: hồ sơ, tin tức, câu chuyện, sự kiện, album và việc làm.',
  h1: 'Tìm kiếm',
  lede: 'Tìm trong hồ sơ cựu sinh viên, tin tức, câu chuyện, sự kiện, kho kỷ niệm và tin tuyển dụng.',
  noindex: true,
  data: ['alumni', 'posts', 'events', 'albums', 'jobs'],
  js: ['sitesearch'],
  main: `  <section class="container section--tight">
    <form data-form role="search" style="max-width:640px">
      <div class="field">
        <label class="field__label" for="q">Từ khóa</label>
        <div class="searchbox">
          <i class="ph-light ph-magnifying-glass searchbox__icon" aria-hidden="true"></i>
          <input class="input" id="q" name="q" type="search" autocomplete="off" placeholder="Tên người, bài viết, sự kiện, việc làm">
        </div>
        <p class="field__hint">Gõ không dấu cũng được. Tìm "nguyen van" vẫn ra "Nguyễn Văn".</p>
      </div>
    </form>

    <div class="searchsum" data-sum></div>
    <div data-results></div>
  </section>`,
});

/* ------------------------------------------------------------------ TÀI KHOẢN */
PAGES.push({
  file: 'tai-khoan.html',
  title: 'Tài khoản của tôi | Mạng lưới Cựu sinh viên NEU',
  desc: 'Quản lý hồ sơ cá nhân, phạm vi công khai thông tin và danh sách sự kiện đã đăng ký trong mạng lưới cựu sinh viên NEU.',
  h1: 'Tài khoản của tôi',
  lede: 'Hồ sơ, phạm vi công khai và những sự kiện bạn đã đăng ký.',
  noindex: true,
  data: ['alumni', 'posts', 'events', 'albums', 'jobs', 'users'],
  js: ['account'],
  main: `  <div class="container section--tight" data-account></div>`,
});


/* ------------------------------------------------------------------ GIOI THIEU */
PAGES.push({
  file: 'gioi-thieu.html',
  title: 'Giới thiệu | Mạng lưới Cựu sinh viên NEU',
  desc: 'Giới thiệu chung, lịch sử phát triển và cơ cấu tổ chức của Mạng lưới Cựu sinh viên, học viên Đại học Kinh tế Quốc dân, cùng thông tin liên hệ.',
  h1: 'Giới thiệu',
  lede: 'Mạng lưới Cựu sinh viên, học viên Đại học Kinh tế Quốc dân.',
  data: ['alumni', 'posts', 'events', 'albums', 'jobs'],
  js: ['about'],
  main: "  <div class=\"container\" style=\"padding-block:var(--space-11)\">\n    <div class=\"shell\" style=\"grid-template-columns:minmax(0,1fr) 300px\">\n      <div class=\"prose\" data-about></div>\n      <aside class=\"filters\">\n        <div class=\"fgroup\">\n          <h2 class=\"fgroup__title\">Liên hệ</h2>\n          <div data-lienhe></div>\n        </div>\n        <div class=\"fgroup\">\n          <h2 class=\"fgroup__title\">Số liệu mạng lưới</h2>\n          <div data-about-stats></div>\n        </div>\n      </aside>\n    </div>\n  </div>",
});
/* --------------------------------------------------------------------- ADMIN */
PAGES.push({
  file: 'admin.html',
  title: 'Quản trị nội dung | Mạng lưới Cựu sinh viên NEU',
  desc: 'Khu vực quản trị nội dung của cổng thông tin cựu sinh viên Đại học Kinh tế Quốc dân.',
  noindex: true,
  raw: true,
  css: ['admin'],
  data: ['alumni', 'posts', 'events', 'albums', 'jobs', 'users', 'submissions'],
  js: ['admin'],
  main: '',
});

/* ==========================================================================
   GHI RA ĐĨA
   ========================================================================== */

let n = 0;
for (const p of PAGES) {
  if (p.raw) continue;                 /* admin.html được viết tay, xem bên dưới */
  fs.writeFileSync(path.join(ROOT, p.file), render(p));
  n++;
  console.log('  ' + p.file);
}
console.log('\nĐã sinh ' + n + ' trang.');

/* ==========================================================================
   SITEMAP

   Sinh cùng lúc với các trang, để một bài viết mới không bao giờ nằm ngoài
   sitemap chỉ vì có người quên chạy thêm một lệnh.
   ========================================================================== */

function sitemap() {
  const NL = String.fromCharCode(10);
  const hnay = new Date().toISOString().slice(0, 10);
  const doc = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data', f), 'utf8'));
  const posts = doc('posts.json'), events = doc('events.json'), albums = doc('albums.json');

  const tinh = [
    ['index.html', '1.0', 'daily'],
    ['tin-tuc.html', '0.9', 'daily'],
    ['cau-chuyen.html', '0.9', 'weekly'],
    ['alumni.html', '0.8', 'weekly'],
    ['ky-niem.html', '0.7', 'monthly'],
    ['su-kien.html', '0.9', 'daily'],
    ['nghe-nghiep.html', '0.9', 'daily'],
    ['dang-ky.html', '0.6', 'monthly'],
    ['dong-gop.html', '0.5', 'monthly'],
  ];

  const url = [];
  const them = (loc, pri, freq, mod) => url.push(
    '  <url><loc>' + SITE + loc + '</loc><lastmod>' + (mod || hnay) +
    '</lastmod><changefreq>' + freq + '</changefreq><priority>' + pri + '</priority></url>');

  tinh.forEach((p) => them(p[0], p[1], p[2]));
  posts.forEach((p) => them('bai-viet.html?slug=' + encodeURIComponent(p.slug), '0.7', 'monthly', p.ngay));
  events.forEach((e) => them('su-kien-chi-tiet.html?slug=' + encodeURIComponent(e.slug), '0.6', 'weekly'));
  albums.forEach((a) => them('album.html?slug=' + encodeURIComponent(a.slug), '0.5', 'monthly'));

  /* admin.html, tai-khoan.html, ho-so.html va tim-kiem.html deu mang the
     noindex nen co tinh khong dua vao sitemap. */

  var xml = '<?xml version="1.0" encoding="UTF-8"?>' + NL
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + NL
    + url.join(NL) + NL
    + '</urlset>' + NL;

  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);

  console.log('  sitemap.xml (' + url.length + ' URL)');
}

sitemap();
