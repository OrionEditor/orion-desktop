import {Component, Input} from '@angular/core';
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-logo-container',
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: './logo-container.component.html',
  styleUrl: './logo-container.component.css'
})
export class LogoContainerComponent {
  @Input() width: string = '150px';
  @Input() height: string = '150px';

  get logoStyles() {
    return {
      'width': this.width,
      'height': this.height
    };
  }

}
