import { useState, useMemo, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useT } from "../../hooks/use-t";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

const MotionDiv = motion.div as any;
const MotionSpan = motion.span as any;

export interface FAQItem {
  id: string;
  q: { sv: string; en: string };
  a: { sv: string; en: string };
}

export function FAQ({ faqs: initialFaqs = [] }: { faqs?: FAQItem[] }) {
  const { lang } = useT();
  const ref = useRef<HTMLDivElement>(null);
  const [faqs, setFaqs] = useState<FAQItem[]>(initialFaqs);

  // Client-side fetch to load the latest FAQs from Supabase immediately on mount
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    let active = true;
    const fetchFaqs = async () => {
      try {
        const { data, error } = await supabase
          .from("biography")
          .select("faqs")
          .eq("id", "main")
          .maybeSingle();

        if (error) throw error;
        if (data?.faqs && Array.isArray(data.faqs) && active) {
          setFaqs(data.faqs as FAQItem[]);
        }
      } catch (e) {
        console.error("Failed to fetch FAQs client-side:", e);
      }
    };

    fetchFaqs();
    return () => {
      active = false;
    };
  }, []);

  const activeFaqs = useMemo(() => {
    if (!faqs || !Array.isArray(faqs)) return [];
    return faqs.filter(faq => {
      const q = (lang === "sv" ? faq.q?.sv : faq.q?.en) || faq.q?.sv || faq.q?.en;
      const a = (lang === "sv" ? faq.a?.sv : faq.a?.en) || faq.a?.sv || faq.a?.en;
      return q?.trim() && a?.trim();
    });
  }, [faqs, lang]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const exitOpacity = useTransform(scrollYProgress, [0.3, 0.95], [1, 0]);
  const exitScale = useTransform(scrollYProgress, [0.3, 0.95], [1, 1.03]);

  if (activeFaqs.length === 0) return null;

  return (
    <section id="faq" ref={ref} className="relative px-6 py-20 md:px-12 md:py-48 bg-ink">
      <MotionDiv style={{ opacity: exitOpacity, scale: exitScale }} className="w-full h-full">
        <div className="mx-auto max-w-3xl">
          <div className="text-[10px] uppercase tracking-[0.5em] text-ember mb-6 font-mono text-center">
            {lang === "sv" ? "Vanliga Frågor" : "Frequently Asked Questions"}
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-7xl text-bone text-center mb-10 uppercase tracking-widest leading-none">
            FAQ
          </h1>
          
          <div className="space-y-2 mt-16 lg:mt-24">
            {activeFaqs.map((faq) => {
              const question = (lang === "sv" ? faq.q?.sv : faq.q?.en) || faq.q?.sv || faq.q?.en;
              const answer = (lang === "sv" ? faq.a?.sv : faq.a?.en) || faq.a?.sv || faq.a?.en;
              
              return (
                <FAQAccordionItem key={faq.id} question={question} answer={answer} />
              );
            })}
          </div>
        </div>
      </MotionDiv>
    </section>
  );
}

function FAQAccordionItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-bone/5 py-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left px-4 py-4 font-display text-xl md:text-2xl text-bone hover:text-ember transition-colors focus:outline-none cursor-pointer rounded-sm"
      >
        <span>{question}</span>
        <MotionSpan
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-ember font-mono text-xs ml-4"
        >
          ▼
        </MotionSpan>
      </button>
      <MotionDiv
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="px-4 pb-4 pt-2 text-sm md:text-base text-bone/65 leading-relaxed font-sans max-w-2xl formatted-text">
          <span dangerouslySetInnerHTML={{ __html: answer }} />
        </p>
      </MotionDiv>
    </div>
  );
}
