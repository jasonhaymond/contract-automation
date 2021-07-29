const { getDb } = require("../data/db");
const { syncDattoRmm } = require("./datto-rmm");
const { syncMicrosoft } = require("./microsoft");

function buildSyncRunner(syncFn) {
    return async () => {
        const db = getDb();
        await syncFn(db);
        db.close();
    };
}

async function syncAll() {
    const db = getDb();

    await syncDattoRmm(db);
    await syncMicrosoft(db);

    db.close();
}

module.exports = {
    syncDattoRmm: buildSyncRunner(syncDattoRmm),
    syncMicrosoft: buildSyncRunner(syncMicrosoft),
    syncAll,
};
