// markdown.service.ts
import { Injectable } from '@angular/core';
import {readTextFile, writeTextFile} from "@tauri-apps/plugin-fs";
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MarkdownService {
    private contentSubject = new BehaviorSubject<string>('');
    content$ = this.contentSubject.asObservable();

    async readMarkdownFile(filePath: string): Promise<void> {
        try {
            const content = await readTextFile(filePath);
            this.contentSubject.next(content);
        } catch (error) {
            console.error('Ошибка чтения Markdown файла:', error);
            this.contentSubject.next('');
        }
    }

    async saveMarkdownFile(filePath: string, content: string): Promise<void> {
        try {
            await writeTextFile(filePath, content);
            this.contentSubject.next(content);
        } catch (error) {
            console.error('Ошибка сохранения Markdown файла:', error);
        }
    }
}