import React, { useState, useEffect } from "react";
import { DashboardHero } from "./DashboardHero";
import { DashboardBio } from "./DashboardBio";
import { DashboardPortfolio } from "./DashboardPortfolio";
import { DashboardCredits } from "./DashboardCredits";
import { DashboardSeo } from "./DashboardSeo";
import { LogOut, Home, Star, User, Image, List, Settings, Database, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { isSupabaseConfigured } from "../../lib/supabase";
import { checkDatabaseSeeded, seedDatabaseWithCurrentContent } from "../../lib/supabase-sync";

interface BackstageDashboardProps {
  onLogout: () => void;
}

type TabType = "hero" | "bio" | "portfolio" | "credits" | "seo";

export function BackstageDashboard({ onLogout }: BackstageDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("hero");
  const [isConfigured, setIsConfigured] = useState(false);
  const [isSeeded, setIsSeeded] = useState(true);
  const [checkingDb, setCheckingDb] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    const configured = isSupabaseConfigured();
    setIsConfigured(configured);

    if (configured) {
      setCheckingDb(true);
      checkDatabaseSeeded()
        .then(({ seeded }) => {
          setIsSeeded(seeded);
        })
        .finally(() => {
          setCheckingDb(false);
        });
    }
  }, []);

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    toast.loading("Överför webbplatsens innehåll till Supabase...", { id: "seeding-toast" });
    
    const result = await seedDatabaseWithCurrentContent();
    setIsSeeding(false);

    if (result.success) {
      setIsSeeded(true);
      toast.success(result.message, { id: "seeding-toast" });
    } else {
      toast.error(result.message, { id: "seeding-toast" });
    }
  };

  const navigationItems = [
    { id: "hero", label: "Akt I: Hero", icon: Star },
    { id: "bio", label: "Akt II: Biografi", icon: User },
    { id: "portfolio", label: "Akt III: Galleri", icon: Image },
    { id: "credits", label: "Akt IV: Meriter", icon: List },
    { id: "seo", label: "Akt V: SEO", icon: Settings },
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
      case "credits":
        return <DashboardCredits />;
      case "seo":
        return <DashboardSeo />;
      default:
        return <DashboardHero />;
    }
  };

  return (
    <div className="min-h-screen bg-stage text-bone flex flex-col md:flex-row relative">
      {/* Background grain */}
      <div className="absolute inset-0 pointer-events-none bg-grain opacity-[0.012]" />

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-bone/10 bg-ink/90 backdrop-blur-md p-6 flex flex-col justify-between shrink-0 relative z-20">
        <div>
          {/* Logo / Header */}
          <div className="mb-8 flex items-center justify-between">
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
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-mono rounded-sm transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-ember text-ink font-semibold shadow-md"
                      : "text-bone/60 hover:text-bone hover:bg-bone/[0.04]"
                  }`}
                >
                  <Icon size={14} className={isActive ? "text-ink" : "text-bone/45"} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Operations */}
        <div className="mt-8 space-y-2 border-t border-bone/5 pt-6">
          {isConfigured && (
            <button
              type="button"
              onClick={handleSeedDatabase}
              disabled={isSeeding}
              className="w-full flex items-center gap-3 px-4 py-2 text-[9px] uppercase tracking-widest font-mono text-ember/60 hover:text-ember transition-colors cursor-pointer text-left"
            >
              <RefreshCw size={11} className={isSeeding ? "animate-spin" : ""} />
              Tvinga Synk till DB
            </button>
          )}
          <a
            href="/"
            className="w-full flex items-center gap-3 px-4 py-2.5 text-[10px] uppercase tracking-widest font-mono text-bone/50 hover:text-bone transition-colors cursor-pointer"
          >
            <Home size={13} />
            Visa Webbplats
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-[10px] uppercase tracking-widest font-mono text-red-400/70 hover:text-red-400 transition-colors cursor-pointer text-left"
          >
            <LogOut size={13} />
            Logga Ut
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-h-screen relative z-10">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Seeding Prompt Banner */}
          {isConfigured && !isSeeded && !checkingDb && (
            <div className="border border-ember/20 bg-ember/5 p-6 rounded-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-bone flex items-center gap-2 font-mono uppercase tracking-wider">
                  <Database size={16} className="text-ember animate-pulse" />
                  Importera befintligt innehåll till databasen
                </h3>
                <p className="text-xs text-bone/70 max-w-2xl leading-relaxed">
                  Dina Supabase-inställningar i <code className="text-ember">.env</code> är aktiva, men databasen saknar innehåll. Klicka på knappen nedan för att automatiskt kopiera alla befintliga texter, bilder, showreels och meriter till Supabase så du kan redigera dem härifrån.
                </p>
              </div>
              <button
                onClick={handleSeedDatabase}
                disabled={isSeeding}
                className="flex items-center gap-2 px-4 py-2.5 bg-ember text-ink font-mono text-[10px] uppercase tracking-widest font-bold rounded-sm hover:bg-ember/90 transition-all cursor-pointer whitespace-nowrap"
              >
                {isSeeding ? (
                  <RefreshCw size={12} className="animate-spin" />
                ) : (
                  <RefreshCw size={12} />
                )}
                Kopiera till Supabase
              </button>
            </div>
          )}

          {/* Missing .env credentials Warning */}
          {!isConfigured && (
            <div className="border border-red-500/20 bg-red-500/5 p-6 rounded-sm">
              <h3 className="text-sm font-semibold text-bone flex items-center gap-2 font-mono uppercase tracking-wider">
                <AlertCircle size={16} className="text-red-400" />
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
    </div>
  );
}
