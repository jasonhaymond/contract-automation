const { sendDattoRmmReport } = require("./datto-rmm");

async function sendAllReports(current) {
    await sendDattoRmmReport(current);
}

module.exports = {
    sendDattoRmmReport,
    sendAllReports,
};
