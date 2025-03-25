import {Component, ElementRef, Input, SimpleChanges, ViewChild} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {MarkdownService} from "../../../../services/Markdown/markdown.service";
import {marked} from "marked";
import {FormsModule} from "@angular/forms";
import {MarkdownStatistics} from "../../../../interfaces/markdown/markdown-statisctics.interface";
import {MarkdownInfoService} from "../../../../services/Markdown/markdown-info.service";

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
  @ViewChild('textareaRef', { static: false }) textareaRef!: ElementRef<HTMLTextAreaElement>;

  content: string = ''; // Содержимое файла
  renderedContent: string = ''; // Отрендеренный HTML из Markdown
  lineNumbers: number[] = []; // Массив номеров строк
  currentLine: number = 1;

  statistics: MarkdownStatistics = {
    characterCount: 0,
    wordCount: 0,
    lineCount: 0,
    readingTime: '',
    headingCount: 0
  }

  constructor(private markdownService: MarkdownService, private markdownInfoService: MarkdownInfoService) {}

  ngOnInit(): void {
    this.loadContent();
    this.markdownService.content$.subscribe(content => {
      this.content = content;
      this.updateRenderedContent();
      this.updateLineNumbers();
      this.updateStats();
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
    this.updateStats();
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

  private updateStats(): void {
    this.statistics.characterCount = this.markdownInfoService.getCharacterCount(this.content);
    this.statistics.wordCount = this.markdownInfoService.getWordCount(this.content);
    this.statistics.lineCount = this.markdownInfoService.getLineCount(this.content);
    this.statistics.readingTime = this.markdownInfoService.getReadingTime(this.content);
    this.statistics.headingCount = this.markdownInfoService.getHeadingCount(this.content);
  }

  ngAfterViewInit(): void {
    this.updateTextareaHighlight();
  }

  private updateTextareaHighlight(): void {
    if (this.textareaRef) {
      this.textareaRef.nativeElement.style.setProperty('--current-line', this.currentLine.toString());
    }
  }
}
