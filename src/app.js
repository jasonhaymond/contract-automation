const { sendAllReports } = require("./report");
const { syncAll } = require("./sync");

switch (process.argv[2]) {
    case "sync":
        syncAll();
        break;
    case "report":
        const current = process.argv[3] === "--current";
        sendAllReports(current);
        break;
}
