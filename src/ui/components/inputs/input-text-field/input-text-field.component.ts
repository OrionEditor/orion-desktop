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
  @Input() value: string = '';
  @Input() readonly: boolean = false;
  @Input() type: string = 'text';
  @Input() minValue: string | null = null;
  @Input() maxValue: string | null = null;

  @Output() valueChange = new EventEmitter<string>();

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.valueChange.emit(input.value);
  }

}
