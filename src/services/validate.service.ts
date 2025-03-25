import { Injectable } from '@angular/core';
import { exists } from '@tauri-apps/plugin-fs'; // Для проверки существования пути

@Injectable({
    providedIn: 'root',
})
export class ValidateService {

    // Валидация названия проекта
    validateProjectName(name: string): boolean {
        // Название не может быть пустым
        if (!name) {
            return false;
        }

        // Длина названия не может быть больше 50 символов
        if (name.length > 50) {
            return false;
        }

        // Название не может начинаться с цифры
        if (/^\d/.test(name)) {
            return false;
        }

        // Название не может содержать точку
        if (/\./.test(name)) {
            return false;
        }

        if (/[^a-zA-Zа-яА-Я0-9-_()]/.test(name)) {
            return false;
        }


        return true;
    }


    // Проверка существования пути к папке
    async validateProjectPath(path: string): Promise<boolean> {
        try {
            const result = await exists(path); // Проверка существования пути
            return result;
        } catch (error) {
            console.error('Ошибка при проверке пути:', error);
            return false;
        }
    }
}
