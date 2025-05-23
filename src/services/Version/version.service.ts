import { Injectable } from '@angular/core';
import { getVersion } from '@tauri-apps/api/app';
import { Observable, from, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class VersionService {
    /**
     * Получает текущую версию приложения из Tauri.
     * @returns Observable с версией (например, "1.2.3") или "Unknown" при ошибке
     */
    getAppVersion(): Observable<string> {
        return from(getVersion()).pipe(
            catchError(() => of('Unknown'))
        );
    }
}