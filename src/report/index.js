const { sendDattoRmmReport } = require("./datto-rmm");

async function sendAllReports(preview) {
    await sendDattoRmmReport(preview);
}

module.exports = {
    sendAllReports,
};
