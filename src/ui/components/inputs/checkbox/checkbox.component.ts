import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.css'
})
export class CheckboxComponent {
  @Input() label: string = '';
  @Input() checked: boolean = false;  // Получаем значение чекбокса
  @Output() checkedChange = new EventEmitter<boolean>();  // Отправляем обновленное значение

  onCheckboxChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.checkedChange.emit(checkbox.checked);  // Вызываем eventEmitter для обновления значения
  }
}
