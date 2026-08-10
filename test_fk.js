const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mpkhasyvonoicvpmbzpd.supabase.co';
const supabaseKey = 'sb_publishable_1yLFEqvikpTyLUwlm3C4Xg_vh-ijbMd';

async function checkSchema() {
  const res = await fetch(supabaseUrl + '/rest/v1/', {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`
    }
  });
  const text = await res.text();
  console.log(text.substring(0, 500));
}

checkSchema();
