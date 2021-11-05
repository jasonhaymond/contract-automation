const { Database } = require("../../models/db");

function buildLicenseSummaryTable(db, tenantId, tenantName) {
    const summaryHeaders = [
        { name: "License", value: "" },
        { name: "Assigned Count", value: "" },
        { name: "Unassigned Count", value: "" },
        { name: "Total Count", value: "" },
    ];

    const skus = Database.getMsSkusByTenantUid;
}

module.exports = {
    buildLicenseSummaryTable,
};
