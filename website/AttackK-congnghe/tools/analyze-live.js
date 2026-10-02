const fs = require('fs');
const html = fs.readFileSync('tools/live-home.html', 'utf8');

const tags = html.match(/<section[^>]*>/gi) || [];
console.log('Total <section> tags:', tags.length);
tags.forEach(t => console.log('  ', t));

const headerMatch = html.match(/<header[\s\S]*?<\/header>/i);
if (headerMatch) {
  console.log('\n--- HEADER (first 500 chars) ---');
  console.log(headerMatch[0].slice(0, 500));
}

const announcementMatch = html.match(/<div[^>]*announcement[^>]*>[\s\S]*?<\/div>/i) || html.match(/Chào mừng đến với cửa hàng/);
if (announcementMatch) {
  console.log('\n--- ANNOUNCEMENT MATCH ---');
  console.log(announcementMatch[0]);
}

const footerMatch = html.match(/<footer[\s\S]*?<\/footer>/i);
if (footerMatch) {
  console.log('\n--- FOOTER (first 500 chars) ---');
  console.log(footerMatch[0].slice(0, 500));
}

