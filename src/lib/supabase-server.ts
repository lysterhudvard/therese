import { supabase, isSupabaseConfigured } from './supabase';
import { IMG } from '../routes/index';

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
        poster: r.poster || "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1000",
        genre: r.genre || "SHOWREEL",
        specs: r.specs || "16:9 // HD",
        glow: r.glow || "rgba(235, 94, 40, 0.15)"
      };
    });

    // Map portfolio images
    const mappedImages = (portRes.data || []).map((p: any) => ({
      url: p.url,
      alt: p.alt || "Therese Järvheden porträtt",
      allow_download: p.allow_download !== false
    }));

    return {
      biography: bioRes.data,
      credits: mappedCredits,
      showreels: mappedShowreels,
      seo: seoRes.data,
      portfolioImages: mappedImages.length > 0 ? mappedImages : IMG.portfolio.map((url, i) => ({
        url,
        alt: `Therese Järvheden portfolio ${i + 1}`,
        allow_download: true
      }))
    };
  } catch (e) {
    console.error("Failed to load live Supabase data SSR:", e);
    return null;
  }
}
