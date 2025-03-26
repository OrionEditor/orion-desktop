import {Component, ElementRef, Input, SimpleChanges, ViewChild} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {MarkdownService} from "../../../../services/Markdown/markdown.service";
import {marked} from "marked";
import {FormsModule} from "@angular/forms";
import {MarkdownStatistics} from "../../../../interfaces/markdown/markdown-statisctics.interface";
import {MarkdownInfoService} from "../../../../services/Markdown/markdown-info.service";
import {DialogService} from "../../../../services/dialog.service";
import {MarkdownExportService} from "../../../../services/Markdown/markdown-export.service";
import {FILE_TYPES, getExtensionWithDot} from "../../../../shared/constants/FileSystem/files.types";
import {MarkdownImportService} from "../../../../services/Markdown/markdown.import.service";
import {getFileExtension} from "../../../../utils/file.utils";
import {MarkdownContentComponent} from "../markdown-content/markdown-content.component";
import {ImageContentComponent} from "../image-content/image-content.component";
import {VideoContentComponent} from "../video-content/video-content.component";
import {NotOpenContentComponent} from "../not-open-content/not-open-content.component";
import {TextContentComponent} from "../text-content/text-content.component";

@Component({
  selector: 'app-content-tab',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    FormsModule,
    MarkdownContentComponent,
    ImageContentComponent,
    VideoContentComponent,
    NotOpenContentComponent,
    TextContentComponent
  ],
  templateUrl: './content-tab.component.html',
  styleUrl: './content-tab.component.css'
})
export class ContentTabComponent {
  @Input() filePath: string = '';
  @Input() fileName: string = '';

  isImageFile(extension: string): boolean {
    return Object.values(FILE_TYPES.IMAGE).includes(extension);
  }

  isVideoFile(extension: string): boolean {
    return Object.values(FILE_TYPES.VIDEO).includes(extension);
  }

  isSupportedFile(extension: string): boolean {
    return (
        extension === FILE_TYPES.MD ||
        extension === FILE_TYPES.TXT ||
        extension === FILE_TYPES.HTML ||
        extension === FILE_TYPES.PDF ||
        this.isImageFile(extension) ||
        this.isVideoFile(extension)
    );
  }

  protected readonly getFileExtension = getFileExtension;
  protected readonly FILE_TYPES = FILE_TYPES;
}
