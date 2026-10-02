const https = require('https');

const HOST = 'hadal-peripherals.epodsystem.com';

function get(path) {
  return new Promise((res) => {
    const req = https.request({ hostname: HOST, path, method: 'GET', timeout: 30000 }, (r) => {
      let s = '';
      r.on('data', c => s += c);
      r.on('end', () => {
        if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) {
          const next = r.headers.location.replace(/^https?:\/\/[^/]+/, '');
          return res(get(next));
        }
        res({ code: r.statusCode, body: s });
      });
    });
    req.on('error', (e) => res({ code: 0, body: '', err: e.message }));
    req.on('timeout', () => { req.destroy(); res({ code: 0, body: '', err: 'timeout' }); });
    req.end();
  });
}

const strip = (h) => h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
const VN = /[ăâđêôơưĂÂĐÊÔƠƯàáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ]/;

const SURFACES = [
  ['home', '/'],
  ['collection', '/collections/chuot-choi-game'],
  ['product', '/products/v2-air-paw3955max-ergonomic-wireless-gaming-mouse'],
  ['x3 product', '/products/hd-x3-wireless-gaming-mouse-paw3395'],
  ['blog index', '/blogs'],
  ['article', '/blogs/8k-mouse-polling-cpu-overhead-frame-rate-benchmark'],
  ['page', '/pages/cau-hoi-thuong-gap'],
  ['search', '/search?q=mouse'],
  ['cart', '/cart'],
  ['collections list', '/collections'],
];

async function main() {
  console.log('=== RUNNING FINAL AUDIT ===\n');
  const results = [];

  for (const [name, path] of SURFACES) {
    for (const lang of ['vi', 'en']) {
      const p = lang === 'en' ? '/en' + (path === '/' ? '' : path) : path;
      const r = await get(p);
      const m = strip(r.body);
      const h1Count = (m.match(/<h1[\s>]/gi) || []).length;
      const title = ((r.body.match(/<title>([^<]*)<\/title>/i) || [])[1] || '').trim();
      const oldBrand = /attack[\s_-]?shark/i.test(r.body);
      const darkPalette = /--paper:#000000/.test(r.body) || /--paper:\s*#000000/.test(r.body) || /background:\s*var\(--paper\)/.test(r.body);
      
      const vnLeaks = lang === 'en'
        ? [...new Set([...m.matchAll(/>([^<>]{3,70})</g)].map(x => x[1].trim()).filter(t => t && VN.test(t)))]
        : [];

      results.push({
        surface: name,
        lang,
        path: p,
        code: r.code,
        bytes: r.body.length,
        h1Count,
        title,
        oldBrand,
        darkPalette,
        vnLeaks
      });

      console.log(
        (r.code === 200 ? '  PASS ' : '  FAIL ') +
        String(r.code).padEnd(4) +
        lang.padEnd(3) +
        name.padEnd(18) +
        String(r.body.length).padStart(7) + 'b' +
        '  h1=' + h1Count +
        (oldBrand ? '  [OLD-BRAND]' : '') +
        (vnLeaks.length > 0 ? '  [VN-LEAKS: ' + vnLeaks.length + ']' : '') +
        '  "' + title.slice(0, 45) + '"'
      );
    }
  }

  console.log('\n=== AUDIT SUMMARY ===');
  const non200 = results.filter(r => r.code !== 200 && r.code !== 404);
  const badH1 = results.filter(r => r.h1Count !== 1 && r.code === 200);
  const withOldBrand = results.filter(r => r.oldBrand);
  const leaks = results.filter(r => r.lang === 'en' && r.vnLeaks.length > 0);

  console.log('Total surfaces tested :', results.length);
  console.log('Non-200 responses     :', non200.length ? non200.map(r => r.path + '(' + r.code + ')').join(', ') : 'None');
  console.log('Pages without 1 H1    :', badH1.length ? badH1.map(r => r.path + '(h1=' + r.h1Count + ')').join(', ') : 'None');
  console.log('Old brand name visible:', withOldBrand.length ? withOldBrand.map(r => r.path).join(', ') : 'None');
  console.log('EN pages with VN leaks:', leaks.length ? leaks.map(r => r.path + ' (' + r.vnLeaks.slice(0, 3).join(', ') + ')').join('; ') : 'None');
}

main().catch(console.error);

