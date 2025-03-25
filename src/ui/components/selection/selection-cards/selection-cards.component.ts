import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-selection-cards',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './selection-cards.component.html',
  styleUrl: './selection-cards.component.css'
})
export class SelectionCardsComponent {
  @Input() items: Array<{ id?: string; icon?: string; header?: string; description?: string }> = [];
  @Output() selectionChange = new EventEmitter<string | null>();

  selectedIndex: number = 0; // Индекс выбранной карточки

  ngOnInit() {
    // Уведомляем родителя о начальном выбранном элементе
    this.emitSelection();
  }

  selectCard(index: number): void {
    this.selectedIndex = index;
    this.emitSelection();
  }

  emitSelection(): void {
    const selectedItem = this.items[this.selectedIndex];
    this.selectionChange.emit(selectedItem?.id ?? null);
  }
}
