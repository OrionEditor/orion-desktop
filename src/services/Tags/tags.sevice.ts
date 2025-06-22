import { Injectable } from '@angular/core';
import {invoke} from "@tauri-apps/api/core";

export interface Tag {
    tag_id: string;
    tag_label: string;
    tag_color: string;
}

export interface ElementTag {
    elementPath: string;
    tagId: string;
}

@Injectable({
    providedIn: 'root'
})
export class TagService {

    private tags: Tag[] = [];
    private elementTags: ElementTag[] = [];

    /**
     * Возвращает локальный массив тегов.
     * @returns Массив тегов.
     */
    getLocalTags(): Tag[] {
        return this.tags;
    }

    /**
     * Синхронизирует локальные массивы тегов и их связей с бэкендом.
     * @param workspacePath Путь к директории workspace.
     */
    async syncTags(workspacePath: string): Promise<void> {
        try {
            this.tags = await this.getTags(workspacePath);
            this.elementTags = await this.getElementTags(workspacePath);
            console.log('Tags and element tags synchronized:', { tags: this.tags, elementTags: this.elementTags });
        } catch (error) {
            console.error('Ошибка при синхронизации тегов:', error);
            throw error;
        }
    }

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
            this.tags.push({tag_id: tagId, tag_label: tagLabel, tag_color: tagColor})
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
            this.tags = this.tags.filter(tag => tag.tag_id !== tagId);
            this.elementTags = this.elementTags.filter(et => et.tagId !== tagId);
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
            this.elementTags.push({ elementPath, tagId });
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
            this.elementTags = this.elementTags.filter(et => !(et.elementPath === elementPath && et.tagId === tagId));
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

    async getTagsByElementPath(workspacePath: string, elementPath: string): Promise<Tag[]> {
        try {
            const tags = await invoke<Tag[]>('get_tags_by_element_path', { workspacePath, elementPath });
            console.log('Tags retrieved for element:', { elementPath, tags });
            return tags;
        } catch (error) {
            console.error('Ошибка при получении тегов для элемента:', error);
            throw error;
        }
    }

    isTagAttached(elementPath: string, tagId: string): boolean {
        console.log(this.elementTags);
        return this.elementTags.some(et => et.elementPath === elementPath && et.tagId === tagId);
    }
}

// import { Injectable } from '@angular/core';
// import { invoke } from '@tauri-apps/api/core';
//
// export interface Tag {
//     tag_id: string;
//     tag_label: string;
//     tag_color: string;
// }
//
// export interface ElementTag {
//     elementPath: string;
//     tagId: string;
// }
//
// @Injectable({
//     providedIn: 'root'
// })
// export class TagService {
//     private tags: Tag[] = [];
//     private elementTags: ElementTag[] = [];
//
//     /**
//      * Синхронизирует локальные массивы тегов и их связей с бэкендом.
//      * @param workspacePath Путь к директории workspace.
//      */
//     async syncTags(workspacePath: string): Promise<void> {
//         try {
//             this.tags = await this.getTags(workspacePath);
//             this.elementTags = await this.getElementTags(workspacePath);
//             console.log('Tags and element tags synchronized:', { tags: this.tags, elementTags: this.elementTags });
//         } catch (error) {
//             console.error('Ошибка при синхронизации тегов:', error);
//             throw error;
//         }
//     }
//
//     /**
//      * Создаёт новый тег и обновляет локальный массив.
//      * @param workspacePath Путь к директории workspace.
//      * @param tagLabel Название тега.
//      * @param tagColor Цвет тега в формате HEX.
//      * @returns ID созданного тега.
//      */
//     async addTag(workspacePath: string, tagLabel: string, tagColor: string): Promise<string> {
//         try {
//             const tagId = await invoke<string>('add_tag', { workspacePath, tagLabel, tagColor });
//             this.tags.push({ tag_id: tagId, tag_label: tagLabel, tag_color: tagColor });
//             console.log('Tag created:', { tagId, tagLabel, tagColor });
//             return tagId;
//         } catch (error) {
//             console.error('Ошибка при создании тега:', error);
//             throw error;
//         }
//     }
//
//     /**
//      * Удаляет тег и все его связи, обновляет локальные массивы.
//      * @param workspacePath Путь к директории workspace.
//      * @param tagId ID тега.
//      */
//     async removeTag(workspacePath: string, tagId: string): Promise<void> {
//         try {
//             await invoke('remove_tag', { workspacePath, tagId });
//             this.tags = this.tags.filter(tag => tag.tag_id !== tagId);
//             this.elementTags = this.elementTags.filter(et => et.tagId !== tagId);
//             console.log('Tag deleted:', tagId);
//         } catch (error) {
//             console.error('Ошибка при удалении тега:', error);
//             throw error;
//         }
//     }
//
//     /**
//      * Получает список всех тегов.
//      * @param workspacePath Путь к директории workspace.
//      * @returns Массив тегов.
//      */
//     async getTags(workspacePath: string): Promise<Tag[]> {
//         try {
//             const tags = await invoke<Tag[]>('get_tags', { workspacePath });
//             console.log('Tags retrieved:', tags);
//             return tags;
//         } catch (error) {
//             console.error('Ошибка при получении тегов:', error);
//             throw error;
//         }
//     }
//
//     /**
//      * Возвращает локальный массив тегов.
//      * @returns Массив тегов.
//      */
//     getLocalTags(): Tag[] {
//         return this.tags;
//     }
//
//     /**
//      * Привязывает тег к файлу или папке, обновляет локальный массив.
//      * @param workspacePath Путь к директории workspace.
//      * @param elementPath Путь к файлу или папке.
//      * @param tagId ID тега.
//      */
//     async addTagToElement(workspacePath: string, elementPath: string, tagId: string): Promise<void> {
//         try {
//             await invoke('add_element_tag', { workspacePath, elementPath, tagId });
//             this.elementTags.push({ elementPath, tagId });
//             console.log('Tag assigned to element:', { elementPath, tagId });
//         } catch (error) {
//             console.error('Ошибка при привязке тега:', error);
//             throw error;
//         }
//     }
//
//     /**
//      * Удаляет связь тега с файлом или папкой, обновляет локальный массив.
//      * @param workspacePath Путь к директории workspace.
//      * @param elementPath Путь к файлу или папке.
//      * @param tagId ID тега.
//      */
//     async removeTagFromElement(workspacePath: string, elementPath: string, tagId: string): Promise<void> {
//         try {
//             await invoke('remove_element_tag', { workspacePath, elementPath, tagId });
//             this.elementTags = this.elementTags.filter(et => !(et.elementPath === elementPath && et.tagId === tagId));
//             console.log('Tag removed from element:', { elementPath, tagId });
//         } catch (error) {
//             console.error('Ошибка при удалении связи тега:', error);
//             throw error;
//         }
//     }
//
//     /**
//      * Получает список всех связей тегов с элементами.
//      * @param workspacePath Путь к директории workspace.
//      * @returns Массив связей.
//      */
//     async getElementTags(workspacePath: string): Promise<ElementTag[]> {
//         try {
//             const elementTags = await invoke<ElementTag[]>('get_element_tags', { workspacePath });
//             console.log('Element tags retrieved:', elementTags);
//             return elementTags;
//         } catch (error) {
//             console.error('Ошибка при получении связей тегов:', error);
//             throw error;
//         }
//     }
//
//     /**
//      * Возвращает локальный массив связей тегов с элементами.
//      * @returns Массив связей.
//      */
//     getLocalElementTags(): ElementTag[] {
//         return this.elementTags;
//     }
//
//     /**
//      * Получает список всех тегов, привязанных к элементу по его пути, из локального состояния.
//      * @param workspacePath Путь к директории workspace.
//      * @param elementPath Путь к файлу или папке.
//      * @returns Массив тегов, привязанных к элементу.
//      */
//     getTagsByElementPath(workspacePath: string, elementPath: string): Tag[] {
//         try {
//             const tagIds = this.elementTags
//                 .filter(et => et.elementPath === elementPath)
//                 .map(et => et.tagId);
//             const tags = this.tags.filter(tag => tagIds.includes(tag.tag_id));
//             console.log('Tags retrieved for element:', { elementPath, tags });
//             return tags;
//         } catch (error) {
//             console.error('Ошибка при получении тегов для элемента:', error);
//             return [];
//         }
//     }
// }