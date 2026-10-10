const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_t6BwgAXVjl5K@ep-fancy-water-b4k76lcb-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require',
});

async function run() {
  await client.connect();
  let res = await client.query('SELECT * FROM "Account" LIMIT 1');
  console.log("--- Account ---");
  console.log(res.fields.map(f => f.name + ": " + f.dataTypeID).join("\n"));
  
  res = await client.query('SELECT * FROM "Transaction" LIMIT 1');
  console.log("--- Transaction ---");
  console.log(res.fields.map(f => f.name + ": " + f.dataTypeID).join("\n"));
  await client.end();
}
run();
