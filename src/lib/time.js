function addMonths(date, numMonths) {
    const newDate = new Date(date.getTime());
    newDate.setMonth(date.getMonth() + numMonths);
    return newDate;
}

function getMonthRange(date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    const start = new Date(year, month);
    const end = addMonths(start, 1);

    return { start, end };
}

function getMonthAndYear(date) {
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

module.exports = {
    addMonths,
    getMonthRange,
    getMonthAndYear,
};
