import { Component } from '@angular/core';
import {invoke} from "@tauri-apps/api/core";
import {ModalBaseComponent} from "../../../modals/modal-base/modal-base.component";
import {SettingsModalComponent} from "../../../modals/settings-modal/settings-modal.component";

@Component({
  selector: 'app-sidebar-actions',
  standalone: true,
  imports: [
    ModalBaseComponent,
    SettingsModalComponent
  ],
  templateUrl: './sidebar-actions.component.html',
  styleUrl: './sidebar-actions.component.css'
})
export class SidebarActionsComponent {
  modalsControls = {
    settings: {
      isModalOpen: false
    }
  }

  async onCreateVaultPage() {
    try {
      await invoke('create_main_window');
    } catch (error) {
      console.error("Ошибка при создании окна:", error);
    }
  }

  closeSettingsModal(){
    this.modalsControls.settings.isModalOpen = false;
  }

  openSettingsModal(){
    this.modalsControls.settings.isModalOpen = true;
  }
}
