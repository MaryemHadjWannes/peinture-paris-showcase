// src/pages/PeintureExterieurePage.tsx
import React from "react";
import ServiceLayout from "@/pages/services/ServiceLayout";
import PeintureExterieureContent from "@/pages/services/PeintureExterieureContent";
import { DEFAULT_CITY } from "@/data/seo";

const canonical = "https://hn-renovation.fr/peinture-exterieure";
const title = "Peinture extérieure à Cambrai (59) | HN Rénovation";
const description =
  "Peinture extérieure à Cambrai : façades, murs extérieurs, traitement anti-humidité, finitions durables. Devis gratuit.";

export default function PeintureExterieurePage() {
  return (
    <ServiceLayout title={title} description={description} canonical={canonical}>
      <PeintureExterieureContent city={DEFAULT_CITY} />
    </ServiceLayout>
  );
}
