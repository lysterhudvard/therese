import React from "react";

interface BioQuickFactsProps {
  dialectsSv: string;
  setDialectsSv: (val: string) => void;
  dialectsEn: string;
  setDialectsEn: (val: string) => void;
  languagesSv: string;
  setLanguagesSv: (val: string) => void;
  languagesEn: string;
  setLanguagesEn: (val: string) => void;
}

export function BioQuickFacts({
  dialectsSv,
  setDialectsSv,
  dialectsEn,
  setDialectsEn,
  languagesSv,
  setLanguagesSv,
  languagesEn,
  setLanguagesEn,
}: BioQuickFactsProps) {
  return (
    <div className="bg-stage/10 border border-bone/5 p-6 rounded-sm space-y-6">
      <h3 className="text-xs uppercase tracking-widest text-bone font-mono border-b border-bone/5 pb-2">
        Fakta & Egenskaper (Quick Facts)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[9px] uppercase tracking-widest text-bone/40 mb-2 font-mono">
            Dialekter (Svenska)
          </label>
          <input
            type="text"
            id="klick-bio-dialects-sv"
            value={dialectsSv}
            onChange={(e) => setDialectsSv(e.target.value)}
            className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
          />
        </div>
        <div>
          <label className="block text-[9px] uppercase tracking-widest text-bone/40 mb-2 font-mono">
            Dialects (English)
          </label>
          <input
            type="text"
            id="klick-bio-dialects-en"
            value={dialectsEn}
            onChange={(e) => setDialectsEn(e.target.value)}
            className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
          />
        </div>
        <div>
          <label className="block text-[9px] uppercase tracking-widest text-bone/40 mb-2 font-mono">
            Språk (Svenska)
          </label>
          <input
            type="text"
            id="klick-bio-languages-sv"
            value={languagesSv}
            onChange={(e) => setLanguagesSv(e.target.value)}
            className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
          />
        </div>
        <div>
          <label className="block text-[9px] uppercase tracking-widest text-bone/40 mb-2 font-mono">
            Languages (English)
          </label>
          <input
            type="text"
            id="klick-bio-languages-en"
            value={languagesEn}
            onChange={(e) => setLanguagesEn(e.target.value)}
            className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
          />
        </div>
      </div>
    </div>
  );
}
