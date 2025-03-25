import { Component } from '@angular/core';
import {deleteOverflowWindow} from "../../../utils/overflow.utils";
import {observeThemeChanges, setDarkTheme} from "../../../utils/theme.utils";
import {ConfigService} from "../../../services/configService";
import {LanguageService} from "../../../services/language.service";
import {invoke} from "@tauri-apps/api/core";
import {SidebarComponent} from "../../components/project/sidebar/sidebar.component";

@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [
    SidebarComponent
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

  constructor(private configService: ConfigService, private languageService: LanguageService) {}

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
}
