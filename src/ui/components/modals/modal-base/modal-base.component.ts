import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-modal-base',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './modal-base.component.html',
  styleUrl: './modal-base.component.css'
})
export class ModalBaseComponent {
  @Input() isOpen: boolean = false;
  @Input() closeOnOverlayClick: boolean = true;
  @Input() contentBackgroundColor: string = '#185010';
  @Input() contentBorderRadius: string = '8px';
  @Input() isDraggable: boolean = false;
  @Output() closed = new EventEmitter<void>();

  @ViewChild('modalContent', { static: false }) modalContent!: ElementRef<HTMLDivElement>;

  private isDragging = false;
  private startX = 0;
  private startY = 0;
  private currentLeft = 0;
  private currentTop = 0;


  ngOnChanges(changes: any): void {
    if (changes.isOpen && this.isOpen && this.modalContent) {
      this.resetPosition();
    }
  }

  closeModal(): void {
    this.isOpen = false;
    this.resetPosition();
    this.closed.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if (this.closeOnOverlayClick && event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  startDragging(event: MouseEvent): void {
    if (!this.isDraggable || !this.modalContent) return;

    this.isDragging = true;
    this.startX = event.clientX;
    this.startY = event.clientY;

    // Получаем текущие значения left и top из стилей (или 0, если не заданы)
    const computedStyle = window.getComputedStyle(this.modalContent.nativeElement);
    this.currentLeft = parseFloat(computedStyle.left) || 0;
    this.currentTop = parseFloat(computedStyle.top) || 0;

    event.preventDefault();
  }

  onDrag(event: MouseEvent): void {
    if (!this.isDragging || !this.modalContent) return;

    const dx = event.clientX - this.startX;
    const dy = event.clientY - this.startY;

    const newLeft = this.currentLeft + dx;
    const newTop = this.currentTop + dy;

    // Ограничиваем перемещение в пределах окна
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const contentWidth = this.modalContent.nativeElement.offsetWidth;
    const contentHeight = this.modalContent.nativeElement.offsetHeight;

    const constrainedLeft = Math.max(0, Math.min(newLeft, windowWidth - contentWidth));
    const constrainedTop = Math.max(0, Math.min(newTop, windowHeight - contentHeight));

    this.modalContent.nativeElement.style.left = `${constrainedLeft}px`;
    this.modalContent.nativeElement.style.top = `${constrainedTop}px`;
  }

  stopDragging(): void {
    if (this.isDragging && this.modalContent) {
      const computedStyle = window.getComputedStyle(this.modalContent.nativeElement);
      this.currentLeft = parseFloat(computedStyle.left) || 0;
      this.currentTop = parseFloat(computedStyle.top) || 0;
    }
    this.isDragging = false;
  }

  private resetPosition(): void {
    if (this.modalContent) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const contentWidth = this.modalContent.nativeElement.offsetWidth;
      const contentHeight = this.modalContent.nativeElement.offsetHeight;

      this.currentLeft = (windowWidth - contentWidth) / 2;
      this.currentTop = (windowHeight - contentHeight) / 2;

      this.modalContent.nativeElement.style.left = `${this.currentLeft}px`;
      this.modalContent.nativeElement.style.top = `${this.currentTop}px`;
    }
  }
}
