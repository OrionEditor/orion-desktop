import {
  Component, createComponent,
  ElementRef,
  EnvironmentInjector,
  inject,
  Input,
  SecurityContext,
  SimpleChanges,
  ViewChild
} from '@angular/core';
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
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {VersionListComponent} from "../../versions/version-list/version-list.component";
import {ModalBaseComponent} from "../../modals/modal-base/modal-base.component";
import {SettingsModalComponent} from "../../modals/settings-modal/settings-modal.component";
import {SettingsService} from "../../../../services/settings.service";
import {LinkType} from "../../../../shared/enums/link-type.enum";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {MarkdownLinkParserService} from "../../../../services/Markdown/markdown-link-parser.service";
import {ImageMarkdownTemplate} from "../../../../shared/constants/templates/image-markdown.template";
import {VideoMarkdownTemplate} from "../../../../shared/constants/templates/video-markdown.template";
import {AudioMarkdownTemplate} from "../../../../shared/constants/templates/audio-markdown.template";
import {join, resolveResource} from "@tauri-apps/api/path";
import {CodeMarkdownTemplate} from "../../../../shared/constants/templates/code-markdown.template";
import {MarkdownCodeParserService} from "../../../../services/Parsers/md-code.parser.service";
import {initializeLinkHandler} from "../../../../utils/markown/link/link.utils";
import hljs from 'highlight.js';
import {TableMarkdownTemplate} from "../../../../shared/constants/templates/table-markdown.template";
import {MarkdownTableParserService} from "../../../../services/Parsers/md-table.parser.service";
import {DocumentService} from "../../../../services/Routes/document/document.service";
import {DocumentLocalService} from "../../../../services/LocalServices/document-local.service";
import {StoreService} from "../../../../services/Store/store.service";
import {StoreKeys} from "../../../../shared/constants/vault/store.keys";
import {GetDocumentResponse} from "../../../../interfaces/routes/document.interface";
import {Version} from "../../../../interfaces/routes/document.interface";
import {VersionService} from "../../../../services/Routes/version.service";
import {mkdir, readFile} from "@tauri-apps/plugin-fs";
import {ToastService} from "../../../../services/Notifications/toast.service";
import {writeFile, remove} from "@tauri-apps/plugin-fs";
import {ConfirmModalService} from "../../../../services/Modals/confirm-modal.service";
import {ModalsConfig} from "../../../../shared/constants/modals/confirm/modals-config";
import * as Diff from 'diff';
import {VersionDiffModalComponent} from "../../modals/version-diff-modal/version-diff-modal.component";

interface TocItem {
  level: number; // Уровень заголовка (1 для #, 2 для ##, и т.д.)
  text: string; // Текст заголовка
  id: string; // Уникальный ID для навигации
}

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
    SettingsModalComponent,
    HttpClientModule,
    VersionDiffModalComponent
  ],
  templateUrl: './markdown-content.component.html',
  styleUrl: './markdown-content.component.css'
})
export class MarkdownContentComponent {
  @Input() filePath: string = '';
  @Input() fileName: string = '';
  @Input() projectPath: string = '';
  documentPath: string = this.filePath;

  @ViewChild('textareaRef', { static: false }) textareaRef!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('editorRef', { static: false }) editorRef!: ElementRef<HTMLDivElement>;
  @ViewChild('renderedContentRef', { static: false }) renderedContentRef!: ElementRef<HTMLDivElement>;
  @ViewChild('editorContentRef', { static: false }) editorContentRef!: ElementRef<HTMLDivElement>;

  projectId: string = '';
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

  onDocumentCloudSync: boolean = false;

  currentDocument: GetDocumentResponse | null = null;

  // Данные для версий
  versions: Version[] = [];

  // Свойства для управления модальным окном
  showDiffModal: boolean = false;
  prevVersionContent: string = '';
  currentVersionContent: string = '';
  prevVersionNumber: number = 0;
  currentVersionNumber: number = 0;
  prevFileSize: number = 0;
  currentFileSize: number = 0;


  // Новое свойство для хранения HTML различий
  diffContent: SafeHtml | string = '';
  // Чекбокс для отображения изменений
  showDiff: boolean = false;

  showTableOfContents: boolean = true; // По умолчанию включено

  twoSideFullView: boolean = false;

  toggleTwoSideFullView(){
    this.twoSideFullView = !this.twoSideFullView;
  }

  constructor(private markdownService: MarkdownService, private markdownInfoService: MarkdownInfoService, private dialogService: DialogService, private languageTranslateService: LanguageTranslateService, private linkParserService: MarkdownLinkParserService,
              private sanitizer: DomSanitizer, private codeParserService: MarkdownCodeParserService, private tableParserService: MarkdownTableParserService, private http: HttpClient) {}

  private documentService = new DocumentService(this.http);
  private documentLocalService = new DocumentLocalService(this.documentService);

  private versionService = new VersionService(this.http);

  private injector = inject(EnvironmentInjector);

  // private async updateRenderedContent(): Promise<void> {
  //   const links = this.linkParserService.extractLinksAndImages(this.content);
  //   let html = marked(this.content).toString();
  //   console.log('Parsed HTML:', html);
  //   console.log('Links:', links);
  //
  //   for (const [index, link] of links.entries()) {
  //     let url = link.url;
  //
  //     try {
  //       link.url = decodeURI(link.url);
  //     } catch (e) {
  //     }
  //
  //     // Если это локальный путь, преобразуем его в file:///
  //     if (!link.url.startsWith('http://') && !link.url.startsWith('https://')) {
  //       const basePath = this.filePath.substring(0, this.filePath.lastIndexOf('/'));
  //       try {
  //         // Формируем абсолютный путь
  //         const localPath = `${basePath}/${link.url}`.replace(/\\/g, '/');
  //         const encodedPath = encodeURI(localPath);
  //         link.url = `file:///${encodedPath}`;
  //       } catch (e) {
  //       }
  //     }
  //
  //         if (link.isImage && link.type === LinkType.IMAGE) {
  //           html = html.replace(
  //
  //           `[<img src="${link.url}" alt="${link.text}">]`,
  //               ImageMarkdownTemplate(link.url, `image-${index}`)
  //           );
  //           html = html.replace(
  //               `<img src="${link.url}" alt="${link.text}">`,
  //               ImageMarkdownTemplate(link.url, `image-${index}`)
  //           );
  //         } else if (link.type === LinkType.VIDEO) {
  //           html = html.replace(
  //               `[<img src="${link.url}" alt="${link.text}">]`,
  //               VideoMarkdownTemplate(link.url, `video-${index}`)
  //           );
  //           html = html.replace(
  //               `<img src="${link.url}" alt="${link.text}">`,
  //               VideoMarkdownTemplate(link.url, `video-${index}`)
  //           );
  //         } else if (link.type === LinkType.AUDIO) {
  //           html = html.replace(
  //               `[![${link.text}](${url})]`,
  //             AudioMarkdownTemplate(link.url, `audio-${index}`)
  //           );
  //           html = html.replace(
  //               `[![${link.text}](${link.url})]`,
  //               AudioMarkdownTemplate(link.url, `audio-${index}`)
  //           );
  //         }
  //   }
  //
  //   this.renderedContent = this.sanitizer.bypassSecurityTrustHtml(html);
  // }
  //
  // ngAfterViewInit(): void {
  //   this.updateTextareaHighlight();
  // }

  private async updateRenderedContent(): Promise<void> {
    let html = marked(this.content).toString();
    console.log('Parsed HTML:', html);

    // Извлекаем заголовки
    const headings = this.extractHeadings();

    // Добавляем id к заголовкам в HTML
    let headingIndex = 0;
    html = html.replace(/<(h[1-6])>(.*?)<\/\1>/g, (match, tag, text) => {
      const heading = headings[headingIndex++];
      if (heading) {
        return `<${tag} id="${heading.id}">${text}</${tag}>`;
      }
      return match;
    });

    // Обработка ссылок и медиа
    const links = this.linkParserService.extractLinksAndImages(this.content);
    console.log('Links:', links);

    for (const [index, link] of links.entries()) {
      let url = link.url;

      try {
        url = decodeURI(url);
      } catch (e) {
        console.error(`Failed to decode URL: ${url}`, e);
      }

      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        const basePath = this.filePath.substring(0, this.filePath.lastIndexOf('/'));
        try {
          const localPath = `${basePath}/${url}`.replace(/\\/g, '/');
          const encodedPath = encodeURI(localPath);
          url = `file:///${encodedPath}`;
          console.log(`Transformed local path: ${link.url} -> ${url}`);
        } catch (e) {
          console.error(`Failed to transform path for ${url}`, e);
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


    // Обработка блоков кода
    const codeBlocks = this.codeParserService.extractCodeBlocks(this.content);
    codeBlocks.forEach((block, index) => {
      const codeBlockHtml = marked(`\`\`\`${block.language}\n${block.code}\n\`\`\``).toString();
      const escapedCode = block.code.replace(/[&<>"']/g, (match) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[match]!));
      html =  html.replace(
          codeBlockHtml,
          CodeMarkdownTemplate(escapedCode, block.language, `code-${index}`)
      );
    });

    // Обработка таблиц
    const tableBlocks = this.tableParserService.extractTableBlocks(this.content);
    console.log('Table Blocks:', tableBlocks);
    tableBlocks.forEach((block, index) => {
      const tableMarkdown = this.content.slice(block.startIndex, block.endIndex);
      console.log('Table Markdown:', tableMarkdown);
      const tableBlockHtml = marked(tableMarkdown).toString();
      console.log('Table HTML:', tableBlockHtml);
      html = html.replace(
          tableBlockHtml,
          TableMarkdownTemplate(block.headers, block.rows, `table-${index}`)
      );
    });

    // Добавляем содержание в начало, если включено
    if (this.showTableOfContents) {
      const tocHtml = this.generateTocHtml(headings);
      html = tocHtml + html;
    }

    this.renderedContent = this.sanitizer.bypassSecurityTrustHtml(html);
    setTimeout(() => {
      hljs.highlightAll();
    }, 100)
  }



  ngAfterViewInit(): void {
    this.updateTextareaHighlight();
    if (this.renderedContentRef) {
      initializeLinkHandler(this.renderedContentRef.nativeElement);
      this.renderedContentRef.nativeElement.addEventListener('click', (event: Event) => {
        const target = event.target as HTMLElement;
        if (target.classList.contains('toc-link')) {
          event.preventDefault();
          event.stopPropagation(); // Останавливаем распространение события
          const id = target.getAttribute('data-target');
          if (id) {
            const element = this.renderedContentRef.nativeElement.querySelector(`#${id}`);
            if (element) {
              element.scrollIntoView({behavior: 'smooth'});
              // Очищаем hash в URL, если он изменился
              history.replaceState(null, '', window.location.pathname + window.location.search);
            }
          }
        }
      });
      // Применяем подсветку Highlight.js
      hljs.highlightAll();

        const imageContainers = this.renderedContentRef.nativeElement.querySelectorAll('.image-container');
        const videoContainers = this.renderedContentRef.nativeElement.querySelectorAll('.video-container');
        const audioContainers = this.renderedContentRef.nativeElement.querySelectorAll('.audio-container');
        const codeContainers = this.renderedContentRef.nativeElement.querySelectorAll('.code-container');
        const tableContainers = this.renderedContentRef.nativeElement.querySelectorAll('.table-container');
        console.log('Image containers found:', imageContainers.length);
        console.log('Video containers found:', videoContainers.length);
        console.log('Audio containers found:', audioContainers.length);
        console.log('Code containers found:', codeContainers.length);
        console.log('Table containers found:', tableContainers.length);
    }
  }

  async ngOnInit() {
    this.documentPath = this.filePath;
    await this.loadContent();
    this.markdownService.content$.subscribe(content => {
      this.content = content;
      this.updateRenderedContent();
      this.updateLineNumbers();
      this.updateStats();
      this.updateLines();
    });

    this.projectId = await StoreService.get(StoreKeys.PROJECT_ID) || '';

    this.MarkdownSettingsMenuItems = [
      ...MdSettingsContextMenu(this.filePath, this.content, this.fileName, this.showAudioTrack),
      {
        id: '0001',
        text: 'Показать изменения',
        action: () => this.showVersionDiffModal(),
        select: false,
        icon: 'assets/icons/svg/contextMenu/diff.svg'
      },
      {
        id: '0002',
        text: 'Показать/скрыть содержание',
        action: () => this.toggleTableOfContents(),
        select: this.showTableOfContents,
        icon: 'assets/icons/svg/contextMenu/heading.svg'
      }
    ];
    this.onDocumentCloudSync = await this.documentLocalService.syncDocument(this.projectId,this.fileName, this.filePath, this.projectPath);

    this.currentDocument = this.documentLocalService.getDocumentByNameFromCache(this.projectId, this.fileName);

    if(this.currentDocument){
      this.versions = [{id: 0, document_id: '0', version_number: 0, is_active: true, created_at: '', content_hash: '', s3_path: ''},...this.currentDocument.versions];
    }
  }

  toggleTableOfContents() {
    this.showTableOfContents = !this.showTableOfContents;
    this.MarkdownSettingsMenuItems = this.MarkdownSettingsMenuItems.map(item =>
        item.text === 'Показать содержание' ? { ...item, select: this.showTableOfContents } : item
    );
    this.updateRenderedContent(); // Обновляем отображение
  }

  extractHeadings(): TocItem[] {
  const headings: TocItem[] = [];
  const lines = this.content.split('\n');
  const headingRegex = /^(#+)\s+(.+)/;

  lines.forEach((line, index) => {
    const match = line.match(headingRegex);
    if (match) {
      const level = match[1].length; // Количество # определяет уровень
      const text = match[2].trim();
      // Генерируем уникальный ID, заменяя пробелы на дефисы и добавляя индекс
      const id = `heading-${text.toLowerCase().replace(/\s+/g, '-')}-${index}`;
      headings.push({ level, text, id });
    }
  });

  console.log('Extracted headings:', headings);
  return headings;
  }

  // private generateTocHtml(headings: TocItem[]): string {
  //   if (!headings.length) {
  //     return '<div class="toc"><h3>Содержание</h3><p>Нет заголовков</p></div>';
  //   }
  //
  //   let html = '<div class="toc"><h3>Содержание</h3><ul>';
  //   let currentLevel = 1;
  //
  //   headings.forEach(heading => {
  //     while (heading.level > currentLevel) {
  //       html += '<ul>';
  //       currentLevel++;
  //     }
  //     while (heading.level < currentLevel) {
  //       html += '</ul>';
  //       currentLevel--;
  //     }
  //     html += `<li><a href="#${heading.id}" class="toc-link">${heading.text}</a></li>`;
  //   });
  //
  //   while (currentLevel > 1) {
  //     html += '</ul>';
  //     currentLevel--;
  //   }
  //   html += '</ul></div>';
  //
  //   return html;
  // }

  private generateTocHtml(headings: TocItem[]): string {
    if (!headings.length) {
      return '<div class="toc"><h3>Содержание</h3><p>Нет заголовков</p></div>';
    }

    let html = '<div class="toc"><h3>Содержание</h3><ul>';
    let currentLevel = 1;

    headings.forEach(heading => {
      while (heading.level > currentLevel) {
        html += '<ul>';
        currentLevel++;
      }
      while (heading.level < currentLevel) {
        html += '</ul>';
        currentLevel--;
      }
      html += `<li><a data-target="${heading.id}" class="toc-link">${heading.text}</a></li>`;
    });

    while (currentLevel > 1) {
      html += '</ul>';
      currentLevel--;
    }
    html += '</ul></div>';

    return html;
  }

  async toggleShowDiff() {
    this.showDiff = !this.showDiff;
    this.MarkdownSettingsMenuItems = this.MarkdownSettingsMenuItems.map(item =>
        item.text === 'Показать изменения' ? { ...item, select: this.showDiff } : item
    );
    if (this.showDiff) {
      await this.selectVersion(this.versions.find(v => v.is_active)?.version_number.toString() || '0');
    } else {
      this.diffContent = '';
    }
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

  async onContentChange(event: Event){
    const textarea = event.target as HTMLTextAreaElement;
    this.content = textarea.value;
    this.markdownService.saveMarkdownFile(this.filePath, this.content).then();
    await this.updateRenderedContent();
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

  // async selectVersion(versionId: string): Promise<void> {
  //   try {
  //     // Обновляем статус активности версий
  //     this.versions = this.versions.map(version => ({
  //       ...version,
  //       is_active: version.version_number === Number(versionId)
  //     }));
  //
  //     const activeVersion = this.versions.find(v => v.is_active);
  //     if (!activeVersion) {
  //       throw new Error('Активная версия не найдена');
  //     }
  //
  //     // Загружаем содержимое версии
  //     let versionContent: string;
  //     if (activeVersion.id === 0) {
  //       this.filePath = this.documentPath;
  //       // Для локальной версии (id: 0) используем текущий файл
  //       const fileData = await readFile(this.filePath);
  //       versionContent = new TextDecoder('utf-8').decode(fileData);
  //     } else {
  //       // Для остальных версий загружаем из .orion/versions
  //       if (!this.currentDocument) {
  //         throw new Error('Документ не выбран');
  //       }
  //       const documentId = this.currentDocument.document.id;
  //       const versionNumber = activeVersion.version_number;
  //       const versionsDir = await join(this.projectPath, '.orion', 'versions', documentId);
  //       const versionFileName = `v${versionNumber}_${this.fileName}`;
  //       const versionFilePath = await join(versionsDir, versionFileName);
  //       this.filePath = versionFilePath;
  //
  //       const fileData = await readFile(versionFilePath);
  //       versionContent = new TextDecoder('utf-8').decode(fileData);
  //     }
  //
  //     // Обновляем содержимое
  //     this.content = versionContent;
  //     this.lines = this.content.split('\n');
  //     await this.updateRenderedContent();
  //     this.updateStats();
  //
  //     console.log(`Версия ${activeVersion.version_number} загружена:`, versionContent);
  //   } catch (e) {
  //     console.error('Ошибка при выборе версии:', e);
  //     ToastService.danger(`Не удалось загрузить версию: ${e}`);
  //   }
  // }

  async showVersionDiffModal() {
    const activeVersion = this.versions.find(v => v.is_active);
    if (!activeVersion) {
      ToastService.warning('Активная версия не выбрана');
      return;
    }

    if (activeVersion.version_number === 0) {
      ToastService.warning('Для локальной версии сравнение недоступно');
      return;
    }

    try {
      let currentContent: string;
      let prevContent: string = '';
      let currentFileSize: number = 0;
      let prevFileSize: number = 0;

      if (!this.currentDocument) {
        throw new Error('Документ не выбран');
      }

      const documentId = this.currentDocument.document.id;
      const versionsDir = await join(this.projectPath, '.orion', 'versions', documentId);
      const currentVersionFileName = `v${activeVersion.version_number}_${this.fileName}`;
      const currentVersionFilePath = await join(versionsDir, currentVersionFileName);
      const currentFileData = await readFile(currentVersionFilePath);
      currentContent = new TextDecoder('utf-8').decode(currentFileData);
      currentFileSize = currentFileData.length;

      const prevVersion = this.versions.find(v => v.version_number === activeVersion.version_number - 1);
      if (prevVersion) {
        let prevFilePath: string;
        if (prevVersion.id === 0) {
          prevFilePath = this.documentPath;
        } else {
          const prevVersionFileName = `v${prevVersion.version_number}_${this.fileName}`;
          prevFilePath = await join(versionsDir, prevVersionFileName);
        }
        try {
          const prevFileData = await readFile(prevFilePath);
          prevContent = new TextDecoder('utf-8').decode(prevFileData);
          prevFileSize = prevFileData.length;
        } catch (e) {
          console.warn(`Не удалось загрузить предыдущую версию ${prevVersion.version_number}:`, e);
        }
      }

      // Устанавливаем данные для модального окна
      this.prevVersionContent = prevContent;
      this.currentVersionContent = currentContent;
      this.prevVersionNumber = prevVersion ? prevVersion.version_number : 0;
      this.currentVersionNumber = activeVersion.version_number;
      this.prevFileSize = prevFileSize;
      this.currentFileSize = currentFileSize;
      this.showDiffModal = true; // Показываем модальное окно

    } catch (e) {
      console.error('Ошибка при открытии модального окна сравнения:', e);
      ToastService.danger(`Не удалось открыть сравнение версий: ${e}`);
    }
  }

  closeDiffModal() {
    this.showDiffModal = false; // Скрываем модальное окно
  }

  // async selectVersion(versionId: string): Promise<void> {
  //   try {
  //     this.versions = this.versions.map(version => ({
  //       ...version,
  //       is_active: version.version_number === Number(versionId)
  //     }));
  //
  //     const activeVersion = this.versions.find(v => v.is_active);
  //     if (!activeVersion) {
  //       throw new Error('Активная версия не найдена');
  //     }
  //
  //     let versionContent: string;
  //     let prevVersionContent: string = '';
  //     if (activeVersion.id === 0) {
  //       this.filePath = this.documentPath;
  //       const fileData = await readFile(this.filePath);
  //       versionContent = new TextDecoder('utf-8').decode(fileData);
  //     } else {
  //       if (!this.currentDocument) {
  //         throw new Error('Документ не выбран');
  //       }
  //       const documentId = this.currentDocument.document.id;
  //       const versionNumber = activeVersion.version_number;
  //       const versionsDir = await join(this.projectPath, '.orion', 'versions', documentId);
  //       const versionFileName = `v${versionNumber}_${this.fileName}`;
  //       const versionFilePath = await join(versionsDir, versionFileName);
  //       this.filePath = versionFilePath;
  //
  //       const fileData = await readFile(versionFilePath);
  //       versionContent = new TextDecoder('utf-8').decode(fileData);
  //
  //       // Загружаем предыдущую версию
  //       const prevVersion = this.versions.find(v => v.version_number === versionNumber - 1);
  //       if (prevVersion) {
  //         let prevFilePath: string;
  //         if (prevVersion.id === 0) {
  //           prevFilePath = this.documentPath;
  //         } else {
  //           const prevVersionFileName = `v${prevVersion.version_number}_${this.fileName}`;
  //           prevFilePath = await join(versionsDir, prevVersionFileName);
  //         }
  //         try {
  //           const prevFileData = await readFile(prevFilePath);
  //           prevVersionContent = new TextDecoder('utf-8').decode(prevFileData);
  //         } catch (e) {
  //           console.warn(`Не удалось загрузить предыдущую версию ${prevVersion.version_number}:`, e);
  //         }
  //       }
  //     }
  //
  //     this.content = versionContent;
  //     this.lines = this.content.split('\n');
  //
  //     if (this.showDiff && activeVersion.version_number > 0) {
  //       const diff = Diff.diffLines(prevVersionContent, versionContent);
  //       let diffHtml = '';
  //       diff.forEach((part: { value: string; added: any; removed: any; }) => {
  //         // @ts-ignore
  //         const escapedValue = part.value.replace(/[&<>"']/g, match => ({
  //           '&': '&amp;',
  //           '<': '&lt;',
  //           '>': '&gt;',
  //           '"': '&quot;',
  //           "'": '&#39;'
  //         }[match]!));
  //         if (part.added) {
  //           diffHtml += `<span class="diff-added">${escapedValue}</span>`;
  //         } else if (part.removed) {
  //           diffHtml += `<span class="diff-removed">${escapedValue}</span>`;
  //         } else {
  //           diffHtml += `<span>${escapedValue}</span>`;
  //         }
  //       });
  //       this.diffContent = this.sanitizer.bypassSecurityTrustHtml(diffHtml.replace(/\n/g, '<br>'));
  //     } else {
  //       this.diffContent = '';
  //     }
  //
  //     await this.updateRenderedContent();
  //     this.updateStats();
  //
  //     console.log(`Версия ${activeVersion.version_number} загружена:`, versionContent);
  //   } catch (e) {
  //     console.error('Ошибка при выборе версии:', e);
  //     ToastService.danger(`Не удалось загрузить версию: ${e}`);
  //   }
  // }

  async selectVersion(versionId: string): Promise<void> {
    try {
      this.versions = this.versions.map(version => ({
        ...version,
        is_active: version.version_number === Number(versionId)
      }));

      const activeVersion = this.versions.find(v => v.is_active);
      if (!activeVersion) {
        throw new Error('Активная версия не найдена');
      }

      let versionContent: string;
      if (activeVersion.id === 0) {
        this.filePath = this.documentPath;
        const fileData = await readFile(this.filePath);
        versionContent = new TextDecoder('utf-8').decode(fileData);
      } else {
        if (!this.currentDocument) {
          throw new Error('Документ не выбран');
        }
        const documentId = this.currentDocument.document.id;
        const versionNumber = activeVersion.version_number;
        const versionsDir = await join(this.projectPath, '.orion', 'versions', documentId);
        const versionFileName = `v${versionNumber}_${this.fileName}`;
        const versionFilePath = await join(versionsDir, versionFileName);
        this.filePath = versionFilePath;

        const fileData = await readFile(versionFilePath);
        versionContent = new TextDecoder('utf-8').decode(fileData);
      }

      this.content = versionContent;
      this.lines = this.content.split('\n');
      await this.updateRenderedContent();
      this.updateStats();

      console.log(`Версия ${activeVersion.version_number} загружена:`, versionContent);
    } catch (e) {
      console.error('Ошибка при выборе версии:', e);
      ToastService.danger(`Не удалось загрузить версию: ${e}`);
    }
  }

  async createNewDocumentVersion() {
    try {
      if (!this.currentDocument || !this.currentDocument.document.id) {
        throw new Error('Документ не выбран');
      }

      // Создаём новую версию на сервере
      const newVersion = await this.versionService.createVersion(
          this.currentDocument.document.id,
          this.filePath
      );

      const findV = this.versions.find(v => v.version_number === newVersion.version_number);
      if(findV){
        ToastService.warning(`В файле нет новых изменений, версия не может быть создана!`);
        return;
      }

      // // Обновляем локальный массив versions
      // this.versions = [newVersion, ...this.versions];

      // Обновляем локальный массив versions, добавляя новую версию на индекс 1
      this.versions = [
        this.versions[0], // Сохраняем версию с индексом 0
        newVersion,       // Новая версия на индекс 1
        ...this.versions.slice(1) // Остальные версии
      ];

      // Создаём локальную копию версии
      const documentId = this.currentDocument.document.id;
      const versionNumber = newVersion.version_number;
      const versionsDir = await join(this.projectPath, '.orion', 'versions', documentId);

      // Создаём директорию, если не существует
      await mkdir(versionsDir, { recursive: true });

      // Формируем имя файла версии
      const versionFileName = `v${versionNumber}_${this.fileName}`;
      const versionFilePath = await join(versionsDir, versionFileName);

      // Копируем файл
      const fileContent = await readFile(this.filePath);
      await writeFile(versionFilePath, fileContent);

      console.log(`Версия ${versionNumber} создана локально: ${versionFilePath}`);
      ToastService.success(`Версия ${versionNumber} успешно создана!`);
    } catch (e) {
      console.error('Ошибка при создании новой версии:', e);
      ToastService.danger(`Не удалось создать новую версию: ${e}`);
    }
  }


  async deleteCurrentVersion() {
    try {
      if (!this.currentDocument || !this.currentDocument.document.id) {
        throw new Error('Документ не выбран');
      }

      // Находим активную версию
      const activeVersion = this.versions.find(v => v.is_active);
      if (!activeVersion) {
        throw new Error('Активная версия не найдена');
      }

      // Проверяем, что версия не локальная (id !== 0)
      if (activeVersion.id === 0) {
        ToastService.warning('Локальная версия не может быть удалена');
        return;
      }

      const result = await ConfirmModalService.createConfirmModal(
          this.injector,
          ModalsConfig.ConfirmModal.deleteVersion.title,
          ModalsConfig.ConfirmModal.deleteVersion.description
      );

      if(!result){return;}

      // Удаляем версию на сервере
      await this.versionService.deleteVersion(activeVersion.id);

      // Обновляем локальный массив versions, удаляя активную версию
      this.versions = this.versions.filter(v => v.id !== activeVersion.id);

      // Удаляем локальный файл версии
      const documentId = this.currentDocument.document.id;
      const versionNumber = activeVersion.version_number;
      const versionsDir = await join(this.projectPath, '.orion', 'versions', documentId);
      const versionFileName = `v${versionNumber}_${this.fileName}`;
      const versionFilePath = await join(versionsDir, versionFileName);

      await remove(versionFilePath);

      console.log(`Версия ${versionNumber} удалена локально: ${versionFilePath}`);
      ToastService.success(`Версия ${versionNumber} успешно удалена!`);

      // Если удалена активная версия, выбираем локальную версию (id: 0) как активную
      if (this.versions.length > 0) {
        this.selectVersion('0');
      }
    } catch (e) {
      console.error('Ошибка при удалении версии:', e);
      ToastService.danger(`Не удалось удалить версию: ${e}`);
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
