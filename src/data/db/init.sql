CREATE TABLE IF NOT EXISTS execution (
    id INTEGER NOT NULL,
    timestamp INTEGER NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS drmm_device (
    id INTEGER NOT NULL,
    uid BINARY(16) NOT NULL UNIQUE,
    site_uid BINARY(16) NOT NULL,
    type TINYINT NOT NULL,
    hostname NVARCHAR(255),
    description NVARCHAR(255),
    ipv4_int BINARY(4),
    ipv4_ext BINARY(4),
    is_active TINYINT NOT NULL,
    PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS ix_drmm_device_site_uid
ON drmm_device (site_uid);

CREATE TABLE IF NOT EXISTS drmm_device_history (
    id INTEGER NOT NULL,
    type SMALLINT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id) REFERENCES drmm_device (id)
);
