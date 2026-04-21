"use client";

import { useLang } from "@/lib/lang-context";

export function LanguageToggle() {
  const { lang, setLang } = useLang();

  return (
    <div className="flex items-center gap-1 text-xs font-bold tracking-wider">
      <button
        onClick={() => setLang("fr")}
        className={`px-2 py-1 rounded transition-colors ${
          lang === "fr"
            ? "text-white"
            : "text-gray-500 hover:text-gray-300"
        }`}
        aria-label="Français"
      >
        FR
      </button>
      <span className="text-gray-600">|</span>
      <button
        onClick={() => setLang("en")}
        className={`px-2 py-1 rounded transition-colors ${
          lang === "en"
            ? "text-white"
            : "text-gray-500 hover:text-gray-300"
        }`}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}
