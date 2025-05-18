import {Component, Input} from '@angular/core';
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [
    NgClass,
    NgIf
  ],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  @Input() type: 'success' | 'warning' | 'danger' = 'success';
  @Input() title?: string;
  @Input() description?: string;
  @Input() duration: number = 3000;

  isVisible = true;

  ngOnInit() {
    setTimeout(() => {
      this.isVisible = false;
    }, this.duration);
  }
}
