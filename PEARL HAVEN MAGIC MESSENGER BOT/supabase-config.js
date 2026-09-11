const SUPABASE_URL =
  "https://lftbqpjengiklrzdtjmk.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_9S6jnnqCToBMRZwwyIL3pA_wV9FD5TL";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  );