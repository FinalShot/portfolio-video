"use client";

import { motion } from "framer-motion";
import { categories, type VideoCategory } from "@/lib/videos";

interface FilterBarProps {
  activeCategory: VideoCategory;
  onCategoryChange: (category: VideoCategory) => void;
}

export function FilterBar({ activeCategory, onCategoryChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-3">
      {categories.map((category) => (
        <button
          type="button"
          key={category.value}
          onClick={() => onCategoryChange(category.value)}
          className="relative px-4 py-2 md:px-6 md:py-2.5 text-sm font-medium transition-colors"
        >
          {activeCategory === category.value && (
            <motion.div
              layoutId="activeCategory"
              className="absolute inset-0 rounded-full bg-foreground"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span
            className={`relative z-10 ${
              activeCategory === category.value
                ? "text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {category.label}
          </span>
        </button>
      ))}
    </div>
  );
}
