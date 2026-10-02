const { init, call } = require('./mcp');

async function main() {
  await init();
  const res = await call('graphql_query', {
    query: `query { __type(name: "Mutation") { fields { name type { name kind ofType { name kind ofType { name } } } } } }`
  });
  const fields = (res.__type && res.__type.fields) || [];
  const del = fields.find(f => f.name === 'deleteProductImage');
  console.log('del type details:', JSON.stringify(del.type, null, 2));
}

main().catch(console.error);

