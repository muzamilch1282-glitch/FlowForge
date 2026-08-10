const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://mpkhasyvonoicvpmbzpd.supabase.co',
  'sb_publishable_1yLFEqvikpTyLUwlm3C4Xg_vh-ijbMd'
);

async function testStatuses() {
  const statuses = ['todo', 'in-progress', 'in_progress', 'review', 'in_review', 'completed', 'done'];
  
  for (const status of statuses) {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: 'Test Task',
        project_id: '00000000-0000-0000-0000-000000000000', // Invalid UUID might throw a different error (foreign key), but if check constraint is evaluated first, we'll see it!
        status: status
      });
      
    console.log(`Status '${status}':`, error?.message || 'Success');
  }
}

testStatuses();
