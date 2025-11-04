import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, ChevronLeft, ChevronRight, Loader2, RefreshCw } from "lucide-react";

const API_BASE = import.meta.env.DEV ? 'http://localhost:5000' : '';

interface ImageFile {
  url: string;
  filename: string;
}

const Portfolio = () => {
  const [portfolioData, setPortfolioData] = useState<any[]>([]);
  const [avantApresData, setAvantApresData] = useState<any[]>([]);
  const [activeIndexes, setActiveIndexes] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fonction de fetch (extraite pour réutilisation)
  const fetchAll = async () => {
    setIsLoading(true);
    console.log('🔄 Portfolio: Fetching data...'); // Debug

    const normalCats = ["enduit", "peinture-interieure", "escalier-details"];
    const fetchedMap: Record<string, ImageFile[]> = {};

    await Promise.all(
      normalCats.map(async (cat) => {
        try {
          const res = await fetch(`${API_BASE}/api/public/images/${cat}`);
          if (!res.ok) throw new Error();
          const { files } = await res.json();
          fetchedMap[cat] = files.map((f: any) => ({ url: f.url, filename: f.filename }));
          console.log(`📁 ${cat}: ${files.length} images fetched`); // Debug
        } catch (error) {
          console.error(`Error fetching ${cat}:`, error);
          fetchedMap[cat] = [];
        }
      })
    );

    let avantApresFiles: ImageFile[] = [];
    try {
      const res = await fetch(`${API_BASE}/api/public/images/avant-apres`);
      if (!res.ok) throw new Error();
      const { files } = await res.json();
      avantApresFiles = files.map((f: any) => ({ url: f.url, filename: f.filename }));
      console.log(`🔄 avant-apres: ${files.length} files fetched:`, files.map(f => f.filename)); // Debug : liste tous les fichiers
    } catch (err) {
      console.error("Failed to fetch avant-apres:", err);
    }

    const projects = [
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

    // Pairing avant/après
    const getId = (name: string) => name.replace(/^(avant|apres)-/, '').replace(/\.[^.]+$/, '');
    const avantMap = new Map<string, string>();
    const apresMap = new Map<string, string>();

    avantApresFiles.forEach(img => {
      if (img.filename.startsWith('avant-')) {
        avantMap.set(getId(img.filename), img.url);
      } else if (img.filename.startsWith('apres-')) {
        apresMap.set(getId(img.filename), img.url);
      }
    });

    const pairs: any[] = [];
    apresMap.forEach((after, id) => {
      const before = avantMap.get(id);
      if (before) {
        pairs.push({
          title: `Projet ${pairs.length + 1}`,
          before,
          after,
        });
      }
    });

    console.log('🔗 Pairs trouvées:', pairs.length); // Debug : nombre de paires

    setPortfolioData(projects);
    setAvantApresData(pairs);
    setActiveIndexes(projects.map(() => 0));
    setIsLoading(false);
  };

  // Chargement initial + rafraîchissement automatique toutes les 10s
  useEffect(() => {
    fetchAll(); // Premier chargement
    const interval = setInterval(fetchAll, 10000); // Toutes les 10s
    return () => clearInterval(interval); // Nettoyage
  }, []);

  const handleSwitch = (projIdx: number, dir: "next" | "prev") => {
    setActiveIndexes(prev => {
      const copy = [...prev];
      const total = portfolioData[projIdx]?.images.length || 0;
      if (total === 0) return prev;
      copy[projIdx] = dir === "next"
        ? (copy[projIdx] + 1) % total
        : (copy[projIdx] - 1 + total) % total;
      return copy;
    });
  };

  // Bouton Actualiser
  const refreshData = () => {
    console.log('🔄 Manual refresh...');
    fetchAll();
  };

  if (isLoading) {
    return (
      <section id="portfolio" className="py-16 bg-background min-h-[500px] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-accent/20 rounded-full px-4 py-2 mb-4">
            <Palette className="h-5 w-5 text-accent" />
            <span className="text-accent font-medium">Nos Réalisations</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-3 font-heading">
            Portfolio de Nos <span className="text-accent">Créations</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez nos réalisations : enduits, peintures, escaliers et transformations avant / après.
          </p>
          {/* Bouton Actualiser */}
          <Button variant="outline" onClick={refreshData} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {portfolioData.map((item, idx) => (
            <div key={idx} className="bg-card rounded-xl overflow-hidden shadow-md border border-border/50 relative">
              <div className="relative group">
                <img
                  src={item.images[activeIndexes[idx] || 0] || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-[400px] object-contain transition-transform duration-500 group-hover:scale-105"
                />
                {item.images.length > 1 && (
                  <>
                    <button
                      onClick={() => handleSwitch(idx, "prev")}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-white shadow"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-700" />
                    </button>
                    <button
                      onClick={() => handleSwitch(idx, "next")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-white shadow"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-700" />
                    </button>
                  </>
                )}
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2 mb-3">
                  {item.tags.map((t: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {t}
                    </Badge>
                  ))}
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold mb-8 text-accent">Avant / Après</h3>
          <div className="flex flex-col gap-12">
            {avantApresData.length === 0 ? (
              <p className="text-muted-foreground">Aucune paire avant/après disponible</p>
            ) : (
              avantApresData.map((pair, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-6 justify-center items-center">
                  <div className="relative">
                    <img
                      src={pair.before}
                      alt={`Avant - ${pair.title}`}
                      className="w-80 h-56 object-cover rounded-xl shadow-md"
                    />
                    <span className="absolute bottom-2 left-2 bg-white/80 px-3 py-1 rounded text-sm font-medium">
                      Avant
                    </span>
                  </div>
                  <div className="relative">
                    <img
                      src={pair.after}
                      alt={`Après - ${pair.title}`}
                      className="w-80 h-56 object-cover rounded-xl shadow-md"
                    />
                    <span className="absolute bottom-2 left-2 bg-white/80 px-3 py-1 rounded text-sm font-medium">
                      Après
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;