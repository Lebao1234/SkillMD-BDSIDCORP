const { init, call } = require('./mcp');

async function main() {
  await init();
  const res = await call('graphql_query', {
    query: `query { __type(name: "Product") { fields { name type { name kind ofType { name kind } } } } }`
  });
  const fields = (res.__type && res.__type.fields) || [];
  console.log('Product fields:');
  fields.forEach(f => console.log(' -', f.name));
}

main().catch(console.error);

