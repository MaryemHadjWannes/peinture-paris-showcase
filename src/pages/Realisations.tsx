// src/pages/Realisations.tsx
import SeoHead from "@/components/SeoHead";
import { REALISATIONS_META } from "@/data/routeMeta";
import Navigation from "@/components/Navigation";
import Portfolio from "@/components/Portfolio";
import Footer from "@/components/Footer";

const Realisations = () => {
  return (
    <div className="min-h-screen">
      <SeoHead meta={REALISATIONS_META} />
      <Navigation />
      {/* Top padding = height of the fixed navigation bar */}
      <main className="pt-24 sm:pt-32">
        <div className="container mx-auto px-4 pt-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-primary mb-4">Nos réalisations peinture</h1>
            <p className="text-muted-foreground max-w-3xl mb-6">
              Découvrez nos chantiers de peinture intérieure et extérieure à Cambrai (59), dans le Nord et les villes
              voisines. Chaque projet met en avant une préparation soignée, des enduits de qualité et des finitions
              durables.
            </p>
            <p className="text-muted-foreground max-w-3xl mb-6">
              Cette galerie présente des exemples de murs, plafonds, façades et rénovations complètes réalisés par
              HN Rénovation. Nous intervenons aussi autour de Cambrai, notamment à Douai, Valenciennes, Arras et Caudry,
              avec un devis gratuit et un chantier propre du début à la fin.
            </p>
          </div>
        </div>
        <Portfolio />
      </main>
      <Footer />
    </div>
  );
};

export default Realisations;
