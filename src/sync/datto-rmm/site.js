const { Database } = require("../../models/db");
const dattoRmm = require("../../models/datto-rmm");
const { unidirectionalArrayDiff } = require("../../lib/diff");

const syncSites = async (db, datto) => {
    const sourceSites = Database.getDattoRmmSites(db);
    const updatedSites = await dattoRmm.getSites(datto);

    const { newValues, changedValues, removedValues } = unidirectionalArrayDiff(
        sourceSites,
        updatedSites,
        "uid"
    );

    newValues.forEach((site) => {
        Database.createDattoRmmSite(db, site);
    });

    changedValues.forEach((site) => {
        Database.updateDattoRmmSite(db, site);
    });

    removedValues.forEach((site) => {
        Database.deleteDattoRmmSite(db, site);
    });
};

module.exports = {
    syncSites,
};
