import {Component, Input} from '@angular/core';
import {NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";

@Component({
  selector: 'app-header-description',
  standalone: true,
  imports: [
    NgIf,
    NgSwitchCase,
    NgSwitch,
    NgSwitchDefault
  ],
  templateUrl: './header-description.component.html',
  styleUrl: './header-description.component.css'
})
export class HeaderDescriptionComponent {
  @Input() titleType: string = 'h2'; // по умолчанию h2
  @Input() titleSuffix: string = ''
  @Input() title: string = ''; // текст заголовка
  @Input() titleSecondLevel?: string = '';
  @Input() titleSecondType: string = 'h3';
  @Input() description: string = ''; // текст описания
}
