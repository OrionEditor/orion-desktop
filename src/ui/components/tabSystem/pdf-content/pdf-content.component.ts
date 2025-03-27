import {Component, Input} from '@angular/core';
import {readFile, stat} from "@tauri-apps/plugin-fs";
import pdf from "pdf-parse";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-pdf-content',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './pdf-content.component.html',
  styleUrl: './pdf-content.component.css'
})
export class PdfContentComponent {
  @Input() filePath: string = '';
  @Input() fileName: string = '';
  pdfDataUrl: string = ''; // Data URL для отображения PDF
  fileSize: string = ''; // Размер файла
  pageCount: number = 0; // Количество страниц

  async ngAfterViewInit(): Promise<void> {
    await this.loadPdfAsDataUrl(); // Загружаем PDF как Data URL
    await this.loadPdfInfo();
  }

  // Загрузка PDF как Data URL
  async loadPdfAsDataUrl(): Promise<void> {
    try {
      const fileData = await readFile(this.filePath); // Читаем файл как Uint8Array
      const base64String = btoa(
          new Uint8Array(fileData).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      this.pdfDataUrl = `data:application/pdf;base64,${base64String}`;
    } catch (error) {
      console.error('Ошибка чтения PDF:', error);
      this.pdfDataUrl = '';
    }
  }

  // Загрузка информации о PDF
  async loadPdfInfo(): Promise<void> {
    // try {
    //   const fileStats = await stat(this.filePath);
    //   const sizeInBytes = fileStats.size;
    //   this.fileSize = formatFileSize(sizeInBytes);
    //
    //   const fileData = await readFile(this.filePath); // Uint8Array
    //   const pdfData = await pdf(fileData as any); // Приведение к any
    //   this.pageCount = pdfData.numpages;
    // } catch (error) {
    //   console.error('Ошибка получения информации о PDF:', error);
    //   this.fileSize = 'Не удалось определить';
    //   this.pageCount = 0;
    // }
  }
}
