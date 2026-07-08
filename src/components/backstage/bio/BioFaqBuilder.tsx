import React from "react";
import { HelpCircle, Trash2 } from "lucide-react";
import { FAQItem } from "./types";

interface BioFaqBuilderProps {
  faqs: FAQItem[];
  addFaq: () => void;
  removeFaq: (id: string) => void;
  updateFaq: (id: string, field: "q" | "a", lang: "sv" | "en", value: string) => void;
}

export function BioFaqBuilder({ faqs, addFaq, removeFaq, updateFaq }: BioFaqBuilderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-bone/5 pb-2">
        <h3 className="text-xs uppercase tracking-widest text-bone font-mono flex items-center gap-1.5">
          <HelpCircle size={14} className="text-ember" /> FAQ Builder & AEO Scheman
        </h3>
        <button
          type="button"
          id="klick-bio-add-faq"
          onClick={addFaq}
          className="px-3 py-1 bg-bone/10 hover:bg-bone/20 text-bone font-mono text-[9px] uppercase tracking-widest rounded-sm transition-colors cursor-pointer"
        >
          + Lägg till FAQ
        </button>
      </div>
      <p className="text-[9px] text-bone/40 font-mono">
        Frågor och svar här genereras automatiskt som ett FAQPage JSON-LD schema för att ge direkt svar i Google AI Overviews & ChatGPT.
      </p>

      <div className="space-y-6 mt-4">
        {faqs.map((faq, index) => (
          <div key={faq.id} className="border border-bone/5 bg-stage/5 p-4 rounded-sm relative space-y-4">
            <button
              type="button"
              onClick={() => removeFaq(faq.id)}
              className="absolute top-4 right-4 text-bone/35 hover:text-red-400 transition-colors cursor-pointer"
              aria-label="Ta bort"
            >
              <Trash2 size={14} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {/* SV FAQ */}
              <div className="space-y-3">
                <span className="text-[8px] font-mono text-ember uppercase tracking-wider">🇸🇪 SVENSKA #{index + 1}</span>
                <input
                  type="text"
                  value={faq.q.sv}
                  onChange={(e) => updateFaq(faq.id, "q", "sv", e.target.value)}
                  placeholder="Skriv fråga på svenska..."
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
                />
                <textarea
                  value={faq.a.sv}
                  onChange={(e) => updateFaq(faq.id, "a", "sv", e.target.value)}
                  placeholder="Skriv svar på svenska..."
                  rows={2}
                  className="w-full bg-stage/35 border border-bone/10 text-bone p-3 rounded-sm text-xs focus:outline-none focus:border-ember resize-none"
                />
              </div>

              {/* EN FAQ */}
              <div className="space-y-3">
                <span className="text-[8px] font-mono text-bone/40 uppercase tracking-wider">🇬🇧 ENGLISH #{index + 1}</span>
                <input
                  type="text"
                  value={faq.q.en}
                  onChange={(e) => updateFaq(faq.id, "q", "en", e.target.value)}
                  placeholder="Write question in English..."
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
                />
                <textarea
                  value={faq.a.en}
                  onChange={(e) => updateFaq(faq.id, "a", "en", e.target.value)}
                  placeholder="Write answer in English..."
                  rows={2}
                  className="w-full bg-stage/35 border border-bone/10 text-bone p-3 rounded-sm text-xs focus:outline-none focus:border-ember resize-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
