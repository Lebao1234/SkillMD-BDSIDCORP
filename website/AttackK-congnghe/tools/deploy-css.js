const { init, call } = require('./mcp');
const fs = require('fs');

async function main() {
  await init();

  // Combine CSS files
  const tokens = fs.readFileSync('assets/css/tokens.css', 'utf8');
  const base = fs.readFileSync('assets/css/base.css', 'utf8');
  const comp = fs.readFileSync('assets/css/components.css', 'utf8');
  const layout = fs.readFileSync('assets/css/layout.css', 'utf8');
  const pages = fs.readFileSync('assets/css/pages.css', 'utf8');

  // Let's add the Google Fonts import at top
  const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');\n\n`;

  // Additional compatibility rules for Epod theme header and footer
  const epodCompat = `
/* Epod chrome compatibility */
.be-wrap { max-width: 1240px; margin: 0 auto; padding: 0 var(--space-6, 24px); }
.py-section { padding: var(--section-y, 80px) 0; }
.section--tight { padding: 48px 0; }
`;

  const fullCss = fontImport + tokens + '\n' + base + '\n' + comp + '\n' + layout + '\n' + pages + '\n' + epodCompat;

  console.log('Total CSS to upload:', fullCss.length, 'bytes');

  const res = await call('upsert_theme_file', {
    path: 'assets/theme-skin.css',
    content: fullCss
  });

  console.log('Result:', JSON.stringify(res, null, 2));

  await call('clear_storefront_cache', {});
  console.log('Cache cleared!');
}

main().catch(console.error);

