import {Component, Input} from '@angular/core';
import {invoke} from "@tauri-apps/api/core";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.css'
})
export class AvatarComponent {
  @Input() isTextID: boolean = false;
  async onAvatarClick() {
    try {
      await invoke('create_profile_window');
    } catch (error) {
      console.error("Ошибка при создании окна:", error);
    }
  }
}
