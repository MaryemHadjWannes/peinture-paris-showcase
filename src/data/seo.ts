export type City = {
  slug: string;        // "cambrai-59400"
  name: string;        // "Cambrai"
  postalCode: string;  // "59400"
  department: string;  // "Nord"
  nearby?: string[];   // optional
};


export const CITIES: City[] = [
  {
    slug: "cambrai-59400",
    name: "Cambrai",
    postalCode: "59400",
    department: "Nord",
    nearby: ["Proville", "Escaudœuvres", "Neuville-Saint-Rémy", "Solesmes", "Le Cateau"],
  },
  {
    slug: "douai-59500",
    name: "Douai",
    postalCode: "59500",
    department: "Nord",
    nearby: ["Sin-le-Noble", "Waziers", "Flers-en-Escrebieux"],
  },
  {
    slug: "valenciennes-59300",
    name: "Valenciennes",
    postalCode: "59300",
    department: "Nord",
    nearby: ["Anzin", "Saint-Saulve", "Marly"],
  },
  {
    slug: "arras-62000",
    name: "Arras",
    postalCode: "62000",
    department: "Pas-de-Calais",
    nearby: ["Saint-Laurent-Blangy", "Beaurains"],
  },
  {
    slug: "caudry-59540",
    name: "Caudry",
    postalCode: "59540",
    department: "Nord",
    nearby: ["Beaumont-en-Cambrésis", "Troisvilles"],
  },
];

export const DEFAULT_CITY: City = CITIES[0];

export type Service = {
  slug: string;   // "peinture-interieure"
  label: string;  // "Peinture intérieure"
  path: string;   // "/peinture-interieure"
};

export const SERVICES: Service[] = [
  { slug: "enduit", label: "Enduit professionnel", path: "/enduit" },
  { slug: "peinture-interieure", label: "Peinture intérieure", path: "/peinture-interieure" },
  { slug: "peinture-exterieure", label: "Peinture extérieure", path: "/peinture-exterieure" },
  { slug: "platrerie", label: "Plâtrerie et finitions", path: "/platrerie" },
  { slug: "artisan-peintre", label: "Artisan peintre", path: "/artisan-peintre" },
];


export function getCityBySlug(slug?: string): City {
  if (!slug) return DEFAULT_CITY;
  return CITIES.find((c) => c.slug === slug) ?? DEFAULT_CITY;
}

export function getServiceBySlug(slug?: string): Service | undefined {
  if (!slug) return undefined;
  return SERVICES.find((s) => s.slug === slug);
}
