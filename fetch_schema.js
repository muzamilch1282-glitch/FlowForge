const fs = require('fs');

async function fetchSchema() {
  const url = 'https://mpkhasyvonoicvpmbzpd.supabase.co/rest/v1/?apikey=sb_publishable_1yLFEqvikpTyLUwlm3C4Xg_vh-ijbMd';
  try {
    const res = await fetch(url);
    const data = await res.json();
    const tasksDef = data.definitions.tasks;
    console.log(JSON.stringify(tasksDef, null, 2));
  } catch(e) {
    console.error(e);
  }
}

fetchSchema();
