import { ApplicationRef, ComponentRef, Injectable, createComponent, EnvironmentInjector } from '@angular/core';
import { ModalBaseComponent } from '../../ui/components/modals/modal-base/modal-base.component';
import { ConfirmModalComponent } from '../../ui/components/modals/confirm-modal/confirm-modal.component';

@Injectable({
    providedIn: 'root'
})
export class ConfirmModalService {
    static async createConfirmModal(
        injector: EnvironmentInjector,
        title: string,
        description: string,
        options: {
            requirePassword?: boolean;
            requireEmailCode?: boolean;
        } = {}
    ): Promise<boolean> {
        const modalBaseRef = createComponent(ModalBaseComponent, {
            environmentInjector: injector
        });

        const confirmModalRef = createComponent(ConfirmModalComponent, {
            environmentInjector: injector
        });

        confirmModalRef.instance.title = title;
        confirmModalRef.instance.description = description;

        modalBaseRef.location.nativeElement.appendChild(confirmModalRef.location.nativeElement);
        document.body.appendChild(modalBaseRef.location.nativeElement);

        const modalElement = modalBaseRef.location.nativeElement;
        Object.assign(modalElement.style, {
            position: 'absolute',
            width: '100vw',
            height: '100vh',
            top: '0',
            left: '0',
            zIndex: '1000',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'rgba(0, 0, 0, 0.8)'
        });

        const appRef = injector.get(ApplicationRef);
        appRef.attachView(modalBaseRef.hostView);
        appRef.attachView(confirmModalRef.hostView);

        return new Promise<boolean>((resolve) => {
            confirmModalRef.instance.result.subscribe((result: boolean) => {
                resolve(result);
                modalBaseRef.destroy();
                confirmModalRef.destroy();
            });
        }).finally(() => {
            appRef.detachView(modalBaseRef.hostView);
            appRef.detachView(confirmModalRef.hostView);
            if (modalBaseRef.location.nativeElement.parentNode) {
                document.body.removeChild(modalBaseRef.location.nativeElement);
            }
        });
    }
}