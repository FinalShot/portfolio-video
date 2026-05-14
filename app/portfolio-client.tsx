"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from "framer-motion";
import { Mail, Menu, X, Linkedin, Instagram } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { TiltCard } from "@/components/tilt-card";
import { LanguageToggle } from "@/components/language-toggle";
import { useLang } from "@/lib/lang-context";
import { translations } from "@/lib/translations";
import type { Video } from "@/lib/videos";
import Image from "next/image";

// ─── Constantes globales ──────────────────────────────────────────────────────

const CATEGORY_KEYS: Record<string, keyof typeof translations["fr"]["categories"]> = {
  TOUT:                   "all",
  "PUBS & BRAND CONTENT": "ads",
  "EMISSIONS & DOCS":     "docs",
  "BANDES-ANNONCES":      "trailers",
  FICTIONS:               "fiction",
};

const FR_CATEGORIES = [
  "TOUT",
  "PUBS & BRAND CONTENT",
  "EMISSIONS & DOCS",
  "BANDES-ANNONCES",
  "FICTIONS",
] as const;

const FADE_DURATION = 0.22;

const LAYOUT_SPRING = { type: "spring" as const, stiffness: 400, damping: 35 };

const ANIM_INITIAL       = { opacity: 0, y: 20 }     as const;
const ANIM_ANIMATE       = { opacity: 1, y: 0 }      as const;
const ANIM_INITIAL_SCALE = { opacity: 0, scale: 0.92 } as const;
const ANIM_ANIMATE_SCALE = { opacity: 1, scale: 1 }    as const;
const ANIM_EXIT_SCALE    = { opacity: 0, scale: 0.92 } as const;

const GPU_STYLE: React.CSSProperties = {
  WebkitTransform: "translateZ(0)",
  transform: "translateZ(0)",
  WebkitBackfaceVisibility: "hidden",
  backfaceVisibility: "hidden",
};

const PRELOAD_STYLE: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: 1,
  height: 1,
  opacity: 0,
  pointerEvents: "none",
  overflow: "hidden",
  zIndex: -1,
  visibility: "hidden",
  WebkitTransform: "translateZ(0)",
  transform: "translateZ(0)",
};

// Transition stable utilisée après le stagger initial.
// Référence d'objet FIXE → React.memo peut refuser le re-rendu.
const CARD_TRANSITION_STABLE = {
  opacity: { duration: FADE_DURATION, ease: "easeOut" as const },
  scale:   { duration: FADE_DURATION, ease: "easeOut" as const },
  layout:  LAYOUT_SPRING,
} as const;

// Génère la transition de stagger au 1er chargement (index variable, ok car hasAnimated=false)
function makeStaggerTransition(index: number) {
  return {
    opacity: { duration: 0.4, ease: "easeOut" as const, delay: index * 0.04 },
    scale:   { duration: 0.4, ease: "easeOut" as const, delay: index * 0.04 },
    layout:  LAYOUT_SPRING,
  };
}

function smoothScrollTo(top: number): void {
  try   { window.scrollTo({ top, behavior: "smooth" }); }
  catch { window.scrollTo(0, top); }
}

// ─── Carte mémoïsée avec transition injectée en prop ────────────────────────────────
// On isole le motion.div wrapper dans son propre composant mémoïsé pour que
// la référence de `transition` stable empêche tout re-rendu inutile.

interface CardWrapperProps {
  video: Video;
  index: number;
  hasAnimated: boolean;
  onClick: (video: Video) => void;
}

const CardWrapper = React.memo(function CardWrapper({
  video, index, hasAnimated, onClick,
}: CardWrapperProps) {
  const transition = hasAnimated ? CARD_TRANSITION_STABLE : makeStaggerTransition(index);
  const handleClick = useCallback(() => onClick(video), [onClick, video]);

  return (
    <motion.div
      layout="position"
      initial={ANIM_INITIAL_SCALE}
      animate={ANIM_ANIMATE_SCALE}
      exit={ANIM_EXIT_SCALE}
      transition={transition}
      style={GPU_STYLE}
    >
      <TiltCard
        video={video}
        priority={index < 3}
        index={index}
        onClick={handleClick}
      />
    </motion.div>
  );
});

// ─── Composant principal ───────────────────────────────────────────────────────────

interface PortfolioClientProps {
  initialVideos: Video[];
}

export function PortfolioClient({ initialVideos }: PortfolioClientProps) {
  const { lang }           = useLang();
  const t                  = translations[lang];
  const shouldReduceMotion = useReducedMotion();

  const [filter, setFilter]                = useState("TOUT");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasAnimated, setHasAnimated]       = useState(false);
  const [preloaded, setPreloaded]           = useState(false);

  useEffect(() => {
    smoothScrollTo(0);
    const lastIndex = Math.min(initialVideos.length - 1, 29);
    const totalMs   = shouldReduceMotion ? 0 : (0.4 + lastIndex * 0.04) * 1000;
    const timer     = setTimeout(() => setHasAnimated(true), totalMs);
    return () => clearTimeout(timer);
  }, [initialVideos.length, shouldReduceMotion]);

  useEffect(() => {
    if (hasAnimated) setPreloaded(true);
  }, [hasAnimated]);

  // ── Données dérivées ──────────────────────────────────────────────────────

  const filteredVideos = useMemo(
    () => filter === "TOUT" ? initialVideos : initialVideos.filter((v) => v.category === filter),
    [filter, initialVideos]
  );

  const hiddenVideos = useMemo(
    () => filter === "TOUT" ? [] : initialVideos.filter((v) => v.category !== filter),
    [filter, initialVideos]
  );

  const bioLines = useMemo(() => t.about.bio.split("\n"), [t.about.bio]);

  // ── Callbacks stables ──────────────────────────────────────────────────────

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) smoothScrollTo(el.offsetTop - 80);
  }, []);

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  // handleCardClick stable : ne dépend pas de `filter` ni d'aucun state changeant
  const handleCardClick = useCallback((video: Video) => {
    const url = video.youtubeId
      ? `https://www.youtube.com/watch?v=${video.youtubeId}`
      : video.videoUrl || "";
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  // ── Animations header ──────────────────────────────────────────────────────

  const headerInitial = (hasAnimated || shouldReduceMotion) ? false : ANIM_INITIAL;

  // ── Navigation ────────────────────────────────────────────────────────────

  const navItems = [
    { href: "#portfolio", label: t.nav.portfolio, onClick: () => smoothScrollTo(0),         delay: 0.08 },
    { href: "#about",     label: t.nav.about,     onClick: () => scrollToSection("about"),   delay: 0.12 },
    { href: "#contact",   label: t.nav.contact,   onClick: () => scrollToSection("contact"), delay: 0.16, cta: true },
  ];

  const mobileNavItems = [
    { href: "#portfolio", label: t.nav.portfolio, fn: () => { smoothScrollTo(0);            closeMobileMenu(); } },
    { href: "#about",     label: t.nav.about,     fn: () => { scrollToSection("about");      closeMobileMenu(); } },
    { href: "#contact",   label: t.nav.contact,   fn: () => { scrollToSection("contact");    closeMobileMenu(); } },
  ];

  // ── Rendu ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-white/20">

      {/* LAYER DE PRÉCHARGEMENT */}
      {preloaded && hiddenVideos.length > 0 && (
        <div style={PRELOAD_STYLE} aria-hidden="true">
          {hiddenVideos.map((video) => (
            <Image
              key={`preload-${video.id}`}
              src={video.thumbnail}
              alt=""
              width={2}
              height={1}
              sizes="1px"
              style={{ width: 1, height: 1, display: "block" }}
              loading="lazy"
            />
          ))}
        </div>
      )}

      {/* HEADER */}
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5"
        role="banner"
      >
        <div className="max-w-[95%] mx-auto px-6 h-20 flex items-center justify-between">
          <motion.h1
            initial={headerInitial}
            animate={ANIM_ANIMATE}
            transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: "easeOut" }}
            style={GPU_STYLE}
            className="font-bold text-4xl tracking-[-0.005em] select-none cursor-pointer"
            onClick={() => smoothScrollTo(0)}
          >
            JEAN LANOT
          </motion.h1>

          <nav className="hidden md:flex items-center gap-8 text-base font-medium" aria-label="Navigation principale">
            {navItems.map(({ href, label, onClick, delay, cta }) => (
              <motion.a
                key={href}
                href={href}
                initial={headerInitial}
                animate={ANIM_ANIMATE}
                transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay: shouldReduceMotion ? 0 : delay, ease: "easeOut" }}
                style={GPU_STYLE}
                onClick={(e) => { e.preventDefault(); onClick(); }}
                className={cta
                  ? "bg-white text-black px-4 py-1.5 rounded-full hover:bg-gray-200 transition-colors text-sm font-bold"
                  : "hover:text-gray-300 transition-colors"
                }
              >
                {label}
              </motion.a>
            ))}
            <motion.div
              initial={headerInitial}
              animate={ANIM_ANIMATE}
              transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay: shouldReduceMotion ? 0 : 0.2, ease: "easeOut" }}
              style={GPU_STYLE}
            >
              <LanguageToggle />
            </motion.div>
          </nav>

          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* MENU MOBILE */}
      <motion.div
        initial={false}
        animate={mobileMenuOpen
          ? { opacity: 1, pointerEvents: "auto"  as const }
          : { opacity: 0, pointerEvents: "none" as const }
        }
        transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
        className="fixed inset-0 z-40 md:hidden"
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
        aria-hidden={!mobileMenuOpen}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeMobileMenu} />
        <motion.nav
          initial={false}
          animate={{ x: mobileMenuOpen ? 0 : "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: shouldReduceMotion ? 500 : 300 }}
          style={GPU_STYLE}
          className="absolute top-0 right-0 h-full w-64 bg-[#0a0a0a] border-l border-white/10 pt-24 px-6"
        >
          <div className="flex flex-col gap-6">
            {mobileNavItems.map(({ href, label, fn }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => { e.preventDefault(); fn(); }}
                className="text-left text-lg font-medium hover:text-gray-300 transition-colors py-2 border-b border-white/5"
              >
                {label}
              </a>
            ))}
            <div className="py-2 border-b border-white/5"><LanguageToggle /></div>
          </div>
        </motion.nav>
      </motion.div>

      <main className="pt-32 pb-20 px-6 max-w-[95%] mx-auto" id="portfolio">

        {/* ── PORTFOLIO ── */}
        <section aria-label="Portfolio vidéo" className="mb-32">

          {/* Filtres */}
          <div
            className="flex flex-wrap gap-3 mb-12 justify-center md:justify-start"
            role="group"
            aria-label="Filtres par catégorie"
          >
            {FR_CATEGORIES.map((cat, index) => (
              <motion.button
                key={`filter-${cat}`}
                onClick={() => setFilter(cat)}
                initial={headerInitial}
                animate={ANIM_ANIMATE}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.5,
                  delay:    shouldReduceMotion ? 0 : 0.2 + index * 0.07,
                  ease:     "easeOut",
                }}
                style={GPU_STYLE}
                aria-pressed={filter === cat}
                className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider border ${
                  filter === cat
                    ? "bg-white/90 text-black border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                    : "bg-white/5 backdrop-blur-md text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/30 hover:text-white shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                }`}
              >
                {t.categories[CATEGORY_KEYS[cat]]}
              </motion.button>
            ))}
          </div>

          {/*
            Grille :
            - AnimatePresence + layout="position" → FLIP spring préservé
            - CardWrapper est React.memoï¿½sé et reçoit CARD_TRANSITION_STABLE
              (référence fixe) après le stagger → zéro re-rendu des cartes
              qui restent visibles au changement de filtre
          */}
          <LayoutGroup id="portfolio-grid">
            <motion.div
              layout="position"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12"
              transition={LAYOUT_SPRING}
            >
              <AnimatePresence initial={!hasAnimated}>
                {filteredVideos.map((video, index) => (
                  <CardWrapper
                    key={video.id}
                    video={video}
                    index={index}
                    hasAnimated={hasAnimated}
                    onClick={handleCardClick}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>

          {filteredVideos.length === 0 && (
            <div className="text-center py-20 text-gray-400" role="status">
              {t.noVideos}
            </div>
          )}
        </section>

        {/* ── À PROPOS ── */}
        <motion.section
          id="about"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: "easeOut" }}
          style={GPU_STYLE}
          className="mb-12 scroll-mt-32"
          aria-label="À propos"
        >
          <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="shrink-0">
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl">
                  <Image
                    src="/ma-photo.webp"
                    alt="Jean Lanot, monteur vidéo Paris"
                    fill
                    sizes="(max-width: 768px) 128px, 160px"
                    className="object-cover object-center"
                    priority
                  />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold mb-4">{t.about.title}</h2>
                <p className="text-gray-300 leading-relaxed text-justify text-xl tracking-normal">
                  {bioLines.map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < bioLines.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── CONTACT ── */}
        <motion.section
          id="contact"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: "easeOut" }}
          style={GPU_STYLE}
          className="scroll-mt-32"
          aria-label="Contact"
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
      <footer className="py-8 border-t border-white/5" role="contentinfo">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            <a href="https://www.linkedin.com/in/jean-lanot" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn de Jean Lanot" className="text-gray-400 hover:text-white transition-colors">
              <Linkedin className="w-5 h-5" aria-hidden="true" />
            </a>
            <a href="https://www.instagram.com/jean_lanot/" target="_blank" rel="noopener noreferrer" aria-label="Instagram de Jean Lanot" className="text-gray-400 hover:text-white transition-colors">
              <Instagram className="w-5 h-5" aria-hidden="true" />
            </a>
            <a href="mailto:contact@jeanlanot.com" aria-label="Envoyer un email à Jean Lanot" className="text-gray-400 hover:text-white transition-colors">
              <Mail className="w-5 h-5" aria-hidden="true" />
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
