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
import {Project} from "../../../../interfaces/routes/project.interface";
import {ToastService} from "../../../../services/Notifications/toast.service";
import {ProjectService} from "../../../../services/Routes/project/project.service";
import {ProjectLocalService} from "../../../../services/LocalServices/project-local.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";

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
    AvatarComponent,
      HttpClientModule
  ],
  templateUrl: './settings-modal.component.html',
  styleUrl: './settings-modal.component.css'
})
export class SettingsModalComponent {
  @Input() tabService!: TabService;
  selectedChip: string = 'general';
  currentLang: string = Language.RU;
  hasAuth: string | null = null;

  projectId: string | null = null;
  currentProject: Project | null = null;

  constructor(private windowService: WindowService, private configService: ConfigService, private languageService: LanguageService, private http: HttpClient) {
    MarkdownFilesService.initialize().then(() => this.loadInitialFiles());
  }

  private projectService = new ProjectService(this.http);
  private projectLocalService = new ProjectLocalService(this.projectService);

  // Проверка текущего проекта
  private async checkProject() {
    try {
      await this.projectLocalService.syncProjects();
      this.currentProject = this.projectLocalService.getCurrentProject();
      this.projectId = this.projectLocalService.getCurrentProject()?.id || null;
    } catch (e) {
      console.error('Ошибка при проверке проекта:', e);
      this.projectId = null;
      this.currentProject = null;
    }
  }

  // Удаление проекта
  async deleteProject() {
    const projectId = this.projectLocalService.getCurrentProject()?.id || null;
      await this.projectLocalService.deleteProject(projectId ? projectId : '');
      ToastService.success('Проект успешно удалён из удалённого хранилища!');
      this.currentProject = null;
      this.projectId = null;
  }

  // Форматирование даты в DD.MM.YYYY
  formatDate(dateString?: string): string {
    if (!dateString) return 'Не указана';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Некорректная дата';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
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

    await this.checkProject();
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
