// src/pages/RenovationInterieurePage.tsx
import React from "react";
import ServiceLayout from "@/pages/services/ServiceLayout";
import RenovationInterieureContent from "@/pages/services/RenovationInterieureContent";
import { DEFAULT_CITY } from "@/data/seo";

const canonical = "https://hn-renovation.fr/renovation-interieure";
const title = "Rénovation intérieure à Cambrai (59) | HN Rénovation";
const description =
  "Rénovation intérieure à Cambrai : enduits, plâtrerie, finitions soignées pour maisons et appartements. Devis gratuit.";

export default function RenovationInterieurePage() {
  return (
    <ServiceLayout title={title} description={description} canonical={canonical}>
      <RenovationInterieureContent city={DEFAULT_CITY} />
    </ServiceLayout>
  );
}
