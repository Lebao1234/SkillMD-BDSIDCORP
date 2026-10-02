const https = require('https');

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, html: data }));
    }).on('error', reject);
  });
}

async function main() {
  console.log('=== VERIFYING LIVE STOREFRONT ===\n');

  // 1. Vietnamese home
  const viRes = await fetchPage('https://hadal-peripherals.epodsystem.com/');
  console.log(`[VI] Status: ${viRes.status}, Length: ${viRes.html.length} bytes`);

  // Title check
  const viTitleMatch = viRes.html.match(/<title>([^<]+)<\/title>/i);
  console.log('[VI] Title:', viTitleMatch ? viTitleMatch[1].trim() : 'N/A');

  // 2. English home
  const enRes = await fetchPage('https://hadal-peripherals.epodsystem.com/en');
  console.log(`[EN] Status: ${enRes.status}, Length: ${enRes.html.length} bytes`);

  const enTitleMatch = enRes.html.match(/<title>([^<]+)<\/title>/i);
  console.log('[EN] Title:', enTitleMatch ? enTitleMatch[1].trim() : 'N/A');

  // 3. Structure assertions on VI HTML
  const checks = [
    // Header
    { name: 'Header tag (.header)', re: /<header[^>]*class="[^"]*header[^"]*"/i },
    { name: 'Header bar (.header__bar)', re: /class="[^"]*header__bar[^"]*"/i },
    { name: 'Burger button (.burger)', re: /class="[^"]*burger[^"]*"/i },
    { name: 'Brand lockup (.brand)', re: /class="[^"]*brand[^"]*"/i },
    { name: 'Mega catalog button (.catbtn)', re: /class="[^"]*catbtn[^"]*"/i },
    { name: 'Mega menu dropdown (#mega-catalog)', re: /id="mega-catalog"/i },
    { name: 'Quicknav shortcuts (.quicknav)', re: /class="[^"]*quicknav[^"]*"/i },
    { name: 'Inline search (.hsearch)', re: /class="[^"]*hsearch[^"]*"/i },
    { name: 'Header action cluster (.header__actions)', re: /class="[^"]*header__actions[^"]*"/i },

    // Announcement
    { name: 'Announcement ticker (.announce)', re: /class="[^"]*announce[^"]*"/i },
    { name: 'Announcement items (.announce__item)', re: /class="[^"]*announce__item[^"]*"/i },

    // Hero
    { name: 'Hero section (.hero)', re: /<section[^>]*class="[^"]*hero[^"]*"/i },
    { name: 'Hero grid (.hero__grid)', re: /class="[^"]*hero__grid[^"]*"/i },
    { name: 'Hero slide numbers (.hero__num)', re: /class="[^"]*hero__num[^"]*"/i },
    { name: 'Hero copy (.hero__copy)', re: /class="[^"]*hero__copy[^"]*"/i },
    { name: 'Hero stage (.hero__stage)', re: /class="[^"]*hero__stage[^"]*"/i },

    // Services
    { name: 'Service strip (.services)', re: /class="[^"]*services[^"]*"/i },
    { name: 'Service item (.service)', re: /class="[^"]*service\b/i },

    // Fresh
    { name: 'Fresh rail (.rail)', re: /class="[^"]*rail[^"]*"/i },
    { name: 'Product card (.pcard)', re: /class="[^"]*pcard\b/i },
    { name: 'Product card media (.pcard__media)', re: /class="[^"]*pcard__media[^"]*"/i },
    { name: 'Product card body (.pcard__body)', re: /class="[^"]*pcard__body[^"]*"/i },

    // Spotlight
    { name: 'Bento grid (.bento)', re: /class="[^"]*bento[^"]*"/i },
    { name: 'Bento lead cell (.bento__cell--lead)', re: /class="[^"]*bento__cell--lead[^"]*"/i },

    // Categories
    { name: 'Category wall (.cats)', re: /class="[^"]*cats[^"]*"/i },
    { name: 'Category tile (.cats__tile)', re: /class="[^"]*cats__tile[^"]*"/i },

    // Best Sellers
    { name: 'Best sellers tabs (.tabs)', re: /class="[^"]*tabs[^"]*"/i },
    { name: 'Tab panel (.tabpanel)', re: /class="[^"]*tabpanel[^"]*"/i },

    // Giveaway
    { name: 'Giveaway container (.giveaway)', re: /class="[^"]*giveaway[^"]*"/i },
    { name: 'Countdown (.countdown)', re: /class="[^"]*countdown[^"]*"/i },

    // Community
    { name: 'Community UGC (.ugc)', re: /class="[^"]*ugc[^"]*"/i },
    { name: 'UGC cell (.ugc__cell)', re: /class="[^"]*ugc__cell[^"]*"/i },

    // Press
    { name: 'Press marquee (.marquee)', re: /class="[^"]*marquee[^"]*"/i },
    { name: 'Marquee track (.marquee__track)', re: /class="[^"]*marquee__track[^"]*"/i },

    // Editorial
    { name: 'Editorial section (.editorial)', re: /class="[^"]*editorial[^"]*"/i },
    { name: 'Post lead (.post-lead)', re: /class="[^"]*post-lead[^"]*"/i },
    { name: 'Post list (.post-list)', re: /class="[^"]*post-list[^"]*"/i },

    // Footer
    { name: 'Footer (.footer)', re: /<footer[^>]*class="[^"]*footer[^"]*"/i },
    { name: 'Newsletter (.footer__news)', re: /class="[^"]*footer__news[^"]*"/i },
    { name: 'Newsletter form (.newsform)', re: /class="[^"]*newsform[^"]*"/i },
    { name: 'Footer main (.footer__main)', re: /class="[^"]*footer__main[^"]*"/i },
    { name: 'Footer about (.footer__about)', re: /class="[^"]*footer__about[^"]*"/i },
    { name: 'Footer stores (.footer__stores)', re: /class="[^"]*footer__stores[^"]*"/i },
    { name: 'Footer legal (.footer__legal)', re: /class="[^"]*footer__legal[^"]*"/i },
    { name: 'Payment list (.paylist)', re: /class="[^"]*paylist[^"]*"/i },

    // Overlays
    { name: 'Backdrop (.backdrop)', re: /class="[^"]*backdrop[^"]*"/i },
    { name: 'Searchbox modal (.searchbox)', re: /class="[^"]*searchbox[^"]*"/i },
    { name: 'Mobile drawer (#mobilenav)', re: /id="mobilenav"/i },
    { name: 'Back to top button (.totop)', re: /class="[^"]*totop[^"]*"/i },
    { name: 'Grain overlay (.grain)', re: /class="[^"]*grain[^"]*"/i }
  ];

  console.log('\n--- DOM ELEMENT VERIFICATION ---');
  let passed = 0;
  for (const c of checks) {
    const ok = c.re.test(viRes.html);
    console.log(`${ok ? '✓ PASS' : '✗ FAIL'}: ${c.name}`);
    if (ok) passed++;
  }
  console.log(`\nPassed ${passed} / ${checks.length} assertions.`);

  // 4. Check forbidden string
  const lowerVi = viRes.html.toLowerCase();
  const lowerEn = enRes.html.toLowerCase();
  const hasAttackShark = lowerVi.includes('attackshark') || lowerEn.includes('attackshark');
  console.log(`\nForbidden keyword check ("attackshark"): ${hasAttackShark ? '✗ DETECTED!' : '✓ CLEAN'}`);

  // 5. Check Section Order in HTML
  console.log('\n--- SECTION ORDER CHECK ---');
  const sectionHandles = [
    'hero',
    'services',
    'fresh',
    'spotlight',
    'cats',
    'best-h',
    'giveaway',
    'ugc',
    'marquee',
    'editorial'
  ];
  let lastIndex = -1;
  let orderOk = true;
  for (const h of sectionHandles) {
    const idx = viRes.html.indexOf(h);
    if (idx === -1) {
      console.log(`✗ Section pattern "${h}" not found`);
      orderOk = false;
    } else if (idx < lastIndex) {
      console.log(`✗ Section pattern "${h}" appeared out of order (pos ${idx} < ${lastIndex})`);
      orderOk = false;
    } else {
      console.log(`✓ Section "${h}" at offset ${idx}`);
      lastIndex = idx;
    }
  }
  console.log(`Section order integrity: ${orderOk ? '✓ PERFECT MATCH' : '✗ OUT OF ORDER'}`);
}

main().catch(console.error);

