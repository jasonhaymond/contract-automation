const { getDb } = require("../../data/db");
const { buildHTML } = require("../../lib/html");
const { Database } = require("../../models/db");
const { Graph } = require("../../models/graph");
const { buildSkuAssignmentChangesTable } = require("./assignment-changes");
const { buildLicenseSummaryTable } = require("./license-summary");
const { buildSkuChangesTable } = require("./sku-changes");
const { buildUserDetailTable } = require("./user-detail");
const { buildUserSummaryTable } = require("./user-summary");

async function sendMicrosoftReport(start, end, reportMonthYear) {
    const title = `Microsoft 365 Report — ${reportMonthYear}`;
    const db = getDb();

    const userSummaryTable = buildUserSummaryTable(db);

    const tenants = Database.getMsTenants(db);

    const licenseSummaryTable = tenants.reduce(
        (acc, tenant) => acc + buildLicenseSummaryTable(db, tenant),
        ""
    );

    const detailTables = tenants.reduce(
        (acc, tenant) => acc + buildUserDetailTable(db, tenant),
        ""
    );

    const skuChangesTable = buildSkuChangesTable(db, start, end);
    const skuAssignmentChangesTable = buildSkuAssignmentChangesTable(
        db,
        start,
        end
    );

    const html = buildHTML({
        body:
            userSummaryTable +
            licenseSummaryTable +
            detailTables +
            skuChangesTable +
            skuAssignmentChangesTable,
        title,
    });
    const recipients = process.env.EMAIL_RECIPIENTS.split(",");
    await Graph.sendEmail(title, recipients, html);
}

module.exports = {
    sendMicrosoftReport,
};
