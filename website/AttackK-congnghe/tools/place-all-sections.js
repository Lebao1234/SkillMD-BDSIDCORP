const { init, call } = require('./mcp');

async function main() {
  await init();

  const sections = [
    { section_id: 'hadal-hero', type: 'hadal-hero' },
    { section_id: 'hadal-services', type: 'hadal-services' },
    { section_id: 'hadal-fresh', type: 'hadal-fresh' },
    { section_id: 'hadal-spotlight', type: 'hadal-spotlight' },
    { section_id: 'hadal-categories', type: 'hadal-categories' },
    { section_id: 'hadal-best-sellers', type: 'hadal-best-sellers' },
    { section_id: 'hadal-giveaway', type: 'hadal-giveaway' },
    { section_id: 'hadal-community', type: 'hadal-community' },
    { section_id: 'hadal-press', type: 'hadal-press' },
    { section_id: 'hadal-editorial', type: 'hadal-editorial' },
    { section_id: 'hadal-cta', type: 'hadal-cta' },
  ];

  for (let i = 0; i < sections.length; i++) {
    const s = sections[i];
    console.log(`Setting section ${i}: ${s.section_id} (${s.type})...`);
    const r = await call('set_section_settings', {
      template: 'index',
      section_id: s.section_id,
      type: s.type,
      settings: {},
      position: i,
      theme_id: '2898'
    });
    console.log('Result:', JSON.stringify(r).slice(0, 160));
  }

  // Remove old unwanted sections from templates/index.json if any
  const r = await call('get_theme_file', { theme_id: '2898', path: 'templates/index.json' });
  if (r && r.themeFile && r.themeFile.content) {
    const doc = JSON.parse(r.themeFile.content);
    console.log('\nCurrent template order:', doc.order);
    const validIds = new Set(sections.map(s => s.section_id));
    const oldIds = Object.keys(doc.sections || {}).filter(k => !validIds.has(k));
    if (oldIds.length > 0) {
      console.log('Removing old section IDs:', oldIds);
      oldIds.forEach(id => delete doc.sections[id]);
      doc.order = doc.order.filter(id => validIds.has(id));
      await call('upsert_theme_file', {
        theme_id: '2898',
        path: 'templates/index.json',
        content: JSON.stringify(doc, null, 2)
      });
      console.log('Cleaned order:', doc.order);
    }
  }

  await call('clear_storefront_cache', {});
  console.log('Done! Cache cleared.');
}

main().catch(console.error);

