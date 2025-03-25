import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {Tab} from "../../../../interfaces/components/tab.interface";
import {TabContextMenuComponent} from "../../contextMenus/tab-context-menu/tab-context-menu.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-file-tab',
  standalone: true,
  imports: [
    TabContextMenuComponent,
    NgIf
  ],
  templateUrl: './file-tab.component.html',
  styleUrl: './file-tab.component.css'
})
export class FileTabComponent {
  @Input() tab!: Tab;
  @Output() close = new EventEmitter<string>();
  @Output() select = new EventEmitter<string>();
  @Output() pinTabEvent = new EventEmitter<string>();
  @Output() unpinTabEvent = new EventEmitter<string>();
  @Output() closeOthersEvent = new EventEmitter<string>();
  @Output() closeAllEvent = new EventEmitter<void>();

  showContextMenu = false;
  contextMenuPosition = { x: 0, y: 0 };

  onClose(event: Event): void {
    event.stopPropagation();
    this.close.emit(this.tab.id);
  }

  onTabClick(): void {
    this.select.emit(this.tab.id);
  }

  onRightClick(event: MouseEvent): void {
    event.preventDefault();
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    this.showContextMenu = true;
  }

  @HostListener('document:click')
  hideContextMenu(): void {
    this.showContextMenu = false;
  }

  pinTab(): void {
    this.pinTabEvent.emit(this.tab.id);
    this.showContextMenu = false;
  }

  unpinTab(): void {
    this.unpinTabEvent.emit(this.tab.id);
    this.showContextMenu = false;
  }

  closeTab(): void {
    this.close.emit(this.tab.id);
    this.showContextMenu = false;
  }

  closeOtherTabs(): void {
    this.closeOthersEvent.emit(this.tab.id);
    this.showContextMenu = false;
  }

  closeAllTabs(): void {
    this.closeAllEvent.emit();
    this.showContextMenu = false;
  }
}
