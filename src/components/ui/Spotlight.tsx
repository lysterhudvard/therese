import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function Spotlight() {
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const sx = useSpring(x, { stiffness: 320, damping: 32, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 320, damping: 32, mass: 0.4 });
  const [enlarged, setEnlarged] = useState(false);
  const [coarse, setCoarse] = useState(false);

  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(pointer: coarse)");
    setCoarse(mq.matches);
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      setEnlarged(!!t?.closest("a, button, [data-hover]"));
      setHidden(!!t?.closest("[data-no-spotlight]"));
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [x, y]);

  if (coarse) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[90] will-change-transform"
        style={{ x: sx, y: sy }}
        animate={{ opacity: hidden ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          animate={{ scale: 1 }}
          className="-translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 14,
            height: 14,
            background: "var(--color-bone)",
            mixBlendMode: "difference",
          }}
        />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[80] will-change-transform"
        style={{ x: sx, y: sy }}
        animate={{ opacity: enlarged || hidden ? 0 : 1 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 520,
            height: 520,
            background:
              "radial-gradient(circle, color-mix(in oklch, var(--color-ember) 22%, transparent) 0%, color-mix(in oklch, var(--color-ember) 6%, transparent) 35%, transparent 70%)",
            filter: "blur(8px)",
          }}
        />
      </motion.div>
    </>
  );
}
