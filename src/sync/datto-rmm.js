const dattoRmm = require("../models/datto-rmm");
const { getDb } = require("../data/db");
const DattoRMMAPI = require("../data/datto-rmm");
const { Database } = require("../models/db");
const { unidirectionalArrayDiff } = require("../lib/diff");

const {
    DATTO_RMM_API_URL,
    DATTO_RMM_API_KEY,
    DATTO_RMM_API_SECRET_KEY,
} = process.env;

const syncDattoRmm = async () => {
    const db = getDb();
    const datto = await DattoRMMAPI.create(
        DATTO_RMM_API_URL,
        DATTO_RMM_API_KEY,
        DATTO_RMM_API_SECRET_KEY
    );

    const sourceSites = Database.getDattoRmmSites(db);
    const updatedSites = (await dattoRmm.getSites(datto)).map((site) => ({
        uid: site.uid,
        name: site.name,
    }));

    const result = unidirectionalArrayDiff(sourceSites, updatedSites, "uid");
    Database.createDattoRmmSites(db, result.newValues);

    // Sync devices
    const sourceDevices = Database.getDattoRmmDevices(db);
    const updatedDevices = await dattoRmm.getDevices(datto);

    const deviceresult = unidirectionalArrayDiff(
        sourceDevices,
        updatedDevices,
        "uid"
    );

    Database.createDattoRmmDevices(db, deviceresult.newValues);

    db.close();
};

module.exports = {
    syncDattoRmm,
};
