const uuid = require("uuid");

const transformSiteFromDb = (site) => ({
    id: site.drmm_site_id,
    uid: uuid.stringify(site.drmm_site_uid),
    name: site.drmm_site_name,
});

const transformDeviceFromDb = (device) => ({
    id: device.drmm_device_id,
    uid: uuid.stringify(device.drmm_device_uid),
    siteId: device.drmm_site_id,
    siteUid: uuid.stringify(device.drmm_site_uid),
    type: device.drmm_device_type,
    hostname: device.drmm_device_hostname,
    description: device.drmm_device_description,
    intIpAddress: device.drmm_device_ipv4_int,
    extIpAddress: device.drmm_device_ipv4_ext,
});

const getSiteIdFromUid = (db, uid) => {
    const site = db
        .prepare("SELECT drmm_site_id FROM drmm_site WHERE drmm_site_uid = ?;")
        .get(uuid.parse(uid));

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
        return db.prepare(sql).run(uuid.parse(uid), name);
    },

    updateDattoRmmSite(db, site) {
        const sql = `
            UPDATE drmm_site
            SET drmm_site_name = ?
            WHERE drmm_site_uid = ?;
        `;

        const { uid, name } = site;
        return db.prepare(sql).run(name, uuid.parse(uid));
    },

    deleteDattoRmmSite(db, site) {
        const sql = `
            DELETE FROM drmm_site
            WHERE drmm_site_uid = ?;
        `;

        return db.prepare(sql).run(uuid.parse(site.uid));
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
        const insertSql = `
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

        const logSql = `
            INSERT INTO drmm_device_log (
                drmm_device_log_timestamp,
                drmm_device_log_operation,
                drmm_site_id,
                drmm_device_uid,
                drmm_device_type,
                drmm_device_hostname
            )
            VALUES (?, ?, ?, ?, ?, ?);
        `;

        const {
            siteUid,
            type,
            hostname,
            description,
            intIpAddress,
            extIpAddress,
        } = device;

        const siteId = getSiteIdFromUid(db, siteUid);
        if (!siteId) return;

        const uid = uuid.parse(device.uid);

        db.prepare(logSql).run(
            Date.now(),
            "create",
            siteId,
            uid,
            type,
            hostname
        );

        return db
            .prepare(insertSql)
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

        const logSql = `
            INSERT INTO drmm_device_log (
                drmm_device_log_timestamp,
                drmm_device_log_operation,
                drmm_site_id,
                drmm_device_uid,
                drmm_device_type,
                drmm_device_hostname
            )
            VALUES (?, ?, ?, ?, ?, ?);
        `;

        const {
            uid,
            siteUid,
            type,
            hostname,
            description,
            intIpAddress,
            extIpAddress,
            $source,
        } = device;

        const siteId = getSiteIdFromUid(db, siteUid);
        if (!siteId) {
            this.deleteDattoRmmDevice(db, device);
            return;
        }

        if (siteUid !== $source.siteUid) {
            const timestamp = Date.now();
            const prevSiteId = getSiteIdFromUid(db, $source.siteUid);

            const stmt = db.prepare(logSql);
            stmt.run(timestamp, "create", siteId, uid, type, hostname);
            stmt.run(timestamp, "delete", prevSiteId, uid, type, hostname);
        }

        return db
            .prepare(sql)
            .run(
                siteId,
                type,
                hostname,
                description,
                intIpAddress,
                extIpAddress,
                uuid.parse(uid)
            );
    },

    deleteDattoRmmDevice(db, device) {
        const deleteSql = `
            DELETE FROM drmm_device
            WHERE drmm_device_uid = ?;
        `;

        const logSql = `
            INSERT INTO drmm_device_log (
                drmm_device_log_timestamp,
                drmm_device_log_operation,
                drmm_site_id,
                drmm_device_uid,
                drmm_device_type,
                drmm_device_hostname
            )
            VALUES (?, ?, ?, ?, ?, ?);
        `;

        const { siteUid, type, hostname } = device;

        const siteId = getSiteIdFromUid(siteUid);
        const uid = uuid.parse(device.uid);

        db.prepare(logSql).run(
            Date.now(),
            "delete",
            siteId,
            uid,
            type,
            hostname
        );

        return db.prepare(deleteSql).run(uid);
    },
};

module.exports = {
    Database,
};
