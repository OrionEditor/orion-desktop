// src/app/services/translate.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {writeTextFile, BaseDirectory} from "@tauri-apps/plugin-fs";
import { lastValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LanguageTranslateService {
    private readonly LIBRETRANSLATE_API_URL = 'http://localhost:5000/translate';

    constructor(private http: HttpClient) {}

    public async translateText(
        text: string,
        sourceLang: string = 'auto',
        targetLang: string = 'en'
    ): Promise<string> {
        const body = {
            q: text,
            source: sourceLang,
            target: targetLang,
            format: 'text'
        };

        try {
            const response = await lastValueFrom(
                this.http.post<{ translatedText: string }>(this.LIBRETRANSLATE_API_URL, body)
            );
            return response.translatedText;
        } catch (error) {
            console.error('Ошибка при переводе:', error);
            throw error;
        }
    }

    public async translateAndSave(
        text: string,
        filePath: string,
        sourceLang: string = 'auto',
        targetLang: string = 'en',
    ) {
        const translatedText = await this.translateText(text, sourceLang, targetLang);
        await writeTextFile(filePath, translatedText);
    }
}