import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import {API_CONFIG_V1} from "./api.config";

@Injectable({
    providedIn: 'root',
})
export class ApiEndpointsService {
    private endpoints: any = {};

    constructor(private http: HttpClient) {}

    async loadEndpoints(): Promise<void> {
        const url = API_CONFIG_V1.ENDPOINTS_JSON_URL;
        this.endpoints = await lastValueFrom(this.http.get(url));
    }

    getEndpoint(path: string): string {
        const keys = path.split('.');
        let result = this.endpoints;

        for (const key of keys) {
            result = result[key];
            if (!result) {
                throw new Error(`Path "${path}" not found in endpoints`);
            }
        }

        return result;
    }

    buildApiV1Endpoints(): any {
        return {
            auth: {
                verifyEmail: this.getEndpoint(API_CONFIG_V1.ENDPOINTS_LIST.AUTH.VERIFY_EMAIL),
                login: this.getEndpoint(API_CONFIG_V1.ENDPOINTS_LIST.AUTH.LOGIN),
                register: this.getEndpoint(API_CONFIG_V1.ENDPOINTS_LIST.AUTH.REGISTER),
            }
        };
    }
}