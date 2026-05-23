"use client";

import React, { useState, useEffect } from "react";
import LandingPage from "../components/LandingPage";
import DesignerConsole from "../components/DesignerConsole";

export default function Home() {
  const [view, setView] = useState("landing"); // landing, app
  const [tier, setTier] = useState("pro");

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#designer") {
        setView("app");
      } else {
        setView("landing");
      }
    };

    // check on load
    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleLaunchConsole = (selectedTier) => {
    setTier(selectedTier);
    setView("app");
    window.location.hash = "designer";
  };

  const handleExitConsole = () => {
    setView("landing");
    window.location.hash = "";
  };

  return (
    <>
      {view === "landing" ? (
        <LandingPage onLaunchConsole={handleLaunchConsole} />
      ) : (
        <DesignerConsole
          tier={tier}
          onChangeTier={setTier}
          onExit={handleExitConsole}
        />
      )}
    </>
  );
}
