import {Component, ElementRef, HostListener, Input} from '@angular/core';
import {ContextMenuItem} from "../../../../interfaces/context-menu-item.interface";
import {NgClass, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.css'
})
export class ContextMenuComponent {
  @Input() items: ContextMenuItem[] = [];
  @Input() x: number = 0;
  @Input() y: number = 0;

  activeSubmenu: string | null = null;
  submenuPosition: 'left' | 'right' = 'right';

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.adjustPosition();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.activeSubmenu = null;
    }
  }

  onItemClick(item: ContextMenuItem): void {
    if (item.action && !item.isSubmenu) {
      item.action();
    }
  }

  onMouseEnter(item: ContextMenuItem): void {
    if (item.isSubmenu) {
      this.activeSubmenu = item.id;
      this.calculateSubmenuPosition(item);
    }
  }

  onMouseLeave(): void {
    this.activeSubmenu = null;
  }

  private adjustPosition(): void {
    const menuElement = this.elementRef.nativeElement.querySelector('.context-menu');
    if (!menuElement) return;

    const rect = menuElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (this.x + rect.width > viewportWidth) {
      this.x = viewportWidth - rect.width;
    }
    if (this.y + rect.height > viewportHeight) {
      this.y = viewportHeight - rect.height;
    }

    menuElement.style.left = `${this.x}px`;
    menuElement.style.top = `${this.y}px`;
  }

  private calculateSubmenuPosition(item: ContextMenuItem): void {
    const menuElement = this.elementRef.nativeElement.querySelector(`#item-${item.id}`);
    const rect = menuElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    this.submenuPosition = rect.right + rect.width > viewportWidth ? 'left' : 'right';
  }
}
