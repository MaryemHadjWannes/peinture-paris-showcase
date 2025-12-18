// src/pages/RavalementFacadePage.tsx
import React from "react";
import ServiceLayout from "@/pages/services/ServiceLayout";
import RavalementFacadeContent from "@/pages/services/RavalementFacadeContent";
import { DEFAULT_CITY } from "@/data/seo";

const canonical = "https://hn-renovation.fr/ravalement-facade";
const title = "Ravalement de façade à Cambrai (59) | HN Rénovation";
const description =
  "Ravalement de façade à Cambrai : nettoyage, traitement anti-mousse, réparation des fissures, protection durable. Devis gratuit.";

export default function RavalementFacadePage() {
  return (
    <ServiceLayout title={title} description={description} canonical={canonical}>
      <RavalementFacadeContent city={DEFAULT_CITY} />
    </ServiceLayout>
  );
}
