import {Injectable} from '@angular/core';
import {CreateDocumentResponse, GetDocumentResponse} from "../../interfaces/routes/document.interface";
import {DocumentService} from "../Routes/document/document.service";
import {ToastService} from "../Notifications/toast.service";

@Injectable({
    providedIn: 'root'
})
export class DocumentLocalService {
    private documents: GetDocumentResponse[] = [];

    constructor(
        private documentService: DocumentService
    ) {}

    // /**
    //  * Синхронизирует документы с сервера по их ID.
    //  * @param documentIds Массив ID документов для синхронизации
    //  */
    // async syncDocuments(documentIds: string[]): Promise<void> {
    //     try {
    //         const newDocuments: GetDocumentResponse[] = [];
    //         for (const documentId of documentIds) {
    //             const existing = this.documents.find(doc => doc.document.id === documentId);
    //             if (!existing) {
    //                 const documentResponse = await this.documentService.getDocumentById(documentId);
    //                 newDocuments.push(documentResponse);
    //             }
    //         }
    //         this.documents = [...this.documents, ...newDocuments];
    //     } catch (e) {
    //         console.error('Не удалось синхронизировать документы:', e);
    //         ToastService.danger('Не удалось синхронизировать документы с сервером!');
    //     }
    // }

    /**
     * Синхронизирует документ с сервера по его имени и проекту.
     * @param projectId ID проекта
     * @param documentName Имя документа
     * @param documentPath Путь документа
     */
    async syncDocument(projectId: string, documentName: string, documentPath: string): Promise<boolean> {
        try {
            // Проверяем, существует ли документ локально
            const existing = this.documents.find(doc => doc.document.name === documentName && doc.document.project_id === projectId);
            if (existing) {
                console.log(`Документ ${documentName} уже существует локально`);
                return true;
            }

            let documentResponse: GetDocumentResponse;

            try {
                // Пытаемся получить документ с сервера
                documentResponse = await this.documentService.getDocumentByProjectAndName(projectId, documentName);
                console.log(`Документ ${documentName} найден на сервере`);
                return true;
            } catch (e) {
                //Если документ не существует удалённо, создаём его
                console.log(`Документ ${documentName} не найден на сервере, создаём новый`);
                const createResponse = await this.documentService.createDocument(projectId, documentName, documentPath);
                documentResponse = {
                    document: createResponse.document,
                    versions: [createResponse.version]
                };
                ToastService.success(`Документ ${documentName} успешно создан в удалённом хранилище!`);
            }

            // Обновляем локальный кэш
            this.documents = [...this.documents, documentResponse];
            console.log(`Локальный кэш обновлён:`, this.documents);
            return true;
            // ToastService.success(`Документ ${documentName} успешно синхронизирован!`);
        } catch (e) {
            console.error(`Ошибка при синхронизации документа ${documentName}:`, e);
            return false;
            // ToastService.danger(`Не удалось синхронизировать документ ${documentName}!`);
        }
    }

    /**
     * Создаёт новый документ и добавляет его в локальный кэш.
     * @param projectId ID проекта
     * @param name Имя документа
     * @param filePath Путь к файлу
     * @returns Созданный документ и его версия
     */
    async createDocument(projectId: string, name: string, filePath: string): Promise<CreateDocumentResponse> {
        try {
            const response = await this.documentService.createDocument(projectId, name, filePath);
            const documentResponse: GetDocumentResponse = {
                document: response.document,
                versions: [response.version]
            };
            this.documents.push(documentResponse);
            return response;
        } catch (e) {
            ToastService.danger(`Ошибка создания документа: ${e}`);
            throw e;
        }
    }

    /**
     * Получает документ по ID, используя локальный кэш или сервер.
     * @param documentId ID документа
     * @returns Документ и его версии
     */
    async getDocumentById(documentId: string): Promise<GetDocumentResponse> {
        const localDocument = this.documents.find(doc => doc.document.id === documentId);
        if (localDocument) {
            return localDocument;
        }
        try {
            const serverDocument = await this.documentService.getDocumentById(documentId);
            this.documents.push(serverDocument);
            return serverDocument;
        } catch (e) {
            ToastService.danger(`Ошибка получения документа: ${e}`);
            throw e;
        }
    }

    /**
     * Обновляет документ и синхронизирует локальный кэш.
     * @param documentId ID документа
     * @param name Новое имя документа
     */
    async updateDocument(documentId: string, name: string): Promise<void> {
        try {
            const updatedDocument = await this.documentService.updateDocument(documentId, name);
            const index = this.documents.findIndex(doc => doc.document.id === documentId);
            if (index !== -1) {
                this.documents[index] = {
                    ...this.documents[index],
                    document: updatedDocument
                };
            } else {
                this.documents.push({
                    document: updatedDocument,
                    versions: []
                });
            }
        } catch (e) {
            ToastService.danger(`Ошибка обновления документа: ${e}`);
            throw e;
        }
    }

    /**
     * Удаляет документ и обновляет локальный кэш.
     * @param documentId ID документа
     */
    async deleteDocument(documentId: string): Promise<void> {
        try {
            await this.documentService.deleteDocument(documentId);
            this.documents = this.documents.filter(doc => doc.document.id !== documentId);
        } catch (e) {
            ToastService.danger(`Ошибка удаления документа: ${e}`);
            throw e;
        }
    }

    /**
     * Получает все документы из локального кэша.
     * @returns Массив документов
     */
    getDocuments(): GetDocumentResponse[] {
        return [...this.documents];
    }

    /**
     * Получает имена всех документов.
     * @returns Массив уникальных имён документов
     */
    getDocumentNames(): string[] {
        return [...new Set(this.documents.map(doc => doc.document.name).filter(name => name))];
    }
}