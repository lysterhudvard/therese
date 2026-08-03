import React from "react";
import { motion } from "framer-motion";

const MotionDiv = motion.div as any;

export function PageIntro({ text }: { text: string }) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-4xl mx-auto text-center px-6 pb-16 md:pb-24"
    >
      <p className="text-xl md:text-2xl lg:text-3xl font-light leading-[1.6] text-bone/80">
        {text}
      </p>
    </MotionDiv>
  );
}
