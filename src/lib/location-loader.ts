/**
 * Server-side location data loader
 * Loads real IP geolocation data from ip-locations.json
 */

import fs from 'fs';
import path from 'path';

type LocationData = {
  country: string;
  countryCode: string;
  city: string;
  region: string;
  lat: number;
  lng: number;
};

let cachedLocations: Record<string, LocationData> | null = null;

/**
 * Load real IP locations (server-side only)
 */
export function loadRealIPLocations(): Record<string, LocationData> {
  // Return cached if available
  if (cachedLocations) {
    return cachedLocations;
  }

  try {
    const locationsPath = path.join(process.cwd(), 'ip-locations.json');
    if (fs.existsSync(locationsPath)) {
      const locationsData = fs.readFileSync(locationsPath, 'utf8');
      const locations: Record<string, LocationData> = JSON.parse(locationsData);
      cachedLocations = locations;
      console.log(`Loaded ${Object.keys(locations).length} real IP locations`);
      return locations;
    }
  } catch (error) {
    console.warn('Could not load ip-locations.json, using fallback locations');
  }

  const emptyLocations: Record<string, LocationData> = {};
  cachedLocations = emptyLocations;
  return emptyLocations;
}
