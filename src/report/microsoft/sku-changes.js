const { buildTable } = require("../../lib/html");
const { Database } = require("../../models/db");

function buildSkuChangesTable(db, start, end) {
    const headers = [
        { name: "Tenant", value: "tenantName" },
        {
            name: "Date",
            value: ({ timestamp }) => timestamp.toLocaleDateString(),
        },
        { name: "Operation", value: "operation" },
        { name: "License", value: "skuPartNumber" },
        { name: "Count", value: "unitCount" },
    ];

    const caption = "License Changes";
    const data = Database.getMsSkuLogs(db, start, end);
    const table = data.length > 0 ? buildTable({ headers, data, caption }) : "";

    return table;
}

module.exports = {
    buildSkuChangesTable,
};
