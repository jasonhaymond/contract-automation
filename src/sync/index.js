const { getDb } = require("../data/db");
const { syncDattoRmm } = require("./datto-rmm");

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

    db.close();
}

module.exports = {
    syncDattoRmm: buildSyncRunner(syncDattoRmm),
    syncAll,
};
