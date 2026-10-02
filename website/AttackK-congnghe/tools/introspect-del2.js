const { init, call } = require('./mcp');

async function main() {
  await init();
  const res = await call('graphql_query', {
    query: `query { __type(name: "Mutation") { fields { name type { name kind } args { name type { name kind ofType { name kind } } } } } }`
  });
  const fields = (res.__type && res.__type.fields) || [];
  const del = fields.find(f => f.name === 'deleteProductImage');
  console.log('del:', JSON.stringify(del, null, 2));

  const delStore = fields.find(f => f.name === 'deleteStoreMedia');
  console.log('delStore:', JSON.stringify(delStore, null, 2));
}

main().catch(console.error);

