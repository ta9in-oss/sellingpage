// hooks/useAlgeriaLocations.ts
// Lazy-loads the 1.4 MB JSON only when the component first mounts,
// keeping it out of the main JS bundle.
import { useState, useEffect, useMemo } from 'react';

// Type definitions
export interface LocationData {
  id: string;
  commune_name: string;
  daira_name: string;
  wilaya_name: string;
  commune_phone?: string;
  commune_fax?: string;
  commune_email?: string;
  commune_website?: string;
  commune_address?: string;
  commune_daira?: string;
  commune_wilaya?: string;
  daira_phone?: string;
  daira_fax?: string;
  daira_email?: string;
  daira_website?: string;
  daira_address?: string;
  daira_wilaya?: string;
  wilaya_phone?: string;
  wilaya_fax?: string;
  wilaya_email?: string;
  wilaya_website?: string;
  wilaya_address?: string;
}

export interface ProcessedLocationData {
  wilayas: string[];
  dairasByWilaya: Record<string, string[]>;
  communesByDaira: Record<string, string[]>;
  getAvailableDairas: (wilaya: string) => string[];
  getAvailableCommunes: (wilaya: string, daira: string) => string[];
  getLocationInfo: (commune: string) => LocationData | undefined;
  loading: boolean;
}

const EMPTY: ProcessedLocationData = {
  wilayas: [],
  dairasByWilaya: {},
  communesByDaira: {},
  getAvailableDairas: () => [],
  getAvailableCommunes: () => [],
  getLocationInfo: () => undefined,
  loading: true,
};

export const useAlgeriaLocations = (): ProcessedLocationData => {
  const [raw, setRaw] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('../data/algeria-locations.json').then(m => {
      setRaw(m.default as LocationData[]);
      setLoading(false);
    });
  }, []);

  return useMemo((): ProcessedLocationData => {
    if (loading || raw.length === 0) return EMPTY;

    const wilayasSet = new Set(raw.map(item => item.wilaya_name));
    const wilayas = Array.from(wilayasSet).sort();

    const dairasByWilaya: Record<string, string[]> = {};
    raw.forEach(item => {
      if (!dairasByWilaya[item.wilaya_name]) dairasByWilaya[item.wilaya_name] = [];
      if (!dairasByWilaya[item.wilaya_name].includes(item.daira_name))
        dairasByWilaya[item.wilaya_name].push(item.daira_name);
    });
    for (const w of Object.keys(dairasByWilaya)) dairasByWilaya[w].sort();

    const communesByDaira: Record<string, string[]> = {};
    raw.forEach(item => {
      const key = `${item.wilaya_name}-${item.daira_name}`;
      if (!communesByDaira[key]) communesByDaira[key] = [];
      if (!communesByDaira[key].includes(item.commune_name))
        communesByDaira[key].push(item.commune_name);
    });
    for (const k of Object.keys(communesByDaira)) communesByDaira[k].sort();

    return {
      wilayas,
      dairasByWilaya,
      communesByDaira,
      getAvailableDairas: (wilaya) => dairasByWilaya[wilaya] ?? [],
      getAvailableCommunes: (wilaya, daira) => communesByDaira[`${wilaya}-${daira}`] ?? [],
      getLocationInfo: (commune) => raw.find(item => item.commune_name === commune),
      loading: false,
    };
  }, [raw, loading]);
};