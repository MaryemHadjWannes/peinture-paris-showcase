// src/App.tsx
import { useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Realisations from "./pages/Realisations";
import CityPage from "./pages/CityPage";
import CityServicePage from "./pages/CityServicePage";
import ScrollToTop from "@/components/ScrollToTop";
import { CITIES } from "@/data/seo";
// ✅ pages services

import Avis from "./pages/Avis";

const citySlugSet = new Set(CITIES.map((city) => city.slug));

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
    sameAs: [
      "https://www.facebook.com/profile.php?id=61576234322277",
      "https://www.youtube.com/@HN-Renovation",
      "https://www.linkedin.com/in/hn-r%C3%A9novation-6947663a1/",
      "https://x.com/HWannesMaryem",
    ],
  });

  document.head.appendChild(script);

  return () => {
    if (script.parentNode) {
      script.parentNode.removeChild(script);
    }
  };
}, []);


  return (
    <TooltipProvider>
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
            <Route path="/avis" element={<Avis />} />   
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
  );
};

export default App;
