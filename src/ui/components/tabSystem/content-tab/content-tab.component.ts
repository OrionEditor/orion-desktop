import {Component, Input, SimpleChanges} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {MarkdownService} from "../../../../services/Markdown/markdown.service";
import {marked} from "marked";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-content-tab',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    FormsModule
  ],
  templateUrl: './content-tab.component.html',
  styleUrl: './content-tab.component.css'
})
export class ContentTabComponent {
  @Input() filePath: string = '';

  content: string = ''; // Содержимое файла
  renderedContent: string = ''; // Отрендеренный HTML из Markdown
  lineNumbers: number[] = []; // Массив номеров строк
  currentLine: number = 1;

  constructor(private markdownService: MarkdownService) {}

  ngOnInit(): void {
    this.loadContent();
    this.markdownService.content$.subscribe(content => {
      this.content = content;
      this.updateRenderedContent();
      this.updateLineNumbers();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filePath'] && !changes['filePath'].isFirstChange()) {
      this.loadContent();
    }
  }

  private async loadContent(): Promise<void> {
    if (this.filePath) {
      await this.markdownService.readMarkdownFile(this.filePath);
    }
  }

  onContentChange(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.content = textarea.value;
    this.markdownService.saveMarkdownFile(this.filePath, this.content).then();
    this.updateRenderedContent();
    this.updateLineNumbers();
    this.updateCurrentLine(textarea);
  }

  private updateRenderedContent(): void {
    this.renderedContent = marked(this.content).toString(); // Парсим Markdown в HTML
  }

  private updateLineNumbers(): void {
    const lines = this.content.split('\n').length;
    this.lineNumbers = Array.from({ length: lines }, (_, i) => i + 1);
  }

  private updateCurrentLine(textarea: HTMLTextAreaElement): void {
    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = this.content.substring(0, cursorPosition);
    this.currentLine = textBeforeCursor.split('\n').length;
  }

  onCursorMove(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.updateCurrentLine(textarea);
  }
}
