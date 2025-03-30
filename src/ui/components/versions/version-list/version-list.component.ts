import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Version} from "../../../../interfaces/version.interface";
import {NgForOf, NgIf} from "@angular/common";
import {getFileIcon} from "../../../../utils/file-icon.utils";

@Component({
  selector: 'app-version-list',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './version-list.component.html',
  styleUrl: './version-list.component.css'
})
export class VersionListComponent {
  @Input() filePath: string = '';
  @Input() fileName: string = '';
  @Input() versions: Version[] = [];
  @Input() isCollapsed: boolean = false;
  @Output() versionSelected = new EventEmitter<string>();
  @Output() collapseToggled = new EventEmitter<boolean>();

  selectVersion(versionId: string): void {
    this.versionSelected.emit(versionId);
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.collapseToggled.emit(this.isCollapsed);
  }

  protected readonly getFileIcon = getFileIcon;
}
