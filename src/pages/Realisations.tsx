// src/pages/Realisations.tsx
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Portfolio from "@/components/Portfolio";
import Footer from "@/components/Footer";

const Realisations = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Réalisations peinture & rénovation | HN Rénovation</title>
        <meta
          name="description"
          content="Découvrez les réalisations HN Rénovation : peinture intérieure, extérieure, enduits et ravalement de façade à Cambrai et alentours."
        />
        <link rel="canonical" href="https://hn-renovation.fr/realisations" />
        <meta property="og:title" content="Réalisations peinture & rénovation | HN Rénovation" />
        <meta
          property="og:description"
          content="Sélection de chantiers : peinture intérieure/extérieure, enduits, façades. Artisan peintre à Cambrai."
        />
        <meta property="og:url" content="https://hn-renovation.fr/realisations" />
        <meta property="og:image" content="https://hn-renovation.fr/uploads/1759262842539-hero-painting.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Réalisations peinture & rénovation | HN Rénovation" />
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
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-6">Nos réalisations</h1>
        </div>
        <Portfolio />
      </main>
      <Footer />
    </div>
  );
};

export default Realisations;
