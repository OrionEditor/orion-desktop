import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {StoreService} from "../../Store/store.service";
import {StoreKeys} from "../../../shared/constants/vault/store.keys";
import {API_V1_FULL_ENDPOINTS} from "../../../api/v1/endpoints";

@Injectable({
    providedIn: 'root'
})
export class RefreshTokenService {
    constructor(
        private http: HttpClient,
    ) {}

    async refreshToken(): Promise<Observable<boolean>> {
        const refreshToken = await StoreService.get(StoreKeys.REFRESH_TOKEN);
        if (!refreshToken) {
            // ToastService.danger('Refresh token отсутствует!')
            return new Observable(observer => observer.next(false));
        }

        const data = { refreshToken };

        return this.http.post(API_V1_FULL_ENDPOINTS.REFRESH_TOKEN.REFRESH, data).pipe(
            map((response: any) => {
                if (response.accessToken && response.message === 'Token refreshed successfully') {
                    // Сохранение нового accessToken в localStorage
                    StoreService.save(StoreKeys.ACCESS_TOKEN, response.accessToken);
                    StoreService.save(StoreKeys.REFRESH_TOKEN, data.refreshToken);

                    // ToastService.success('Токен успешно обновлён!')
                    return true;
                } else {
                    // ToastService.danger('Ошибка при обновлении токена!')
                    return false;
                }
            }),
            map((result) => result === undefined ? false : result)
        );
    }
}