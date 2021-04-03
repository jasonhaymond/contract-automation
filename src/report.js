const datto = require("./models/datto-rmm");
const { buildTable, buildHTML } = require("./lib/html");
const { Graph } = require("./models/graph");

const sendReport = async () => {
    const headers = [
        {
            name: "Site",
            value: "siteName",
            header: true,
        },
        {
            name: "Workstations",
            value: (site) =>
                (site.deviceCounts.desktops = site.deviceCounts.laptops),
        },
        {
            name: "Servers",
            value: (site) => site.deviceCounts.servers,
        },
    ];

    const drmmReport = await datto.getSiteDeviceCounts();
    const title = "Datto RMM Report";
    const body = buildTable({ headers, data: drmmReport, caption: title });
    const html = buildHTML({ body, title });
    Graph.sendEmail(title, process.env.EMAIL_RECIPIENT, html);
};

module.exports = {
    sendReport,
};
