import {Component, ElementRef, HostListener, Input, Renderer2} from '@angular/core';
import {NgStyle} from "@angular/common";
import {success} from "../../../../styles/var/globalColors";
import {ConfigService} from "../../../../services/configService";

@Component({
  selector: 'app-outline-button',
  standalone: true,
    imports: [
        NgStyle
    ],
  templateUrl: './outline-button.component.html',
  styleUrl: './outline-button.component.css'
})
export class OutlineButtonComponent {
  @Input() buttonText: string = 'Кнопка';
  @Input() colorBtn: string = success; // цвет по умолчанию
  isHovered: boolean = false; // Для отслеживания наведения

  constructor(private configService: ConfigService) {
  }

  get buttonStyles() {
    return {
      'border-color': `${this.colorBtn}`, // применяем CSS-переменную цвета
      color: this.configService.getTheme() === 'dark' ? 'white' : 'black',
      'background-color': this.isHovered ? success : 'transparent' // Изменение фона при наведении
    };
  }

  // Отслеживание наведения
  @HostListener('mouseenter') onMouseEnter() {
    this.isHovered = true;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.isHovered = false;
  }
}
