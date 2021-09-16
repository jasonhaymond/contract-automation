const { unidirectionalArrayDiff } = require("../../lib/diff");
const { Database } = require("../../models/db");
const { syncSkuAssignments } = require("./assignments");

async function syncUsers(db, clients) {
    for (const client of clients) {
        const sourceUsers = Database.getMsUsersByTenantUid(db, client.uid);
        const updatedUsers = await client.getUsers();

        const { newValues, changedValues, removedValues } =
            unidirectionalArrayDiff(sourceUsers, updatedUsers, "uid");

        newValues.forEach((user) => {
            Database.createMsUser(db, user);
        });

        changedValues.forEach((user) => {
            Database.updateMsUser(db, user);
        });

        removedValues.forEach((user) => {
            Database.deleteMsUser(db, user);
        });

        updatedUsers.forEach((user) => {
            syncSkuAssignments(db, user);
        });
    }
}

module.exports = {
    syncUsers,
};
