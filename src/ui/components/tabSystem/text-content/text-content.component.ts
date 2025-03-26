import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {readTextFile, stat, writeTextFile} from "@tauri-apps/plugin-fs";
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-text-content',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './text-content.component.html',
  styleUrl: './text-content.component.css'
})
export class TextContentComponent {
  @Input() filePath: string = '';
  @Input() fileName: string = '';
  @ViewChild('textareaRef', { static: false }) textareaRef!: ElementRef<HTMLTextAreaElement>;

  content: string = '';
  lineNumbers: number[] = [];
  currentLine: number = 1;
  fileSize: string = '';
  lineCount: number = 0;

  async ngAfterViewInit(): Promise<void> {
    await this.loadFileContent();
    this.updateLineNumbers();
    await this.loadFileInfo();
  }

  async loadFileContent(): Promise<void> {
    try {
      this.content = await readTextFile(this.filePath);
      this.updateLineNumbers();
    } catch (error) {
      this.content = 'Не удалось загрузить содержимое файла.';
    }
  }

  async onContentChange(event: Event): Promise<void> {
    const textarea = event.target as HTMLTextAreaElement;
    this.content = textarea.value;
    this.updateLineNumbers();
    this.updateCurrentLine(textarea);
    try {
      await writeTextFile(this.filePath, this.content);
      await this.loadFileInfo();
    } catch (error) {
    }
  }

  private updateLineNumbers(): void {
    const lines = this.content.split('\n');
    this.lineCount = lines.length;
    this.lineNumbers = Array.from({ length: this.lineCount }, (_, i) => i + 1);
  }

  private updateCurrentLine(textarea: HTMLTextAreaElement): void {
    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = this.content.substring(0, cursorPosition);
    this.currentLine = textBeforeCursor.split('\n').length;
    textarea.style.setProperty('--current-line', this.currentLine.toString());
  }

  onCursorMove(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.updateCurrentLine(textarea);
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

  private formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} Б`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} ГБ`;
  }
}
