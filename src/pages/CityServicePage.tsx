// src/pages/CityServicePage.tsx
import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import ServiceLayout, { CitySeo } from "@/pages/services/ServiceLayout";
import { CITIES, SERVICES, cityPath } from "@/data/seo";
import { getServiceMeta } from "@/data/routeMeta";
import NotFound from "@/pages/NotFound";

import PeintureExterieureContent from "@/pages/services/PeintureExterieureContent";
import PeintureInterieureContent from "@/pages/services/PeintureInterieureContent";
import ArtisanPeintreContent from "./services/ArtisanPeintreContent";
import EnduitContent from "./services/EnduitContent";
import PlatrerieFinitionContent from "./services/PlatrerieFinitionContent";

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
            <Link to={cityPath(city)} className="underline hover:text-accent-strong">
              ← Retour à {city.name}
            </Link>
          </div>
        </section>
      );
  }
}

export default function CityServicePage() {
  const { citySlug, serviceSlug } = useParams<{ citySlug?: string; serviceSlug?: string }>();

  const city = useMemo<CitySeo | undefined>(() => {
    if (!citySlug) return undefined;
    return CITIES.find((c) => c.slug === citySlug) as CitySeo | undefined;
  }, [citySlug]);

  if (!city) {
    return <NotFound />;
  }

  const slug = serviceSlug ?? "";
  const meta = getServiceMeta(slug, city);
  if (!meta) {
    return <NotFound />;
  }

  return (
    <ServiceLayout meta={meta}>
      <nav aria-label="Fil d’Ariane" className="container mx-auto px-4 pt-6 text-sm">
        <Link to="/" className="underline">Accueil</Link>
        {city.slug !== CITIES[0].slug && <> / <Link to={cityPath(city)} className="underline">{city.name}</Link></>}
        <span aria-current="page"> / {SERVICES.find((service) => service.slug === slug)?.label}</span>
      </nav>
      {renderServiceContent(slug, city)}
      <section className="container mx-auto px-4 py-10 max-w-6xl">
        <h2 className="subsection-title mb-4">Autres prestations à {city.name}</h2>
        <ul className="flex flex-wrap gap-4">
          {SERVICES.filter((service) => service.slug !== slug).map((service) => (
            <li key={service.slug}><Link className="underline hover:text-accent-strong" to={`/${service.slug}/${city.slug}`}>{service.label} à {city.name}</Link></li>
          ))}
        </ul>
      </section>
      {city.nearby?.length ? (
        <section className="container mx-auto px-4 pb-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="subsection-title mb-4">Intervention autour de {city.name}</h2>
            <p className="text-muted-foreground mb-4">
              Nous intervenons également dans les communes proches : {city.nearby.join(", ")}.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {city.nearby.map((name) => (
                <div
                  key={name}
                  className="rounded-xl border border-border/60 bg-card/60 p-4 shadow-sm"
                >
                  <p className="font-semibold text-primary">{name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </ServiceLayout>
  );
}
