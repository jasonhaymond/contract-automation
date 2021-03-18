const datto = require('./datto-rmm.js');
const { buildTable, buildHTML } = require('./html.js');
const { GraphClient } = require('./microsoft-graph.js');

(async () => {
    const headers = [
        { name: 'Site', value: 'siteName', header: true },
        { name: 'Workstations', value: site => site.deviceCounts.desktops + site.deviceCounts.laptops },
        { name: 'Servers', value: site => site.deviceCounts.servers },
    ];
    const drmmReport = await datto.getSiteDeviceCounts();
    const title = 'Datto RMM Report';
    const body = buildTable({ headers, data: drmmReport, caption: title });
    const html = buildHTML({ body, title });

    const client = new GraphClient();
    client.sendEmail('Datto RMM Report', process.env.EMAIL_RECIPIENT, html);
})();
