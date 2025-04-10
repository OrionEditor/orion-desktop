import { Injectable } from '@angular/core';
import { TEXT_MODAL_TYPES } from "../../../shared/constants/modals/textModal/textModal.types";

@Injectable({
    providedIn: 'root',
})
export class TextModalService {
    private modalTitle: string = '';
    modalInput: string = '';
    private isModalOpen: boolean = false;
    modalType: TEXT_MODAL_TYPES | null = null;
    modalInputPlaceholder: string = '';
    path: string = ''

    openModal(title: string, type: TEXT_MODAL_TYPES, placeholder: string = '', path: string = '') {
        this.modalTitle = title;
        this.modalType = type;
        this.modalInput = '';
        this.isModalOpen = true;
        this.modalInputPlaceholder = placeholder;
        this.path = path;
    }

    closeModal() {
        this.isModalOpen = false;
        this.modalInput = '';
        this.modalType = null;
    }

    setModalInput(value: string) {
        this.modalInput = value;
    }

    getModalTitle(): string {
        return this.modalTitle;
    }

    getModalInput(): string {
        return this.modalInput;
    }

    updateModalInput(value: string) {
        this.setModalInput(value); // Обновляем значение в сервисе
    }

    getModalInputPlaceholder(): string{
        return this.modalInputPlaceholder;
    }

    getModalType(): TEXT_MODAL_TYPES | null {
        return this.modalType;
    }

    isModalOpenStatus(): boolean {
        return this.isModalOpen;
    }
}