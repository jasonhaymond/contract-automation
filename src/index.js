require('dotenv').config();
const datto = require('./reports/datto-rmm.js');
const { buildTable } = require('./html.js');

(async () => {
    const headers = [
        { name: 'Site Name', value: 'siteName' },
        { name: 'Desktop Count', value: site => site.deviceCounts.desktops },
        { name: 'Laptop Count', value: site => site.deviceCounts.laptops },
        { name: 'Server Count', value: site => site.deviceCounts.servers },
    ]
    const drmmReport = await datto.getSiteDeviceCounts();
    const table = buildTable(headers, drmmReport.slice(1, 3));
    console.log(table);
})();
