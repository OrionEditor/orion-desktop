export class NetworkService {
    private static isOnline: boolean = navigator.onLine;

    /**
     * Проверяет, есть ли интернет-соединение.
     * @returns true, если есть соединение, false — если нет
     */
    public static getConnectionStatus(): boolean {
        return this.isOnline;
    }

    /**
     * Инициализирует отслеживание статуса сети.
     * Вызывайте этот метод один раз при старте приложения.
     */
    public static initialize(): void {
        window.addEventListener('online', () => {
            this.isOnline = true;
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
        });

        this.isOnline = navigator.onLine;
    }
}