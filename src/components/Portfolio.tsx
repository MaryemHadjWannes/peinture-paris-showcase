import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Palette,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
} from "lucide-react";

const API_BASE = import.meta.env.DEV ? "http://localhost:5000" : "";

interface ImageFile {
  url: string;
  filename: string;
}

interface Project {
  title: string;
  description: string;
  images: string[];
  tags: string[];
}

interface AvantApresPair {
  title: string;
  before: string;
  after: string;
}

const Portfolio = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [avantApres, setAvantApres] = useState<AvantApresPair[]>([]);
  const [activeIndexes, setActiveIndexes] = useState<number[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isLoadingAvantApres, setIsLoadingAvantApres] = useState(true);

  // Lightbox : un tableau d’images + index courant
  const [lightboxState, setLightboxState] = useState<{
    images: string[];
    index: number;
  } | null>(null);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const avantApresRef = useRef<HTMLDivElement>(null);

  // Touch pour le lightbox
  const lightboxTouchStartX = useRef(0);
  const lightboxTouchEndX = useRef(0);

  // === FETCH PROJETS NORMAUX (une seule fois) ===
  const fetchProjects = useCallback(async () => {
    setIsLoadingProjects(true);
    const normalCats = ["enduit", "peinture-interieure", "escalier-details"];
    const fetchedMap: Record<string, ImageFile[]> = {};

    try {
      await Promise.all(
        normalCats.map(async (cat) => {
          try {
            const res = await fetch(`${API_BASE}/api/public/images/${cat}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const { files } = await res.json();
            fetchedMap[cat] = files.map((f: any) => ({
              url: f.url,
              filename: f.filename,
            }));
          } catch (err) {
            console.error(`Error fetching ${cat}:`, err);
            fetchedMap[cat] = [];
          }
        })
      );

      const newProjects: Project[] = [
        {
          title: "Enduit Professionnel",
          description:
            "Surfaces parfaitement préparées et ratissées pour des finitions impeccables.",
          images: fetchedMap.enduit?.map((f) => f.url) || [],
          tags: ["Finition lisse", "Ratissage", "Calicot"],
        },
        {
          title: "Peinture Intérieure",
          description:
            "Finitions soignées et durables avec peintures écologiques.",
          images: fetchedMap["peinture-interieure"]?.map((f) => f.url) || [],
          tags: ["Couleurs", "Décoration", "Confort"],
        },
        {
          title: "Escalier & Détails",
          description:
            "Escaliers élégants avec finitions précises et matériaux de qualité.",
          images: fetchedMap["escalier-details"]?.map((f) => f.url) || [],
          tags: ["Détails", "Bois", "Harmonie"],
        },
      ];

      setProjects(newProjects);
      setActiveIndexes(newProjects.map(() => 0));
    } catch (err) {
      console.error("fetchProjects failed:", err);
    } finally {
      setIsLoadingProjects(false);
    }
  }, []);

  // === FETCH AVANT/APRÈS (appelé seulement quand la section devient visible) ===
  const fetchAvantApres = useCallback(async () => {
    setIsLoadingAvantApres(true);

    try {
      const res = await fetch(`${API_BASE}/api/public/images/avant-apres`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { files } = await res.json();

      const getId = (name: string) =>
        name.replace(/^(avant|apres)-/, "").replace(/\.[^.]+$/, "");

      const avantMap = new Map<string, string>();
      const apresMap = new Map<string, string>();

      files.forEach((img: any) => {
        if (img.filename.startsWith("avant-"))
          avantMap.set(getId(img.filename), img.url);
        else if (img.filename.startsWith("apres-"))
          apresMap.set(getId(img.filename), img.url);
      });

      const pairs: AvantApresPair[] = [];
      apresMap.forEach((after, id) => {
        const before = avantMap.get(id);
        if (before) {
          pairs.push({
            title: `Transformation ${pairs.length + 1}`,
            before,
            after,
          });
        }
      });

      setAvantApres(pairs);
    } catch (err) {
      console.error("Failed to fetch avant-apres:", err);
    } finally {
      setIsLoadingAvantApres(false);
    }
  }, []);

  // === INITIAL LOAD UNIQUEMENT POUR LES PROJETS ===
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // === LAZY LOAD AVANT/APRÈS WHEN VISIBLE ===
  useEffect(() => {
    const currentRef = avantApresRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && avantApres.length === 0) {
          fetchAvantApres();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(currentRef);
    return () => observer.disconnect();
  }, [fetchAvantApres, avantApres.length]);

  // === CAROUSEL SWITCH ===
  const handleSwitch = (projIdx: number, dir: "next" | "prev") => {
    setActiveIndexes((prev) => {
      const copy = [...prev];
      const total = projects[projIdx]?.images.length || 0;
      if (total === 0) return prev;
      copy[projIdx] =
        dir === "next"
          ? (copy[projIdx] + 1) % total
          : (copy[projIdx] - 1 + total) % total;
      return copy;
    });
  };

  // === SWIPE SUPPORT on cards ===
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (projIdx: number) => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      handleSwitch(projIdx, diff > 0 ? "next" : "prev");
    }
  };

  // ⭐ LIGHTBOX
  const openLightbox = (images: string[], index: number) => {
    if (!images || images.length === 0) return;
    setLightboxState({
      images,
      index: Math.max(0, Math.min(index, images.length - 1)),
    });
  };

  const closeLightbox = () => setLightboxState(null);

  const handleLightboxSwitch = (dir: "next" | "prev") => {
    setLightboxState((prev) => {
      if (!prev || prev.images.length === 0) return prev;
      const total = prev.images.length;
      const newIndex =
        dir === "next"
          ? (prev.index + 1) % total
          : (prev.index - 1 + total) % total;
      return { ...prev, index: newIndex };
    });
  };

  // Swipe dans le lightbox (mobile)
  const handleLightboxTouchStart = (e: React.TouchEvent) => {
    lightboxTouchStartX.current = e.touches[0].clientX;
  };

  const handleLightboxTouchMove = (e: React.TouchEvent) => {
    lightboxTouchEndX.current = e.touches[0].clientX;
  };

  const handleLightboxTouchEnd = () => {
    const diff = lightboxTouchStartX.current - lightboxTouchEndX.current;
    if (Math.abs(diff) > 40) {
      handleLightboxSwitch(diff > 0 ? "next" : "prev");
    }
  };

  // === CLOSE LIGHTBOX ON ESC ===
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <section id="portfolio" className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          {/* HEADER */}
          <div className="text-center mb-10 md:mb-12">
            <div className="inline-flex items-center space-x-2 bg-accent/20 rounded-full px-4 py-2 mb-4">
              <Palette className="h-5 w-5 text-accent" />
              <span className="text-accent font-medium text-sm md:text-base">
                Nos Réalisations
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 font-heading">
              Réalisations de peinture et rénovation
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Découvrez nos réalisations : enduits, peintures, escaliers et
              transformations avant / après.
            </p>
          </div>

          {/* PROJETS NORMAUX */}
          {isLoadingProjects ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-accent" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {projects.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-card rounded-xl overflow-hidden shadow-md border border-border/50"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={() => handleTouchEnd(idx)}
                >
                  <div className="relative group aspect-square md:aspect-auto md:h-80 overflow-hidden">
                    <img
                      src={item.images[activeIndexes[idx]] || "/placeholder.svg"}
                      alt={item.title}
                      title={item.title}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 cursor-zoom-in"
                      onClick={() =>
                        openLightbox(item.images, activeIndexes[idx])
                      }
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                      width={1200}
                      height={1200}
                    />

                    {/* Carousel controls */}
                    {item.images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSwitch(idx, "prev");
                          }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 md:flex hidden"
                          aria-label="Précédent"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSwitch(idx, "next");
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 md:flex hidden"
                          aria-label="Suivant"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>

                        {/* Dots */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {item.images.map((_, i) => (
                            <div
                              key={i}
                              className={`h-2 rounded-full transition-all duration-300 ${
                                i === activeIndexes[idx]
                                  ? "bg-white w-8"
                                  : "bg-white/60 w-2"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="text-xl font-semibold text-primary mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* AVANT / APRÈS */}
          <div ref={avantApresRef} className="mt-16 md:mt-24">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-10 text-accent">
              Avant / Après
            </h3>

            {isLoadingAvantApres ? (
              <div className="flex flex-col items-center py-16">
                <Loader2 className="h-10 w-10 animate-spin text-accent mb-3" />
                <p className="text-muted-foreground">
                  Chargement des transformations...
                </p>
              </div>
            ) : avantApres.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground mb-6">
                  Aucune transformation disponible pour le moment.
                </p>
                <Button variant="outline" onClick={fetchAvantApres}>
                  Réessayer
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                {avantApres.map((pair, i) => (
                  <div
                    key={i}
                    className="bg-card rounded-2xl shadow-lg overflow-hidden"
                  >
                    {/* BEFORE */}
                    <div
                      className="relative aspect-video overflow-hidden cursor-zoom-in group"
                      onClick={() =>
                        openLightbox([pair.before, pair.after], 0)
                      }
                    >
                      <img
                        src={pair.before}
                        alt={`Avant - ${pair.title}`}
                        title={`Avant - ${pair.title}`}
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                        width={1280}
                        height={720}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                      <span className="absolute bottom-4 left-4 bg-white/95 text-green-700 font-bold px-5 py-2 rounded-full text-lg shadow-lg">
                        Avant
                      </span>
                    </div>

                    {/* AFTER */}
                    <div
                      className="relative aspect-video overflow-hidden cursor-zoom-in group"
                      onClick={() =>
                        openLightbox([pair.before, pair.after], 1)
                      }
                    >
                      <img
                        src={pair.after}
                        alt={`Après - ${pair.title}`}
                        title={`Après - ${pair.title}`}
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                        width={1280}
                        height={720}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                      <span className="absolute bottom-4 left-4 bg-white/95 text-blue-700 font-bold px-5 py-2 rounded-full text-lg shadow-lg">
                        Après
                      </span>
                    </div>

                    <div className="p-6 text-center">
                      <h4 className="text-lg font-semibold text-primary">
                        {pair.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ⭐ LIGHTBOX MODAL AVEC NAVIGATION */}
      {lightboxState && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md"
          onClick={closeLightbox}
          onTouchStart={handleLightboxTouchStart}
          onTouchMove={handleLightboxTouchMove}
          onTouchEnd={handleLightboxTouchEnd}
        >
          <button
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white hover:text-gray-300 transition-all duration-200 z-20"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            aria-label="Fermer"
          >
            <X className="h-10 w-10 md:h-12 md:w-12" />
          </button>

          {/* Flèches navigation dans le lightbox */}
          {lightboxState.images.length > 1 && (
            <>
              <button
                className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-3 md:p-4 text-white z-20"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLightboxSwitch("prev");
                }}
                aria-label="Précédent"
              >
                <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
              </button>
              <button
                className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-3 md:p-4 text-white z-20"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLightboxSwitch("next");
                }}
                aria-label="Suivant"
              >
                <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
              </button>
            </>
          )}

          <div
            className="relative max-w-7xl max-h-full p-4 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxState.images[lightboxState.index]}
              alt="Vue agrandie"
              decoding="async"
              className="max-w-full max-h-screen object-contain rounded-xl shadow-2xl"
            />
            {lightboxState.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-xs md:text-sm bg-black/50 px-3 py-1 rounded-full">
                {lightboxState.index + 1} / {lightboxState.images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Portfolio;
