// src/App.tsx
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Realisations from "./pages/Realisations";
import CityPage from "./pages/CityPage";
import CityServicePage from "./pages/CityServicePage";
import ScrollToTop from "@/components/ScrollToTop";
import { CITIES } from "@/data/seo";
// ✅ pages services

// ✅ IMPORT hero image for preload
import heroImageWebp from "@/assets/hero-painting.webp";
import Avis from "./pages/Avis";

const queryClient = new QueryClient();
const citySlugSet = new Set(CITIES.map((city) => city.slug));

const LegacyCityServiceRedirect = () => {
  const { citySlug, serviceSlug } = useParams<{ citySlug?: string; serviceSlug?: string }>();
  if (!citySlug || !serviceSlug || !citySlugSet.has(citySlug)) {
    return <Navigate to="/" replace />;
  }
  return <Navigate to={`/${serviceSlug}/${citySlug}`} replace />;
};

const LegacyCityRedirect = () => {
  const { citySlug } = useParams<{ citySlug?: string }>();
  if (!citySlug || !citySlugSet.has(citySlug)) {
    return <Navigate to="/" replace />;
  }
  return <Navigate to={`/${citySlug}`} replace />;
};

const App = () => {
  useEffect(() => {
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.innerHTML = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://hn-renovation.fr/#localbusiness",
    name: "H.N. Rénovation",
    url: "https://hn-renovation.fr/",
    telephone: "+33 6 02 22 80 01",
    email: "hn.renovation.fr@gmail.com",
    image: "https://hn-renovation.fr/hn-logo.png",
    logo: "https://hn-renovation.fr/hn-logo.png",
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: "103 rue Saint Ladre",
      addressLocality: "Cambrai",
      postalCode: "59400",
      addressRegion: "Hauts-de-France",
      addressCountry: "FR",
    },
    areaServed: [
      { "@type": "City", name: "Cambrai" },
      { "@type": "City", name: "Douai" },
      { "@type": "City", name: "Valenciennes" },
      { "@type": "City", name: "Arras" },
      { "@type": "City", name: "Caudry" },
    ],
    openingHours: "Mo-Fr 08:00-18:00",
    sameAs: ["https://www.facebook.com/profile.php?id=61576234322277"],
  });

  document.head.appendChild(script);

  return () => {
    if (script.parentNode) {
      script.parentNode.removeChild(script);
    }
  };
}, []);


  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Helmet>
          <title>HN Rénovation | Artisan peintre à Cambrai (59)</title>
          <meta
            name="description"
            content="H.N. Rénovation : entreprise de peinture à Cambrai et alentours : peinture intérieure, extérieure, rénovation, plâtrerie, enduit, façades. Artisan qualifié, devis gratuit."
          />
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href="https://hn-renovation.fr/" />
          <meta property="og:title" content="HN Rénovation | Artisan peintre à Cambrai (59)" />
          <meta
            property="og:description"
            content="Peinture intérieure et extérieure, enduits, plâtrerie et ravalement de façade. Artisan peintre à Cambrai, devis gratuit."
          />
          <meta property="og:image" content="https://hn-renovation.fr/uploads/1759262842539-hero-painting.jpg" />
          <meta property="og:url" content="https://hn-renovation.fr/" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="HN Rénovation | Artisan peintre à Cambrai (59)" />
          <meta
            name="twitter:description"
            content="Peinture intérieure et extérieure, enduits, plâtrerie et ravalement de façade. Artisan peintre à Cambrai, devis gratuit."
          />
          <meta name="twitter:image" content="https://hn-renovation.fr/uploads/1759262842539-hero-painting.jpg" />

          <link rel="preload" as="image" href={heroImageWebp} type="image/webp" />
        </Helmet>

        <Toaster />
        <Sonner />

        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/realisations" element={<Realisations />} />

            {/* ✅ pages services */}
            <Route path="/artisan-peintre-cambrai" element={<Navigate to="/artisan-peintre/cambrai-59400" replace />} />

            {/* ✅ SEO city routes */}
            <Route path="/:citySlug" element={<CityPage />} />
            <Route path="/:serviceSlug/:citySlug" element={<CityServicePage />} />
            <Route path="/ville/:citySlug" element={<LegacyCityRedirect />} />
            <Route path="/ville/:citySlug/:serviceSlug" element={<LegacyCityServiceRedirect />} />


            <Route path="/avis" element={<Avis />} />   
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
