import { Injectable } from '@angular/core';
import {TableBlock} from "../../interfaces/markdown/md-table.interface";

@Injectable({
  providedIn: 'root'
})
export class MarkdownTableParserService {
  extractTableBlocks(markdown: string): TableBlock[] {
    const tableBlocks: TableBlock[] = [];
    const tableRegex = /\|(.+?)\|\n\|[-:\s]+\|\n([\s\S]*?)(?=\n{2,}|$)/g;
    let match;

    while ((match = tableRegex.exec(markdown)) !== null) {
      const headerLine = match[1].trim();
      const rowLines = match[2].trim().split('\n');
      const startIndex = match.index;
      const endIndex = match.index + match[0].length;

      // Парсинг заголовков
      const headers = headerLine
        .split('|')
        .map(h => h.trim())
        .filter(h => h); // Удаляем пустые

      // Парсинг строк
      const rows: string[][] = rowLines
        .map(row => row.trim())
        .filter(row => row.startsWith('|') && row.endsWith('|'))
        .map(row => row.slice(1, -1) // Удаляем | в начале и конце
          .split('|')
          .map(cell => cell.trim())
          .filter(cell => cell !== '')); // Удаляем пустые ячейки

      // Проверяем, что таблица валидна
      if (headers.length > 0 && rows.length > 0 && rows.every(row => row.length === headers.length)) {
        tableBlocks.push({
          headers,
          rows,
          startIndex,
          endIndex
        });
      }
    }

    return tableBlocks;
  }
}