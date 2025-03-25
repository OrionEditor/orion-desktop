import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-input-text-field',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './input-text-field.component.html',
  styleUrl: './input-text-field.component.css'
})
export class InputTextFieldComponent {
  @Input() id: string = '';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() value: string = '';  // Получаем значение от родителя
  @Input() readonly: boolean = false;
  @Input() type: string = 'text'; // По умолчанию текстовый ввод

  @Output() valueChange = new EventEmitter<string>();  // Отправляем обновленное значение обратно родителю

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.valueChange.emit(input.value);  // Вызываем eventEmitter для обновления значения
  }
}
