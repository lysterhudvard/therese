import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Link2 } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

export function DashboardContact() {
  const [agentEmail, setAgentEmail] = useState("");
  const [voiceEmail, setVoiceEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [youtube, setYoutube] = useState("");
  const [x, setX] = useState("");
  const [imdb, setImdb] = useState("");
  const [wikipedia, setWikipedia] = useState("");
  const [customLink1Label, setCustomLink1Label] = useState("");
  const [customLink1Url, setCustomLink1Url] = useState("");
  const [customLink1Icon, setCustomLink1Icon] = useState("link");
  const [customLink2Label, setCustomLink2Label] = useState("");
  const [customLink2Url, setCustomLink2Url] = useState("");
  const [customLink2Icon, setCustomLink2Icon] = useState("link");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      // Offline fallback values
      setAgentEmail("jonas@schultzbergagency.com");
      setVoiceEmail("theresejarvheden@gmail.com");
      setInstagram("https://www.instagram.com/theresejarvheden/");
      setFacebook("https://www.facebook.com/therese.jarvhedenfdpersson");
      return;
    }

    const fetchContactData = async () => {
      const { data, error } = await supabase
        .from("biography")
        .select("contact_links")
        .eq("id", "main")
        .maybeSingle();

      if (error) {
        console.error("Failed to load contact data:", error.message);
        return;
      }

      if (data && data.contact_links) {
        const links = typeof data.contact_links === "string" ? JSON.parse(data.contact_links) : data.contact_links;
        setAgentEmail(links.agentEmail || "");
        setVoiceEmail(links.voiceEmail || "");
        setInstagram(links.instagram || "");
        setFacebook(links.facebook || "");
        setYoutube(links.youtube || "");
        setX(links.x || "");
        setImdb(links.imdb || "");
        setWikipedia(links.wikipedia || "");
        setCustomLink1Label(links.customLink1Label || "");
        setCustomLink1Url(links.customLink1Url || "");
        setCustomLink1Icon(links.customLink1Icon || "link");
        setCustomLink2Label(links.customLink2Label || "");
        setCustomLink2Url(links.customLink2Url || "");
        setCustomLink2Icon(links.customLink2Icon || "link");
      } else {
        // Fallback for first time if record has no data
        setAgentEmail("jonas@schultzbergagency.com");
        setVoiceEmail("theresejarvheden@gmail.com");
        setInstagram("https://www.instagram.com/theresejarvheden/");
        setFacebook("https://www.facebook.com/therese.jarvhedenfdpersson");
      }
    };

    fetchContactData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (!isSupabaseConfigured()) {
      toast.error("Supabase är inte anslutet. Ändringen sparas endast lokalt.");
      setTimeout(() => setIsSaving(false), 500);
      return;
    }

    const { error } = await supabase.from("biography").update({
      contact_links: {
        agentEmail,
        voiceEmail,
        instagram,
        facebook,
        youtube,
        x,
        imdb,
        wikipedia,
        customLink1Label,
        customLink1Url,
        customLink1Icon,
        customLink2Label,
        customLink2Url,
        customLink2Icon,
      },
    }).eq("id", "main");

    setIsSaving(false);
    if (error) {
      if (error.message.includes("column \"contact_links\" of relation \"biography\" does not exist")) {
        toast.error("Vänligen kör 'supabase_migration_4.sql' i din Supabase SQL Editor först.");
      } else {
        toast.error(`Kunde inte spara kontaktinfo: ${error.message}`);
      }
    } else {
      toast.success("Akt VII (Kontaktinfo) har sparats framgångsrikt!");
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div className="border-b border-bone/10 pb-4 mb-6">
        <h2 className="font-display text-2xl text-bone uppercase tracking-wider flex items-center gap-2 whitespace-nowrap">
          Akt VII — <span className="italic text-ember">Kontaktinfo</span>
        </h2>
        <p className="text-[10px] text-bone/40 mt-1 font-mono uppercase tracking-wider">
          Hantera dina kontaktuppgifter och externa profiler som visas på kontaktsidan.
        </p>
      </div>

      <div className="bg-stage/5 border border-bone/10 p-6 rounded-sm space-y-6">
        <h3 className="text-xs uppercase tracking-widest text-bone font-mono flex items-center gap-1.5 border-b border-bone/5 pb-2">
          <Link2 size={14} className="text-ember" /> Kontaktuppgifter & E-post
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Agent E-post</label>
            <input
              type="email"
              value={agentEmail}
              onChange={(e) => setAgentEmail(e.target.value)}
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
              placeholder="T.ex: jonas@schultzbergagency.com"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Röst E-post (Direkt)</label>
            <input
              type="email"
              value={voiceEmail}
              onChange={(e) => setVoiceEmail(e.target.value)}
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
              placeholder="T.ex: theresejarvheden@gmail.com"
            />
          </div>
        </div>
      </div>

      <div className="bg-stage/5 border border-bone/10 p-6 rounded-sm space-y-6">
        <h3 className="text-xs uppercase tracking-widest text-bone font-mono flex items-center gap-1.5 border-b border-bone/5 pb-2">
          <Link2 size={14} className="text-ember" /> Sociala Medier & Profiler
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Instagram Länk</label>
            <input
              type="url"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
              placeholder="Lämna tom för att dölja ikonen"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Facebook Länk</label>
            <input
              type="url"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
              placeholder="Lämna tom för att dölja ikonen"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">YouTube Länk</label>
            <input
              type="url"
              value={youtube}
              onChange={(e) => setYoutube(e.target.value)}
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
              placeholder="T.ex: https://youtube.com/..."
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">X Länk (Twitter)</label>
            <input
              type="url"
              value={x}
              onChange={(e) => setX(e.target.value)}
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
              placeholder="T.ex: https://x.com/..."
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">IMDb Profil-Länk</label>
            <input
              type="url"
              value={imdb}
              onChange={(e) => setImdb(e.target.value)}
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
              placeholder="T.ex: https://www.imdb.com/name/nm..."
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Wikipedia Länk</label>
            <input
              type="url"
              value={wikipedia}
              onChange={(e) => setWikipedia(e.target.value)}
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
              placeholder="T.ex: https://sv.wikipedia.org/wiki/..."
            />
          </div>
        </div>
      </div>

      <div className="bg-stage/5 border border-bone/10 p-6 rounded-sm space-y-6">
        <h3 className="text-xs uppercase tracking-widest text-bone font-mono flex items-center gap-1.5 border-b border-bone/5 pb-2">
          <Link2 size={14} className="text-ember" /> Anpassade Länkar
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Custom Link 1 */}
          <div className="space-y-4 border border-bone/5 p-4 rounded bg-stage/10">
            <h4 className="text-[9px] uppercase tracking-widest text-bone font-mono font-semibold">Länk 1</h4>
            <div className="space-y-2">
              <label className="block text-[8px] uppercase tracking-widest text-bone/40 font-mono">Etikett / Rubrik</label>
              <input
                type="text"
                value={customLink1Label}
                onChange={(e) => setCustomLink1Label(e.target.value)}
                className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
                placeholder="T.ex: Artistkatalogen"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[8px] uppercase tracking-widest text-bone/40 font-mono">URL / Webb-adress</label>
              <input
                type="url"
                value={customLink1Url}
                onChange={(e) => setCustomLink1Url(e.target.value)}
                className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
                placeholder="T.ex: https://example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[8px] uppercase tracking-widest text-bone/40 font-mono">Välj Ikon</label>
              <select
                value={customLink1Icon}
                onChange={(e) => setCustomLink1Icon(e.target.value)}
                className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
              >
                <option value="link" className="bg-stage">Länk (Standard)</option>
                <option value="globe" className="bg-stage">Glob / Webbplats</option>
                <option value="video" className="bg-stage">Video / Film</option>
                <option value="award" className="bg-stage">Pris / Utmärkelse</option>
                <option value="briefcase" className="bg-stage">Portfölj / Uppdrag</option>
                <option value="music" className="bg-stage">Musik / Röst</option>
                <option value="mail" className="bg-stage">E-post</option>
                <option value="phone" className="bg-stage">Telefon</option>
              </select>
            </div>
          </div>

          {/* Custom Link 2 */}
          <div className="space-y-4 border border-bone/5 p-4 rounded bg-stage/10">
            <h4 className="text-[9px] uppercase tracking-widest text-bone font-mono font-semibold">Länk 2</h4>
            <div className="space-y-2">
              <label className="block text-[8px] uppercase tracking-widest text-bone/40 font-mono">Etikett / Rubrik</label>
              <input
                type="text"
                value={customLink2Label}
                onChange={(e) => setCustomLink2Label(e.target.value)}
                className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
                placeholder="T.ex: Egen hemsida"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[8px] uppercase tracking-widest text-bone/40 font-mono">URL / Webb-adress</label>
              <input
                type="url"
                value={customLink2Url}
                onChange={(e) => setCustomLink2Url(e.target.value)}
                className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
                placeholder="T.ex: https://example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[8px] uppercase tracking-widest text-bone/40 font-mono">Välj Ikon</label>
              <select
                value={customLink2Icon}
                onChange={(e) => setCustomLink2Icon(e.target.value)}
                className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
              >
                <option value="link" className="bg-stage">Länk (Standard)</option>
                <option value="globe" className="bg-stage">Glob / Webbplats</option>
                <option value="video" className="bg-stage">Video / Film</option>
                <option value="award" className="bg-stage">Pris / Utmärkelse</option>
                <option value="briefcase" className="bg-stage">Portfölj / Uppdrag</option>
                <option value="music" className="bg-stage">Musik / Röst</option>
                <option value="mail" className="bg-stage">E-post</option>
                <option value="phone" className="bg-stage">Telefon</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-bone/10">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-ember/90 hover:bg-ember text-ink font-semibold font-mono text-[10px] uppercase tracking-widest rounded-sm transition-all duration-300 cursor-pointer shadow-lg hover:shadow-ember/15"
        >
          {isSaving ? (
            <span className="w-3.5 h-3.5 border-2 border-ink border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save size={12} />
              Spara ändringar
            </>
          )}
        </button>
      </div>
    </form>
  );
}
