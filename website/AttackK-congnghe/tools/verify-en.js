const https = require('https');

https.get('https://hadal-peripherals.epodsystem.com/en', (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.log('Homepage /en status:', res.statusCode, 'Length:', d.length);

    const sections = [
      'section-announcement-bar',
      'section-header',
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
      'hadal-cta',
      'section-footer'
    ];

    console.log('\n--- VERIFYING SECTIONS ON /en HOMEPAGE ---');
    for (const s of sections) {
      const found = d.includes(s);
      console.log((found ? '  [PRESENT] ' : '  [MISSING] ') + s);
    }

    const title = (d.match(/<title>([^<]*)<\/title>/i) || [])[1];
    console.log('\nEnglish Homepage Title:', title);
  });
});

