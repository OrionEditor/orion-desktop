import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {AsyncPipe, NgIf, NgStyle} from "@angular/common";
import {FileSystemService} from "../../../../../../services/FileSystem/fileSystem.service";
import {TextModalComponent} from "../../../../modals/text-modal/text-modal.component";
import {TEXT_MODAL_TYPES} from "../../../../../../shared/constants/modals/textModal/textModal.types";
import {FILE_TYPES, getExtensionWithDot} from "../../../../../../shared/constants/FileSystem/files.types";
import {TextModalService} from "../../../../../../services/Modals/TextModal/textModal.service";
import {ValidationService} from "../../../../../../services/validation.service";
import {TranslateService} from "@ngx-translate/core";
import {ContextMenuComponent} from "../../../../contextMenus/context-menu/context-menu.component";
import {
  FileSystemSortingContextMenuService
} from "../../../../../../services/FileSystem/file-system-sorting.context-menu.service";
import {PositionEnum} from "../../../../../../shared/enums/position.enum";

@Component({
  selector: 'app-sidebar-filesystem-controls',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgStyle,
    TextModalComponent,
    AsyncPipe,
    ContextMenuComponent
  ],
  templateUrl: './sidebar-filesystem-controls.component.html',
  styleUrl: './sidebar-filesystem-controls.component.css'
})
export class SidebarFilesystemControlsComponent {
  @Input() projectPath: string | null = null;
  @Input() fileStructureLength: number = 1;

  @Output() expandAllEvent = new EventEmitter<void>();
  @Output() collapseAllEvent = new EventEmitter<void>();
  @Output() sortChange = new EventEmitter<string>();
  isExpanded = false;
  showSortContextMenu = false;
  menuX: number = 0;
  menuY: number = 0

  onRightClick(event: MouseEvent): void {
    event.preventDefault();
    this.menuX = event.clientX;
    this.menuY = event.clientY;
    this.showSortContextMenu = true;
  }

  onMenuClose(): void {
    this.showSortContextMenu = false;
  }

  constructor(private fileSystemService: FileSystemService, protected textModalService: TextModalService, private validateService: ValidationService, private translateService: TranslateService, protected sortingContextMenuService: FileSystemSortingContextMenuService) {}

  async confirmModal() {
    const modalInput = this.textModalService.modalInput.trim();
    const modalType = this.textModalService.modalType;

    if (!this.projectPath || modalInput.length === 0) {
      alert('Не может быть пустым!');
      return;
    }

    try {
      if (modalType === TEXT_MODAL_TYPES.NOTE) {
        try {
          await this.fileSystemService.createFile(
              this.textModalService.path === '' ? this.projectPath : this.textModalService.path,
              modalInput + getExtensionWithDot(FILE_TYPES.MD)
          );
          await this.fileSystemService.loadFileStructure(this.projectPath!);
        } catch (e){}

      } else if (modalType === TEXT_MODAL_TYPES.FOLDER) {
        try {
          await this.fileSystemService.createDirectory(
              this.textModalService.path === '' ? this.projectPath : this.textModalService.path,
              modalInput
          );
          await this.fileSystemService.loadFileStructure(this.projectPath!);
        } catch (e) {}
      }
      this.closeModal();
    } catch (error) {
    }
  }

  closeModal() {
    this.textModalService.closeModal();
  }

  async onCreateNote() {
    const translatedHeader = await this.translateService.get(`projectPage.modals.createNoteModal.header`).toPromise();
    const translatedPlaceholder = await this.translateService.get(`projectPage.modals.createNoteModal.placeholder`).toPromise();

    this.textModalService.openModal(translatedHeader, TEXT_MODAL_TYPES.NOTE, translatedPlaceholder);
  }

  async onCreateFolder() {
    const translatedHeader = await this.translateService.get(`projectPage.modals.createFolderModal.header`).toPromise();
    const translatedPlaceholder = await this.translateService.get(`projectPage.modals.createFolderModal.placeholder`).toPromise();

    this.textModalService.openModal(translatedHeader, TEXT_MODAL_TYPES.FOLDER, translatedPlaceholder);
  }

  toggleExpandCollapse() {
    if (this.isExpanded) {
      this.collapseAllEvent.emit();
    } else {
      this.expandAllEvent.emit();
    }
    this.isExpanded = !this.isExpanded;
  }

  onSortSelect(sortId: string): void {
    const index = this.sortingContextMenuService.menuSubject.value.findIndex(item => item.id === sortId);
    if (index !== -1) {
      this.sortingContextMenuService.setActive(index);
      this.sortChange.emit(sortId);
    }
    this.showSortContextMenu = false;
  }

  protected readonly PositionEnum = PositionEnum;
}
