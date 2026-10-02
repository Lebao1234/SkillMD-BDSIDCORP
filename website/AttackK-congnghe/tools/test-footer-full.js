const { init, call } = require('./mcp');

const footerContent = `<footer class="footer">
  <div class="footer__news">
    <div class="wrap footer__news-inner">
      <div class="stack stack-4">
        <h2 class="footer__news-title">{% if request.locale.iso_code == 'en' %}Get the HADAL dispatch{% else %}Đăng ký nhận tin từ HADAL{% endif %}</h2>
        <p class="muted">{% if request.locale.iso_code == 'en' %}Firmware drops, pre-order windows and hardware reviews. No marketing spam.{% else %}Thông báo mở bán sớm, cập nhật firmware và bài viết kỹ thuật. Không thư rác, hủy bất cứ lúc nào.{% endif %}</p>
      </div>
      <form class="newsform" data-newsletter action="#" method="POST" novalidate>
        <div class="field">
          <label class="field__label visually-hidden" for="news-email">Email</label>
          <div class="newsform__row">
            <input class="input" type="email" id="news-email" name="email" placeholder="{% if request.locale.iso_code == 'en' %}your@email.com{% else %}ten@vidu.com{% endif %}" autocomplete="email" required>
            <button class="btn btn--primary" type="submit">{% if request.locale.iso_code == 'en' %}Subscribe{% else %}Đăng ký{% endif %}</button>
          </div>
          <p class="field__help">{% if request.locale.iso_code == 'en' %}Zero spam. One email every two weeks. Unsubscribe anytime.{% else %}Không spam. Tối đa 1 email mỗi hai tuần. Hủy đăng ký bất cứ lúc nào.{% endif %}</p>
        </div>
      </form>
    </div>
  </div>

  <div class="footer__main">
    <div class="wrap">
      <div class="footer__cols">
        <div class="footer__about">
          <a class="brand" href="/" aria-label="{{ shop.name | default: 'HADAL' }}">
            <span class="brand__mark">
              <svg class="mark" width="34" height="34" viewBox="0 0 32 32" fill="none" role="img" aria-hidden="true" focusable="false">
                <path d="M10.6 3h10.8L29 10.6v10.8L21.4 29H10.6L3 21.4V10.6z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M10.5 12.6h11M12.6 17h6.8M15.2 21.4h1.6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="brand__word">
              {{ shop.name | default: 'HADAL' }}
              <span class="brand__descriptor">PRECISION HARDWARE</span>
            </span>
          </a>
          <p class="muted text-md">{% if request.locale.iso_code == 'en' %}High-precision gaming peripherals engineered for competitive players demanding minimum latency and repeatable actuation.{% else %}Thiết bị ngoại vi độ chính xác cao cho người chơi đòi hỏi độ trễ thấp nhất và hành trình phím chuẩn xác.{% endif %}</p>
          <div class="footer__socials">
            <a class="footer__social" href="https://www.facebook.com/" target="_blank" rel="noopener" aria-label="HADAL on Facebook"><i class="ph-light ph-facebook-logo" aria-hidden="true"></i></a>
            <a class="footer__social" href="https://x.com/" target="_blank" rel="noopener" aria-label="HADAL on X"><i class="ph-light ph-x-logo" aria-hidden="true"></i></a>
            <a class="footer__social" href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="HADAL on Instagram"><i class="ph-light ph-instagram-logo" aria-hidden="true"></i></a>
            <a class="footer__social" href="https://www.youtube.com/" target="_blank" rel="noopener" aria-label="HADAL on YouTube"><i class="ph-light ph-youtube-logo" aria-hidden="true"></i></a>
            <a class="footer__social" href="https://www.tiktok.com/" target="_blank" rel="noopener" aria-label="HADAL on TikTok"><i class="ph-light ph-tiktok-logo" aria-hidden="true"></i></a>
            <a class="footer__social" href="https://discord.com/" target="_blank" rel="noopener" aria-label="HADAL on Discord"><i class="ph-light ph-discord-logo" aria-hidden="true"></i></a>
          </div>
        </div>

        <div>
          <p class="footer__colhead">{% if request.locale.iso_code == 'en' %}Products{% else %}Sản phẩm{% endif %}</p>
          <ul class="footer__list">
            <li><a href="/collections/chuot-choi-game">{% if request.locale.iso_code == 'en' %}Gaming Mice{% else %}Chuột chơi game{% endif %}</a></li>
            <li><a href="/collections/ban-phim-co">{% if request.locale.iso_code == 'en' %}Mechanical Keyboards{% else %}Bàn phím cơ{% endif %}</a></li>
            <li><a href="/collections/ban-phim-he">{% if request.locale.iso_code == 'en' %}Magnetic HE Keyboards{% else %}Bàn phím từ tính HE{% endif %}</a></li>
            <li><a href="/collections/tai-nghe">{% if request.locale.iso_code == 'en' %}Gaming Headsets{% else %}Tai nghe gaming{% endif %}</a></li>
            <li><a href="/collections/lot-chuot">{% if request.locale.iso_code == 'en' %}Mousepads{% else %}Lót chuột chuyên dụng{% endif %}</a></li>
            <li><a href="/collections/combo">{% if request.locale.iso_code == 'en' %}Value Bundles{% else %}Combo tiết kiệm{% endif %}</a></li>
          </ul>
        </div>

        <div>
          <p class="footer__colhead">{% if request.locale.iso_code == 'en' %}Support{% else %}Hỗ trợ{% endif %}</p>
          <ul class="footer__list">
            <li><a href="/pages/downloads">{% if request.locale.iso_code == 'en' %}Drivers & Software{% else %}Tải driver & phần mềm{% endif %}</a></li>
            <li><a href="/pages/shipping">{% if request.locale.iso_code == 'en' %}Shipping Policy{% else %}Chính sách vận chuyển{% endif %}</a></li>
            <li><a href="/pages/returns">{% if request.locale.iso_code == 'en' %}15-Day Returns{% else %}Đổi trả 15 ngày{% endif %}</a></li>
            <li><a href="/pages/warranty">{% if request.locale.iso_code == 'en' %}24-Month Warranty{% else %}Bảo hành 24 tháng{% endif %}</a></li>
            <li><a href="/pages/faq">{% if request.locale.iso_code == 'en' %}FAQ{% else %}Câu hỏi thường gặp{% endif %}</a></li>
            <li><a href="/pages/contact">{% if request.locale.iso_code == 'en' %}Contact Us{% else %}Liên hệ hỗ trợ{% endif %}</a></li>
          </ul>
        </div>

        <div>
          <p class="footer__colhead">{% if request.locale.iso_code == 'en' %}HADAL{% else %}HADAL{% endif %}</p>
          <ul class="footer__list">
            <li><a href="/pages/about">{% if request.locale.iso_code == 'en' %}About Us{% else %}Về chúng tôi{% endif %}</a></li>
            <li><a href="/pages/affiliate">{% if request.locale.iso_code == 'en' %}Affiliate Program{% else %}Tiếp thị liên kết{% endif %}</a></li>
            <li><a href="/pages/creators">{% if request.locale.iso_code == 'en' %}For Creators{% else %}Dành cho Creator{% endif %}</a></li>
            <li><a href="/blogs/news">{% if request.locale.iso_code == 'en' %}News & Updates{% else %}Tin tức & Cập nhật{% endif %}</a></li>
            <li><a href="/blogs/guides">{% if request.locale.iso_code == 'en' %}Knowledge & Benchmarks{% else %}Cẩm nang & Đo lường{% endif %}</a></li>
            <li><a href="/blogs/reviews">{% if request.locale.iso_code == 'en' %}Community Reviews{% else %}Đánh giá từ cộng đồng{% endif %}</a></li>
          </ul>
        </div>

        <div>
          <p class="footer__colhead">{% if request.locale.iso_code == 'en' %}Account{% else %}Tài khoản{% endif %}</p>
          <ul class="footer__list">
            <li><a href="/account">{% if request.locale.iso_code == 'en' %}Sign In{% else %}Đăng nhập{% endif %}</a></li>
            <li><a href="/account">{% if request.locale.iso_code == 'en' %}Register{% else %}Đăng ký thành viên{% endif %}</a></li>
            <li><a href="/account">{% if request.locale.iso_code == 'en' %}Order History{% else %}Lịch sử đơn hàng{% endif %}</a></li>
            <li><a href="/pages/wishlist">{% if request.locale.iso_code == 'en' %}Wishlist{% else %}Danh sách yêu thích{% endif %}</a></li>
            <li><a href="/pages/compare">{% if request.locale.iso_code == 'en' %}Product Compare{% else %}So sánh sản phẩm{% endif %}</a></li>
            <li><a href="/cart">{% if request.locale.iso_code == 'en' %}Shopping Cart{% else %}Giỏ hàng{% endif %}</a></li>
          </ul>
        </div>
      </div>

      <div class="footer__stores">
        <a class="footer__store" href="#">United Kingdom</a>
        <a class="footer__store" href="#">Deutschland</a>
        <a class="footer__store" href="#">Japan</a>
        <a class="footer__store" href="#">Canada</a>
        <a class="footer__store" href="#">France</a>
        <a class="footer__store" href="#">Korea</a>
        <a class="footer__store" href="#">Brasil</a>
        <a class="footer__store" href="#">España</a>
        <a class="footer__store" href="#">Italia</a>
      </div>

      <div class="footer__legal">
        <p>{% if request.locale.iso_code == 'en' %}HADAL is an independent hardware brand specializing in low-latency peripherals for competitive gaming. Products engineered for repeatability.{% else %}HADAL là thương hiệu ngoại vi độc lập chuyên nghiên cứu thiết bị độ trễ cực thấp cho game thủ thi đấu. Mọi sản phẩm được tinh chỉnh cho độ chính xác lặp lại.{% endif %}</p>
        <div class="paylist">
          <span>VISA</span>
          <span>MASTERCARD</span>
          <span>AMEX</span>
          <span>PAYPAL</span>
          <span>APPLE PAY</span>
          <span>MOMO</span>
          <span>VNPAY</span>
        </div>
      </div>

      <div class="footer__legal">
        <span>&copy; {{ 'now' | date: '%Y' }} HADAL Peripherals. {% if request.locale.iso_code == 'en' %}All rights reserved.{% else %}Bảo lưu mọi quyền.{% endif %}</span>
        <div class="footer__legal-links">
          <a href="mailto:support@hadal.gg">support@hadal.gg</a>
          <a href="/pages/privacy">{% if request.locale.iso_code == 'en' %}Privacy Policy{% else %}Chính sách quyền riêng tư{% endif %}</a>
          <a href="/pages/terms">{% if request.locale.iso_code == 'en' %}Terms of Service{% else %}Điều khoản dịch vụ{% endif %}</a>
          <a href="/pages/cookies">{% if request.locale.iso_code == 'en' %}Cookie Preferences{% else %}Chính sách cookie{% endif %}</a>
        </div>
      </div>
    </div>
  </div>
</footer>
{% schema %}
{
  "name": "Footer",
  "category": "footer",
  "settings": [
    {"type":"textarea","id":"blurb","label":"Giới thiệu ngắn","default":"Thiết bị nhập liệu cho người chơi đo trước khi tin. Chuột siêu nhẹ, bàn phím từ tính và phụ kiện dựng cho độ chính xác lặp lại."},
    {"type":"header","label":"Style"},
    {"type":"checkbox","id":"visible","label":"Visible","default":true},
    {"type":"color","id":"bg_color","label":"Background color"},
    {"type":"color","id":"text_color","label":"Text color"},
    {"type":"color","id":"heading_color","label":"Heading color"},
    {"type":"text","id":"padding_top","label":"Padding top (CSS)"},
    {"type":"text","id":"padding_bottom","label":"Padding bottom (CSS)"},
    {"type":"color","id":"border_color","label":"Border color"},
    {"type":"range","id":"border_width","label":"Border width","min":0,"max":8,"step":1,"unit":"px","default":0},
    {"type":"range","id":"border_radius","label":"Border radius","min":0,"max":48,"step":1,"unit":"px","default":0}
  ]
}
{% endschema %}`;

async function main() {
  await init();
  const res = await call('upsert_theme_file', {
    path: 'sections/footer.liquid',
    content: footerContent
  });
  console.log('Result:', JSON.stringify(res, null, 2));
}

main().catch(console.error);

