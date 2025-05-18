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
        return requestFactory(headers).pipe(
            catchError(err => {
                if (retryCount > 0) {
                    const errorMessage = err.error?.error || 'Ошибка после обновления токена!';
                    // ToastService.danger(errorMessage);
                    return throwError(() => new Error(errorMessage));
                }

                // Проверяем 401
                if (err.status === 401) {
                    retryCount++;
                    // Разрешаем Promise, возвращаемый refreshToken, чтобы получить Observable<boolean>
                    return from(refreshTokenService.refreshToken()).pipe(
                        switchMap(refreshObservable =>
                            refreshObservable.pipe(
                                switchMap(success => {
                                    if (success) {
                                        return from(AuthHeadersService.getAuthHeaders()).pipe(
                                            switchMap(newHeaders => executeRequest(newHeaders))
                                        );
                                    } else {
                                        const errorMessage = 'Не удалось обновить токен!';
                                        // ToastService.danger(errorMessage);
                                        return throwError(() => new Error(errorMessage));
                                    }
                                })
                            )
                        )
                    );
                }

                // Другие ошибки просто передаём дальше
                const errorMessage = err.error?.error || 'Неизвестная ошибка!';
                // ToastService.danger(errorMessage);
                return throwError(() => new Error(errorMessage));
            })
        );
    };

    return firstValueFrom(executeRequest(headers));
}