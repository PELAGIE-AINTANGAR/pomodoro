const { createClient } = require('@supabase/supabase-js');

// 🔁 Remplace par TES infos Supabase
const supabaseUrl = 'https://rdubrtumocigwssnzoul.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkdWJydHVtb2NpZ3dzc256b3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NjY0NjksImV4cCI6MjA2NzA0MjQ2OX0._7dRjyCwe7UZMV8Wyh2sjPs09eMq8wVp7nCkBQabn8k';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
