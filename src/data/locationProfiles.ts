import rawLocations from "./locations.json";

export interface LocationProfile {
  id: string;
  name: string;
  department: string;
  region: string;
  postalCodes: string[];
  tagline: string;
  serviceRadiusKm: number;
  geo: {
    lat: number;
    lng: number;
  };
  nearby: string[];
  neighborhoods: string[];
  keywords: string[];
}

export const locationProfiles = rawLocations as LocationProfile[];

export const getLocationById = (id?: string | null) => {
  if (!id) return undefined;
  return locationProfiles.find(
    (loc) => loc.id.toLowerCase() === id.toLowerCase().trim()
  );
};
