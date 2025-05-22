import { Injectable } from '@angular/core';
import {ToastService} from "../Notifications/toast.service";
import {ProjectService} from "../Routes/project/project.service";
import {WorkspaceService} from "../Workspace/workspace.service";
import {ConfigService} from "../configService";
import {Project} from "../../interfaces/routes/project.interface";
import {join} from "@tauri-apps/api/path";
import {StoreService} from "../Store/store.service";
import {StoreKeys} from "../../shared/constants/vault/store.keys";
import {getWorkspacePath} from "../../shared/constants/workspace/workspace-path.const";

@Injectable({
    providedIn: 'root'
})
export class ProjectLocalService {
    private projects: Project[] = [];
    private currentProject: Project | null = null;

    constructor(
        private projectService: ProjectService,
    ) {}

    private workspaceService = new WorkspaceService();
    private configService = new ConfigService();


    /**
     * Синхронизирует проекты с сервера.
     */
    async syncProjects(): Promise<void> {
        try {
            // @ts-ignore
            this.projects = await this.projectService.getProjectsByUser();
            console.log(this.projects);
            await this.loadCurrentProject();
        } catch (e) {
            console.error('Не удалось синхронизировать проекты:', e);
            // ToastService.danger('Не удалось синхронизировать проекты с сервером!');
        }
    }

    /**
     * Загружает текущий проект на основе имени из WorkspaceService.
     */
    async loadCurrentProject(): Promise<void> {
        try {
            if (!this.configService.getConfig()) {
                await this.configService.loadConfig();
            }

            const projectPath = this.configService.getLastOpened();
            if (!projectPath) {
                this.currentProject = null;
                return;
            }

            console.log(projectPath);


            const projectName = await WorkspaceService.getProjectName(getWorkspacePath(projectPath ? projectPath : ''));
            const project = this.projects.find(p => p.name === projectName);
            this.currentProject = project || null;
            if (!project) {
                console.warn(`Проект с именем "${projectName}" не найден в списке проектов`);
            } else {
                console.log('currentProject: ', project);
            }
        } catch (e) {
            console.error('Не удалось загрузить текущий проект:', e);
            this.currentProject = null;
        }
    }

    /**
     * Создаёт новый проект и добавляет его в локальный список.
     * @param name Название проекта
     * @param description Описание проекта
     */
    async createProject(name: string, description: string = ''): Promise<Project> {
        try {
            const project = await this.projectService.createProject(name, description);
            // @ts-ignore
            this.projects.push(project);
            // @ts-ignore
            this.currentProject = project;
            // @ts-ignore
            return project;
        } catch (e) {
            throw e;
        }
    }

    /**
     * Получает проект по ID, используя локальный кэш или сервер.
     * @param projectId ID проекта
     */
    async getProjectById(projectId: string): Promise<Project> {
        const localProject = this.projects.find(p => p.id === projectId);
        if (localProject) {
            return localProject;
        }
        try {
            const serverProject = await this.projectService.getProjectById(projectId);
            // @ts-ignore
            this.projects.push(serverProject);
            // @ts-ignore
            return serverProject;
        } catch (e) {
            throw e;
        }
    }

    /**
     * Обновляет проект и синхронизирует локальный кэш.
     * @param projectId ID проекта
     * @param name Новое название
     * @param description Новое описание
     */
    async updateProject(projectId: string, name: string, description: string): Promise<void> {
        try {
            const updatedProject = await this.projectService.updateProjectById(projectId, name, description);
            const index = this.projects.findIndex(p => p.id === projectId);
            if (index !== -1) {
                // @ts-ignore
                this.projects[index] = updatedProject;
            } else {
                // @ts-ignore
                this.projects.push(updatedProject);
            }
            if (this.currentProject?.id === projectId) {
                // @ts-ignore
                this.currentProject = updatedProject;
            }
        } catch (e) {
            throw e;
        }
    }

    /**
     * Удаляет проект и обновляет локальный кэш.
     * @param projectId ID проекта
     */
    async deleteProject(projectId: string): Promise<void> {
        try {
            await this.projectService.deleteProjectById(projectId);
            this.projects = this.projects.filter(p => p.id !== projectId);
            if (this.currentProject?.id === projectId) {
                this.currentProject = null;
            }
        } catch (e) {
            throw e;
        }
    }

    /**
     * Получает все проекты.
     */
    getProjects(): Project[] {
        return [...this.projects];
    }

    /**
     * Получает имена всех проектов.
     */
    getProjectNames(): string[] {
        return [...new Set(this.projects.map(p => p.name).filter(name => name))];
    }

    /**
     * Получает текущий проект.
     */
    getCurrentProject(): Project | null {
        return this.currentProject;
    }

    /**
     * Устанавливает текущий проект.
     * @param project Проект или null
     */
    setCurrentProject(project: Project | null): void {
        this.currentProject = project;
    }

    /**
     * Формирует путь к workspace на основе пути к проекту.
     * @param projectPath Путь к проекту
     * @private
     */
    private async getWorkspacePath(projectPath: string): Promise<string> {
        return await join(projectPath, '.orion');
    }
}