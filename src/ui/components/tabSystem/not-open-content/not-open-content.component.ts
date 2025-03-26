import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-not-open-content',
  standalone: true,
  imports: [],
  templateUrl: './not-open-content.component.html',
  styleUrl: './not-open-content.component.css'
})
export class NotOpenContentComponent {
  @Input() filePath: string = '';
  @Input() fileName: string = '';
}
