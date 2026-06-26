import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Check, Send } from "lucide-react";
import { useT } from "../../hooks/use-t";
import { Field } from "../ui/Field";

const Instagram = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
  </svg>
);

const Facebook = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export function Contact() {
  const { t } = useT();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };
  return (
    <section id="contact" className="relative px-6 py-28 md:px-12 md:py-40">
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
              <div className="text-[10px] uppercase tracking-[0.4em] text-bone/40">{t.contact.agentLabel}</div>
              <a
                href="mailto:jonas@schultzbergagency.com"
                data-hover
                className="mt-2 inline-flex items-center gap-3 font-display text-2xl md:text-3xl text-bone hover:text-ember transition-colors px-3 py-2 rounded-sm -ml-3"
              >
                <Mail size={20} /> jonas@schultzbergagency.com
              </a>
              <div className="mt-1 text-xs text-bone/40">{t.contact.agentSub}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.4em] text-bone/40">{t.contact.voiceLabel}</div>
              <a
                href="mailto:theresejarvheden@gmail.com"
                data-hover
                className="mt-2 inline-flex items-center gap-3 font-display text-2xl md:text-3xl text-bone hover:text-ember transition-colors px-3 py-2 rounded-sm -ml-3"
              >
                <Mail size={20} /> theresejarvheden@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-5 pt-4">
              <a
                href="https://www.instagram.com/theresejarvheden/"
                target="_blank"
                rel="noreferrer"
                data-hover
                className="group flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-bone/60 hover:text-ember transition-colors px-2.5 py-1.5 rounded-sm -ml-2.5"
              >
                <Instagram size={16} /> Instagram
              </a>
              <a
                href="https://www.facebook.com/therese.jarvhedenfdpersson"
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
          <div className="relative border border-bone/10 bg-stage/40 backdrop-blur-sm p-8 md:p-12">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="ok"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center justify-center py-16 text-center"
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
                    className="mt-3 max-w-sm text-sm text-bone/60"
                  >
                    {t.contact.okBody(form.name)}
                  </motion.p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setForm({ name: "", email: "", msg: "" });
                    }}
                    className="mt-8 text-[10px] uppercase tracking-[0.35em] text-bone/40 hover:text-ember transition-colors"
                  >
                    {t.contact.again}
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                  <Field label={t.contact.fields.name} id="name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                  <Field
                    label={t.contact.fields.email}
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(v) => setForm({ ...form, email: v })}
                  />
                  <Field
                    label={t.contact.fields.msg}
                    id="msg"
                    textarea
                    value={form.msg}
                    onChange={(v) => setForm({ ...form, msg: v })}
                  />
                  <button
                    type="submit"
                    data-hover
                    disabled={!form.name || !form.email || !form.msg}
                    className="group inline-flex items-center gap-3 border border-ember bg-ember px-8 py-4 text-[11px] uppercase tracking-[0.3em] text-ink transition-all hover:bg-bone hover:border-bone disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {t.contact.submit} <Send size={14} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
