import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const MotionDiv = motion.div as any;

export function ParallaxQuotes({ quotes }: { quotes: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // Moderate vertical parallax to keep motion smooth and within separate zones
  const layers = [
    {
      y: useTransform(scrollYProgress, [0, 1], [80, -100]),
      x: useTransform(scrollYProgress, [0, 1], [-15, 15]),
    },
    {
      y: useTransform(scrollYProgress, [0, 1], [30, -120]),
      x: useTransform(scrollYProgress, [0, 1], [10, -20]),
    },
    {
      y: useTransform(scrollYProgress, [0, 1], [100, -80]),
      x: useTransform(scrollYProgress, [0, 1], [-10, 10]),
    },
    {
      y: useTransform(scrollYProgress, [0, 1], [-10, -110]),
      x: useTransform(scrollYProgress, [0, 1], [20, -10]),
    },
    {
      y: useTransform(scrollYProgress, [0, 1], [120, -60]),
      x: useTransform(scrollYProgress, [0, 1], [-20, 20]),
    },
  ];

  // Specific layouts for each of the 5 quotes to prevent overlap and offscreen overflow
  const quoteLayouts = [
    {
      isLeft: false,
      top: 6,
      position: { right: "4%" },
      fontSize: "clamp(1.8rem, 4vw, 4.5rem)",
      maxWidth: "max-w-[70vw]",
    },
    {
      isLeft: true,
      top: 25,
      position: { left: "6%" },
      fontSize: "clamp(1.8rem, 3.8vw, 4.2rem)",
      maxWidth: "max-w-[70vw]",
    },
    {
      isLeft: false,
      top: 45,
      position: { right: "20%" },
      fontSize: "clamp(2.1rem, 4.8vw, 5.2rem)",
      maxWidth: "max-w-[70vw]",
    },
    {
      isLeft: true,
      top: 65,
      position: { left: "8%" },
      fontSize: "clamp(1.7rem, 3.5vw, 4rem)",
      maxWidth: "max-w-[70vw]",
    },
    {
      isLeft: false,
      top: 82,
      position: { right: "24%" },
      fontSize: "clamp(2.3rem, 5.4vw, 5.8rem)",
      maxWidth: "max-w-[70vw]",
    },
  ];

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden select-none">
      {quotes.slice(0, 5).map((q, i) => {
        const layout = quoteLayouts[i] || quoteLayouts[0];

        return (
          <MotionDiv
            key={q}
            style={{
              y: layers[i].y,
              x: layers[i].x,
              top: `${layout.top}%`,
              ...layout.position,
            }}
            className={`absolute font-display italic ${layout.maxWidth} leading-[1.15] ${
              layout.isLeft ? "text-left" : "text-right"
            }`}
          >
            <svg className="w-full overflow-visible" style={{ height: "1.3em", fontSize: layout.fontSize }}>
              <text
                x={layout.isLeft ? "0" : "100%"}
                y="0.9em"
                textAnchor={layout.isLeft ? "start" : "end"}
                className="fill-bone/[0.05] font-display italic"
                style={{ fontSize: "1em" }}
              >
                "{q}"
              </text>
            </svg>
          </MotionDiv>
        );
      })}
    </div>
  );
}

