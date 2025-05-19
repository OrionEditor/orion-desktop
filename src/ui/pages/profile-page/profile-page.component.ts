import { Component } from '@angular/core';
import {Profile} from "../../../interfaces/data/profile.interface";
import {StoreService} from "../../../services/Store/store.service";
import {Store} from "@tauri-apps/plugin-store";
import {StoreKeys} from "../../../shared/constants/vault/store.keys";
import {deleteOverflowWindow} from "../../../utils/overflow.utils";
import {applyTheme, observeThemeChanges} from "../../../utils/theme.utils";
import {listen} from "@tauri-apps/api/event";
import {gapRightSection} from "../../../utils/startPage.utils";
import {ConfigService} from "../../../services/configService";
import {LanguageService} from "../../../services/language.service";

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {
  profile: string | null = null;
  username: string | null = '';
  email: string | null = '';
  currentTheme: string = "";
  currentLang: string = "";

  constructor(private configService: ConfigService, private languageService: LanguageService) {
  }

  async ngOnInit(){
    deleteOverflowWindow();


    this.username = await StoreService.get(StoreKeys.USERNAME);
    this.email = await StoreService.get(StoreKeys.EMAIL);



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


    await listen('reload-window', () => {
      // Выполняем перезагрузку содержимого
      location.reload();
    });
  }
}
