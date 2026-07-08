import React from "react";
import {
  Trash2,
  Star,
  Volume2,
  AlignLeft,
  Upload,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Music,
} from "lucide-react";
import { CreditRow } from "./types";

interface CreditItemCardProps {
  c: CreditRow;
  index: number;
  creditsCount: number;
  isExpanded: boolean;
  toggleExpandRow: (id: string) => void;
  moveCredit: (index: number, direction: "up" | "down") => void;
  removeCredit: (id: string) => void;
  updateCredit: (id: string, field: keyof CreditRow, value: any) => void;
  handleAudioUpload: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploadingAudio: boolean;
  setActivePickerId: (id: string | null) => void;
}

export function CreditItemCard({
  c,
  index,
  creditsCount,
  isExpanded,
  toggleExpandRow,
  moveCredit,
  removeCredit,
  updateCredit,
  handleAudioUpload,
  isUploadingAudio,
  setActivePickerId,
}: CreditItemCardProps) {
  return (
    <div
      id={index === 0 ? "klick-credits-row-0" : undefined}
      className="border border-bone/10 bg-stage/5 p-5 rounded-sm relative space-y-4 transition-all duration-300"
    >
      <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => moveCredit(index, "up")}
          className="p-1 border border-bone/10 hover:border-ember text-bone/60 hover:text-ember disabled:opacity-20 transition-all rounded cursor-pointer"
        >
          <ArrowUp size={14} />
        </button>
        <button
          type="button"
          disabled={index === creditsCount - 1}
          onClick={() => moveCredit(index, "down")}
          className="p-1 border border-bone/10 hover:border-ember text-bone/60 hover:text-ember disabled:opacity-20 transition-all rounded cursor-pointer"
        >
          <ArrowDown size={14} />
        </button>
        <button
          type="button"
          onClick={() => removeCredit(c.id)}
          className="p-1 text-bone/35 hover:text-red-400 transition-colors cursor-pointer"
          aria-label="Radera"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Grid structure for inputs */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Year */}
        <div className="md:col-span-1">
          <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">År</label>
          <input
            type="text"
            value={c.year}
            onChange={(e) => updateCredit(c.id, "year", e.target.value)}
            className="w-full bg-stage/35 border border-bone/10 text-bone px-2 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember font-mono"
          />
        </div>

        {/* Title */}
        <div className="md:col-span-4">
          <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
            Produktionstitel
          </label>
          <input
            type="text"
            value={c.title}
            onChange={(e) => updateCredit(c.id, "title", e.target.value)}
            placeholder="Titel..."
            className="w-full bg-stage/35 border border-bone/10 text-bone px-2 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember font-semibold"
          />
        </div>

        {/* Type */}
        <div className="md:col-span-2">
          <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
            Huvudtyp
          </label>
          <select
            value={c.type}
            onChange={(e) => updateCredit(c.id, "type", e.target.value)}
            className="w-full bg-stage/35 border border-bone/10 text-bone px-2 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
          >
            <option value="Film">Film</option>
            <option value="TV">TV</option>
            <option value="Theater">Teater</option>
            <option value="Voice">Röst / Voiceover</option>
          </select>
        </div>

        {/* Network */}
        <div className="md:col-span-3">
          <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
            Kanal / Nätverk / Scen
          </label>
          <input
            type="text"
            value={c.network}
            onChange={(e) => updateCredit(c.id, "network", e.target.value)}
            placeholder="SVT, Dramaten..."
            className="w-full bg-stage/35 border border-bone/10 text-bone px-2 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
          />
        </div>

        {/* Active current production flag */}
        <div className="md:col-span-2 flex items-center justify-start gap-2 pt-4 md:pt-2">
          <button
            type="button"
            onClick={() => updateCredit(c.id, "is_current_production", !c.is_current_production)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-[9px] uppercase font-mono tracking-wider transition-colors cursor-pointer border ${
              c.is_current_production
                ? "bg-ember/20 border-ember text-ember"
                : "bg-transparent border-bone/10 text-bone/40 hover:text-bone/70"
            }`}
          >
            <Star size={11} fill={c.is_current_production ? "currentColor" : "none"} />
            Aktuell
          </button>
        </div>
      </div>

      {/* Translated role & category details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-bone/5 pt-3">
        {/* Swedish values */}
        <div className="space-y-3">
          <span className="text-[8px] font-mono text-ember uppercase tracking-wider">🇸🇪 SVENSKA</span>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[8px] uppercase tracking-widest text-bone/40 font-mono mb-1">Roll</label>
              <input
                type="text"
                value={c.role_sv}
                onChange={(e) => updateCredit(c.id, "role_sv", e.target.value)}
                placeholder="Huvudroll..."
                className="w-full bg-stage/35 border border-bone/10 text-bone px-2 py-1.5 rounded-sm text-[11px] focus:outline-none focus:border-ember"
              />
            </div>
            <div>
              <label className="block text-[8px] uppercase tracking-widest text-bone/40 font-mono mb-1">
                Kategori (detaljerad)
              </label>
              <input
                type="text"
                value={c.category_sv}
                onChange={(e) => updateCredit(c.id, "category_sv", e.target.value)}
                placeholder="Humorserie..."
                className="w-full bg-stage/35 border border-bone/10 text-bone px-2 py-1.5 rounded-sm text-[11px] focus:outline-none focus:border-ember"
              />
            </div>
          </div>
        </div>

        {/* English values */}
        <div className="space-y-3">
          <span className="text-[8px] font-mono text-bone/40 uppercase tracking-wider">🇬🇧 ENGLISH</span>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[8px] uppercase tracking-widest text-bone/40 font-mono mb-1">Role</label>
              <input
                type="text"
                value={c.role_en}
                onChange={(e) => updateCredit(c.id, "role_en", e.target.value)}
                placeholder="Lead role..."
                className="w-full bg-stage/35 border border-bone/10 text-bone px-2 py-1.5 rounded-sm text-[11px] focus:outline-none focus:border-ember"
              />
            </div>
            <div>
              <label className="block text-[8px] uppercase tracking-widest text-bone/40 font-mono mb-1">
                Category (detailed)
              </label>
              <input
                type="text"
                value={c.category_en}
                onChange={(e) => updateCredit(c.id, "category_en", e.target.value)}
                placeholder="Comedy series..."
                className="w-full bg-stage/35 border border-bone/10 text-bone px-2 py-1.5 rounded-sm text-[11px] focus:outline-none focus:border-ember"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Image selection and preview */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 border-t border-bone/5 pt-3 items-start">
        <div className="md:col-span-8 space-y-3">
          <div className="space-y-1">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">
              Bild-URL (Visas i manus-förhandsvisningen vid hover)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={c.img || ""}
                onChange={(e) => updateCredit(c.id, "img", e.target.value)}
                placeholder="Skriv in bild-URL eller välj från mediabiblioteket"
                className="flex-1 bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember font-mono"
              />
              <button
                type="button"
                onClick={() => setActivePickerId(c.id + "-img")}
                className="px-3 py-1.5 bg-bone/5 hover:bg-bone/10 border border-bone/10 text-bone text-[9px] font-mono uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
              >
                Media
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[8px] uppercase tracking-widest text-bone/40 font-mono mb-1">
                Alt-Text (SEO)
              </label>
              <input
                type="text"
                value={c.img_alt || ""}
                onChange={(e) => updateCredit(c.id, "img_alt", e.target.value)}
                placeholder="Alt-text för Google..."
                className="w-full bg-stage/35 border border-bone/10 text-bone px-2 py-1 rounded-sm text-xs focus:outline-none focus:border-ember"
              />
            </div>
            <div>
              <label className="block text-[8px] uppercase tracking-widest text-bone/40 font-mono mb-1">
                Titel (Title Tag)
              </label>
              <input
                type="text"
                value={c.img_title || ""}
                onChange={(e) => updateCredit(c.id, "img_title", e.target.value)}
                placeholder="Titel..."
                className="w-full bg-stage/35 border border-bone/10 text-bone px-2 py-1 rounded-sm text-xs focus:outline-none focus:border-ember"
              />
            </div>
            <div>
              <label className="block text-[8px] uppercase tracking-widest text-bone/40 font-mono mb-1">
                Bildtext (Caption)
              </label>
              <input
                type="text"
                value={c.img_caption || ""}
                onChange={(e) => updateCredit(c.id, "img_caption", e.target.value)}
                placeholder="Bildtext..."
                className="w-full bg-stage/35 border border-bone/10 text-bone px-2 py-1 rounded-sm text-xs focus:outline-none focus:border-ember"
              />
            </div>
            <div>
              <label className="block text-[8px] uppercase tracking-widest text-bone/40 font-mono mb-1">
                Sökoptimerat Filnamn
              </label>
              <input
                type="text"
                value={c.img_filename || ""}
                onChange={(e) => updateCredit(c.id, "img_filename", e.target.value)}
                placeholder="ex. therese-merit.webp"
                className="w-full bg-stage/35 border border-bone/10 text-bone px-2 py-1 rounded-sm text-xs focus:outline-none focus:border-ember font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[8px] uppercase tracking-widest text-bone/40 font-mono mb-1">
                Beskrivning (Description - WordPress-stil)
              </label>
              <textarea
                value={c.img_description || ""}
                onChange={(e) => updateCredit(c.id, "img_description", e.target.value)}
                placeholder="Längre beskrivning för mediabiblioteket/SEO..."
                rows={2}
                className="w-full bg-stage/35 border border-bone/10 text-bone px-2 py-1 rounded-sm text-xs focus:outline-none focus:border-ember resize-none"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-4 flex items-center gap-3 pt-4 md:pt-6">
          {c.img ? (
            <>
              <img
                src={c.img}
                alt="Meritförhandsvisning"
                className="h-14 w-14 object-cover border border-bone/10 rounded-sm"
              />
              <button
                type="button"
                onClick={() => {
                  updateCredit(c.id, "img", "");
                  updateCredit(c.id, "img_alt", "");
                  updateCredit(c.id, "img_caption", "");
                  updateCredit(c.id, "img_title", "");
                  updateCredit(c.id, "img_filename", "");
                  updateCredit(c.id, "img_description", "");
                }}
                className="text-[8px] uppercase tracking-widest text-red-400 hover:text-red-300 font-mono transition-colors cursor-pointer"
              >
                Ta bort bild
              </button>
            </>
          ) : (
            <div className="text-[8px] uppercase tracking-widest text-bone/25 font-mono italic">
              Ingen bild vald
            </div>
          )}
        </div>
      </div>

      {/* Advanced collapsable: Audio recordings and scripts */}
      <div className="border-t border-bone/5 pt-3">
        <button
          type="button"
          id={index === 0 ? "klick-credits-advanced-toggle-0" : undefined}
          onClick={() => toggleExpandRow(c.id)}
          className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-bone/40 hover:text-ember transition-colors font-mono cursor-pointer"
        >
          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {isExpanded ? "Dölj Röstkommentar & Manus (Avancerat)" : "Visa Röstkommentar & Manus (Avancerat)"}
          {(c.commentary_url || c.script_scene) && (
            <span className="ml-2 px-1.5 py-0.5 bg-ember/15 text-ember text-[8px] rounded-sm font-semibold">
              Aktiv
            </span>
          )}
        </button>

        {isExpanded && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8 bg-stage/15 p-4 rounded border border-bone/5 animate-fadeIn">
            {/* Audio commentary section */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-ember flex items-center gap-1.5 border-b border-bone/5 pb-1">
                <Volume2 size={12} /> Röstkommentar / Audio clip
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                    Ljudfil (URL)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={c.commentary_url || ""}
                      onChange={(e) => updateCredit(c.id, "commentary_url", e.target.value)}
                      placeholder="https://exempel.se/ljud.mp3"
                      className="flex-1 bg-stage/35 border border-bone/10 text-bone px-2 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setActivePickerId(c.id)}
                      className="px-3 bg-bone/10 hover:bg-bone/20 text-bone rounded-sm text-xs transition-colors cursor-pointer"
                      title="Välj från mediebibliotek"
                    >
                      <Music size={12} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                    Ljudfil Uppladdning
                  </label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => handleAudioUpload(c.id, e)}
                    disabled={isUploadingAudio}
                    className="hidden"
                    id={`audio-file-upload-${c.id}`}
                  />
                  <label
                    htmlFor={`audio-file-upload-${c.id}`}
                    id={index === 0 ? "klick-credits-audio-upload-0" : undefined}
                    className="w-full flex items-center justify-center gap-1 border border-dashed border-bone/20 hover:border-ember bg-stage/20 py-1.5 rounded-sm text-[10px] font-mono text-bone/50 hover:text-bone cursor-pointer transition-colors"
                  >
                    <Upload size={11} />
                    Välj Ljudfil
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                  Längd (t.ex. "0:45" eller "1:15")
                </label>
                <input
                  type="text"
                  value={c.commentary_duration || ""}
                  onChange={(e) => updateCredit(c.id, "commentary_duration", e.target.value)}
                  placeholder="0:10"
                  className="w-32 bg-stage/35 border border-bone/10 text-bone px-2 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember font-mono"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                    Kommentartext (Svenska)
                  </label>
                  <textarea
                    value={c.commentary_sv || ""}
                    onChange={(e) => updateCredit(c.id, "commentary_sv", e.target.value)}
                    placeholder="Therese berättar om rollen..."
                    rows={3}
                    className="w-full bg-stage/35 border border-bone/10 text-bone p-2 rounded-sm text-xs focus:outline-none focus:border-ember resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                    Commentary Text (English)
                  </label>
                  <textarea
                    value={c.commentary_en || ""}
                    onChange={(e) => updateCredit(c.id, "commentary_en", e.target.value)}
                    placeholder="Therese talks about the role..."
                    rows={3}
                    className="w-full bg-stage/35 border border-bone/10 text-bone p-2 rounded-sm text-xs focus:outline-none focus:border-ember resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Script dialogue section */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-ember flex items-center gap-1.5 border-b border-bone/5 pb-1">
                <AlignLeft size={12} /> Manusrader / Script Dialogue
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                    Scennamn (t.ex. "SCEN 12")
                  </label>
                  <input
                    type="text"
                    value={c.script_scene || ""}
                    onChange={(e) => updateCredit(c.id, "script_scene", e.target.value)}
                    placeholder="SCEN 12 — Teater"
                    className="w-full bg-stage/35 border border-bone/10 text-bone px-2 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                    Karaktär / Rollfigur
                  </label>
                  <input
                    type="text"
                    value={c.script_char || ""}
                    onChange={(e) => updateCredit(c.id, "script_char", e.target.value)}
                    placeholder="Nora"
                    className="w-full bg-stage/35 border border-bone/10 text-bone px-2 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                    Manus Repliker (Svenska)
                  </label>
                  <textarea
                    value={c.script_line_sv || ""}
                    onChange={(e) => updateCredit(c.id, "script_line_sv", e.target.value)}
                    placeholder="Det fanns ingen återvändo..."
                    rows={3}
                    className="w-full bg-stage/35 border border-bone/10 text-bone p-2 rounded-sm text-xs focus:outline-none focus:border-ember resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                    Script Line (English)
                  </label>
                  <textarea
                    value={c.script_line_en || ""}
                    onChange={(e) => updateCredit(c.id, "script_line_en", e.target.value)}
                    placeholder="There was no turning back..."
                    rows={3}
                    className="w-full bg-stage/35 border border-bone/10 text-bone p-2 rounded-sm text-xs focus:outline-none focus:border-ember resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
