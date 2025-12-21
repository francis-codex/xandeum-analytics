const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Load existing locations
const existingPath = path.join(__dirname, '..', 'ip-locations.json');
let existingLocations = {};
try {
  existingLocations = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
} catch (e) {
  // No existing file
}

async function fetchAllIPs() {
  const response = await axios.post('http://173.212.203.145:6000/rpc', {
    jsonrpc: "2.0",
    method: "get-pods-with-stats",
    id: 1
  });

  const ips = [...new Set(response.data.result.pods.map(p => p.address.split(':')[0]))];
  return ips.filter(ip => ip !== '127.0.0.1' && !ip.startsWith('192.168.') && !ip.startsWith('10.'));
}

// Multiple API sources to avoid rate limits
const APIs = [
  {
    name: 'ip-api.com',
    fetch: async (ip) => {
      const res = await axios.get(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,city,lat,lon`, { timeout: 5000 });
      const data = res.data;
      if (data.status === 'success' && data.city) {
        return {
          country: data.country,
          countryCode: data.countryCode,
          city: data.city,
          region: data.region || data.city,
          lat: parseFloat(data.lat) || 0,
          lng: parseFloat(data.lon) || 0
        };
      }
      return null;
    },
    delay: 4100 // ~15 requests per minute = 4s delay
  },
  {
    name: 'ipapi.co',
    fetch: async (ip) => {
      const res = await axios.get(`https://ipapi.co/${ip}/json/`, { timeout: 5000 });
      const data = res.data;
      if (data.city && data.country_name && !data.error) {
        return {
          country: data.country_name,
          countryCode: data.country_code || 'XX',
          city: data.city,
          region: data.region || data.city,
          lat: parseFloat(data.latitude) || 0,
          lng: parseFloat(data.longitude) || 0
        };
      }
      return null;
    },
    delay: 1000
  },
  {
    name: 'ipwhois.app',
    fetch: async (ip) => {
      const res = await axios.get(`http://ipwhois.app/json/${ip}`, { timeout: 5000 });
      const data = res.data;
      if (data.success && data.city) {
        return {
          country: data.country,
          countryCode: data.country_code,
          city: data.city,
          region: data.region || data.city,
          lat: parseFloat(data.latitude) || 0,
          lng: parseFloat(data.longitude) || 0
        };
      }
      return null;
    },
    delay: 100
  }
];

async function fetchLocation(ip, apiIndex = 0) {
  const api = APIs[apiIndex];
  try {
    const location = await api.fetch(ip);
    if (location) {
      return { location, api: api.name };
    }
  } catch (e) {
    // Try next API if available
    if (apiIndex < APIs.length - 1) {
      await new Promise(r => setTimeout(r, 500));
      return fetchLocation(ip, apiIndex + 1);
    }
  }
  return { location: null, api: null };
}

async function main() {
  console.log('Fetching real IP geolocation data for ALL nodes...\n');

  const allIPs = await fetchAllIPs();
  console.log(`Found ${allIPs.length} unique IP addresses\n`);

  // Filter out IPs we already have
  const newIPs = allIPs.filter(ip => !existingLocations[ip]);
  console.log(`Already have ${allIPs.length - newIPs.length} locations cached`);
  console.log(`Need to fetch ${newIPs.length} new locations\n`);

  const locations = { ...existingLocations };
  let success = 0;
  let failed = 0;
  let currentAPI = 0;

  for (let i = 0; i < newIPs.length; i++) {
    const ip = newIPs[i];
    process.stdout.write(`[${i + 1}/${newIPs.length}] ${ip.padEnd(20)} `);

    const { location, api } = await fetchLocation(ip, currentAPI);

    if (location) {
      locations[ip] = location;
      console.log(`Success: ${location.city}, ${location.country} (via ${api})`);
      success++;

      // Save incrementally every 10 successful fetches
      if (success % 10 === 0) {
        fs.writeFileSync(existingPath, JSON.stringify(locations, null, 2));
        console.log(`   Progress saved (${success} total)`);
      }
    } else {
      console.log('Failed (all APIs)');
      failed++;
    }

    // Rotate APIs and add delay
    const delay = APIs[currentAPI].delay;
    await new Promise(r => setTimeout(r, delay));

    // Switch to next API every 10 requests to distribute load
    if ((i + 1) % 10 === 0) {
      currentAPI = (currentAPI + 1) % APIs.length;
    }
  }

  console.log(`\nResults:`);
  console.log(`   Successfully geocoded: ${success} new IPs`);
  console.log(`   Total locations: ${Object.keys(locations).length}`);
  console.log(`   Failed: ${failed} IPs`);
  console.log(`   Success rate: ${((success / (success + failed)) * 100).toFixed(1)}%\n`);

  // Final save
  fs.writeFileSync(existingPath, JSON.stringify(locations, null, 2));
  console.log(`Final data saved to: ${existingPath}`);
}

main().catch(console.error);
