// src/pages/CityServicePage.tsx
import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import ServiceLayout, { CitySeo } from "@/pages/services/ServiceLayout";
import { CITIES } from "@/data/seo";

import PeintureExterieureContent from "@/pages/services/PeintureExterieureContent";
import PeintureInterieureContent from "@/pages/services/PeintureInterieureContent";
import RavalementFacadeContent from "@/pages/services/RavalementFacadeContent";
import RenovationInterieureContent from "@/pages/services/RenovationInterieureContent";
import ArtisanPeintreContent from "./services/ArtisanPeintreContent";

const DEFAULT_CITY: CitySeo = {
  slug: "cambrai-59400",
  name: "Cambrai",
  postalCode: "59400",
  department: "Nord",
};

type ServiceMeta = {
  canonical: string;
  title: string;
  description: string;
};

function getServiceMeta(serviceSlug: string, city: CitySeo): ServiceMeta {
  const base = "https://hn-renovation.fr";
  const canonical = `${base}/ville/${city.slug}/${serviceSlug}`;

  switch (serviceSlug) {
    case "peinture-exterieure":
      return {
        canonical,
        title: `Peinture extérieure à ${city.name} (${city.postalCode}) | HN Rénovation`,
        description: `Peinture extérieure à ${city.name} : façades, murs extérieurs, peintures résistantes aux intempéries. Intervention locale. Devis gratuit.`,
      };

    // À ajouter ensuite
    case "peinture-interieure":
      return {
        canonical,
        title: `Peinture intérieure à ${city.name} (${city.postalCode}) | HN Rénovation`,
        description: `Peinture intérieure à ${city.name} : murs, plafonds, préparation, finitions. Devis gratuit.`,
      };

    case "ravalement-facade":
      return {
        canonical,
        title: `Ravalement de façade à ${city.name} (${city.postalCode}) | HN Rénovation`,
        description: `Ravalement de façade à ${city.name} : nettoyage, traitement anti-mousse, réparation fissures. Devis gratuit.`,
      };

    case "renovation-interieure":
      return {
        canonical,
        title: `Rénovation intérieure à ${city.name} (${city.postalCode}) | HN Rénovation`,
        description: `Rénovation intérieure à ${city.name} : enduits, plâtrerie, finitions. Devis gratuit.`,
      };

    case "artisan-peintre-cambrai":
      return {
        canonical,
        title: `Artisan peintre à ${city.name} (${city.postalCode}) | HN Rénovation`,
        description: `Artisan peintre à ${city.name} : peinture intérieure, extérieure, rénovation, façade. Devis gratuit.`,
      };

    default:
      return {
        canonical,
        title: `Artisan Peintre à ${city.name} (${city.postalCode}) | HN Rénovation`,
        description: `HN Rénovation intervient à ${city.name} (${city.postalCode}). Devis gratuit.`,
      };
  }
}

function renderServiceContent(serviceSlug: string, city: CitySeo) {
  switch (serviceSlug) {
    case "peinture-exterieure":
      return <PeintureExterieureContent city={city} />;
    case "peinture-interieure":
      return <PeintureInterieureContent city={city} />;
    case "ravalement-facade":
      return <RavalementFacadeContent city={city} />;
    case "renovation-interieure":
      return <RenovationInterieureContent city={city} />;
    case "artisan-peintre":
      return <ArtisanPeintreContent city={city} />;
    default:
      return (
        <section className="container mx-auto px-4 py-10 max-w-5xl">
          <h1 className="text-2xl font-bold">Page service introuvable</h1>
          <p className="mt-2 text-muted-foreground">
            Ce service n’est pas encore disponible pour cette ville.
          </p>
          <div className="mt-6">
            <Link to={`/ville/${city.slug}`} className="underline hover:text-accent">
              ← Retour à {city.name}
            </Link>
          </div>
        </section>
      );
  }
}

export default function CityServicePage() {
  const { citySlug, serviceSlug } = useParams<{ citySlug?: string; serviceSlug?: string }>();

  const city: CitySeo = useMemo(() => {
    if (!citySlug) return DEFAULT_CITY;
    const found = CITIES.find((c) => c.slug === citySlug);
    return (found as CitySeo) ?? DEFAULT_CITY;
  }, [citySlug]);

  const slug = serviceSlug ?? "";
  const meta = getServiceMeta(slug, city);

  return (
    <ServiceLayout title={meta.title} description={meta.description} canonical={meta.canonical}>
      {renderServiceContent(slug, city)}
    </ServiceLayout>
  );
}
