const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function fetchAllIPs() {
  const response = await axios.post('http://173.212.203.145:6000/rpc', {
    jsonrpc: "2.0",
    method: "get-pods-with-stats",
    id: 1
  });

  const ips = [...new Set(response.data.result.pods.map(p => p.address.split(':')[0]))];
  return ips.filter(ip => ip !== '127.0.0.1');
}

async function fetchLocation(ip) {
  try {
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
  } catch (e) {
    // Rate limit or other error
  }
  return null;
}

async function main() {
  console.log('Fetching real IP geolocation data...\n');

  const ips = await fetchAllIPs();
  console.log(`Found ${ips.length} unique IP addresses\n`);

  const locations = {};
  let success = 0;

  for (let i = 0; i < Math.min(ips.length, 50); i++) { // Limit to 50 for now
    const ip = ips[i];
    process.stdout.write(`[${i + 1}/${Math.min(ips.length, 50)}] ${ip.padEnd(20)} `);

    const location = await fetchLocation(ip);
    if (location) {
      locations[ip] = location;
      console.log(`Success: ${location.city}, ${location.country}`);
      success++;
    } else {
      console.log('Failed');
    }

    await new Promise(r => setTimeout(r, 700)); // Rate limit
  }

  console.log(`\nSuccessfully geocoded ${success}/${Math.min(ips.length, 50)} IPs\n`);

  // Save to file
  const outputPath = path.join(__dirname, '..', 'ip-locations.json');
  fs.writeFileSync(outputPath, JSON.stringify(locations, null, 2));
  console.log(`Saved to: ${outputPath}`);
}

main().catch(console.error);
