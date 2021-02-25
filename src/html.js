const getCellContents = (row, col) => typeof col.value == 'function' ? col.value(row) : row[col.value];
const buildCell = (contents, rowHeader) => rowHeader ? `<th scope="row">${contents}</th>` : `<td>${contents}</td>`;


module.exports = {
    buildTable({ headers, data, caption }) {
        const headerCells = headers.map(col => `<th scope="col">${col.name}</th>`).join('');
        const headerHTML = `<thead><tr>${headerCells}</tr></thead>`;

        const dataCells = data.map(row => {
            const currentRowCells = headers.map(col => buildCell(getCellContents(row, col), col.header)).join('');
            return `<tr>${currentRowCells}</tr>`;
        }).join('');

        const bodyHTML = `<tbody>${dataCells}</tbody>`;
        const captionHTML = caption ? `<caption>${caption}</caption>` : '';
        return `<table>${captionHTML + headerHTML + bodyHTML}</table>`;
    },

    buildHTML({ title = '', body }) {
        return `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <title>${title}</title>
                    <style>
                        table {
                            border: 3px solid blue;
                            border-collapse: collapse;
                        }

                        th, td {
                            padding: 8px 20px;
                            text-align: left;
                        }

                        caption {
                            font-weight: bold;
                            padding: 20px;
                        }
                    </style>
                </head>
                <body>
                    ${body}
                </body>
            </html>
        `;
    },
};
