import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envContent = fs.readFileSync(".env", "utf8");
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/);

if (!urlMatch || !keyMatch) {
  console.error("Missing credentials in .env file");
  process.exit(1);
}

const supabaseUrl = urlMatch[1].trim();
const supabaseKey = keyMatch[1].trim();
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCredits() {
  const { data, error } = await supabase.from("credits").select("id, title, commentary_url, commentary_duration");
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Credits data:", JSON.stringify(data, null, 2));
  }
}

checkCredits();
