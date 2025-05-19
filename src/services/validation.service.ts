import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ValidationService {
    validateEmail(email: string): boolean {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    validateUsername(username: string): boolean {
        return !!(username && username.length >= 3);
    }

    validatePassword(password: string): boolean {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password); // Проверка на заглавную букву
        // const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password); // Проверка на спецсимвол
        return !!(password && password.length >= minLength && hasUpperCase);
    }

    validateFileFolderName(fileName: string): boolean {
        // Максимальная длина имени файла
        const maxLength = 240;

        // Недопустимые символы
        const forbiddenChars = /[\\/:*?"<>|]/;

        if(fileName.length === 0){
            return false;
        }

        // Проверяем условия
        if (!fileName || fileName.length > maxLength) {
            return false; // Имя файла не должно быть пустым и превышать 255 символов
        }

        if (forbiddenChars.test(fileName)) {
            return false; // Имя файла не должно содержать недопустимые символы
        }

        if (fileName.trim().length === 0) {
            return false; // Имя файла не может состоять только из пробелов
        }

        if (fileName === '.' || fileName === '..') {
            return false; // Запрещённые имена файлов "." и ".."
        }

        return true; // Имя файла соответствует правилам
    }

}