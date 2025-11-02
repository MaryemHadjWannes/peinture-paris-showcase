// src/components/Portfolio.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, ChevronLeft, ChevronRight } from "lucide-react";

// NOTE: Since the Admin component now saves the full Cloudinary URL to 
// localStorage, this component automatically uses the CDN links, which is 
// fast and efficient!

const Portfolio = () => {
  const [portfolioData, setPortfolioData] = useState<any[]>([]);
  const [avantApresData, setAvantApresData] = useState<any[]>([]);
  const [activeIndexes, setActiveIndexes] = useState<number[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("portfolioImages") || "{}");

    // The saved objects in localStorage now contain { url: '...', filename: '...', publicId: '...' }
    // We map to get just the 'url' property as before.
    const map = {
      enduit: saved["enduit"]?.map((i: any) => i.url) || [],
      "peinture-interieure": saved["peinture-interieure"]?.map((i: any) => i.url) || [],
      "escalier-details": saved["escalier-details"]?.map((i: any) => i.url) || [],
      "avant-apres": saved["avant-apres"]?.map((i: any) => i.url) || [],
    };

    const projects = [
      {
        title: "Enduit Professionnel",
        category: "enduit",
        description:
          "Surfaces parfaitement préparées et ratissées pour des finitions impeccables.",
        images: map.enduit,
        tags: ["Finition lisse", "Ratissage", "Calicot"],
      },
      {
        title: "Peinture Intérieure",
        category: "peinture",
        description:
          "Finitions soignées et durables avec peintures écologiques.",
        images: map["peinture-interieure"],
        tags: ["Couleurs", "Décoration", "Confort"],
      },
      {
        title: "Escalier & Détails",
        category: "escalier",
        description:
          "Escaliers élégants avec finitions précises et matériaux de qualité.",
        images: map["escalier-details"],
        tags: ["Détails", "Bois", "Harmonie"],
      },
    ];

    // Pair avant/après (even = before, odd = after)
    const pairs: any[] = [];
    const aa = map["avant-apres"];
    for (let i = 0; i < aa.length; i += 2) {
      pairs.push({
        title: `Projet ${pairs.length + 1}`,
        before: aa[i],
        after: aa[i + 1] || "",
      });
    }

    setPortfolioData(projects);
    setAvantApresData(pairs);
    // Initialize activeIndexes based on the number of projects
    setActiveIndexes(projects.map(() => 0)); 
  }, []);

  const handleSwitch = (projIdx: number, dir: "next" | "prev") => {
    setActiveIndexes(prev => {
      const copy = [...prev];
      const total = portfolioData[projIdx].images.length;
      if (total === 0) return prev; // Avoid error if no images
      copy[projIdx] =
        dir === "next"
          ? (copy[projIdx] + 1) % total
          : (copy[projIdx] - 1 + total) % total;
      return copy;
    });
  };

  /* ----- UI (unchanged, just use state vars) ----- */
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {portfolioData.map((item, idx) => (
            <div key={idx} className="bg-card rounded-xl overflow-hidden shadow-md border border-border/50 relative">
              <div className="relative group">
                <img
                  // Use the Cloudinary URL directly
                  src={item.images[activeIndexes[idx]] || "/placeholder.svg"} 
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

        {/* AVANT / APRÈS */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold mb-8 text-accent">Avant / Après</h3>
          <div className="flex flex-col gap-12">
            {avantApresData.map((pair, i) => (
              <div key={i} className="flex flex-col md:flex-row gap-6 justify-center items-center">
                <div className="relative">
                  <img
                    // Use the Cloudinary URL directly
                    src={pair.before || "/placeholder.svg"} 
                    alt={`Avant - ${pair.title}`}
                    className="w-80 h-56 object-cover rounded-xl shadow-md"
                  />
                  <span className="absolute bottom-2 left-2 bg-white/80 px-3 py-1 rounded text-sm font-medium">
                    Avant
                  </span>
                </div>
                {pair.after && (
                  <div className="relative">
                    <img
                      // Use the Cloudinary URL directly
                      src={pair.after}
                      alt={`Après - ${pair.title}`}
                      className="w-80 h-56 object-cover rounded-xl shadow-md"
                    />
                    <span className="absolute bottom-2 left-2 bg-white/80 px-3 py-1 rounded text-sm font-medium">
                      Après
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;