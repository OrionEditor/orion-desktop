import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root', // Глобальный провайдер
})
export class UploadService {
    isUploading = false; // Глобальный флаг загрузки
    progress = 0; // Глобальный прогресс загрузки

    /**
     * Запускает процесс загрузки.
     */
    startUpload() {
        this.isUploading = true;
        this.progress = 0;
    }

    /**
     * Обновляет прогресс загрузки.
     * @param value Новое значение прогресса (в процентах)
     */
    updateProgress(value: number) {
        this.progress = value;
    }

    /**
     * Завершает процесс загрузки.
     */
    finishUpload() {
        this.isUploading = false;
        this.progress = 100;
    }

    /**
     * Выполняет задачи по этапам и обновляет прогресс.
     * @param tasks Массив задач (этапов), каждая возвращает промис
     */
    async executeWithProgress(tasks: (() => Promise<void>)[]) {
        this.startUpload();

        const totalTasks = tasks.length;

        for (let i = 0; i < totalTasks; i++) {
            await tasks[i](); // Выполнение текущего этапа
            const progress = Math.round(((i + 1) / totalTasks) * 100); // Вычисление прогресса
            this.updateProgress(progress); // Обновление прогресса
        }

        this.finishUpload();
    }
}