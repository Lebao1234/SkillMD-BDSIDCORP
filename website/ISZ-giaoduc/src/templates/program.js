/* Template trang chương trình: hero có ô chữ điền > số liệu > dành cho ai + cam kết > các khóa > một buổi học > lớp sắp mở > giáo viên > hỏi đáp > chương trình khác */
module.exports = function ({ p, others, faqList, programCard, sessionBar, teacherRail, money, esc, arrow, btnIco, tzg }) {
  const hasFee = p.levels.some((l) => l.fee);
  const hasWords = p.levels.some((l) => l.words);
  const total = p.sessionTotal || p.session.reduce((s, x) => s + x[1], 0);
  return `
    <section class="phero">
      <div class="container phero-grid">
        <div class="phero-text">
          {{crumbs}}
          <p class="eyebrow">${esc(p.tag)}</p>
          <h1>${esc(p.name)}</h1>
          <p class="lead">${esc(p.lead)}</p>
          <div class="row-actions">
            <button class="btn btn-primary btn-lg" type="button" data-open-reg data-program="${esc(p.name)}">${p.key === "doanh-nghiep" ? "Nhận đề xuất đào tạo" : "Đăng ký học thử"}${btnIco}</button>
            <a class="text-link" href="#lop-sap-mo">Lớp sắp khai giảng ${arrow("down")}</a>
          </div>
        </div>
        <div class="phero-media">
          <figure class="bezel phero-photo"><div class="bezel-core"><img src="assets/img/${p.heroImage}" width="1600" height="1067" alt="" fetchpriority="high"></div></figure>
          <div class="phero-char">
            ${tzg(p.hanzi, { cls: "tzg-md", attrs: ` data-hanzi="${p.hanzi}" data-hanzi-loop` })}
            <p><span class="phero-py">${p.pinyin}</span><span>${esc(p.meaning)}</span></p>
          </div>
        </div>
      </div>
      <div class="container">
        <dl class="facts">${p.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
      </div>
    </section>

    <section class="section">
      <div class="container split split-who">
        <div class="split-side">
          <p class="eyebrow">Dành cho ai</p>
          <h2>Chương trình này <em>hợp với bạn</em> nếu</h2>
          <ul class="who">${p.who.map((w) => `<li><i class="ph ph-check" aria-hidden="true"></i>${esc(w)}</li>`).join("")}</ul>
        </div>
        <div class="obento">${p.outcomes.map(([ic, t, d], i) => `<article class="obox reveal${i === 0 ? " is-wide" : ""}"><i class="ph ${ic}" aria-hidden="true"></i><h3>${esc(t)}</h3><p>${esc(d)}</p></article>`).join("")}</div>
      </div>
    </section>

    <section class="section section-tint">
      <div class="container">
        <div class="section-head"><p class="eyebrow">Lộ trình</p><h2>${p.levels.length} chặng, <em>đi theo thứ tự</em></h2></div>
        <ol class="levels">${p.levels.map((l, i) => `<li class="level reveal">
            <span class="level-no">${String(i + 1).padStart(2, "0")}</span>
            <div class="level-main"><h3>${esc(l.name)}</h3><p>${esc(l.outcome)}</p></div>
            <dl class="level-facts">
              ${l.weeks ? `<div><dt>Thời lượng</dt><dd>${l.weeks} tuần</dd></div>` : ""}
              ${l.sessions ? `<div><dt>Số buổi</dt><dd>${l.sessions}</dd></div>` : ""}
              ${hasWords && l.words ? `<div><dt>Từ vựng</dt><dd>${l.words.toLocaleString("de-DE")}</dd></div>` : ""}
              ${hasFee && l.fee ? `<div><dt>Học phí</dt><dd>${money(l.fee)}</dd></div>` : ""}
            </dl>
          </li>`).join("")}</ol>
        ${hasFee ? `<p class="fine">Học phí đã gồm giáo trình, tài khoản ứng dụng ISZ và các bài thi thử. Đóng trọn 2 khóa liền nhau giảm thêm 5%.</p>` : p.key === "thu-phap" ? `<p class="fine">Học phí trọn khóa ${esc(p.facts[3][1])}, đã gồm bút, mực, giấy và triện tên.</p>` : `<p class="fine">Học phí tính theo số người, số buổi và địa điểm. Buổi khảo sát và kiểm tra đầu vào miễn phí.</p>`}
      </div>
    </section>

    <section class="section">
      <div class="container split split-session">
        <div class="split-side">
          <p class="eyebrow">Một buổi học</p>
          <h2>${total} phút <em>trôi qua thế nào</em></h2>
          <p>Mỗi buổi đi theo cùng một nhịp để bạn biết lúc nào nghe, lúc nào nói. Giáo viên ghi lại lỗi phát âm của từng người và gửi bài bù trên ứng dụng.</p>
        </div>
        ${sessionBar(p, "sb-" + p.key)}
      </div>
    </section>

    <section class="section section-tint" id="lop-sap-mo">
      <div class="container">
        <div class="section-head section-head-row"><div><p class="eyebrow">Lịch khai giảng</p><h2>Lớp <em>sắp mở</em></h2></div><a class="text-link" href="lich-khai-giang.html?ct=${p.key}">Cả lịch khai giảng ${arrow()}</a></div>
        {{classes program="${p.key}" limit="5"}}
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head section-head-row"><div><p class="eyebrow">Giáo viên</p><h2>Người <em>đứng lớp</em></h2></div><a class="text-link" href="ve-isz.html#gvall-title">Cả đội ngũ ISZ ${arrow()}</a></div>
        ${teacherRail(p.teachers, "grid")}
      </div>
    </section>

    <section class="section section-tint">
      <div class="container split split-faq">
        <div class="split-side">
          <p class="eyebrow">Hỏi đáp</p>
          <h2>Câu hỏi <em>hay gặp</em></h2>
          <p>Chưa thấy câu bạn cần? Gọi <a href="tel:{{hotline-tel}}">{{hotline}}</a> hoặc xem <a href="cau-hoi-thuong-gap.html">toàn bộ hỏi đáp</a>.</p>
        </div>
        ${faqList(p.faq)}
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head section-head-row"><div><p class="eyebrow">Chương trình khác</p><h2>Có thể bạn <em>cũng cần</em></h2></div><a class="text-link" href="chuong-trinh.html">So sánh 6 chương trình ${arrow()}</a></div>
        <div class="pgrid pgrid-3">${others.slice(0, 3).map(programCard).join("")}</div>
      </div>
    </section>`;
};
