const { getDb } = require("./data/db");
const { buildTable, buildHTML } = require("./lib/html");
const { Graph } = require("./models/graph");
const { Database } = require("./models/db");

const getDeviceCountByType = (devices, type) =>
    devices.filter((device) => device.type === type).length;

const sendReport = async () => {
    const summaryHeaders = [
        {
            name: "Site",
            value: "siteName",
            header: true,
        },
        {
            name: "Workstations",
            value: (site) =>
                site.deviceCounts.desktops + site.deviceCounts.laptops,
        },
        {
            name: "Servers",
            value: (site) => site.deviceCounts.servers,
        },
    ];

    const changeHeaders = [
        { name: "Site", value: "siteName" },
        {
            name: "Date",
            value: ({ timestamp }) => timestamp.toLocaleDateString(),
        },
        { name: "Operation", value: "operation" },
        { name: "Hostname", value: "hostname" },
    ];

    const db = getDb();
    const sites = Database.getDattoRmmSites(db);
    const devices = Database.getDattoRmmDevices(db);
    const changes = Database.runReport(db);
    const drmmReport = sites.map((site) => {
        const siteDevices = devices.filter(
            (device) => device.siteId === site.id
        );

        return {
            siteName: site.name.trim(),
            deviceCounts: {
                desktops: getDeviceCountByType(siteDevices, "desktop"),
                laptops: getDeviceCountByType(siteDevices, "laptop"),
                servers: getDeviceCountByType(siteDevices, "server"),
            },
        };
    });

    const title = "Datto RMM Report";
    const summaryTable = buildTable({
        headers: summaryHeaders,
        data: drmmReport,
        caption: "Summary",
    });
    const changesTable = buildTable({
        headers: changeHeaders,
        data: changes,
        caption: "Changes",
    });

    const html = buildHTML({ body: summaryTable + changesTable, title });
    Graph.sendEmail(title, process.env.EMAIL_RECIPIENT, html);
};

module.exports = {
    sendReport,
};
