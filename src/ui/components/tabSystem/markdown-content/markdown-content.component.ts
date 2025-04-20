import {Component, ElementRef, Input, SecurityContext, SimpleChanges, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {MarkdownStatistics} from "../../../../interfaces/markdown/markdown-statisctics.interface";
import {MarkdownService} from "../../../../services/Markdown/markdown.service";
import {MarkdownInfoService} from "../../../../services/Markdown/markdown-info.service";
import {DialogService} from "../../../../services/dialog.service";
import {marked} from "marked";
import {MarkdownExportService} from "../../../../services/Markdown/markdown-export.service";
import {FILE_TYPES, getExtensionWithDot} from "../../../../shared/constants/FileSystem/files.types";
import {MarkdownImportService} from "../../../../services/Markdown/markdown.import.service";
import {MarkdownView} from "../../../../shared/enums/markdown-view.enum";
import {ContextMenuItem} from "../../../../interfaces/context-menu-item.interface";
import {ContextMenuComponent} from "../../contextMenus/context-menu/context-menu.component";
import {MdSettingsContextMenu} from "../../../../shared/constants/contextMenu/mdSettings.contextmenu";
import {AudioTrackComponent} from "../../audio/audio-track/audio-track.component";
import {Gender} from "../../../../shared/enums/gender.enum";
import {LanguageTranslateService} from "../../../../services/translate.service";
import {HttpClient} from "@angular/common/http";
import {VersionListComponent} from "../../versions/version-list/version-list.component";
import {Version} from "../../../../interfaces/version.interface";
import {ModalBaseComponent} from "../../modals/modal-base/modal-base.component";
import {SettingsModalComponent} from "../../modals/settings-modal/settings-modal.component";
import {SettingsService} from "../../../../services/settings.service";
import {LinkType} from "../../../../shared/enums/link-type.enum";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {MarkdownLinkParserService} from "../../../../services/Markdown/markdown-link-parser.service";
import {ImageMarkdownTemplate} from "../../../../shared/constants/templates/image-markdown.template";
import {VideoMarkdownTemplate} from "../../../../shared/constants/templates/video-markdown.template";
import {AudioMarkdownTemplate} from "../../../../shared/constants/templates/audio-markdown.template";
import {resolveResource} from "@tauri-apps/api/path";

@Component({
  selector: 'app-markdown-content',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ContextMenuComponent,
    AudioTrackComponent,
    VersionListComponent,
    ModalBaseComponent,
    SettingsModalComponent
  ],
  templateUrl: './markdown-content.component.html',
  styleUrl: './markdown-content.component.css'
})
export class MarkdownContentComponent {
  @Input() filePath: string = '';
  @Input() fileName: string = '';

  @ViewChild('textareaRef', { static: false }) textareaRef!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('editorRef', { static: false }) editorRef!: ElementRef<HTMLDivElement>;
  @ViewChild('renderedContentRef', { static: false }) renderedContentRef!: ElementRef<HTMLDivElement>;

  content: string = '';
  renderedContent: SafeHtml | string = '';
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

  view: MarkdownView = MarkdownView.TWO_SIDE;

  lines: string[] = [];
  currentLineIndex: number | null = null;
  private lastFocusedLineIndex: number | null = null;
  private lastCursorPosition: number = 0;
  selectAllMode: boolean = false;

  showContextMenu: boolean = false;
  menuX: number = 0;
  menuY: number = 0;

  showAudioTrack: { value: boolean } = { value: false };
  currentGender: Gender= Gender.FEMALE;

  isVersionPanelCollapsed: boolean = true;

  MarkdownSettingsMenuItems: ContextMenuItem[] = MdSettingsContextMenu(this.filePath, this.content, this.fileName, this.showAudioTrack);

  constructor(private markdownService: MarkdownService, private markdownInfoService: MarkdownInfoService, private dialogService: DialogService, private languageTranslateService: LanguageTranslateService, private linkParserService: MarkdownLinkParserService,
              private sanitizer: DomSanitizer) {}

  private async updateRenderedContent(): Promise<void> {
    const links = this.linkParserService.extractLinksAndImages(this.content);
    let html = marked(this.content).toString();
    console.log('Parsed HTML:', html);
    console.log('Links:', links);

    for (const [index, link] of links.entries()) {
      let url = link.url;

      try {
        link.url = decodeURI(link.url);
      } catch (e) {
      }

      // Если это локальный путь, преобразуем его в file:///
      if (!link.url.startsWith('http://') && !link.url.startsWith('https://')) {
        const basePath = this.filePath.substring(0, this.filePath.lastIndexOf('/'));
        try {
          // Формируем абсолютный путь
          const localPath = `${basePath}/${link.url}`.replace(/\\/g, '/');
          const encodedPath = encodeURI(localPath);
          link.url = `file:///${encodedPath}`;
        } catch (e) {
        }
      }

          if (link.isImage && link.type === LinkType.IMAGE) {
            html = html.replace(

            `[<img src="${link.url}" alt="${link.text}">]`,
                ImageMarkdownTemplate(link.url, `image-${index}`)
            );
            html = html.replace(
                `<img src="${link.url}" alt="${link.text}">`,
                ImageMarkdownTemplate(link.url, `image-${index}`)
            );
          } else if (link.type === LinkType.VIDEO) {
            html = html.replace(
                `[<img src="${link.url}" alt="${link.text}">]`,
                VideoMarkdownTemplate(link.url, `video-${index}`)
            );
            html = html.replace(
                `<img src="${link.url}" alt="${link.text}">`,
                VideoMarkdownTemplate(link.url, `video-${index}`)
            );
          } else if (link.type === LinkType.AUDIO) {
            html = html.replace(
                `[![${link.text}](${url})]`,
              AudioMarkdownTemplate(link.url, `audio-${index}`)
            );
            html = html.replace(
                `[![${link.text}](${link.url})]`,
                AudioMarkdownTemplate(link.url, `audio-${index}`)
            );
          }
    }

    this.renderedContent = this.sanitizer.bypassSecurityTrustHtml(html);
  }

  ngAfterViewInit(): void {
    this.updateTextareaHighlight();
  }

  async ngOnInit() {
    await this.loadContent();
    this.markdownService.content$.subscribe(content => {
      this.content = content;
      this.updateRenderedContent();
      this.updateLineNumbers();
      this.updateStats();
      this.updateLines();
    });
    this.MarkdownSettingsMenuItems = MdSettingsContextMenu(this.filePath, this.content, this.fileName, this.showAudioTrack);
  }
  private updateLines(): void {
    this.lines = this.content.split('\n');
    this.updateStats();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['filePath'] && !changes['filePath'].isFirstChange()) {
      await this.loadContent();
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

  private updateTextareaHighlight(): void {
    if (this.textareaRef) {
      this.textareaRef.nativeElement.style.setProperty('--current-line', this.currentLine.toString());
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

  onOneSide(){
    this.view = MarkdownView.ONE_SIDE;
    // setTimeout(() => this.focusCurrentLine(), 0);
  }

  onTwoSide(){
    this.view = MarkdownView.TWO_SIDE
  }

  /*ONE-SIDE*/
  onInput(event: Event): void {
  }

  onBlur(event: Event): void {
    // const input = event.target as HTMLInputElement;
    // this.lines[this.currentLineIndex!] = input.value;
    // this.content = this.lines.join('\n');
    // this.markdownService.saveMarkdownFile(this.filePath, this.content).then();
    // this.updateLines();
    // this.currentLineIndex = null;
    const input = event.target as HTMLInputElement;
    if (this.selectAllMode) {
      // Обновляем все строки в режиме выделения
      const inputs = this.editorRef.nativeElement.querySelectorAll('input');
      this.lines = Array.from(inputs).map((inp: HTMLInputElement) => inp.value);
    } else {
      this.lines[this.currentLineIndex!] = input.value; // Обновляем только текущую строку
    }
    this.content = this.lines.join('\n');
    this.markdownService.saveMarkdownFile(this.filePath, this.content).then();
    this.updateLines();
    this.currentLineIndex = null;
    this.selectAllMode = false; // Выключаем режим выделения после потери фокуса
  }

  // onKeyDown(event: KeyboardEvent): void {
  //   if (this.currentLineIndex === null) return;
  //
  //   const input = event.target as HTMLInputElement;
  //   if (event.key === 'Enter') {
  //     event.preventDefault();
  //     this.lines[this.currentLineIndex] = input.value;
  //     this.content = this.lines.join('\n');
  //     if (this.currentLineIndex < this.lines.length - 1) {
  //       this.currentLineIndex++;
  //     } else {
  //       this.lines.push('');
  //       this.currentLineIndex = this.lines.length - 1;
  //     }
  //     this.updateLines();
  //     this.focusInput();
  //   } else if (event.key === 'ArrowUp' && this.currentLineIndex > 0) {
  //     event.preventDefault();
  //     this.lines[this.currentLineIndex] = input.value;
  //     this.content = this.lines.join('\n');
  //     this.currentLineIndex--;
  //     this.updateLines();
  //     this.focusInput();
  //   } else if (event.key === 'ArrowDown' && this.currentLineIndex < this.lines.length - 1) {
  //     event.preventDefault();
  //     this.lines[this.currentLineIndex] = input.value;
  //     this.content = this.lines.join('\n');
  //     this.currentLineIndex++;
  //     this.updateLines();
  //     this.focusInput();
  //   } else if (event.key === 'Escape') {
  //     this.lines[this.currentLineIndex] = input.value;
  //     this.content = this.lines.join('\n');
  //     this.currentLineIndex = null; // Завершаем редактирование
  //     this.updateLines();
  //   }
  // }

  // onKeyDown(event: KeyboardEvent): void {
  //   const editor = this.editorRef.nativeElement;
  //   if (event.target instanceof HTMLInputElement) {
  //     const input = event.target as HTMLInputElement;
  //     if (event.key === 'Enter' || event.key === 'Escape') {
  //       event.preventDefault();
  //       this.lines[this.currentLineIndex!] = input.value;
  //       this.content = this.lines.join('\n');
  //       this.updateLines();
  //
  //       if (event.key === 'Enter') {
  //         if (this.currentLineIndex! < this.lines.length - 1) {
  //           this.currentLineIndex!++;
  //         } else {
  //           this.lines.push('');
  //           this.currentLineIndex = this.lines.length - 1;
  //         }
  //         this.focusInput();
  //       } else {
  //         this.currentLineIndex = null; // Завершаем редактирование
  //       }
  //     }
  //   } else if (this.currentLineIndex === null) {
  //     if (event.key === 'ArrowUp' && this.currentLine > 1) {
  //       event.preventDefault();
  //       this.currentLine--;
  //       this.currentLineIndex = this.currentLine - 1;
  //       this.focusInput();
  //     } else if (event.key === 'ArrowDown' && this.currentLine < this.lines.length) {
  //       event.preventDefault();
  //       this.currentLine++;
  //       this.currentLineIndex = this.currentLine - 1;
  //       this.focusInput();
  //     }
  //   }
  // }

  onInputKeyDown(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    if (event.ctrlKey && event.key === 'a') {
      event.preventDefault();
      this.selectAllMode = true; // Активируем режим выделения всех строк
      this.currentLineIndex = null; // Отключаем одиночное редактирование
      this.updateLines();
      requestAnimationFrame(() => {
        const inputs = this.editorRef.nativeElement.querySelectorAll('input');
        inputs.forEach((inp: HTMLInputElement) => {
          inp.focus();
          inp.select(); // Выделяем текст в каждом input
        });
      });
    }
    if (event.key === 'Enter' || event.key === 'Backspace') {
      event.preventDefault();
      this.lines[this.currentLineIndex!] = input.value; // Сохраняем текущую строку
      this.content = this.lines.join('\n');

      if (event.key === 'Enter') {
        this.lines.splice(this.currentLineIndex! + 1, 0, ''); // Вставляем пустую строку
        this.currentLineIndex!++; // Переходим на новую строку

        this.content = this.lines.join('\n');
        this.updateLines();
        // Очищаем значение input для новой строки
        const editor = this.editorRef.nativeElement;
        const newInput = editor.querySelector('input') as HTMLInputElement;
        if (newInput) {
          newInput.value = ''; // Устанавливаем пустое значение
          this.onLineClick(this.currentLineIndex!);
        }
        this.onLineClick(this.currentLineIndex!);
      } else if (event.key === 'Backspace') {
        if (input.value.trim() === '') {
          // Если строка пуста, удаляем её
          this.lines.splice(this.currentLineIndex!, 1);
          this.content = this.lines.join('\n');
          this.updateLines();
        } else {
          // Если строка не пуста, просто сохраняем и завершаем
          this.updateLines();
        }
        this.currentLineIndex = null; // Завершаем редактирование
      }
    }
  }

  private focusInput(): void {
    requestAnimationFrame(() => {
      const editor = this.editorRef.nativeElement;
      const input = editor.querySelector('input') as HTMLInputElement;
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length); // Курсор в конец
      }
    });
  }

  onLineClick(index: number): void {
    this.currentLineIndex = index;
    this.focusInput();
  }

  renderLine(line: string): string {
    return marked(line).toString();
  }

  onRightClick(event: MouseEvent): void {
    event.preventDefault();
    this.menuX = event.clientX;
    this.menuY = event.clientY;
    this.showContextMenu = true;
  }

  onMenuClose(): void {
    this.showContextMenu = false;
  }

  speak(gender: Gender): void {
    this.currentGender = gender;
    this.showAudioTrack.value = true;
  }

  hideAudioTrack(): void {
    this.showAudioTrack.value = false;
  }

  async baseTranslate(){
    const selectedPath = await DialogService.StaticSelectPath(true);
    if(!selectedPath){return;}
    const filePath = `${selectedPath}\\${'translate.txt'}`
    await this.languageTranslateService.translateAndSave('Привет как дела?', filePath);
  }

  toggleVersionSidebar(){
    this.isVersionPanelCollapsed = !this.isVersionPanelCollapsed;
  }

  // Данные для версий
  versions: Version[] = [
    { id: '1', fileName: 'file_v1.md', versionNumber: 'v1', size: '12 KB', createdAt: '2025-03-30 14:00', isActive: false },
    { id: '2', fileName: 'file_v2.md', versionNumber: 'v2', size: '15 KB', createdAt: '2025-03-30 15:30', isActive: true },
    { id: '3', fileName: 'file_v3.md', versionNumber: 'v3', size: '18 KB', createdAt: '2025-03-30 16:00', isActive: false }
  ];

  selectVersion(versionId: string): void {
    this.versions = this.versions.map(version => ({
      ...version,
      isActive: version.id === versionId
    }));
    const activeVersion = this.versions.find(v => v.isActive);
    if (activeVersion) {
      this.content = `Содержимое версии ${activeVersion.versionNumber}`; // Заглушка, замените на загрузку реального контента
      this.lines = this.content.split('\n');
      this.updateStats();
    }
  }

  toggleVersionPanel(isCollapsed: boolean): void {
    this.isVersionPanelCollapsed = isCollapsed;
  }

  protected readonly MarkdownView = MarkdownView;
  protected readonly MdSettingsContextMenu = MdSettingsContextMenu;
  protected readonly Gender = Gender;
  protected readonly SettingsService = SettingsService;
}
