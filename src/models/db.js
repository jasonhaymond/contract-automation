const transformSiteFromDb = (site) => {
    const { drmm_site_id, drmm_site_uid, drmm_site_name } = site;
    return {
        id: drmm_site_id,
        uid: drmm_site_uid,
        name: drmm_site_name,
    };
};

const transformDeviceFromDb = (device) => {
    const {
        drmm_device_id,
        drmm_device_uid,
        drmm_site_id,
        drmm_site_uid,
        drmm_device_type,
        drmm_device_hostname,
        drmm_device_description,
        drmm_device_ipv4_int,
        drmm_device_ipv4_ext,
    } = device;

    return {
        id: drmm_device_id,
        uid: drmm_device_uid,
        siteId: drmm_site_id,
        siteUid: drmm_site_uid,
        type: drmm_device_type,
        hostname: drmm_device_hostname,
        description: drmm_device_description,
        intIpAddress: drmm_device_ipv4_int,
        extIpAddress: drmm_device_ipv4_ext,
    };
};

const getSiteIdFromUid = (db, uid) => {
    const site = db
        .prepare("SELECT drmm_site_id FROM drmm_site WHERE drmm_site_uid = ?;")
        .get(uid);

    return site ? site.drmm_site_id : null;
};

const Database = {
    getDattoRmmSites(db) {
        const sql = `
            SELECT
                drmm_site_id,
                drmm_site_uid,
                drmm_site_name
            FROM drmm_site;
        `;

        return db
            .prepare(sql)
            .all()
            .map((site) => transformSiteFromDb(site));
    },

    createDattoRmmSite(db, site) {
        const sql = `
            INSERT INTO drmm_site (drmm_site_uid, drmm_site_name)
            VALUES (?, ?);
        `;

        const { uid, name } = site;
        return db.prepare(sql).run(uid, name);
    },

    updateDattoRmmSite(db, site) {
        const sql = `
            UPDATE drmm_site
            SET drmm_site_name = ?
            WHERE drmm_site_uid = ?;
        `;

        const { uid, name } = site;
        return db.prepare(sql).run(name, uid);
    },

    deleteDattoRmmSiteByUid(db, uid) {
        const sql = `
            DELETE FROM drmm_site
            WHERE drmm_site_uid = ?;
        `;

        return db.prepare(sql).run(uid);
    },

    getDattoRmmDevices(db) {
        const sql = `
            SELECT
                drmm_device_id,
                drmm_device_uid,
                drmm_site_id,
                drmm_site_uid,
                drmm_device_type,
                drmm_device_hostname,
                drmm_device_description,
                drmm_device_ipv4_int,
                drmm_device_ipv4_ext
            FROM drmm_device
            NATURAL JOIN drmm_site;
        `;

        return db
            .prepare(sql)
            .all()
            .map((device) => transformDeviceFromDb(device));
    },

    createDattoRmmDevice(db, device) {
        const sql = `
            INSERT INTO drmm_device (
                drmm_device_uid,
                drmm_site_id,
                drmm_device_type,
                drmm_device_hostname,
                drmm_device_description,
                drmm_device_ipv4_int,
                drmm_device_ipv4_ext
            )
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `;

        const {
            uid,
            siteUid,
            type,
            hostname,
            description,
            intIpAddress,
            extIpAddress,
        } = device;

        const siteId = getSiteIdFromUid(siteUid);
        if (!siteId) return;

        return db
            .prepare(sql)
            .run(
                uid,
                siteId,
                type,
                hostname,
                description,
                intIpAddress,
                extIpAddress
            );
    },

    updateDattoRmmDevice(db, device) {
        const sql = `
            UPDATE drmm_device
            SET drmm_site_id = ?,
                drmm_device_type = ?,
                drmm_device_hostname = ?,
                drmm_device_description = ?,
                drmm_device_ipv4_int = ?,
                drmm_device_ipv4_ext = ?
            WHERE drmm_device_uid = ?;

        `;

        const {
            uid,
            siteUid,
            type,
            hostname,
            description,
            intIpAddress,
            extIpAddress,
        } = device;

        const siteId = getSiteIdFromUid(siteUid);
        if (!siteId) return;

        return db
            .prepare(sql)
            .run(
                siteId,
                type,
                hostname,
                description,
                intIpAddress,
                extIpAddress
            );
    },

    deleteDattoRmmDeviceByUid(db, uid) {
        const sql = `
            DELETE FROM drmm_device
            WHERE drmm_device_uid = ?;
        `;

        return db.prepare(sql).run(uid);
    },
};

module.exports = {
    Database,
};
