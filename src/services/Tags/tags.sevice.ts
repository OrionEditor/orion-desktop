import { Injectable } from '@angular/core';
import {invoke} from "@tauri-apps/api/core";

interface Tag {
    tagId: string;
    tagLabel: string;
    tagColor: string;
}

interface ElementTag {
    elementPath: string;
    tagId: string;
}

@Injectable({
    providedIn: 'root'
})
export class TagService {
    /**
     * Создаёт новый тег.
     * @param workspacePath Путь к директории workspace.
     * @param tagLabel Название тега.
     * @param tagColor Цвет тега в формате HEX.
     * @returns ID созданного тега.
     */
    async addTag(workspacePath: string, tagLabel: string, tagColor: string): Promise<string> {
        try {
            const tagId = await invoke<string>('add_tag', { workspacePath, tagLabel, tagColor });
            console.log('Tag created:', { tagId, tagLabel, tagColor });
            return tagId;
        } catch (error) {
            console.error('Ошибка при создании тега:', error);
            throw error;
        }
    }

    /**
     * Удаляет тег и все его связи.
     * @param workspacePath Путь к директории workspace.
     * @param tagId ID тега.
     */
    async removeTag(workspacePath: string, tagId: string): Promise<void> {
        try {
            await invoke('remove_tag', { workspacePath, tagId });
            console.log('Tag deleted:', tagId);
        } catch (error) {
            console.error('Ошибка при удалении тега:', error);
            throw error;
        }
    }

    /**
     * Получает список всех тегов.
     * @param workspacePath Путь к директории workspace.
     * @returns Массив тегов.
     */
    async getTags(workspacePath: string): Promise<Tag[]> {
        try {
            const tags = await invoke<Tag[]>('get_tags', { workspacePath });
            console.log('Tags retrieved:', tags);
            return tags;
        } catch (error) {
            console.error('Ошибка при получении тегов:', error);
            throw error;
        }
    }

    /**
     * Привязывает тег к файлу или папке.
     * @param workspacePath Путь к директории workspace.
     * @param elementPath Путь к файлу или папке.
     * @param tagId ID тега.
     */
    async addTagToElement(workspacePath: string, elementPath: string, tagId: string): Promise<void> {
        try {
            await invoke('add_element_tag', { workspacePath, elementPath, tagId });
            console.log('Tag assigned to element:', { elementPath, tagId });
        } catch (error) {
            console.error('Ошибка при привязке тега:', error);
            throw error;
        }
    }

    /**
     * Удаляет связь тега с файлом или папкой.
     * @param workspacePath Путь к директории workspace.
     * @param elementPath Путь к файлу или папке.
     * @param tagId ID тега.
     */
    async removeTagFromElement(workspacePath: string, elementPath: string, tagId: string): Promise<void> {
        try {
            await invoke('remove_element_tag', { workspacePath, elementPath, tagId });
            console.log('Tag removed from element:', { elementPath, tagId });
        } catch (error) {
            console.error('Ошибка при удалении связи тега:', error);
            throw error;
        }
    }

    /**
     * Получает список всех связей тегов с элементами.
     * @param workspacePath Путь к директории workspace.
     * @returns Массив связей.
     */
    async getElementTags(workspacePath: string): Promise<ElementTag[]> {
        try {
            const elementTags = await invoke<ElementTag[]>('get_element_tags', { workspacePath });
            console.log('Element tags retrieved:', elementTags);
            return elementTags;
        } catch (error) {
            console.error('Ошибка при получении связей тегов:', error);
            throw error;
        }
    }
}