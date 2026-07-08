import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Mail, Check, Send, Film, Globe, Link as LinkIcon, Video, Award, Briefcase, Music, Phone } from "lucide-react";
import { useT } from "../../hooks/use-t";
import { Field } from "../ui/Field";
import { Instagram, Facebook, Youtube, XLogo } from "./contact/SocialIcons";
import { EnvelopeAnimation } from "./contact/EnvelopeAnimation";

type Status =
  | "idle"
  | "shrinking"
  | "dropping"
  | "closing"
  | "flipping"
  | "writing"
  | "flying"
  | "sent";

export function Contact({ bioData }: { bioData?: any }) {
  const { t } = useT();
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", msg: "" });

  const links = typeof bioData?.contact_links === "string" 
    ? JSON.parse(bioData.contact_links) 
    : (bioData?.contact_links || {});

  const hasLinks = bioData && bioData.contact_links !== undefined && bioData.contact_links !== null;

  const agentEmail = hasLinks ? (links.agentEmail || "") : "jonas@schultzbergagency.com";
  const voiceEmail = hasLinks ? (links.voiceEmail || "") : "theresejarvheden@gmail.com";
  const instagram = hasLinks ? (links.instagram || "") : "https://www.instagram.com/theresejarvheden/";
  const facebook = hasLinks ? (links.facebook || "") : "https://www.facebook.com/therese.jarvhedenfdpersson";
  const youtube = links.youtube || "";
  const x = links.x || "";
  const imdb = links.imdb || "";
  const wikipedia = links.wikipedia || "";
  const customLink1Label = links.customLink1Label || "";
  const customLink1Url = links.customLink1Url || "";
  const customLink1Icon = links.customLink1Icon || "link";
  const customLink2Label = links.customLink2Label || "";
  const customLink2Url = links.customLink2Url || "";
  const customLink2Icon = links.customLink2Icon || "link";

  const getCustomIcon = (iconName: string) => {
    switch (iconName) {
      case "globe": return <Globe size={16} />;
      case "video": return <Video size={16} />;
      case "award": return <Award size={16} />;
      case "briefcase": return <Briefcase size={16} />;
      case "music": return <Music size={16} />;
      case "phone": return <Phone size={16} />;
      case "mail": return <Mail size={16} />;
      default: return <LinkIcon size={16} />;
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("shrinking");
    await new Promise((r) => setTimeout(r, 800));
    setStatus("dropping");
    await new Promise((r) => setTimeout(r, 1400));
    setStatus("closing");
    await new Promise((r) => setTimeout(r, 600));
    setStatus("flipping");
    await new Promise((r) => setTimeout(r, 800));
    setStatus("writing");
    await new Promise((r) => setTimeout(r, 1800));
    setStatus("flying");
    await new Promise((r) => setTimeout(r, 900));
    setStatus("sent");
  };

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const exitOpacity = useTransform(scrollYProgress, [0.75, 0.98], [1, 0]);
  const exitScale = useTransform(scrollYProgress, [0.75, 0.98], [1, 1.02]);

  const [isSpotlightActive, setIsSpotlightActive] = useState(false);
  const formCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setIsSpotlightActive(false);
          if (
            document.activeElement instanceof HTMLElement &&
            ref.current?.contains(document.activeElement)
          ) {
            document.activeElement.blur();
          }
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="contact" ref={ref} className="relative px-6 py-16 md:px-12 md:py-36">
      <motion.div style={{ opacity: exitOpacity, scale: exitScale }} className="w-full h-full">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-14">


          <div className="lg:col-span-5">
            <div className="text-[10px] uppercase tracking-[0.5em] text-ember">{t.contact.act}</div>
            <h2 className="mt-4 font-display text-5xl lg:text-7xl text-bone leading-[0.92]">
              {t.contact.heading[0]}
              <span className="italic">{t.contact.heading[1]}</span>
              {t.contact.heading[2]}
            </h2>

            <div className="mt-12 space-y-10">
              {agentEmail && (
                <div>
                  <div className="text-[10px] uppercase tracking-[0.4em] text-bone/70">
                    {t.contact.agentLabel}
                  </div>
                  <a
                    href={`mailto:${agentEmail}`}
                    data-hover
                    className="mt-2 inline-flex items-center gap-3 font-display text-xl sm:text-2xl lg:text-3xl text-bone hover:text-ember transition-colors px-3 py-2 rounded-sm -ml-3 break-all"
                  >
                    <Mail size={20} /> {agentEmail}
                  </a>
                  <div className="mt-1 text-xs text-bone/70">{t.contact.agentSub}</div>
                </div>
              )}
              {voiceEmail && (
                <div>
                  <div className="text-[10px] uppercase tracking-[0.4em] text-bone/70">
                    {t.contact.voiceLabel}
                  </div>
                  <a
                    href={`mailto:${voiceEmail}`}
                    data-hover
                    className="mt-2 inline-flex items-center gap-3 font-display text-xl sm:text-2xl lg:text-3xl text-bone hover:text-ember transition-colors px-3 py-2 rounded-sm -ml-3 break-all"
                  >
                    <Mail size={20} /> {voiceEmail}
                  </a>
                </div>
              )}
              {(instagram || facebook || youtube || x || imdb || wikipedia || customLink1Url || customLink2Url) && (
                <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-4">
                  {instagram && (
                    <a
                      href={instagram}
                      target="_blank"
                      rel="noreferrer"
                      data-hover
                      className="group flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-bone/60 hover:text-ember transition-colors px-2.5 py-1.5 rounded-sm -ml-2.5"
                    >
                      <Instagram size={16} /> Instagram
                    </a>
                  )}
                  {facebook && (
                    <a
                      href={facebook}
                      target="_blank"
                      rel="noreferrer"
                      data-hover
                      className="group flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-bone/60 hover:text-ember transition-colors px-2.5 py-1.5 rounded-sm -ml-2.5"
                    >
                      <Facebook size={16} /> Facebook
                    </a>
                  )}
                  {youtube && (
                    <a
                      href={youtube}
                      target="_blank"
                      rel="noreferrer"
                      data-hover
                      className="group flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-bone/60 hover:text-ember transition-colors px-2.5 py-1.5 rounded-sm -ml-2.5"
                    >
                      <Youtube size={16} /> YouTube
                    </a>
                  )}
                  {x && (
                    <a
                      href={x}
                      target="_blank"
                      rel="noreferrer"
                      data-hover
                      className="group flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-bone/60 hover:text-ember transition-colors px-2.5 py-1.5 rounded-sm -ml-2.5"
                    >
                      <XLogo size={16} /> X
                    </a>
                  )}
                  {imdb && (
                    <a
                      href={imdb}
                      target="_blank"
                      rel="noreferrer"
                      data-hover
                      className="group flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-bone/60 hover:text-ember transition-colors px-2.5 py-1.5 rounded-sm -ml-2.5"
                    >
                      <Film size={16} /> IMDb
                    </a>
                  )}
                  {wikipedia && (
                    <a
                      href={wikipedia}
                      target="_blank"
                      rel="noreferrer"
                      data-hover
                      className="group flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-bone/60 hover:text-ember transition-colors px-2.5 py-1.5 rounded-sm -ml-2.5"
                    >
                      <Globe size={16} /> Wikipedia
                    </a>
                  )}
                  {customLink1Url && (
                    <a
                      href={customLink1Url}
                      target="_blank"
                      rel="noreferrer"
                      data-hover
                      className="group flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-bone/60 hover:text-ember transition-colors px-2.5 py-1.5 rounded-sm -ml-2.5"
                    >
                      {getCustomIcon(customLink1Icon)} {customLink1Label || "Länk 1"}
                    </a>
                  )}
                  {customLink2Url && (
                    <a
                      href={customLink2Url}
                      target="_blank"
                      rel="noreferrer"
                      data-hover
                      className="group flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-bone/60 hover:text-ember transition-colors px-2.5 py-1.5 rounded-sm -ml-2.5"
                    >
                      {getCustomIcon(customLink2Icon)} {customLink2Label || "Länk 2"}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div
              ref={formCardRef}
              style={{
                background: isSpotlightActive
                  ? "radial-gradient(circle 750px at 50% 50%, rgba(235, 94, 40, 0.22) 0%, rgba(28, 28, 28, 0.35) 60%, rgba(10, 10, 10, 0.8) 100%)"
                  : undefined,
                borderColor: isSpotlightActive ? "rgba(235, 94, 40, 0.55)" : undefined,
                boxShadow: isSpotlightActive ? "0 0 60px rgba(235, 94, 40, 0.15)" : undefined,
                transition: "background 0.8s ease, border-color 0.8s ease, box-shadow 0.8s ease",
              }}
              className="relative border border-bone/10 bg-stage/40 backdrop-blur-sm p-8 md:p-12 min-h-[550px] md:min-h-[600px] flex items-center justify-center [perspective:1200px]"
            >
              {/* Spotlight Glow Overlay */}
              <div
                style={{
                  opacity: isSpotlightActive ? 1 : 0,
                  background:
                    "radial-gradient(circle 750px at 50% 50%, rgba(255, 255, 255, 0.18) 0%, rgba(235, 94, 40, 0.08) 60%, transparent 100%)",
                }}
                className="absolute inset-0 pointer-events-none transition-opacity duration-800 z-20"
              />

              {/* Envelope Animation Layer */}
              <EnvelopeAnimation status={status} form={form} t={t} />

              <AnimatePresence mode="wait">
                {status === "sent" ? (
                  <motion.div
                    key="ok"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center justify-center text-center relative z-30 w-full max-w-[300px]"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.15, type: "spring", stiffness: 220, damping: 16 }}
                      className="grid h-16 w-16 place-items-center rounded-full border border-ember bg-ember/10"
                    >
                      <Check size={26} className="text-ember" />
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.4 } }}
                      className="mt-6 font-display text-3xl text-bone"
                    >
                      {t.contact.okTitle}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.55 } }}
                      className="mt-3 text-sm text-bone/60"
                    >
                      {t.contact.okBody(form.name)}
                    </motion.p>
                    <motion.button
                      onClick={() => {
                        setStatus("idle");
                        setForm({ name: "", email: "", msg: "" });
                      }}
                      className="mt-8 text-[10px] uppercase tracking-[0.35em] text-bone/40 hover:text-ember transition-colors"
                    >
                      {t.contact.again}
                    </motion.button>
                  </motion.div>
                ) : status === "idle" ? (
                  <motion.form
                    key="form"
                    onSubmit={submit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                    transition={{ duration: 0.4 }}
                    className={`w-full max-w-[450px] space-y-8 relative z-10 transition-all duration-700 ${
                      isSpotlightActive ? "opacity-100" : "opacity-60"
                    }`}
                  >
                    <Field
                      label={t.contact.fields.name}
                      id="name"
                      value={form.name}
                      onChange={(v) => setForm({ ...form, name: v })}
                      onFocus={() => setIsSpotlightActive(true)}
                      onBlur={() => setIsSpotlightActive(false)}
                    />
                    <Field
                      label={t.contact.fields.email}
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(v) => setForm({ ...form, email: v })}
                      onFocus={() => setIsSpotlightActive(true)}
                      onBlur={() => setIsSpotlightActive(false)}
                    />
                    <Field
                      label={t.contact.fields.msg}
                      id="msg"
                      textarea
                      value={form.msg}
                      onChange={(v) => setForm({ ...form, msg: v })}
                      onFocus={() => setIsSpotlightActive(true)}
                      onBlur={() => setIsSpotlightActive(false)}
                    />
                    <button
                      type="submit"
                      data-hover
                      disabled={!form.name || !form.email || !form.msg}
                      className="group inline-flex items-center gap-3 border border-ember bg-ember px-8 py-4 text-[11px] uppercase tracking-[0.3em] text-ink transition-all hover:bg-bone hover:border-bone disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t.contact.submit}{" "}
                      <Send size={14} className="transition-transform group-hover:translate-x-1" />
                    </button>
                  </motion.form>
                ) : (
                  <motion.div key="placeholder" className="w-full h-[400px]" />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
