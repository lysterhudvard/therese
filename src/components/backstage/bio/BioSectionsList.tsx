import React from "react";
import { Trash2, Quote } from "lucide-react";
import { BioSection } from "./types";

interface BioSectionsListProps {
  bioSections: BioSection[];
  addBioSection: () => void;
  removeBioSection: (id: string) => void;
  updateBioSection: (id: string, updates: Partial<BioSection>) => void;
  openMediaPickerForSection: (id: string) => void;
}

export function BioSectionsList({
  bioSections,
  addBioSection,
  removeBioSection,
  updateBioSection,
  openMediaPickerForSection,
}: BioSectionsListProps) {
  return (
    <div className="bg-stage/5 border border-bone/10 p-6 rounded-sm space-y-6">
      <div className="flex items-center justify-between border-b border-bone/5 pb-2">
        <h3 className="text-xs uppercase tracking-widest text-bone font-mono flex items-center gap-1.5">
          <Quote size={14} className="text-ember" /> Biografisektioner (Dynamic Sections)
        </h3>
        <button
          type="button"
          onClick={addBioSection}
          className="px-3 py-1 bg-bone/10 hover:bg-bone/20 text-bone font-mono text-[9px] uppercase tracking-widest rounded-sm transition-colors cursor-pointer"
        >
          + Lägg till sektion
        </button>
      </div>
      <p className="text-[9px] text-bone/45 font-mono uppercase tracking-wider">
        Anpassa befintliga sektioner eller lägg till nya. Sektionerna sorteras efter vikt (lägre visas först).
      </p>

      <div className="space-y-6">
        {[...bioSections]
          .sort((a, b) => (a.weight || 300) - (b.weight || 300))
          .map((section, idx) => (
            <div key={section.id} className="border border-bone/10 bg-stage/15 p-4 rounded-sm space-y-4 relative">
              <div className="flex justify-between items-center border-b border-bone/5 pb-2">
                <span className="text-[10px] font-mono text-ember uppercase tracking-wider">
                  Sektion #{idx + 1}: {section.title_sv || "Namnlös"}
                </span>
                <button
                  type="button"
                  onClick={() => removeBioSection(section.id)}
                  className="text-bone/35 hover:text-red-400 transition-colors cursor-pointer animate-pulse-slow"
                >
                  <Trash2 size={12} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                    Rubrik (Svenska)
                  </label>
                  <input
                    type="text"
                    value={section.title_sv}
                    onChange={(e) => updateBioSection(section.id, { title_sv: e.target.value })}
                    placeholder="t.ex. Dramatisk"
                    className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
                  />
                </div>
                <div>
                  <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                    Rubrik (Engelska)
                  </label>
                  <input
                    type="text"
                    value={section.title_en}
                    onChange={(e) => updateBioSection(section.id, { title_en: e.target.value })}
                    placeholder="t.ex. Dramatic"
                    className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                    Citat (Svenska)
                  </label>
                  <textarea
                    value={section.quote_sv}
                    onChange={(e) => updateBioSection(section.id, { quote_sv: e.target.value })}
                    rows={2}
                    placeholder="Drama är något jag..."
                    className="w-full bg-stage/35 border border-bone/10 text-bone p-2 rounded-sm text-xs focus:outline-none focus:border-ember resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                    Citat (Engelska)
                  </label>
                  <textarea
                    value={section.quote_en}
                    onChange={(e) => updateBioSection(section.id, { quote_en: e.target.value })}
                    rows={2}
                    placeholder="Drama is something..."
                    className="w-full bg-stage/35 border border-bone/10 text-bone p-2 rounded-sm text-xs focus:outline-none focus:border-ember resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                <div className="md:col-span-3 space-y-4">
                  <div className="space-y-2">
                    <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">
                      Bild-URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={section.image}
                        onChange={(e) => updateBioSection(section.id, { image: e.target.value })}
                        placeholder="https://..."
                        className="flex-1 bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
                      />
                      <button
                        type="button"
                        onClick={() => openMediaPickerForSection(section.id)}
                        className="px-3 py-2 bg-bone/5 hover:bg-bone/10 border border-bone/10 text-bone text-[9px] font-mono uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                      >
                        Media
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                        Alt-Text (SEO)
                      </label>
                      <input
                        type="text"
                        value={section.image_alt || ""}
                        onChange={(e) => updateBioSection(section.id, { image_alt: e.target.value })}
                        placeholder="Alt-text för Google..."
                        className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                        Titel (Titel Tag)
                      </label>
                      <input
                        type="text"
                        value={section.image_title || ""}
                        onChange={(e) => updateBioSection(section.id, { image_title: e.target.value })}
                        placeholder="Titel..."
                        className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                        Bildtext (Caption)
                      </label>
                      <input
                        type="text"
                        value={section.image_caption || ""}
                        onChange={(e) => updateBioSection(section.id, { image_caption: e.target.value })}
                        placeholder="Bildtext..."
                        className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                        Sökoptimerat Filnamn
                      </label>
                      <input
                        type="text"
                        value={section.image_filename || ""}
                        onChange={(e) => updateBioSection(section.id, { image_filename: e.target.value })}
                        placeholder="ex. therese-comedic.webp"
                        className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                        Beskrivning (Description)
                      </label>
                      <textarea
                        value={section.description || ""}
                        onChange={(e) => updateBioSection(section.id, { description: e.target.value })}
                        placeholder="Längre beskrivning..."
                        rows={2}
                        className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1 rounded-sm text-xs focus:outline-none focus:border-ember resize-none"
                      />
                    </div>
                  </div>
                </div>
                <div className="md:col-span-1 flex flex-col items-center">
                  <span className="text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                    Förhandsvisning
                  </span>
                  {section.image ? (
                    <img
                      src={section.image}
                      alt={section.title_sv}
                      className="w-10 aspect-[3/4] h-auto object-cover border border-bone/15 rounded-sm"
                    />
                  ) : (
                    <div className="h-14 w-14 border border-dashed border-bone/10 flex items-center justify-center text-bone/20 text-[8px] font-mono">
                      Ingen bild
                    </div>
                  )}
                </div>
              </div>

              <div className="w-32">
                <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                  Sorteringsvikt
                </label>
                <input
                  type="number"
                  value={section.weight || 300}
                  onChange={(e) => updateBioSection(section.id, { weight: parseInt(e.target.value) || 300 })}
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
