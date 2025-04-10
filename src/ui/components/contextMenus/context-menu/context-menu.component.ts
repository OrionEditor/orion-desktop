import {Component, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {ContextMenuItem} from "../../../../interfaces/context-menu-item.interface";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {PositionEnum} from "../../../../shared/enums/position.enum";

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
  @Output() close = new EventEmitter<void>();
  @Input() submenuDirection: 'left' | 'right' = 'right';
  @Input() position: PositionEnum = PositionEnum.ABSOLUTE;

  activeSubmenu: string | null = null;
  submenuPosition: 'left' | 'right' = 'right';

  private isInitialClick: boolean = true;

  @Output() itemSelected = new EventEmitter<string>();

  constructor(private elementRef: ElementRef) {
    this.submenuPosition = this.submenuDirection;
  }

  ngOnInit(): void {
    this.submenuPosition = this.submenuDirection;
    this.adjustPosition();

    requestAnimationFrame(() => {
      this.isInitialClick = false;
    });
    console.log(this.items);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isInitialClick) {
      return; // Игнорируем первый клик, который открывает меню
    }
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeMenu();
    }
  }

  onItemClick(item: ContextMenuItem): void {
    this.itemSelected.emit(item.id);
    if (item.action && !item.isSubmenu) {
      if(item.possibleSelect){
        item.select = !item.select;
      }
      item.action();
      this.closeMenu();
    }
  }

  onSubmenuClose(): void {
    this.closeMenu();
  }

  private closeMenu(): void {
    this.activeSubmenu = null;
    this.close.emit();
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
