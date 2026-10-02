/* Template trang mẫu áo: ảnh vòm + thông tin thuê + túi thử > lịch thuê > mẫu cùng bộ sưu tập */
module.exports = function ({ p, c, vnd, esc, bagButton }) {
  const extra = Math.round(p.price * 0.2);
  return `
    <section class="pd">
      <div class="container pd-grid">
        <figure class="arch pd-media"><img src="assets/img/${p.img}" width="700" height="1000" alt="${esc(p.alt)}" fetchpriority="high">${p.isNew ? '<span class="tag-new">Mới về</span>' : ""}</figure>
        <div class="pd-info">
          {{crumbs}}
          <p class="card-cat">${esc(c.name)} · ${esc(p.sub)}</p>
          <h1>${esc(p.name)}</h1>
          <p class="pd-price"><strong>${vnd(p.price)}</strong><span>thuê ${p.days} ngày${p.stock ? ` · có ${p.stock} bộ` : ""}</span></p>
          <p class="pd-desc">${esc(p.desc)}</p>
          <dl class="pd-spec">
            <div><dt>Chất liệu</dt><dd>${esc(p.fabric)}</dd></div>
            <div><dt>Màu</dt><dd>${p.colors.map(esc).join(", ")}</dd></div>
            <div><dt>Size còn</dt><dd class="sizes">${p.sizes.map((s) => `<span>${esc(s)}</span>`).join("")}</dd></div>
            <div><dt>Đặt cọc giữ đồ</dt><dd>${vnd(p.deposit)}, hoàn lại khi trả áo</dd></div>
            <div><dt>Thêm ngày</dt><dd>${vnd(extra)} mỗi ngày</dd></div>
          </dl>
          <div class="pd-actions">
            ${bagButton(p, "btn btn-primary btn-lg bag-btn")}
            <a class="text-link" href="chon-size.html">Chưa biết size? <i class="ph ph-arrow-right" aria-hidden="true"></i></a>
          </div>
          <ul class="pd-perks">
            <li><i class="ph ph-sparkle" aria-hidden="true"></i>Giặt hấp sạch, treo túi riêng</li>
            <li><i class="ph ph-scissors" aria-hidden="true"></i>Lên lai, bóp eo tạm miễn phí</li>
            <li><i class="ph ph-truck" aria-hidden="true"></i>Giao tận nhà nội thành từ 250.000đ</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section-tight">
      <div class="container">
        <div class="timeline" aria-label="Lịch thuê áo">
          <div class="tl-step"><span>Hôm nay</span><strong>Hẹn thử</strong><p>Thử tại tiệm, chọn size</p></div>
          <div class="tl-step"><span>Khi chốt</span><strong>Cọc 30%</strong><p>Tiệm giữ áo đúng ngày</p></div>
          <div class="tl-step"><span>Ngày trước</span><strong>Nhận áo</strong><p>Kèm cọc ${vnd(p.deposit)}</p></div>
          <div class="tl-step is-main"><span>Ngày mặc</span><strong>Diện áo</strong><p>Tự tin lên hình</p></div>
          <div class="tl-step"><span>Ngày sau</span><strong>Trả áo</strong><p>Nhận lại tiền cọc</p></div>
        </div>
      </div>
    </section>

    <section class="section section-soft">
      <div class="container">
        <div class="sec-head">
          <h2 class="h2">Cùng bộ sưu tập <em>${esc(c.name.toLowerCase())}</em></h2>
          <a class="text-link" href="${c.slug}.html">Xem tất cả <i class="ph ph-arrow-right" aria-hidden="true"></i></a>
        </div>
        {{products col="${p.col}" exclude="${p.slug}" limit="4" class="four"}}
      </div>
    </section>
`;
};
