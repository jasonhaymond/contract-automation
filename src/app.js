const { sendReport } = require("./report");
const { syncDattoRmm } = require("./sync");

switch (process.argv[2]) {
    case "sync":
        syncDattoRmm();
        break;
    case "report":
        sendReport();
        break;
}
