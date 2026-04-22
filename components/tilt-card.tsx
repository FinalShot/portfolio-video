"use client";
import React from "react";
import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import type { Video } from "@/lib/videos";
import { Play } from "lucide-react";
import { useLang } from "@/lib/lang-context";

interface TiltCardProps {
  video: Video;
  onClick?: () => void;
}

export function TiltCard({ video, onClick }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const { lang } = useLang();

  const rotateX = useSpring(useTransform(y, [0, 1], [6, -6]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [0, 1], [-6, 6]), {
    stiffness: 300,
    damping: 30,
  });
  const glareX = useTransform(x, [0, 1], ["-50%", "150%"]);
  const glareY = useTransform(y, [0, 1], ["-50%", "150%"]);

  const background = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.15) 20%, transparent 50%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative cursor-pointer w-full pointer-events-auto"
      style={{
        perspective: 1000,
        aspectRatio: "16 / 9",
        willChange: "transform",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <motion.div
        className="relative h-full w-full rounded-xl overflow-hidden border border-white/5"
        style={{
          rotateX,
          rotateY,
          willChange: "transform",
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
            placeholder="blur"
            blurDataURL={`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect fill='%231a1a1a'/%3E%3C/svg%3E`}
          />
        </div>

        {/* Gradient bas (titre) */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none"
          animate={{ opacity: isHovered ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Glare */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-xl overflow-hidden"
          style={{ background, mixBlendMode: "soft-light" }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />

        {/* Play button */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.8,
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-center w-20 h-14 rounded-xl bg-red-600 shadow-xl">
            <Play className="h-6 w-6 fill-white text-white ml-0.5" />
          </div>
        </motion.div>

        {/* Video info */}
        <div className="absolute inset-0 flex flex-col justify-end p-5">
          <motion.div
            animate={{
              y: isHovered ? -10 : 0,
              opacity: isHovered ? 0 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
              {(() => {
                const map: Record<string, { fr: string; en: string }> = {
                  "PUBS & BRAND CONTENT": { fr: "PUBS & BRAND CONTENT", en: "ADS & BRAND CONTENT" },
                  "EMISSIONS & DOCS":     { fr: "ÉMISSIONS & DOCS",     en: "SHOWS & DOCS" },
                  "BANDES-ANNONCES":      { fr: "BANDES-ANNONCES",      en: "TRAILERS" },
                  "FICTIONS":             { fr: "FICTIONS",             en: "FICTION" },
                };
                return map[video.category]?.[lang] ?? video.category;
              })()}
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
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
}
