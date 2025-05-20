import {invoke} from "@tauri-apps/api/core";

export class WorkspaceService {
    /**
     * Получает имя проекта из workspace.json.
     * @param workspacePath Путь к директории workspace.
     * @returns Имя проекта.
     */
    static async getProjectName(workspacePath: string): Promise<string> {
        try {
            const name = await invoke<string>('get_project_name', { workspacePath });
            console.log('Project Name:', name);
            return name;
        } catch (error) {
            console.error('Ошибка при получении имени проекта:', error);
            throw error;
        }
    }

    /**
     * Получает значение пресета из workspace.json.
     * @param workspacePath Путь к директории workspace.
     * @returns Значение пресета.
     */
    static async getPreset(workspacePath: string): Promise<number> {
        try {
            const preset = await invoke<number>('get_preset', { workspacePath });
            console.log('Preset:', preset);
            return preset;
        } catch (error) {
            console.error('Ошибка при получении пресета:', error);
            throw error;
        }
    }

    /**
     * Получает все активные вкладки из workspace.json.
     * @param workspacePath Путь к директории workspace.
     * @returns Массив путей активных вкладок.
     */
    static async getActiveTabs(workspacePath: string): Promise<string[]> {
        try {
            const tabs = await invoke<string[]>('get_active_tabs', { workspacePath });
            console.log('Active Tabs:', tabs);
            return tabs;
        } catch (error) {
            console.error('Ошибка при получении активных вкладок:', error);
            throw error;
        }
    }

    /**
     * Перезаписывает имя проекта в workspace.json.
     * @param workspacePath Путь к директории workspace.
     * @param newName Новое имя проекта.
     */
    static async setProjectName(workspacePath: string, newName: string): Promise<void> {
        try {
            await invoke('set_project_name', { workspacePath, newName });
            console.log('Имя проекта обновлено:', newName);
        } catch (error) {
            console.error('Ошибка при установке имени проекта:', error);
            throw error;
        }
    }

    /**
     * Перезаписывает пресет в workspace.json.
     * @param workspacePath Путь к директории workspace.
     * @param newPreset Новый пресет.
     */
    static async setPreset(workspacePath: string, newPreset: number): Promise<void> {
        try {
            await invoke('set_preset', { workspacePath, newPreset });
            console.log('Пресет обновлён:', newPreset);
        } catch (error) {
            console.error('Ошибка при установке пресета:', error);
            throw error;
        }
    }

    /**
     * Добавляет путь в active_tabs, если он ещё не присутствует.
     * @param workspacePath Путь к директории workspace.
     * @param tabPath Путь вкладки для добавления.
     */
    static async addActiveTab(workspacePath: string, tabPath: string): Promise<void> {
        try {
            await invoke('add_active_tab', { workspacePath, tabPath });
            console.log('Вкладка добавлена:', tabPath);
        } catch (error) {
            console.error('Ошибка при добавлении вкладки:', error);
            throw error;
        }
    }

    /**
     * Удаляет путь из active_tabs, если он присутствует.
     * @param workspacePath Путь к директории workspace.
     * @param tabPath Путь вкладки для удаления.
     */
    static async removeActiveTab(workspacePath: string, tabPath: string): Promise<void> {
        try {
            await invoke('remove_active_tab', { workspacePath, tabPath });
            console.log('Вкладка удалена:', tabPath);
        } catch (error) {
            console.error('Ошибка при удалении вкладки:', error);
            throw error;
        }
    }
}