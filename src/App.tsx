import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Inject JSON-LD structured data for business info
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Peinture Cambrai Showcase',
      image: 'https://peinture-paris-showcase.com/assets/hero-painting.jpg',
      '@id': 'https://peinture-paris-showcase.com/',
      url: 'https://peinture-paris-showcase.com/',
      telephone: '+33 6 12 34 56 78',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Cambrai',
        addressLocality: 'Cambrai',
        postalCode: '59400',
        addressCountry: 'FR',
      },
      description: "Entreprise de peinture à Cambrai et dans un rayon de 50 km : peinture intérieure, extérieure, enduit, plâtrerie. Qualité, rapidité, satisfaction garantie. Devis gratuit !",
      areaServed: {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: 50.175,
          longitude: 3.234,
        },
        geoRadius: 50000
      },
      priceRange: '€€',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '30',
      },
    });
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Helmet>
          <title>Peinture Cambrai Showcase | Peintre professionnel à Cambrai et alentours</title>
          <meta name="description" content="Entreprise de peinture à Cambrai, Caudry, Le Cateau, Solesmes, Denain, Valenciennes, Douai, Arras, Saint-Quentin et dans un rayon de 50 km : peinture intérieure, extérieure, rénovation, plâtrerie, enduit, façades, décoration, devis gratuit, artisan peintre, travaux de qualité, satisfaction garantie. Interventions rapides sur tout le Nord et Hauts-de-France." />
          <meta name="keywords" content="peinture cambrai, peintre cambrai, entreprise peinture cambrai, artisan peintre cambrai, devis peinture cambrai, travaux peinture cambrai, peinture professionnelle cambrai, peinture appartement cambrai, peinture maison cambrai, peinture mur cambrai, peinture plafond cambrai, peinture décorative cambrai, peinture bâtiment cambrai, peinture rapide cambrai, peinture qualité cambrai, peinture pas cher cambrai, peinture caudry, peintre caudry, entreprise peinture caudry, artisan peintre caudry, devis peinture caudry, travaux peinture caudry, peinture le cateau, peintre le cateau, entreprise peinture le cateau, artisan peintre le cateau, devis peinture le cateau, travaux peinture le cateau, peinture solesmes, peintre solesmes, entreprise peinture solesmes, artisan peintre solesmes, devis peinture solesmes, travaux peinture solesmes, peinture denain, peintre denain, entreprise peinture denain, artisan peintre denain, devis peinture denain, travaux peinture denain, peinture valenciennes, peintre valenciennes, entreprise peinture valenciennes, artisan peintre valenciennes, devis peinture valenciennes, travaux peinture valenciennes, peinture douai, peintre douai, entreprise peinture douai, artisan peintre douai, devis peinture douai, travaux peinture douai, peinture arras, peintre arras, entreprise peinture arras, artisan peintre arras, devis peinture arras, travaux peinture arras, peinture saint-quentin, peintre saint-quentin, entreprise peinture saint-quentin, artisan peintre saint-quentin, devis peinture saint-quentin, travaux peinture saint-quentin, peinture nord, peinture hauts-de-france, peinture 50km cambrai, peinture pas cher nord, peinture rapide nord, rénovation nord, artisan peintre nord, entreprise peinture nord, devis peinture nord, travaux peinture nord, peinture mur nord, peinture plafond nord, peinture façade nord, peinture décorative nord, peinture maison nord, peinture appartement nord, peinture bâtiment nord, peinture professionnelle nord, peinture extérieure nord, peinture intérieure nord, peinture pas cher hauts-de-france, peinture rapide hauts-de-france, rénovation hauts-de-france, artisan peintre hauts-de-france, entreprise peinture hauts-de-france, devis peinture hauts-de-france, travaux peinture hauts-de-france, peinture mur hauts-de-france, peinture plafond hauts-de-france, peinture façade hauts-de-france, peinture décorative hauts-de-france, peinture maison hauts-de-france, peinture appartement hauts-de-france, peinture bâtiment hauts-de-france, peinture professionnelle hauts-de-france, peinture extérieure hauts-de-france, peinture intérieure hauts-de-france" />
          <meta property="og:title" content="Peinture Cambrai Showcase | Peintre professionnel à Cambrai et alentours" />
          <meta property="og:description" content="Entreprise de peinture à Cambrai et dans un rayon de 50 km : peinture intérieure, extérieure, enduit, plâtrerie. Qualité, rapidité, satisfaction garantie. Devis gratuit !" />
          <meta property="og:image" content="/assets/hero-painting.jpg" />
          <meta property="og:type" content="website" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href="https://peinture-paris-showcase.com/" />
        </Helmet>
        <Toaster />
        <Sonner />
        {/* Section SEO : Zones desservies */}
        <div style={{display:'none'}} aria-hidden="true">
          <h2>Zones desservies</h2>
          <ul>
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
            <li>50 km autour de Cambrai</li>
            <li>et tous les villages alentours</li>
          </ul>
          <p>
            Peintre professionnel, entreprise de peinture, artisan peintre, devis peinture, travaux de peinture, rénovation, plâtrerie, enduit, peinture intérieure, peinture extérieure, peinture façade, peinture décorative, peinture maison, peinture appartement, peinture bâtiment, interventions rapides, qualité, satisfaction garantie, prix attractifs, devis gratuit, service local.
          </p>
        </div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
