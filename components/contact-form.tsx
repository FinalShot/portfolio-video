"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, CheckCircle } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { translations } from "@/lib/translations";

const STORAGE_KEY = "contact-form-draft";

export function ContactForm() {
  const { lang } = useLang();
  const t = translations[lang].form;
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fields, setFields] = useState({ name: "", email: "", message: "" });

  // Restaure le brouillon si l'utilisateur a fermé l'onglet
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setFields(JSON.parse(saved));
    } catch {}
  }, []);

  // Sauvegarde en temps réel dans localStorage
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updated = { ...fields, [e.target.name]: e.target.value };
    setFields(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    // Honeypot anti-spam : si le champ caché est rempli, c'est un bot
    const formData = new FormData(e.currentTarget);
    if (formData.get("_hp_website")) {
      setStatus("success");
      return;
    }

    const data = {
      name:    formData.get("name"),
      email:   formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setStatus("success");
        setFields({ name: "", email: "", message: "" });
        try { localStorage.removeItem(STORAGE_KEY); } catch {}
        // Tracking Vercel Analytics
        if (typeof window !== "undefined" && (window as any).va) {
          (window as any).va("event", { name: "contact_form_submit" });
        }
      } else {
        setStatus("error");
        setErrorMessage(result.error || t.errorDefault);
      }
    } catch {
      setStatus("error");
      setErrorMessage(t.errorConnection);
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4 py-8"
        role="alert"
        aria-live="polite"
      >
        <CheckCircle className="w-12 h-12 text-green-400" aria-hidden="true" />
        <p className="text-lg font-medium text-white">{t.successTitle}</p>
        <p className="text-gray-400 text-sm">{t.successSub}</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm text-gray-400 hover:text-white transition-colors underline underline-offset-4"
        >
          {t.sendAnother}
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto text-left" noValidate>

      {/* Honeypot — invisible pour les humains, piège pour les bots */}
      <div style={{ display: "none" }} aria-hidden="true">
        <label htmlFor="_hp_website">Ne pas remplir</label>
        <input type="text" id="_hp_website" name="_hp_website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-300">
          {t.name}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          autoComplete="name"
          placeholder={t.namePlaceholder}
          value={fields.name}
          onChange={handleChange}
          className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-300">
          {t.email}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder={t.emailPlaceholder}
          value={fields.email}
          onChange={handleChange}
          className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-medium text-gray-300">
          {t.message}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          autoComplete="off"
          placeholder={t.messagePlaceholder}
          value={fields.message}
          onChange={handleChange}
          className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors resize-none"
        />
      </div>

      {status === "error" && (
        <p className="text-red-400 text-sm" role="alert" aria-live="assertive">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="flex items-center justify-center gap-2 px-6 py-3 mt-2 rounded-lg bg-white text-black font-medium hover:bg-gray-200 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ touchAction: "manipulation" }}
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            <span>{t.sending}</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" aria-hidden="true" />
            <span>{t.send}</span>
          </>
        )}
      </button>
    </form>
  );
}
