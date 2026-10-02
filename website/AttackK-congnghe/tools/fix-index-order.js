const { init, call } = require('./mcp');

async function main() {
  await init();

  const res = await call('get_theme_file', { path: 'templates/index.json' });
  const data = JSON.parse(res.themeFile.content);

  // Set exact 10 sections order matching index.html
  data.order = [
    "hadal-hero",
    "hadal-services",
    "hadal-fresh",
    "hadal-spotlight",
    "hadal-categories",
    "hadal-best-sellers",
    "hadal-giveaway",
    "hadal-community",
    "hadal-press",
    "hadal-editorial"
  ];

  await call('upsert_theme_file', {
    path: 'templates/index.json',
    content: JSON.stringify(data, null, 2)
  });
  console.log('Updated templates/index.json to exact 10 sections');

  await call('clear_storefront_cache', {});
  console.log('Cache cleared!');
}

main().catch(console.error);

