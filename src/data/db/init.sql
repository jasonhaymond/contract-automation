CREATE TABLE IF NOT EXISTS execution (
    execution_id INTEGER NOT NULL,
    execution_timestamp CHAR(24) NOT NULL,
    PRIMARY KEY (execution_id)
);

CREATE TABLE IF NOT EXISTS drmm_device (
    drmm_device_id INTEGER NOT NULL,
    drmm_device_uid CHAR(36) NOT NULL UNIQUE,
    drmm_device_site_uid CHAR(36) NOT NULL,
    drmm_device_type SMALLINT NOT NULL,
    drmm_device_hostname NVARCHAR(255),
    drmm_device_description NVARCHAR(255),
    drmm_device_ipv4_int CHAR(15),
    drmm_device_ipv4_ext CHAR(15),
    PRIMARY KEY (drmm_device_id),
);

CREATE INDEX IF NOT EXISTS ix_drmm_device_site_uid
ON drmm_device (drmm_device_site_uid);

CREATE TABLE IF NOT EXISTS drmm_device_mutation (
    drmm_device_mutation_id INTEGER NOT NULL,
    drmm_device_mutation_type SMALLINT NOT NULL,
    PRIMARY KEY (drmm_device_mutation_id),
    FOREIGN KEY (drmm_device_id) REFERENCES drmm_device (drmm_device_id)
);
