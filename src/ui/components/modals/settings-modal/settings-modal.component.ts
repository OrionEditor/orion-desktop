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
import {InputTextFieldComponent} from "../../inputs/input-text-field/input-text-field.component";
import {CheckboxComponent} from "../../inputs/checkbox/checkbox.component";
import {StoreService} from "../../../../services/Store/store.service";
import {StoreKeys} from "../../../../shared/constants/vault/store.keys";
import {AvatarComponent} from "../../avatar/avatar.component";
import {danger} from "../../../../styles/var/globalColors";
import {TokenService} from "../../../../services/Token/token.service";

@Component({
  selector: 'app-settings-modal',
  standalone: true,
  imports: [
    FillButtonComponent,
    LanguageSelectorComponent,
    NgIf,
    ThemeToggleComponent,
    InputTextFieldComponent,
    CheckboxComponent,
    AvatarComponent
  ],
  templateUrl: './settings-modal.component.html',
  styleUrl: './settings-modal.component.css'
})
export class SettingsModalComponent {
  @Input() tabService!: TabService;
  selectedChip: string = 'general';
  currentLang: string = Language.RU;
  hasAuth: string | null = null;

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

    this.hasAuth = await StoreService.get(StoreKeys.ACCESS_TOKEN);
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

  onFontChange(event: string){
    SettingsService.setFontSize(Number(event));
  }

  onLineChange(event: boolean){
    SettingsService.setLineNumbers(event);
  }

  async logout(){
    this.hasAuth = null;
    await TokenService.clearAuthToken();
    await StoreService.remove(StoreKeys.ACCESS_TOKEN);
    await WindowService.reloadAllWindows();
  }

  protected readonly MarkdownFilesType = MarkdownFilesType;
  protected readonly SettingsService = SettingsService;
    protected readonly danger = danger;
}
