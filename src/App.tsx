// src/App.tsx
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Admin = lazy(() => import("./pages/Admin"));
const Realisations = lazy(() => import("./pages/Realisations"));
const CityPage = lazy(() => import("./pages/CityPage"));
const CityServicePage = lazy(() => import("./pages/CityServicePage"));
const Avis = lazy(() => import("./pages/Avis"));
import ScrollToTop from "@/components/ScrollToTop";
// ✅ pages services

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<div className="min-h-screen" />}>
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
        </Suspense>
      </BrowserRouter>
  );
};

export default App;
