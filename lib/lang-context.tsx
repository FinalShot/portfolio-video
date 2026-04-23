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

interface LangProviderProps {
  children: React.ReactNode;
  // ← reçu depuis le layout server (lu via cookie) pour éviter tout flash
  initialLang?: Lang;
}

export function LangProvider({ children, initialLang = "fr" }: LangProviderProps) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    // Vérification unique après hydratation :
    // si un cookie ou localStorage diffère de l'initial, on synchro.
    const stored = localStorage.getItem("lang") as Lang | null;
    if (stored === "fr" || stored === "en") {
      setLangState(stored);
      return;
    }
    // Détection navigateur uniquement si aucun cookie ni localStorage
    const browserLang = navigator.language.slice(0, 2).toLowerCase();
    const detected: Lang = browserLang === "fr" ? "fr" : "en";
    if (detected !== initialLang) {
      setLangState(detected);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
    // ← Écrit aussi un cookie lisible côté serveur (layout)
    document.cookie = `lang=${l}; path=/; max-age=31536000; SameSite=Lax`;
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
