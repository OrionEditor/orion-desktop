import { Injectable } from '@angular/core';
import { invoke } from "@tauri-apps/api/core";
import {Project, Config} from "../interfaces/config.interface";

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    private config: Config | null = null;
    constructor() {}

    // Метод для загрузки конфигурации, который вызывается один раз
    async loadConfig() {
        try {
            // Загружаем все данные конфигурации
            this.config = {
                recent_projects: await invoke<Array<Project>>('get_recent_projects'),
                theme: await invoke<string>('get_theme'),
                last_opened: await invoke<string | null>('get_last_opened'),
                language: await invoke<string>('get_language')
            };

            console.log('Configuration loaded:', this.config);
        } catch (error) {
            console.error('Error loading configuration:', error);
        }
    }

    // Метод для получения темы из конфигурации
    getTheme(): string {
        return this.config ? this.config.theme : '';
    }

    // Метод для получения других данных конфигурации
    getConfig(): Config | null {
        return this.config;
    }

    async toggleTheme() {
        try {
            await invoke('toggle_theme');
            // Обновите тему в текущей конфигурации
            if (this.config) {
                this.config.theme = this.config.theme === 'dark' ? 'light' : 'dark';
            }
        } catch (error) {
            console.error('Error toggling theme:', error);
        }
    }

    getLanguage(): string {
        return this.config ? this.config.language : '';
    }

    async setLanguage(language: string) {
        try {
            await invoke('set_language', { language });
            if (this.config) {
                this.config.language = language;
            }
        } catch (error) {
            console.error('Error setting language:', error);
        }
    }

    async setLastOpened(path: string) {
        try {
            invoke('set_last_opened', { path })
                .then(() => {
                })
                .catch((error) => {
                });
            if (this.config) {
                this.config.last_opened = path;
            }
        } catch (error) {
            console.error('Error setting path:', error);
        }
    }

    getLastOpened(): string | null {
        return this.config ? this.config.last_opened : '';
    }
}
