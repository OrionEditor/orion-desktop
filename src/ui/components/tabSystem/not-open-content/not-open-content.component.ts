import {Component, Input} from '@angular/core';
import {getFileExtension} from "../../../../utils/file.utils";

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

  get fileExtension(): string {
    return getFileExtension(this.fileName) || 'неизвестный формат';
  }
}
