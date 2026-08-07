import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envContent = fs.readFileSync(".env", "utf8");
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/);

const supabaseUrl = urlMatch[1].trim();
const supabaseKey = keyMatch[1].trim();

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from("biography")
    .select("bio_sections")
    .eq("id", "main")
    .maybeSingle();

  if (error) {
    console.error(error);
  } else if (data && data.bio_sections) {
    const sections = typeof data.bio_sections === "string" ? JSON.parse(data.bio_sections) : data.bio_sections;
    sections.forEach(s => {
      console.log(`=== Section: ${s.title_sv} / ${s.title_en} ===`);
      console.log(`Quote SV: ${s.quote_sv}`);
      console.log(`Description: ${s.description}`);
      console.log("");
    });
  }
}

run();
