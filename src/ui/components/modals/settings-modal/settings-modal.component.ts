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
import {ConfigService} from "../../../../services/configService";
import {LanguageService} from "../../../../services/language.service";
import {AppConstConfig} from "../../../../shared/constants/app/app.const";
import {Language} from "../../../../assets/localization/languages";

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
  selectedChip: string = 'general';
  currentLang: string = Language.RU;

  constructor(private windowService: WindowService, private configService: ConfigService, private languageService: LanguageService) {
    MarkdownFilesService.initialize().then(() => this.loadInitialFiles());
  }

  async ngOnInit(){
    await SettingsService.loadSettings();

    if (!this.configService.getConfig()) {
      await this.configService.loadConfig();
    }
    this.currentLang = this.configService.getLanguage().toString().toLowerCase();

    this.languageService.setDefaultLang(this.currentLang);
    this.languageService.useLang(this.currentLang);
  }

  async openTab(type: MarkdownFilesType): Promise<void> {
    const path = await MarkdownFilesService.getFilePath(type, SettingsService.getLanguage());
    const name = AppConstConfig.MARKDOWN[type][this.currentLang as Language].name;
    this.tabService.createTab(path, name);
  }

  private async loadInitialFiles(): Promise<void> {
  }

  selectChip(chip: string): void {
    this.selectedChip = chip;
  }

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
