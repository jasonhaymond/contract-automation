const datto = require("./models/datto-rmm");
const db = require("../models/db");

const sync = async () => {
    const sourceSites = db.getSites();
};

module.exports = {
    sync,
};
