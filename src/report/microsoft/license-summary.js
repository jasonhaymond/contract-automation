const { buildTable } = require("../../lib/html");
const { Database } = require("../../models/db");

function buildLicenseSummaryTable(db, tenant) {
    const summaryHeaders = [
        { name: "License", value: "skuPartNumber" },
        { name: "Assigned Count", value: "assignmentCount" },
        {
            name: "Unassigned Count",
            value: ({ unitCount, assignmentCount }) =>
                unitCount - assignmentCount,
        },
        { name: "Total Count", value: "unitCount" },
    ];

    const data = Database.getMsSkuAssignmentCountsGroupedBySkuId(db, tenant.id);

    return buildTable({
        headers: summaryHeaders,
        data,
        caption: tenant.name,
    });
}

module.exports = {
    buildLicenseSummaryTable,
};
