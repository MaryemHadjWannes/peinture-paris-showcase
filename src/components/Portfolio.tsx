import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, ChevronLeft, ChevronRight, Loader2, RefreshCw } from "lucide-react";

const API_BASE = import.meta.env.DEV ? 'http://localhost:5000' : '';

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
  const [hasInteracted, setHasInteracted] = useState(false);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const avantApresRef = useRef<HTMLDivElement>(null);

  // === FETCH PROJETS NORMAUX ===
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
            fetchedMap[cat] = files.map((f: any) => ({ url: f.url, filename: f.filename }));
          } catch (err) {
            console.error(`Error fetching ${cat}:`, err);
            fetchedMap[cat] = [];
          }
        })
      );

      const newProjects: Project[] = [
        {
          title: "Enduit Professionnel",
          description: "Surfaces parfaitement préparées et ratissées pour des finitions impeccables.",
          images: fetchedMap.enduit?.map(f => f.url) || [],
          tags: ["Finition lisse", "Ratissage", "Calicot"],
        },
        {
          title: "Peinture Intérieure",
          description: "Finitions soignées et durables avec peintures écologiques.",
          images: fetchedMap["peinture-interieure"]?.map(f => f.url) || [],
          tags: ["Couleurs", "Décoration", "Confort"],
        },
        {
          title: "Escalier & Détails",
          description: "Escaliers élégants avec finitions précises et matériaux de qualité.",
          images: fetchedMap["escalier-details"]?.map(f => f.url) || [],
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

  // === FETCH AVANT/APRÈS ===
  const fetchAvantApres = useCallback(async () => {
    if (avantApres.length > 0 && !hasInteracted) return; // Évite double fetch

    setIsLoadingAvantApres(true);
    console.log("Fetching avant-apres..."); // DEBUG

    try {
      const res = await fetch(`${API_BASE}/api/public/images/avant-apres`);
      if (!res.ok) {
        console.error("HTTP error:", res.status, res.statusText);
        throw new Error(`HTTP ${res.status}`);
      }
      const { files } = await res.json();
      console.log("avant-apres files:", files.map((f: any) => f.filename)); // DEBUG

      const getId = (name: string) => name.replace(/^(avant|apres)-/, '').replace(/\.[^.]+$/, '');
      const avantMap = new Map<string, string>();
      const apresMap = new Map<string, string>();

      files.forEach((img: any) => {
        if (img.filename.startsWith('avant-')) avantMap.set(getId(img.filename), img.url);
        else if (img.filename.startsWith('apres-')) apresMap.set(getId(img.filename), img.url);
      });

      const pairs: AvantApresPair[] = [];
      apresMap.forEach((after, id) => {
        const before = avantMap.get(id);
        if (before) {
          pairs.push({ title: `Projet ${pairs.length + 1}`, before, after });
        }
      });

      console.log("Pairs found:", pairs.length); // DEBUG
      setAvantApres(pairs);
    } catch (err) {
      console.error("Failed to fetch avant-apres:", err);
    } finally {
      setIsLoadingAvantApres(false);
    }
  }, [avantApres.length, hasInteracted]);

  // === CHARGEMENT INITIAL + POLLING ===
  useEffect(() => {
    fetchProjects();

    const interval = setInterval(() => {
      if (!hasInteracted) {
        fetchProjects();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchProjects, hasInteracted]);

  // === LAZY LOAD AVANT/APRÈS (quand visible) ===
  useEffect(() => {
    const currentRef = avantApresRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && avantApres.length === 0) {
          console.log("avant-apres section visible → fetching...");
          fetchAvantApres();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(currentRef);
    return () => observer.disconnect();
  }, [fetchAvantApres, avantApres.length]);

  // === GESTION CAROUSEL ===
  const handleSwitch = (projIdx: number, dir: "next" | "prev") => {
    setHasInteracted(true);
    setActiveIndexes(prev => {
      const copy = [...prev];
      const total = projects[projIdx]?.images.length || 0;
      if (total === 0) return prev;
      copy[projIdx] = dir === "next"
        ? (copy[projIdx] + 1) % total
        : (copy[projIdx] - 1 + total) % total;
      return copy;
    });
  };

  // === SWIPE ===
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (projIdx: number) => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      setHasInteracted(true);
      handleSwitch(projIdx, diff > 0 ? "next" : "prev");
    }
  };

  // === ACTUALISER ===
  const refreshAll = () => {
    fetchProjects();
    fetchAvantApres();
  };

  return (
    <section id="portfolio" className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* HEADER */}
        <div className="text-center mb-10 md:mb-12">
          <div className="inline-flex items-center space-x-2 bg-accent/20 rounded-full px-4 py-2 mb-4">
            <Palette className="h-5 w-5 text-accent" />
            <span className="text-accent font-medium text-sm md:text-base">Nos Réalisations</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-3 font-heading">
            Portfolio de Nos <span className="text-accent">Créations</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Découvrez nos réalisations : enduits, peintures, escaliers et transformations avant / après.
          </p>
          <Button variant="outline" size="sm" onClick={refreshAll} className="text-xs md:text-sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>

        {/* PROJETS */}
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
                <div className="relative group aspect-square md:aspect-auto md:h-80">
                  <img
                    src={item.images[activeIndexes[idx]] || "/placeholder.svg"}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {item.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSwitch(idx, "prev"); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white shadow-lg md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                        aria-label="Précédent"
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-700" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSwitch(idx, "next"); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white shadow-lg md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                        aria-label="Suivant"
                      >
                        <ChevronRight className="h-5 w-5 text-gray-700" />
                      </button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {item.images.map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all ${
                              i === activeIndexes[idx] ? "bg-white w-6" : "bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div className="p-4 md:p-5">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {item.tags.map((t, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {t}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-primary mb-1.5">{item.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AVANT / APRÈS */}
        <div ref={avantApresRef} className="mt-16 md:mt-20">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 text-accent">
            Avant / Après
          </h3>

          {isLoadingAvantApres ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
              <span className="ml-2 text-sm text-muted-foreground">Chargement des transformations...</span>
            </div>
          ) : avantApres.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Aucune transformation disponible pour le moment.</p>
              <Button variant="outline" size="sm" onClick={fetchAvantApres}>
                Réessayer
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
              {avantApres.map((pair, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-4 md:gap-6 bg-card rounded-xl p-4 md:p-6 shadow-md"
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <img
                      src={pair.before}
                      alt={`Avant - ${pair.title}`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 bg-white/90 px-3 py-1.5 rounded text-sm font-semibold text-green-700">
                      Avant
                    </span>
                  </div>
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <img
                      src={pair.after}
                      alt={`Après - ${pair.title}`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 bg-white/90 px-3 py-1.5 rounded text-sm font-semibold text-blue-700">
                      Après
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;