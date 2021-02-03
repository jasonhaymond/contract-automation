const buildCell = (row, col) => typeof col.value == 'function' ? col.value(row) : row[col.value];

module.exports = {
    buildTable(headers, data) {
        const headerCells = headers.map(col => `<th>${col.name}</th>`).join('');
        const tableHeader = `<thead><tr>${headerCells}</tr></thead>`;

        const dataCells = data.map(row => {
            const currentRowCells = headers.map(col => `<td>${buildCell(row, col)}</td>`).join('');
            return `<tr>${currentRowCells}</tr>`;
        }).join('');

        const body = `<tbody>${dataCells}</tbody>`;
        return `<table>${tableHeader + body}</table>`;
    }
};
