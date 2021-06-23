const getCellContents = (row, col) =>
    typeof col.value == "function" ? col.value(row) : row[col.value];
const buildCell = (contents, rowHeader) =>
    rowHeader ? `<th scope="row">${contents}</th>` : `<td>${contents}</td>`;

function buildTable({ headers, data, caption }) {
    const headerCells = headers
        .map((col) => `<th scope="col">${col.name}</th>`)
        .join("");
    const headerHTML = `<thead><tr>${headerCells}</tr></thead>`;

    const dataCells = data
        .map((row) => {
            const currentRowCells = headers
                .map((col) => buildCell(getCellContents(row, col), col.header))
                .join("");
            return `<tr>${currentRowCells}</tr>`;
        })
        .join("");

    const bodyHTML = `<tbody>${dataCells}</tbody>`;
    const captionHTML = caption ? `<h2>${caption}</h2>` : "";
    return `${captionHTML}<table>${headerHTML + bodyHTML}</table>`;
}

function buildHTML({ title = "", body }) {
    return `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
            table {
                border: 3px solid #bbb;
                border-collapse: separate;
                border-spacing: 0;
                border-radius: 15px;
                width: 100%;
                max-width: 600px;
            }

            thead tr {
                border-bottom: 2px solid black;
                background-color: #ddd;
            }

            tr:nth-child(even) {
                background-color: #eee;
            }

            th, td {
                padding: 8px 20px;
                text-align: left;
            }

            th {
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <h1>${title}</h1>
        ${body}
    </body>
</html>
    `;
}

module.exports = {
    buildTable,
    buildHTML,
};
