import { ApplicationRef, ComponentRef, EnvironmentInjector, createComponent } from '@angular/core';
import {ToastOptions} from "../../interfaces/components/notification/toast.interface";
import {ToastComponent} from "../../ui/components/notifications/toast/toast.component";

export class ToastService {
    private static toastContainer: HTMLElement | null = null;
    private static toasts: ComponentRef<ToastComponent>[] = [];
    private static appRef: ApplicationRef | null = null;
    private static injector: EnvironmentInjector | null = null;

    public static initialize(appRef: ApplicationRef, injector: EnvironmentInjector): void {
        this.appRef = appRef;
        this.injector = injector;

        if (!this.toastContainer) {
            this.toastContainer = document.createElement('div');
            this.toastContainer.className = 'toast-container';
            document.body.appendChild(this.toastContainer);
        }
    }

    public static show(options: ToastOptions): void {
        if (!this.appRef || !this.injector || !this.toastContainer) {
            console.error('ToastService не инициализирован. Вызовите ToastService.initialize в корневом компоненте.');
            return;
        }

        const { type, title, description, duration = 3000 } = options;

        // Создаём новый тост
        const toastRef = createComponent(ToastComponent, {
            environmentInjector: this.injector,
            hostElement: this.toastContainer
        });

        toastRef.instance.isVisible = true;

        // Настраиваем входные параметры
        toastRef.instance.type = type;
        toastRef.instance.title = title;
        toastRef.instance.description = description;
        toastRef.instance.duration = duration;

        // Добавляем тост в DOM и Angular
        this.appRef.attachView(toastRef.hostView);
        this.toasts.push(toastRef);


        // Удаляем тост после окончания длительности
        setTimeout(() => {
            ToastService.removeToast(toastRef);
        }, duration + 300);
    }

    public static success(description?: string, title?: string): void {
        ToastService.show({ type: 'success', title, description });
    }

    public static warning(description?: string, title?: string): void {
        ToastService.show({ type: 'warning', title, description });
    }

    public static danger(description?: string, title?: string): void {
        ToastService.show({ type: 'danger', title, description });
    }

    private static removeToast(toastRef: ComponentRef<ToastComponent>): void {
        if (!this.appRef) return;

        toastRef.instance.isVisible = false;
        setTimeout(() => {
            const index = this.toasts.indexOf(toastRef);
            if (index !== -1) {
                if(!this.appRef){
                    return;
                }
                // this.appRef.detachView(toastRef.hostView);
                //toastRef.destroy();
                // this.updateToastPositions();
                this.toasts.splice(index, 1);
            }
        }, 300);
    }

    public static clearAll(): void {
        this.toasts.forEach(toast => this.removeToast(toast));
    }
}