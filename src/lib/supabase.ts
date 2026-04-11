import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iyobrugktvbtmiwkbmee.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5b2JydWdrdHZidG1pd2tibWVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MDYwMjYsImV4cCI6MjA5MTQ4MjAyNn0.FhCxCv-ZU1c-tJBleLJXmBik7PcMSWgONbxqTN5hRAw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getServerTimestamp = () => new Date().toISOString();
