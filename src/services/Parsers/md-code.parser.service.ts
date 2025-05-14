import { Injectable } from '@angular/core';
import {CodeBlock} from "../../interfaces/markdown/md-code.interface";

@Injectable({
  providedIn: 'root'
})
export class MarkdownCodeParserService {
  extractCodeBlocks(markdown: string): CodeBlock[] {
    const codeBlocks: CodeBlock[] = [];
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)\n```/g;
    let match;

    while ((match = codeBlockRegex.exec(markdown)) !== null) {
      const language = match[1] || null;
      const code = match[2].trim();
      const startIndex = match.index;
      const endIndex = match.index + match[0].length;

      codeBlocks.push({
        language,
        code,
        startIndex,
        endIndex
      });
    }

    return codeBlocks;
  }
}