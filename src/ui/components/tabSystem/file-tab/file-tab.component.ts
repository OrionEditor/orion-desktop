import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Tab} from "../../../../interfaces/components/tab.interface";

@Component({
  selector: 'app-file-tab',
  standalone: true,
  imports: [],
  templateUrl: './file-tab.component.html',
  styleUrl: './file-tab.component.css'
})
export class FileTabComponent {
  @Input() tab!: Tab;
  @Output() close = new EventEmitter<string>();
  @Output() select = new EventEmitter<string>();

  onClose(event: Event): void {
    event.stopPropagation();
    this.close.emit(this.tab.id);
  }

  onTabClick(): void {
    this.select.emit(this.tab.id);
  }
}
