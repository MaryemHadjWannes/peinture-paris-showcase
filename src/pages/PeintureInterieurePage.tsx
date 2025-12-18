// src/pages/PeintureInterieurePage.tsx
import React from "react";
import ServiceLayout from "@/pages/services/ServiceLayout";
import PeintureInterieureContent from "@/pages/services/PeintureInterieureContent";
import { DEFAULT_CITY } from "@/data/seo";

const canonical = "https://hn-renovation.fr/peinture-interieure";
const title = "Peinture intérieure à Cambrai (59) | HN Rénovation";
const description =
  "Peinture intérieure à Cambrai : préparation des murs, enduits professionnels, finitions soignées. Artisan peintre, devis gratuit.";

export default function PeintureInterieurePage() {
  return (
    <ServiceLayout title={title} description={description} canonical={canonical}>
      <PeintureInterieureContent city={DEFAULT_CITY} />
    </ServiceLayout>
  );
}
