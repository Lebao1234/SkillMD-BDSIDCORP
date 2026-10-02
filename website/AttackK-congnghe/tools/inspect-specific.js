const { init, call } = require('./mcp');
const fs = require('fs');

async function main() {
  await init();
  const list = ['sections/header.liquid', 'sections/footer.liquid', 'sections/hadal-fresh.liquid', 'sections/hadal-best-sellers.liquid'];
  for (const p of list) {
    const res = await call('get_theme_file', { path: p });
    console.log(`\n================== ${p} ==================`);
    console.log(res.themeFile ? res.themeFile.content.slice(0, 1500) : 'NOT FOUND');
  }
}

main().catch(console.error);

