import { Injectable } from '@angular/core';
import {open} from "@tauri-apps/plugin-dialog";
import {readDir} from "@tauri-apps/plugin-fs";

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    async selectPath(directory: boolean = true, multiple: boolean = false): Promise<string | string[] | null> {
        try {
            const selectedPath = await open({
                directory,
                multiple
            });

            return selectedPath ? selectedPath : null;
        } catch (error) {
            return null;
        }
    }

    // Функция для проверки наличия папки .mnote внутри выбранной папки
    async hasOrionFolder(path: string): Promise<boolean> {
        try {
            // Чтение содержимого папки
            const entries = await readDir(path);
            // Проверяем, есть ли папка с именем .mnote
            const hasMnote = entries.some(entry => entry.isDirectory && entry.name === '.orion');
            return hasMnote;
        } catch (error) {
            return false;
        }
    }
}
