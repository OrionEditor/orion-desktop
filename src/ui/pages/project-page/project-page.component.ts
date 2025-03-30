import { Component } from '@angular/core';
import {deleteOverflowWindow} from "../../../utils/overflow.utils";
import {observeThemeChanges, setDarkTheme} from "../../../utils/theme.utils";
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

@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [
    SidebarComponent,
    FileTabComponent,
    NgForOf,
    ContentTabComponent,
    NgIf
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

  constructor(private configService: ConfigService, private languageService: LanguageService, private tabService: TabService, protected textModalService: TextModalService, private translateService: TranslateService) {
    this.tabService.tabs$.subscribe(tabs => {
      this.tabs = tabs;
      this.activeTab = tabs.find(tab => tab.isActive);
    });
  }

  ngOnInit() {
    this.currentTheme = this.configService.getTheme();
    this.currentLang = this.configService.getLanguage();

    this.languageService.setDefaultLang(this.currentLang);
    this.languageService.useLang(this.currentLang);

    deleteOverflowWindow();

    if (this.currentTheme === 'dark') {
      setDarkTheme();
    }
    observeThemeChanges();

    this.projectPath = this.configService.getLastOpened();
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
