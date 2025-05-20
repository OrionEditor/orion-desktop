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