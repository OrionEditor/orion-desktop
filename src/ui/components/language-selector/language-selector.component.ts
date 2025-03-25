import { Component } from '@angular/core';
import {LanguageService} from "../../../services/language.service";
import {ConfigService} from "../../../services/configService";
import {FormsModule} from "@angular/forms";
import {NgForOf, UpperCasePipe} from "@angular/common";

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    UpperCasePipe
  ],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.css'
})
export class LanguageSelectorComponent {
  currentLang: string = ''; // Текущий язык
  languages: string[] = [];  // Доступные языки
  constructor(private languageService: LanguageService, private configService: ConfigService) {
  }

  async ngOnInit() {

    // Загружаем конфигурацию при старте приложения, если она еще не загружена
    if (!this.configService.getConfig()) {
      await this.configService.loadConfig();
    }

    this.currentLang = this.languageService.getCurrentLanguage();
    //this.currentLang = this.configService.getLanguage();
    this.languageService.getLanguages().subscribe(langs => {
      this.languages = langs;
    });
  }

  // Метод для смены языка
  changeLanguage(lang: string) {
    this.currentLang = lang;
    this.languageService.changeLanguage(this.currentLang);
  }
}
