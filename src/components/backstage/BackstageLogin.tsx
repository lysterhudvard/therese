import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock } from "lucide-react";

interface BackstageLoginProps {
  onLoginSuccess: () => void;
}

export function BackstageLogin({ onLoginSuccess }: BackstageLoginProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    // Simple backstage access key validation for Phase 1
    // We will connect this to a secure database / API endpoint in subsequent phases
    setTimeout(() => {
      if (password === "therese2026") {
        if (typeof window !== "undefined") {
          window.localStorage.setItem("tj-backstage-auth", "true");
        }
        onLoginSuccess();
      } else {
        setError(true);
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stage relative overflow-hidden px-6">
      {/* Background spotlights */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-cyan-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-ember/5 blur-[120px] pointer-events-none" />
      
      {/* Film grain */}
      <div className="absolute inset-0 pointer-events-none bg-grain opacity-[0.015]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-ink/80 backdrop-blur-md border border-bone/10 p-8 rounded-sm shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <span className="text-[9px] uppercase tracking-[0.4em] text-ember">
            theresejarvheden.se
          </span>
          <h1 className="mt-2 font-display text-3xl text-bone uppercase tracking-wider">
            Backstage <span className="italic">Login</span>
          </h1>
          <p className="mt-2 text-[10px] text-bone/40">
            Logga in för att redigera portfölj, meriter och inställningar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-bone/50 mb-2 font-mono">
              Tillträdesnyckel (Access Key)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-bone/35">
                <Lock size={14} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Skriv lösenord..."
                disabled={isLoading}
                className={`w-full bg-stage/40 border ${
                  error ? "border-red-500/50 focus:border-red-500" : "border-bone/10 focus:border-ember"
                } text-bone pl-10 pr-10 py-2.5 rounded-sm text-sm focus:outline-none transition-colors duration-300 font-mono`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-bone/30 hover:text-bone/60 transition-colors"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-[10px] text-red-400 font-mono"
              >
                Felaktig tillträdesnyckel. Försök igen.
              </motion.p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-ember/90 hover:bg-ember text-ink font-semibold font-mono text-[11px] uppercase tracking-widest rounded-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-ember/15"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-ink border-t-transparent rounded-full animate-spin" />
            ) : (
              "Lås upp backstage"
            )}
          </button>

          {/* Test Hint Card */}
          <div className="mt-8 border border-bone/5 bg-stage/20 p-3 rounded-sm text-center">
            <span className="font-mono text-[9px] text-bone/30 uppercase tracking-widest">
              Utvecklingsläge: Använd nyckeln <code className="text-ember font-bold select-all">therese2026</code>
            </span>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
