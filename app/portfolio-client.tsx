"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Mail, Menu, X, Linkedin, Instagram } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { TiltCard } from "@/components/tilt-card";
import { LanguageToggle } from "@/components/language-toggle";
import { useLang } from "@/lib/lang-context";
import { translations } from "@/lib/translations";
import type { Video } from "@/lib/videos";
import Image from "next/image";

// Les clés de catégorie restent en FR (clés stables côté API YouTube)
const CATEGORY_KEYS: Record<string, keyof typeof translations["fr"]["categories"]> = {
  TOUT:                  "all",
  "PUBS & BRAND CONTENT": "ads",
  "EMISSIONS & DOCS":    "docs",
  "BANDES-ANNONCES":     "trailers",
  FICTIONS:              "fiction",
};

const FR_CATEGORIES = [
  "TOUT",
  "PUBS & BRAND CONTENT",
  "EMISSIONS & DOCS",
  "BANDES-ANNONCES",
  "FICTIONS",
];

const FADE_DURATION = 0.25;
const LAYOUT_SPRING = { type: "spring" as const, stiffness: 400, damping: 35 };

const ANIM_INITIAL       = { opacity: 0, y: 20 } as const;
const ANIM_ANIMATE       = { opacity: 1, y: 0 } as const;
const ANIM_INITIAL_SCALE = { opacity: 0, scale: 0.92 } as const;
const ANIM_ANIMATE_SCALE = { opacity: 1, scale: 1 } as const;
const ANIM_EXIT_SCALE    = { opacity: 0, scale: 0.92 } as const;

interface PortfolioClientProps {
  // Vidéos pré-fetchées côté serveur — disponibles immédiatement, sans spinner
  initialVideos: Video[];
}

export function PortfolioClient({ initialVideos }: PortfolioClientProps) {
  const { lang } = useLang();
  const t = translations[lang];

  // Plus besoin de loading ni de fetch côté client
  const [filter, setFilter]               = useState("TOUT");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    hasAnimatedRef.current = true;
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const filteredVideos =
    filter === "TOUT"
      ? initialVideos
      : initialVideos.filter((v) => v.category === filter);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 80, behavior: "smooth" });
    }
  };

  const safariGpuStyle: React.CSSProperties = {
    WebkitTransform: "translateZ(0)",
    transform: "translateZ(0)",
    WebkitBackfaceVisibility: "hidden",
    backfaceVisibility: "hidden",
  };

  const NAV_ITEMS = [
    { id: "nav-portfolio", label: t.nav.portfolio, action: () => window.scrollTo({ top: 0, behavior: "smooth" }), delay: 0.08, className: "hover:text-gray-300 transition-colors" },
    { id: "nav-about",     label: t.nav.about,     action: () => scrollTo("about"),   delay: 0.12, className: "hover:text-gray-300 transition-colors" },
    { id: "nav-contact",   label: t.nav.contact,   action: () => scrollTo("contact"), delay: 0.16, className: "bg-white text-black px-4 py-1.5 rounded-full hover:bg-gray-200 transition-colors text-sm font-bold" },
  ];

  const headerInitial = hasAnimatedRef.current ? false : ANIM_INITIAL;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-white/20">

      {/* HEADER FIXE */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-[95%] mx-auto px-6 h-20 flex items-center justify-between">

          <motion.h1
            initial={headerInitial}
            animate={ANIM_ANIMATE}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={safariGpuStyle}
            className="font-bold text-4xl tracking-[-0.005em] select-none cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            JEAN LANOT
          </motion.h1>

          <nav className="hidden md:flex items-center gap-8 text-base font-medium">
            {NAV_ITEMS.map(({ id, label, action, delay, className }) => (
              <motion.button
                key={id}
                initial={headerInitial}
                animate={ANIM_ANIMATE}
                transition={{ duration: 0.6, delay, ease: "easeOut" }}
                style={safariGpuStyle}
                onClick={action}
                className={className}
              >
                {label}
              </motion.button>
            ))}
            <motion.div
              initial={headerInitial}
              animate={ANIM_ANIMATE}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              style={safariGpuStyle}
            >
              <LanguageToggle />
            </motion.div>
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={safariGpuStyle}
              className="absolute top-0 right-0 h-full w-64 bg-[#0a0a0a] border-l border-white/10 pt-24 px-6"
            >
              <div className="flex flex-col gap-6">
                <button onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setMobileMenuOpen(false); }} className="text-left text-lg font-medium hover:text-gray-300 transition-colors py-2 border-b border-white/5">{t.nav.portfolio}</button>
                <button onClick={() => { scrollTo("about"); setMobileMenuOpen(false); }} className="text-left text-lg font-medium hover:text-gray-300 transition-colors py-2 border-b border-white/5">{t.nav.about}</button>
                <button onClick={() => { scrollTo("contact"); setMobileMenuOpen(false); }} className="text-left text-lg font-medium hover:text-gray-300 transition-colors py-2 border-b border-white/5">{t.nav.contact}</button>
                <div className="py-2 border-b border-white/5"><LanguageToggle /></div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-32 pb-20 px-6 max-w-[95%] mx-auto">

        {/* SECTION PORTFOLIO */}
        <section id="portfolio" className="mb-32">

          {/* Filtres */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center md:justify-start">
            {FR_CATEGORIES.map((cat, index) => {
              const label = t.categories[CATEGORY_KEYS[cat]];
              return (
                <motion.button
                  key={`filter-${cat}`}
                  onClick={() => setFilter(cat)}
                  initial={headerInitial}
                  animate={ANIM_ANIMATE}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.07, ease: "easeOut" }}
                  style={safariGpuStyle}
                  className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider border ${
                    filter === cat
                      ? "bg-white/90 text-black border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                      : "bg-white/5 backdrop-blur-md text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/30 hover:text-white shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                  }`}
                >
                  {label}
                </motion.button>
              );
            })}
          </div>

          {/* Grille Vidéo */}
          <LayoutGroup id="portfolio-grid">
            <motion.div
              layout="position"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12"
              transition={LAYOUT_SPRING}
            >
              <AnimatePresence>
                {filteredVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    layout="position"
                    initial={ANIM_INITIAL_SCALE}
                    animate={ANIM_ANIMATE_SCALE}
                    exit={ANIM_EXIT_SCALE}
                    transition={{
                      opacity: { duration: !hasAnimatedRef.current ? 0.4 : FADE_DURATION, ease: "easeOut", delay: !hasAnimatedRef.current ? index * 0.04 : 0 },
                      scale:   { duration: !hasAnimatedRef.current ? 0.4 : FADE_DURATION, ease: "easeOut", delay: !hasAnimatedRef.current ? index * 0.04 : 0 },
                      layout:  LAYOUT_SPRING,
                    }}
                    style={safariGpuStyle}
                  >
                    <TiltCard
                      video={video}
                      priority={index < 3}
                      index={index}
                      onClick={() => {
                        const url = video.youtubeId
                          ? `https://www.youtube.com/watch?v=${video.youtubeId}`
                          : video.videoUrl || "";
                        if (url) window.open(url, "_blank", "noopener,noreferrer");
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>

          {filteredVideos.length === 0 && (
            <div className="text-center py-20 text-gray-400">{t.noVideos}</div>
          )}
        </section>

        {/* SECTION À PROPOS */}
        <motion.section
          id="about"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={safariGpuStyle}
          className="mb-12 scroll-mt-32"
        >
          <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl relative">
                  <Image src="/ma-photo.webp" alt="Jean Lanot" width={160} height={160} className="w-full h-full object-cover" priority />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold mb-4">{t.about.title}</h2>
                <p className="text-gray-300 leading-relaxed text-justify text-xl tracking-normal">
                  {t.about.bio.split("\n").map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < t.about.bio.split("\n").length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* SECTION CONTACT */}
        <motion.section
          id="contact"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={safariGpuStyle}
          className="scroll-mt-32"
        >
          <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 text-center shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <h2 className="text-2xl font-bold mb-8">{t.contact.title}</h2>
            <ContactForm />
            <p className="mt-6 text-sm text-gray-400">
              {t.contact.orEmail}{" "}
              <a href="mailto:contact@jeanlanot.com" className="text-white hover:underline">
                contact@jeanlanot.com
              </a>
            </p>
          </div>
        </motion.section>

      </main>

      {/* FOOTER */}
      <footer className="py-8 border-t border-white/5">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            <a href="https://www.linkedin.com/in/jean-lanot" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-400 hover:text-white transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="https://www.instagram.com/jean_lanot/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="mailto:contact@jeanlanot.com" aria-label="Email" className="text-gray-400 hover:text-white transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
          <p className="text-gray-400 text-xs">
            &copy; {new Date().getFullYear()} Jean Lanot. {t.footer.rights}
          </p>
        </div>
      </footer>

    </div>
  );
}
