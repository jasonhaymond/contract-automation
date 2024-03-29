const { getDb } = require("../data/db");
const { buildTable, buildHTML } = require("../lib/html");
const { Graph } = require("../models/graph");
const { Database } = require("../models/db");

const getDeviceCountByType = (devices, type) =>
    devices.filter((device) => device.type === type).length;

async function sendDattoRmmReport(start, end, reportMonthYear) {
    const summaryHeaders = [
        {
            name: "Site",
            value: "siteName",
            header: true,
        },
        {
            name: "Workstations",
            value: ({ deviceCounts: { desktops, laptops } }) =>
                desktops + laptops,
        },
        {
            name: "Servers",
            value: (site) => site.deviceCounts.servers,
        },
        {
            name: "Total",
            header: true,
            value: ({ deviceCounts: { desktops, laptops, servers } }) =>
                servers + desktops + laptops,
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

    const title = `Datto RMM Report — ${reportMonthYear}`;
    const summaryTable = buildTable({
        headers: summaryHeaders,
        data: drmmReport,
        caption: "Summary",
    });

    const changes = Database.getDattoRmmLogs(db, start, end);
    const changesTable =
        changes.length > 0
            ? buildTable({
                  headers: changeHeaders,
                  data: changes,
                  caption: "Changes",
              })
            : "";

    const html = buildHTML({ body: summaryTable + changesTable, title });
    const recipients = process.env.EMAIL_RECIPIENTS.split(",");
    await Graph.sendEmail(title, recipients, html);
}

module.exports = {
    sendDattoRmmReport,
};
