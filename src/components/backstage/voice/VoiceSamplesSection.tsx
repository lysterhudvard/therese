import React from "react";
import { Volume2, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { moveArrayItem, VoiceSample } from "../../../lib/utils";

interface VoiceSamplesSectionProps {
  samples: VoiceSample[];
  onChangeSamples: (next: VoiceSample[]) => void;
  onPickAudio: (sampleId: string) => void;
}

export function VoiceSamplesSection({
  samples,
  onChangeSamples,
  onPickAudio,
}: VoiceSamplesSectionProps) {
  const handleAddSample = () => {
    const nextIdx = samples.length + 1;
    onChangeSamples([
      ...samples,
      {
        id: `sample-${Date.now()}`,
        title_sv: `Röstprov ${nextIdx}`,
        title_en: `Voice Sample ${nextIdx}`,
        url: "",
      },
    ]);
  };

  const handleFieldChange = (id: string, field: keyof VoiceSample, value: string) => {
    onChangeSamples(samples.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleRemove = (id: string) => {
    const remaining = samples.filter((s) => s.id !== id);
    onChangeSamples(
      remaining.length > 0
        ? remaining
        : [{ id: `sample-${Date.now()}`, title_sv: "Röstprov", title_en: "Voice Sample", url: "" }]
    );
  };

  return (
    <div className="bg-stage/5 border border-bone/10 p-6 rounded-sm space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-bone/5 pb-2">
        <h3 className="text-xs uppercase tracking-widest text-bone font-mono flex items-center gap-1.5">
          <Volume2 size={14} className="text-ember" /> Röstprov (Ljudfiler)
        </h3>
        <button
          type="button"
          onClick={handleAddSample}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ember/15 hover:bg-ember/25 border border-ember/40 text-ember text-[9px] font-mono uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
        >
          <Plus size={12} /> Lägg till röstprov
        </button>
      </div>

      <p className="text-[10px] text-bone/40 font-mono uppercase tracking-wider">
        Lägg till ett eller flera röstprov (.mp3, .wav, etc.) som besökare kan spela upp direkt under Akt VI / Röst &amp; Dubbning.
      </p>

      <div className="space-y-4">
        {samples.map((sample, idx) => (
          <div key={sample.id} className="border border-bone/10 bg-stage/20 p-4 rounded-sm space-y-4">
            <div className="flex items-center justify-between border-b border-bone/5 pb-2">
              <span className="text-[9px] font-mono uppercase tracking-widest text-ember">
                Röstprov #{idx + 1}
              </span>
              <div className="flex items-center gap-1.5">
                {samples.length > 1 && (
                  <>
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => onChangeSamples(moveArrayItem(samples, idx, "up"))}
                      className="p-1 border border-bone/10 hover:border-ember text-bone/60 hover:text-ember disabled:opacity-20 rounded cursor-pointer"
                      title="Flytta upp"
                    >
                      <ArrowUp size={11} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === samples.length - 1}
                      onClick={() => onChangeSamples(moveArrayItem(samples, idx, "down"))}
                      className="p-1 border border-bone/10 hover:border-ember text-bone/60 hover:text-ember disabled:opacity-20 rounded cursor-pointer"
                      title="Flytta ner"
                    >
                      <ArrowDown size={11} />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(sample.id)}
                  className="p-1 border border-bone/10 hover:border-red-400 text-bone/40 hover:text-red-400 rounded cursor-pointer"
                  title="Ta bort röstprov"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">
                  Titel (Svenska)
                </label>
                <input
                  type="text"
                  value={sample.title_sv}
                  onChange={(e) => handleFieldChange(sample.id, "title_sv", (e.target as any).value)}
                  placeholder="t.ex. Skånsk reklamröst"
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">
                  Title (English)
                </label>
                <input
                  type="text"
                  value={sample.title_en}
                  onChange={(e) => handleFieldChange(sample.id, "title_en", (e.target as any).value)}
                  placeholder="e.g. Scanian Commercial Voice"
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">
                Ljudfils-URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id={idx === 0 ? "klick-voice-sample-url" : undefined}
                  value={sample.url}
                  onChange={(e) => handleFieldChange(sample.id, "url", (e.target as any).value)}
                  placeholder="Skriv in ljudfilens URL eller klicka på Välj Ljud för att hämta från mediebiblioteket"
                  className="flex-1 bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember font-mono"
                />
                <button
                  type="button"
                  onClick={() => onPickAudio(sample.id)}
                  className="px-3 py-2 bg-bone/5 hover:bg-bone/10 border border-bone/10 text-bone text-[9px] font-mono uppercase tracking-wider rounded-sm transition-colors cursor-pointer shrink-0"
                >
                  Välj Ljud
                </button>
              </div>
            </div>

            {sample.url && (
              <div className="pt-1">
                <audio src={sample.url} controls className="max-w-md w-full" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

