import {Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {FileSystemNode} from "../../../../interfaces/filesystem/filesystem-node.interface";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {ContextMenuNodeComponent} from "../../contextMenus/context-menu-node/context-menu-node.component";
import {DEFAULT_FOLDER_ICON} from "../../../../shared/constants/FileSystem/folder";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {getFileIcon} from "../../../../utils/file-icon.utils";
import {ContextMenuComponent} from "../../contextMenus/context-menu/context-menu.component";
import {FileNodeContextmenu} from "../../../../shared/constants/contextMenu/filenode.contextmenu";
import {ContextMenuItem} from "../../../../interfaces/context-menu-item.interface";
import {FileSystemService} from "../../../../services/FileSystem/fileSystem.service";
import {ConfigService} from "../../../../services/configService";
import {TEXT_MODAL_TYPES} from "../../../../shared/constants/modals/textModal/textModal.types";
import {TextModalService} from "../../../../services/Modals/TextModal/textModal.service";


@Component({
  selector: 'app-file-node',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    ContextMenuNodeComponent,
    NgStyle,
    TranslatePipe,
    ContextMenuComponent
  ],
  templateUrl: './file-node.component.html',
  styleUrl: './file-node.component.css'
})
export class FileNodeComponent {

  @Input() node!: FileSystemNode;
  projectPath: string | null = '';
  @Output() dragstart = new EventEmitter<DragEvent>();
  @Output() dragover = new EventEmitter<DragEvent>();
  @Output() drop = new EventEmitter<DragEvent>();
  @Output() fileSelected = new EventEmitter<{ path: string; name: string }>();

  showContextMenu = false;
  contextMenuPosition = { x: 0, y: 0 };

  FileNodeContextMenuFilter: ContextMenuItem[] = FileNodeContextmenu(this.node, this.deleteFile.bind(this), this.onCreateFolder.bind(this), this.onCreateNote.bind(this));

  constructor(private fileSystemService: FileSystemService, private configService: ConfigService, private translateService: TranslateService, private textModalService: TextModalService) {}

  ngOnInit() {
    this.projectPath = this.configService.getLastOpened();
    if (this.node.expanded === undefined) {
      this.node.expanded = false;
    }
    document.addEventListener('click', this.onDocumentClick.bind(this));
    this.FileNodeContextMenuFilter = FileNodeContextmenu(this.node, this.deleteFile.bind(this), this.onCreateFolder.bind(this), this.onCreateNote.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.onDocumentClick.bind(this));
  }

  onDocumentClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (
        this.showContextMenu &&
        !targetElement.closest('.file-node') &&
        !targetElement.closest('app-context-menu')
    ) {
      this.onMenuClose();
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
    this.showContextMenu = true;
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

  onMenuClose(){
    this.showContextMenu = false;
  }

  async deleteFile(){
    try {
      await FileSystemService.deleteFile(this.node.path);
      await this.fileSystemService.loadFileStructure(this.projectPath!);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  async onCreateNote() {
    const translatedHeader = await this.translateService.get(`projectPage.modals.createNoteModal.header`).toPromise();
    const translatedPlaceholder = await this.translateService.get(`projectPage.modals.createNoteModal.placeholder`).toPromise();

    this.textModalService.openModal(translatedHeader, TEXT_MODAL_TYPES.NOTE, translatedPlaceholder, this.node.path);
  }

  async onCreateFolder() {
    const translatedHeader = await this.translateService.get(`projectPage.modals.createFolderModal.header`).toPromise();
    const translatedPlaceholder = await this.translateService.get(`projectPage.modals.createFolderModal.placeholder`).toPromise();

    this.textModalService.openModal(translatedHeader, TEXT_MODAL_TYPES.FOLDER, translatedPlaceholder, this.node.path);
  }

  protected readonly DEFAULT_FOLDER_ICON = DEFAULT_FOLDER_ICON;
  protected readonly getFileIcon = getFileIcon;
  protected readonly FileNodeContextmenu = FileNodeContextmenu;
}
