const { getDb } = require("../data/db");

const db = getDb();

const getDrmmSites = () => {
    const source = db
        .prepare(
            "SELECT drmm_site_id, drmm_site_uid, drmm_site_name FROM drmm_site"
        )
        .all();
};

module.exports = {
    getDrmmSites,
};
