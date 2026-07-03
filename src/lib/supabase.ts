import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) || "";
const supabaseAnonKey = (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_ANON_KEY) || "";

const isValidUrl = (url: string) => {
  return url && url.startsWith("https://") && !url.includes("your_supabase_project_url_here");
};

const finalUrl = isValidUrl(supabaseUrl) ? supabaseUrl : "https://placeholder-project.supabase.co";
const finalKey = supabaseAnonKey && supabaseAnonKey !== "your_supabase_anon_public_key_here" ? supabaseAnonKey : "placeholder-key";

export const supabase = createClient(finalUrl, finalKey);

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return isValidUrl(supabaseUrl) && 
         supabaseAnonKey && 
         supabaseAnonKey !== "your_supabase_anon_public_key_here";
};
