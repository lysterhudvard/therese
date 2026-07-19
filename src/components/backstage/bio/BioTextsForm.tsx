import React from "react";
import { FileText } from "lucide-react";
import { FormattingToolbar } from "../FormattingToolbar";

interface BioTextsFormProps {
  headingSv: string;
  setHeadingSv: (val: string) => void;
  headingEn: string;
  setHeadingEn: (val: string) => void;
  paragraph1Sv: string;
  setParagraph1Sv: (val: string) => void;
  paragraph1En: string;
  setParagraph1En: (val: string) => void;
  paragraph2Sv: string;
  setParagraph2Sv: (val: string) => void;
  paragraph2En: string;
  setParagraph2En: (val: string) => void;
  paragraph3Sv: string;
  setParagraph3Sv: (val: string) => void;
  paragraph3En: string;
  setParagraph3En: (val: string) => void;
}

export function BioTextsForm({
  headingSv,
  setHeadingSv,
  headingEn,
  setHeadingEn,
  paragraph1Sv,
  setParagraph1Sv,
  paragraph1En,
  setParagraph1En,
  paragraph2Sv,
  setParagraph2Sv,
  paragraph2En,
  setParagraph2En,
  paragraph3Sv,
  setParagraph3Sv,
  paragraph3En,
  setParagraph3En,
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
            onChange={(e) => setHeadingSv(e.target.value)}
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
            onChange={(e) => setHeadingEn(e.target.value)}
            placeholder="An actress with range..."
            className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
          />
        </div>
      </div>

      {/* Paragraph 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">
              Paragraf 1 (Svenska)
            </label>
            <FormattingToolbar
              textareaId="klick-bio-p1-sv"
              value={paragraph1Sv}
              onValueChange={setParagraph1Sv}
            />
          </div>
          <textarea
            id="klick-bio-p1-sv"
            value={paragraph1Sv}
            onChange={(e) => setParagraph1Sv(e.target.value)}
            rows={4}
            placeholder="Therese var senast aktuell i..."
            className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-b-sm rounded-t-none border-t-0 text-xs focus:outline-none focus:border-ember resize-none font-sans"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">
              Paragraph 1 (English)
            </label>
            <FormattingToolbar
              textareaId="klick-bio-p1-en"
              value={paragraph1En}
              onValueChange={setParagraph1En}
            />
          </div>
          <textarea
            id="klick-bio-p1-en"
            value={paragraph1En}
            onChange={(e) => setParagraph1En(e.target.value)}
            rows={4}
            placeholder="Therese was most recently seen in..."
            className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-b-sm rounded-t-none border-t-0 text-xs focus:outline-none focus:border-ember resize-none font-sans"
          />
        </div>
      </div>

      {/* Paragraph 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">
              Paragraf 2 (Svenska)
            </label>
            <FormattingToolbar
              textareaId="klick-bio-p2-sv"
              value={paragraph2Sv}
              onValueChange={setParagraph2Sv}
            />
          </div>
          <textarea
            id="klick-bio-p2-sv"
            value={paragraph2Sv}
            onChange={(e) => setParagraph2Sv(e.target.value)}
            rows={4}
            placeholder="Hon har spelat teater och musikal sedan..."
            className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-b-sm rounded-t-none border-t-0 text-xs focus:outline-none focus:border-ember resize-none font-sans"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">
              Paragraph 2 (English)
            </label>
            <FormattingToolbar
              textareaId="klick-bio-p2-en"
              value={paragraph2En}
              onValueChange={setParagraph2En}
            />
          </div>
          <textarea
            id="klick-bio-p2-en"
            value={paragraph2En}
            onChange={(e) => setParagraph2En(e.target.value)}
            rows={4}
            placeholder="She has performed theatre and musicals since..."
            className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-b-sm rounded-t-none border-t-0 text-xs focus:outline-none focus:border-ember resize-none font-sans"
          />
        </div>
      </div>

      {/* Paragraph 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">
              Paragraf 3 (Svenska)
            </label>
            <FormattingToolbar
              textareaId="klick-bio-p3-sv"
              value={paragraph3Sv}
              onValueChange={setParagraph3Sv}
            />
          </div>
          <textarea
            id="klick-bio-p3-sv"
            value={paragraph3Sv}
            onChange={(e) => setParagraph3Sv(e.target.value)}
            rows={3}
            placeholder="Drama är något som Therese känner..."
            className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-b-sm rounded-t-none border-t-0 text-xs focus:outline-none focus:border-ember resize-none font-sans"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">
              Paragraph 3 (English)
            </label>
            <FormattingToolbar
              textareaId="klick-bio-p3-en"
              value={paragraph3En}
              onValueChange={setParagraph3En}
            />
          </div>
          <textarea
            id="klick-bio-p3-en"
            value={paragraph3En}
            onChange={(e) => setParagraph3En(e.target.value)}
            rows={3}
            placeholder="Drama is something Therese feels..."
            className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-b-sm rounded-t-none border-t-0 text-xs focus:outline-none focus:border-ember resize-none font-sans"
          />
        </div>
      </div>
    </div>
  );
}
