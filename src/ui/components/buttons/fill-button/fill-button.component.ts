import {Component, Input} from '@angular/core';
import {NgStyle} from "@angular/common";
import {Renderer2, ElementRef} from "@angular/core";
import {success} from "../../../../styles/var/globalColors";


@Component({
  selector: 'app-fill-button',
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: './fill-button.component.html',
  styleUrl: './fill-button.component.css'
})
export class FillButtonComponent {
  @Input() buttonText: string = '';
  @Input() colorBtn: string = success;

  constructor(private renderer: Renderer2, private el: ElementRef) {
  }

  get buttonStyles() {
    return {
      'background-color': `${this.colorBtn}`,
      color: 'white'
    };
  }
}
