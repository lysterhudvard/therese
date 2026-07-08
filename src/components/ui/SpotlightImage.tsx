import { useEffect, useRef } from "react";

export function SpotlightImage({
  src,
  alt,
  title,
  className = "",
  style = {},
}: {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const mask = maskRef.current;
    if (!container || !mask) return;

    // Detect if the device has a fine pointer (mouse / desktop)
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;

    // Set initial mask state
    const rect = container.getBoundingClientRect();
    if (isFinePointer) {
      // Desktop: initially hidden offscreen
      mask.style.webkitMaskImage =
        "radial-gradient(circle 300px at -500px -500px, black 10%, transparent 80%)";
      mask.style.maskImage =
        "radial-gradient(circle 300px at -500px -500px, black 10%, transparent 80%)";
    } else {
      // Mobile/Tablet: initially centered
      const initX = rect.width ? rect.width / 2 : 150;
      const initY = rect.height ? rect.height / 2 : 200;
      mask.style.webkitMaskImage = `radial-gradient(circle 160px at ${initX}px ${initY}px, black 10%, transparent 80%)`;
      mask.style.maskImage = `radial-gradient(circle 160px at ${initX}px ${initY}px, black 10%, transparent 80%)`;
    }

    const updateScrollSpotlight = () => {
      if (isFinePointer) return; // Never auto-glide on desktop

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      if (rect.top < viewportHeight && rect.bottom > 0) {
        // Calculate scroll progress through the viewport (0 to 1)
        const totalDist = viewportHeight + rect.height;
        const currentDist = viewportHeight - rect.top;
        const progress = Math.max(0, Math.min(1, currentDist / totalDist));

        // Glide x from -50px to width + 50px
        const x = -50 + progress * (rect.width + 100);
        // Smooth sine wave for y to glide up and down like a searchlight
        const y = rect.height * (0.35 + Math.sin(progress * Math.PI * 1.5) * 0.22);

        const radius = 160;

        mask.style.webkitMaskImage = `radial-gradient(circle ${radius}px at ${x}px ${y}px, black 10%, transparent 80%)`;
        mask.style.maskImage = `radial-gradient(circle ${radius}px at ${x}px ${y}px, black 10%, transparent 80%)`;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isFinePointer) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mask.style.webkitMaskImage = `radial-gradient(circle 300px at ${x}px ${y}px, black 10%, transparent 80%)`;
      mask.style.maskImage = `radial-gradient(circle 300px at ${x}px ${y}px, black 10%, transparent 80%)`;
    };

    const onMouseLeave = () => {
      if (!isFinePointer) return;
      mask.style.webkitMaskImage =
        "radial-gradient(circle 300px at -500px -500px, black 10%, transparent 80%)";
      mask.style.maskImage =
        "radial-gradient(circle 300px at -500px -500px, black 10%, transparent 80%)";
    };

    if (isFinePointer) {
      container.addEventListener("mousemove", onMouseMove);
      container.addEventListener("mouseleave", onMouseLeave);
    } else {
      window.addEventListener("scroll", updateScrollSpotlight);
      window.addEventListener("resize", updateScrollSpotlight);
      // Initial run
      setTimeout(updateScrollSpotlight, 100);
    }

    return () => {
      if (isFinePointer) {
        container.removeEventListener("mousemove", onMouseMove);
        container.removeEventListener("mouseleave", onMouseLeave);
      } else {
        window.removeEventListener("scroll", updateScrollSpotlight);
        window.removeEventListener("resize", updateScrollSpotlight);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`} style={style}>
      {/* Background: Desaturated & Darkened */}
      <img
        src={src}
        alt={alt}
        title={title}
        className="h-full w-full object-cover filter grayscale brightness-[0.22] transition-all duration-500"
      />
      {/* Foreground: Fully colored under spotlight mask */}
      <img
        ref={maskRef}
        src={src}
        alt=""
        title={title}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none transition-all duration-300"
      />
    </div>
  );
}
