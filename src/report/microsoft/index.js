const { getDb } = require("../../data/db");
const { buildHTML } = require("../../lib/html");
const { Database } = require("../../models/db");
const { Graph } = require("../../models/graph");
const { buildUserDetailTable } = require("./userDetail");
const { buildUserSummaryTable } = require("./userSummary");

async function sendMicrosoftReport(start, end, reportMonthYear) {
    const title = `Microsoft 365 Report — ${reportMonthYear}`;
    const db = getDb();

    const summaryTable = buildUserSummaryTable(db, start, end, reportMonthYear);

    const tenants = Database.getMsTenants(db);
    const detailTables = tenants.reduce(
        (acc, { id, name }) => acc + buildUserDetailTable(db, id, name),
        ""
    );

    const html = buildHTML({ body: summaryTable + detailTables, title });
    const recipients = process.env.EMAIL_RECIPIENTS.split(",");
    await Graph.sendEmail(title, recipients, html);
}

module.exports = {
    sendMicrosoftReport,
};
