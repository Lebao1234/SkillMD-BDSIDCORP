const { init, call } = require('./mcp');

async function main() {
  await init();

  const indexDoc = {
    order: [
      'hadal-hero',
      'hadal-services',
      'hadal-fresh',
      'hadal-spotlight',
      'hadal-categories',
      'hadal-best-sellers',
      'hadal-giveaway',
      'hadal-community',
      'hadal-press',
      'hadal-editorial',
      'hadal-cta'
    ],
    sections: {
      'hadal-hero': { type: 'hadal-hero', settings: {} },
      'hadal-services': { type: 'hadal-services', settings: {} },
      'hadal-fresh': { type: 'hadal-fresh', settings: {} },
      'hadal-spotlight': { type: 'hadal-spotlight', settings: {} },
      'hadal-categories': { type: 'hadal-categories', settings: {} },
      'hadal-best-sellers': { type: 'hadal-best-sellers', settings: {} },
      'hadal-giveaway': { type: 'hadal-giveaway', settings: {} },
      'hadal-community': { type: 'hadal-community', settings: {} },
      'hadal-press': { type: 'hadal-press', settings: {} },
      'hadal-editorial': { type: 'hadal-editorial', settings: {} },
      'hadal-cta': { type: 'hadal-cta', settings: {} }
    }
  };

  const res = await call('upsert_theme_file', {
    theme_id: '2898',
    path: 'templates/index.json',
    content: JSON.stringify(indexDoc, null, 2)
  });

  console.log('Update templates/index.json result:', JSON.stringify(res, null, 2));

  await call('clear_storefront_cache', {});
  console.log('Storefront cache cleared!');
}

main().catch(console.error);
