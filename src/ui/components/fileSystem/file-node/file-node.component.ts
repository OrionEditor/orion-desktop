import {Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild} from '@angular/core';
import {FileSystemNode} from "../../../../services/FileSystem/fileSystem.service";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {ContextMenuNodeComponent} from "../../contextMenus/context-menu-node/context-menu-node.component";
import {DEFAULT_FILE_ICON, FILE_ICONS} from "../../../../shared/constants/FileSystem/fileIcons";
import {DEFAULT_FOLDER_ICON} from "../../../../shared/constants/FileSystem/folder";
import {TranslatePipe} from "@ngx-translate/core";
import { ChangeDetectorRef } from '@angular/core';
import {TabService} from "../../../../services/tab.service";
import {FILE_TYPES} from "../../../../shared/constants/FileSystem/files.types";
import {getFileIcon} from "../../../../utils/file-icon.utils";


@Component({
  selector: 'app-file-node',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    ContextMenuNodeComponent,
    NgStyle,
    TranslatePipe
  ],
  templateUrl: './file-node.component.html',
  styleUrl: './file-node.component.css'
})
export class FileNodeComponent {

  @Input() node!: FileSystemNode;
  @Output() dragstart = new EventEmitter<DragEvent>();
  @Output() dragover = new EventEmitter<DragEvent>();
  @Output() drop = new EventEmitter<DragEvent>();
  @Output() fileSelected = new EventEmitter<{ path: string; name: string }>();

  contextMenuVisible = false;
  contextMenuPosition = { x: 0, y: 0 };

  constructor() {}

  ngOnInit() {
    // Устанавливаем начальное состояние expanded, если оно не задано
    if (this.node.expanded === undefined) {
      this.node.expanded = false;
    }
    document.addEventListener('click', this.onDocumentClick.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.onDocumentClick.bind(this));
  }

  onDocumentClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (
        this.contextMenuVisible &&
        !targetElement.closest('.file-node') &&
        !targetElement.closest('app-context-menu')
    ) {
      this.closeContextMenu();
    }
  }

  toggleExpand() {
    if (this.isDirectory() && this.node.children?.length) {
      this.node.expanded = !this.node.expanded;
    } else if (!this.isDirectory()) {
      this.openFile();
    }
  }

  isHiddenDirectory(): boolean {
    return this.node.name.startsWith('.');
  }

  isDirectory(): boolean {
    return this.node.type_id === 'Directory';
  }

  openFile() {
    if (!this.isDirectory()) {
      this.fileSelected.emit({
        path: this.node.path,
        name: this.node.name
      });
      console.log('Файл открыт:', this.node.name);
    }
  }

  onRightClick(event: MouseEvent) {
    event.preventDefault();
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    this.contextMenuVisible = true;
  }

  closeContextMenu() {
    this.contextMenuVisible = false;
  }

  countContents(node: FileSystemNode): { files: number; folders: number } {
    if (!node.children || node.children.length === 0) {
      return { files: node.type_id === 'File' ? 1 : 0, folders: node.type_id === 'Directory' ? 1 : 0 };
    }

    return node.children.reduce(
        (acc, child) => {
          const childCount = this.countContents(child);
          return {
            files: acc.files + childCount.files,
            folders: acc.folders + childCount.folders
          };
        },
        { files: 0, folders: node.type_id === 'Directory' ? 1 : 0 }
    );
  }

  getNodeName(): string {
    if (this.isDirectory()) {
      return this.node.name;
    }
    const dotIndex = this.node.name.lastIndexOf('.');
    return dotIndex !== -1 ? this.node.name.substring(0, dotIndex) : this.node.name;
  }

  getExpandedChildrenCount(node: FileSystemNode): number {
    if (!node.children || !node.expanded) {
      return 0;
    }
    let count = 0;
    for (const child of node.children) {
      count++;
      count += this.getExpandedChildrenCount(child);
    }
    return count;
  }

  getIndentLineHeight(): string {
    const count = this.getExpandedChildrenCount(this.node);
    return `${(count + 1) * 24}px`; // 24px — высота одного элемента
  }

  onDragStart(event: DragEvent, node: FileSystemNode) {
    event.stopPropagation();
    this.dragstart.emit();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragover.emit(event);
  }

  onDrop(event: DragEvent, node: FileSystemNode) {
    event.stopPropagation();
    this.drop.emit(event);
  }

  protected readonly DEFAULT_FOLDER_ICON = DEFAULT_FOLDER_ICON;
  protected readonly getFileIcon = getFileIcon;
}
