import { Component } from '@angular/core';
import {VersionService} from "../../../services/Version/version.service";
import {UpdateService} from "../../../services/Version/update.service";
import {UpdateStatus} from "../../../interfaces/data/update-status.interface";
import {ModalBaseComponent} from "../modals/modal-base/modal-base.component";
import {AsyncPipe, NgClass} from "@angular/common";
import {VersionModalComponent} from "../modals/version-modal/version-modal.component";

@Component({
  selector: 'app-app-version',
  standalone: true,
  imports: [
    ModalBaseComponent,
    AsyncPipe,
    NgClass,
    VersionModalComponent
  ],
  templateUrl: './app-version.component.html',
  styleUrl: './app-version.component.css'
})
export class AppVersionComponent {
  version$ = this.versionService.getAppVersion();
  updateStatus: UpdateStatus | null = null;
  isChecking = false;
  isMajorOrMinorUpdate = false;

  modalsControls = {
    versionModal: {
      isModalOpen: false
    }
  }

  constructor(
      private versionService: VersionService,
      private updateService: UpdateService
  ) {}

  ngOnInit(): void {
    this.version$.subscribe(version => {
      console.log('AppVersionComponent: Current version:', version);
    });
    this.checkForUpdates();
  }

  checkForUpdates(): void {
    this.isChecking = true;
    this.updateService.checkForUpdates().subscribe({
      next: (status) => {
        this.updateStatus = status;
        this.isChecking = false;
        if (status.available) {
          console.log(`Update available: v${status.version}`);
          this.version$.subscribe(currentVersion => {
            this.isMajorOrMinorUpdate = this.compareVersions(currentVersion, status.version);
            if (this.isMajorOrMinorUpdate) {
              this.openVersionModal();
            }
          });
        }
      },
      error: (error) => {
        console.error('Failed to check for updates:', error);
        this.isChecking = false;
      }
    });
  }

  compareVersions(currentVersion: string, newVersion: string): boolean {
    const currentParts = currentVersion.split('.').map(Number);
    const newParts = newVersion.split('.').map(Number);

    // Проверяем мажорную или минорную версию
    if (currentParts[0] < newParts[0] || currentParts[1] < newParts[1]) {
      return true; // Мажорное или минорное обновление
    }
    return false; // Патч-обновление
  }

  openVersionModal() {
    this.modalsControls.versionModal.isModalOpen = true;
  }

  closeVersionModal(){
    if (!this.isMajorOrMinorUpdate) {
      this.modalsControls.versionModal.isModalOpen = false;
    }
  }
}
