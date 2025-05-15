import { marked } from 'marked';

export const TableMarkdownTemplate = (headers: string[], rows: string[][], id: string) => {
  // Рендерим заголовки с поддержкой Markdown
  const headerHtml = headers
    .map(header => `<th>${marked(header)}</th>`)
    .join('');

// Рендерим строки с поддержкой Markdown
const rowsHtml = rows
    .map(row => `
      <tr>
        ${row.map(cell => `<td>${marked(cell)}</td>`).join('')}
      </tr>
    `)
    .join('');

return `
    <div class="table-container" id="${id}">
      <table>
        <thead>
          <tr>${headerHtml}</tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
      <style>
        .table-container#${id} {
          position: relative;
          display: block;
          margin: 20px 0;
          max-width: 100%;
          overflow-x: auto;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          background: #1a1a1a;
          padding: 8px;
          font-family: 'Fira Code', monospace;
        }
        .table-container#${id} table {
          width: 100%;
          border-collapse: collapse;
          color: #ffffff;
        }
        .table-container#${id} th,
        .table-container#${id} td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid rgba(76, 175, 80, 0.3);
        }
        .table-container#${id} th {
          background: #2a2a2a;
          color: #50fa7b;
          font-weight: 600;
        }
        .table-container#${id} td {
          background: #1a1a1a;
        }
        .table-container#${id} tr:hover td {
          background: #2a2a2a;
        }
        .table-container#${id} a {
          color: #50fa7b;
          text-decoration: none;
        }
        .table-container#${id} a:hover {
          text-decoration: underline;
        }
      </style>
    </div>
  `;
};