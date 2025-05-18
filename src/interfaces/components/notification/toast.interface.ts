export interface ToastOptions {
    type: 'success' | 'warning' | 'danger';
    title?: string;
    description?: string;
    duration?: number;
}