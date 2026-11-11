import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

const MotionDiv = motion.div as any;

export function PageIntro({ text: initialText = "" }: { text?: string }) {
  const [text, setText] = useState(initialText);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    let active = true;

    const fetchIngress = async () => {
      try {
        const { data, error } = await supabase
          .from("biography")
          .select("press_page_content")
          .eq("id", "main")
          .maybeSingle();

        if (error) throw error;
        if (data?.press_page_content && active) {
          const parsed = typeof data.press_page_content === "string"
            ? JSON.parse(data.press_page_content)
            : data.press_page_content;
          if (parsed && typeof parsed.ingress === "string") {
            setText(parsed.ingress);
          }
        }
      } catch (e) {
        console.error("Failed to fetch page intro client-side:", e);
      }
    };

    fetchIngress();
    return () => { active = false; };
  }, []);

  if (!text) return null;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-4xl mx-auto text-center px-6 pb-16 md:pb-24"
    >
      <p className="text-xl md:text-2xl lg:text-3xl font-light leading-[1.6] text-bone/80 whitespace-pre-line">
        {text}
      </p>
    </MotionDiv>
  );
}
