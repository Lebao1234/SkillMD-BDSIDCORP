const { init, call } = require('./mcp');

async function main() {
  await init();
  const res = await call('upload_image', {
    url: 'https://iili.io/nnJfkX9.jpg',
    folder: 'products',
    alt: 'X3 Wireless Gaming Mouse'
  });
  console.log('Upload image result:', JSON.stringify(res, null, 2));

  if (res && res.url) {
    console.log('Now updating product 14173 with image:', res.url);
    const upd = await call('upload_product_image', {
      product_id: '14173',
      url: res.url,
      is_primary: true,
      alt: 'X3 Wireless Gaming Mouse PAW3395 Superlight'
    });
    console.log('Update product image result:', JSON.stringify(upd, null, 2));

    await call('reindex_products', {});
    await call('clear_storefront_cache', {});
    console.log('Reindexed and cache cleared!');
  }
}

main().catch(console.error);
