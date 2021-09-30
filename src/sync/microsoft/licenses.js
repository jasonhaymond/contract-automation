const { unidirectionalArrayDiff } = require("../../lib/diff");
const { Database } = require("../../models/db");

async function syncUserLicenseAssignments(db, user) {
    const sourceAssignments = Database.getMsSkuAssignmentsByUserUid(
        db,
        user.uid
    ).map((assignment) => ({
        userUid: user.uid,
        skuId: assignment.sku.skuId,
        ...assignment,
    }));

    const updatedAssignments = user.assignedLicenses.map(({ skuId }) => ({
        userUid: user.uid,
        skuId,
    }));

    const { newValues, removedValues } = unidirectionalArrayDiff(
        sourceAssignments,
        updatedAssignments,
        "skuId"
    );

    newValues.forEach((assignment) => {
        Database.createMsSkuAssignment(db, assignment);
    });

    removedValues.forEach((assignment) => {
        Database.deleteMsSkuAssignment(db, assignment);
    });
}

module.exports = {
    syncUserLicenseAssignments,
};
