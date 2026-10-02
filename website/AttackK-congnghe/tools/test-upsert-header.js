const { init, call } = require('./mcp');
const fs = require('fs');

async function main() {
  await init();
  const testContent = `<header class="header" data-header>
  <div class="wrap header__bar">
    <h1>Test Header</h1>
  </div>
</header>
{% schema %}
{
  "name": "Header",
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

  console.log('Calling upsert_theme_file...');
  const res = await call('upsert_theme_file', {
    path: 'sections/header.liquid',
    content: testContent
  });
  console.log('Result:', JSON.stringify(res, null, 2));

  console.log('Now checking get_theme_file...');
  const getRes = await call('get_theme_file', { path: 'sections/header.liquid' });
  console.log('Content starts with:', getRes.themeFile ? getRes.themeFile.content.slice(0, 100) : 'None');
}

main().catch(console.error);

