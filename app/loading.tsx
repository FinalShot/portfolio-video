// Skeleton SSR visible immédiatement — remplace le spinner opaque
// Google voit du contenu structuré dès le premier octet, améliore FCP/LCP
export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Header skeleton */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-[95%] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="h-8 w-40 bg-white/10 rounded animate-pulse" />
          <div className="hidden md:flex items-center gap-6">
            <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
            <div className="h-8 w-24 bg-white/10 rounded-full animate-pulse" />
          </div>
        </div>
      </header>

      {/* Filtres skeleton */}
      <main className="pt-32 pb-20 px-6 max-w-[95%] mx-auto">
        <section>
          <div className="flex flex-wrap gap-3 mb-12 justify-center md:justify-start">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 w-28 bg-white/10 rounded-full animate-pulse" />
            ))}
          </div>

          {/* Grille de cartes skeleton — structure identique à la grille réelle */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-full">
                <div
                  className="w-full rounded-xl bg-white/5 animate-pulse border border-white/5"
                  style={{ aspectRatio: '16 / 9' }}
                />
                <div className="mt-3 space-y-2">
                  <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
                  <div className="h-5 w-3/4 bg-white/15 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
