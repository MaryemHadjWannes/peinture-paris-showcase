// src/App.tsx
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Realisations from "./pages/Realisations";
import CityPage from "./pages/CityPage";
import CityServicePage from "./pages/CityServicePage";

// ✅ pages services
import PeintureInterieurePage from "./pages/PeintureInterieurePage";
import PeintureExterieurePage from "./pages/PeintureExterieurePage";
import RavalementFacadePage from "./pages/RavalementFacadePage";
import RenovationInterieurePage from "./pages/RenovationInterieurePage";
import ArtisanPeintreCambraiPage from "./pages/ArtisanPeintreCambraiPage";

// ✅ IMPORT hero image for preload
import heroImageWebp from "@/assets/hero-painting.webp";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.innerHTML = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "H.N. Rénovation",
    url: "https://hn-renovation.fr/",
    telephone: "+33 6 02 22 80 01",
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
          <title>H.N. Rénovation | Peintre professionnel à Cambrai (59) et alentours</title>
          <meta
            name="description"
            content="H.N. Rénovation : entreprise de peinture à Cambrai et alentours : peinture intérieure, extérieure, rénovation, plâtrerie, enduit, façades. Artisan qualifié, devis gratuit."
          />
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href="https://hn-renovation.fr/" />

          <link rel="preload" as="image" href={heroImageWebp} type="image/webp" />
        </Helmet>

        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/realisations" element={<Realisations />} />

            {/* ✅ pages services */}
            <Route path="/peinture-interieure" element={<PeintureInterieurePage />} />
            <Route path="/peinture-exterieure" element={<PeintureExterieurePage />} />
            <Route path="/ravalement-facade" element={<RavalementFacadePage />} />
            <Route path="/renovation-interieure" element={<RenovationInterieurePage />} />
            <Route path="/artisan-peintre-cambrai" element={<ArtisanPeintreCambraiPage />} />

            {/* ✅ SEO city routes (si tu gardes aussi la variante par ville) */}
            <Route path="/ville/:citySlug" element={<CityPage />} />
            <Route path="/ville/:citySlug/:serviceSlug" element={<CityServicePage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
