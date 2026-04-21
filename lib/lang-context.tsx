"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Lang } from "./translations";

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LangContext = createContext<LangContextType>({
  lang: "fr",
  setLang: () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    // 1. Check localStorage (manuel)
    const stored = localStorage.getItem("lang") as Lang | null;
    if (stored === "fr" || stored === "en") {
      setLangState(stored);
      return;
    }
    // 2. Detect browser language
    const browserLang = navigator.language.slice(0, 2).toLowerCase();
    setLangState(browserLang === "fr" ? "fr" : "en");
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
