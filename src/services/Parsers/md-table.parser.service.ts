// import { Injectable } from '@angular/core';
// import { TableBlock } from '../../interfaces/markdown/md-table.interface';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class MarkdownTableParserService {
//   extractTableBlocks(markdown: string): TableBlock[] {
//     const tableBlocks: TableBlock[] = [];
//     const tableRegex = /\|(.+?)\|\n\|[-:|\s]+\|\n([\s\S]*?)(?=\n|$)/g;
//     let match;
//
//     console.log('Input markdown:', markdown); // Отладка входных данных
//
//     while ((match = tableRegex.exec(markdown)) !== null) {
//       const headerLine = match[1].trim();
//       const rowLines = match[2].trim().split('\n');
//       const startIndex = match.index;
//       const endIndex = match.index + match[0].length;
//
//       console.log('Found table match:', { headerLine, rowLines, startIndex, endIndex }); // Отладка
//
//       // Парсинг заголовков
//       const headers = headerLine
//         .split('|')
//         .map(h => h.trim())
//         .filter(h => h !== ''); // Удаляем пустые
//
//       // Парсинг строк
//       const rows: string[][] = rowLines
//         .map(row => row.trim())
//         .filter(row => row.startsWith('|') && row.endsWith('|'))
//         .map(row => row
//           .slice(1, -1) // Удаляем | в начале и конце
//           .split('|')
//           .map(cell => cell.trim()));
//
//       console.log('Parsed headers:', headers); // Отладка
//       console.log('Parsed rows:', rows); // Отладка
//
//       // Проверяем, что таблица валидна
//       if (headers.length > 0 && rows.length > 0 && rows.every(row => row.length === headers.length)) {
//         tableBlocks.push({
//           headers,
//           rows,
//           startIndex,
//           endIndex
//         });
//       } else {
//         console.warn('Invalid table skipped:', { headers, rows }); // Отладка невалидных таблиц
//       }
//     }
//
//     console.log('Extracted table blocks:', tableBlocks); // Отладка результата
//     return tableBlocks;
//   }
// }

import { Injectable } from '@angular/core';
import { TableBlock } from '../../interfaces/markdown/md-table.interface';

@Injectable({
  providedIn: 'root'
})
export class MarkdownTableParserService {
  extractTableBlocks(markdown: string): TableBlock[] {
    const tableBlocks: TableBlock[] = [];
    const tableRegex = /\|(.+?)\|\n\|[-:|\s]+\|\n([\s\S]*?)(?=\n|$)/g;
    let match;

    console.log('Input markdown:', markdown);

    while ((match = tableRegex.exec(markdown)) !== null) {
      const headerLine = match[1].trim();
      const rowLines = match[2].trim().split('\n');
      const startIndex = match.index;
      const endIndex = match.index + match[0].length;

      console.log('Found table match:', { headerLine, rowLines, startIndex, endIndex });

      // Парсинг заголовков
      const headers = headerLine
        .split('|')
        .map(h => h.trim())
        .filter(h => h !== '');

      // Парсинг строк
      const rows: string[][] = rowLines
        .map(row => row.trim())
        .filter(row => row.startsWith('|') && row.endsWith('|'))
        .map(row => row
          .slice(1, -1)
          .split('|')
          .map(cell => cell.trim())); // Оставляем пустые ячейки

      console.log('Parsed headers:', headers);
      console.log('Parsed rows:', rows);

      // Проверяем, что таблица валидна
      if (headers.length > 0 && rows.length > 0 && rows.every(row => row.length === headers.length)) {
        tableBlocks.push({
          headers,
          rows,
          startIndex,
          endIndex
        });
      } else {
        console.warn('Invalid table skipped:', { headers, rows });
      }
    }

    console.log('Extracted table blocks:', tableBlocks);
    return tableBlocks;
  }
}