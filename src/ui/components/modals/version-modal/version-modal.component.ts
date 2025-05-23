import {Component, EventEmitter, Input, Output} from '@angular/core';
import {UpdateStatus} from "../../../../interfaces/data/update-status.interface";
import {UpdateService} from "../../../../services/Version/update.service";
import {VersionService} from "../../../../services/Version/version.service";
import {AsyncPipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-version-modal',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe
  ],
  templateUrl: './version-modal.component.html',
  styleUrl: './version-modal.component.css'
})
export class VersionModalComponent {
  @Input() updateStatus: UpdateStatus | null = null;
  @Output() closed = new EventEmitter<void>();
  version$ = this.versionService.getAppVersion();
  downloadProgress: number = 0;
  isDownloading: boolean = false;

  date: string = this.updateStatus?.date || '';

  constructor(
      private updateService: UpdateService,
      private versionService: VersionService
  ) {}

  ngOnInit(): void {
    if (!this.updateStatus) {
      this.updateStatus = { available: false, version: '', notes: '', date: '' };
    }
  }

  installUpdate(): void {
    if (this.updateStatus?.available) {
      this.isDownloading = true;
      this.updateService.installUpdate().subscribe({
        next: (progress) => {
          if (typeof progress === 'number') {
            this.downloadProgress = progress;
          } else if (progress) {
            this.isDownloading = false;
            console.log('Update installed successfully');
            this.closeModal();
          }
        },
        error: (error) => {
          console.error('Failed to install update:', error);
          this.isDownloading = false;
        }
      });
    }
  }

  closeModal(): void {
    const modal = document.querySelector('app-version-modal');
    if (modal) {
      this.closed.emit();
      modal.remove();
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }
}
