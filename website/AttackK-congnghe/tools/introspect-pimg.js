const { init, call } = require('./mcp');

async function main() {
  await init();
  const res = await call('graphql_query', {
    query: `query { __type(name: "ProductImage") { fields { name type { name kind ofType { name } } } } }`
  });
  console.log('ProductImage fields:', JSON.stringify((res.__type && res.__type.fields) || [], null, 2));

  // Now query product 14173 with valid ProductImage fields
  const p = await call('graphql_query', {
    query: `query { product(id: 14173) { id images { id image_url is_primary } } }`
  });
  console.log('Product images:', JSON.stringify(p, null, 2));
}

main().catch(console.error);

