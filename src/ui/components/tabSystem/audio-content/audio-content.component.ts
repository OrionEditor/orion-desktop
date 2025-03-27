import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {readFile, stat} from "@tauri-apps/plugin-fs";
import {NgIf} from "@angular/common";
import {FILE_TYPES} from "../../../../shared/constants/FileSystem/files.types";

@Component({
  selector: 'app-audio-content',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './audio-content.component.html',
  styleUrl: './audio-content.component.css'
})
export class AudioContentComponent {
  @Input() filePath: string = '';
  @Input() fileName: string = '';
  @ViewChild('audioRef', { static: false }) audioRef!: ElementRef<HTMLAudioElement>;

  audioDataUrl: string = '';
  fileSize: string = '';
  duration: string = '';

  async ngAfterViewInit(): Promise<void> {
    await this.loadAudioAsDataUrl();
    await this.loadAudioInfo();
  }

  async loadAudioAsDataUrl(): Promise<void> {
    try {
      const fileData = await readFile(this.filePath);
      const base64String = btoa(
          new Uint8Array(fileData).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      const mimeType = this.getMimeType(this.filePath);
      this.audioDataUrl = `data:${mimeType};base64,${base64String}`;
    } catch (error) {
      this.audioDataUrl = '';
    }
  }

  async loadAudioInfo(): Promise<void> {
    try {
      // размер файла
      const fileStats = await stat(this.filePath);
      const sizeInBytes = fileStats.size;
      this.fileSize = this.formatFileSize(sizeInBytes);

      // длительность аудио
      const audio = this.audioRef.nativeElement;
      audio.onloadedmetadata = () => {
        this.duration = this.formatDuration(audio.duration);
      };
      audio.onerror = () => {
        this.duration = 'Не удалось определить';
      };
    } catch (error) {
      this.fileSize = 'Не удалось определить';
      this.duration = 'Не удалось определить';
    }
  }

  private formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} Б`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} ГБ`;
  }

  private formatDuration(seconds: number): string {
    if (isNaN(seconds)) return 'Неизвестно';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  // Определение MIME-типа по расширению файла
  private getMimeType(filePath: string): string {
    const extension = filePath.split('.').pop()?.toLowerCase();
    switch (extension) {
      case FILE_TYPES.AUDIO.MP3:
        return FILE_TYPES.AUDIO.AUDIO + '/' + FILE_TYPES.AUDIO.MPEG;
      case FILE_TYPES.AUDIO.WAV:
        return FILE_TYPES.AUDIO.AUDIO + '/' + FILE_TYPES.AUDIO.WAV;
      case FILE_TYPES.AUDIO.OGG:
        return FILE_TYPES.AUDIO.AUDIO + '/' + FILE_TYPES.AUDIO.OGG;
      default:
        return FILE_TYPES.AUDIO.AUDIO + '/' + FILE_TYPES.AUDIO.MPEG;
    }
  }
}
