const { buildTable } = require("../../lib/html");
const { Database } = require("../../models/db");

function buildUserSummaryTable(db) {
    const summaryHeaders = [
        { name: "Tenant", value: "tenantName" },
        { name: "Users", value: "userCount" },
    ];

    const data = Database.getMsUserCountGroupedByTenant(db);

    return buildTable({
        headers: summaryHeaders,
        data,
        caption: "User Summary",
    });
}

module.exports = {
    buildUserSummaryTable,
};
