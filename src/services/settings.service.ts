import { Settings } from '../interfaces/settings.interface';
import { invoke } from '@tauri-apps/api/core';

export class SettingsService {
    private static readonly SETTINGS_KEY = 'markdown_settings';
    private static settings: Settings = {
        general: {
            language: 'ru',
            theme: 'dark',
            autoSaveInterval: 5
        },
        editor: {
            fontSize: 14,
            lineNumbers: true,
            wordWrap: false,
            defaultView: 'two-side'
        },
        account: {
            isLoggedIn: false,
            username: null,
            email: null,
            syncEnabled: false
        }
    };

    public static async loadSettings(): Promise<void> {
        const storedSettings = localStorage.getItem(this.SETTINGS_KEY);
        if (storedSettings) {
            try {
                const parsedSettings = JSON.parse(storedSettings);
                this.settings = {
                    general: { ...this.settings.general, ...parsedSettings.general },
                    editor: { ...this.settings.editor, ...parsedSettings.editor },
                    account: { ...this.settings.account, ...parsedSettings.account }
                };
            } catch (error) {
                console.error('Ошибка при загрузке настроек:', error);
                this.saveSettings();
            }
        }

        try {
            const configLanguage = await invoke<string>('get_language');
            const configTheme = await invoke<string>('get_theme');
            this.settings.general.language = configLanguage || this.settings.general.language;
            this.settings.general.theme = configTheme || this.settings.general.theme;
        } catch (error) {
            console.error('Ошибка при загрузке настроек из Config:', error);
        }
    }

    public static saveSettings(): void {
        localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(this.settings));
        // Синхронизация с ConfigService
        invoke('set_language', { language: this.settings.general.language }).catch(err =>
            console.error('Ошибка при сохранении языка:', err)
        );
        invoke('toggle_theme', { theme: this.settings.general.theme }).catch(err =>
            console.error('Ошибка при сохранении темы:', err)
        );
    }

    public static getAllSettings(): Settings {
        return {
            general: { ...this.settings.general },
            editor: { ...this.settings.editor },
            account: { ...this.settings.account }
        };
    }

    // Геттеры и сеттеры для general
    public static getLanguage(): string {
        return this.settings.general.language;
    }
    public static setLanguage(language: string): void {
        this.settings.general.language = language;
        this.saveSettings();
    }

    public static getTheme(): string {
        return this.settings.general.theme;
    }
    public static setTheme(theme: string): void {
        this.settings.general.theme = theme;
        this.saveSettings();
    }

    public static getAutoSaveInterval(): number {
        return this.settings.general.autoSaveInterval;
    }
    public static setAutoSaveInterval(minutes: number): void {
        this.settings.general.autoSaveInterval = Math.max(1, Math.min(60, minutes));
        this.saveSettings();
    }

    // Геттеры и сеттеры для editor
    public static getFontSize(): number {
        return this.settings.editor.fontSize;
    }
    public static setFontSize(size: number): void {
        this.settings.editor.fontSize = Math.max(8, Math.min(24, size));
        this.saveSettings();
    }

    public static getLineNumbers(): boolean {
        return this.settings.editor.lineNumbers;
    }
    public static setLineNumbers(enabled: boolean): void {
        this.settings.editor.lineNumbers = enabled;
        this.saveSettings();
    }

    public static getWordWrap(): boolean {
        return this.settings.editor.wordWrap;
    }
    public static setWordWrap(enabled: boolean): void {
        this.settings.editor.wordWrap = enabled;
        this.saveSettings();
    }

    public static getDefaultView(): string {
        return this.settings.editor.defaultView;
    }
    public static setDefaultView(view: string): void {
        this.settings.editor.defaultView = view === 'one-side' ? 'one-side' : 'two-side';
        this.saveSettings();
    }

    // Геттеры и сеттеры для account
    public static getIsLoggedIn(): boolean {
        return this.settings.account.isLoggedIn;
    }
    public static setIsLoggedIn(loggedIn: boolean): void {
        this.settings.account.isLoggedIn = loggedIn;
        this.saveSettings();
    }

    public static getUsername(): string | null {
        return this.settings.account.username;
    }
    public static setUsername(username: string | null): void {
        this.settings.account.username = username;
        this.saveSettings();
    }

    public static getEmail(): string | null {
        return this.settings.account.email;
    }
    public static setEmail(email: string | null): void {
        this.settings.account.email = email;
        this.saveSettings();
    }

    public static getSyncEnabled(): boolean {
        return this.settings.account.syncEnabled;
    }
    public static setSyncEnabled(enabled: boolean): void {
        this.settings.account.syncEnabled = enabled;
        this.saveSettings();
    }
}