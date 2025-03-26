// markdown-import.service.ts (альтернативная версия)
import { Injectable } from '@angular/core';
import { readTextFile, readFile, writeTextFile } from '@tauri-apps/plugin-fs';
import htmlToMd from 'html-to-md';
import pdf from 'pdf-parse';

@Injectable({
    providedIn: 'root'
})
export class MarkdownImportService {
    static async importFromHtml(filePath: string): Promise<string> {
        try {
            const htmlContent = await readTextFile(filePath);
            const markdownContent = htmlToMd(htmlContent);
            return markdownContent;
        } catch (error) {
            throw error;
        }
    }

    static async saveMarkdown(content: string, filePath: string): Promise<void> {
        try {
            await writeTextFile(filePath, content);
        } catch (error) {
            throw error;
        }
    }
}