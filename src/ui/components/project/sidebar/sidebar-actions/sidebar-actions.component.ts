import { Component } from '@angular/core';
import {invoke} from "@tauri-apps/api/core";

@Component({
  selector: 'app-sidebar-actions',
  standalone: true,
  imports: [],
  templateUrl: './sidebar-actions.component.html',
  styleUrl: './sidebar-actions.component.css'
})
export class SidebarActionsComponent {
  async onCreateVaultPage() {
    try {
      await invoke('create_main_window');
    } catch (error) {
      console.error("Ошибка при создании окна:", error);
    }
  }
}
