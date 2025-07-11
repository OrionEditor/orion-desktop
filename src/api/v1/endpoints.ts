import {environment} from "../../environments/environment";

export let API_V1_ENDPOINTS: any = {
    auth: {
        verifyEmail: environment.endpoints.auth.verifyEmail,
        login: environment.endpoints.auth.login,
        register: environment.endpoints.auth.register,
        VERIFY_CODE: environment.endpoints.auth.verify_code
    },
    REFRESH_TOKEN: {
        REFRESH:environment.endpoints.refreshToken.refresh
    },
    USER: {
        GET_PROFILE: environment.endpoints.user.get_profile
    },
    PROJECT: {
        CREATE_PROJECT: environment.endpoints.project.create_project,
        GET_PROJECT_BY_ID: (projectId: string) => environment.endpoints.project.get_project_by_id(projectId),
        UPDATE_PROJECT_BY_ID: (projectId: string) => environment.endpoints.project.update_project_by_id(projectId),
        DELETE_PROJECT_BY_ID: (projectId: string) => environment.endpoints.project.delete_project_by_id(projectId),
        GET_PROJECTS_BY_USER: environment.endpoints.project.get_projects_by_user
    },
    DOCUMENT: {
        CREATE_DOCUMENT: environment.endpoints.document.create_document,
        GET_DOCUMENT_BY_ID: (documentId: string) => environment.endpoints.document.get_document_by_id(documentId),
        UPDATE_DOCUMENT: (documentId: string) => environment.endpoints.document.update_document(documentId),
        DELETE_DOCUMENT: (documentId: string) => environment.endpoints.document.delete_document(documentId),
        GET_DOCUMENT_BY_NAME: (projectId: string, documentName: string) => environment.endpoints.document.get_document_by_name(projectId, documentName),
    },
    VERSION: {
        GET_VERSION_BY_DOCUMENT_ID: (documentId: string) => environment.endpoints.version.get_version_by_document_id(documentId),
        CREATE_VERSION: (documentId: string) => environment.endpoints.version.create_version(documentId),
        GET_VERSION: (versionId: string) => environment.endpoints.version.get_version(versionId),
        DELETE_VERSION: (versionId: string) => environment.endpoints.version.delete_version(versionId),
    }
};

export let API_V1_FULL_ENDPOINTS = addBaseUrl(API_V1_ENDPOINTS, environment.apiUrl);

// Рекурсивная функция для добавления базового URL
// function addBaseUrl(obj: any, baseUrl: string): any {
//     if (typeof obj === 'string') {
//         return `${baseUrl}/${obj}`;
//     }
//
//     const result: any = {};
//     for (const key in obj) {
//         if (obj.hasOwnProperty(key)) {
//             result[key] = addBaseUrl(obj[key], baseUrl);
//         }
//     }
//     return result;
// }

function addBaseUrl(obj: any, baseUrl: string): any {
    if (typeof obj === 'string') {
        return `${baseUrl}/${obj}`;
    }
    if (typeof obj === 'function') {
        return (param: string) => `${baseUrl}/${obj(param)}`; // Обрабатываем функции
    }
    const result: any = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            result[key] = addBaseUrl(obj[key], baseUrl);
        }
    }
    return result;
}

export async function getApiV1Endpoints(): Promise<any> {
    return API_V1_ENDPOINTS;
}