import { Component } from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import { invoke } from "@tauri-apps/api/core";
import {ConfigService} from "../../../services/configService";
import  {Renderer2} from "@angular/core";
import {applyTheme, observeThemeChanges, setDarkTheme} from "../../../utils/theme.utils";
import {deleteOverflowWindow} from "../../../utils/overflow.utils";
import {gapRightSection} from "../../../utils/startPage.utils";
import {ThemeToggleComponent} from "../../components/theme-toggle/theme-toggle.component";
import {FillButtonComponent} from "../../components/buttons/fill-button/fill-button.component";
import {OutlineButtonComponent} from "../../components/buttons/outline-button/outline-button.component";
import {LogoContainerComponent} from "../../components/logo-container/logo-container.component";
import {success} from "../../../styles/var/globalColors";
import {TranslatePipe} from "@ngx-translate/core";
import {LanguageService} from "../../../services/language.service";
import {LanguageSelectorComponent} from "../../components/language-selector/language-selector.component";
import {Router} from "@angular/router";
import {open} from "@tauri-apps/plugin-dialog";
import {DialogService} from "../../../services/dialog.service";
import {TranslateService} from "@ngx-translate/core";
import {WindowService} from "../../../services/window.service";
import {listen} from "@tauri-apps/api/event";
import {TokenService} from "../../../services/Token/token.service";
import {AvatarComponent} from "../../components/avatar/avatar.component";
import {StoreKeys} from "../../../shared/constants/vault/store.keys";
import {StoreService} from "../../../services/Store/store.service";
import {AppVersionComponent} from "../../components/app-version/app-version.component";
@Component({
  selector: 'app-start-page',
  standalone: true,
    imports: [NgForOf, NgIf, ThemeToggleComponent, FillButtonComponent, OutlineButtonComponent, LogoContainerComponent, TranslatePipe, LanguageSelectorComponent, AvatarComponent, AppVersionComponent],
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.css']
})
export class StartPageComponent {
  recentProjects: { name: string, path: string }[] = [];
  currentTheme: string = "";
  currentLang: string = "";
  hasAuth: string | null = null;
  constructor(protected configService: ConfigService, private renderer: Renderer2, private languageService: LanguageService, private router: Router, private dialogService: DialogService, private translateService: TranslateService, private windowService: WindowService) {}

  async ngOnInit() {
    await this.loadRecentProjects();

    if (!this.configService.getConfig()) {
      await this.configService.loadConfig();
    }

    this.currentTheme = this.configService.getTheme();
    this.currentLang = this.configService.getLanguage();

    this.languageService.setDefaultLang(this.currentLang);
    this.languageService.useLang(this.currentLang);

    deleteOverflowWindow();

    // Применяем тему при загрузке
    document.body.classList.toggle('dark', this.currentTheme === 'dark');
    applyTheme(this.currentTheme === 'dark');
    observeThemeChanges();

    // Слушаем события изменения темы
    await listen('theme-changed', (event) => {
      const newTheme = event.payload as string;
      this.currentTheme = newTheme;
      document.body.classList.toggle('dark', newTheme === 'dark');
      applyTheme(newTheme === 'dark');
    });

    if(this.recentProjects.length <= 0){
      gapRightSection();
    }

    await listen('reload-window', () => {
      // Выполняем перезагрузку содержимого
      location.reload();
    });

    const token = await TokenService.getAuthToken();
    this.hasAuth = token;
    await StoreService.save(StoreKeys.ACCESS_TOKEN, token ? token : '');

  }

  async loadRecentProjects() {
    try {
      // Получаем список объектов {name, path} из Tauri
      this.recentProjects = await invoke<{ name: string, path: string }[]>('get_recent_projects');
      // this.themeApp = await invoke<string>('get_theme');
    } catch (error) {
      console.error('Ошибка при загрузке последних проектов:', error);
    }
  }

  setLastOpenedProject(projectPath: string) {
    invoke('set_last_opened', { projectPath })
        .then(() => {
        })
        .catch((error) => {
        });
  }

  async openProject() {
    const selectedPath = await this.dialogService.selectPath();

    // Если selectedPath — массив строк, берем первый элемент
    const path = Array.isArray(selectedPath) ? selectedPath[0] : selectedPath;

    if (!path) {
      return;
    }

    const hasMnote = await this.dialogService.hasOrionFolder(path);
    if(!hasMnote){
      this.translateService.get('startPage.alerts.openProject').subscribe((message: string) => {
        alert(message);
      });
      return;
    }

    this.setLastOpenedProject(path);
    await this.windowService.openProjectWindow();
    await this.windowService.closeAllWindowsExProject();
  }

  async createProject() {
    try {
      await invoke('create_project_window');
    } catch (error) {
      console.error("Ошибка при создании окна:", error);
    }
  }

  async openLoginPage(){
    await this.windowService.openLoginWindow();
  }


  protected readonly success = success;
  protected readonly StoreService = StoreService;
}
