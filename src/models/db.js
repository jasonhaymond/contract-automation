const DRMM_SITE_SELECT = `
    SELECT drmm_site_id, drmm_site_uid, drmm_site_name
    FROM drmm_site;
`;
const DRMM_SITE_INSERT = `
    INSERT INTO drmm_site (drmm_site_uid, drmm_site_name)
    VALUES (?, ?);
`;

const DRMM_DEVICE_SELECT = `
    SELECT drmm_device_id, drmm_site_id, drmm_device_uid, drmm_device_hostname
    FROM drmm_device;
`;

const DRMM_DEVICE_INSERT = `
    INSERT INTO drmm_device (drmm_site_id, drmm_device_uid, drmm_device_type, drmm_device_hostname)
    VALUES (?, ?, ?, ?);
`;

const transformSiteFromDb = (site) => ({
    id: site.drmm_site_id,
    uid: site.drmm_site_uid,
    name: site.drmm_site_name,
});

const transformDeviceFromDb = (device) => ({
    id: device.drmm_device_id,
    siteId: device.drmm_site_id,
    uid: device.drmm_device_uid,
    type: "device",
    hostname: device.drmm_device_hostname,
});

const Database = {
    getDattoRmmSites(db) {
        const sites = db.prepare(DRMM_SITE_SELECT).all();
        return sites.map((site) => transformSiteFromDb(site));
    },

    createDattoRmmSites(db, sites) {
        return sites.map((site) =>
            db.prepare(DRMM_SITE_INSERT).run(site.uid, site.name)
        );
    },

    getDattoRmmDevices(db) {
        const devices = db.prepare(DRMM_DEVICE_SELECT).all();
        return devices.map((device) => transformDeviceFromDb(device));
    },

    createDattoRmmDevices(db, devices) {
        const sites = this.getDattoRmmSites(db);

        return devices.map((device) => {
            const site = sites.find((site) => site.uid === device.siteUid);
            if (!site) return;
            const siteId = site.id;

            return db
                .prepare(DRMM_DEVICE_INSERT)
                .run(siteId, device.uid, device.type, device.hostname);
        });
    },
};

module.exports = {
    Database,
};
