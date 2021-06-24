const { sendReport } = require("./report");
const { syncDattoRmm } = require("./sync");

switch (process.argv[2]) {
    case "sync":
        syncDattoRmm();
        break;
    case "report":
        const preview = process.argv[3] === "--preview";
        sendReport(preview);
        break;
}
