import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { firstValueFrom, from } from 'rxjs';
import {AuthHeadersService} from "../services/Routes/auth-headers.service";
import {RefreshTokenService} from "../services/Routes/token/token-refresh.service";

export async function withTokenRefresh<T>(
    httpClient: HttpClient,
    refreshTokenService: RefreshTokenService,
    requestFactory: (headers: HttpHeaders) => Observable<T>
): Promise<T> {
    const headers = await AuthHeadersService.getAuthHeaders();
    let retryCount = 0;

    const executeRequest = (headers: HttpHeaders): Observable<T> => {
        return requestFactory(headers).pipe();
    };

    return firstValueFrom(executeRequest(headers));
}