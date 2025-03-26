import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {readFile, stat} from "@tauri-apps/plugin-fs";
import {FILE_TYPES} from "../../../../shared/constants/FileSystem/files.types";

@Component({
  selector: 'app-video-content',
  standalone: true,
  imports: [],
  templateUrl: './video-content.component.html',
  styleUrl: './video-content.component.css'
})
export class VideoContentComponent {
  @Input() filePath: string = '';
  @Input() fileName: string = '';
  @ViewChild('videoRef', { static: false }) videoRef!: ElementRef<HTMLVideoElement>;

  videoDataUrl: string = '';
  fileSize: string = '';
  duration: string = '';

  async ngAfterViewInit(): Promise<void> {
    await this.loadVideoAsDataUrl();
    await this.loadVideoInfo();
  }

  async loadVideoAsDataUrl(): Promise<void> {
    try {
      const fileData = await readFile(this.filePath);
      const base64String = btoa(
          new Uint8Array(fileData).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      const mimeType = this.getMimeType(this.filePath);
      this.videoDataUrl = `data:${mimeType};base64,${base64String}`;
    } catch (error) {
      this.videoDataUrl = '';
    }
  }

  async loadVideoInfo(): Promise<void> {
    try {
      // размер файла
      const fileStats = await stat(this.filePath);
      const sizeInBytes = fileStats.size;
      this.fileSize = this.formatFileSize(sizeInBytes);

      // длительность видео
      const video = this.videoRef.nativeElement;
      video.onloadedmetadata = () => {
        this.duration = this.formatDuration(video.duration);
      };
      video.onerror = () => {
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
      case FILE_TYPES.VIDEO.MP4:
        return FILE_TYPES.VIDEO.VIDEO + '/' + FILE_TYPES.VIDEO.MP4;
      default:
        return FILE_TYPES.VIDEO.VIDEO + '/' + FILE_TYPES.VIDEO.MP4;
    }
  }
}
