import {Component, Input} from '@angular/core';
import {FillButtonComponent} from "../../buttons/fill-button/fill-button.component";
import {TabService} from "../../../../services/tab.service";
import {MarkdownFilesService} from "../../../../services/Markdown/markdown-files.service";
import {MarkdownFilesType} from "../../../../interfaces/markdown/markdownFiles.interface";
import {SettingsService} from "../../../../services/settings.service";
import {LanguageSelectorComponent} from "../../language-selector/language-selector.component";
import {NgIf} from "@angular/common";
import {ThemeToggleComponent} from "../../theme-toggle/theme-toggle.component";
import {WindowService} from "../../../../services/window.service";

@Component({
  selector: 'app-settings-modal',
  standalone: true,
  imports: [
    FillButtonComponent,
    LanguageSelectorComponent,
    NgIf,
    ThemeToggleComponent
  ],
  templateUrl: './settings-modal.component.html',
  styleUrl: './settings-modal.component.css'
})
export class SettingsModalComponent {
  @Input() tabService!: TabService;
  selectedChip: string = 'general'; // Текущий выбранный чип

  constructor(private windowService: WindowService) {
    MarkdownFilesService.initialize().then(() => this.loadInitialFiles());
  }

  async ngOnInit(){
    await SettingsService.loadSettings(); // Загружаем настройки при инициализации
  }

  async openTab(type: MarkdownFilesType): Promise<void> {
    const path = await MarkdownFilesService.getFilePath(type, SettingsService.getLanguage());
    const name = path.split('/').pop() || path; // Используем имя файла из пути
    this.tabService.createTab(path, name);
  }

  private async loadInitialFiles(): Promise<void> {
    // Можно добавить автозагрузку, если нужно
  }

  // Переключение чипов
  selectChip(chip: string): void {
    this.selectedChip = chip;
  }

  // Методы для работы с настройками
  getLanguage(): string {
    return SettingsService.getLanguage();
  }
  setLanguage(language: string): void {
    SettingsService.setLanguage(language);
  }

  getTheme(): string {
    return SettingsService.getTheme();
  }
  toggleTheme(): void {
    const newTheme = this.getTheme() === 'dark' ? 'light' : 'dark';
    SettingsService.setTheme(newTheme);
  }

  async login() {
    await this.windowService.openLoginWindow();
  }

  protected readonly MarkdownFilesType = MarkdownFilesType;
  protected readonly SettingsService = SettingsService;
}
