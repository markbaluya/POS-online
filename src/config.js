// Online config. Fill these in Supabase Dashboard -> Project Settings -> API.
// If left as PLACEHOLDER, app falls back to local MENU so it still runs offline/demo.
export const SUPABASE_URL = "https://YOUR-PROJECT.supabase.co";
export const SUPABASE_ANON_KEY = "YOUR-ANON-KEY";

export const isOnlineConfigured = () =>
  !SUPABASE_URL.includes("YOUR-PROJECT") && !SUPABASE_ANON_KEY.includes("YOUR-ANON");
