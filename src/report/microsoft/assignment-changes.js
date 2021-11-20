const { buildTable } = require("../../lib/html");
const { Database } = require("../../models/db");

function buildSkuAssignmentChangesTable(db, start, end) {
    const headers = [
        { name: "Tenant", value: "tenantName" },
        {
            name: "Date",
            value: ({ timestamp }) => timestamp.toLocaleDateString(),
        },
        { name: "Operation", value: "operation" },
        { name: "User", value: "displayName" },
        { name: "License", value: "skuPartNumber" },
    ];

    const caption = "License Assignment Changes";
    const data = Database.getMsSkuAssignmentLogs(db, start, end);
    const table = data.length > 0 ? buildTable({ headers, data, caption }) : "";

    return table;
}

module.exports = {
    buildSkuAssignmentChangesTable,
};
