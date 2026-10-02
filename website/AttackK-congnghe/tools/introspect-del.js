const { init, call } = require('./mcp');

async function main() {
  await init();
  const res = await call('graphql_query', {
    query: `query { __type(name: "Mutation") { fields { name args { name type { name kind ofType { name kind } } } } } }`
  });
  const fields = (res.__type && res.__type.fields) || [];
  const del = fields.find(f => f.name === 'deleteProductImage');
  console.log('deleteProductImage args:', JSON.stringify(del, null, 2));

  // Also check product 14173 image IDs
  const p = await call('graphql_query', {
    query: `query { product(id: 14173) { id name images { id path url is_primary } } }`
  });
  console.log('Images query result:', JSON.stringify(p, null, 2));
}

main().catch(console.error);

