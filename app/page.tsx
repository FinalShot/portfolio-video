"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Mail, Phone, Play, ArrowRight, Menu, X } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { TiltCard } from "@/components/tilt-card";
import type { Video } from "@/lib/videos";

// --- CONFIGURATION ---
// Vidéos externes (Vimeo, Instagram, etc.)
const EXTERNAL_VIDEOS = [
  {
    title: "TF1 - Kev Adams Le Before",
    thumbnailUrl: "https://i.vimeocdn.com/video/1748333621-6556ab122d6d8571b0f94d1c4e33b94928a32adcf1a4ab6f80959c79b258aba2-d_640",
    videoUrl: "https://vimeo.com/881022565",
    category: "FICTIONS",
    date: "2023-11-03"
  },
  {
    title: "Olympic Museum",
    thumbnailUrl: "/thumbnails/olympic-museum.jpeg",
    videoUrl: "https://www.instagram.com/p/C-dJ5BoszI9/",
    category: "PUBS & BRAND CONTENT",
    date: "2024-08-09"
  }
];

// --- PAGE PRINCIPALE ---
export default function Portfolio() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filter, setFilter] = useState("TOUT");
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  // Récupération des vidéos via API route sécurisée
  useEffect(() => {
    async function fetchVideos() {
      try {
        setLoading(true);
        
        // 1. Charger les vidéos YouTube via l'API route
        const youtubeRes = await fetch("/api/youtube");
        const youtubeData = await youtubeRes.json();
        const youtubeVideos: Video[] = youtubeData.videos || [];

        // 2. Formater les vidéos externes
        const formattedExternalVideos: Video[] = EXTERNAL_VIDEOS.map(vid => ({
          id: vid.videoUrl,
          title: vid.title,
          thumbnail: vid.thumbnailUrl,
          link: vid.videoUrl,
          realPublishDate: new Date(vid.date).toISOString(),
          autoCategory: vid.category,
          source: "external"
        }));

        // 3. Fusionner et trier par date
        const allVideos = [...youtubeVideos, ...formattedExternalVideos];
        allVideos.sort((a, b) => new Date(b.realPublishDate).getTime() - new Date(a.realPublishDate).getTime());

        setVideos(allVideos);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, []);


  const categories = ["TOUT", "PUBS & BRAND CONTENT", "EMISSIONS & DOCS", "BANDES-ANNONCES", "FICTIONS"];
  
  const filteredVideos = filter === "TOUT" 
    ? videos 
    : videos.filter(v => v.autoCategory === filter);

  // Fonction de scroll fluide
  const scrollTo = (id: string) => {
const element = document.getElementById(id);
    if (element) {
      const headerHeight = 80; // h-20 = 80px
      const offsetPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
        }
    };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-white/20">
      
      {/* HEADER FIXE */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-[95%] mx-auto px-6 h-20 flex items-center justify-between">
          <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0 }}
            className="font-bold text-4xl tracking-[-0.005em]"
          >
            JEAN LANOT
          </motion.h1>
          </div>
          <nav
            className="hidden md:flex gap-8 text-base font-medium">
            <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-gray-300 transition-colors">PORTFOLIO</motion.button>
            <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            onClick={() => scrollTo('about')} className="hover:text-gray-300 transition-colors">À PROPOS</motion.button>
            <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            onClick={() => scrollTo('contact')} className="hover:text-gray-300 transition-colors">CONTACT</motion.button>
          </nav>
          
          {/* Burger Menu Button - Mobile Only */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Menu Content */}
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute top-0 right-0 h-full w-64 bg-[#0a0a0a] border-l border-white/10 pt-24 px-6"
            >
              <div className="flex flex-col gap-6">
                <button
                  onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileMenuOpen(false); }} 
                  className="text-left text-lg font-medium hover:text-gray-300 transition-colors py-2 border-b border-white/5"
                >
                  PORTFOLIO
                </button>
                <button 
                  onClick={() => { scrollTo('about'); setMobileMenuOpen(false); }} 
                  className="text-left text-lg font-medium hover:text-gray-300 transition-colors py-2 border-b border-white/5"
                >
                  À PROPOS
                </button>
                <button 
                  onClick={() => { scrollTo('contact'); setMobileMenuOpen(false); }} 
                  className="text-left text-lg font-medium hover:text-gray-300 transition-colors py-2 border-b border-white/5"
                >
                  CONTACT
                </button>
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
            {categories.map((cat, index) => (
              <motion.button
                key={cat}
                onClick={() => setFilter(cat)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.2 + index * 0.08,
                  ease: "easeOut"
                }}
                className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider border ${
                  filter === cat
                    ? "bg-white/90 text-black border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                    : "bg-white/5 backdrop-blur-md text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/30 hover:text-white shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>


          {/* Grille Vidéo */}
            <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12">
              <AnimatePresence>
                {filteredVideos.map((video) => (
                  <motion.div
                    layout
                    key={video.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TiltCard video={video} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          
          {filteredVideos.length === 0 && !loading && (
            <div className="text-center py-20 text-gray-500">Aucune vidéo trouvée dans cette catégorie. Vérifiez vos descriptions YouTube !</div>
          )}
        </section>

        {/* SECTION À PROPOS */}
        <motion.section
        id="about"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mb-12 scroll-mt-32">
          <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <div className="flex flex-col md:flex-row items-center gap-10">
              {/* PHOTO - À REMPLACER */}
              <div className="shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl relative">
                  {/* METS TA PHOTO DANS LE DOSSIER /public ET CHANGE LE SRC ICI */}
                  <img 
                    src="/ma-photo.webp" 
                    alt="Jean Lanot" 
                    className="w-full h-full object-cover"
                    onError={(e) => {e.currentTarget.src = "https://placehold.co/400x400/222/FFF?text=JL"}} // Fallback si pas de photo
                  />
                </div>
              </div>
              
              {/* TEXTE */}
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold mb-4">À PROPOS</h2>
                <p className="text-gray-300 leading-relaxed text-justify text-xl tracking-normal">
                  Monteur vidéo basé à Paris avec plus de 9 ans d'expérience. 
                  Travaillant avec des agences, des productions indépendantes ou des institutions, 
                  aussi bien pour la télévision que pour le web, je suis ouvert à tout type de projet.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* SECTION CONTACT */}
        <motion.section
        id="contact"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="scroll-mt-32">
          <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 text-center shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <h2 className="text-2xl font-bold mb-8">CONTACT</h2>
            {/* Formulaire de contact */}
            <ContactForm />
          </div>
        </motion.section>

      </main>

      {/* FOOTER SIMPLE */}
      <footer className="py-8 text-center text-gray-600 text-xs border-t border-white/5">
        &copy; {new Date().getFullYear()} Jean Lanot. Tous droits réservés.
      </footer>
    </div>
  );
}
