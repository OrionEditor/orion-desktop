import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {AsyncPipe, NgForOf, NgIf, NgStyle} from "@angular/common";
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
import {getFileExtension} from "../../../../../../utils/file.utils";
import {TagService} from "../../../../../../services/Tags/tags.sevice";
import {getWorkspacePath} from "../../../../../../shared/constants/workspace/workspace-path.const";
import {FillButtonComponent} from "../../../../buttons/fill-button/fill-button.component";
import {danger, success} from "../../../../../../styles/var/globalColors";

@Component({
  selector: 'app-sidebar-filesystem-controls',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgStyle,
    TextModalComponent,
    AsyncPipe,
    ContextMenuComponent,
    NgForOf,
    FillButtonComponent
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

  showTagModal = false;
  newTagLabel: string = '';
  newTagColor: string = '#2BB63B';

  async ngOnInit() {
    if (this.projectPath) {
      await this.tagService.syncTags(getWorkspacePath(this.projectPath));
    }
  }

  onRightClick(event: MouseEvent): void {
    event.preventDefault();
    this.menuX = event.clientX;
    this.menuY = event.clientY;
    this.showSortContextMenu = true;
  }

  onMenuClose(): void {
    this.showSortContextMenu = false;
  }

  constructor(private fileSystemService: FileSystemService, protected textModalService: TextModalService, private validateService: ValidationService, private translateService: TranslateService, protected sortingContextMenuService: FileSystemSortingContextMenuService, protected tagService: TagService) {}

  async confirmModal(inputValue: string) {
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
      // else if (modalType === TEXT_MODAL_TYPES.TAG) {
      //   await this.tagService.addTag(this.projectPath + '\\.orion', modalInput, '#FF5733'); // Цвет по умолчанию
      //   this.closeModal();
      // }
      else if (modalType === TEXT_MODAL_TYPES.ADD_TAG) {
        // await this.tagService.addTagToElement(this.projectPath + '\\.orion', this.textModalService.path, modalInput);

        const tags = await this.tagService.getTags(getWorkspacePath(this.projectPath));
        console.log(tags);
        console.log(modalInput);
        const tag = tags.find(t => t.tag_label == modalInput);
        console.log('tag:', tag);
        if (!tag) {
          alert('Тег с таким названием не найден!');
          return;
        }
        await this.tagService.addTagToElement(this.projectPath + '\\.orion', this.textModalService.path, tag.tag_id);
      }
      else if(modalType === TEXT_MODAL_TYPES.RENAME){

        try {
          await FileSystemService.renameFile(
              this.textModalService.path === '' ? this.projectPath : this.textModalService.path,
              modalInput + `.${getFileExtension(this.textModalService.name)}`
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

  async onCreateTag() {
    const translatedHeader = 'Создать тег';
    const translatedPlaceholder = 'Введите имя тега...';
    this.textModalService.openModal(translatedHeader, TEXT_MODAL_TYPES.TAG, translatedPlaceholder);
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

  openTagModal() {
    this.showTagModal = true;
    this.newTagLabel = '';
    this.newTagColor = '#2BB63B';
  }

  closeTagModal() {
    this.showTagModal = false;
  }

  async createTag() {
    if (!this.projectPath || !this.newTagLabel.trim()) {
      alert('Имя тега не может быть пустым!');
      return;
    }
    try {
      await this.tagService.addTag(this.projectPath + '\\.orion', this.newTagLabel.trim(), this.newTagColor);
      this.newTagLabel = '';
      this.newTagColor = '#2BB63B';
    } catch (error) {
      console.error('Ошибка при создании тега:', error);
    }
  }

  async deleteTag(tagId: string) {
    if (!this.projectPath) return;
    try {
      await this.tagService.removeTag(this.projectPath + '\\.orion', tagId);
    } catch (error) {
      console.error('Ошибка при удалении тега:', error);
    }
  }

  protected readonly PositionEnum = PositionEnum;
  protected readonly danger = danger;
  protected readonly success = success;
}
