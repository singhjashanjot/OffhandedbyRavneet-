const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('apps/web/.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/);
  if (match) {
    env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  try {
    const { data: cols, error } = await supabase.rpc('get_table_columns_info', {});
    
    // If RPC doesn't exist, we can query it using a direct SELECT from a known table or run a raw query
    // Since we don't have a direct SQL query RPC, let's try calling supabase.from('bookings').select() 
    // and print any error or see if we can get column list.
    // Actually, another way is to fetch information_schema via standard select if accessible (usually restricted).
    // Let's see if we can read the table structures by querying a single mock insert or checking the error message of an invalid insert.
    // For example, inserting an empty object might return a list of required columns or we can inspect the error message.
    
    // Let's try to query information_schema.columns:
    const { data: schemaCols, error: schemaError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'bookings');
    
    console.log("Direct information_schema query error:", schemaError?.message);
    console.log("Direct information_schema query columns:", schemaCols);

  } catch (err) {
    console.error(err);
  }
}

run();
