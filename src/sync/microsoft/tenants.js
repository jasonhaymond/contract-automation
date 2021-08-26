const { unidirectionalArrayDiff } = require("../../lib/diff");
const { Database } = require("../../models/db");

async function syncTenants(db, clients) {
    const sourceTenants = Database.getMsTenants(db);

    const updatedTenants = await Promise.all(
        clients.map((client) => client.getTenant())
    );

    const { newValues, changedValues, removedValues } = unidirectionalArrayDiff(
        sourceTenants,
        updatedTenants,
        "uid"
    );

    newValues.forEach((tenant) => {
        Database.createMsTenant(db, tenant);
    });

    changedValues.forEach((tenant) => {
        Database.updateMsTenant(db, tenant);
    });

    removedValues.forEach((tenant) => {
        Database.deleteMsTenant(db, tenant);
    });
}

module.exports = {
    syncTenants,
};
