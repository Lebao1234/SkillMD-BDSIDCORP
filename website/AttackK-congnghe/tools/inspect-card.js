const fs = require('fs');
const html = fs.readFileSync('tools/live-home.html', 'utf8');

const prodIdx = html.indexOf('/products/');
if (prodIdx !== -1) {
  // find start of the enclosing element
  const start = html.lastIndexOf('<article', prodIdx) !== -1 ? html.lastIndexOf('<article', prodIdx) : html.lastIndexOf('<div', prodIdx);
  console.log('Snippet around product:');
  console.log(html.slice(start, start + 1200));
} else {
  console.log('No /products/ link found in live-home.html');
}

