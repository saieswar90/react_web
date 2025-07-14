const mdns = require('multicast-dns')();
const { promisify } = require('util');
const sleep = promisify(setTimeout);

const discoveredDevices = new Map(); // Map to store devices, keyed by service instance name
const discoveredServiceTypes = new Set(); // Keep track of queried service types

// Function to start mDNS discovery
const startDiscovery = () => {
    discoveredDevices.clear();
    discoveredServiceTypes.clear();

    // Listen for responses
    mdns.on('response', (response) => {
        // console.log(JSON.stringify(response, null, 2)); // Keep logging for now if needed for debugging

        // Process answers and additional records together for better association
        [...response.answers, ...response.additionals].forEach((record) => {
            const recordName = record.name;
            const recordType = record.type;
            const recordData = record.data;

            // Ensure a base entry exists for this record name if it's a service instance or hostname
            if (!discoveredDevices.has(recordName)) {
                 discoveredDevices.set(recordName, {
                     name: recordName.replace(/\\.(local|udp|tcp)$/, ''), // Start with cleaned name
                     ip: null,
                     service: 'Unknown',
                     port: null,
                     rawName: recordName // Keep the raw name for potential future use/debugging
                 });
            }

            const device = discoveredDevices.get(recordName);

            if (recordType === 'PTR') {
                // If this PTR points to a service instance, ensure that instance has an entry too
                 const instanceName = recordData;
                 if (!discoveredDevices.has(instanceName)) {
                      discoveredDevices.set(instanceName, {
                         name: instanceName.replace(/\\.(local|udp|tcp)$/, ''),
                         ip: null,
                         service: recordName.replace(/\\.(local|udp)$/, ''), // The service type is the PTR name
                         port: null,
                         rawName: instanceName
                      });
                 } else {
                      // Update service type if the instance already exists
                      const instanceDevice = discoveredDevices.get(instanceName);
                      instanceDevice.service = recordName.replace(/\\.(local|udp)$/, '');
                      discoveredDevices.set(instanceName, instanceDevice);
                 }

                // Query for details of the discovered service instance
                 mdns.query(instanceName, 'A');
                 mdns.query(instanceName, 'SRV');
                 mdns.query(instanceName, 'TXT');

            } else if (recordType === 'A') {
                // IP Address record
                 device.ip = recordData;

            } else if (recordType === 'SRV') {
                // Service location record (contains port and target host)
                 device.port = recordData.port;
                 // The service type is often embedded in the SRV name, not data
                 // We try to get the service type from the associated PTR or SRV name itself
                 // This is handled when the device entry is initially created/updated by PTR/SRV name

                 // Optional: query the SRV target host for its IP (A record)
                 // mdns.query(recordData.target, 'A');

            } else if (recordType === 'TXT') {
                // Text record (often contains key-value pairs or JSON)
                 const txtData = recordData.toString();
                 device.txt = txtData; // Store raw TXT data

                 // Attempt to parse TXT data as JSON
                 try {
                     const txtObject = JSON.parse(txtData);
                     if (txtObject.nm) { // Extract name from JSON
                         // Update the device name using the 'nm' field
                         // This might require updating the key in the map, which is tricky.
                         // For now, update the 'name' property, but the map key remains the instance name.
                         device.name = txtObject.nm;
                     }
                     if (txtObject.ip) { // Extract partial IP from JSON (assuming 192.168.1.x)
                          device.ip = `192.168.1.${txtObject.ip}`;
                     }
                     // Add other relevant fields from JSON if needed (e.g., 'id', 'as')
                     device.jsonFields = txtObject; // Store parsed JSON fields

                 } catch (e) {
                     // Not JSON, just keep the raw TXT data
                     // console.log(`TXT data for ${recordName} is not JSON:`, txtData);
                 }
            }

            // Update the device in the map
            discoveredDevices.set(recordName, device);
             // If a device name was extracted from TXT, ensure an entry for that name also exists and links back?
             // This can get complex with multiple names. Sticking to service instance name as key is safer for now.

        });
    });

    // Start by querying for all service types
    mdns.query('_services._dns-sd._udp.local', 'PTR');

    // Also query for some common service types directly as a fallback/quick win
     const commonServices = ['_http._tcp.local', '_workstation._tcp.local', '_mi-connect._udp.local'];
     commonServices.forEach(service => {
         mdns.query(service, 'PTR');
     });
};

// Function to stop discovery
const stopDiscovery = () => {
    mdns.removeAllListeners('response');
    discoveredServiceTypes.clear();
};

// Controller function for the /discover endpoint
const discoverDevices = async (req, res) => {
    try {
        // Ensure listeners are removed before starting a new scan
        stopDiscovery();
        startDiscovery();

        // Wait for 5 seconds to collect responses
        await sleep(5000);

        // Stop discovery
        stopDiscovery();

        // Convert Map to array and format the response
        // Filter out entries that are just service types themselves
        const devices = Array.from(discoveredDevices.values())
            .filter(device =>
                 device.ip || device.port // Only include entries that have an IP or Port (likely devices)
            )
            .map(device => ({
                // Prioritize name from parsed JSON (txt.nm) if available, otherwise use the cleaned name
                name: device.jsonFields?.nm || device.name,
                ip: device.ip || 'N/A', // Ensure IP is reported (now hopefully populated from A or TXT)
                service: device.service || 'Unknown',
                port: device.port || null
            }));

        res.json({
            success: true,
            devices: devices
        });
    } catch (error) {
        console.error('mDNS discovery error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to discover devices'
        });
    }
};

module.exports = {
    discoverDevices
}; 