import React from "react";
import { Quote, Trash2 } from "lucide-react";
import { ReviewQuoteItem } from "./types";

interface BioReviewQuotesProps {
  reviewQuotes: ReviewQuoteItem[];
  addReviewQuote: () => void;
  removeReviewQuote: (id: string) => void;
  updateReviewQuote: (id: string, lang: "sv" | "en", value: string) => void;
}

export function BioReviewQuotes({
  reviewQuotes,
  addReviewQuote,
  removeReviewQuote,
  updateReviewQuote,
}: BioReviewQuotesProps) {
  return (
    <div className="space-y-4 bg-stage/10 border border-bone/5 p-6 rounded-sm">
      <div className="flex items-center justify-between border-b border-bone/5 pb-2">
        <h3 className="text-xs uppercase tracking-widest text-bone font-mono flex items-center gap-1.5">
          <Quote size={14} className="text-ember" /> Bakgrundscitat (Scrolling Background Quotes)
        </h3>
        <button
          type="button"
          onClick={addReviewQuote}
          className="px-3 py-1 bg-bone/10 hover:bg-bone/20 text-bone font-mono text-[9px] uppercase tracking-widest rounded-sm transition-colors cursor-pointer"
        >
          + Lägg till citat
        </button>
      </div>
      <p className="text-[9px] text-bone/40 font-mono">
        Citat och pressröster som rullar i bakgrunden i meriter-sektionen på hemsidan.
      </p>

      <div className="space-y-3 mt-4">
        {reviewQuotes.map((qItem, index) => (
          <div key={qItem.id} className="flex gap-4 items-center border border-bone/10 bg-stage/15 p-3 rounded-sm relative">
            <span className="text-[9px] font-mono text-ember/65 select-none w-4">{index + 1}</span>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                value={qItem.sv}
                onChange={(e) => updateReviewQuote(qItem.id, "sv", e.target.value)}
                placeholder="Citat på svenska..."
                className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
              />
              <input
                type="text"
                value={qItem.en}
                onChange={(e) => updateReviewQuote(qItem.id, "en", e.target.value)}
                placeholder="Quote in English..."
                className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
              />
            </div>
            <button
              type="button"
              onClick={() => removeReviewQuote(qItem.id)}
              className="text-bone/35 hover:text-red-400 transition-colors cursor-pointer"
              aria-label="Ta bort"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
