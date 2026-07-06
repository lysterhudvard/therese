The showreel section is split across four files:

src/routes/index.tsx — the main Showreel section component and the modal state.
src/components/VideoModal.tsx — the modal that embeds the YouTube showreel.
src/lib/portfolio-data.ts — the showreel metadata (YouTube ID, title, poster
image). src/components/Hero.tsx — the hero "Play Showreel" button that also
opens the same modal. Here is the relevant code from each:

src/routes/index.tsx — main Showreel section import { createFileRoute } from
"@tanstack/react-router"; import { motion } from "framer-motion"; import {
useEffect, useState } from "react"; import { Nav } from "@/components/Nav";
import { Hero, HeroNamePreloader } from "@/components/Hero"; import { FilmStrip
} from "@/components/FilmStrip"; import { CreditsTable } from
"@/components/CreditsTable"; import { Contact } from "@/components/Contact";
import { VideoModal } from "@/components/VideoModal"; import { images, showreel,
contacts } from "@/lib/portfolio-data";

export const Route = createFileRoute("/")({ head: () => ({ meta: [ { title:
"Therese Järvheden — Skådespelerska" }, { name: "description", content:
"Official portfolio of Swedish actress Therese Järvheden — film, television,
theatre and voice work, represented by CommercialActors / Schultzberg Agency."
}, { property: "og:title", content: "Therese Järvheden — Skådespelerska" }, {
property: "og:description", content: "Official portfolio of Swedish actress
Therese Järvheden." }, { property: "og:image", content: images.hero }, ], }),
component: Index, });

function Index() { const [ready, setReady] = useState(false); const [modal,
setModal] = useState(false);

useEffect(() => { const t = setTimeout(() => setReady(true), 1500); return () =>
clearTimeout(t); }, []);

return (
<div className="relative min-h-screen bg-ink text-bone">
<HeroNamePreloader done={ready} />
<Nav />
<main> <Hero onOpenReel={() => setModal(true)} />
<About /> <Showreel onPlay={() => setModal(true)} />
<FilmStrip />
<CreditsTable />
<Contact />
<Footer />
</main> <VideoModal open={modal} onClose={() => setModal(false)}
youtubeId={showreel.youtubeId} title={showreel.title} />
</div> ); }

function Showreel({ onPlay }: { onPlay: () => void }) { return (
<section id="work" className="relative bg-ink px-6 pb-28 pt-12 sm:px-12 lg:px-20">
<div className="mx-auto max-w-[1400px]">
<div className="mb-8 flex items-end justify-between">
<div>
<div className="mb-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-metal">
<span className="h-px w-10 bg-metal" />
<span>Showreel · 2019</span>
</div>
<h2 className="font-display text-4xl font-light tracking-tight text-bone sm:text-6xl">
In <span className="italic">motion</span>.
</h2>
</div>
<span className="hidden text-right text-[11px] uppercase tracking-[0.32em] text-metal sm:block">
New reel <br /> in post · 2024
</span>
</div>

        <motion.button
          type="button"
          onClick={onPlay}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="group relative block aspect-[21/9] w-full overflow-hidden border border-border"
        >
          <img src={images.showreelPoster} alt="Showreel preview" className="h-full w-full object-cover transition duration-[1500ms] group-hover:scale-105" loading="lazy" />
          <div className="absolute inset-0 bg-ink/40 transition group-hover:bg-ink/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex items-center gap-5 text-xs uppercase tracking-[0.4em] text-bone">
              <span className="grid h-20 w-20 place-items-center rounded-full border border-bone/70 transition group-hover:scale-110 group-hover:border-bone group-hover:bg-bone group-hover:text-ink">
                <svg viewBox="0 0 24 24" className="h-5 w-5 translate-x-[1px]" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="hidden sm:inline">Play showreel</span>
            </span>
          </div>
          <div className="absolute bottom-4 left-5 right-5 flex items-baseline justify-between text-[10px] uppercase tracking-[0.32em] text-metal">
            <span>Therese Järvheden</span>
            <span>02:14 · YouTube</span>
          </div>
        </motion.button>
      </div>
    </section>

); } src/components/VideoModal.tsx — video modal import { AnimatePresence,
motion } from "framer-motion"; import { X } from "lucide-react"; import {
useEffect } from "react";

type Props = { open: boolean; onClose: () => void; youtubeId: string; title:
string; };

export function VideoModal({ open, onClose, youtubeId, title }: Props) {
useEffect(() => { if (!open) return; const handler = (e: KeyboardEvent) => { if
(e.key === "Escape") onClose(); }; document.body.style.overflow = "hidden";
window.addEventListener("keydown", handler); return () => {
document.body.style.overflow = ""; window.removeEventListener("keydown",
handler); }; }, [open, onClose]);

return (
<AnimatePresence> {open && ( <motion.div className="fixed inset-0 z-[100] flex
items-center justify-center bg-ink/95 backdrop-blur-md p-4 sm:p-10" initial={{
opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{
duration: 0.4, ease: [0.22, 1, 0.36, 1] }} onClick={onClose} > <motion.button
type="button" onClick={onClose} aria-label="Close video" className="absolute
right-6 top-6 z-10 flex h-11 w-11 items-center justify-center rounded-full
border border-border/60 bg-background/40 text-bone backdrop-blur transition
hover:border-bone hover:bg-background" initial={{ opacity: 0, y: -10 }}
animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} >
<X className="h-5 w-5" strokeWidth={1.5} /> </motion.button> <motion.div
onClick={(e) => e.stopPropagation()} className="relative w-full max-w-6xl"
initial={{ scale: 0.94, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity:
1 }} exit={{ scale: 0.96, opacity: 0 }} transition={{ duration: 0.5, ease:
[0.22, 1, 0.36, 1] }} >
<div className="mb-3 flex items-baseline justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground">
<span>Now playing</span>
<span className="font-display text-base italic tracking-normal text-bone">{title}</span>
</div>
<div className="relative aspect-video w-full overflow-hidden rounded-sm border border-border bg-black shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
<iframe className="absolute inset-0 h-full w-full"
src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
title={title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
allowFullScreen />
</div> </motion.div> </motion.div> )}
</AnimatePresence> ); } src/lib/portfolio-data.ts — showreel data const CDN =
"https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c";

export const images = { hero:
`${CDN}/200000000-339e8339ea/Thess1114_lowres.jpg?ph=a6c2528650`, about1:
`${CDN}/200000012-8d9138d916/Thess0822_lowres.jpg?ph=a6c2528650`, about2:
`${CDN}/200000001-a2d05a2d07/unnamed-5.jpg?ph=a6c2528650`, about3:
`${CDN}/200000031-558e7558ea/image-crop-200000013-8.jpeg?ph=a6c2528650`,
showreelPoster:
`${CDN}/200000004-ab624ab626/Thess0564_lowres.jpg?ph=a6c2528650`, agency:
`${CDN}/200000009-429d1429d3/CA_loggo-www_1080.jpg?ph=a6c2528650`, };

export const gallery = [ { src:
`${CDN}/200000028-5883458837/image-crop-200000014-6.jpeg?ph=a6c2528650`, title:
"Editorial I", year: "2020" }, { src:
`${CDN}/200000032-c5f44c5f47/Thess0972_bw_highres.jpg?ph=a6c2528650`, title:
"Monochrome", year: "2020" }, { src:
`${CDN}/200000015-689df689e2/Thess0903_lowres.jpg?ph=a6c2528650`, title: "Studio
Still", year: "2020" }, { src:
`${CDN}/200000036-5c2c05c2c2/Thess1110_lowres.jpg?ph=a6c2528650`, title:
"Portrait", year: "2020" }, { src:
`${CDN}/200000017-971e0971e2/Thess1079_highres.jpg?ph=a6c2528650`, title:
"Editorial II", year: "2020" }, { src:
`${CDN}/200000013-289ef289f3/Thess0862_lowres.jpg?ph=a6c2528650`, title: "Quiet
Light", year: "2020" }, { src:
`${CDN}/200000010-3743037433/Thess0609_lowres.jpg?ph=a6c2528650`, title:
"Beauty", year: "2020" }, { src:
`${CDN}/200000037-4aeb44aeb6/Thess1093_lowres.jpg?ph=a6c2528650`, title:
"Profile", year: "2020" }, { src:
`${CDN}/200000043-e152ee1530/Thess0477_highres-5.jpg?ph=a6c2528650`, title:
"Atelier", year: "2020" }, { src:
`${CDN}/200000044-20e3320e36/Thess0564_highres.jpg?ph=a6c2528650`, title:
"Cinematic", year: "2020" }, { src:
`${CDN}/200000045-8549a8549d/Thess0972_highres-5.jpg?ph=a6c2528650`, title:
"Noir", year: "2020" }, { src:
`${CDN}/200000046-2484224845/Thess1078_lowres.jpg?ph=a6c2528650`, title:
"Closer", year: "2020" }, ];

export const showreel = { youtubeId: "J9_4XQiQtNk", title: "Showreel — Therese
Järvheden", }; src/components/Hero.tsx — hero "Play Showreel" button export
function Hero({ onOpenReel }: Props) { // ... scroll animation code ...

return (
<section ref={ref} className="relative h-[100svh] w-full overflow-hidden">
<motion.div className="absolute inset-0 will-change-transform" style={{ scale,
borderRadius: radius, y, overflow: "hidden" }} >
<img
          src={images.hero}
          alt="Therese Järvheden"
          className="h-full w-full object-cover object-[center_20%]"
          loading="eager"
          decoding="async"
        />
<div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/20 to-ink/90" />
<div className="absolute inset-0 bg-gradient-to-r from-ink/40 via-transparent to-transparent" />
</motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 flex h-full flex-col justify-end px-6 pb-16 sm:px-12 sm:pb-20 lg:px-20"
      >
        <div className="flex flex-col gap-6 sm:gap-8">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-metal">
            <span className="h-px w-10 bg-metal" />
            <span>Skådespelerska · Sweden</span>
          </div>
          <h2 className="font-display text-balance text-xl font-light italic text-bone/90 sm:text-2xl lg:max-w-xl lg:text-3xl">
            "Drama är något jag känner extra starkt för."
          </h2>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={onOpenReel}
              className="group flex items-center gap-4 text-xs uppercase tracking-[0.35em] text-bone transition"
            >
              <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-bone/60 transition group-hover:border-bone group-hover:bg-bone group-hover:text-ink">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 translate-x-[1px]" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="border-b border-transparent pb-0.5 transition group-hover:border-bone">Play Showreel</span>
            </button>
            <a
              href="#work"
              className="text-xs uppercase tracking-[0.35em] text-metal transition hover:text-bone"
            >
              Selected work ↓
            </a>
          </div>
        </div>
      </motion.div>
    </section>

); }
