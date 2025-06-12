import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { StoreService } from '../../Store/store.service';
import { StoreKeys } from '../../../shared/constants/vault/store.keys';
import {RefreshTokenService} from "../token/token-refresh.service";
import {readFile} from "@tauri-apps/plugin-fs";
import {API_V1_FULL_ENDPOINTS} from "../../../api/v1/endpoints";
import {ToastService} from "../../Notifications/toast.service";
import {withTokenRefresh} from "../../../utils/http.utils";
import {CreateDocumentResponse, GetDocumentResponse, Document, Version} from "../../../interfaces/routes/document.interface";

@Injectable({
    providedIn: 'root'
})
export class DocumentService {
    private refreshTokenService = new RefreshTokenService(this.http);

    constructor(
        private http: HttpClient
    ) {}

    /**
     * Создаёт новый документ, загружая файл по пути.
     * @param projectId ID проекта
     * @param name Имя документа
     * @param filePath Путь к файлу
     * @returns Объект документа и его версии
     */
    async createDocument(projectId: string, name: string, filePath: string): Promise<CreateDocumentResponse> {
        try {
            // Получаем токен
            const token = await StoreService.get(StoreKeys.ACCESS_TOKEN);
            if (!token) {
                throw new Error('Токен авторизации не найден');
            }

            // Читаем файл как Blob
            const fileContent = await readFile(filePath);
            const blob = new Blob([fileContent], { type: 'application/octet-stream' });
            const fileName = filePath.split('/').pop() || name;
            const file = new File([blob], fileName, { type: 'application/octet-stream' });

            // Формируем FormData
            const formData = new FormData();
            formData.append('project_id', projectId);
            formData.append('name', name);
            formData.append('file', file);

            // Заголовки
            const headers = new HttpHeaders({
                'Authorization': `Bearer ${token}`
            });

            // @ts-ignore
            return this.http
                .post(API_V1_FULL_ENDPOINTS.DOCUMENT.CREATE_DOCUMENT, formData, { headers })
                .pipe(
                    map((response: any) => {
                        if (response.document && response.version) {
                            ToastService.success('Документ успешно создан!');
                            return response as CreateDocumentResponse;
                        } else {
                            throw new Error(response.error || 'Некорректный ответ сервера');
                        }
                    })
                )
                .toPromise();
        } catch (e) {
            ToastService.danger(`Ошибка создания документа: ${e}`);
            throw e;
        }
    }

    /**
     * Получает документ по ID вместе с его версиями.
     * @param documentId ID документа
     * @returns Документ и его версии
     */
    async getDocumentById(documentId: string): Promise<GetDocumentResponse> {
        return withTokenRefresh(this.http, this.refreshTokenService, headers =>
            this.http.get(API_V1_FULL_ENDPOINTS.DOCUMENT.GET_DOCUMENT_BY_ID(documentId), { headers }).pipe(
                map((response: any) => {
                    if (response.document && response.versions) {
                        return response as GetDocumentResponse;
                    } else {
                        throw new Error(response.error || 'Некорректный ответ сервера');
                    }
                })
            )
        );
    }

    /**
     * Обновляет имя документа.
     * @param documentId ID документа
     * @param name Новое имя документа
     * @returns Обновлённый документ
     */
    async updateDocument(documentId: string, name: string): Promise<Document> {
        const body = { name };
        return withTokenRefresh(this.http, this.refreshTokenService, headers =>
            this.http.put(API_V1_FULL_ENDPOINTS.DOCUMENT.UPDATE_DOCUMENT(documentId), body, { headers }).pipe(
                map((response: any) => {
                    if (response.id) {
                        ToastService.success('Документ успешно обновлён!');
                        return response as Document;
                    } else {
                        throw new Error(response.error || 'Некорректный ответ сервера');
                    }
                })
            )
        );
    }

    /**
     * Удаляет документ по ID.
     * @param documentId ID документа
     * @returns Сообщение об успехе
     */
    async deleteDocument(documentId: string): Promise<void> {
        return withTokenRefresh(this.http, this.refreshTokenService, headers =>
            this.http.delete(API_V1_FULL_ENDPOINTS.DOCUMENT.DELETE_DOCUMENT(documentId), { headers }).pipe(
                map((response: any) => {
                    if (response.message) {
                        ToastService.success('Документ успешно удалён!');
                    } else {
                        throw new Error(response.error || 'Некорректный ответ сервера');
                    }
                })
            )
        );
    }

    /**
     * Получает документ по ID проекта и имени документа.
     * @param projectId ID проекта
     * @param documentName Имя документа
     * @returns Документ и его версии или объект с ошибкой
     */
    // async getDocumentByProjectAndName(projectId: string, documentName: string): Promise<GetDocumentResponse> {
    //     const endpoint = `http://127.0.0.1/documents/project/${projectId}/name/${documentName}`;
    //     console.log("Endpoint:", endpoint);
    //     return withTokenRefresh(this.http, this.refreshTokenService, headers =>
    //         this.http.get(endpoint, { headers }).pipe(
    //             map((response: any) => {
    //                 if (response.document && response.versions) {
    //                     console.log("НАЙДЕН!", response);
    //                     return response as GetDocumentResponse;
    //                 } else {
    //                     console.log("ОШИБКА");
    //                     throw new Error(response.error || 'Некорректный ответ сервера');
    //                 }
    //             })
    //         )
    //     );
    // }

    async getDocumentByProjectAndName(projectId: string, documentName: string): Promise<GetDocumentResponse> {
        const encodedDocumentName = encodeURIComponent(documentName); // Явное кодирование
        const endpoint = `http://127.0.0.1/documents/project/${projectId}/name/${encodedDocumentName}`;
        console.log("Endpoint:", endpoint);
        return withTokenRefresh(this.http, this.refreshTokenService, headers =>
            this.http.get(endpoint, { headers }).pipe(
                map((response: any) => {
                    if (response.document && response.versions) {
                        console.log("НАЙДЕН!", response);
                        return response as GetDocumentResponse;
                    } else {
                        console.log("ОШИБКА");
                        throw new Error(response.error || 'Некорректный ответ сервера');
                    }
                })
            )
        );
    }
}