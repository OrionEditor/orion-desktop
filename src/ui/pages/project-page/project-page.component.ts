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

  constructor(private configService: ConfigService, private languageService: LanguageService, private tabService: TabService) {
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
    this.tabService.setActiveTab(tabId);
  }
}
