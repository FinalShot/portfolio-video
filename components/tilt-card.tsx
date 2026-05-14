"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";
import type { Video } from "@/lib/videos";
import { Play } from "lucide-react";
import { useLang } from "@/lib/lang-context";

// ─── Constantes globales ───────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, { fr: string; en: string }> = {
  "PUBS & BRAND CONTENT": { fr: "PUBS & BRAND CONTENT", en: "ADS & BRAND CONTENT" },
  "EMISSIONS & DOCS":     { fr: "ÉMISSIONS & DOCS",     en: "SHOWS & DOCS" },
  "BANDES-ANNONCES":      { fr: "BANDES-ANNONCES",      en: "TRAILERS" },
  FICTIONS:               { fr: "FICTIONS",             en: "FICTION" },
};

const SPRING_CONFIG = { stiffness: 300, damping: 30 } as const;

// ─── Composant interne ───────────────────────────────────────────────────

interface TiltCardProps {
  video: Video;
  onClick?: () => void;
  priority?: boolean;
  index?: number;
}

function TiltCardInner({ video, onClick, priority = false }: TiltCardProps) {
  const cardRef            = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouch, setIsTouch]     = useState(false);
  const { lang }           = useLang();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none)").matches);
  }, []);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateXRaw = useTransform(y, [0, 1], [6, -6]);
  const rotateYRaw = useTransform(x, [0, 1], [-6, 6]);
  const rotateX    = useSpring(rotateXRaw, SPRING_CONFIG);
  const rotateY    = useSpring(rotateYRaw, SPRING_CONFIG);

  const glareX     = useTransform(x, [0, 1], ["-50%", "150%"]);
  const glareY     = useTransform(y, [0, 1], ["-50%", "150%"]);
  const background = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.15) 20%, transparent 50%)`;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch || shouldReduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top)  / rect.height);
  }, [isTouch, shouldReduceMotion, x, y]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    x.set(0.5);
    y.set(0.5);
  }, [x, y]);

  const handleMouseEnter = useCallback(() => {
    if (!isTouch && !shouldReduceMotion) setIsHovered(true);
  }, [isTouch, shouldReduceMotion]);

  const tiltX = (shouldReduceMotion || isTouch) ? 0 : rotateX;
  const tiltY = (shouldReduceMotion || isTouch) ? 0 : rotateY;
  const animDuration = shouldReduceMotion ? 0 : 0.3;

  const categoryLabel = CATEGORY_LABELS[video.category]?.[lang] ?? video.category;

  return (
    /*
      Outer wrapper : perspective + touch, PAS de willChange ni translateZ(0).
      Le GPU layer est délégué au CardWrapper parent (un seul layer par carte).
      Ça évite la double-promotion Safari qui causait le lag.
    */
    <motion.div
      ref={cardRef}
      className="relative cursor-pointer w-full pointer-events-auto"
      style={{
        perspective: 1000,
        aspectRatio: "16 / 9",
        touchAction: "manipulation",
        // contain isole les repaints du tilt sans créer de nouveau GPU layer
        contain: "layout style",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Voir la vidéo : ${video.title}`}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick?.(); }}
    >
      {/*
        Inner wrapper : SEUL endroit avec willChange + backfaceVisibility.
        C'est lui qui anime le tilt (rotateX/Y) — un seul layer GPU ici.
      */}
      <motion.div
        className="relative h-full w-full rounded-xl overflow-hidden border border-white/5"
        style={{
          rotateX: tiltX,
          rotateY: tiltY,
          willChange: "transform",
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
        }}
      >
        {/* IMAGE */}
        <div className="absolute inset-0">
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={85}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            placeholder="blur"
            blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect fill='%231a1a1a'/%3E%3C/svg%3E"
          />
        </div>

        {/* Gradient bas */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none"
          animate={{ opacity: isHovered ? 0 : 1 }}
          transition={{ duration: animDuration }}
        />

        {/* Glare */}
        {!isTouch && !shouldReduceMotion && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-xl overflow-hidden"
            style={{ background, mixBlendMode: "soft-light", willChange: "opacity" }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          />
        )}

        {/* Play button */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isHovered || isTouch ? 1 : 0, scale: isHovered || isTouch ? 1 : 0.8 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          aria-hidden="true"
        >
          <div className="flex items-center justify-center w-20 h-14 rounded-xl bg-red-600 shadow-xl">
            <Play className="h-6 w-6 fill-white text-white ml-0.5" />
          </div>
        </motion.div>

        {/* Titre + catégorie */}
        <div className="absolute inset-0 flex flex-col justify-end p-5">
          <motion.div
            animate={{ y: isHovered ? -10 : 0, opacity: isHovered ? 0 : 1 }}
            transition={{ duration: animDuration }}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
              {categoryLabel}
            </span>
            <h3 className="mt-1 text-lg md:text-xl font-bold text-white line-clamp-2">
              {video.title}
            </h3>
          </motion.div>
        </div>

        {/* Border glow */}
        <motion.div
          className="absolute inset-0 rounded-xl border border-white/20 pointer-events-none"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: animDuration }}
          aria-hidden="true"
        />
      </motion.div>
    </motion.div>
  );
}

export const TiltCard = React.memo(TiltCardInner);
