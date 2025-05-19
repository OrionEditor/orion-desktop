// window.service.ts
import { Injectable } from '@angular/core';
import { invoke} from "@tauri-apps/api/core";
import {WebviewWindow} from "@tauri-apps/api/webviewWindow";

@Injectable({
    providedIn: 'root'
})
export class WindowService {
    async getWindowLabel(): Promise<string> {
        return await invoke('get_window_label');
    }

    async closeAllWindowsExProject(){
        await invoke('close_all_except_project_window');
    }

    async openProjectWindow(){
        try {
            await invoke('create_fullscreen_project_window');
        } catch (error) {
        }
    }

    async openLoginWindow(){
        try {
            await invoke('create_login_window');
        } catch (error) {
        }
    }

    async closeWindowByLabel(label: string): Promise<void> {
        try {
            await invoke('close_window_by_label', { label });
        } catch (error) {
            console.error(`Ошибка при закрытии окна с меткой ${label}:`, error);
            throw error;
        }
    }

    // Перезагрузить окно по метке
    // Перезагрузить окно по метке
    async reloadWindowByLabel(label: string): Promise<void> {
        try {
            // Получаем окно по метке
            const window = WebviewWindow.getByLabel(label);

            if (window) {
                // Выполняем перезагрузку окна
                await window.then(w => {
                    w?.emit('reload-window')
                })
                console.log(`Перезагрузка окна с меткой "${label}" инициирована.`);
            } else {
                console.error(`Окно с меткой "${label}" не найдено.`);
            }
        } catch (error) {
            console.error(`Ошибка при перезагрузке окна с меткой "${label}":`, error);
            throw error;
        }
    }

    static async reloadAllWindows() {
        try {
            await invoke('reload_all_windows');
            console.log('Команда перезагрузки всех окон отправлена');
        } catch (error) {
            console.error('Ошибка при вызове reload_all_windows:', error);
        }
    }
}
