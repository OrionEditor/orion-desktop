// import { ToastService } from '../notification/toast.service';
//
// export class CryptoAesGcmService {
//     // Преобразование строки в ArrayBuffer
//     private static stringToArrayBuffer(str: string): ArrayBuffer {
//         const encoder = new TextEncoder();
//         return encoder.encode(str).buffer;
//     }
//
//     // Преобразование ArrayBuffer в строку
//     private static arrayBufferToString(buffer: ArrayBuffer): string {
//         const decoder = new TextDecoder();
//         return decoder.decode(buffer);
//     }
//
//     // Преобразование base64 IV в Uint8Array
//     private static base64ToUint8Array(base64: string): Uint8Array {
//         const binaryString = atob(base64);
//         const bytes = new Uint8Array(binaryString.length);
//         for (let i = 0; i < binaryString.length; i++) {
//             bytes[i] = binaryString.charCodeAt(i);
//         }
//         return bytes;
//     }
//
//     // Преобразование ключа в CryptoKey
//     private static async getCryptoKey(key: string): Promise<CryptoKey> {
//         const keyBuffer = this.stringToArrayBuffer(key);
//         return crypto.subtle.importKey(
//             'raw',
//             keyBuffer,
//             { name: 'AES-GCM' },
//             false,
//             ['encrypt', 'decrypt']
//         );
//     }
//
//     // Шифрование строки
//     static async encrypt(plaintext: string, key: string, ivBase64: string): Promise<string> {
//         try {
//             const iv = this.base64ToUint8Array(ivBase64);
//             const cryptoKey = await this.getCryptoKey(key);
//             const data = this.stringToArrayBuffer(plaintext);
//
//             const encrypted = await crypto.subtle.encrypt(
//                 {
//                     name: 'AES-GCM',
//                     iv: iv,
//                     tagLength: 128 // Стандартная длина тега для GCM
//                 },
//                 cryptoKey,
//                 data
//             );
//
//             // Преобразуем зашифрованные данные в base64 для удобного хранения
//             const encryptedArray = new Uint8Array(encrypted);
//             const binaryString = String.fromCharCode(...encryptedArray);
//             return btoa(binaryString);
//         } catch (e) {
//             const errorMessage = 'Ошибка при шифровании данных!';
//             ToastService.danger(errorMessage);
//             throw new Error(errorMessage);
//         }
//     }
//
//     // Расшифровка строки
//     static async decrypt(ciphertext: string, key: string, ivBase64: string): Promise<string> {
//         try {
//             const iv = this.base64ToUint8Array(ivBase64);
//             const cryptoKey = await this.getCryptoKey(key);
//
//             // Декодируем base64 в ArrayBuffer
//             const binaryString = atob(ciphertext);
//             const encryptedData = new Uint8Array(binaryString.length);
//             for (let i = 0; i < binaryString.length; i++) {
//                 encryptedData[i] = binaryString.charCodeAt(i);
//             }
//
//             const decrypted = await crypto.subtle.decrypt(
//                 {
//                     name: 'AES-GCM',
//                     iv: iv,
//                     tagLength: 128
//                 },
//                 cryptoKey,
//                 encryptedData
//             );
//
//             return this.arrayBufferToString(decrypted);
//         } catch (e) {
//             const errorMessage = 'Ошибка при расшифровке данных!';
//             ToastService.danger(errorMessage);
//             throw new Error(errorMessage);
//         }
//     }
// }

// import { ToastService } from '../notification/toast.service';
//
// export class CryptoAesGcmService {
//     // Преобразование строки в ArrayBuffer
//     private static stringToArrayBuffer(str: string): ArrayBuffer {
//         const encoder = new TextEncoder();
//         return encoder.encode(str).buffer;
//     }
//
//     // Преобразование ArrayBuffer в строку
//     private static arrayBufferToString(buffer: ArrayBuffer): string {
//         const decoder = new TextDecoder();
//         return decoder.decode(buffer);
//     }
//
//     // Преобразование base64 IV в Uint8Array
//     private static base64ToUint8Array(base64: string): Uint8Array {
//         const binaryString = atob(base64);
//         const bytes = new Uint8Array(binaryString.length);
//         for (let i = 0; i < binaryString.length; i++) {
//             bytes[i] = binaryString.charCodeAt(i);
//         }
//         return bytes;
//     }
//
//     // Преобразование ключа в CryptoKey с проверкой длины
//     private static async getCryptoKey(key: string): Promise<CryptoKey> {
//         const encoder = new TextEncoder();
//         let keyBytes = encoder.encode(key);
//         const requiredLength = 32; // Для AES-256 требуется 32 байта
//
//         // Проверяем длину ключа
//         if (keyBytes.length < requiredLength) {
//             // Добавляем фиксированную соль
//             const saltedKey = `durman-${key}`;
//             keyBytes = encoder.encode(saltedKey);
//
//             // Если всё ещё короткий, повторяем строку до нужной длины
//             let finalKey = saltedKey;
//             while (encoder.encode(finalKey).length < requiredLength) {
//                 finalKey += saltedKey;
//             }
//
//             // Обрезаем до точной длины
//             keyBytes = encoder.encode(finalKey).slice(0, requiredLength);
//         } else if (keyBytes.length > requiredLength) {
//             // Обрезаем, если слишком длинный
//             keyBytes = keyBytes.slice(0, requiredLength);
//         }
//
//         return crypto.subtle.importKey(
//             'raw',
//             keyBytes,
//             { name: 'AES-GCM' },
//             false,
//             ['encrypt', 'decrypt']
//         );
//     }
//
//     // Шифрование строки
//     static async encrypt(plaintext: string, key: string, ivBase64: string): Promise<string> {
//         try {
//             const iv = this.base64ToUint8Array(ivBase64);
//             const cryptoKey = await this.getCryptoKey(key);
//             const data = this.stringToArrayBuffer(plaintext);
//
//             const encrypted = await crypto.subtle.encrypt(
//                 {
//                     name: 'AES-GCM',
//                     iv: iv,
//                     tagLength: 128 // Стандартная длина тега для GCM
//                 },
//                 cryptoKey,
//                 data
//             );
//
//             // Преобразуем зашифрованные данные в base64 для удобного хранения
//             const encryptedArray = new Uint8Array(encrypted);
//             const binaryString = String.fromCharCode(...encryptedArray);
//             return btoa(binaryString);
//         } catch (e) {
//             const errorMessage = 'Ошибка при шифровании данных!';
//             ToastService.danger(errorMessage);
//             throw new Error(errorMessage);
//         }
//     }
//
//     // Расшифровка строки
//     static async decrypt(ciphertext: string, key: string, ivBase64: string): Promise<string> {
//         try {
//             const iv = this.base64ToUint8Array(ivBase64);
//             const cryptoKey = await this.getCryptoKey(key);
//
//             // Декодируем base64 в ArrayBuffer
//             const binaryString = atob(ciphertext);
//             const encryptedData = new Uint8Array(binaryString.length);
//             for (let i = 0; i < binaryString.length; i++) {
//                 encryptedData[i] = binaryString.charCodeAt(i);
//             }
//
//             const decrypted = await crypto.subtle.decrypt(
//                 {
//                     name: 'AES-GCM',
//                     iv: iv,
//                     tagLength: 128
//                 },
//                 cryptoKey,
//                 encryptedData
//             );
//
//             return this.arrayBufferToString(decrypted);
//         } catch (e) {
//             const errorMessage = 'Ошибка при расшифровке данных!';
//             ToastService.danger(errorMessage);
//             throw new Error(errorMessage);
//         }
//     }
// }

export class CryptoAesGcmService {
    // Преобразование строки в ArrayBuffer
    private static stringToArrayBuffer(str: string): ArrayBuffer {
        const encoder = new TextEncoder();
        return encoder.encode(str).buffer;
    }

    // Преобразование ArrayBuffer в строку
    private static arrayBufferToString(buffer: ArrayBuffer): string {
        const decoder = new TextDecoder();
        return decoder.decode(buffer);
    }

    // Преобразование base64 IV в Uint8Array
    private static base64ToUint8Array(base64: string): Uint8Array {
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }

    // Преобразование ключа в CryptoKey с использованием SHA-256
    private static async getCryptoKey(key: string): Promise<CryptoKey> {
        // Преобразуем пароль в ArrayBuffer
        const keyBuffer = this.stringToArrayBuffer(key);

        // Вычисляем SHA-256 хеш пароля (всегда 32 байта)
        const hashBuffer = await crypto.subtle.digest('SHA-256', keyBuffer);

        // Импортируем хеш как ключ для AES-GCM
        return crypto.subtle.importKey(
            'raw',
            hashBuffer,
            { name: 'AES-GCM' },
            false,
            ['encrypt', 'decrypt']
        );
    }

    // Шифрование строки
    static async encrypt(plaintext: string, key: string, ivBase64: string): Promise<string> {
        try {
            const iv = this.base64ToUint8Array(ivBase64);
            const cryptoKey = await this.getCryptoKey(key);
            const data = this.stringToArrayBuffer(plaintext);

            const encrypted = await crypto.subtle.encrypt(
                {
                    name: 'AES-GCM',
                    iv: iv,
                    tagLength: 128 // Стандартная длина тега для GCM
                },
                cryptoKey,
                data
            );

            // Преобразуем зашифрованные данные в base64 для удобного хранения
            const encryptedArray = new Uint8Array(encrypted);
            const binaryString = String.fromCharCode(...encryptedArray);
            return btoa(binaryString);
        } catch (e) {
            throw new Error('Ошибка при шифровании данных!');
        }
    }

    // Расшифровка строки
    static async decrypt(ciphertext: string, key: string, ivBase64: string): Promise<string> {
        try {
            const iv = this.base64ToUint8Array(ivBase64);
            const cryptoKey = await this.getCryptoKey(key);

            // Декодируем base64 в ArrayBuffer
            const binaryString = atob(ciphertext);
            const encryptedData = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                encryptedData[i] = binaryString.charCodeAt(i);
            }

            const decrypted = await crypto.subtle.decrypt(
                {
                    name: 'AES-GCM',
                    iv: iv,
                    tagLength: 128
                },
                cryptoKey,
                encryptedData
            );

            return this.arrayBufferToString(decrypted);
        } catch (e) {
            throw new Error('Ошибка при расшифровке данных!');
        }
    }
}