import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { ContextMenuComponent } from '../../../components/contextMenus/context-menu/context-menu.component';
import { AudioTrackComponent } from '../../../components/audio/audio-track/audio-track.component';
import { VersionListComponent } from '../../../components/versions/version-list/version-list.component';
import { ModalBaseComponent } from '../../../components/modals/modal-base/modal-base.component';
import { SettingsModalComponent } from '../../../components/modals/settings-modal/settings-modal.component';
import { BehaviorSubject } from 'rxjs';
import * as marked from 'marked';
import * as hljs from 'highlight.js';
import { By } from '@angular/platform-browser';
import {Gender} from "../../../../shared/enums/gender.enum";
import {MarkdownContentComponent} from "./markdown-content.component";
import {MarkdownService} from "../../../../services/Markdown/markdown.service";
import {MarkdownInfoService} from "../../../../services/Markdown/markdown-info.service";
import {DialogService} from "../../../../services/dialog.service";
import {LanguageTranslateService} from "../../../../services/translate.service";
import {MarkdownLinkParserService} from "../../../../services/Markdown/markdown-link-parser.service";
import {MarkdownCodeParserService} from "../../../../services/Parsers/md-code.parser.service";
import {MarkdownTableParserService} from "../../../../services/Parsers/md-table.parser.service";
import {MarkdownView} from "../../../../shared/enums/markdown-view.enum";

jest.mock('@tauri-apps/api/core', () => ({
  invoke: jest.fn(),
}));
jest.mock('marked', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('highlight.js', () => ({
  highlightAll: jest.fn(),
}));

describe('MarkdownContentComponent', () => {
  let component: MarkdownContentComponent;
  let fixture: ComponentFixture<MarkdownContentComponent>;
  let markdownServiceMock: jest.Mocked<MarkdownService>;
  let markdownInfoServiceMock: jest.Mocked<MarkdownInfoService>;
  let dialogServiceMock: jest.Mocked<DialogService>;
  let languageTranslateServiceMock: jest.Mocked<LanguageTranslateService>;
  let linkParserServiceMock: jest.Mocked<MarkdownLinkParserService>;
  let sanitizerMock: jest.Mocked<DomSanitizer>;
  let codeParserServiceMock: jest.Mocked<MarkdownCodeParserService>;
  let tableParserServiceMock: jest.Mocked<MarkdownTableParserService>;

  const contentSubject = new BehaviorSubject<string>('');

  beforeEach(waitForAsync(async () => {
    markdownServiceMock = {
      content$: contentSubject.asObservable(),
      readMarkdownFile: jest.fn(),
      saveMarkdownFile: jest.fn().mockResolvedValue(undefined),
    } as any;

    markdownInfoServiceMock = {
      getCharacterCount: jest.fn().mockReturnValue(0),
      getWordCount: jest.fn().mockReturnValue(0),
      getLineCount: jest.fn().mockReturnValue(0),
      getReadingTime: jest.fn().mockReturnValue('0 min'),
      getHeadingCount: jest.fn().mockReturnValue(0),
    } as any;

    dialogServiceMock = {
      selectPath: jest.fn(),
      StaticSelectPath: jest.fn(),
    } as any;

    languageTranslateServiceMock = {
      translateAndSave: jest.fn().mockResolvedValue(undefined),
    } as any;

    linkParserServiceMock = {
      extractLinksAndImages: jest.fn().mockReturnValue([]),
    } as any;

    sanitizerMock = {
      bypassSecurityTrustHtml: jest.fn().mockImplementation((value) => value as SafeHtml),
    } as any;

    codeParserServiceMock = {
      extractCodeBlocks: jest.fn().mockReturnValue([]),
    } as any;

    tableParserServiceMock = {
      extractTableBlocks: jest.fn().mockReturnValue([]),
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        NgForOf,
        NgIf,
        MarkdownContentComponent,
        ContextMenuComponent,
        AudioTrackComponent,
        VersionListComponent,
        ModalBaseComponent,
        SettingsModalComponent,
      ],
      providers: [
        { provide: MarkdownService, useValue: markdownServiceMock },
        { provide: MarkdownInfoService, useValue: markdownInfoServiceMock },
        { provide: DialogService, useValue: dialogServiceMock },
        { provide: LanguageTranslateService, useValue: languageTranslateServiceMock },
        { provide: MarkdownLinkParserService, useValue: linkParserServiceMock },
        { provide: DomSanitizer, useValue: sanitizerMock },
        { provide: MarkdownCodeParserService, useValue: codeParserServiceMock },
        { provide: MarkdownTableParserService, useValue: tableParserServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MarkdownContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('должен быть создан', () => {
    expect(component).toBeTruthy();
    expect(component.content).toBe('');
    expect(component.view).toBe(MarkdownView.TWO_SIDE);
    expect(component.statistics).toEqual({
      characterCount: 0,
      wordCount: 0,
      lineCount: 0,
      readingTime: '',
      headingCount: 0,
    });
  });

  it('должен загружать контент при инициализации с filePath', waitForAsync(async () => {
    component.filePath = '/test/file.md';
    await component.ngOnInit();
    expect(markdownServiceMock.readMarkdownFile).toHaveBeenCalledWith('/test/file.md');
  }));

  it('должен обновлять контент при изменении filePath', waitForAsync(async () => {
    component.filePath = '/test/file1.md';
    await component.ngOnChanges({ filePath: { currentValue: '/test/file2.md', previousValue: '/test/file1.md', firstChange: false } as any });
    expect(markdownServiceMock.readMarkdownFile).toHaveBeenCalledWith('/test/file2.md');
  }));

  it('должен обновлять контент при изменении content$ из MarkdownService', waitForAsync(async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    (marked as unknown as jest.Mock).mockReturnValue('<p>Test content</p>');
    contentSubject.next('# Test content');
    await fixture.whenStable();
    expect(component.content).toBe('# Test content');
    expect(sanitizerMock.bypassSecurityTrustHtml).toHaveBeenCalledWith('<p>Test content</p>');
    expect(markdownInfoServiceMock.getLineCount).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith('Parsed HTML:', '<p>Test content</p>');
    // @ts-ignore
    expect(hljs.highlightAll).toHaveBeenCalled();
  }));

  it('должен обрабатывать изменение контента в textarea', waitForAsync(async () => {
    component.filePath = '/test/file.md';
    const textarea = { value: '# New content', selectionStart: 0 } as HTMLTextAreaElement;
    const event = { target: textarea } as any;
    (marked as unknown as jest.Mock).mockReturnValue('<p>New content</p>');

    await component.onContentChange(event);

    expect(component.content).toBe('# New content');
    expect(markdownServiceMock.saveMarkdownFile).toHaveBeenCalledWith('/test/file.md', '# New content');
    expect(sanitizerMock.bypassSecurityTrustHtml).toHaveBeenCalledWith('<p>New content</p>');
    expect(component.currentLine).toBe(1);
    expect(component.lineNumbers).toEqual([1]);
    expect(markdownInfoServiceMock.getCharacterCount).toHaveBeenCalled();
  }));

  it('должен обновлять текущую строку при движении курсора', () => {
    const textarea = { selectionStart: 10, value: 'Line 1\nLine 2' } as HTMLTextAreaElement;
    const event = { target: textarea } as any;
    component.onCursorMove(event);
    expect(component.currentLine).toBe(2);
  });

  it('должен переключать режим отображения на ONE_SIDE', () => {
    component.onOneSide();
    expect(component.view).toBe(MarkdownView.ONE_SIDE);
  });

  it('должен переключать режим отображения на TWO_SIDE', () => {
    component.onTwoSide();
    expect(component.view).toBe(MarkdownView.TWO_SIDE);
  });

  it('должен показывать контекстное меню при правом клике', () => {
    const event = { preventDefault: jest.fn(), clientX: 100, clientY: 200 } as any;
    component.onRightClick(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.showContextMenu).toBe(true);
    expect(component.menuX).toBe(100);
    expect(component.menuY).toBe(200);
  });

  it('должен скрывать контекстное меню', () => {
    component.showContextMenu = true;
    component.onMenuClose();
    expect(component.showContextMenu).toBe(false);
  });

  it('должен активировать аудиотрек с указанным полом', () => {
    component.speak(Gender.MALE);
    expect(component.currentGender).toBe(Gender.MALE);
    expect(component.showAudioTrack.value).toBe(true);
  });

  it('должен скрывать аудиотрек', () => {
    component.showAudioTrack.value = true;
    component.hideAudioTrack();
    expect(component.showAudioTrack.value).toBe(false);
  });

  // it('должен переводить текст и сохранять в файл', waitForAsync(async () => {
  //   dialogServiceMock.StaticSelectPath.mockResolvedValue('/test/path');
  //   await component.baseTranslate();
  //   expect(dialogServiceMock.StaticSelectPath).toHaveBeenCalledWith(true);
  //   expect(languageTranslateServiceMock.translateAndSave).toHaveBeenCalledWith('Привет как дела?', '/test/path\\translate.txt');
  // }));

  it('должен переключать панель версий', () => {
    component.isVersionPanelCollapsed = true;
    component.toggleVersionSidebar();
    expect(component.isVersionPanelCollapsed).toBe(false);
  });

  it('должен выбирать версию и обновлять контент', () => {
    component.selectVersion('2');
    expect(component.versions.find(v => v.id === '2')?.isActive).toBe(true);
    expect(component.versions.find(v => v.id === '1')?.isActive).toBe(false);
    expect(component.content).toBe('Содержимое версии v2');
    expect(component.lines).toEqual(['Содержимое версии v2']);
    expect(markdownInfoServiceMock.getCharacterCount).toHaveBeenCalled();
  });
});