import { Play } from "lucide-react";
import { useT } from "../../hooks/use-t";
import { SpotlightImage } from "../ui/SpotlightImage";
import { IMG } from "../../routes/index";

export function Voice() {
  const { t } = useT();
  return (
    <section id="voice" className="relative overflow-hidden bg-ink">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-20 md:px-16 md:py-32">
          <div className="text-[10px] uppercase tracking-[0.5em] text-ember">{t.voice.act}</div>
          <h2 className="mt-4 font-display text-5xl md:text-6xl text-bone leading-[0.95]">
            {t.voice.heading[0]}
            <span className="italic">{t.voice.heading[1]}</span>
            {t.voice.heading[2]}
          </h2>
          <p className="mt-7 max-w-md text-bone/70 leading-relaxed">
            {t.voice.body[0]}
            <em className="text-bone">{t.voice.body[1]}</em>
            {t.voice.body[2]}
          </p>
          <div className="mt-10 flex items-center gap-4">
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              data-hover
              className="group inline-flex items-center gap-3 border border-ember/40 bg-ember/5 px-7 py-4 text-[11px] uppercase tracking-[0.3em] text-ember hover:bg-ember hover:text-ink transition-colors"
            >
              <Play size={14} className="transition-transform group-hover:translate-x-0.5" />
              {t.voice.cta}
            </button>
            <div className="text-[10px] uppercase tracking-[0.3em] text-bone/40">{t.voice.demo}</div>
          </div>
        </div>
        <div className="relative h-[60svh] md:h-[90svh] overflow-hidden md:order-first">
          <SpotlightImage src={IMG.voice} alt="Therese — röst" className="h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent md:bg-gradient-to-r pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
