import { useState } from "react";

export function Field({
  label,
  id,
  value,
  onChange,
  type = "text",
  textarea,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
}) {
  const [focus, setFocus] = useState(false);
  const active = focus || value.length > 0;
  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={`absolute left-0 pointer-events-none transition-all duration-300 font-mono uppercase tracking-[0.3em] ${
          active ? "top-0 text-[10px] text-ember" : "top-7 text-xs text-bone/40"
        }`}
      >
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          value={value}
          rows={4}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onChange={(e) => onChange(e.target.value)}
          className="mt-6 w-full resize-none border-b border-bone/20 bg-transparent pb-2 pt-1 text-bone outline-none focus:border-ember transition-colors"
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onChange={(e) => onChange(e.target.value)}
          className="mt-6 w-full border-b border-bone/20 bg-transparent pb-2 pt-1 text-bone outline-none focus:border-ember transition-colors"
        />
      )}
    </div>
  );
}
