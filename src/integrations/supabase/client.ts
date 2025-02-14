import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pikxpmhpcsrstmikkpvg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpa3hwbWhwY3Nyc3RtaWtrcHZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0ODkwMTUsImV4cCI6MjA1NDA2NTAxNX0.PgLxMFtsFzt1V7ds1wn_EOfpprVjXFJlLo_9D2090o8";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage
  }
});