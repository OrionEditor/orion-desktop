import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';
import {Profile} from "../../../interfaces/data/profile.interface";
import {AuthHeadersService} from "../auth-headers.service";
import {withTokenRefresh} from "../../../utils/http.utils";
import {RefreshTokenService} from "../token/token-refresh.service";
import {API_V1_FULL_ENDPOINTS} from "../../../api/v1/endpoints";
import {StoreKeys} from "../../../shared/constants/vault/store.keys";
import {StoreService} from "../../Store/store.service";

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    constructor(
        private http: HttpClient,
    ) {}

    private refreshTokenService = new RefreshTokenService(this.http);



    /**
     * Получает профиль пользователя
     */
    async getProfile(): Promise<Profile> {
        return withTokenRefresh(this.http, this.refreshTokenService, headers =>
            this.http.get(API_V1_FULL_ENDPOINTS.USER.GET_PROFILE, { headers }).pipe(
                map(async(response: any) => {
                    if (response.id && response.email) {
                        await StoreService.save(StoreKeys.PROFILE_DATA, response);
                        await StoreService.save(StoreKeys.USER_ID, response.uuid);
                        await StoreService.save(StoreKeys.USERNAME, response.username);
                        await StoreService.save(StoreKeys.EMAIL, response.email);

                        return response as Profile;
                    } else if (response.error) {
                        throw new Error(response.error);
                    } else {
                        throw new Error('Некорректный ответ сервера');
                    }
                })
            )
        );
    }
}