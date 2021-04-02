const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const { DB_PATH } = process.env;

const getDb = function() {
    const db = new Database(DB_PATH);
    db.pragma('PRAGMA foreign_keys = ON;');

    const initSql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf-8');
    db.exec(initSql);

    return db;
};

module.exports = {
    getDb,
};
