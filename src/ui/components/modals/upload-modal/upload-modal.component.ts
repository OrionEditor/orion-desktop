import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-upload-modal',
  standalone: true,
    imports: [
        NgIf
    ],
  templateUrl: './upload-modal.component.html',
  styleUrl: './upload-modal.component.css'
})
export class UploadModalComponent {
  @Input() progress: number = 0; // Прогресс передаётся извне
  @Input() isUploading: boolean = false; // Показывать окно загрузки

  @Output() cancel = new EventEmitter<void>(); // Событие отмены

  cancelUpload() {
    this.cancel.emit(); // Уведомляем родительский компонент
  }
  constructor() {
  }
}
