import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {withTokenRefresh} from "../../../utils/http.utils";
import {Project} from "../../../interfaces/config.interface";
import {ToastService} from "../../Notifications/toast.service";
import {RefreshTokenService} from "../token/token-refresh.service";
import {API_V1_FULL_ENDPOINTS} from "../../../api/v1/endpoints";

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private refreshTokenService = new RefreshTokenService(this.http);

    constructor(private http: HttpClient) {}

    /**
     * Создаёт новый проект.
     * @param name Название проекта
     * @param description Описание проекта
     * @returns Созданный проект или ошибка
     */
    async createProject(name: string, description: string = ''): Promise<Project> {
        const body = { name, description };
        return withTokenRefresh(this.http, this.refreshTokenService, headers =>
            this.http.post(API_V1_FULL_ENDPOINTS.PROJECT.CREATE_PROJECT, body, { headers }).pipe(
                map((response: any) => {
                    if (response.id) {
                        ToastService.success('Проект успешно создан!');
                        return response as Project;
                    } else {
                        throw new Error(response.error || 'Некорректный ответ сервера');
                    }
                })
            )
        );
    }

    /**
     * Получает проект по ID.
     * @param projectId ID проекта
     * @returns Проект или ошибка
     */
    async getProjectById(projectId: string): Promise<Project> {
        return withTokenRefresh(this.http, this.refreshTokenService, headers =>
            this.http.get(API_V1_FULL_ENDPOINTS.PROJECT.GET_PROJECT_BY_ID(projectId), { headers }).pipe(
                map((response: any) => {
                    if (response.id) {
                        return response as Project;
                    } else {
                        throw new Error(response.error || 'Некорректный ответ сервера');
                    }
                })
            )
        );
    }

    /**
     * Обновляет проект по ID.
     * @param projectId ID проекта
     * @param name Новое название проекта
     * @param description Новое описание проекта
     * @returns Обновлённый проект или ошибка
     */
    async updateProjectById(projectId: string, name: string, description: string): Promise<Project> {
        const body = { name, description };
        return withTokenRefresh(this.http, this.refreshTokenService, headers =>
            this.http.put(API_V1_FULL_ENDPOINTS.PROJECT.UPDATE_PROJECT_BY_ID(projectId), body, { headers }).pipe(
                map((response: any) => {
                    if (response.id) {
                        ToastService.success('Проект успешно обновлён!');
                        return response as Project;
                    } else {
                        throw new Error(response.error || 'Некорректный ответ сервера');
                    }
                })
            )
        );
    }

    /**
     * Удаляет проект по ID.
     * @param projectId ID проекта
     * @returns Сообщение об успехе или ошибка
     */
    async deleteProjectById(projectId: string): Promise<void> {
        return withTokenRefresh(this.http, this.refreshTokenService, headers =>
            this.http.delete(API_V1_FULL_ENDPOINTS.PROJECT.DELETE_PROJECT_BY_ID(projectId), { headers }).pipe(
                map((response: any) => {
                    if (response.message) {
                        ToastService.success('Проект успешно удалён!');
                    } else {
                        throw new Error(response.error || 'Некорректный ответ сервера');
                    }
                })
            )
        );
    }

    /**
     * Получает все проекты пользователя.
     * @returns Массив проектов или пустой массив
     */
    async getProjectsByUser(): Promise<Project[]> {
        return withTokenRefresh(this.http, this.refreshTokenService, headers =>
            this.http.get(API_V1_FULL_ENDPOINTS.PROJECT.GET_PROJECTS_BY_USER, { headers }).pipe(
                map((response: any) => {
                    if (Array.isArray(response)) {
                        return response as Project[];
                    } else {
                        return [];
                    }
                })
            )
        );
    }
}