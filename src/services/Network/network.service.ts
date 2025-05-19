import {BehaviorSubject} from "rxjs";

export class NetworkService {
    private static isOnlineSubject = new BehaviorSubject<boolean>(navigator.onLine);
    private static checkInterval = 5000; // Проверка каждые 5 секунд
    private static intervalId: any = null;

    /**
     * Проверяет, есть ли интернет-соединение.
     * @returns Observable с текущим статусом соединения
     */
    public static getConnectionStatus() {
        return this.isOnlineSubject.asObservable();
    }

    /**
     * Инициализирует отслеживание статуса сети.
     * Вызывайте этот метод один раз при старте приложения.
     */
    public static initialize(): void {
        console.log('NetworkService initialized');
        this.checkConnection();
        this.intervalId = setInterval(() => this.checkConnection(), this.checkInterval);

        // Для совместимости добавим события online/offline, но они вторичны
        window.addEventListener('online', () => {
            // console.log('Browser event: online');
            this.isOnlineSubject.next(true);
        });

        window.addEventListener('offline', () => {
            // console.log('Browser event: offline');
            this.isOnlineSubject.next(false);
        });
    }

    /**
     * Останавливает проверку соединения.
     * Вызывайте при завершении приложения или компонента, если нужно.
     */
    public static destroy(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            // console.log('NetworkService destroyed');
        }
    }

    /**
     * Проверяет соединение путём отправки запроса.
     * Обновляет isOnlineSubject в зависимости от результата.
     */
    private static checkConnection(): void {
        console.log('Checking network connection...');
        fetch('https://www.google.com', { mode: 'no-cors' })
            .then(() => {
                // console.log('Network check: Online');
                if (!this.isOnlineSubject.getValue()) {
                    this.isOnlineSubject.next(true);
                }
            })
            .catch(() => {
                // console.log('Network check: Offline');
                if (this.isOnlineSubject.getValue()) {
                    this.isOnlineSubject.next(false);
                }
            });
    }
}