import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Mail, Check, Send } from "lucide-react";
import { useT } from "../../hooks/use-t";
import { Field } from "../ui/Field";

const Instagram = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Facebook = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

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

  const agentEmail = links.agentEmail || "jonas@schultzbergagency.com";
  const voiceEmail = links.voiceEmail || "theresejarvheden@gmail.com";
  const instagram = links.instagram || "https://www.instagram.com/theresejarvheden/";
  const facebook = links.facebook || "https://www.facebook.com/therese.jarvhedenfdpersson";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("shrinking");
    // Wait for the envelope to rise and settle
    await new Promise((r) => setTimeout(r, 800));
    setStatus("dropping");
    // Wait for the slower slide-in animation to complete
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
  const opacity = useTransform(scrollYProgress, [0.5, 0.95], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.5, 0.95], [1, 1.05]);

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
    <section id="contact" ref={ref} className="relative px-6 py-28 md:px-12 md:py-40">
      <motion.div style={{ opacity, scale }} className="w-full h-full">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-14">
          <div className="md:col-span-5">
            <div className="text-[10px] uppercase tracking-[0.5em] text-ember">{t.contact.act}</div>
            <h2 className="mt-4 font-display text-5xl md:text-7xl text-bone leading-[0.92]">
              {t.contact.heading[0]}
              <span className="italic">{t.contact.heading[1]}</span>
              {t.contact.heading[2]}
            </h2>

            <div className="mt-12 space-y-10">
              <div>
                <div className="text-[10px] uppercase tracking-[0.4em] text-bone/40">
                  {t.contact.agentLabel}
                </div>
                <a
                  href={`mailto:${agentEmail}`}
                  data-hover
                  className="mt-2 inline-flex items-center gap-3 font-display text-2xl md:text-3xl text-bone hover:text-ember transition-colors px-3 py-2 rounded-sm -ml-3"
                >
                  <Mail size={20} /> {agentEmail}
                </a>
                <div className="mt-1 text-xs text-bone/40">{t.contact.agentSub}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.4em] text-bone/40">
                  {t.contact.voiceLabel}
                </div>
                <a
                  href={`mailto:${voiceEmail}`}
                  data-hover
                  className="mt-2 inline-flex items-center gap-3 font-display text-2xl md:text-3xl text-bone hover:text-ember transition-colors px-3 py-2 rounded-sm -ml-3"
                >
                  <Mail size={20} /> {voiceEmail}
                </a>
              </div>
              <div className="flex items-center gap-5 pt-4">
                <a
                  href={instagram}
                  target="_blank"
                  rel="noreferrer"
                  data-hover
                  className="group flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-bone/60 hover:text-ember transition-colors px-2.5 py-1.5 rounded-sm -ml-2.5"
                >
                  <Instagram size={16} /> Instagram
                </a>
                <a
                  href={facebook}
                  target="_blank"
                  rel="noreferrer"
                  data-hover
                  className="group flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-bone/60 hover:text-ember transition-colors px-2.5 py-1.5 rounded-sm -ml-2.5"
                >
                  <Facebook size={16} /> Facebook
                </a>
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
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
              {status !== "idle" && status !== "sent" && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                  <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');
                  `}</style>
                  <motion.div
                    className="relative w-[380px] h-[250px] [transform-style:preserve-3d]"
                    initial={{ scale: 0.85, opacity: 0, y: 100 }}
                    animate={
                      status === "flying"
                        ? { rotateY: 180, y: -600, x: 100, rotateZ: 10, scale: 0.5, opacity: 0 }
                        : status === "flipping" || status === "writing"
                          ? { rotateY: 180, scale: 1, opacity: 1, y: 0 }
                          : { rotateY: 0, scale: 1, opacity: 1, y: 0 }
                    }
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    {/* ENVELOPE BACK (Flap Side) */}
                    <div className="absolute inset-0 [backface-visibility:hidden]">
                      {/* Envelope Back Wall */}
                      <div className="absolute inset-0 bg-[#cbb8a0] rounded-sm shadow-inner" />

                      {/* FAKE LETTER */}
                      <motion.div
                        className="absolute top-4 left-6 right-6 bg-stage border border-bone/10 p-5 rounded-sm flex flex-col justify-between shadow-lg z-10"
                        style={{ height: "190px" }}
                        initial={{ y: -150 }} // Sticking out significantly
                        animate={
                          status === "dropping" || status === "closing" || status === "flipping"
                            ? { y: 15 } // Slid perfectly into the envelope
                            : { y: -150 }
                        }
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                      >
                        <div className="space-y-3 text-[9px] text-bone/80 font-sans text-left select-none leading-normal">
                          <div>
                            <span className="text-bone/40 uppercase tracking-widest text-[6px] block">
                              {t.contact.fields.name}
                            </span>
                            <span className="truncate block font-medium mt-0.5">{form.name}</span>
                          </div>
                          <div>
                            <span className="text-bone/40 uppercase tracking-widest text-[6px] block">
                              {t.contact.fields.email}
                            </span>
                            <span className="truncate block font-medium mt-0.5">{form.email}</span>
                          </div>
                          <div>
                            <span className="text-bone/40 uppercase tracking-widest text-[6px] block">
                              {t.contact.fields.msg}
                            </span>
                            <span className="line-clamp-2 block mt-0.5 italic">{form.msg}</span>
                          </div>
                        </div>
                        <div className="w-full border-t border-bone/10 pt-2 flex justify-between items-center text-[7px] text-bone/40 uppercase tracking-widest mt-1">
                          <span>Therese Järvheden</span>
                          <span className="text-ember font-medium">Skickat</span>
                        </div>
                      </motion.div>

                      {/* TOP FLAP */}
                      <motion.div
                        className="absolute inset-0 bg-[#d9c4ad] origin-top drop-shadow-lg"
                        style={{
                          clipPath: "polygon(0 0, 100% 0, 50% 50%)",
                          zIndex:
                            status === "closing" ||
                            status === "flipping" ||
                            status === "writing" ||
                            status === "flying"
                              ? 25
                              : 5,
                        }}
                        initial={{ rotateX: -180 }}
                        animate={
                          status === "closing" ||
                          status === "flipping" ||
                          status === "writing" ||
                          status === "flying"
                            ? { rotateX: 0 }
                            : { rotateX: -180 }
                        }
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      />

                      {/* ENVELOPE FRONT FLAPS */}
                      <div className="absolute inset-0 z-20 pointer-events-none drop-shadow-md">
                        <div
                          className="absolute inset-0 bg-[#e2d1bc]"
                          style={{ clipPath: "polygon(0 0, 50% 50%, 0 100%)" }}
                        />
                        <div
                          className="absolute inset-0 bg-[#e2d1bc]"
                          style={{ clipPath: "polygon(100% 0, 50% 50%, 100% 100%)" }}
                        />
                        <div
                          className="absolute inset-0 bg-[#d9c4ad]"
                          style={{ clipPath: "polygon(0 100%, 50% 50%, 100% 100%)" }}
                        />
                      </div>
                    </div>

                    {/* ADDRESS SIDE (Front of physical envelope) */}
                    <div className="absolute inset-0 bg-[#e2d1bc] rounded-sm [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-xl flex items-center justify-center p-6">
                      <div className="absolute top-4 right-4 w-12 h-14 bg-[#f0e6d8] border-[2px] border-dotted border-[#cbb8a0] flex items-center justify-center rotate-[8deg]">
                        <div className="w-8 h-8 border border-ink/20 rounded-full flex items-center justify-center">
                          <div className="w-5 h-5 border border-ink/20 rounded-full" />
                        </div>
                      </div>

                      <div className="absolute bottom-12 left-10 right-10 border-b border-ink/10" />
                      <div className="absolute bottom-20 left-10 right-10 border-b border-ink/10" />

                      <div className="w-full mt-8 rotate-[-4deg] pl-2">
                        {status === "writing" || status === "flying" ? (
                          <motion.div
                            initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
                            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                            transition={{ duration: 1.5, ease: "linear" }}
                            className="text-ink/90 text-3xl md:text-4xl"
                            style={{ fontFamily: "'Caveat', cursive" }}
                          >
                            Till Therese Järvheden
                          </motion.div>
                        ) : null}
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

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
