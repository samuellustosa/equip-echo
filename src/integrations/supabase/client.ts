import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// URLs diretas do projeto Supabase
const SUPABASE_URL = 'https://oosdsqvxdebpofrcrvgk.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vc2RzcXZ4ZGVicG9mcmNydmdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNjE1NjgsImV4cCI6MjA3MTczNzU2OH0.Bzo74H56lrtlg0NZM8QcpAtH4wT7chcephhqF5jiLOY';

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});