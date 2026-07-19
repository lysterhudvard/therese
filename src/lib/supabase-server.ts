import { supabase, isSupabaseConfigured } from './supabase';

export async function getPageData() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const [bioRes, credsRes, reelsRes, seoRes, portRes] = await Promise.all([
      supabase.from("biography").select("*").eq("id", "main").maybeSingle(),
      supabase.from("credits").select("*").order("sort_order", { ascending: true }),
      supabase.from("showreels").select("*").order("sort_order", { ascending: true }),
      supabase.from("seo_settings").select("*").eq("id", "main").maybeSingle(),
      supabase.from("portfolio_images").select("*").order("sort_order", { ascending: true })
    ]);

    // Map credits
    const mappedCredits = (credsRes.data || []).map((c: any) => {
      const credit: any = {
        year: c.year || "—",
        title: c.title || "",
        role: { sv: c.role_sv || "", en: c.role_en || "" },
        type: c.type,
        category: { sv: c.category_sv || "", en: c.category_en || "" },
        network: c.network || "",
        url: c.url || undefined,
        img: c.img || "",
        is_current_production: c.is_current_production
      };
      if (c.commentary_url) {
        credit.commentary = {
          url: c.commentary_url,
          duration: c.commentary_duration || "0:10",
          svText: c.commentary_sv || "",
          enText: c.commentary_en || ""
        };
      }
      if (c.script_scene) {
        credit.script = {
          scene: c.script_scene,
          dialogue: {
            char: c.script_char || "CHARACTER",
            line: {
              sv: c.script_line_sv || "",
              en: c.script_line_en || ""
            }
          }
        };
      }
      return credit;
    });

    // Map showreels
    const mappedShowreels = (reelsRes.data || []).map((r: any) => {
      return {
        id: r.id || String(r.sort_order),
        title: { sv: r.title_sv || "", en: r.title_en || "" },
        sub: { sv: r.sub_sv || "", en: r.sub_en || "" },
        url: r.url || undefined,
        vimeoId: r.vimeo_id || undefined,
        youtubeId: r.youtube_id || undefined,
        poster: r.poster || "",
        genre: r.genre || "SHOWREEL",
        specs: r.specs || "16:9 // HD",
        glow: r.glow || "rgba(235, 94, 40, 0.15)"
      };
    });

    // Map portfolio images
    const mappedImages = (portRes.data || []).map((p: any) => ({
      url: p.url,
      download_url: p.download_url || p.url,
      alt: p.alt || "Therese Järvheden porträtt",
      allow_download: p.allow_download !== false,
      title: p.title || "",
      caption: p.caption || "",
      filename: p.filename || "",
      description: p.description || ""
    }));

    return {
      biography: bioRes.data,
      credits: mappedCredits,
      showreels: mappedShowreels,
      seo: seoRes.data,
      portfolioImages: mappedImages
    };
  } catch (e) {
    console.error("Failed to load live Supabase data SSR:", e);
    return null;
  }
}
