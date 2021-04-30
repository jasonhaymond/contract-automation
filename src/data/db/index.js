const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3-with-prebuilds");

const { DB_PATH = ":memory:" } = process.env;
const dbInitScriptPath = path.join(__dirname, "init.sql");

const getDb = function () {
    const db = new Database(DB_PATH);

    const initSql = fs.readFileSync(dbInitScriptPath, "utf-8");
    db.exec(initSql);

    return db;
};

module.exports = {
    getDb,
};
