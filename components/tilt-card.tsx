"use client";
import React from "react";
import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Video } from "@/lib/videos";
import { Play } from "lucide-react";

interface TiltCardProps {
  video: Video;
  onClick?: () => void; // Rendu optionnel pour éviter les erreurs de build
}

export function TiltCard({ video, onClick }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  
  const rotateX = useSpring(useTransform(y, [0, 1], [15, -15]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [0, 1], [-15, 15]), {
    stiffness: 300,
    damping: 30,
  });
  const glareX = useTransform(x, [0, 1], ["-50%", "150%"]);
  const glareY = useTransform(y, [0, 1], ["-50%", "150%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPos = (e.clientX - rect.left) / rect.width;
    const yPos = (e.clientY - rect.top) / rect.height;
    x.set(xPos);
    y.set(yPos);
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
          transformStyle: "preserve-3d",
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
            onLoadingComplete={() => setImageLoaded(true)}
          />
        </div>

        {/* Overlay de base - éclaircissement doux */}
        <motion.div
          className="absolute inset-0 bg-black/50"
          animate={{ opacity: isHovered ? 0.3 : 0.5 }}
          transition={{ duration: 0.4 }}
        />

        {/* Gradient dégradé du bas (titre) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

        {/* Glare effect qui suit la souris - doux */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-xl overflow-hidden"
          animate={{
            opacity: isHovered ? 0.8 : 0, // ← Réduit à 0.8 max
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }} // ← Plus lent
        >
          <motion.div
            className="absolute w-[500px] h-[500px]"
            style={{
              background: `radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 50%, transparent 75%)`,
              left: glareX,
              top: glareY,
              x: '-50%',
              y: '-50%',
              mixBlendMode: 'soft-light',
              pointerEvents: 'none',
            }}
          />
        </motion.div>


        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-5">
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
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-xl">
              <Play className="h-7 w-7 fill-black text-black ml-1" />
            </div>
          </motion.div>

          {/* Video info */}
          <motion.div
            initial={{ y: 0, opacity: 1 }}
            animate={{
              y: isHovered ? -10 : 0,
              opacity: isHovered ? 0 : 1,
            }}
            transition={{ duration: 0.3 }}
            style={{ transform: "translateZ(30px)" }}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
              {video.category}
            </span>
            <h3 className="mt-1 text-lg md:text-xl font-bold text-white line-clamp-2">
              {video.title}
            </h3>
            {(video.client || video.year) && (
              <p className="mt-1 text-xs font-medium text-white/40 uppercase tracking-wider">
                {[video.client, video.year].filter(Boolean).join(" · ")}
              </p>
            )}
          </motion.div>
        </div>

        {/* Border glow on hover */}
        <motion.div
          className="absolute inset-0 rounded-xl border border-white/20 pointer-events-none"
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
}
