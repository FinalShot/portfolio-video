"use client";
import React from "react";
import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Video } from "@/lib/videos";
import { Play } from "lucide-react";

interface TiltCardProps {
  video: Video;
  onClick: () => void;
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

  const getHeightClass = () => {
    switch (video.aspectRatio) {
      case "portrait":
        return "h-[400px] md:h-[480px]";
      case "square":
        return "h-[280px] md:h-[320px]";
      default:
        return "h-[220px] md:h-[260px]";
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative cursor-pointer ${getHeightClass()} w-full pointer-events-auto`}
      style={{
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <motion.div
        className="relative h-full w-full rounded-xl overflow-hidden"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* 🎯 OPTIMIZED IMAGE - Remplace l'ancien div backgroundImage */}
        <div className="absolute inset-0">
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={false} // lazy load par défaut
            quality={80} // compression JPEG
            placeholder="blur" // blurred placeholder pendant le chargement
            blurDataURL={`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect fill='%231a1a1a'/%3E%3C/svg%3E`}
            onLoadingComplete={() => setImageLoaded(true)}
          />
        </div>

        {/* Dark overlay */}
        <motion.div
          className="absolute inset-0 bg-background/60"
          animate={{ opacity: isHovered ? 0.3 : 0.5 }}
          transition={{ duration: 0.3 }}
        />

        {/* Glare effect */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 60%)`,
            backgroundPosition: `${glareX} ${glareY}`,
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5">
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
            <div className="flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-foreground/90 backdrop-blur-sm">
              <Play className="h-6 w-6 md:h-7 md:w-7 fill-background text-background ml-1" />
            </div>
          </motion.div>

          {/* Video info */}
          <motion.div
            initial={{ y: 0, opacity: 1 }}
            animate={{
              y: isHovered ? -20 : 0,
              opacity: isHovered ? 0 : 1,
            }}
            transition={{ duration: 0.3 }}
            style={{ transform: "translateZ(30px)" }}
          >
            <span className="text-xs font-medium uppercase tracking-wider text-accent">
              {video.category}
            </span>
            <h3 className="mt-1 text-lg md:text-xl font-semibold text-foreground">
              {video.title}
            </h3>
            {video.client && (
              <p className="mt-0.5 text-sm text-muted-foreground">
                {video.client} · {video.year}
              </p>
            )}
          </motion.div>
        </div>

        {/* Border glow on hover */}
        <motion.div
          className="absolute inset-0 rounded-xl border border-accent/0"
          animate={{
            borderColor: isHovered
              ? "oklch(0.65 0.15 180 / 0.5)"
              : "oklch(0.65 0.15 180 / 0)",
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
}
