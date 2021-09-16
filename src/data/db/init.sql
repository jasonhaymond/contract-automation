PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS drmm_site (
    drmm_site_id                        INTEGER PRIMARY KEY,
    drmm_site_uid                       CHAR(36) NOT NULL UNIQUE,
    drmm_site_name                      NVARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS drmm_device (
    drmm_device_id                      INTEGER PRIMARY KEY,
    drmm_device_uid                     CHAR(36) NOT NULL UNIQUE,
    drmm_site_id                        INTEGER NOT NULL,
    drmm_device_type                    VARCHAR(16) NOT NULL,
    drmm_device_hostname                NVARCHAR(255) NOT NULL,
    drmm_device_description             NVARCHAR(4095),
    drmm_device_ipv4_int                BINARY(4),
    drmm_device_ipv4_ext                BINARY(4),
    FOREIGN KEY (drmm_site_id)          REFERENCES drmm_site (drmm_site_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS drmm_device_log (
    drmm_device_log_id                  INTEGER PRIMARY KEY,
    drmm_device_log_timestamp           INTEGER NOT NULL,
    drmm_device_log_operation           VARCHAR(8) NOT NULL,
    drmm_site_id                        INTEGER NOT NULL,
    drmm_device_uid                     CHAR(36) NOT NULL,
    drmm_device_type                    VARCHAR(16) NOT NULL,
    drmm_device_hostname                NVARCHAR(255) NOT NULL,
    FOREIGN KEY (drmm_site_id)          REFERENCES drmm_site (drmm_site_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ms_tenant (
    ms_tenant_id                        INTEGER PRIMARY KEY,
    ms_tenant_uid                       CHAR(36) NOT NULL UNIQUE,
    ms_tenant_name                      NVARCHAR(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS ms_user (
    ms_user_id                          INTEGER PRIMARY KEY,
    ms_user_uid                         CHAR(36) NOT NULL UNIQUE,
    ms_tenant_id                        INTEGER NOT NULL,
    ms_user_user_principal_name         NVARCHAR(128) NOT NULL UNIQUE,
    ms_user_display_name                NVARCHAR(128) NOT NULL,
    ms_user_given_name                  NVARCHAR(64),
    ms_user_surname                     NVARCHAR(64),
    FOREIGN KEY (ms_tenant_id)          REFERENCES ms_tenant (ms_tenant_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ms_sku (
    ms_sku_id                           INTEGER PRIMARY KEY,
    ms_sku_uid                          VARCHAR(128) NOT NULL,
    ms_tenant_id                        INTEGER NOT NULL,
    ms_sku_sku_id                       CHAR(36) NOT NULL,
    ms_sku_part_number                  VARCHAR(128) NOT NULL,
    ms_sku_unit_count                   INTEGER NOT NULL,
    FOREIGN KEY (ms_tenant_id)          REFERENCES ms_tenant (ms_tenant_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ms_sku_log (
    ms_sku_log_id                       INTEGER PRIMARY KEY,
    ms_sku_log_timestamp                INTEGER NOT NULL,
    ms_sku_log_operation                VARCHAR(16) NOT NULL,
    ms_tenant_id                        INTEGER NOT NULL,
    ms_sku_uid                          VARCHAR(128) NOT NULL,
    ms_sku_sku_id                       CHAR(36) NOT NULL,
    ms_sku_part_number                  VARCHAR(128) NOT NULL,
    ms_sku_unit_count                   INTEGER NOT NULL,
    FOREIGN KEY (ms_tenant_id)          REFERENCES ms_tenant (ms_tenant_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ms_sku_assignment (
    ms_sku_assignment_id                INTEGER PRIMARY KEY,
    ms_user_id                          INTEGER NOT NULL,
    ms_sku_id                           INTEGER NOT NULL,
    FOREIGN KEY (ms_user_id)            REFERENCES ms_user (ms_user_id) ON DELETE CASCADE,
    FOREIGN KEY (ms_sku_id)             REFERENCES ms_sku (ms_sku_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ms_sku_assignment_log (
    ms_sku_assignment_log_id            INTEGER PRIMARY KEY,
    ms_sku_assignment_log_timestamp     INTEGER NOT NULL,
    ms_sku_assignment_log_operation     VARCHAR(16) NOT NULL,
    ms_tenant_id                        INTEGER NOT NULL,
    ms_user_uid                         CHAR(36) NOT NULL,
    ms_user_user_principal_name         NVARCHAR(128) NOT NULL,
    ms_user_display_name                NVARCHAR(128) NOT NULL,
    ms_user_given_name                  NVARCHAR(64),
    ms_user_surname                     NVARCHAR(64),
    ms_sku_uid                          VARCHAR(128) NOT NULL,
    ms_sku_sku_id                       CHAR(36) NOT NULL,
    ms_sku_part_number                  VARCHAR(128) NOT NULL,
    FOREIGN KEY (ms_tenant_id)          REFERENCES ms_tenant (ms_tenant_id) ON DELETE CASCADE
);
