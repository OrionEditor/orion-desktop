import { Component } from '@angular/core';
import {invoke} from "@tauri-apps/api/core";

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.css'
})
export class AvatarComponent {
  async onAvatarClick() {
    try {
      await invoke('create_profile_window');
    } catch (error) {
      console.error("Ошибка при создании окна:", error);
    }
  }
}
