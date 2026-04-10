
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

// Initialize the Supabase client
// We use placeholder values when environment variables are not available
// These allow the app to load without crashing, but won't allow actual Supabase operations
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Log a warning if environment variables are missing
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Supabase URL or Anon Key is missing. Please add them to your environment variables.');
  console.warn('The app will run in demo mode with mock data until Supabase credentials are provided.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const getServerTimestamp = () => {
  return new Date().toISOString();
};
