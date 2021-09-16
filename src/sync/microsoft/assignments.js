const { unidirectionalArrayDiff } = require("../../lib/diff");
const { Database } = require("../../models/db");

async function syncSkuAssignments(db, user) {
    const sourceAssignments = Database.getMsSkuAssignmentsByUserUid(
        db,
        user.uid
    ).map((assignment) => ({ skuId: assignment.sku.skuId }));

    const updatedAssignments = user.assignedLicenses.map((lic) => ({
        skuId: lic.skuId,
    }));

    const { newValues, removedValues } = unidirectionalArrayDiff(
        sourceAssignments,
        updatedAssignments,
        "skuId"
    );

    newValues.forEach((assignment) => {
        Database.createMsSkuAssignment(db, userUid, skuId);
    });

    removedValues.forEach((assignment) => {
        Database.deleteMsSkuAssignment(db, assignment);
    });
}

module.exports = {
    syncSkuAssignments,
};
