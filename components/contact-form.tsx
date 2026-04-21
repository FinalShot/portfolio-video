"use client";

import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, CheckCircle } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { translations } from "@/lib/translations";

export function ContactForm() {
  const { lang } = useLang();
  const t = translations[lang].form;
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
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
        (e.target as HTMLFormElement).reset();
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
      >
        <CheckCircle className="w-12 h-12 text-green-400" />
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto text-left">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-300">
          {t.name}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder={t.namePlaceholder}
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
          placeholder={t.emailPlaceholder}
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
          placeholder={t.messagePlaceholder}
          className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors resize-none"
        />
      </div>

      {status === "error" && (
        <p className="text-red-400 text-sm">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="flex items-center justify-center gap-2 px-6 py-3 mt-2 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {t.sending}
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            {t.send}
          </>
        )}
      </button>
    </form>
  );
}
