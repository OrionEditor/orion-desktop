import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {API_V1_FULL_ENDPOINTS} from "../../api/v1/endpoints";

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(
        private http: HttpClient,
        private router: Router
    ) {}

    verifyEmail(data: { username: string; email: string; password: string }): Observable<any> {
        return this.http.post(API_V1_FULL_ENDPOINTS.auth.verifyEmail, data);
    }

    registerUser(data: { code: string; UUID: string }): Observable<any> {
        return this.http.post(API_V1_FULL_ENDPOINTS.auth.register, data);
    }

    login(data: {username: string, password: string}): Observable<any> {
        return this.http.post(API_V1_FULL_ENDPOINTS.auth.login, data);
    }
}
