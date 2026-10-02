const { init, call } = require('./mcp');
const https = require('https');

async function main() {
  await init();
  const content = `<div class="announce" data-announce-rotate style="background-color: {{ section.settings.bg_color | default: 'var(--surface-base, #0b0b0d)' }}; color: {{ section.settings.text_color | default: 'var(--text-muted, #94a3b8)' }}; border-bottom: 1px solid var(--border-hairline, rgba(255,255,255,0.08));">
  <span class="dot"></span>
  {% if request.locale.iso_code == 'en' %}
    <span data-announce-item style="min-width:380px;text-align:center;display:inline-block;">Free nationwide express shipping on orders over 1,500,000₫</span>
    <span data-announce-item style="display:none;min-width:380px;text-align:center;">R86 HE Pre-orders Open — HUANO Glass Jade Magnetic Switches</span>
    <span data-announce-item style="display:none;min-width:380px;text-align:center;">F1 AIR Ultralight 39g — 8000Hz Polling, PAW3950MAX Sensor</span>
    <span data-announce-item style="display:none;min-width:380px;text-align:center;">15-Day Hassle-Free Returns — 24-Month Genuine Warranty</span>
  {% else %}
    <span data-announce-item style="min-width:380px;text-align:center;display:inline-block;">Miễn phí vận chuyển toàn quốc cho đơn từ 1.500.000đ</span>
    <span data-announce-item style="display:none;min-width:380px;text-align:center;">R86 HE đang mở đặt trước — Switch từ tính HUANO Glass Jade</span>
    <span data-announce-item style="display:none;min-width:380px;text-align:center;">F1 AIR 39g siêu nhẹ — Polling 8000Hz, cảm biến PAW3950MAX</span>
    <span data-announce-item style="display:none;min-width:380px;text-align:center;">Đổi trả 15 ngày không cần lý do — Bảo hành chính hãng 24 tháng</span>
  {% endif %}
  <span class="dot"></span>
</div>
{% schema %}
{
  "name": "Announcement bar",
  "category": "header",
  "settings": [
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

  const res = await call('upsert_theme_file', {
    path: 'sections/announcement-bar.liquid',
    content: content
  });
  console.log('Upsert result:', JSON.stringify(res, null, 2));

  await call('clear_storefront_cache', {});
  console.log('Cache cleared!');

  // Now verify live home html
  https.get('https://hadal-peripherals.epodsystem.com/', (resp) => {
    let d = '';
    resp.on('data', c => d += c);
    resp.on('end', () => {
      const match = d.match(/<div[^>]*announcement-bar[\s\S]*?<\/div>\s*<\/div>/i);
      console.log('Live announcement bar HTML:');
      console.log(match ? match[0] : 'not matched, d slice: ' + d.slice(d.indexOf('announce'), d.indexOf('announce') + 400));
    });
  });
}

main().catch(console.error);

