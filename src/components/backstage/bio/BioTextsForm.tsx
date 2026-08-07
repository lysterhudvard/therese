import React from "react";
import { FileText } from "lucide-react";

interface BioTextsFormProps {
  headingSv: string;
  setHeadingSv: (val: string) => void;
  headingEn: string;
  setHeadingEn: (val: string) => void;
}

export function BioTextsForm({
  headingSv,
  setHeadingSv,
  headingEn,
  setHeadingEn,
}: BioTextsFormProps) {
  return (
    <div className="bg-stage/5 border border-bone/10 p-6 rounded-sm space-y-6">
      <h3 className="text-xs uppercase tracking-widest text-bone font-mono flex items-center gap-1.5 border-b border-bone/5 pb-2">
        <FileText size={14} className="text-ember" /> Biografiska Texter
      </h3>

      {/* Heading */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">
            Rubrik (Svenska)
          </label>
          <input
            type="text"
            id="klick-bio-heading-sv"
            value={headingSv}
            onChange={(e) => setHeadingSv((e.target as any).value)}
            placeholder="En skådespelerska med bredd..."
            className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">
            Heading (English)
          </label>
          <input
            type="text"
            id="klick-bio-heading-en"
            value={headingEn}
            onChange={(e) => setHeadingEn((e.target as any).value)}
            placeholder="An actress with range..."
            className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
          />
        </div>
      </div>
    </div>
  );
}
