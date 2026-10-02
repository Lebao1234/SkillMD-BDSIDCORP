const { init, call } = require('./mcp');

async function main() {
  await init();
  const list = [
    'sections/hadal-spotlight.liquid',
    'sections/hadal-categories.liquid',
    'sections/hadal-giveaway.liquid',
    'sections/hadal-community.liquid',
    'sections/hadal-press.liquid',
    'sections/hadal-editorial.liquid'
  ];
  for (const p of list) {
    const res = await call('get_theme_file', { path: p });
    console.log(`\n================== ${p} ==================`);
    console.log(res.themeFile ? res.themeFile.content.slice(0, 800) : 'NOT FOUND');
  }
}

main().catch(console.error);

