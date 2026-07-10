import { useState, useEffect } from "react";
import { useT } from "../../hooks/use-t";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const LOCAL_STORAGE_KEY = "tj-cookie-consent";

const TEXTS = {
  sv: {
    title: "Vi värnar om din integritet",
    description: "Denna webbplats använder cookies för att ge dig en så bra upplevelse som möjligt. Vissa cookies är nödvändiga för säkerhet och funktioner, medan andra hjälper oss att mäta användning och optimera prestanda.",
    acceptAll: "Acceptera alla",
    rejectAll: "Neka alla",
    customize: "Hantera inställningar",
    save: "Spara mina val",
    back: "Tillbaka",
    policyTitle: "Integritetspolicy",
    policyIntro: "Här beskriver vi hur vi hanterar personuppgifter och cookies på theresejarvheden.se.",
    catNecessary: "Nödvändiga cookies",
    catNecessaryDesc: "Krävs för grundläggande funktioner och säkerhet. Dessa kan inte inaktiveras.",
    catAnalytics: "Analys & statistik",
    catAnalyticsDesc: "Hjälper oss förstå hur webbplatsen används så vi kan förbättra design och laddningstider.",
    catMarketing: "Marknadsföring",
    catMarketingDesc: "Används för att optimera eventuell kommunikation och anpassade erbjudanden.",
    privacyLabel: "Läs vår Integritetspolicy",
    closePolicy: "Stäng policy",
    statusText: "Val sparat i din webbläsare",
    privacyText: [
      { h: "1. Personuppgifter", p: "När du skickar meddelanden via kontaktformuläret samlar vi in namn, e-post och meddelande. Detta lagras säkert i Supabase och används endast för att svara på dina förfrågningar angående casting eller samarbete. Uppgifterna säljs aldrig vidare." },
      { h: "2. Cookies", p: "Webbplatsen använder cookies för att komma ihåg ditt språkval och dina integritetsinställningar. Om du tillåter statistik hjälper det oss att mäta laddningstider och besöksmönster anonymt." },
      { h: "3. Dina Rättigheter", p: "Du har enligt GDPR rätt att när som helst begära ut, ändra eller radera de personuppgifter vi sparat. Kontakta oss direkt på kontaktformuläret för detta." }
    ]
  },
  en: {
    title: "We value your privacy",
    description: "This website uses cookies to enhance your experience. Some cookies are necessary for basic functions and security, while others help us analyze site performance and traffic.",
    acceptAll: "Accept all",
    rejectAll: "Reject all",
    customize: "Manage settings",
    save: "Save my choices",
    back: "Back",
    policyTitle: "Privacy Policy",
    policyIntro: "Here we describe how we handle personal data and cookies on theresejarvheden.se.",
    catNecessary: "Necessary cookies",
    catNecessaryDesc: "Required for core website features and security. These cannot be disabled.",
    catAnalytics: "Analytics & statistics",
    catAnalyticsDesc: "Helps us understand how the website is used so we can improve design and load times.",
    catMarketing: "Marketing",
    catMarketingDesc: "Used to optimize potential communications and tailored offers.",
    privacyLabel: "Read our Privacy Policy",
    closePolicy: "Close policy",
    statusText: "Choices saved in browser",
    privacyText: [
      { h: "1. Personal Data", p: "When you send a message through our contact form, we collect your name, email, and message. This is stored securely in Supabase and only used to respond to your inquiries regarding casting or collaboration. Your data is never sold." },
      { h: "2. Cookies", p: "The website uses cookies to remember your language and privacy preferences. If you allow statistics, it helps us monitor load times and visitor patterns anonymously." },
      { h: "3. Your Rights", p: "Under GDPR, you have the right to request, modify, or delete any personal data we have stored about you at any time. Contact us through the form for assistance." }
    ]
  }
};

export function CookieConsent() {
  const { lang } = useT();
  const [isVisible, setIsVisible] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);
  const [view, setView] = useState<"banner" | "settings" | "policy">("banner");
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: true,
    marketing: true,
  });

  const t = TEXTS[lang === "sv" ? "sv" : "en"];

  useEffect(() => {
    // Check if user already consented
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) {
      // Delay display slightly for nice cinematic fade in after curtain clears
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3500);
      return () => clearTimeout(timer);
    } else {
      setHasConsented(true);
      try {
        const parsed = JSON.parse(stored) as CookiePreferences;
        setPreferences({
          necessary: true,
          analytics: !!parsed.analytics,
          marketing: !!parsed.marketing,
        });
      } catch (e) {
        setIsVisible(true);
        setHasConsented(false);
      }
    }
  }, []);

  // Listen for the custom open event (e.g. from footer link)
  useEffect(() => {
    const handleOpen = () => {
      setView("settings");
      setIsVisible(true);
    };

    window.addEventListener("open-cookie-settings", handleOpen);
    return () => {
      window.removeEventListener("open-cookie-settings", handleOpen);
    };
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(prefs));
    setPreferences(prefs);
    setIsVisible(false);
    setHasConsented(true);

    // Dispatch custom event to notify analytics or scripts if they are loaded in the future
    window.dispatchEvent(
      new CustomEvent("cookie-consent-updated", { detail: prefs })
    );
  };

  const handleAcceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true });
  };

  const handleRejectAll = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false });
  };

  const handleSaveCustom = () => {
    saveConsent(preferences);
  };

  return (
    <>
      {/* Floating Consent Trigger Button (half-hidden at left edge with arrow) */}
      {!isVisible && hasConsented && (
        <button
          onClick={() => {
            setView("settings");
            setIsVisible(true);
          }}
          className="fixed left-0 bottom-2 z-[95] w-14 h-14 rounded-full flex items-center justify-end pr-2 bg-transparent border border-bone/15 text-bone hover:text-ember hover:border-ember/40 shadow-[4px_0_15px_rgba(0,0,0,0.6)] -translate-x-1/2 hover:translate-x-0 transition-all duration-500 ease-out cursor-pointer group animate-in fade-in duration-300"
          style={{ cursor: "pointer" }}
          title={lang === "sv" ? "Cookie-inställningar" : "Cookie Settings"}
          aria-label="Cookie Settings"
        >
          {/* Cookie Icon (slid out/visible when hovered) */}
          <svg 
            className="w-4 h-4 mr-2 text-bone/70 group-hover:text-ember transition-colors duration-300" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm3,14a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,15,16Zm1.5-6.5A1.25,1.25,0,1,1,17.75,8.25,1.25,1.25,0,0,1,16.5,9.5Zm-9,3.5A1.5,1.5,0,1,1,9,11.5,1.5,1.5,0,0,1,7.5,13Zm3.5,3.5a1,1,0,1,1,1-1A1,1,0,0,1,11,16.5Zm0-8a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,11,8.5Z" />
          </svg>

          {/* Right arrow / chevron */}
          <svg 
            className="w-4 h-4 text-ember transition-transform duration-300 group-hover:translate-x-0.5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="3"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          
          {/* Tooltip to the right of the button */}
          <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-ink border border-bone/10 text-bone text-[9px] uppercase tracking-widest px-2.5 py-1 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-md">
            {lang === "sv" ? "Inställningar" : "Cookie Settings"}
          </span>
        </button>
      )}

      {/* Main Banner / Settings Dialog */}
      {isVisible && (
        <div 
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-[100] animate-in fade-in slide-in-from-bottom-8 duration-500 cursor-default"
          style={{ cursor: "default" }}
        >
          <div className="relative overflow-hidden bg-ink/95 border border-bone/15 backdrop-blur-xl rounded-lg p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)] film-grain">
            {/* Subtle decorative glowing border on top */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-ember/40 to-transparent" />

            {view === "banner" && (
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 text-ember">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-display text-lg tracking-wider text-bone font-semibold">
                      {t.title}
                    </h3>
                    <p className="mt-1 text-xs text-ash leading-relaxed font-sans">
                      {t.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex gap-2">
                    <button
                      onClick={handleAcceptAll}
                      className="flex-1 px-4 py-2 bg-ember text-ink text-xs uppercase tracking-widest font-semibold hover:bg-ember-soft transition-all duration-300 rounded cursor-pointer text-center"
                    >
                      {t.acceptAll}
                    </button>
                    <button
                      onClick={handleRejectAll}
                      className="flex-1 px-4 py-2 bg-transparent text-bone border border-bone/20 text-xs uppercase tracking-widest font-semibold hover:bg-bone/10 transition-all duration-300 rounded cursor-pointer text-center"
                    >
                      {t.rejectAll}
                    </button>
                  </div>
                  <button
                    onClick={() => setView("settings")}
                    className="w-full text-center py-2 text-[10px] uppercase tracking-[0.2em] text-ash hover:text-ember transition-colors cursor-pointer"
                  >
                    {t.customize}
                  </button>
                </div>
              </div>
            )}

            {view === "settings" && (
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="font-display text-lg tracking-wider text-bone font-semibold">
                    {t.customize}
                  </h3>
                  <p className="mt-1 text-[10px] text-ash leading-relaxed">
                    {t.policyIntro}
                  </p>
                </div>

                <div className="flex flex-col gap-3 my-2 max-h-60 overflow-y-auto no-scrollbar">
                  {/* Necessary */}
                  <div className="flex items-start justify-between gap-3 p-2 rounded bg-white/5 border border-white/5">
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-bone">{t.catNecessary}</span>
                      <p className="text-[9px] text-ash mt-0.5 leading-snug">{t.catNecessaryDesc}</p>
                    </div>
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked
                        disabled
                        className="w-4 h-4 bg-ink border border-bone/30 rounded accent-ember opacity-50 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Analytics */}
                  <label className="flex items-start justify-between gap-3 p-2 rounded bg-white/5 border border-white/5 hover:border-ember/20 transition-colors cursor-pointer">
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-bone">{t.catAnalytics}</span>
                      <p className="text-[9px] text-ash mt-0.5 leading-snug">{t.catAnalyticsDesc}</p>
                    </div>
                    <div className="relative flex items-center pt-1">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                        className="w-4 h-4 bg-ink border border-bone/30 rounded accent-ember cursor-pointer"
                      />
                    </div>
                  </label>

                  {/* Marketing */}
                  <label className="flex items-start justify-between gap-3 p-2 rounded bg-white/5 border border-white/5 hover:border-ember/20 transition-colors cursor-pointer">
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-bone">{t.catMarketing}</span>
                      <p className="text-[9px] text-ash mt-0.5 leading-snug">{t.catMarketingDesc}</p>
                    </div>
                    <div className="relative flex items-center pt-1">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                        className="w-4 h-4 bg-ink border border-bone/30 rounded accent-ember cursor-pointer"
                      />
                    </div>
                  </label>
                </div>

                <div className="flex flex-col gap-2 mt-1">
                  <button
                    onClick={handleSaveCustom}
                    className="w-full px-4 py-2 bg-ember text-ink text-xs uppercase tracking-widest font-semibold hover:bg-ember-soft transition-all duration-300 rounded cursor-pointer text-center"
                  >
                    {t.save}
                  </button>
                  <div className="flex justify-between items-center mt-1">
                    <button
                      onClick={() => setView("banner")}
                      className="text-[9px] uppercase tracking-widest text-ash hover:text-bone transition-colors cursor-pointer"
                    >
                      &larr; {t.back}
                    </button>
                    <button
                      onClick={() => setView("policy")}
                      className="text-[9px] uppercase tracking-widest text-ember hover:underline cursor-pointer"
                    >
                      {t.privacyLabel}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {view === "policy" && (
              <div className="flex flex-col gap-4">
                <div className="border-b border-bone/10 pb-2">
                  <h3 className="font-display text-lg tracking-wider text-bone font-semibold">
                    {t.policyTitle}
                  </h3>
                </div>

                <div className="overflow-y-auto max-h-64 pr-1 text-[10px] text-ash space-y-3 font-sans leading-relaxed no-scrollbar">
                  {t.privacyText.map((section, idx) => (
                    <div key={idx} className="space-y-1">
                      <h4 className="font-bold text-bone text-[11px]">{section.h}</h4>
                      <p>{section.p}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-2 border-t border-bone/10 pt-3">
                  <button
                    onClick={() => setView("settings")}
                    className="text-[9px] uppercase tracking-widest text-ash hover:text-bone transition-colors cursor-pointer"
                  >
                    &larr; {t.back}
                  </button>
                  <button
                    onClick={() => setView("settings")}
                    className="px-3 py-1 bg-white/10 hover:bg-white/15 text-bone text-[9px] uppercase tracking-widest font-semibold transition-all duration-300 rounded cursor-pointer"
                  >
                    {t.closePolicy}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
