// language.service.ts
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {ConfigService} from "./configService";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class LanguageService {
    currentLang: string = ""
    private languages: { [key: string]: string } = {}; // Хранилище языков
    constructor(private translate: TranslateService, protected configService: ConfigService, private http: HttpClient) {}

    async ngOnInit() {
        // Загружаем конфигурацию при старте приложения, если она еще не загружена
        if (!this.configService.getConfig()) {
            await this.configService.loadConfig();
        }
        this.currentLang = this.configService.getLanguage();
    }

    setDefaultLang(lang: string) {
        this.translate.setDefaultLang(lang);
    }

    useLang(lang: string) {
        this.translate.use(lang);
    }

    // Получение всех доступных языков
    getLanguages(): Observable<string[]> {
        return this.http.get<{ languages: { [key: string]: string } }>('../assets/localization/languages.json')
            .pipe(map(response => Object.keys(response.languages)));
    }

    getCurrentLanguage(){
        return this.configService.getLanguage();
    }

    changeLanguage(lang: string){
        this.configService.setLanguage(lang).then();
        this.setDefaultLang(lang);
        this.useLang(lang);
    }
}
