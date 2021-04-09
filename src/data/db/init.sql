PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS report (
    report_id                   INTEGER PRIMARY KEY,
    report_timestamp            INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS drmm_site (
    drmm_site_id                INTEGER PRIMARY KEY,
    drmm_site_uid               BINARY(16) NOT NULL UNIQUE,
    drmm_site_name              NVARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS drmm_device (
    drmm_device_id              INTEGER PRIMARY KEY,
    drmm_site_id                INTEGER NOT NULL,
    drmm_device_uid             BINARY(16) NOT NULL UNIQUE,
    drmm_device_type            TINYINT NOT NULL,
    drmm_device_hostname        NVARCHAR(255) NOT NULL,
    drmm_device_description     NVARCHAR(4095),
    drmm_device_ipv4_int        BINARY(4),
    drmm_device_ipv4_ext        BINARY(4),
    FOREIGN KEY (drmm_site_id)  REFERENCES drmm_site (drmm_site_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS drmm_device_log (
    drmm_device_log_id          INTEGER PRIMARY KEY,
    drmm_device_log_timestamp   INTEGER NOT NULL,
    drmm_device_log_operation   TINYINT NOT NULL,
    drmm_site_id                INTEGER NOT NULL,
    drmm_device_log_uid         BINARY(16) NOT NULL,
    drmm_device_log_type        TINYINT NOT NULL,
    drmm_device_log_hostname    NVARCHAR(255) NOT NULL,
    FOREIGN KEY (drmm_site_id)  REFERENCES drmm_site (drmm_site_id) ON DELETE CASCADE
);
