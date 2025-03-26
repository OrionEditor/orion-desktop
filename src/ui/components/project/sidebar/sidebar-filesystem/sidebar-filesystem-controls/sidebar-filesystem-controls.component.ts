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

@Component({
  selector: 'app-sidebar-filesystem-controls',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgStyle,
    TextModalComponent,
    AsyncPipe
  ],
  templateUrl: './sidebar-filesystem-controls.component.html',
  styleUrl: './sidebar-filesystem-controls.component.css'
})
export class SidebarFilesystemControlsComponent {
  @Input() projectPath: string | null = null;

  @Output() expandAllEvent = new EventEmitter<void>();
  @Output() collapseAllEvent = new EventEmitter<void>();

  constructor(private fileSystemService: FileSystemService, protected textModalService: TextModalService, private validateService: ValidationService, private translateService: TranslateService) {}

  // onExpandAll() {
  //   this.expandAllEvent.emit();
  // }
  //
  // onCollapseAll() {
  //   this.collapseAllEvent.emit();
  // }

  // toggleFileSystem() {
  //   this.fileSystemService.toggleFileSystem();
  // }

  async confirmModal() {
    const modalInput = this.textModalService.modalInput.trim();
    const modalType = this.textModalService.modalType;

    if (!this.projectPath || this.validateService.validateFileFolderName(modalInput)) {
      alert('');
      return;
    }

    try {
      if (modalType === TEXT_MODAL_TYPES.NOTE) {
        await this.fileSystemService.createFile(
            this.projectPath,
            modalInput + getExtensionWithDot(FILE_TYPES.MD)
        );
      } else if (modalType === TEXT_MODAL_TYPES.FOLDER) {
        await this.fileSystemService.createDirectory(
            this.projectPath,
            modalInput
        );
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
}
