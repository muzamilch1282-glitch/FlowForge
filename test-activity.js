require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  const { data, error } = await supabase
    .from('activity_logs')
    .select(`*, profile:profiles(*)`)
    .limit(5);
  
  if (error) {
    console.error('ERROR:', error);
  } else {
    console.log('DATA:', data);
  }
}
test();
