const { buildTable } = require("../../lib/html");
const { Database } = require("../../models/db");

function buildUserDetailTable(db, tenant) {
    const summaryHeaders = [
        { name: "User", value: "userDisplayName" },
        { name: "Assigned Licenses", value: "licenses" },
    ];

    const { id, name } = tenant;

    const assignments = Database.getMsSkuAssignmentsByTenantId(db, id);
    const userIds = [...new Set(assignments.map((asn) => asn.userId))];
    const data = userIds.map((id) => {
        const filteredAssignments = assignments.filter(
            (asn) => asn.userId === id
        );

        const userDisplayName = filteredAssignments[0].userDisplayName;
        const licenses = filteredAssignments
            .map((asn) => asn.skuPartNumber)
            .join("<br>");

        return {
            userDisplayName,
            licenses,
        };
    });

    return buildTable({
        headers: summaryHeaders,
        data,
        caption: name,
    });
}

module.exports = {
    buildUserDetailTable,
};
