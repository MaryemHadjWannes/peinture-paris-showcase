import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, ChevronLeft, ChevronRight } from "lucide-react";

const portfolioData = [
  {
    title: "Enduit Professionnel",
    category: "enduit",
    description: `Surfaces parfaitement préparées et ratissées pour des finitions impeccables.`,
    images: [
      "/photos/ENDUIT/enduit8.webp",
      "/photos/ENDUIT/enduit1.webp",
      "/photos/ENDUIT/enduit3.webp",
      "/photos/ENDUIT/enduit4.webp",
      "/photos/ENDUIT/enduit5.webp",
      "/photos/ENDUIT/enduit6.webp",
      "/photos/ENDUIT/enduit7.webp",

    ],
    tags: ["Finition lisse", "Ratissage", "Calicot"],
  },
  {
    title: "Peinture Intérieure",
    category: "peinture",
    description: `Finitions soignées et durables avec peintures écologiques.`,
    images: [
      "/photos/PEINTURE INTERIEUR/interieur1.webp",
      "/photos/PEINTURE INTERIEUR/interieur2.webp",
    ],
    tags: ["Couleurs", "Décoration", "Confort"],
  },
  {
    title: "Escalier & Détails",
    category: "escalier",
    description: `Escaliers élégants avec finitions précises et matériaux de qualité.`,
    images: [
     
      "/photos/ESCALIER/escalier1.webp",
      "/photos/ESCALIER/escalier2.webp",
      "/photos/ESCALIER/avant-escalier.webp",
      
    ],
    tags: ["Détails", "Bois", "Harmonie"],
  },
];

const avantApresData = [
  {
    title: "Couloir",
    before: "/photos/AVANT-APRES/avant-couloir.jpeg",
    after: "/photos/AVANT-APRES/apres-couloir.jpeg",
  },
  {
    title: "Escalier",
    before: "/photos/AVANT-APRES/apres-escalier.webp",
    after: "/photos/AVANT-APRES/avant-escalier.webp",
  },
];

const Portfolio = () => {
  const [activeIndexes, setActiveIndexes] = useState(
    portfolioData.map(() => 0)
  );

  const handleSwitch = (index, direction) => {
    setActiveIndexes((prev) => {
      const newIndexes = [...prev];
      const total = portfolioData[index].images.length;
      newIndexes[index] =
        direction === "next"
          ? (prev[index] + 1) % total
          : (prev[index] - 1 + total) % total;
      return newIndexes;
    });
  };

  return (
    <section id="portfolio" className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-accent/20 rounded-full px-4 py-2 mb-4">
            <Palette className="h-5 w-5 text-accent" />
            <span className="text-accent font-medium">Nos Réalisations</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-3 font-heading">
            Portfolio de Nos <span className="text-accent">Créations</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez nos réalisations : enduits, peintures, escaliers et
            transformations avant / après.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {portfolioData.map((item, index) => (
            <div
              key={index}
              className="bg-card rounded-xl overflow-hidden shadow-md border border-border/50 relative"
            >
              <div className="relative group">
                <img
                  src={item.images[activeIndexes[index]]}
                  alt={item.title}
                  className="w-full h-[400px] object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <button
                  onClick={() => handleSwitch(index, "prev")}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-white shadow"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  onClick={() => handleSwitch(index, "next")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-white shadow"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </button>
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
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Avant / Après Section */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold mb-8 text-accent">Avant / Après</h3>
          <div className="flex flex-col gap-12">
            {avantApresData.map((item, idx) => (
              <div key={idx} className="flex flex-col md:flex-row gap-6 justify-center items-center">
                <div className="relative">
                  <img
                    src={item.before}
                    alt={`Avant - ${item.title}`}
                    className="w-80 h-56 object-cover rounded-xl shadow-md"
                  />
                  <span className="absolute bottom-2 left-2 bg-white/80 px-3 py-1 rounded text-sm font-medium">
                    Avant
                  </span>
                </div>
                <div className="relative">
                  <img
                    src={item.after}
                    alt={`Après - ${item.title}`}
                    className="w-80 h-56 object-cover rounded-xl shadow-md"
                  />
                  <span className="absolute bottom-2 left-2 bg-white/80 px-3 py-1 rounded text-sm font-medium">
                    Après
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
