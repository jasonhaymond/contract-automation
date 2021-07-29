const DattoRMMAPI = require("../../data/datto-rmm");
const { syncSites } = require("./site");
const { syncDevices } = require("./devices");

const { DATTO_RMM_API_URL, DATTO_RMM_API_KEY, DATTO_RMM_API_SECRET_KEY } =
    process.env;

const syncDattoRmm = async (db) => {
    const datto = await DattoRMMAPI.create(
        DATTO_RMM_API_URL,
        DATTO_RMM_API_KEY,
        DATTO_RMM_API_SECRET_KEY
    );

    await syncSites(db, datto);
    await syncDevices(db, datto);
};

module.exports = {
    syncDattoRmm,
};
