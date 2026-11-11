import React from "react";
import {
  Volume2,
  AlignLeft,
  Upload,
  Music,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { CreditRow } from "./types";

export interface CreditAdvancedSectionProps {
  c: CreditRow;
  index: number;
  isExpanded: boolean;
  toggleExpandRow: (id: string) => void;
  updateCredit: (id: string, field: keyof CreditRow, value: any) => void;
  handleAudioUpload: (id: string, e: any) => void;
  isUploadingAudio: boolean;
  setActivePickerId: (id: string | null) => void;
}

export function CreditAdvancedSection({
  c,
  index,
  isExpanded,
  toggleExpandRow,
  updateCredit,
  handleAudioUpload,
  isUploadingAudio,
  setActivePickerId,
}: CreditAdvancedSectionProps) {
  return (
    <div className="border-t border-bone/5 pt-3">
      <button
        type="button"
        id={index === 0 ? "klick-credits-advanced-toggle-0" : undefined}
        onClick={() => toggleExpandRow(c.id)}
        className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-bone/50 hover:text-ember transition-colors font-mono cursor-pointer"
      >
        {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        {isExpanded
          ? "Dölj Ljudklipp & Manus (Röstkommentar som spelas på sajten)"
          : "Visa Ljudklipp & Manus (Röstkommentar som spelas på sajten)"}
        {c.commentary_url && (
          <span className="ml-2 px-1.5 py-0.5 bg-ember/15 text-ember text-[8px] rounded-sm font-semibold flex items-center gap-1">
            <Volume2 size={10} /> Ljudklipp aktivt
          </span>
        )}
        {c.script_scene && (
          <span className="ml-1 px-1.5 py-0.5 bg-bone/10 text-bone/70 text-[8px] rounded-sm font-semibold">
            Manus aktivt
          </span>
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8 bg-stage/15 p-4 rounded border border-bone/5 animate-fadeIn">
          {/* Audio commentary section */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-ember flex items-center gap-1.5 border-b border-bone/5 pb-1">
              <Volume2 size={12} /> Ljudklipp / Röstkommentar (spelas direkt på sajten)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                  Ljudfil (URL till .mp3 / .wav)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={c.commentary_url || ""}
                    onChange={(e) => updateCredit(c.id, "commentary_url", (e.target as any).value)}
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
                onChange={(e) => updateCredit(c.id, "commentary_duration", (e.target as any).value)}
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
                  onChange={(e) => updateCredit(c.id, "commentary_sv", (e.target as any).value)}
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
                  onChange={(e) => updateCredit(c.id, "commentary_en", (e.target as any).value)}
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
                  onChange={(e) => updateCredit(c.id, "script_scene", (e.target as any).value)}
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
                  onChange={(e) => updateCredit(c.id, "script_char", (e.target as any).value)}
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
                  onChange={(e) => updateCredit(c.id, "script_line_sv", (e.target as any).value)}
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
                  onChange={(e) => updateCredit(c.id, "script_line_en", (e.target as any).value)}
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
  );
}

