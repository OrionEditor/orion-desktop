import {Component, Input} from '@angular/core';
import {readTextFile, stat} from "@tauri-apps/plugin-fs";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-html-content',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './html-content.component.html',
  styleUrl: './html-content.component.css'
})
export class HtmlContentComponent {
  @Input() filePath: string = '';
  @Input() fileName: string = '';

  htmlContent: string = '';
  fileSize: string = '';
  lineCount: number = 0;

  async ngAfterViewInit(): Promise<void> {
    await this.loadHtmlContent();
    await this.loadFileInfo();
  }

  // Загрузка содержимого HTML-файла
  async loadHtmlContent(): Promise<void> {
    try {
      this.htmlContent = await readTextFile(this.filePath);
      this.lineCount = this.htmlContent.split('\n').length;
    } catch (error) {
      this.htmlContent = '<p>Не удалось загрузить содержимое html файла.</p>';
      this.lineCount = 1;
    }
  }

  async loadFileInfo(): Promise<void> {
    try {
      const fileStats = await stat(this.filePath);
      const sizeInBytes = fileStats.size;
      this.fileSize = this.formatFileSize(sizeInBytes);
    } catch (error) {
      this.fileSize = 'Не удалось определить';
    }
  }

  // Форматирование размера файла
  private formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} Б`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} ГБ`;
  }
}
