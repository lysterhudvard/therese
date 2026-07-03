import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Link2 } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

export function DashboardContact() {
  const [agentEmail, setAgentEmail] = useState("jonas@schultzbergagency.com");
  const [voiceEmail, setVoiceEmail] = useState("theresejarvheden@gmail.com");
  const [instagram, setInstagram] = useState("https://www.instagram.com/theresejarvheden/");
  const [facebook, setFacebook] = useState("https://www.facebook.com/therese.jarvhedenfdpersson");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

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
        if (links.agentEmail) setAgentEmail(links.agentEmail);
        if (links.voiceEmail) setVoiceEmail(links.voiceEmail);
        if (links.instagram) setInstagram(links.instagram);
        if (links.facebook) setFacebook(links.facebook);
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
          Hantera dina kontaktuppgifter och sociala medier som visas på kontaktsidan.
        </p>
      </div>

      <div className="bg-stage/5 border border-bone/10 p-6 rounded-sm space-y-6">
        <h3 className="text-xs uppercase tracking-widest text-bone font-mono flex items-center gap-1.5 border-b border-bone/5 pb-2">
          <Link2 size={14} className="text-ember" /> Kontaktuppgifter
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Agent E-post</label>
            <input
              type="email"
              value={agentEmail}
              onChange={(e) => setAgentEmail(e.target.value)}
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Röst E-post (Direkt)</label>
            <input
              type="email"
              value={voiceEmail}
              onChange={(e) => setVoiceEmail(e.target.value)}
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Instagram Länk</label>
            <input
              type="url"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Facebook Länk</label>
            <input
              type="url"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
            />
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
