import {environment} from "../../environments/environment";

export let API_V1_ENDPOINTS: any = {
    auth: {
        verifyEmail: environment.endpoints.auth.verifyEmail,
        login: environment.endpoints.auth.login,
        register: environment.endpoints.auth.register
    }
};

export let API_V1_FULL_ENDPOINTS = addBaseUrl(API_V1_ENDPOINTS, environment.apiUrl);

// Рекурсивная функция для добавления базового URL
function addBaseUrl(obj: any, baseUrl: string): any {
    if (typeof obj === 'string') {
        return `${baseUrl}/${obj}`;
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