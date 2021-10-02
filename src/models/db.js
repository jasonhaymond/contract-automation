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

const transformMsTenantFromDb = (tenant) => ({
    id: tenant.ms_tenant_id,
    uid: tenant.ms_tenant_uid,
    name: tenant.ms_tenant_name,
});

const transformMsSkuFromDb = (sku) => ({
    id: sku.ms_sku_id,
    uid: sku.ms_sku_uid,
    tenantId: sku.ms_tenant_id,
    tenantUid: sku.ms_tenant_uid,
    skuId: sku.ms_sku_sku_id,
    skuPartNumber: sku.ms_sku_sku_part_number,
    unitCount: sku.ms_sku_unit_count,
});

const transformMsUserFromDb = (user) => ({
    id: user.ms_user_id,
    uid: user.ms_user_uid,
    tenantId: user.ms_tenant_id,
    tenantUid: user.ms_tenant_uid,
    userPrincipalName: user.ms_user_user_principal_name,
    displayName: user.ms_user_display_name,
    givenName: user.ms_user_given_name,
    surname: user.ms_user_surname,
});

const transformMsSkuAssignmentFromDb = (assignment) => ({
    id: assignment.ms_sku_assignment_id,
    tenantId: assignment.ms_tenant_id,
    tenantUid: assignment.ms_tenant_uid,
    user: transformMsUserFromDb(assignment),
    sku: transformMsSkuFromDb(assignment),
});

const getMsTenantIdFromUid = (db, uid) => {
    const tenant = db
        .prepare("SELECT ms_tenant_id FROM ms_tenant WHERE ms_tenant_uid = ?;")
        .get(uid);

    return tenant ? tenant.ms_tenant_id : null;
};

const getMsUserIdFromUid = (db, uid) => {
    const user = db
        .prepare("SELECT ms_user_id FROM ms_user WHERE ms_user_uid = ?;")
        .get(uid);

    return user ? user.ms_user_id : null;
};

const Database = {
    getDattoRmmSites(db) {
        const sql = `
            SELECT
                drmm_site_id,
                drmm_site_uid,
                drmm_site_name
            FROM drmm_site
            ORDER BY drmm_site_name;
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
            NATURAL JOIN drmm_site
            ORDER BY drmm_device_hostname;
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
            uid,
            siteUid,
            type,
            hostname,
            description,
            intIpAddress,
            extIpAddress,
        } = device;

        const siteId = getSiteIdFromUid(db, siteUid);
        if (!siteId) return;

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
            device.siteUid = $source.siteUid;
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

<<<<<<< HEAD
        const { siteUid, type, hostname } = device;

        const siteId = getSiteIdFromUid(db, siteUid);
        const uid = device.uid;
=======
        const { siteUid, uid, type, hostname } = device;
        const siteId = getSiteIdFromUid(db, siteUid);
>>>>>>> f41e075 (Work on assignment sync)

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

    getDattoRmmLogs(db, from, to) {
        const getLogEntriesSql = `
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
                drmm_device_log_timestamp >= ?
                AND drmm_device_log_timestamp < ?
            ORDER BY
                drmm_site_name,
                drmm_device_log_timestamp DESC;
        `;

        return db
            .prepare(getLogEntriesSql)
            .all(from.getTime(), to.getTime())
            .map(transformLogEntryFromDb);
    },

    getMsTenants(db) {
        const sql = `
            SELECT
                ms_tenant_id,
                ms_tenant_uid,
                ms_tenant_name
            FROM ms_tenant;
        `;

        return db.prepare(sql).all().map(transformMsTenantFromDb);
    },

    createMsTenant(db, tenant) {
        const sql = `
            INSERT INTO ms_tenant (ms_tenant_uid, ms_tenant_name)
            VALUES (?, ?);
        `;

        const { uid, name } = tenant;
        return db.prepare(sql).run(uid, name);
    },

    updateMsTenant(db, tenant) {
        const sql = `
            UPDATE ms_tenant
            SET ms_tenant_name = ?
            WHERE ms_tenant_uid = ?;
        `;

        const { uid, name } = tenant;
        return db.prepare(sql).run(name, uid);
    },

    deleteMsTenant(db, tenant) {
        const sql = `
            DELETE FROM ms_tenant
            WHERE ms_tenant_uid = ?;
        `;

        return db.prepare(sql).run(tenant.uid);
    },

    getMsSkuBySkuSkuId(db, skuId) {
        const sql = `
            SELECT
                ms_sku_id,
                ms_sku_uid,
                ms_tenant_id,
                ms_tenant_uid,
                ms_sku_sku_id,
                ms_sku_sku_part_number,
                ms_sku_unit_count
            FROM ms_sku
            NATURAL JOIN ms_tenant
            WHERE ms_sku_sku_id = ?;
        `;

        return transformMsSkuFromDb(db.prepare(sql).get(skuId));
    },

    getMsSkusByTenantUid(db, tenantUid) {
        const sql = `
            SELECT
                ms_sku_id,
                ms_sku_uid,
                ms_tenant_id,
                ms_tenant_uid,
                ms_sku_sku_id,
                ms_sku_sku_part_number,
                ms_sku_unit_count
            FROM ms_sku
            NATURAL JOIN ms_tenant
            WHERE ms_tenant_uid = ?;
        `;

        return db.prepare(sql).all(tenantUid).map(transformMsSkuFromDb);
    },

    createMsSku(db, sku) {
        const sql = `
            INSERT INTO ms_sku (
                ms_sku_uid,
                ms_tenant_id,
                ms_sku_sku_id,
                ms_sku_sku_part_number,
                ms_sku_unit_count
            )
            VALUES (?, ?, ?, ?, ?);
        `;

        const logSql = `
            INSERT INTO ms_sku_log (
                ms_sku_log_timestamp,
                ms_sku_log_operation,
                ms_tenant_id,
                ms_sku_uid,
                ms_sku_sku_id,
                ms_sku_sku_part_number,
                ms_sku_unit_count
            )
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `;

        const { uid, tenantUid, skuId, skuPartNumber, unitCount } = sku;

        const tenantId = getMsTenantIdFromUid(db, tenantUid);
        if (!tenantId) return;

        db.prepare(logSql).run(
            Date.now(),
            "create",
            tenantId,
            uid,
            skuId,
            skuPartNumber,
            unitCount
        );

        return db
            .prepare(sql)
            .run(uid, tenantId, skuId, skuPartNumber, unitCount);
    },

    updateMsSku(db, sku) {
        const sql = `
            UPDATE ms_sku
            SET ms_sku_sku_id = ?,
                ms_sku_sku_part_number = ?,
                ms_sku_unit_count = ?
            WHERE ms_sku_uid = ?;

        `;

        const logSql = `
            INSERT INTO ms_sku_log (
                ms_sku_log_timestamp,
                ms_sku_log_operation,
                ms_tenant_id,
                ms_sku_uid,
                ms_sku_sku_id,
                ms_sku_sku_part_number,
                ms_sku_unit_count
            )
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `;

        const { uid, tenantUid, skuId, skuPartNumber, unitCount, $source } =
            sku;

        const tenantId = getMsTenantIdFromUid(db, tenantUid);

        if (unitCount !== $source.unitCount) {
            db.prepare(logSql).run(
                Date.now(),
                "change",
                tenantId,
                uid,
                skuId,
                skuPartNumber,
                unitCount
            );
        }

        return db.prepare(sql).run(skuId, skuPartNumber, unitCount, uid);
    },

    deleteMsSku(db, sku) {
        const sql = `
            DELETE FROM ms_sku
            WHERE ms_sku_uid = ?;
        `;

        const logSql = `
            INSERT INTO ms_sku_log (
                ms_sku_log_timestamp,
                ms_sku_log_operation,
                ms_tenant_id,
                ms_sku_uid,
                ms_sku_sku_id,
                ms_sku_sku_part_number,
                ms_sku_unit_count
            )
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `;

        const { id, tenantId, uid, skuId, skuPartNumber, unitCount } = sku;

        const assignments = this.getMsSkuAssignmentsBySkuId(db, id);
        assignments.forEach((assignment) => {
            this.deleteMsSkuAssignment(db, assignment);
        });

        db.prepare(logSql).run(
            Date.now(),
            "delete",
            tenantId,
            uid,
            skuId,
            skuPartNumber,
            unitCount
        );

        return db.prepare(sql).run(sku.uid);
    },

    getMsUserByUserUid(db, uid) {
        const sql = `
            SELECT
                ms_user_id,
                ms_user_uid,
                ms_tenant_id,
                ms_tenant_uid,
                ms_user_user_principal_name,
                ms_user_display_name,
                ms_user_given_name,
                ms_user_surname
            FROM ms_user
            NATURAL JOIN ms_tenant
            WHERE ms_user_uid = ?;
        `;

        return transformMsUserFromDb(db.prepare(sql).get(uid));
    },

    getMsUsersByTenantUid(db, tenantUid) {
        const sql = `
            SELECT
                ms_user_id,
                ms_user_uid,
                ms_tenant_id,
                ms_tenant_uid,
                ms_user_user_principal_name,
                ms_user_display_name,
                ms_user_given_name,
                ms_user_surname
            FROM ms_user
            NATURAL JOIN ms_tenant
            WHERE ms_tenant_uid = ?;
        `;

        return db.prepare(sql).all(tenantUid).map(transformMsUserFromDb);
    },

    createMsUser(db, user) {
        const sql = `
            INSERT INTO ms_user (
                ms_user_uid,
                ms_tenant_id,
                ms_user_user_principal_name,
                ms_user_display_name,
                ms_user_given_name,
                ms_user_surname
            )
            VALUES (?, ?, ?, ?, ?, ?);
        `;

        const {
            uid,
            tenantUid,
            userPrincipalName,
            displayName,
            givenName,
            surname,
        } = user;

        const tenantId = getMsTenantIdFromUid(db, tenantUid);
        if (!tenantId) return;

        return db
            .prepare(sql)
            .run(
                uid,
                tenantId,
                userPrincipalName,
                displayName,
                givenName,
                surname
            );
    },

    updateMsUser(db, user) {
        const sql = `
            UPDATE ms_user
            SET ms_user_user_principal_name = ?,
                ms_user_display_name = ?,
                ms_user_given_name = ?,
                ms_user_surname = ?
            WHERE ms_user_uid = ?;

        `;

        const { uid, userPrincipalName, displayName, givenName, surname } =
            user;
        return db
            .prepare(sql)
            .run(userPrincipalName, displayName, givenName, surname, uid);
    },

    deleteMsUser(db, user) {
        const sql = `
            DELETE FROM ms_user
            WHERE ms_user_uid = ?;
        `;

        const assignments = this.getMsSkuAssignmentsByUserUid(db, user.uid);
        assignments.forEach((assignment) => {
            this.deleteMsSkuAssignment(db, assignment);
        });

        return db.prepare(sql).run(user.uid);
    },

    getMsSkuAssignmentsBySkuId(db, id) {
        const sql = `
            SELECT
                ms_sku_assignment_id,
                ms_user_id,
                ms_sku_id,
                ms_tenant_id,
                ms_tenant_uid,
                ms_user_uid,
                ms_user_user_principal_name,
                ms_user_display_name,
                ms_user_given_name,
                ms_user_surname,
                ms_sku_uid,
                ms_sku_sku_id,
                ms_sku_sku_part_number,
                ms_sku_unit_count
            FROM ms_sku_assignment
            NATURAL JOIN ms_user
            NATURAL JOIN ms_sku
            NATURAL JOIN ms_tenant
            WHERE ms_sku_id = ?;
        `;

        return db.prepare(sql).all(id).map(transformMsSkuAssignmentFromDb);
    },

    getMsSkuAssignmentsByUserUid(db, uid) {
        const sql = `
            SELECT
                ms_sku_assignment_id,
                ms_user_id,
                ms_sku_id,
                ms_tenant_id,
                ms_tenant_uid,
                ms_user_uid,
                ms_user_user_principal_name,
                ms_user_display_name,
                ms_user_given_name,
                ms_user_surname,
                ms_sku_uid,
                ms_sku_sku_id,
                ms_sku_sku_part_number,
                ms_sku_unit_count
            FROM ms_sku_assignment
            NATURAL JOIN ms_user
            NATURAL JOIN ms_sku
            NATURAL JOIN ms_tenant
            WHERE ms_user_uid = ?;
        `;

        return db.prepare(sql).all(uid).map(transformMsSkuAssignmentFromDb);
    },

    createMsSkuAssignment(db, { userUid, skuId }) {
        const sql = `
            INSERT INTO ms_sku_assignment (
                ms_user_id,
                ms_sku_id
            )
            VALUES (?, ?);
        `;

        const logSql = `
            INSERT INTO ms_sku_assignment_log (
                ms_sku_assignment_log_timestamp,
                ms_sku_assignment_log_operation,
                ms_tenant_id,
                ms_user_uid,
                ms_user_user_principal_name,
                ms_user_display_name,
                ms_user_given_name,
                ms_user_surname,
                ms_sku_uid,
                ms_sku_sku_id,
                ms_sku_sku_part_number
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        const {
            id: user_id,
            tenantId,
            userPrincipalName,
            displayName,
            givenName,
            surname,
        } = this.getMsUserByUserUid(db, userUid);

        const {
            id: sku_id,
            uid: skuUid,
            skuPartNumber,
        } = this.getMsSkuBySkuSkuId(db, skuId);

        db.prepare(logSql).run(
            Date.now(),
            "create",
            tenantId,
            userUid,
            userPrincipalName,
            displayName,
            givenName,
            surname,
            skuUid,
            skuId,
            skuPartNumber
        );

        return db.prepare(sql).run(user_id, sku_id);
    },

    deleteMsSkuAssignment(db, assignment) {
        const sql = `
            DELETE FROM ms_sku_assignment
            WHERE ms_sku_assignment_id = ?;
        `;

        const logSql = `
            INSERT INTO ms_sku_assignment_log (
                ms_sku_assignment_log_timestamp,
                ms_sku_assignment_log_operation,
                ms_tenant_id,
                ms_user_uid,
                ms_user_user_principal_name,
                ms_user_display_name,
                ms_user_given_name,
                ms_user_surname,
                ms_sku_uid,
                ms_sku_sku_id,
                ms_sku_sku_part_number
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        const {
            id,
            tenantId,
            user: {
                uid: userUid,
                userPrincipalName,
                displayName,
                givenName,
                surname,
            },
            sku: { uid: skuUid, skuId, skuPartNumber },
        } = assignment;

        db.prepare(logSql).run(
            Date.now(),
            "delete",
            tenantId,
            userUid,
            userPrincipalName,
            displayName,
            givenName,
            surname,
            skuUid,
            skuId,
            skuPartNumber
        );

        return db.prepare(sql).run(id);
    },
};

module.exports = {
    Database,
};
