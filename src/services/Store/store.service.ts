import { load, Store } from '@tauri-apps/plugin-store';
import { v4 as uuidv4 } from 'uuid';
import {ToastService} from "../Notifications/toast.service";

// Функция для создания ключа фиксированной длины (32 байта) из произвольной строки
async function deriveKey(key: string): Promise<Uint8Array> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);
    const hash = await crypto.subtle.digest('SHA-256', keyData); // SHA-256 даёт 32 байта
    return new Uint8Array(hash);
}

async function encryptData(data: string, key: string): Promise<string> {
    const encoder = new TextEncoder();
    const keyData = await deriveKey(key); // Получаем 32 байта из ключа
    const iv = crypto.getRandomValues(new Uint8Array(16)); // Инициализационный вектор
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'AES-CBC' },
        false,
        ['encrypt']
    );
    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-CBC', iv },
        cryptoKey,
        encoder.encode(data)
    );
    const encryptedArray = new Uint8Array(encrypted);
    return btoa(String.fromCharCode(...iv, ...encryptedArray)); // Base64 с IV
}

async function decryptData(encrypted: string, key: string): Promise<string> {
    const decoder = new TextDecoder();
    const keyData = await deriveKey(key); // Получаем 32 байта из ключа
    const data = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
    const iv = data.slice(0, 16);
    const encryptedData = data.slice(16);
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'AES-CBC' },
        false,
        ['decrypt']
    );
    const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-CBC', iv },
        cryptoKey,
        encryptedData
    );
    return decoder.decode(decrypted);
}

export class StoreService {
    private static store: Store | null = null;
    private static encryptionKey: string | null = null;

    static async initialize(): Promise<void> {
        if (this.store) return;

        let key = localStorage.getItem('storeKey');
        if (!key) {
            key = uuidv4(); // Генерируем ключ один раз
            localStorage.setItem('storeKey', key);
        }
        this.encryptionKey = key;

        this.store = await load('auth.store', { autoSave: false });
    }

    static async save(key: string, value: string): Promise<void> {
        if (!this.store) await this.initialize();
        try {
            const encrypted = await encryptData(value, this.encryptionKey!);
            if(this.store){
                await this.store.set(key, encrypted);
                await this.store.save();
            }
        } catch (e) {
            // ToastService.danger(`Ошибка при сохранении ${key} в Store!`);
            throw e;
        }
    }

    static async get(key: string): Promise<string | null> {
        if (!this.store) await this.initialize();
        try {
            // @ts-ignore
            const encrypted = await this.store.get<string>(key);
            if (!encrypted) return null;
            return await decryptData(encrypted, this.encryptionKey!);
        } catch (e) {
            // ToastService.danger(`Ошибка при получении ${key} из Store!`);
            return null;
        }
    }

    static async remove(key: string): Promise<void> {
        if (!this.store) await this.initialize();
        try {
            if(this.store){
                await this.store.delete(key);
                await this.store.save();
            }
        } catch (e) {
            // ToastService.danger(`Ошибка при удалении ${key} из Store!`);
            throw e;
        }
    }

    static async clear(): Promise<void> {
        if (!this.store) await this.initialize();
        try {
            if(this.store){
                await this.store.clear();
                await this.store.save();
            }
        } catch (e) {
            // ToastService.danger('Ошибка при очистке Store!');
            throw e;
        }
    }
}