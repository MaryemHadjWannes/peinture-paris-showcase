import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { City } from "@/data/seo";
import { Image } from "lucide-react";

type Category = {
  id: string;
  title: string;
  description: string;
};

const API_BASE = import.meta.env.DEV ? "http://localhost:5000" : "";

const categories: Category[] = [
  {
    id: "enduit",
    title: "Enduit Professionnel",
    description: "Murs lisses et finitions soignées avant peinture.",
  },
  {
    id: "peinture-interieure",
    title: "Peinture Intérieure",
    description: "Couleurs, ambiance et finitions propres.",
  },
  {
    id: "escalier-details",
    title: "Escalier & Détails",
    description: "Travaux précis sur boiseries et finitions décoratives.",
  },
  {
    id: "avant-apres",
    title: "Avant / Après",
    description: "Transformations visibles et résultats concrets.",
  },
];

const PortfolioPreview = ({ city }: { city: City }) => {
  const [covers, setCovers] = useState<Record<string, string>>({});
  const [hasLoaded, setHasLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  const fetchCovers = useCallback(async () => {
    const next: Record<string, string> = {};
    await Promise.all(
      categories.map(async (category) => {
        try {
          const res = await fetch(`${API_BASE}/api/public/images/${category.id}`);
          if (!res.ok) return;
          const { files } = await res.json();
          if (Array.isArray(files) && files.length > 0) {
            if (category.id === "avant-apres") {
              const after = files.find((file: any) => file.filename?.startsWith("apres-"));
              next[category.id] = (after || files[0]).url;
              return;
            }
            next[category.id] = files[0].url;
          }
        } catch {
          // ignore preview failures
        }
      })
    );
    setCovers(next);
  }, []);

  useEffect(() => {
    if (hasLoaded) return;
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      fetchCovers();
      setHasLoaded(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchCovers();
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [fetchCovers, hasLoaded]);

  const cityLabel = useMemo(
    () => `${city.name} (${city.postalCode})`,
    [city.name, city.postalCode]
  );

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 bg-secondary/10">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center space-x-2 bg-accent/20 rounded-full px-4 py-2 mb-4 sm:mb-5">
            <Image className="h-5 w-5 text-accent" />
            <span className="text-accent font-medium text-sm sm:text-base">
              Réalisations & Chantiers
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-3 sm:mb-4">
            Nos réalisations à {city.name}
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Un aperçu de nos chantiers en enduit, peinture intérieure et finitions soignées à {city.name}.
          </p>
        </div>


        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const image = covers[category.id] || "/placeholder.svg";
            return (
              <div
                key={category.id}
                className="rounded-2xl border border-border/60 bg-card/60 shadow-sm overflow-hidden"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={image}
                    alt={`${category.title} - réalisations à ${cityLabel}`}
                    title={`${category.title} - réalisations à ${cityLabel}`}
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                    width={1200}
                    height={900}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-heading font-semibold text-primary">{category.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <Button asChild size="lg">
            <Link to="/realisations">Voir toutes nos réalisations</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PortfolioPreview;
