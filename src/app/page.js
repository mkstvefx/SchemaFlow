"use client";

import React, { useState, useEffect } from "react";
import LandingPage from "../components/LandingPage";
import DesignerConsole from "../components/DesignerConsole";
import AboutPage from "../components/AboutPage";
import DocumentationHub from "../components/DocumentationHub";

export default function Home() {
  const [view, setView] = useState("landing"); // landing, app, about, docs
  const [tier, setTier] = useState("pro");

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#designer") {
        setView("app");
      } else if (hash === "#about") {
        setView("about");
      } else if (hash === "#docs") {
        setView("docs");
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
      {view === "landing" && (
        <LandingPage onLaunchConsole={handleLaunchConsole} />
      )}
      {view === "app" && (
        <DesignerConsole
          tier={tier}
          onChangeTier={setTier}
          onExit={handleExitConsole}
        />
      )}
      {view === "about" && (
        <AboutPage onExit={handleExitConsole} />
      )}
      {view === "docs" && (
        <DocumentationHub onExit={() => setView("app")} />
      )}
    </>
  );
}
