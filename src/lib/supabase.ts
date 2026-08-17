import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xszekazhpezzfbnudvps.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzemVrYXpocGV6emZibnVkdnBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5NTA0MDgsImV4cCI6MjEwMjUyNjQwOH0.rwr10wS1e6xyhE_DP09WpCEj-KqKiMi3A5zbGd0rC1M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);