import { Injectable } from '@angular/core';
import { invoke} from "@tauri-apps/api/core";

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    // Глобальная переменная для хранения токена
    private static token: string | null = null;
    // Установить токен
    static async saveAuthToken(token: string): Promise<void> {
        try {
            this.token = token; // Сохраняем токен в памяти
            await invoke('set_auth_token', { token });
        } catch (error) {
            console.error('Ошибка при сохранении токена:', error);
            throw error;
        }
    }

    // Получить токен
    static async getAuthToken(): Promise<string | null> {
        try {
            if (this.token) {
                return this.token; // Если токен уже есть в памяти, возвращаем его
            }
            // Если токена нет в памяти, загружаем его из хранилища
            this.token = await invoke<string | null>('get_auth_token');
            return this.token;
        } catch (error) {
            console.error('Ошибка при получении токена:', error);
            throw error;
        }
    }

    // Очистить токен
    static async clearAuthToken(): Promise<void> {
        try {
            this.token = null; // Очищаем токен в памяти
            await invoke('clear_auth_token');
        } catch (error) {
            console.error('Ошибка при очистке токена:', error);
            throw error;
        }
    }

    // Проверить наличие токена
    static async hasAuthToken(): Promise<boolean> {
        try {
            const token = await this.getAuthToken(); // Пытаемся получить токен
            return token !== null; // Возвращаем true, если токен существует
        } catch (error) {
            console.error('Ошибка при проверке наличия токена:', error);
            return false; // В случае ошибки возвращаем false
        }
    }
}
