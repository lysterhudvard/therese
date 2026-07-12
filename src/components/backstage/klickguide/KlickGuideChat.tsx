import React from "react";
import { Sparkles, RotateCcw, Sliders, X, ArrowLeft, ArrowRight, CheckCircle, HelpCircle, Send } from "lucide-react";
import { Step } from "./types";

const SparklesIcon = Sparkles as any;
const RotateCcwIcon = RotateCcw as any;
const SlidersIcon = Sliders as any;
const XIcon = X as any;
const ArrowLeftIcon = ArrowLeft as any;
const ArrowRightIcon = ArrowRight as any;
const CheckCircleIcon = CheckCircle as any;
const HelpCircleIcon = HelpCircle as any;
const SendIcon = Send as any;

interface KlickGuideChatProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  chatMode: "guide" | "general";
  setChatMode: (mode: "guide" | "general") => void;
  showConfig: boolean;
  setShowConfig: (show: boolean) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  messages: Array<{ sender: "bot" | "user"; text: string }>;
  query: string;
  setQuery: (query: string) => void;
  loading: boolean;
  handleClearChat: () => void;
  handleClearKey: () => void;
  handleSaveKey: () => void;
  handleQuerySubmit: (e: React.FormEvent) => void;
  handleSuggestionClick: (suggestion: string) => void;
  activeGuide: { message: string; steps: Step[]; currentStepIndex: number } | null;
  activeQuery: string;
  cancelGuide: () => void;
  prevStep: () => void;
  nextStep: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function KlickGuideChat({
  isOpen,
  setIsOpen,
  chatMode,
  setChatMode,
  showConfig,
  setShowConfig,
  apiKey,
  setApiKey,
  messages,
  query,
  setQuery,
  loading,
  handleClearChat,
  handleClearKey,
  handleSaveKey,
  handleQuerySubmit,
  handleSuggestionClick,
  activeGuide,
  activeQuery,
  cancelGuide,
  prevStep,
  nextStep,
  messagesEndRef,
}: KlickGuideChatProps) {
  if (!isOpen) return null;

  const suggestions = [
    "Hur ändrar jag biografi och FAQ?",
    "Uppdatera status under Nu Aktuellt",
    "Ladda upp röstinspelning till merit",
    "Ändra min agent-epost / sociala länkar",
    "Uppdatera eftertexter eller slutbild",
    "Sökoptimera hemsidan (SEO)",
  ];

  return (
    <div className="fixed top-6 right-6 z-[1000] w-96 max-w-[calc(100vw-2rem)] h-[550px] bg-ink/95 backdrop-blur-xl border border-bone/10 shadow-2xl rounded-lg flex flex-col justify-between overflow-hidden animate-fadeIn text-left">
      {/* Header */}
      <div className="bg-stage/40 border-b border-bone/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SparklesIcon size={16} className="text-ember" />
          <div>
            <h3 className="font-display text-xs uppercase tracking-wider text-bone">Klick-guiden</h3>
            <span className="text-[8px] font-mono text-bone/45 tracking-widest uppercase">Interaktiv CMS-assistent</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleClearChat}
            className="p-1.5 text-bone/45 hover:text-bone hover:bg-bone/10 rounded transition-colors cursor-pointer"
            title="Rensa chatt & återställ"
          >
            <RotateCcwIcon size={13} />
          </button>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className={`p-1.5 hover:bg-bone/10 rounded transition-colors cursor-pointer ${
              showConfig ? "text-ember" : "text-bone/45 hover:text-bone"
            }`}
            title="Inställningar & Gemini API-nyckel"
          >
            <SlidersIcon size={13} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-bone/45 hover:text-bone hover:bg-bone/10 rounded transition-colors cursor-pointer"
          >
            <XIcon size={13} />
          </button>
        </div>
      </div>

      {/* Mode Selector Switch */}
      <div className="flex bg-stage/20 border-b border-bone/5 p-1.5 gap-1 shrink-0">
        <button
          type="button"
          onClick={() => {
            setChatMode("guide");
          }}
          className={`flex-1 py-1.5 rounded text-[10px] uppercase font-mono tracking-wider font-semibold transition-all cursor-pointer ${
            chatMode === "guide" ? "bg-ember text-ink shadow" : "text-bone/50 hover:text-bone hover:bg-bone/[0.03]"
          }`}
        >
          Klick-guiden
        </button>
        <button
          type="button"
          onClick={() => {
            setChatMode("general");
            cancelGuide();
          }}
          className={`flex-1 py-1.5 rounded text-[10px] uppercase font-mono tracking-wider font-semibold transition-all cursor-pointer ${
            chatMode === "general" ? "bg-ember text-ink shadow" : "text-bone/50 hover:text-bone hover:bg-bone/[0.03]"
          }`}
        >
          Allmän Chatt
        </button>
      </div>

      {/* Config Panel (collapsible) */}
      {showConfig && (
        <div className="bg-stage/85 border-b border-bone/10 p-4 space-y-3 text-left font-sans">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono tracking-widest text-ember">Gemini API Inställningar</span>
            <span className="text-[8px] font-mono bg-bone/15 px-1.5 py-0.5 rounded text-bone/60">Lokal lagring</span>
          </div>
          <p className="text-[10px] text-bone/60 leading-relaxed">
            Ange din personliga Gemini API-nyckel för att anropa Gemini 3.1-Flash-Lite direkt från webbläsaren. Om fältet
            lämnas tomt används inbyggda offline-mönster.
          </p>
          <div className="space-y-2">
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-ink/75 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember font-mono"
            />
            <div className="flex gap-2 justify-end">
              {apiKey && (
                <button
                  type="button"
                  onClick={handleClearKey}
                  className="px-2 py-1 text-[9px] font-mono border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-sm cursor-pointer transition-colors"
                >
                  Rensa
                </button>
              )}
              <button
                type="button"
                onClick={handleSaveKey}
                className="px-3 py-1 bg-ember text-ink font-semibold font-mono text-[9px] uppercase tracking-wider rounded-sm hover:bg-ember/90 transition-all cursor-pointer"
              >
                Spara nyckel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Guide Workflow Panel */}
      {activeGuide ? (
        <div className="flex-1 flex flex-col justify-between p-5 bg-ember/5">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-bone/5 pb-2">
              <span className="text-[9px] font-mono text-ember uppercase tracking-widest font-semibold">
                Aktiv Guide
              </span>
              <span className="text-[9px] font-mono text-bone/45 uppercase">
                Steg {activeGuide.currentStepIndex + 1} av {activeGuide.steps.length}
              </span>
            </div>

            {/* User query display box */}
            {activeQuery && (
              <div className="bg-stage/35 border border-bone/5 px-3 py-2 rounded-sm text-left">
                <span className="text-[8px] font-mono text-bone/45 uppercase block mb-0.5">Din Fråga:</span>
                <p className="text-xs text-bone font-medium font-sans italic">"{activeQuery}"</p>
              </div>
            )}

            {/* Big Step Instruction Box */}
            <div className="bg-ink/80 border border-ember/25 p-4 rounded-sm space-y-2 shadow-inner">
              <span className="text-[8px] font-mono uppercase tracking-widest text-ember block">Instruktion</span>
              <p className="text-sm text-bone font-medium leading-relaxed">
                {activeGuide.steps[activeGuide.currentStepIndex]?.instruction}
              </p>

              {/* Target Element ID Debug Hint */}
              <span className="block text-[8px] font-mono text-bone/35 mt-2">
                Mål-ID: <code className="text-ember">{activeGuide.steps[activeGuide.currentStepIndex]?.target}</code>
              </span>
            </div>
          </div>

          {/* Guide Actions Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-bone/5 gap-2">
            <button
              onClick={cancelGuide}
              className="px-3 py-2 text-[9px] font-mono uppercase tracking-wider text-red-400 hover:bg-red-500/10 rounded-sm transition-all cursor-pointer"
            >
              Avbryt
            </button>

            <div className="flex gap-2">
              <button
                onClick={prevStep}
                disabled={activeGuide.currentStepIndex === 0}
                className="p-2 border border-bone/10 text-bone/60 hover:text-bone hover:border-bone disabled:opacity-20 transition-all rounded cursor-pointer"
                title="Föregående steg"
              >
                <ArrowLeftIcon size={12} />
              </button>

              <button
                onClick={nextStep}
                className="flex items-center gap-1.5 px-4 py-2 bg-ember text-ink font-bold font-mono text-[9px] uppercase tracking-widest rounded-sm hover:bg-ember/90 transition-all cursor-pointer shadow-lg shadow-ember/15"
              >
                {activeGuide.currentStepIndex === activeGuide.steps.length - 1 ? (
                  <>
                    Klar <CheckCircleIcon size={10} />
                  </>
                ) : (
                  <>
                    Nästa <ArrowRightIcon size={10} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Chat Interface */
        <>
          {/* Message Board */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-md px-3.5 py-2 leading-relaxed text-left ${
                    msg.sender === "user"
                      ? "bg-ember text-ink font-medium"
                      : "bg-stage/40 text-bone/90 border border-bone/5"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-stage/40 text-bone/50 border border-bone/5 rounded-md px-3.5 py-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-ember rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-ember rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-ember rounded-full animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[9px] font-mono uppercase tracking-wider text-bone/35 ml-1">Laddar...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />

            {/* Suggestions List */}
            {messages.length === 1 && !loading && (
              <div className="pt-2 space-y-2 text-left">
                <span className="block text-[8px] font-mono uppercase tracking-widest text-bone/35 flex items-center gap-1">
                  <HelpCircleIcon size={10} /> Snabba förslag:
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(s)}
                      className="px-2.5 py-1 bg-bone/[0.04] hover:bg-bone/[0.08] hover:text-ember text-[10px] text-bone/60 border border-bone/5 rounded-full transition-all cursor-pointer text-left font-sans"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Chat Input form */}
          <form onSubmit={handleQuerySubmit} className="bg-stage/15 border-t border-bone/10 p-3 flex flex-col gap-1.5">
            <div className="relative flex items-center">
              <input
                type="text"
                maxLength={200}
                placeholder={chatMode === "guide" ? "Fråga efter en klick-guide..." : "Ställ en allmän fråga..."}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={loading}
                className="flex-1 bg-ink/75 border border-bone/10 text-bone pl-3 pr-12 py-2 rounded-sm text-xs focus:outline-none focus:border-ember font-sans disabled:opacity-50"
              />
              <span className="absolute right-3 text-[8px] font-mono text-bone/30 select-none pointer-events-none">
                {query.length}/200
              </span>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="px-4 py-1.5 bg-ember hover:bg-ember/90 disabled:bg-bone/10 text-ink disabled:text-bone/35 rounded-sm transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer text-xs font-mono font-bold uppercase tracking-wider"
              >
                Skicka <SendIcon size={10} />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
