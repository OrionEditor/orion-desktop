import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Tab} from "../../../../interfaces/components/tab.interface";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-tab-context-menu',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './tab-context-menu.component.html',
  styleUrl: './tab-context-menu.component.css'
})
export class TabContextMenuComponent {
  @Input() tab!: Tab;
  @Input() position!: { x: number; y: number };
  @Output() pin = new EventEmitter<void>();
  @Output() unpin = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @Output() closeOthers = new EventEmitter<void>();
  @Output() closeAll = new EventEmitter<void>();

  pinTab() {
    this.pin.emit();
  }

  unpinTab() {
    this.unpin.emit();
  }

  closeTab() {
    this.close.emit();
  }

  closeOtherTabs() {
    this.closeOthers.emit();
  }

  closeAllTabs() {
    this.closeAll.emit();
  }
}
