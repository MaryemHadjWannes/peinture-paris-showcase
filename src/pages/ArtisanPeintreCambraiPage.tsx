// src/pages/ArtisanPeintreCambraiPage.tsx
import React from "react";
import ServiceLayout from "@/pages/services/ServiceLayout";
import ArtisanPeintreContent from "@/pages/services/ArtisanPeintreContent";
import { DEFAULT_CITY } from "@/data/seo";

const canonical = "https://hn-renovation.fr/artisan-peintre-cambrai";
const title = "Artisan peintre à Cambrai (59) | HN Rénovation";
const description =
  "Artisan peintre à Cambrai : peinture intérieure et extérieure, ravalement de façade, finitions professionnelles. Devis gratuit.";

export default function ArtisanPeintreCambraiPage() {
  return (
    <ServiceLayout title={title} description={description} canonical={canonical}>
      <ArtisanPeintreContent city={DEFAULT_CITY} />
    </ServiceLayout>
  );
}
