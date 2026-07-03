import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Send, X, ArrowRight, ArrowLeft, Info, Sliders, CheckCircle, HelpCircle, RotateCcw } from "lucide-react";
import { getInteractiveGuide, getGeneralChatResponse } from "../../lib/gemini";
import { toast } from "sonner";

interface KlickGuideWidgetProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

interface Step {
  target: string;
  instruction: string;
}

export function KlickGuideWidget({ activeTab, setActiveTab }: KlickGuideWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Chat mode selection: "guide" (Klick-guide steps) or "general" (general QA)
  const [chatMode, setChatMode] = useState<"guide" | "general">("guide");

  const [messages, setMessages] = useState<Array<{ sender: "bot" | "user"; text: string }>>([
    {
      sender: "bot",
      text: "Hej Therese! Jag är din CMS-assistent. Välj läge ovan: 'Klick-guiden' för att få blinkande vägledning i panelen, eller 'Allmän Chatt' för att ställa vanliga frågor om systemet!",
    },
  ]);

  // Key configurations
  const [apiKey, setApiKey] = useState("");
  const [showConfig, setShowConfig] = useState(false);

  // User query persistence
  const [activeQuery, setActiveQuery] = useState("");

  // Draggable coordinates ONLY for the minimized active klick-guide container (defaulted to top right offsets)
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Badge position state for floating step number
  const [badgePosition, setBadgePosition] = useState<{ top: number; left: number; visible: boolean }>({
    top: 0,
    left: 0,
    visible: false,
  });

  // Active guide state
  const [activeGuide, setActiveGuide] = useState<{
    message: string;
    steps: Step[];
    currentStepIndex: number;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Load API Key from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKey = window.localStorage.getItem("tj-gemini-key") || "";
      setApiKey(savedKey);
    }
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Execute step effects: highlights and tab switching
  useEffect(() => {
    if (!activeGuide) {
      // Clean up any remaining glow highlights on close
      cleanupHighlights();
      return;
    }

    const currentStep = activeGuide.steps[activeGuide.currentStepIndex];
    if (!currentStep) return;

    const { target } = currentStep;

    // 1. Check if we need to switch tabs
    if (target.startsWith("klick-nav-")) {
      const tab = target.replace("klick-nav-", "");
      setActiveTab(tab);
    } else {
      // If we are targeting an input inside a specific tab, ensure the tab prefix matches
      // T.ex. target is klick-bio-... -> we should be on the bio tab!
      if (target.startsWith("klick-hero-") && activeTab !== "hero") {
        setActiveTab("hero");
      } else if (target.startsWith("klick-bio-") && activeTab !== "bio") {
        setActiveTab("bio");
      } else if (target.startsWith("klick-portfolio-") && activeTab !== "portfolio") {
        setActiveTab("portfolio");
      } else if (target.startsWith("klick-showreels-") && activeTab !== "showreels") {
        setActiveTab("showreels");
      } else if (target.startsWith("klick-credits-") && activeTab !== "credits") {
        setActiveTab("credits");
      } else if (target.startsWith("klick-voice-") && activeTab !== "voice") {
        setActiveTab("voice");
      } else if (target.startsWith("klick-seo-") && activeTab !== "seo") {
        setActiveTab("seo");
      } else if (target.startsWith("klick-media-") && activeTab !== "media") {
        setActiveTab("media");
      }
    }

    // 2. Add glow highlight to the target element (wait slightly for state to apply & DOM to render)
    const highlightTimeout = setTimeout(() => {
      cleanupHighlights();

      const element = document.getElementById(target);
      if (element) {
        element.classList.add("animate-klick-glow");
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 250);

    return () => {
      clearTimeout(highlightTimeout);
    };
  }, [activeGuide, activeGuide?.currentStepIndex, activeTab]);

  // Floating Badge positioning: tracks target element coordinate changes
  useEffect(() => {
    if (!activeGuide) {
      setBadgePosition({ top: 0, left: 0, visible: false });
      return;
    }

    const currentStep = activeGuide.steps[activeGuide.currentStepIndex];
    if (!currentStep) return;

    const targetId = currentStep.target;

    const updatePosition = () => {
      const element = document.getElementById(targetId);
      if (element) {
        const rect = element.getBoundingClientRect();
        // Position at top-left of the target element, offset slightly
        setBadgePosition({
          top: rect.top - 12,
          left: rect.left - 12,
          visible: true,
        });
      } else {
        setBadgePosition((prev) => ({ ...prev, visible: false }));
      }
    };

    // Calculate position shortly after DOM updates render the panel
    const timeout = setTimeout(updatePosition, 300);

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [activeGuide, activeGuide?.currentStepIndex, activeTab]);

  // Click Trigger on Target Element: automatically advances when the user clicks the highlighted part
  useEffect(() => {
    if (!activeGuide) return;
    const currentStep = activeGuide.steps[activeGuide.currentStepIndex];
    if (!currentStep) return;

    const targetId = currentStep.target;

    const handleElementClick = (event: MouseEvent) => {
      const element = document.getElementById(targetId);
      if (element && (element === event.target || element.contains(event.target as Node))) {
        // Auto-advance step with a tiny delay to let the user's action complete first!
        setTimeout(() => {
          nextStep();
        }, 150);
      }
    };

    // Capture stage click
    document.addEventListener("click", handleElementClick, true);
    return () => {
      document.removeEventListener("click", handleElementClick, true);
    };
  }, [activeGuide, activeGuide?.currentStepIndex]);

  // Draggable mini-guide event handlers
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      setPosition((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      const deltaX = touch.clientX - dragStartRef.current.x;
      const deltaY = touch.clientY - dragStartRef.current.y;
      setPosition((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));
      dragStartRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleDragEnd = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleDragEnd);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleDragEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging]);

  const handleDragStart = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    if (e.touches.length === 0) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleDoubleClickHeader = () => {
    setPosition({ x: 0, y: 0 });
    toast.info("Guidepanelens position återställd.");
  };

  const cleanupHighlights = () => {
    const glowingElements = document.querySelectorAll(".animate-klick-glow");
    glowingElements.forEach((el) => {
      el.classList.remove("animate-klick-glow");
    });
  };

  const handleSaveKey = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("tj-gemini-key", apiKey.trim());
      toast.success("Gemini API-nyckel har sparats lokalt!");
      setShowConfig(false);
    }
  };

  const handleClearKey = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("tj-gemini-key");
      setApiKey("");
      toast.info("Gammal API-nyckel rensad.");
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        sender: "bot",
        text: `Hej Therese! Jag är din CMS-assistent. Välj läge ovan: 'Klick-guiden' för att få blinkande vägledning i panelen, eller 'Allmän Chatt' för att ställa vanliga frågor om systemet!`,
      },
    ]);
    setQuery("");
    setActiveQuery("");
    cancelGuide();
    toast.info("Chatthistorik rensad.");
  };

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userText = query.trim();
    setQuery("");
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setLoading(true);

    try {
      if (chatMode === "guide") {
        // Guide mode: retrieve structured JSON guide steps
        const response = await getInteractiveGuide(userText, apiKey);
        
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: response.message },
        ]);

        if (response.steps && response.steps.length > 0) {
          setActiveQuery(userText);
          setPosition({ x: 0, y: 0 }); // Reset guide position
          setActiveGuide({
            message: response.message,
            steps: response.steps,
            currentStepIndex: 0,
          });
        } else {
          toast.info("Inga klicksteg hittades för denna förfrågan. Prova att fråga annorlunda.");
        }
      } else {
        // General Chat mode: plain text response
        const responseText = await getGeneralChatResponse(userText, apiKey);
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: responseText },
        ]);
      }
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Oj, jag stötte på ett problem. Kontrollera din anslutning eller nyckel." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    setMessages((prev) => [...prev, { sender: "user", text: suggestion }]);
    setLoading(true);

    try {
      if (chatMode === "guide") {
        const response = await getInteractiveGuide(suggestion, apiKey);
        
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: response.message },
        ]);

        if (response.steps && response.steps.length > 0) {
          setActiveQuery(suggestion);
          setPosition({ x: 0, y: 0 }); // Reset guide position
          setActiveGuide({
            message: response.message,
            steps: response.steps,
            currentStepIndex: 0,
          });
        }
      } else {
        const responseText = await getGeneralChatResponse(suggestion, apiKey);
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: responseText },
        ]);
      }
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Problem att hämta svar. Prova igen." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (!activeGuide) return;
    if (activeGuide.currentStepIndex < activeGuide.steps.length - 1) {
      setActiveGuide({
        ...activeGuide,
        currentStepIndex: activeGuide.currentStepIndex + 1,
      });
    } else {
      // Finished the guide!
      toast.success("Bra jobbat! Guiden är klar.");
      cleanupHighlights();
      setActiveGuide(null);
      setActiveQuery("");
      setBadgePosition({ top: 0, left: 0, visible: false });
      setPosition({ x: 0, y: 0 });
    }
  };

  const prevStep = () => {
    if (!activeGuide) return;
    if (activeGuide.currentStepIndex > 0) {
      setActiveGuide({
        ...activeGuide,
        currentStepIndex: activeGuide.currentStepIndex - 1,
      });
    }
  };

  const cancelGuide = () => {
    cleanupHighlights();
    setActiveGuide(null);
    setActiveQuery("");
    setBadgePosition({ top: 0, left: 0, visible: false });
    setPosition({ x: 0, y: 0 });
  };

  const suggestions = [
    "Hur ändrar jag biografi och FAQ?",
    "Uppdatera status under Nu Aktuellt",
    "Hur byter jag showreels?",
    "Ladda upp röstinspelning till merit",
    "Sökoptimera hemsidan (SEO)",
  ];

  return (
    <>
      {/* Pulsating green breathing glows (lime to mint emerald) */}
      <style dangerouslySetInnerHTML={{ __html: `
        .animate-klick-glow {
          position: relative !important;
          outline: 3px solid #22c55e !important;
          outline-offset: 2px !important;
          transition: all 0.3s ease;
          animation: klick-pulse 1.5s infinite ease-in-out !important;
          z-index: 50 !important;
        }
        @keyframes klick-pulse {
          0% {
            outline-color: #22c55e !important;
            outline-offset: 2px !important;
            box-shadow: 0 0 8px rgba(34, 197, 94, 0.4), inset 0 0 8px rgba(34, 197, 94, 0.2) !important;
          }
          50% {
            outline-color: #10b981 !important;
            outline-offset: 5px !important;
            box-shadow: 0 0 25px rgba(16, 185, 129, 0.95), 0 0 10px rgba(34, 197, 94, 0.5) !important;
          }
          100% {
            outline-color: #22c55e !important;
            outline-offset: 2px !important;
            box-shadow: 0 0 8px rgba(34, 197, 94, 0.4), inset 0 0 8px rgba(34, 197, 94, 0.2) !important;
          }
        }
        @keyframes klick-badge-pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 10px rgba(34, 197, 94, 0.7);
          }
          50% {
            transform: scale(1.15);
            box-shadow: 0 0 22px rgba(16, 185, 129, 0.95), 0 0 8px rgba(34, 197, 94, 0.5);
          }
        }
        .animate-klick-badge {
          animation: klick-badge-pulse 1.5s infinite ease-in-out !important;
        }
      `}} />

      {/* Floating Glowing Green Badge displaying the Step Number */}
      {badgePosition.visible && activeGuide && (
        <div
          id="klick-guide-badge"
          style={{
            position: "fixed",
            top: badgePosition.top,
            left: badgePosition.left,
            zIndex: 10001,
          }}
          className="w-6.5 h-6.5 bg-[#22c55e] text-[#0b090a] font-bold font-mono rounded-full border border-[#0b090a] flex items-center justify-center text-[10px] select-none pointer-events-none shadow-[0_0_12px_rgba(34,197,94,0.8)] animate-klick-badge"
        >
          {activeGuide.currentStepIndex + 1}
        </div>
      )}

      {/* Floating Orange Circular Trigger Button (Fixed position, top right corner) */}
      <div className="fixed top-6 right-6 z-[1000]">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center justify-center w-14 h-14 bg-ember hover:bg-ember/90 text-ink rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer border border-ink/10"
            title="Ööppna Klick-guiden"
          >
            <Sparkles size={22} className="group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bone opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-bone"></span>
            </span>
          </button>
        )}
      </div>

      {/* Minimized / Closed Guide Progress Bar (ONLY this container is draggable, defaulted to top right) */}
      {!isOpen && activeGuide && (
        <div
          onMouseDown={handleDragStart}
          onTouchStart={handleTouchStart}
          onDoubleClick={handleDoubleClickHeader}
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            transition: isDragging ? "none" : "transform 0.15s ease-out",
          }}
          className="fixed top-6 right-6 left-6 md:left-auto md:w-[600px] z-[1000] bg-ink/95 backdrop-blur-xl border border-ember/30 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fadeIn shadow-2xl cursor-move select-none"
          title="Dra för att flytta panelen, dubbelklicka för att återställa position"
        >
          <div className="flex-1 space-y-1 pointer-events-none">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-ping" />
              <span className="text-[9px] font-mono text-green-400 uppercase tracking-widest font-semibold">
                Klick-guide Pågår (Steg {activeGuide.currentStepIndex + 1} av {activeGuide.steps.length})
              </span>
              {activeQuery && (
                <span className="text-[9px] text-bone/45 font-mono truncate max-w-[220px]" title={activeQuery}>
                  — Fråga: "{activeQuery}"
                </span>
              )}
            </div>
            <p className="text-xs text-bone font-medium font-sans">
              {activeGuide.steps[activeGuide.currentStepIndex]?.instruction}
            </p>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 border-bone/5 pt-2 md:pt-0 shrink-0">
            <button
              onClick={cancelGuide}
              className="px-2.5 py-1.5 text-[9px] font-mono uppercase tracking-wider text-red-400 hover:bg-red-500/10 rounded-sm transition-all cursor-pointer"
            >
              Avbryt
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={prevStep}
                disabled={activeGuide.currentStepIndex === 0}
                className="p-1.5 border border-bone/10 text-bone/60 hover:text-bone disabled:opacity-20 transition-all rounded cursor-pointer"
                title="Föregående"
              >
                <ArrowLeft size={12} />
              </button>

              <button
                onClick={nextStep}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-ember text-ink font-bold font-mono text-[9px] uppercase tracking-widest rounded-sm hover:bg-ember/90 transition-all cursor-pointer"
              >
                {activeGuide.currentStepIndex === activeGuide.steps.length - 1 ? (
                  <>Klar <CheckCircle size={10} /></>
                ) : (
                  <>Nästa <ArrowRight size={10} /></>
                )}
              </button>

              <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-bone/10 hover:border-bone text-bone/80 hover:text-bone font-bold font-mono text-[9px] uppercase tracking-widest rounded-sm transition-all cursor-pointer ml-1"
              >
                Chatt <Sparkles size={10} className="text-ember" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Window Panel (Fixed position, top right corner) */}
      {isOpen && (
        <div className="fixed top-6 right-6 z-[1000] w-96 max-w-[calc(100vw-2rem)] h-[550px] bg-ink/95 backdrop-blur-xl border border-bone/10 shadow-2xl rounded-lg flex flex-col justify-between overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-stage/40 border-b border-bone/10 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-ember" />
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
                <RotateCcw size={13} />
              </button>
              <button
                onClick={() => setShowConfig(!showConfig)}
                className={`p-1.5 hover:bg-bone/10 rounded transition-colors cursor-pointer ${showConfig ? "text-ember" : "text-bone/45 hover:text-bone"}`}
                title="Inställningar & Gemini API-nyckel"
              >
                <Sliders size={13} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-bone/45 hover:text-bone hover:bg-bone/10 rounded transition-colors cursor-pointer"
              >
                <X size={13} />
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
                chatMode === "guide"
                  ? "bg-ember text-ink shadow"
                  : "text-bone/50 hover:text-bone hover:bg-bone/[0.03]"
              }`}
            >
              Klick-guiden
            </button>
            <button
              type="button"
              onClick={() => {
                setChatMode("general");
                cancelGuide(); // Stop active guide walkthroughs if switching to general chat
              }}
              className={`flex-1 py-1.5 rounded text-[10px] uppercase font-mono tracking-wider font-semibold transition-all cursor-pointer ${
                chatMode === "general"
                  ? "bg-ember text-ink shadow"
                  : "text-bone/50 hover:text-bone hover:bg-bone/[0.03]"
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
                Ange din personliga Gemini API-nyckel för att anropa Gemini 3.1-Flash-Lite direkt från webbläsaren. Om fältet lämnas tomt används inbyggda offline-mönster.
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
                  <span className="text-[9px] font-mono text-ember uppercase tracking-widest font-semibold">Aktiv Guide</span>
                  <span className="text-[9px] font-mono text-bone/45 uppercase">
                    Steg {activeGuide.currentStepIndex + 1} av {activeGuide.steps.length}
                  </span>
                </div>
                
                {/* User query display box */}
                {activeQuery && (
                  <div className="bg-stage/35 border border-bone/5 px-3 py-2 rounded-sm text-left">
                    <span className="text-[8px] font-mono text-bone/45 uppercase block mb-0.5">Din Fråga:</span>
                    <p className="text-xs text-bone font-medium font-sans italic">
                      "{activeQuery}"
                    </p>
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
                    <ArrowLeft size={12} />
                  </button>

                  <button
                    onClick={nextStep}
                    className="flex items-center gap-1.5 px-4 py-2 bg-ember text-ink font-bold font-mono text-[9px] uppercase tracking-widest rounded-sm hover:bg-ember/90 transition-all cursor-pointer shadow-lg shadow-ember/15"
                  >
                    {activeGuide.currentStepIndex === activeGuide.steps.length - 1 ? (
                      <>
                        Klar <CheckCircle size={10} />
                      </>
                    ) : (
                      <>
                        Nästa <ArrowRight size={10} />
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
                      <HelpCircle size={10} /> Snabba förslag:
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
                    Skicka <Send size={10} />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
