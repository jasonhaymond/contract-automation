const { addMonths, getMonthRange, getMonthAndYear } = require("../lib/time");
const { sendDattoRmmReport } = require("./datto-rmm");
const { sendMicrosoftReport } = require("./microsoft");

async function sendAllReports(current) {
    let reportDate = new Date();
    if (!current) {
        reportDate.setDate(1); // Handle different month lengths
        reportDate = addMonths(reportDate, -1);
    }
    const { start, end } = getMonthRange(reportDate);
    const reportMonthYear = getMonthAndYear(reportDate);

    //await sendDattoRmmReport(start, end, reportMonthYear);
    await sendMicrosoftReport(start, end, reportMonthYear);
}

module.exports = {
    sendDattoRmmReport,
    sendAllReports,
};
