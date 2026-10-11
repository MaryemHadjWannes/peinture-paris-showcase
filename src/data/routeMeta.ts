// SEO metadata for every public route.
// Shared by the React pages (through <SeoHead>) and by server.ts, which injects
// the same tags into the initial HTML so crawlers and social networks (which do
// not run JavaScript) get a unique title, description, canonical and Open Graph
// preview for each URL. Keep imports relative: server.ts runs this file with tsx.
import { CITIES, DEFAULT_CITY, SERVICES, cityPath, type City } from "./seo";

export const SITE_URL = "https://hn-renovation.fr";
export const SITE_NAME = "HN Rénovation";

const HERO_OG_IMAGE = `${SITE_URL}/hero-1920.jpg`;
const PAINTING_OG_IMAGE = `${SITE_URL}/uploads/1759262842539-hero-painting.jpg`;

export const SERVICE_SLUGS = [
  "enduit",
  "peinture-interieure",
  "peinture-exterieure",
  "platrerie",
  "artisan-peintre",
] as const;

export type Breadcrumb = { name: string; url: string };

export type RouteMeta = {
  title: string;
  robots: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogDescription?: string;
  /** Rendered as BreadcrumbList structured data (search result breadcrumbs). */
  breadcrumbs?: Breadcrumb[];
  /** Attributes of the <link rel="preload" as="image"> the server adds for the
   *  page's largest above-the-fold image (LCP). Server-side only. */
  preloadImage?: Record<string, string>;
};

export type HeadTag = {
  tag: "meta" | "link";
  attrs: Record<string, string>;
};

// Same candidates and sizes as the <picture> in src/components/Hero.tsx, so the
// browser preloads exactly the file it will display.
const HERO_PRELOAD = {
  type: "image/webp",
  imagesrcset: "/hero-640.webp 640w, /hero-960.webp 960w, /hero-1280.webp 1280w",
  imagesizes: "100vw",
};

// First image of each service page (src/pages/services/*Content.tsx).
const SERVICE_IMAGES: Record<string, string> = {
  "peinture-exterieure": "/exterieur1.webp",
  "peinture-interieure": "/interieur3.webp",
  enduit: "/enduit2.webp",
  platrerie: "/enduit2.webp",
  "artisan-peintre": "/exterieur1.webp",
};

const INDEX = "index, follow";
const NOINDEX = "noindex, nofollow";

export const HOME_META: RouteMeta = {
  title: "HN Rénovation | Peintre à Cambrai (59) - Peinture intérieure",
  description:
    "HN Rénovation, artisan peintre à Cambrai (59) dans le Nord : peinture intérieure et extérieure, enduits, plâtrerie, façades. Devis gratuit.",
  canonical: `${SITE_URL}/`,
  robots: INDEX,
  ogImage: HERO_OG_IMAGE,
  preloadImage: HERO_PRELOAD,
};

export const REALISATIONS_META: RouteMeta = {
  title: "Réalisations peinture à Cambrai (59) | HN Rénovation",
  description:
    "Découvrez les réalisations HN Rénovation : peinture intérieure et extérieure, enduits et ravalement de façade à Cambrai (59) et dans le Nord.",
  ogDescription:
    "Sélection de chantiers : peinture intérieure/extérieure, enduits, façades. Artisan peintre à Cambrai.",
  canonical: `${SITE_URL}/realisations`,
  robots: INDEX,
  ogImage: PAINTING_OG_IMAGE,
};

export const AVIS_META: RouteMeta = {
  title: "Avis clients peintre à Cambrai (59) | HN Rénovation",
  description:
    "Avis clients de HN Rénovation, peintre à Cambrai (59) : qualité des travaux de peinture, propreté du chantier et sérieux de l’équipe.",
  ogDescription:
    "Avis clients HN Rénovation à Cambrai (59) : retours sur la qualité des travaux de peinture intérieure et extérieure.",
  canonical: `${SITE_URL}/avis`,
  robots: INDEX,
  ogImage: HERO_OG_IMAGE,
};

export const ADMIN_META: RouteMeta = {
  title: "Administration | HN Rénovation",
  robots: NOINDEX,
};

export const NOT_FOUND_META: RouteMeta = {
  title: "Page introuvable | HN Rénovation",
  robots: NOINDEX,
};

const HOME_CRUMB: Breadcrumb = { name: "Accueil", url: `${SITE_URL}/` };

export function getCityMeta(city: City): RouteMeta {
  const isHomeCity = city.slug === DEFAULT_CITY.slug;
  return {
    title: `Peintre à ${city.name} (${city.postalCode}) | HN Rénovation - peinture`,
    description: `HN Rénovation, artisan peintre à ${city.name} (${city.postalCode}) dans le ${city.department} : peinture intérieure et extérieure, enduits, plâtrerie. Devis gratuit.`,
    // The Cambrai page repeats the home page: point search engines to "/".
    canonical: `${SITE_URL}${cityPath(city)}`,
    robots: INDEX,
    ogImage: PAINTING_OG_IMAGE,
    preloadImage: HERO_PRELOAD,
    breadcrumbs: isHomeCity
      ? undefined
      : [HOME_CRUMB, { name: `Peintre à ${city.name}`, url: `${SITE_URL}/${city.slug}` }],
  };
}

export function getServiceMeta(serviceSlug: string, city: City): RouteMeta | null {
  const canonical = `${SITE_URL}/${serviceSlug}/${city.slug}`;
  const service = SERVICES.find((s) => s.slug === serviceSlug);
  const image = SERVICE_IMAGES[serviceSlug];
  const base = {
    canonical,
    robots: INDEX,
    ogImage: PAINTING_OG_IMAGE,
    preloadImage: image ? { type: "image/webp", href: image } : undefined,
    breadcrumbs: service
      ? [
          HOME_CRUMB,
          ...(city.slug === DEFAULT_CITY.slug
            ? []
            : [{ name: `Peintre à ${city.name}`, url: `${SITE_URL}/${city.slug}` }]),
          { name: `${service.label} à ${city.name}`, url: canonical },
        ]
      : undefined,
  };

  switch (serviceSlug) {
    case "peinture-exterieure":
      return {
        ...base,
        title: `Peinture extérieure à ${city.name} (${city.postalCode}) | HN Rénovation`,
        description: `Peinture extérieure à ${city.name} : façades, murs extérieurs, peintures résistantes aux intempéries. Intervention locale. Devis gratuit.`,
      };
    case "peinture-interieure":
      return {
        ...base,
        title: `Peinture intérieure à ${city.name} (${city.postalCode}) | HN Rénovation`,
        description: `Peinture intérieure à ${city.name} : murs, plafonds, préparation, finitions. Devis gratuit.`,
      };
    case "enduit":
      return {
        ...base,
        title: `Enduit professionnel à ${city.name} (${city.postalCode}) | HN Rénovation`,
        description: `Enduit professionnel à ${city.name} : ratissage, bandes, préparation des supports avant peinture et finitions lisses. Devis gratuit.`,
      };
    case "platrerie":
      return {
        ...base,
        title: `Plâtrerie et finitions à ${city.name} (${city.postalCode}) | HN Rénovation`,
        description: `Plâtrerie et finitions à ${city.name} : cloisons, plafonds, enduits et préparation avant peinture. Devis gratuit.`,
      };
    case "artisan-peintre":
      return {
        ...base,
        title: `Artisan peintre à ${city.name} (${city.postalCode}) | HN Rénovation`,
        description: `Artisan peintre à ${city.name} : peinture intérieure et extérieure, enduits, plâtrerie et finitions. Devis gratuit.`,
      };
    default:
      return null;
  }
}

/** Metadata for a URL path, or null when the route does not exist (404). */
export function getRouteMeta(pathname: string): RouteMeta | null {
  const cleanPath = pathname.replace(/\/+$/, "") || "/";
  if (cleanPath === "/") return HOME_META;
  if (cleanPath === "/realisations") return REALISATIONS_META;
  if (cleanPath === "/avis") return AVIS_META;
  if (cleanPath === "/admin" || cleanPath.startsWith("/admin/")) return ADMIN_META;

  const parts = cleanPath.split("/").filter(Boolean);
  if (parts.length === 1) {
    const city = CITIES.find((c) => c.slug === parts[0]);
    return city ? getCityMeta(city) : null;
  }
  if (parts.length === 2) {
    const city = CITIES.find((c) => c.slug === parts[1]);
    return city ? getServiceMeta(parts[0], city) : null;
  }
  return null;
}

/** BreadcrumbList JSON-LD for a route, or null. */
export function getBreadcrumbJsonLd(meta: RouteMeta): string | null {
  if (!meta.breadcrumbs?.length) return null;
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: meta.breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  });
}

/** The <meta>/<link> tags for a route (the <title> is handled separately). */
export function getHeadTags(meta: RouteMeta): HeadTag[] {
  const tags: HeadTag[] = [{ tag: "meta", attrs: { name: "robots", content: meta.robots } }];
  if (meta.canonical) {
    tags.push({ tag: "link", attrs: { rel: "canonical", href: meta.canonical } });
  }
  if (meta.description) {
    const ogDescription = meta.ogDescription ?? meta.description;
    tags.push(
      { tag: "meta", attrs: { name: "description", content: meta.description } },
      { tag: "meta", attrs: { property: "og:title", content: meta.title } },
      { tag: "meta", attrs: { property: "og:description", content: ogDescription } },
      { tag: "meta", attrs: { property: "og:type", content: "website" } },
      { tag: "meta", attrs: { property: "og:site_name", content: SITE_NAME } },
      { tag: "meta", attrs: { property: "og:locale", content: "fr_FR" } },
      { tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" } },
      { tag: "meta", attrs: { name: "twitter:title", content: meta.title } },
      { tag: "meta", attrs: { name: "twitter:description", content: ogDescription } },
    );
    if (meta.canonical) {
      tags.push({ tag: "meta", attrs: { property: "og:url", content: meta.canonical } });
    }
    if (meta.ogImage) {
      tags.push(
        { tag: "meta", attrs: { property: "og:image", content: meta.ogImage } },
        { tag: "meta", attrs: { name: "twitter:image", content: meta.ogImage } },
      );
    }
  }
  return tags;
}
