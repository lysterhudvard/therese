import { supabase } from "./supabase";
import { VIDEOS } from "../components/sections/ShowreelsData";
import { CREDITS } from "../routes/index";
import { IMG } from "../routes/index";

export interface BiographyData {
  quote_sv: string;
  quote_en: string;
  dialects_sv: string;
  dialects_en: string;
  languages_sv: string;
  languages_en: string;
}

export interface SeoData {
  title_sv: string;
  title_en: string;
  description_sv: string;
  description_en: string;
  og_image: string;
}

/**
 * Checks if the Supabase tables already contain seeded data
 */
export async function checkDatabaseSeeded(): Promise<{ seeded: boolean; error: boolean }> {
  try {
    const { data, error } = await supabase
      .from("biography")
      .select("id")
      .eq("id", "main")
      .maybeSingle();

    if (error) {
      console.warn("Error checking biography table. Schema might not be created yet:", error);
      return { seeded: false, error: true };
    }

    return { seeded: !!data, error: false };
  } catch (err) {
    console.error("Failed to connect to Supabase:", err);
    return { seeded: false, error: true };
  }
}

/**
 * Seeds the database with all hardcoded content from the files
 */
export async function seedDatabaseWithCurrentContent(): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Seed Biography
    const { error: bioErr } = await supabase.from("biography").upsert({
      id: "main",
      quote_sv: "Drama är något jag känner extra starkt för.",
      quote_en: "Drama is something I feel especially strongly about.",
      dialects_sv: "Skånsk · Rikssvenska",
      dialects_en: "Scanian · Standard Swedish",
      languages_sv: "Svenska · Engelska",
      languages_en: "Swedish · English",
      hero_text_sv: '"En våldsam kärlek" — SVT dramadokumentär.',
      hero_text_en: '"En våldsam kärlek" — SVT documentary drama.',
      is_automated: false,
      hero_image: "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000000-339e8339ea/Thess1114_lowres.jpg?ph=a6c2528650",
      hero_role_sv: "Skådespelerska",
      hero_role_en: "Actress",
      hero_base_sv: "Malmö · Stockholm",
      hero_base_en: "Malmö · Stockholm",
      bio_image_credits_sv: "Foto: Robert Eldrim\nSmink: Sara Zetterström",
      bio_image_credits_en: "Photo: Robert Eldrim\nMakeup: Sara Zetterström",
      bio_sections: [
        {
          id: "Dramatic",
          title_sv: "Dramatisk",
          title_en: "Dramatic",
          quote_sv: "Drama är något jag känner extra starkt för.",
          quote_en: "Drama is something I feel especially strongly about.",
          image: "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000000-339e8339ea/Thess1114_lowres.jpg?ph=a6c2528650",
          weight: 300
        },
        {
          id: "Comedic",
          title_sv: "Komisk",
          title_en: "Comedic",
          quote_sv: "Komedi kräver samma precision som tragedi — bara snabbare.",
          quote_en: "Comedy demands the same precision as tragedy — just faster.",
          image: "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000017-971e0971e2/Thess1079_highres.jpg?ph=a6c2528650",
          weight: 500
        },
        {
          id: "Classical",
          title_sv: "Klassisk",
          title_en: "Classical",
          quote_sv: "Scenen lärde mig allt jag vet om timing och tystnad.",
          quote_en: "The stage taught me everything I know about timing and silence.",
          image: "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000043-e152ee1530/Thess0477_highres-5.jpg?ph=a6c2528650",
          weight: 400
        }
      ]
    });

    if (bioErr) throw new Error(`Biography seeding failed: ${bioErr.message}`);

    // 2. Seed SEO Settings
    const { error: seoErr } = await supabase.from("seo_settings").upsert({
      id: "main",
      title_sv: "Therese Järvheden — Skådespelerska",
      title_en: "Therese Järvheden — Swedish Actress",
      description_sv: "Svensk skådespelerska och röstskådespelare. Drama, komedi, röst. SVT 'En våldsam kärlek', Beck.",
      description_en: "Swedish actress Therese Järvheden. Drama, comedy, voice. SVT 'En våldsam kärlek', Beck.",
      og_image: IMG.hero,
    });

    if (seoErr) throw new Error(`SEO settings seeding failed: ${seoErr.message}`);

    // 3. Seed Showreels
    const showreelsData = VIDEOS.map((v, index) => ({
      id: v.id,
      title_sv: v.title.sv,
      title_en: v.title.en,
      sub_sv: v.sub.sv,
      sub_en: v.sub.en,
      vimeo_id: v.vimeoId || null,
      youtube_id: v.youtubeId || null,
      url: v.url || null,
      poster: v.poster,
      genre: v.genre,
      specs: v.specs,
      glow: v.glow,
      sort_order: index,
    }));

    const { error: showreelsErr } = await supabase.from("showreels").upsert(showreelsData);
    if (showreelsErr) throw new Error(`Showreels seeding failed: ${showreelsErr.message}`);

    // 4. Seed Credits
    const creditsData = CREDITS.map((c, index) => ({
      year: c.year,
      title: c.title,
      role_sv: c.role.sv,
      role_en: c.role.en,
      type: c.type,
      category_sv: c.category.sv,
      category_en: c.category.en,
      network: c.network,
      url: c.url || null,
      img: c.img,
      commentary_url: c.commentary?.url || null,
      commentary_duration: c.commentary?.duration || null,
      commentary_sv: c.commentary?.svText || null,
      commentary_en: c.commentary?.enText || null,
      script_scene: c.script?.scene || null,
      script_char: c.script?.dialogue.char || null,
      script_line_sv: c.script?.dialogue.line.sv || null,
      script_line_en: c.script?.dialogue.line.en || null,
      sort_order: index,
      is_current_production: index === 0,
    }));

    // Clear and re-insert credits to prevent duplication
    await supabase.from("credits").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const { error: creditsErr } = await supabase.from("credits").insert(creditsData);
    if (creditsErr) throw new Error(`Credits seeding failed: ${creditsErr.message}`);

    // 5. Seed Portfolio Images
    const portfolioData = IMG.portfolio.map((url, index) => ({
      url,
      alt: `Therese Järvheden headshot ${index + 1}`,
      allow_download: true,
      sort_order: index,
    }));

    // Clear and re-insert portfolio images
    await supabase.from("portfolio_images").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const { error: portfolioErr } = await supabase.from("portfolio_images").insert(portfolioData);
    if (portfolioErr) throw new Error(`Portfolio images seeding failed: ${portfolioErr.message}`);

    return { success: true, message: "Databasen har populerats med all befintlig data framgångsrikt!" };
  } catch (err: any) {
    console.error("Seeding operation failed:", err);
    return { success: false, message: err.message || "Ett okänt fel uppstod vid överföring." };
  }
}
