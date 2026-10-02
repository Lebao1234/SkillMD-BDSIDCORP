const { init, call } = require('./mcp');

async function main() {
  await init();
  const files = [
    'sections/header.liquid',
    'sections/footer.liquid',
    'sections/hadal-hero.liquid',
    'sections/hadal-services.liquid',
    'sections/hadal-fresh.liquid',
    'sections/hadal-spotlight.liquid',
    'sections/hadal-categories.liquid',
    'sections/hadal-best-sellers.liquid',
    'sections/hadal-giveaway.liquid',
    'sections/hadal-community.liquid',
    'sections/hadal-press.liquid',
    'sections/hadal-editorial.liquid'
  ];

  for (const f of files) {
    const res = await call('get_theme_file', { path: f });
    const content = res.themeFile ? res.themeFile.content : '';
    console.log(`=== ${f} (${content.length} chars) ===`);
    const lines = content.split('\n');
    console.log('First 5 lines:\n' + lines.slice(0, 5).join('\n'));
  }
}

main().catch(console.error);

