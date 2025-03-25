import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {TOASTS_TYPES} from "../../shared/constants/toasts/toasts.types";

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    private toastSubject = new Subject<{ message: string; type: string } | null>();
    private isToastVisible = false;

    toast$ = this.toastSubject.asObservable();


    showToast(message: string, type: TOASTS_TYPES.SUCCESS | TOASTS_TYPES.WARNING| TOASTS_TYPES.DANGER) {
        if (!this.isToastVisible) {
            this.isToastVisible = true;
            this.toastSubject.next({ message, type });

            setTimeout(() => {
                this.isToastVisible = false;
                this.toastSubject.next(null); // Убираем уведомление
            }, 3000);
        }
    }
}