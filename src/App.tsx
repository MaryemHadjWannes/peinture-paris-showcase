// src/App.tsx
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from './pages/Admin';

// ✅ IMPORT hero image for preload
import heroImageWebp from "@/assets/hero-painting.webp";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Inject JSON-LD structured data (CRITICAL FOR LOCAL SEO)
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'H.N. Rénovation',
      image: 'https://hn-renovation.fr/assets/hero-painting.jpg',
      '@id': 'https://hn-renovation.fr/',
      url: 'https://hn-renovation.fr/',
      telephone: '+33 6 02 22 80 01',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '103 rue Saint Ladre',
        addressLocality: 'Cambrai',
        postalCode: '59400',
        addressCountry: 'FR',
      },
      description:
        "H.N. Rénovation : Votre entreprise de peinture, rénovation, enduit, et plâtrerie à Cambrai et dans tout le Nord (59). Devis rapide et gratuit.",
      areaServed: {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: 50.175,
          longitude: 3.234,
        },
        geoRadius: 50000,
      },
      priceRange: '€€',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '30',
      },
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Helmet>
          {/* ✅ MAIN SEO META */}
          <title>H.N. Rénovation | Peintre professionnel à Cambrai (59) et alentours</title>
          <meta
            name="description"
            content="H.N. Rénovation : entreprise de peinture à Cambrai, Caudry, Le Cateau, Solesmes, Denain, Valenciennes et dans un rayon de 50 km : peinture intérieure, extérieure, rénovation, plâtrerie, enduit, façades. Artisan qualifié, devis gratuit. Interventions rapides sur tout le Nord et Hauts-de-France."
          />
          <meta
            name="keywords"
            content="peinture cambrai, peintre cambrai, entreprise peinture cambrai, artisan peintre cambrai, rénovation cambrai, peinture nord, peintre nord, enduit, plâtrerie, 59400"
          />

          <meta
            property="og:title"
            content="H.N. Rénovation | Peintre professionnel à Cambrai (59) et alentours"
          />
          <meta
            property="og:description"
            content="H.N. Rénovation : entreprise de peinture et rénovation, qualité, rapidité, satisfaction garantie. Devis gratuit !"
          />
          <meta
            property="og:image"
            content="https://hn-renovation.fr/assets/hero-painting.jpg"
          />
          <meta property="og:type" content="website" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href="https://hn-renovation.fr/" />

          {/* ✅ PRELOAD HERO IMAGE FOR FASTER LCP */}
          <link
            rel="preload"
            as="image"
            href={heroImageWebp}
            type="image/webp"
          />
        </Helmet>

        <Toaster />
        <Sonner />

        {/* Section SEO : Zones desservies */}
        <div style={{ display: 'none' }} aria-hidden="true">
          <h2>Zones desservies</h2>
          <ul>
            <li>103 rue Saint Ladre, 59400 Cambrai</li>
            <li>Cambrai</li>
            <li>Caudry</li>
            <li>Le Cateau</li>
            <li>Solesmes</li>
            <li>Denain</li>
            <li>Valenciennes</li>
            <li>Douai</li>
            <li>Arras</li>
            <li>Saint-Quentin</li>
            <li>Nord</li>
            <li>Hauts-de-France</li>
            <li>70 km autour de Cambrai</li>
            <li>et tous les villages alentours</li>
          </ul>
          <p>
            Peintre professionnel, entreprise de peinture, artisan peintre, devis
            peinture, travaux de peinture, rénovation, plâtrerie, enduit, peinture
            intérieure, peinture extérieure, peinture façade, peinture décorative,
            peinture maison, peinture appartement, peinture bâtiment, interventions
            rapides, qualité, satisfaction garantie, prix attractifs, devis gratuit,
            service local.
          </p>
        </div>

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin/*" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
