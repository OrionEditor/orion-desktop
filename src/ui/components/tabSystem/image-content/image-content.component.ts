import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {readFile, stat} from "@tauri-apps/plugin-fs";
import {FILE_TYPES} from "../../../../shared/constants/FileSystem/files.types";
import {formatFileSize} from "../../../../utils/format.utils";
@Component({
  selector: 'app-image-content',
  standalone: true,
  imports: [],
  templateUrl: './image-content.component.html',
  styleUrl: './image-content.component.css'
})
export class ImageContentComponent {
  @Input() filePath: string = '';
  @Input() fileName: string = '';

  @ViewChild('imageRef', { static: false }) imageRef!: ElementRef<HTMLImageElement>;

  scale: number = 1;
  rotation: number = 0;
  fileSize: string = '';
  resolution: string = '';
  imageDataUrl: string = '';

  async ngAfterViewInit() {
    await this.loadImageAsDataUrl();
    await this.loadImageInfo();
  }

  async loadImageAsDataUrl(): Promise<void> {
    try {
      const fileData = await readFile(this.filePath);
      const base64String = btoa(
          new Uint8Array(fileData).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      const mimeType = this.getMimeType(this.filePath);
      this.imageDataUrl = `data:${mimeType};base64,${base64String}`;
    } catch (error) {
      this.imageDataUrl = '';
    }
  }

  // Определение MIME-типа по расширению файла
  private getMimeType(filePath: string): string {
    const extension = filePath.split('.').pop()?.toLowerCase();
    switch (extension) {
      case FILE_TYPES.IMAGE.JPG:
      case FILE_TYPES.IMAGE.JPEG:
        return FILE_TYPES.IMAGE.IMG + '/' + FILE_TYPES.IMAGE.JPEG;
      case FILE_TYPES.IMAGE.PNG:
        return FILE_TYPES.IMAGE.IMG + '/' + FILE_TYPES.IMAGE.PNG;
      case FILE_TYPES.IMAGE.WEBP:
        return FILE_TYPES.IMAGE.IMG + '/' + FILE_TYPES.IMAGE.WEBP;
      case FILE_TYPES.IMAGE.SVG:
        return FILE_TYPES.IMAGE.IMG + '/' + FILE_TYPES.IMAGE.SVG + '+' + FILE_TYPES.OTHER.XML;
      default:
        return FILE_TYPES.IMAGE.IMG + '/' + FILE_TYPES.IMAGE.JPEG;
    }
  }

  async loadImageInfo(): Promise<void> {
    try {
      const fileStats = await stat(this.filePath);
      const sizeInBytes = fileStats.size;
      this.fileSize = formatFileSize(sizeInBytes);

      const img = this.imageRef.nativeElement;
      img.onload = () => {
        this.resolution = `${img.naturalWidth} x ${img.naturalHeight}`;
      };
    } catch (error) {
      this.fileSize = 'Не удалось определить';
      this.resolution = 'Не удалось определить';
    }
  }

  // Увеличение изображения
  zoomIn(): void {
    this.scale = Math.min(this.scale + 0.1, 3); // Максимум 300%
  }

  // Уменьшение изображения
  zoomOut(): void {
    this.scale = Math.max(this.scale - 0.1, 0.1); // Минимум 10%
  }

  // Поворот изображения вправо
  rotateRight(): void {
    this.rotation = (this.rotation + 90) % 360;
  }

  // Поворот изображения влево
  rotateLeft(): void {
    this.rotation = (this.rotation - 90 + 360) % 360;
  }

  // Сброс масштаба и поворота
  reset(): void {
    this.scale = 1;
    this.rotation = 0;
  }
}
