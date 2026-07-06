import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { BackstageLogin } from "../components/backstage/BackstageLogin";
import { BackstageDashboard } from "../components/backstage/BackstageDashboard";

export const Route = createFileRoute("/backstage")({
  component: BackstagePage,
});

export default function BackstagePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Access localStorage safely in browser context
    if (typeof window !== "undefined") {
      const auth = window.localStorage.getItem("tj-backstage-auth");
      if (auth === "true") {
        setIsAuthenticated(true);
      }
    }
    setIsChecking(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-stage flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-ember border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div data-no-spotlight className="backstage-root-container min-h-screen">
      <style>{`
        .backstage-root-container {
          cursor: auto !important;
        }
        .backstage-root-container * {
          cursor: auto;
        }
        .backstage-root-container a,
        .backstage-root-container button,
        .backstage-root-container select,
        .backstage-root-container [role="button"],
        .backstage-root-container input[type="checkbox"],
        .backstage-root-container input[type="radio"],
        .backstage-root-container .cursor-pointer {
          cursor: pointer !important;
        }
        .backstage-root-container input[type="text"],
        .backstage-root-container input[type="password"],
        .backstage-root-container textarea {
          cursor: text !important;
        }
      `}</style>
      {isAuthenticated ? (
        <BackstageDashboard onLogout={handleLogout} />
      ) : (
        <BackstageLogin onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}
