import { Component } from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {TOASTS_TYPES} from "../../../../shared/constants/toasts/toasts.types";
import {ToastService} from "../../../../services/Toasts/toast.service";

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [
    NgIf,
    NgClass
  ],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  toast: { message: string; type: string } | null = null;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.toast$.subscribe((toast) => {
      this.toast = toast;
    });
  }

  protected readonly TOASTS_TYPES = TOASTS_TYPES;
}
