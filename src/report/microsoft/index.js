const { getDb } = require("../../data/db");
const { buildHTML } = require("../../lib/html");
const { Database } = require("../../models/db");
const { Graph } = require("../../models/graph");
const { buildUserDetailTable } = require("./user-detail");
const { buildUserSummaryTable } = require("./user-summary");

async function sendMicrosoftReport(start, end, reportMonthYear) {
    const title = `Microsoft 365 Report — ${reportMonthYear}`;
    const db = getDb();

    const summaryTable = buildUserSummaryTable(db, start, end, reportMonthYear);

    const tenants = Database.getMsTenants(db);
    const detailTables = tenants.reduce(
        (acc, tenant) => acc + buildUserDetailTable(db, tenant),
        ""
    );

    const html = buildHTML({ body: summaryTable + detailTables, title });
    const recipients = process.env.EMAIL_RECIPIENTS.split(",");
    await Graph.sendEmail(title, recipients, html);
}

module.exports = {
    sendMicrosoftReport,
};
