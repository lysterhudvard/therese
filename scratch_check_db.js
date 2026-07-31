import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Read .env file manually
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

async function run() {
  const { data, error } = await supabase
    .from("showreels")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching showreels:", error);
  } else {
    console.log("Showreels Table Content:");
    console.log(JSON.stringify(data, null, 2));
  }
}

run();
