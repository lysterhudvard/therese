import React from "react";
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { Step } from "./types";

interface KlickGuideOverlayProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  badgePosition: { top: number; left: number; visible: boolean };
  activeGuide: { message: string; steps: Step[]; currentStepIndex: number } | null;
  activeQuery: string;
  position: { x: number; y: number };
  isDragging: boolean;
  handleDragStart: (e: React.MouseEvent) => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleDoubleClickHeader: () => void;
  cancelGuide: () => void;
  prevStep: () => void;
  nextStep: () => void;
}

export function KlickGuideOverlay({
  isOpen,
  setIsOpen,
  badgePosition,
  activeGuide,
  activeQuery,
  position,
  isDragging,
  handleDragStart,
  handleTouchStart,
  handleDoubleClickHeader,
  cancelGuide,
  prevStep,
  nextStep,
}: KlickGuideOverlayProps) {
  return (
    <>
      {/* Pulsating green breathing glows (lime to mint emerald) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
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
      `,
        }}
      />

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
            title="Öppna Klick-guiden"
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
                  <>
                    Klar <CheckCircle size={10} />
                  </>
                ) : (
                  <>
                    Nästa <ArrowRight size={10} />
                  </>
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
    </>
  );
}
