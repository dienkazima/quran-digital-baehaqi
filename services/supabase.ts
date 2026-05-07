import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://snshpbjrpkpiutfkdkss.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuc2hwYmpycGtwaXV0Zmtka3NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNDg1MzQsImV4cCI6MjA5MzYyNDUzNH0.ChWmHl0q80Y4K5xESBteUN_uB02WcMcP6ksoVcVzR7E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
