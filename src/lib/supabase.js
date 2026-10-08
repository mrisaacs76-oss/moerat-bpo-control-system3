import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

let client = null;
let initError = null;

if (!supabaseUrl || !supabaseKey) {
  initError = {
    code: 'MISSING_CONFIG',
    message:
      'Supabase is not configured. Missing environment variables: ' +
      [!supabaseUrl ? 'VITE_SUPABASE_URL' : null, !supabaseKey ? 'VITE_SUPABASE_PUBLISHABLE_KEY' : null]
        .filter(Boolean)
        .join(', ') +
      '. Set both values in the hosting platform before deployment.'
  };
} else {
  try {
    client = createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    initError = {
      code: 'INIT_ERROR',
      message: `Failed to initialize Supabase client: ${error.message}`
    };
  }
}

export const supabase = client;
export { initError };
