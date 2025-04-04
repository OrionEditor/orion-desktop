import { Injectable } from '@angular/core';
import { MarkdownFiles } from '../../interfaces/markdown/markdownFiles.interface';
import {invoke} from "@tauri-apps/api/core";

@Injectable({
    providedIn: 'root'
})
export class MarkdownFilesService {
    private static markdownFiles: MarkdownFiles | null = null;
    private static initializationPromise: Promise<void> | null = null;

    public static async initialize(): Promise<void> {
        if (this.markdownFiles) {
            return;
        }

        if (!this.initializationPromise) {
            this.initializationPromise = invoke<MarkdownFiles>('initialize_markdown_files')
                .then((files) => {
                    this.markdownFiles = files;
                })
                .catch((error) => {
                    this.markdownFiles = null;
                })
                .finally(() => {
                    this.initializationPromise = null;
                });
        }

        await this.initializationPromise;
    }

    public static async getMarkdownFiles(): Promise<MarkdownFiles> {
        await this.initialize();
        if (!this.markdownFiles) {
            throw new Error('Markdown files not initialized');
        }
        return this.markdownFiles;
    }

    public static async getFileContent(filePath: string): Promise<string> {
        return invoke<string>('get_markdown_file_content', { filePath });
    }

    public static async getFilePath(type: string, language: string): Promise<string> {
        const files = await this.getMarkdownFiles();
        const key = `${type}_${language}_path`;
        return files[key] || '';
    }
}