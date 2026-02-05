"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { Video } from "@/lib/videos";

interface VideoModalProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
}

export function VideoModal({ video, isOpen, onClose }: VideoModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleKeyDown]);

  if (!video) return null;

  // Déterminer le type de vidéo
  const isYoutube = !!video.youtubeId;
  const isVimeo = video.thumbnail?.includes("vimeocdn");
  const isInstagram = video.thumbnail?.includes("instagram");

  let embedContent: React.ReactNode = null;

  if (isYoutube) {
    embedContent = (
      <iframe
        src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
        title={video.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    );
  } else if (isVimeo) {
    // Extraire l'ID Vimeo de l'URL du thumbnail
    const vimeoMatch = video.thumbnail.match(/video\/(\d+)/);
    const vimeoId = vimeoMatch?.[1];
    
    if (vimeoId) {
      embedContent = (
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1`}
          title={video.title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      );
    } else {
      embedContent = (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-center">
            <p className="text-white mb-4">Vidéo Vimeo</p>
            <a
              href={video.videoUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Ouvrir sur Vimeo →
            </a>
          </div>
        </div>
      );
    }
  } else if (isInstagram) {
    embedContent = (
      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
        <div className="text-center">
          <p className="text-white mb-4">Contenu Instagram</p>
          <a
            href={video.videoUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Ouvrir sur Instagram →
          </a>
        </div>
      </div>
    );
  } else {
    embedContent = (
      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
        <p className="text-white">Vidéo indisponible</p>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && video && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
            >
              <span>Fermer</span>
              <kbd className="rounded border border-white/20 bg-white/5 px-1.5 py-0.5 text-xs">
                ESC
              </kbd>
            </button>

            {/* Video Container */}
            <div className="overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl">
              <div className="relative aspect-video w-full bg-black">
                {embedContent}
              </div>

              {/* Video Info */}
              <div className="border-t border-white/10 p-4 md:p-6">
                <h2 className="text-lg font-semibold text-white md:text-xl">
                  {video.title}
                </h2>
                {video.description && (
                  <p className="mt-2 text-sm text-gray-400">
                    {video.description}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/60 capitalize">
                    {video.category}
                  </span>
                  {video.client && (
                    <span className="text-xs text-white/40">
                      {video.client}
                    </span>
                  )}
                  <span className="text-xs text-white/40">
                    {video.year}
                  </span>
                  {video.duration && (
                    <span className="text-xs text-white/40">
                      {video.duration}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
