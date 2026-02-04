"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TiltCard } from "./tilt-card";
import type { Video } from "@/lib/videos";

interface VideoGridProps {
  videos: Video[];
  onVideoClick: (video: Video) => void;
}

export function VideoGrid({ videos, onVideoClick }: VideoGridProps) {
  // Split videos into columns for masonry layout
  const getColumns = (videos: Video[]) => {
    const columns: Video[][] = [[], [], []];
    videos.forEach((video, index) => {
      columns[index % 3].push(video);
    });
    return columns;
  };

  const columns = getColumns(videos);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="flex flex-col gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {column.map((video) => (
              <motion.div
                key={video.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  layout: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
              >
                <TiltCard video={video} onClick={() => onVideoClick(video)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
