const { init, call } = require('./mcp');

async function main() {
  await init();

  console.log('Calling deleteProductImage for ID 7102...');
  const res = await call('graphql_mutation', {
    mutation: `mutation { deleteProductImage(id: "7102") }`
  });
  console.log('Delete result:', JSON.stringify(res, null, 2));

  // Verify product 14173 images now
  const p = await call('graphql_query', {
    query: `query { product(id: 14173) { id images { id image_url is_primary } } }`
  });
  console.log('Product images after deletion:', JSON.stringify(p, null, 2));

  await call('reindex_products', {});
  await call('clear_storefront_cache', {});
  console.log('Reindexed and cleared cache!');
}

main().catch(console.error);
