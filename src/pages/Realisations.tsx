// src/pages/Realisations.tsx
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Portfolio from "@/components/Portfolio";
import Footer from "@/components/Footer";

const Realisations = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Réalisations peinture à Cambrai (59) | HN Rénovation</title>
        <meta
          name="description"
          content="Découvrez les réalisations HN Rénovation : peinture intérieure et extérieure, enduits et ravalement de façade à Cambrai (59) et dans le Nord."
        />
        <link rel="canonical" href="https://hn-renovation.fr/realisations" />
        <meta property="og:title" content="Réalisations peinture à Cambrai (59) | HN Rénovation" />
        <meta
          property="og:description"
          content="Sélection de chantiers : peinture intérieure/extérieure, enduits, façades. Artisan peintre à Cambrai."
        />
        <meta property="og:url" content="https://hn-renovation.fr/realisations" />
        <meta property="og:image" content="https://hn-renovation.fr/uploads/1759262842539-hero-painting.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Réalisations peinture à Cambrai (59) | HN Rénovation" />
        <meta
          name="twitter:description"
          content="Sélection de chantiers : peinture intérieure/extérieure, enduits, façades. Artisan peintre à Cambrai."
        />
        <meta name="twitter:image" content="https://hn-renovation.fr/uploads/1759262842539-hero-painting.jpg" />
      </Helmet>
      <Navigation />
      <br />
      <br />
      <main>
        <br/>
        <div className="container mx-auto px-4 pt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Nos réalisations peinture</h1>
          <p className="text-muted-foreground max-w-3xl mb-6">
            Découvrez nos chantiers de peinture intérieure et extérieure à Cambrai (59), dans le Nord et les villes
            voisines. Chaque projet met en avant une préparation soignée, des enduits de qualité et des finitions
            durables.
          </p>
        </div>
        <Portfolio />
      </main>
      <Footer />
    </div>
  );
};

export default Realisations;
