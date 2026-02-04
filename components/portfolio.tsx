"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { videos, type VideoCategory, type Video } from "@/lib/videos";
import { FilterBar } from "./filter-bar";
import { VideoGrid } from "./video-grid";
import { VideoModal } from "./video-modal";

export function Portfolio() {
  const [activeCategory, setActiveCategory] = useState<VideoCategory>("all");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredVideos = useMemo(() => {
    if (activeCategory === "all") return videos;
    return videos.filter((video) => video.category === activeCategory);
  }, [activeCategory]);

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedVideo(null), 300);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
          <nav className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-xl font-semibold tracking-tight text-foreground">
                Marcus Chen
              </span>
              <span className="ml-2 text-sm text-muted-foreground">
                Video Editor
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-6"
            >
              <a
                href="#work"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Work
              </a>
              <a
                href="#about"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Contact
              </a>
            </motion.div>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
            Crafting visual stories that captivate
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Award-winning video editor specializing in cinematic storytelling,
            YouTube content, and commercial advertising. Transforming raw footage
            into compelling narratives.
          </p>
        </motion.div>
      </section>

      {/* Portfolio Grid */}
      <section id="work" className="mx-auto max-w-7xl px-4 pb-24 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Filter Bar */}
          <div className="mb-10 md:mb-12">
            <FilterBar
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          {/* Video Grid */}
          <VideoGrid videos={filteredVideos} onVideoClick={handleVideoClick} />
        </motion.div>
      </section>

      {/* Video Modal */}
      <VideoModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
