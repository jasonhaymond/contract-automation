const datto = require('./reports/datto-rmm.js');
const { buildTable, buildHTML } = require('./html.js');
const { GraphClient } = require('./graph.js');

(async () => {
    const headers = [
        { name: 'Site Name', value: 'siteName', header: true },
        { name: 'Desktop Count', value: site => site.deviceCounts.desktops },
        { name: 'Laptop Count', value: site => site.deviceCounts.laptops },
        { name: 'Server Count', value: site => site.deviceCounts.servers },
    ]
    const drmmReport = await datto.getSiteDeviceCounts();
    const title = 'Datto RMM Report';
    const body = buildTable({ headers, data: drmmReport, caption: title });
    const html = buildHTML({ body, title });

    const client = new GraphClient();
    client.sendEmail('Datto RMM Report', process.env.EMAIL_RECIPIENT, html);
})();
