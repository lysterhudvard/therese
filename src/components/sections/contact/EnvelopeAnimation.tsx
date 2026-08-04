import React from "react";
import { motion } from "framer-motion";
const MotionDiv = motion.div as any;

interface EnvelopeAnimationProps {
  status: string;
  form: { name: string; email: string; msg: string };
  t: any;
}

export function EnvelopeAnimation({ status, form, t }: EnvelopeAnimationProps) {
  if (status === "idle" || status === "sent") return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');
      `}</style>
      <MotionDiv
        className="relative w-[300px] h-[200px] md:w-[380px] md:h-[250px]"
        style={{ transformStyle: "preserve-3d", WebkitTransformStyle: "preserve-3d" }}
        initial={{ scale: 0.85, opacity: 0, y: 100 }}
        animate={
          status === "flying"
            ? { rotateY: 180, y: -600, x: 50, rotateZ: 10, scale: 0.5, opacity: 0 }
            : status === "flipping" || status === "writing"
            ? { rotateY: 180, scale: 1, opacity: 1, y: 0 }
            : { rotateY: 0, scale: 1, opacity: 1, y: 0 }
        }
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* ENVELOPE BACK (Flap Side) */}
        <div 
          className="absolute inset-0"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          {/* Envelope Back Wall */}
          <div className="absolute inset-0 bg-[#cbb8a0] rounded-sm shadow-inner" />

          {/* FAKE LETTER */}
          <MotionDiv
            className="absolute top-3 left-4 right-4 md:top-4 md:left-6 md:right-6 bg-stage border border-bone/10 p-4 md:p-5 rounded-sm flex flex-col justify-between shadow-lg z-10 h-[150px] md:h-[190px]"
            initial={{ y: -150 }}
            animate={
              status === "dropping" || status === "closing" || status === "flipping"
                ? { y: 15 }
                : { y: -150 }
            }
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <div className="space-y-2 md:space-y-3 text-[8px] md:text-[9px] text-bone/80 font-sans text-left select-none leading-normal">
              <div>
                <span className="text-bone/40 uppercase tracking-widest text-[5px] md:text-[6px] block">
                  {t.contact.fields.name}
                </span>
                <span className="truncate block font-medium mt-0.5">{form.name}</span>
              </div>
              <div>
                <span className="text-bone/40 uppercase tracking-widest text-[5px] md:text-[6px] block">
                  {t.contact.fields.email}
                </span>
                <span className="truncate block font-medium mt-0.5">{form.email}</span>
              </div>
              <div>
                <span className="text-bone/40 uppercase tracking-widest text-[5px] md:text-[6px] block">
                  {t.contact.fields.msg}
                </span>
                <span className="line-clamp-2 block mt-0.5 italic">{form.msg}</span>
              </div>
            </div>
            <div className="w-full border-t border-bone/10 pt-2 flex justify-between items-center text-[6px] md:text-[7px] text-bone/40 uppercase tracking-widest mt-1">
              <span>Therese Järvheden</span>
              <span className="text-ember font-medium">Skickat</span>
            </div>
          </MotionDiv>

          {/* TOP FLAP */}
          <MotionDiv
            className="absolute inset-0 bg-[#d9c4ad] origin-top drop-shadow-lg"
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 50%)",
              WebkitClipPath: "polygon(0 0, 100% 0, 50% 50%)",
              zIndex:
                status === "closing" ||
                status === "flipping" ||
                status === "writing" ||
                status === "flying"
                  ? 25
                  : 5,
            }}
            initial={{ rotateX: -180 }}
            animate={
              status === "closing" ||
              status === "flipping" ||
              status === "writing" ||
              status === "flying"
                ? { rotateX: 0 }
                : { rotateX: -180 }
            }
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />

          {/* ENVELOPE FRONT FLAPS */}
          <div className="absolute inset-0 z-20 pointer-events-none drop-shadow-md">
            <div
              className="absolute inset-0 bg-[#e2d1bc]"
              style={{ clipPath: "polygon(0 0, 50% 50%, 0 100%)", WebkitClipPath: "polygon(0 0, 50% 50%, 0 100%)" }}
            />
            <div
              className="absolute inset-0 bg-[#e2d1bc]"
              style={{ clipPath: "polygon(100% 0, 50% 50%, 100% 100%)", WebkitClipPath: "polygon(100% 0, 50% 50%, 100% 100%)" }}
            />
            <div
              className="absolute inset-0 bg-[#d9c4ad]"
              style={{ clipPath: "polygon(0 100%, 50% 50%, 100% 100%)", WebkitClipPath: "polygon(0 100%, 50% 50%, 100% 100%)" }}
            />
          </div>
        </div>

        {/* ADDRESS SIDE (Front of physical envelope) */}
        <div 
          className="absolute inset-0 bg-[#e2d1bc] rounded-sm shadow-xl flex items-center justify-center p-6"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="absolute top-3 right-3 md:top-4 md:right-4 w-10 h-12 md:w-12 md:h-14 bg-[#f0e6d8] border-[2px] border-dotted border-[#cbb8a0] flex items-center justify-center rotate-[8deg]">
            <div className="w-6 h-6 md:w-8 md:h-8 border border-ink/20 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 md:w-5 md:h-5 border border-ink/20 rounded-full" />
            </div>
          </div>

          <div className="absolute bottom-8 md:bottom-12 left-6 right-6 md:left-10 md:right-10 border-b border-ink/10" />
          <div className="absolute bottom-14 md:bottom-20 left-6 right-6 md:left-10 md:right-10 border-b border-ink/10" />

          <div className="w-full mt-6 md:mt-8 rotate-[-4deg] pl-2">
            {status === "writing" || status === "flying" ? (
              <MotionDiv
                initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                transition={{ duration: 1.5, ease: "linear" }}
                className="text-ink/90 text-2xl md:text-4xl block"
                style={{ fontFamily: "'Caveat', cursive", WebkitClipPath: "inset(0% 0% 0% 0%)" }}
                onUpdate={(latest: any) => {
                  // Ensure webkit clip path stays in sync
                  if (latest.clipPath) {
                    return { WebkitClipPath: latest.clipPath };
                  }
                }}
              >
                Till Therese Järvheden
              </MotionDiv>
            ) : null}
          </div>
        </div>
      </MotionDiv>
    </div>
  );
}
