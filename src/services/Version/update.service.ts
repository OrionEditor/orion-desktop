import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import { check, Update } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import {UpdateStatus} from "../../interfaces/data/update-status.interface";

@Injectable({
    providedIn: 'root'
})
export class UpdateService {
    /**
     * Проверяет наличие обновлений через Tauri Updater v2.
     * @returns Observable с информацией о статусе обновления
     */
    checkForUpdates(): Observable<UpdateStatus> {
        return from(check()).pipe(
            map((update: Update | null) => {
                if (!update) {
                    return { available: false, version: 'Unknown', notes: '', date: '' };
                }
                return {
                    available: true,
                    version: update.version || 'Unknown',
                    notes: update.body || '',
                    date: update.date || ''
                };
            }),
            catchError(error => {
                console.error('Update check failed:', error);
                return of({ available: false, version: 'Unknown', notes: '', date: '' });
            })
        );
    }

    /**
     * Устанавливает доступное обновление.
     * @returns Observable с результатом установки
     */
    installUpdate(): Observable<boolean> {
        return from(check()).pipe(
            switchMap((update: Update | null) => {
                if (!update) {
                    console.error('No update available');
                    return of(false);
                }

                console.log(update);

                let downloaded = 0;
                let contentLength = 0;

                return from(
                    update.downloadAndInstall(event => {
                        switch (event.event) {
                            case 'Started':
                                contentLength = event.data.contentLength || 0;
                                console.log(`Started downloading ${contentLength} bytes`);
                                break;
                            case 'Progress':
                                downloaded += event.data.chunkLength;
                                console.log(`Downloaded ${downloaded} of ${contentLength} bytes`);
                                break;
                            case 'Finished':
                                console.log('Download finished');
                                break;
                        }
                    }).then(async () => {
                        console.log('Update installed');
                        await relaunch(); // Перезапускаем приложение после установки
                        return true;
                    }).catch(error => {
                        console.error('Update installation failed:', error);
                        return false;
                    })
                );
            }),
            catchError(error => {
                console.error('Update installation failed:', error);
                return of(false);
            })
        );
    }
}