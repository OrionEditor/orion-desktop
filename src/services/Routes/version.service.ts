import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {RefreshTokenService} from "./token/token-refresh.service";
import {Version} from "../../interfaces/routes/document.interface";
import {withTokenRefresh} from "../../utils/http.utils";
import {StoreService} from "../Store/store.service";
import {StoreKeys} from "../../shared/constants/vault/store.keys";
import {readFile} from "@tauri-apps/plugin-fs";
import {ToastService} from "../Notifications/toast.service";
import {API_V1_FULL_ENDPOINTS} from "../../api/v1/endpoints";

@Injectable({
    providedIn: 'root'
})
export class VersionService {
    private refreshTokenService = new RefreshTokenService(this.http);

    constructor(
        private http: HttpClient
    ) {}

    /**
     * Получает список версий документа по его ID.
     * @param documentId ID документа
     * @returns Массив версий документа
     */
    async getVersionsByDocumentId(documentId: string): Promise<Version[]> {
        return withTokenRefresh(this.http, this.refreshTokenService, headers =>
            this.http.get(API_V1_FULL_ENDPOINTS.VERSION.GET_VERSION_BY_DOCUMENT_ID(documentId), { headers }).pipe(
                map((response: any) => {
                    if (Array.isArray(response)) {
                        return response as Version[];
                    } else {
                        throw new Error(response.error || 'Некорректный ответ сервера');
                    }
                })
            )
        );
    }

    /**
     * Создаёт новую версию документа, загружая файл.
     * @param documentId ID документа
     * @param filePath Путь к файлу
     * @returns Объект новой версии
     */
    async createVersion(documentId: string, filePath: string): Promise<Version> {
        try {
            // Получаем токен
            const token = await StoreService.get(StoreKeys.ACCESS_TOKEN);
            if (!token) {
                throw new Error('Токен авторизации не найден');
            }

            // Читаем файл как Blob
            const fileContent = await readFile(filePath);
            const blob = new Blob([fileContent], { type: 'application/octet-stream' });
            const fileName = filePath.split('/').pop() || 'version';
            const file = new File([blob], fileName, { type: 'application/octet-stream' });

            // Формируем FormData
            const formData = new FormData();
            formData.append('file', file);

            // Заголовки
            const headers = new HttpHeaders({
                'Authorization': `Bearer ${token}`
            });

            // @ts-ignore
            return this.http
                .post(API_V1_FULL_ENDPOINTS.VERSION.CREATE_VERSION(documentId), formData, { headers })
                .pipe(
                    map((response: any) => {
                        if (response.id && response.version_number) {
                            ToastService.success('Версия документа успешно создана!');
                            return response as Version;
                        } else {
                            throw new Error(response.error || 'Некорректный ответ сервера');
                        }
                    })
                )
                .toPromise();
        } catch (e) {
            ToastService.danger(`Ошибка создания версии документа: ${e}`);
            throw e;
        }
    }

    /**
     * Получает версию документа по её ID.
     * @param versionId ID версии
     * @returns Объект версии
     */
    async getVersion(versionId: number): Promise<Version> {
        return withTokenRefresh(this.http, this.refreshTokenService, headers =>
            this.http.get(API_V1_FULL_ENDPOINTS.VERSION.GET_VERSION(versionId), { headers }).pipe(
                map((response: any) => {
                    if (response.id && response.version_number) {
                        return response as Version;
                    } else {
                        throw new Error(response.error || 'Некорректный ответ сервера');
                    }
                })
            )
        );
    }

    /**
     * Удаляет версию документа по её ID.
     * @param versionId ID версии
     * @returns Сообщение об успехе
     */
    async deleteVersion(versionId: number): Promise<void> {
        return withTokenRefresh(this.http, this.refreshTokenService, headers =>
            this.http.delete(API_V1_FULL_ENDPOINTS.VERSION.DELETE_VERSION(versionId), { headers }).pipe(
                map((response: any) => {
                    if (response.message) {
                        ToastService.success('Версия документа успешно удалена!');
                    } else {
                        throw new Error(response.error || 'Некорректный ответ сервера');
                    }
                })
            )
        );
    }
}