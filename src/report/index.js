const { sendDattoRmmReport } = require("./datto-rmm");
const { sendMicrosoftReport } = require("./microsoft");

async function sendAllReports(current) {
    await sendDattoRmmReport(current);
    await sendMicrosoftReport(current);
}

module.exports = {
    sendDattoRmmReport,
    sendAllReports,
};
