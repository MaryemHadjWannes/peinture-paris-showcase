import { CITIES, DEFAULT_CITY } from "@/data/seo";

export function getCityBySlug(slug?: string | null) {
  if (!slug) return DEFAULT_CITY;
  return CITIES.find((c) => c.slug === slug) ?? DEFAULT_CITY;
}
