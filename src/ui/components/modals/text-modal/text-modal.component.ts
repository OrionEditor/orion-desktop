import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FillButtonComponent} from "../../buttons/fill-button/fill-button.component";
import {OutlineButtonComponent} from "../../buttons/outline-button/outline-button.component";
import {TranslatePipe} from "@ngx-translate/core";
@Component({
  selector: 'app-text-modal',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    FillButtonComponent,
    OutlineButtonComponent,
    TranslatePipe
  ],
  templateUrl: './text-modal.component.html',
  styleUrl: './text-modal.component.css'
})
export class TextModalComponent {
  @Input() title:  string = '';
  @Input() inputValue: string = '';
  @Input() placeholderInput: string = '';
  @Output() inputValueChange = new EventEmitter<string>();
  @Output() confirm = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onClose() {
    this.close.emit();
  }

  onOverlayClick(event: MouseEvent) {
    this.onClose();
  }

  onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.inputValueChange.emit(value);
  }
}
