import React, { useState, useEffect, useRef } from "react";
import { DashboardHero } from "./DashboardHero";
import { DashboardBio } from "./DashboardBio";
import { DashboardPortfolio } from "./DashboardPortfolio";
import { DashboardShowreels } from "./DashboardShowreels";
import { DashboardCredits } from "./DashboardCredits";
import { DashboardVoice } from "./DashboardVoice";
import { DashboardSeo } from "./DashboardSeo";
import { DashboardMedia } from "./DashboardMedia";
import { DashboardContact } from "./DashboardContact";
import { DashboardCurtain } from "./DashboardCurtain";
import { DashboardFaq } from "./DashboardFaq";
import { DashboardPress } from "./DashboardPress";
import { LogOut, Home, Star, User, Image, Video, List, Settings, Database, RefreshCw, AlertCircle, FolderOpen, Volume2, Mail, Film, MessageCircleQuestion, FileText } from "lucide-react";
import { toast } from "sonner";
import { isSupabaseConfigured } from "../../lib/supabase";
import { KlickGuideWidget } from "./KlickGuideWidget";

interface BackstageDashboardProps {
  onLogout: () => void;
}

type TabType = "hero" | "bio" | "portfolio" | "showreels" | "credits" | "voice" | "contact" | "curtain" | "faq" | "seo" | "media" | "press";

export function BackstageDashboard({ onLogout }: BackstageDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("hero");
  const [isConfigured, setIsConfigured] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  
  const HomeIcon = Home as any;
  const LogOutIcon = LogOut as any;
  const AlertCircleIcon = AlertCircle as any;

  useEffect(() => {
    setIsConfigured(isSupabaseConfigured());
  }, []);

  // Auto-expand all CMS textareas as content grows so text is never clipped or scrolled
  useEffect(() => {
    const container = mainRef.current;
    if (!container) return;

    const resizeTextarea = (el: HTMLTextAreaElement) => {
      el.style.overflowY = "hidden";
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    };

    const resizeAll = () => {
      container.querySelectorAll("textarea").forEach((el) => resizeTextarea(el));
    };

    const handleInput = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (target && target.tagName === "TEXTAREA") {
        resizeTextarea(target as HTMLTextAreaElement);
      }
    };

    resizeAll();
    const raf = requestAnimationFrame(resizeAll);
    const observer = new MutationObserver(() => requestAnimationFrame(resizeAll));
    observer.observe(container, { childList: true, subtree: true });
    container.addEventListener("input", handleInput);
    window.addEventListener("resize", resizeAll);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      container.removeEventListener("input", handleInput);
      window.removeEventListener("resize", resizeAll);
    };
  }, [activeTab]);

  const navigationItems = [
    { id: "hero", label: "Akt I: Ridåuppgång", icon: Star },
    { id: "bio", label: "Akt II: Biografi", icon: User },
    { id: "portfolio", label: "Akt III: Portfolio", icon: Image },
    { id: "showreels", label: "Akt IV: Showreels", icon: Video },
    { id: "credits", label: "Akt V: Meriter", icon: List },
    { id: "voice", label: "Akt VI: Röst", icon: Volume2 },
    { id: "contact", label: "Akt VII: Kontaktinfo", icon: Mail },
    { id: "curtain", label: "Akt VIII: Ridåfall", icon: Film },
    { id: "faq", label: "Vanliga Frågor (FAQ)", icon: MessageCircleQuestion },
    { id: "press", label: "Press & Media", icon: FileText },
    { id: "seo", label: "SEO & Inställningar", icon: Settings },
    { id: "media", label: "Mediebibliotek", icon: FolderOpen },
  ];

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("tj-backstage-auth");
    }
    toast.success("Utloggad från backstage.");
    onLogout();
  };

  const renderActiveContent = () => {
    switch (activeTab) {
      case "hero":
        return <DashboardHero />;
      case "bio":
        return <DashboardBio />;
      case "portfolio":
        return <DashboardPortfolio />;
      case "showreels":
        return <DashboardShowreels />;
      case "credits":
        return <DashboardCredits />;
      case "voice":
        return <DashboardVoice />;
      case "contact":
        return <DashboardContact />;
      case "curtain":
        return <DashboardCurtain />;
      case "faq":
        return <DashboardFaq />;
      case "press":
        return <DashboardPress />;
      case "seo":
        return <DashboardSeo />;
      case "media":
        return <DashboardMedia />;
      default:
        return <DashboardHero />;
    }
  };

  return (
    <div className="min-h-screen bg-stage text-bone flex flex-col md:flex-row relative">
      {/* Background grain */}
      <div className="absolute inset-0 pointer-events-none bg-grain opacity-[0.012]" />

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-60 border-b md:border-b-0 md:border-r border-bone/10 bg-ink/90 backdrop-blur-md p-4 flex flex-col justify-between shrink-0 relative z-20">
        <div>
          {/* Logo / Header */}
          <div className="mb-6 flex items-center justify-between px-2">
            <div>
              <span className="text-[9px] uppercase tracking-[0.4em] text-ember font-mono block">
                theresejarvheden.se
              </span>
              <span className="font-display text-xl uppercase tracking-wider text-bone block mt-1">
                Backstage <span className="italic text-ember/90">CMS</span>
              </span>
            </div>
          </div>
 
          {/* Navigation Links */}
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon as any;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`klick-nav-${item.id}`}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-widest font-mono rounded-sm transition-all duration-300 cursor-pointer whitespace-nowrap text-left ${
                    isActive
                      ? "bg-ember text-ink font-semibold shadow-md"
                      : "text-bone/60 hover:text-bone hover:bg-bone/[0.04]"
                  }`}
                >
                  <Icon size={16} className={`flex-shrink-0 ${isActive ? "text-ink" : "text-bone/45"}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Operations */}
        <div className="mt-8 space-y-2 border-t border-bone/5 pt-6">
          <a
            href="/"
            className="w-full flex items-center gap-3 px-4 py-2.5 text-[10px] uppercase tracking-widest font-mono text-bone/50 hover:text-bone transition-colors cursor-pointer"
          >
            <HomeIcon size={13} />
            Visa Webbplats
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-[10px] uppercase tracking-widest font-mono text-red-400/70 hover:text-red-400 transition-colors cursor-pointer text-left"
          >
            <LogOutIcon size={13} />
            Logga Ut
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main ref={mainRef} className="backstage-cms flex-1 p-6 md:p-12 overflow-y-auto max-h-screen relative z-10">
        <style>{`
          .backstage-cms label { color: rgba(244, 241, 234, 0.85) !important; }
          .backstage-cms [class*="text-bone/4"],
          .backstage-cms [class*="text-bone/5"] { color: rgba(244, 241, 234, 0.75) !important; }
          .backstage-cms input:not([type="checkbox"]):not([type="radio"]):not([type="file"]),
          .backstage-cms textarea,
          .backstage-cms select {
            color: #f4f1ea !important;
            background-color: rgba(255, 255, 255, 0.05) !important;
            border-width: 1px !important;
            border-style: solid !important;
            border-color: rgba(244, 241, 234, 0.28) !important;
          }
          .backstage-cms input::placeholder,
          .backstage-cms textarea::placeholder {
            color: rgba(244, 241, 234, 0.45) !important;
          }
          .backstage-cms input:focus,
          .backstage-cms textarea:focus,
          .backstage-cms select:focus {
            border-color: #d97757 !important;
            background-color: rgba(255, 255, 255, 0.08) !important;
            box-shadow: 0 0 0 1px rgba(217, 119, 87, 0.35);
          }
          .backstage-cms [class*="border-ember"] {
            border-color: rgba(217, 119, 87, 0.78) !important;
          }
          .backstage-cms [class*="bg-stage/5"][class*="border"] {
            border-color: rgba(217, 119, 87, 0.55) !important;
            box-shadow: 0 0 0 1px rgba(217, 119, 87, 0.12);
          }
        `}</style>
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Missing .env credentials Warning */}
          {!isConfigured && (
            <div className="border border-red-500/20 bg-red-500/5 p-6 rounded-sm">
              <h3 className="text-sm font-semibold text-bone flex items-center gap-2 font-mono uppercase tracking-wider">
                <AlertCircleIcon size={16} className="text-red-400" />
                Supabase-anslutning saknas
              </h3>
              <p className="text-xs text-bone/70 mt-1 leading-relaxed">
                Din <code className="text-red-400">.env</code>-fil är inte konfigurerad med giltiga Supabase-uppgifter. CMS-panelen körs i demonstrationsläge och sparar inga ändringar till webbplatsen. Lägg till dina Supabase-nycklar i <code className="text-red-400">.env</code> för att aktivera CMS-tjänsten.
              </p>
            </div>
          )}

          {renderActiveContent()}
        </div>
      </main>
      {/* Klick-guiden Chatbot Companion */}
      <KlickGuideWidget activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
