import React from "react";
import { Download, Play, FileText, User, Mail } from "lucide-react";
import { motion } from "framer-motion";

const MotionDiv = motion.div as any;

interface PressContentProps {
  content: {
    ingress?: string;
    pressbilder_text?: string;
    showreels_text?: string;
    bio_short?: string;
    bio_long?: string;
    presskontakt?: string;
  };
  showIngress?: boolean;
}

export function PressContent({ content, showIngress = true }: PressContentProps) {
  if (
    !content.ingress &&
    !content.pressbilder_text &&
    !content.showreels_text &&
    !content.bio_short &&
    !content.bio_long &&
    !content.presskontakt
  ) {
    return null;
  }

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="bg-stage text-bone py-24 md:py-32 px-6 md:px-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-ember/5 rounded-full blur-[120px] pointer-events-none" />

      <MotionDiv 
        className="max-w-6xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* Left Column: Editorial Bio */}
          <div className="lg:col-span-7">
            {(content.bio_short || content.bio_long) && (
              <MotionDiv variants={itemVariants} className="group p-8 md:p-12 bg-ember/[0.02] border border-ember/10 rounded-sm hover:bg-ember/[0.04] transition-all duration-500 flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 flex items-center justify-center bg-ember/10 text-ember rounded-full">
                    <User size={18} className="stroke-[1.5]" />
                  </div>
                  <h2 className="text-lg md:text-xl font-display uppercase tracking-wider text-ember">Redaktionell Bio</h2>
                </div>
                
                <div className="space-y-8">
                  {content.bio_short && (
                    <div>
                      <h3 className="text-[10px] uppercase tracking-[0.3em] text-bone/40 font-mono mb-3 flex items-center gap-2">
                        <FileText size={10} /> Kort Version (30 ord)
                      </h3>
                      <div className="relative">
                        <span className="absolute -top-4 -left-3 text-4xl text-ember/20 font-display">"</span>
                        <p className="text-bone/80 italic font-light leading-relaxed relative z-10 pl-2">
                          {content.bio_short}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {content.bio_long && (
                    <div className="pt-8 border-t border-bone/5">
                      <h3 className="text-[10px] uppercase tracking-[0.3em] text-bone/40 font-mono mb-3 flex items-center gap-2">
                        <FileText size={10} /> Lång Version (90 ord)
                      </h3>
                      <div className="relative">
                        <span className="absolute -top-4 -left-3 text-4xl text-ember/20 font-display">"</span>
                        <p className="text-bone/80 italic font-light leading-relaxed relative z-10 pl-2">
                          {content.bio_long}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </MotionDiv>
            )}
          </div>

          {/* Right Column: Contact & Agency */}
          <div className="lg:col-span-5">
            {content.presskontakt && (
              <MotionDiv variants={itemVariants}>
                <a href="/kontakt" className="group p-8 bg-ink/60 border border-bone/5 rounded-sm flex gap-6 items-start cursor-pointer hover:border-ember/30 hover:bg-ink/80 transition-all duration-500 block">
                  <div className="w-10 h-10 flex items-center justify-center bg-bone/5 text-bone/60 rounded-sm shrink-0 group-hover:bg-ember/10 group-hover:text-ember transition-colors">
                    <Mail size={18} className="stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="text-[10px] uppercase tracking-[0.3em] text-bone/40 font-mono mb-2">Kontakt & Agentur</h3>
                    <div className="text-bone/70 text-sm font-light leading-relaxed whitespace-pre-wrap">
                      {content.presskontakt}
                    </div>
                  </div>
                </a>
              </MotionDiv>
            )}
          </div>

        </div>
      </MotionDiv>
    </section>
  );
}
