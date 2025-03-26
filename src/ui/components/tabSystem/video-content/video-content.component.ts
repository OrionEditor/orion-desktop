import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-video-content',
  standalone: true,
  imports: [],
  templateUrl: './video-content.component.html',
  styleUrl: './video-content.component.css'
})
export class VideoContentComponent {
  @Input() filePath: string = '';
  @Input() fileName: string = '';
}
