const https = require('https');

https.get('https://hadal-peripherals.epodsystem.com/products/x3-wireless-gaming-mouse-paw3395-superlight', (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Old brand in page?', /attack[\s_-]?shark/i.test(d));
    const title = (d.match(/<title>([^<]*)<\/title>/i) || [])[1];
    console.log('Title:', title);
    const hasCleanImage = d.includes('nnjfkx9');
    console.log('Has clean image nnjfkx9?', hasCleanImage);
  });
});

