/* Template trang bộ sưu tập theo dịp: hero vòm cửa > lọc theo nhóm con > lưới mẫu > 3 lưu ý > hỏi đáp > dịp khác */
module.exports = function ({ c, count, subs, collections, faqList, esc }) {
  const others = collections.filter((x) => x.key !== c.key);
  return `
    <section class="col-hero">
      <div class="container col-hero-grid">
        <div>
          {{crumbs}}
          <p class="eyebrow-no">${c.no} / 07</p>
          <h1>${esc(c.title)}, <em>${esc(c.titleEm)}</em></h1>
          <p class="lead">${esc(c.lead)}</p>
          <p class="col-facts"><span>${count} mẫu</span><span>${esc(c.price)}</span><span>Thử miễn phí</span></p>
        </div>
        <div class="arch-pair">
          <figure class="arch arch-lg"><img src="assets/img/${c.image}" width="700" height="1000" alt="" fetchpriority="high"></figure>
          <figure class="arch arch-sm"><img src="assets/img/${c.cover}" width="700" height="1000" alt="" loading="lazy"></figure>
        </div>
      </div>
    </section>

    <section class="section-tight" data-filter-scope data-filter-key="sub">
      <div class="container">
        <div class="filter-bar">
          <div class="filter" role="group" aria-label="Lọc theo kiểu" data-filter${subs.length < 2 ? " hidden" : ""}>
            <button class="chip is-active" type="button" data-filter-value="all" aria-pressed="true">Tất cả</button>
            ${subs.map((s) => `<button class="chip" type="button" data-filter-value="${esc(s)}" aria-pressed="false">${esc(s)}</button>`).join("")}
          </div>
          <label class="sort"><span>Sắp xếp</span><select data-sort><option value="default">Mới nhất</option><option value="asc">Giá thấp đến cao</option><option value="desc">Giá cao đến thấp</option></select></label>
        </div>
        {{products col="${c.key}"}}
        <p class="empty" data-empty hidden>Chưa có mẫu trong nhóm này. <a href="dat-lich.html">Hẹn thử áo</a> để tiệm giới thiệu mẫu sắp về.</p>
        <p class="note">Ảnh minh họa. Giá thuê đã gồm giặt hấp, chưa gồm tiền đặt cọc giữ đồ.</p>
      </div>
    </section>

    <section class="section section-soft">
      <div class="container">
        <h2 class="h2">Khi thuê ${esc(c.name.toLowerCase())} <em>ở tiệm</em></h2>
        <ol class="notes">
          ${c.notes.map(([t, d], i) => `<li class="reveal"><span>0${i + 1}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join("\n          ")}
        </ol>
      </div>
    </section>

    <section class="section">
      <div class="container faq-split">
        <div class="faq-side">
          <h2 class="h2">Hỏi nhanh <em>về ${esc(c.short.toLowerCase())}</em></h2>
          <p class="muted">Cần tư vấn riêng? Nhắn <a href="{{zalo}}" target="_blank" rel="noopener">Zalo</a> hoặc gọi <a href="tel:{{hotline-tel}}">{{hotline}}</a>.</p>
        </div>
        ${faqList(c.faq)}
      </div>
    </section>

    <section class="section section-soft">
      <div class="container">
        <h2 class="h2">Các dịp <em>khác</em></h2>
        <ul class="other-cols">
          ${others.map((o) => `<li><a href="${o.slug}.html"><figure class="arch"><img src="assets/img/${o.image}" width="700" height="1000" alt="" loading="lazy"></figure><span>${o.no}</span><strong>${esc(o.name)}</strong></a></li>`).join("\n          ")}
        </ul>
      </div>
    </section>
`;
};
