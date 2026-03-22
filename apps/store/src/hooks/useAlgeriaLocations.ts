// hooks/useAlgeriaLocations.ts
import { useMemo } from 'react';
import ALGERIA_DATA from '@/data/algeria-locations.json';

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
}

export const useAlgeriaLocations = (): ProcessedLocationData => {
  return useMemo(() => {
    const data = ALGERIA_DATA as LocationData[];

    // Get unique wilayas
    const wilayasSet = new Set(data.map(item => item.wilaya_name));
    const wilayas = Array.from(wilayasSet).sort();

    // Group dairas by wilaya
    const dairasByWilaya: Record<string, string[]> = {};
    data.forEach(item => {
      if (!dairasByWilaya[item.wilaya_name]) {
        dairasByWilaya[item.wilaya_name] = [];
      }
      if (!dairasByWilaya[item.wilaya_name].includes(item.daira_name)) {
        dairasByWilaya[item.wilaya_name].push(item.daira_name);
      }
    });

    // Sort dairas within each wilaya
    Object.keys(dairasByWilaya).forEach(wilaya => {
      dairasByWilaya[wilaya].sort();
    });

    // Group communes by daira
    const communesByDaira: Record<string, string[]> = {};
    data.forEach(item => {
      const key = `${item.wilaya_name}-${item.daira_name}`;
      if (!communesByDaira[key]) {
        communesByDaira[key] = [];
      }
      if (!communesByDaira[key].includes(item.commune_name)) {
        communesByDaira[key].push(item.commune_name);
      }
    });

    // Sort communes within each daira
    Object.keys(communesByDaira).forEach(key => {
      communesByDaira[key].sort();
    });

    // Helper functions for easy access
    const getAvailableDairas = (wilaya: string): string[] => {
      return dairasByWilaya[wilaya] || [];
    };

    const getAvailableCommunes = (wilaya: string, daira: string): string[] => {
      const key = `${wilaya}-${daira}`;
      return communesByDaira[key] || [];
    };

    const getLocationInfo = (commune: string): LocationData | undefined => {
      return data.find(item => item.commune_name === commune);
    };

    return {
      wilayas,
      dairasByWilaya,
      communesByDaira,
      getAvailableDairas,
      getAvailableCommunes,
      getLocationInfo,
    };
  }, []);
};