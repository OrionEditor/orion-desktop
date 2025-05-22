import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ToastService} from "../../../../services/Notifications/toast.service";
import {ModalBaseComponent} from "../modal-base/modal-base.component";
import {NgIf} from "@angular/common";
import {HeaderDescriptionComponent} from "../../text/header-description/header-description.component";

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [
    NgIf,
    HeaderDescriptionComponent
  ],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css'
})
export class ConfirmModalComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() toastSuccessDescription: string = '';
  @Input() toastDangerDescription: string = '';

  @Output() result = new EventEmitter<boolean>();

  step: 'confirm' = 'confirm';

  async onConfirm() {
    if (this.step === 'confirm') {
        this.complete(true);
    }
  }

  onNotConfirm(): void {
    this.complete(false);
  }

  private complete(success: boolean): void {
    this.result.emit(success);
    this.closeModal();
    if (success && this.toastSuccessDescription.length > 0) {
      ToastService.success(this.toastSuccessDescription);
    } else if (!success && this.toastDangerDescription.length > 0) {
      ToastService.danger(this.toastDangerDescription);
    }
  }

  closeModal(): void {
    const modalBase = this as any as ModalBaseComponent;
    modalBase.closeModal();
  }
}
