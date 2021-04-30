const { Database } = require("../../models/db");
const dattoRmm = require("../../models/datto-rmm");
const { unidirectionalArrayDiff } = require("../../lib/diff");

const syncDevices = async (db, datto) => {
    const sourceDevices = Database.getDattoRmmDevices(db);
    const updatedDevices = await dattoRmm.getDevices(datto);

    const { newValues, changedValues, removedKeys } = unidirectionalArrayDiff(
        sourceDevices,
        updatedDevices,
        "uid"
    );

    newValues.forEach((device) => {
        Database.createDattoRmmDevice(db, device);
    });

    changedValues.forEach((device) => {
        Database.updateDattoRmmDevice(db, device);
    });

    removedKeys.forEach((deviceUid) => {
        Database.deleteDattoRmmDeviceByUid(db, deviceUid);
    });
};

module.exports = {
    syncDevices,
};
