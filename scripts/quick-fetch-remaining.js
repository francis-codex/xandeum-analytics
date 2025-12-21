const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function main() {
  // Load existing locations
  const existingPath = path.join(__dirname, '..', 'ip-locations.json');
  let existingLocations = {};
  try {
    existingLocations = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
  } catch (e) {}

  // Read all IPs
  const allIPsPath = path.join(__dirname, '..', 'all-ips.txt');
  const allIPs = fs.readFileSync(allIPsPath, 'utf8').split('\n').filter(Boolean);

  // Find missing IPs
  const missingIPs = allIPs.filter(ip => !existingLocations[ip]);
  console.log(`Missing ${missingIPs.length} IPs, fetching with batch API...`);

  // Use ip-api.com batch endpoint (100 IPs per request, free tier)
  const batchSize = 100;
  let fetched = 0;

  for (let i = 0; i < missingIPs.length; i += batchSize) {
    const batch = missingIPs.slice(i, Math.min(i + batchSize, missingIPs.length));

    try {
      console.log(`\nFetching batch ${Math.floor(i/batchSize) + 1}...`);
      const response = await axios.post('http://ip-api.com/batch?fields=status,country,countryCode,region,city,lat,lon',
        batch.map(ip => ({ query: ip })),
        { timeout: 15000 }
      );

      response.data.forEach((data, idx) => {
        const ip = batch[idx];
        if (data.status === 'success' && data.city) {
          existingLocations[ip] = {
            country: data.country,
            countryCode: data.countryCode,
            city: data.city,
            region: data.region || data.city,
            lat: parseFloat(data.lat) || 0,
            lng: parseFloat(data.lon) || 0
          };
          console.log(`  Success: ${ip} = ${data.city}, ${data.country}`);
          fetched++;
        } else {
          console.log(`  Failed: ${ip}`);
        }
      });

      // Save after each batch
      fs.writeFileSync(existingPath, JSON.stringify(existingLocations, null, 2));
      console.log(`Saved ${Object.keys(existingLocations).length} total locations`);

      // Rate limit: wait 60s between batches (free tier limit)
      if (i + batchSize < missingIPs.length) {
        console.log('Waiting 60s for rate limit...');
        await new Promise(r => setTimeout(r, 60000));
      }
    } catch (error) {
      console.error(`Batch failed:`, error.message);
    }
  }

  console.log(`\nFetched ${fetched} new locations`);
  console.log(`Total: ${Object.keys(existingLocations).length} locations`);
}

main().catch(console.error);
