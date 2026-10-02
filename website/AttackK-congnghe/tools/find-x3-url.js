const https = require('https');

https.get('https://hadal-peripherals.epodsystem.com/collections/chuot-choi-game', (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const matches = [...d.matchAll(/href="(\/products\/[^"]+)"/g)].map(m => m[1]);
    const x3 = matches.find(m => m.includes('x3'));
    console.log('X3 link found:', x3);
    console.log('First 5 product links:', matches.slice(0, 5));
  });
});

