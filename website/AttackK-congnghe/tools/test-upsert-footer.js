const { init, call } = require('./mcp');
const fs = require('fs');

async function main() {
  await init();
  const testContent = `<footer class="footer">
  <div class="wrap">
    <p>Test Footer</p>
  </div>
</footer>
{% schema %}
{
  "name": "Footer",
  "category": "footer",
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

  console.log('Calling upsert_theme_file for footer...');
  const res = await call('upsert_theme_file', {
    path: 'sections/footer.liquid',
    content: testContent
  });
  console.log('Footer Result:', JSON.stringify(res, null, 2));
}

main().catch(console.error);

