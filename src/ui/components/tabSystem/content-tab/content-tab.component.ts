import {Component, ElementRef, Input, SimpleChanges, ViewChild} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {MarkdownService} from "../../../../services/Markdown/markdown.service";
import {marked} from "marked";
import {FormsModule} from "@angular/forms";
import {MarkdownStatistics} from "../../../../interfaces/markdown/markdown-statisctics.interface";
import {MarkdownInfoService} from "../../../../services/Markdown/markdown-info.service";
import {DialogService} from "../../../../services/dialog.service";
import {MarkdownExportService} from "../../../../services/Markdown/markdown-export.service";
import {FILE_TYPES, getExtensionWithDot} from "../../../../shared/constants/FileSystem/files.types";
import {MarkdownImportService} from "../../../../services/Markdown/markdown.import.service";

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
  @Input() fileName: string = '';
  @ViewChild('textareaRef', { static: false }) textareaRef!: ElementRef<HTMLTextAreaElement>;

  content: string = '';
  renderedContent: string = '';
  lineNumbers: number[] = [];
  currentLine: number = 1;

  statistics: MarkdownStatistics = {
    characterCount: 0,
    wordCount: 0,
    lineCount: 0,
    readingTime: '',
    headingCount: 0
  }

  exportFormat: string = FILE_TYPES.HTML;
  importFormat: string = FILE_TYPES.HTML;

  constructor(private markdownService: MarkdownService, private markdownInfoService: MarkdownInfoService, private dialogService: DialogService) {}

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
    this.renderedContent = marked(this.content).toString();
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

  async exportFile() {
    const selectedPath = await this.dialogService.selectPath(true);
    if (selectedPath) {
      const exportPath = `${selectedPath}/${this.fileName}.${this.exportFormat}`;
      try {
        if (this.exportFormat === FILE_TYPES.HTML) {
          await MarkdownExportService.exportToHtml(this.content, exportPath, this.fileName);
        } else if (this.exportFormat === FILE_TYPES.PDF) {
          await MarkdownExportService.exportToPdf(this.content, exportPath);
        }
      } catch (error) {
      }
    }
  }

  async importFile() {
    const selectedPath = await this.dialogService.selectPath(false); // Выбор файла
    if (selectedPath && typeof selectedPath === 'string' && (selectedPath.endsWith(getExtensionWithDot(FILE_TYPES.HTML)))) {
      let markdownContent: string;
      try {
        if (this.importFormat === FILE_TYPES.HTML) {
          markdownContent = await MarkdownImportService.importFromHtml(selectedPath);
        } else {
          return;
        }

        const savePath = await this.dialogService.selectPath(true);
        if (savePath && typeof savePath === 'string') {
          // const fileName = selectedPath.split('/').pop()?.split('.')[0] || 'imported';
          const markdownPath = `${savePath}/${this.fileName}.${FILE_TYPES.MD}`;
          await MarkdownImportService.saveMarkdown(markdownContent, markdownPath);
          this.content = markdownContent;
          this.markdownService.saveMarkdownFile(this.filePath, markdownContent);
        }
      } catch (error) {
      }
    } else {
    }
  }
}
