// src/pages/CityServicePage.tsx
import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import ServiceLayout, { CitySeo } from "@/pages/services/ServiceLayout";
import { CITIES } from "@/data/seo";
import NotFound from "@/pages/NotFound";

import PeintureExterieureContent from "@/pages/services/PeintureExterieureContent";
import PeintureInterieureContent from "@/pages/services/PeintureInterieureContent";
import ArtisanPeintreContent from "./services/ArtisanPeintreContent";
import EnduitContent from "./services/EnduitContent";
import PlatrerieFinitionContent from "./services/PlatrerieFinitionContent";

type ServiceMeta = {
  canonical: string;
  title: string;
  description: string;
};

function getServiceMeta(serviceSlug: string, city: CitySeo): ServiceMeta {
  const base = "https://hn-renovation.fr";
  const canonical = serviceSlug ? `${base}/${serviceSlug}/${city.slug}` : `${base}/${city.slug}`;

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
    
    case "enduit":
      return {
        canonical,
        title: `Enduit professionnel à ${city.name} (${city.postalCode}) | HN Rénovation`,
        description: `Enduit professionnel à ${city.name} : ratissage, bandes, préparation des supports avant peinture et finitions lisses. Devis gratuit.`,
      };

    case "platrerie":
      return {
        canonical,
        title: `Plâtrerie et finitions à ${city.name} (${city.postalCode}) | HN Rénovation`,
        description: `Plâtrerie et finitions à ${city.name} : cloisons, plafonds, enduits et préparation avant peinture. Devis gratuit.`,
      };

    case "artisan-peintre":
      return {
        canonical,
        title: `Artisan peintre à ${city.name} (${city.postalCode}) | HN Rénovation`,
        description: `Artisan peintre à ${city.name} : peinture intérieure et extérieure, enduits, plâtrerie et finitions. Devis gratuit.`,
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
    case "enduit":
      return <EnduitContent city={city} />;
    case "platrerie":
      return <PlatrerieFinitionContent city={city} />;
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
            <Link to={`/${city.slug}`} className="underline hover:text-accent">
              ← Retour à {city.name}
            </Link>
          </div>
        </section>
      );
  }
}

export default function CityServicePage() {
  const { citySlug, serviceSlug } = useParams<{ citySlug?: string; serviceSlug?: string }>();
  const knownServiceSlugs = new Set([
    "enduit",
    "peinture-exterieure",
    "peinture-interieure",
    "platrerie",
    "artisan-peintre",
  ]);

  const city = useMemo<CitySeo | undefined>(() => {
    if (!citySlug) return undefined;
    return CITIES.find((c) => c.slug === citySlug) as CitySeo | undefined;
  }, [citySlug]);

  if (!city) {
    return <NotFound />;
  }

  const slug = serviceSlug ?? "";
  if (!knownServiceSlugs.has(slug)) {
    return <NotFound />;
  }
  const meta = getServiceMeta(slug, city);
  const noindex = !knownServiceSlugs.has(slug);

  return (
    <ServiceLayout title={meta.title} description={meta.description} canonical={meta.canonical} noindex={noindex}>
      {renderServiceContent(slug, city)}
    </ServiceLayout>
  );
}
