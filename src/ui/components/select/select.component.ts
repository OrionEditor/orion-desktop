import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Select} from "../../../interfaces/select.interface";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css'
})
export class SelectComponent {
  @Input() selects: Select[] = [];
  @Input() label: string = "";
  @Input() noneElement: boolean = false;
  @Output() selectedSelect = new EventEmitter<number>();

  onSelect(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedSelect.emit(Number(value)); // Приведение к числу
  }
}
