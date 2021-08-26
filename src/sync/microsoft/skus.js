const { unidirectionalArrayDiff } = require("../../lib/diff");
const { Database } = require("../../models/db");

async function syncSkus(db, clients) {
    const sourceSkus = Database.getMsSkus(db);

    const updatedSkus = await Promise.all(
        clients.map((client) => client.getSkus())
    );

    const { newValues, changedValues, removedValues } = unidirectionalArrayDiff(
        sourceSkus,
        updatedSkus,
        "uid"
    );

    newValues.forEach((sku) => {
        Database.createMsSku(db, sku);
    });

    changedValues.forEach((sku) => {
        Database.updateMsSku(db, sku);
    });

    removedValues.forEach((sku) => {
        Database.deleteMsSku(db, sku);
    });
}

module.exports = {
    syncSkus,
};
