const transformSiteFromDb = (site) => ({
    id: site.drmm_site_id,
    uid: site.drmm_site_uid,
    name: site.drmm_site_name,
});

const transformDeviceFromDb = (device) => ({
    id: device.drmm_device_id,
    uid: device.drmm_device_uid,
    siteId: device.drmm_site_id,
    siteUid: device.drmm_site_uid,
    type: device.drmm_device_type,
    hostname: device.drmm_device_hostname,
    description: device.drmm_device_description,
    intIpAddress: device.drmm_device_ipv4_int,
    extIpAddress: device.drmm_device_ipv4_ext,
});

const transformLogEntryFromDb = (entry) => ({
    id: entry.drmm_device_log_id,
    timestamp: new Date(entry.drmm_device_log_timestamp),
    operation: entry.drmm_device_log_operation,
    siteId: entry.drmm_site_id,
    siteName: entry.drmm_site_name,
    uid: entry.drmm_device_uid,
    type: entry.drmm_device_type,
    hostname: entry.drmm_device_hostname,
});

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

        return db.prepare(sql).all().map(transformSiteFromDb);
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

    deleteDattoRmmSite(db, site) {
        const sql = `
            DELETE FROM drmm_site
            WHERE drmm_site_uid = ?;
        `;

        return db.prepare(sql).run(site.uid);
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

        return db.prepare(sql).all().map(transformDeviceFromDb);
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

        const uid = device.uid;

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
                uid
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
        const uid = device.uid;

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

    runReport(db, preview) {
        const lastReportSql = `
            SELECT report_timestamp
            FROM report
            ORDER BY report_timestamp DESC
            LIMIT 1;
        `;

        const recentLogEntriesSql = `
            SELECT
                drmm_device_log_id,
                drmm_device_log_timestamp,
                drmm_device_log_operation,
                drmm_device_log.drmm_site_id,
                drmm_site_name,
                drmm_device_uid,
                drmm_device_type,
                drmm_device_hostname
            FROM drmm_device_log
            INNER JOIN drmm_site
               ON drmm_site.drmm_site_id = drmm_device_log.drmm_site_id
            WHERE
                drmm_device_log_timestamp > ?
                AND drmm_device_log_timestamp <= ?
            ORDER BY
                drmm_site_name,
                drmm_device_log_timestamp DESC;
        `;

        const createReportSql = `
            INSERT INTO report (
                report_timestamp
            )
            VALUES (?);
        `;

        const lastReportTimestamp =
            db.prepare(lastReportSql).pluck().get() || 0;

        const now = Date.now();

        if (!preview) db.prepare(createReportSql).run(now);

        return db
            .prepare(recentLogEntriesSql)
            .all(lastReportTimestamp, now)
            .map(transformLogEntryFromDb);
    },
};

module.exports = {
    Database,
};
