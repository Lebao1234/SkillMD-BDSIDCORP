const https = require('https');

https.get('https://hadal-peripherals.epodsystem.com/', { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Find header
    const hIdx = data.indexOf('<header');
    const hEnd = data.indexOf('</header>');
    console.log('=== LIVE HEADER ===');
    console.log(data.slice(hIdx, hEnd + 9));

    // Find footer
    const fIdx = data.indexOf('<footer');
    const fEnd = data.indexOf('</footer>');
    console.log('\n=== LIVE FOOTER ===');
    console.log(data.slice(fIdx, fEnd + 9));
  });
});

