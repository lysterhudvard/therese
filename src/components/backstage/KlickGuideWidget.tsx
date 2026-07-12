import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { getInteractiveGuide, getGeneralChatResponse } from "../../lib/gemini";
import { Step } from "./klickguide/types";
import { KlickGuideOverlay } from "./klickguide/KlickGuideOverlay";
import { KlickGuideChat } from "./klickguide/KlickGuideChat";

interface KlickGuideWidgetProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
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

  // Draggable coordinates ONLY for the minimized active klick-guide container
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
      } else if (target.startsWith("klick-contact-") && activeTab !== "contact") {
        setActiveTab("contact");
      } else if (target.startsWith("klick-curtain-") && activeTab !== "curtain") {
        setActiveTab("curtain");
      } else if (target.startsWith("klick-seo-") && activeTab !== "seo") {
        setActiveTab("seo");
      } else if (target.startsWith("klick-media-") && activeTab !== "media") {
        setActiveTab("media");
      }
    }

    // 2. Add glow highlight to the target element
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
        setBadgePosition({
          top: rect.top - 12,
          left: rect.left - 12,
          visible: true,
        });
      } else {
        setBadgePosition((prev) => ({ ...prev, visible: false }));
      }
    };

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
        setTimeout(() => {
          nextStep();
        }, 150);
      }
    };

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
      alert("Gemini API-nyckel har sparats lokalt!");
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
        const response = await getInteractiveGuide(userText, apiKey);
        
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: response.message },
        ]);

        if (response.steps && response.steps.length > 0) {
          setActiveQuery(userText);
          setPosition({ x: 0, y: 0 });
          setActiveGuide({
            message: response.message,
            steps: response.steps,
            currentStepIndex: 0,
          });
        } else {
          toast.info("Inga klicksteg hittades för denna förfrågan. Prova att fråga annorlunda.");
        }
      } else {
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
          setPosition({ x: 0, y: 0 });
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

  return (
    <>
      <KlickGuideOverlay
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        badgePosition={badgePosition}
        activeGuide={activeGuide}
        activeQuery={activeQuery}
        position={position}
        isDragging={isDragging}
        handleDragStart={handleDragStart}
        handleTouchStart={handleTouchStart}
        handleDoubleClickHeader={handleDoubleClickHeader}
        cancelGuide={cancelGuide}
        prevStep={prevStep}
        nextStep={nextStep}
      />

      <KlickGuideChat
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        chatMode={chatMode}
        setChatMode={setChatMode}
        showConfig={showConfig}
        setShowConfig={setShowConfig}
        apiKey={apiKey}
        setApiKey={setApiKey}
        messages={messages}
        query={query}
        setQuery={setQuery}
        loading={loading}
        handleClearChat={handleClearChat}
        handleClearKey={handleClearKey}
        handleSaveKey={handleSaveKey}
        handleQuerySubmit={handleQuerySubmit}
        handleSuggestionClick={handleSuggestionClick}
        activeGuide={activeGuide}
        activeQuery={activeQuery}
        cancelGuide={cancelGuide}
        prevStep={prevStep}
        nextStep={nextStep}
        messagesEndRef={messagesEndRef}
      />
    </>
  );
}
