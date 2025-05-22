import { Component } from '@angular/core';
import {deleteOverflowWindow} from "../../../utils/overflow.utils";
import {applyTheme, observeThemeChanges, setDarkTheme} from "../../../utils/theme.utils";
import {ConfigService} from "../../../services/configService";
import {LanguageService} from "../../../services/language.service";
import {invoke} from "@tauri-apps/api/core";
import {SidebarComponent} from "../../components/project/sidebar/sidebar.component";
import {FileTabComponent} from "../../components/tabSystem/file-tab/file-tab.component";
import {NgForOf, NgIf} from "@angular/common";
import {ContentTabComponent} from "../../components/tabSystem/content-tab/content-tab.component";
import {TabService} from "../../../services/tab.service";
import {Tab} from "../../../interfaces/components/tab.interface";
import {TEXT_MODAL_TYPES} from "../../../shared/constants/modals/textModal/textModal.types";
import {TextModalService} from "../../../services/Modals/TextModal/textModal.service";
import {TranslateService} from "@ngx-translate/core";
import {ModalBaseComponent} from "../../components/modals/modal-base/modal-base.component";
import {SettingsModalComponent} from "../../components/modals/settings-modal/settings-modal.component";
import {listen} from "@tauri-apps/api/event";
import {ProjectService} from "../../../services/Routes/project/project.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {ProjectLocalService} from "../../../services/LocalServices/project-local.service";
import {Store} from "@tauri-apps/plugin-store";
import {StoreService} from "../../../services/Store/store.service";
import {StoreKeys} from "../../../shared/constants/vault/store.keys";
import {WorkspaceService} from "../../../services/Workspace/workspace.service";
import {getWorkspacePath} from "../../../shared/constants/workspace/workspace-path.const";

@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [
    SidebarComponent,
    FileTabComponent,
    NgForOf,
    ContentTabComponent,
    NgIf,
    ModalBaseComponent,
    SettingsModalComponent,
      HttpClientModule
  ],
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.css'
})
export class ProjectPageComponent {
  currentTheme: string = "";
  currentLang: string = "";

  // Переменные управления
  sidebarWidth: string = "20vw";
  isSidebarHidden: boolean = false;

  projectPath: string | null = '';

  isDragging: boolean = false;

  tabs: Tab[] = [];
  activeTab: Tab | undefined;


  constructor(private configService: ConfigService, private languageService: LanguageService, public tabService: TabService, protected textModalService: TextModalService, private translateService: TranslateService, private http: HttpClient) {
    this.tabService.tabs$.subscribe(tabs => {
      this.tabs = tabs;
      this.activeTab = tabs.find(tab => tab.isActive);
    });
  }

  private projectService = new ProjectService(this.http);
  private projectLocalService = new ProjectLocalService(this.projectService);

  async ngOnInit() {
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

    this.projectPath = this.configService.getLastOpened();

    // Слушаем события изменения темы
    await listen('theme-changed', (event) => {
      const newTheme = event.payload as string;
      this.currentTheme = newTheme;
      document.body.classList.toggle('dark', newTheme === 'dark');
      applyTheme(newTheme === 'dark');
    });

    this.projectPath = this.configService.getLastOpened();
    //
    const projectName = await WorkspaceService.getProjectName(getWorkspacePath(this.projectPath ? this.projectPath : ''));

    try {
      await this.projectLocalService.createProject(projectName);
    } catch (e){}


    await this.projectLocalService.syncProjects();

    await this.projectLocalService.loadCurrentProject();

    const projectId = this.projectLocalService.getCurrentProject()?.id;
    console.log(projectId);
    await StoreService.save(StoreKeys.PROJECT_ID, projectId);
  }

  openTab(fileInfo: {path: string, name: string}): void {
    this.tabService.createTab(fileInfo.path, fileInfo.name);
  }

  closeTab(tabId: string): void {
    this.tabService.closeTab(tabId);
  }

  setActiveTab(tabId: string): void {
    this.tabService.setActiveTab(tabId, this.tabs);
  }

  async onCreateNote() {
    const translatedHeader = await this.translateService.get(`projectPage.modals.createNoteModal.header`).toPromise();
    const translatedPlaceholder = await this.translateService.get(`projectPage.modals.createNoteModal.placeholder`).toPromise();

    this.textModalService.openModal(translatedHeader, TEXT_MODAL_TYPES.NOTE, translatedPlaceholder);
  }

  async onCreateFolder() {
    const translatedHeader = await this.translateService.get(`projectPage.modals.createFolderModal.header`).toPromise();
    const translatedPlaceholder = await this.translateService.get(`projectPage.modals.createFolderModal.placeholder`).toPromise();

    this.textModalService.openModal(translatedHeader, TEXT_MODAL_TYPES.FOLDER, translatedPlaceholder);
  }

  pinTab(tabId: string): void {
    this.tabService.pinTab(tabId);
  }

  unpinTab(tabId: string): void {
    this.tabService.unpinTab(tabId);
  }

  closeOtherTabs(tabId: string): void {
    this.tabService.closeOtherTabs(tabId);
  }

  closeAllTabs(): void {
    this.tabService.closeAllTabs();
  }

  onDragStart(tabId: string): void {
  }

  onDragEnd(): void {
  }

  onDropTab(event: { draggedId: string; targetId: string }): void {
    const { draggedId, targetId } = event;
    const draggedIndex = this.tabs.findIndex(tab => tab.id === draggedId);
    const targetIndex = this.tabs.findIndex(tab => tab.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newTabs = [...this.tabs];
    const [draggedTab] = newTabs.splice(draggedIndex, 1);
    newTabs.splice(targetIndex, 0, draggedTab);

    this.tabs = newTabs;
  }
}
