import React from "react";
import { Volume2, Settings, User, Film } from "lucide-react";
import { motion } from "framer-motion";

const MotionDiv = motion.div as any;

interface VoiceContentProps {
  content: {
    ingress?: string;
    rostprov_text?: string;
    vad_therese_gor?: string;
    varfor_skanska?: string;
    sa_gar_det_till?: string;
    teknik_leverans?: string;
  };
}

export function VoiceContent({ content }: VoiceContentProps) {
  if (
    !content.ingress &&
    !content.rostprov_text &&
    !content.vad_therese_gor &&
    !content.varfor_skanska &&
    !content.sa_gar_det_till &&
    !content.teknik_leverans
  ) {
    return null;
  }

  // Animation variants
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
    <section className="bg-stage text-bone py-24 md:py-32 px-6 md:px-12 border-t border-bone/5 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-ember/5 rounded-full blur-[120px] pointer-events-none" />

      <MotionDiv 
        className="max-w-5xl mx-auto space-y-24 relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        
        {/* Ingress */}
        {content.ingress && (
          <MotionDiv variants={itemVariants} className="max-w-4xl">
            <p className="text-2xl md:text-3xl lg:text-4xl font-light leading-[1.4] text-bone/90">
              {content.ingress}
            </p>
            <div className="w-24 h-px bg-gradient-to-r from-ember/50 to-transparent mt-12" />
          </MotionDiv>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Röstprov */}
          {content.rostprov_text && (
            <MotionDiv variants={itemVariants} className="group p-8 md:p-10 bg-ink/40 border border-bone/5 rounded-sm backdrop-blur-sm hover:border-ember/30 hover:bg-ink/60 transition-all duration-500">
              <div className="w-12 h-12 flex items-center justify-center bg-ember/10 text-ember rounded-sm mb-6 group-hover:scale-110 group-hover:bg-ember/20 transition-all duration-500">
                <Volume2 size={20} className="stroke-[1.5]" />
              </div>
              <h2 className="text-xl md:text-2xl font-display uppercase tracking-wider text-bone mb-4">Röstprov</h2>
              <div className="text-bone/70 leading-relaxed font-light whitespace-pre-wrap">
                {content.rostprov_text}
              </div>
            </MotionDiv>
          )}

          {/* Vad Therese Gör */}
          {content.vad_therese_gor && (
            <MotionDiv variants={itemVariants} className="group p-8 md:p-10 bg-ink/40 border border-bone/5 rounded-sm backdrop-blur-sm hover:border-ember/30 hover:bg-ink/60 transition-all duration-500">
              <div className="w-12 h-12 flex items-center justify-center bg-ember/10 text-ember rounded-sm mb-6 group-hover:scale-110 group-hover:bg-ember/20 transition-all duration-500">
                <Film size={20} className="stroke-[1.5]" />
              </div>
              <h2 className="text-xl md:text-2xl font-display uppercase tracking-wider text-bone mb-4">Erfarenhet</h2>
              <div className="text-bone/70 leading-relaxed font-light whitespace-pre-wrap">
                {content.vad_therese_gor}
              </div>
            </MotionDiv>
          )}

          {/* Varför skånska */}
          {content.varfor_skanska && (
            <MotionDiv variants={itemVariants} className="group p-8 md:p-10 bg-ink/40 border border-bone/5 rounded-sm backdrop-blur-sm hover:border-ember/30 hover:bg-ink/60 transition-all duration-500">
              <div className="w-12 h-12 flex items-center justify-center bg-ember/10 text-ember rounded-sm mb-6 group-hover:scale-110 group-hover:bg-ember/20 transition-all duration-500">
                <User size={20} className="stroke-[1.5]" />
              </div>
              <h2 className="text-xl md:text-2xl font-display uppercase tracking-wider text-bone mb-4">En Genuin Känsla</h2>
              <div className="text-bone/70 leading-relaxed font-light whitespace-pre-wrap">
                {content.varfor_skanska}
              </div>
            </MotionDiv>
          )}

          {/* Så går det till & Teknik */}
          <MotionDiv variants={itemVariants} className="flex flex-col gap-8 md:gap-12">
            {content.sa_gar_det_till && (
              <div className="group p-8 md:p-10 bg-ink/40 border border-bone/5 rounded-sm backdrop-blur-sm hover:border-ember/30 hover:bg-ink/60 transition-all duration-500 flex-1">
                <div className="w-12 h-12 flex items-center justify-center bg-ember/10 text-ember rounded-sm mb-6 group-hover:scale-110 group-hover:bg-ember/20 transition-all duration-500">
                  <Volume2 size={20} className="stroke-[1.5]" />
                </div>
                <h2 className="text-xl md:text-2xl font-display uppercase tracking-wider text-bone mb-4">Processen</h2>
                <div className="text-bone/70 leading-relaxed font-light whitespace-pre-wrap">
                  {content.sa_gar_det_till}
                </div>
              </div>
            )}
            
            {content.teknik_leverans && (
              <div className="group p-8 md:p-10 bg-ink/40 border border-bone/5 rounded-sm backdrop-blur-sm hover:border-ember/30 hover:bg-ink/60 transition-all duration-500">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-ember/10 text-ember rounded-sm group-hover:scale-110 group-hover:bg-ember/20 transition-all duration-500">
                    <Settings size={18} className="stroke-[1.5]" />
                  </div>
                  <h2 className="text-lg md:text-xl font-display uppercase tracking-wider text-bone">Teknik & Leverans</h2>
                </div>
                <div className="text-bone/70 leading-relaxed font-light whitespace-pre-wrap">
                  {content.teknik_leverans}
                </div>
              </div>
            )}
          </MotionDiv>
        </div>
      </MotionDiv>
    </section>
  );
}
