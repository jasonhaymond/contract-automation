const { unidirectionalArrayDiff } = require("../../lib/diff");
const { Database } = require("../../models/db");

async function syncSkus(db, clients) {
    for (const client of clients) {
        const sourceSkus = Database.getMsSkusByTenantUid(db, client.uid);
        const updatedSkus = await client.getSkus();

        const { newValues, changedValues, removedValues } =
            unidirectionalArrayDiff(sourceSkus, updatedSkus, "uid");

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
}

module.exports = {
    syncSkus,
};
