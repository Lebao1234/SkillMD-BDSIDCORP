const { init, call } = require('./mcp');

async function main() {
  await init();
  const prods = await call('list_products', {});
  if (prods.products && prods.products.data) {
    console.log('Total products:', prods.products.data.length);
    prods.products.data.forEach(p => {
      console.log(`ID: ${p.id} | SKU: ${p.sku} | Name: ${p.name}`);
    });
  }
}

main().catch(console.error);

