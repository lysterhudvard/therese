import React from "react";
import { FileText } from "lucide-react";

interface BioImageCreditsProps {
  imageCreditsSv: string;
  setImageCreditsSv: (val: string) => void;
  imageCreditsEn: string;
  setImageCreditsEn: (val: string) => void;
}

export function BioImageCredits({
  imageCreditsSv,
  setImageCreditsSv,
  imageCreditsEn,
  setImageCreditsEn,
}: BioImageCreditsProps) {
  return (
    <div className="bg-stage/5 border border-bone/10 p-6 rounded-sm space-y-6">
      <h3 className="text-xs uppercase tracking-widest text-bone font-mono flex items-center gap-1.5 border-b border-bone/5 pb-2">
        <FileText size={14} className="text-ember" /> Fotokredd (Biografibild undertext)
      </h3>
      <p className="text-[9px] text-bone/45 font-mono uppercase tracking-wider">
        Fotokredd som visas direkt under den stående biografibilden till vänster om texten.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-2">
            Kreditering (Svenska)
          </label>
          <textarea
            value={imageCreditsSv}
            onChange={(e) => setImageCreditsSv(e.target.value)}
            rows={2}
            placeholder="Foto: Robert Eldrim..."
            className="w-full bg-stage/35 border border-bone/10 text-bone p-3 rounded-sm text-xs focus:outline-none focus:border-ember resize-none font-sans"
          />
        </div>
        <div>
          <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-2">
            Credit (English)
          </label>
          <textarea
            value={imageCreditsEn}
            onChange={(e) => setImageCreditsEn(e.target.value)}
            rows={2}
            placeholder="Photo: Robert Eldrim..."
            className="w-full bg-stage/35 border border-bone/10 text-bone p-3 rounded-sm text-xs focus:outline-none focus:border-ember resize-none font-sans"
          />
        </div>
      </div>
    </div>
  );
}
