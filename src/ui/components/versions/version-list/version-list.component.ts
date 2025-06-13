import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {getFileIcon} from "../../../../utils/file-icon.utils";
import {FormsModule} from "@angular/forms";
import {StoreService} from "../../../../services/Store/store.service";
import {StoreKeys} from "../../../../shared/constants/vault/store.keys";
import {NetworkService} from "../../../../services/Network/network.service";
import {FillButtonComponent} from "../../buttons/fill-button/fill-button.component";
import {success} from "../../../../styles/var/globalColors";
import {WindowService} from "../../../../services/window.service";
import {GetDocumentResponse} from "../../../../interfaces/routes/document.interface";
import {Version} from "../../../../interfaces/routes/document.interface";
import {stat} from "@tauri-apps/plugin-fs";
import {join} from "@tauri-apps/api/path";

@Component({
  selector: 'app-version-list',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    FormsModule,
    FillButtonComponent,
    DatePipe
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
  @Output() newVersion = new EventEmitter<void>();
  @Output() delVersion = new EventEmitter<void>();
  @Input() currentDocument: GetDocumentResponse | null = null;
  @Input() projectPath: string = ';'

  searchQuery: string = '';
  filteredVersions: Version[] = [];

  hasAuth: string | null = '';

  constructor(private windowService: WindowService) {
  }

  async ngOnInit(){
    this.hasAuth = await StoreService.get(StoreKeys.ACCESS_TOKEN);
    await this.updateFileSizes();
  }

  async ngOnChanges() {
    this.hasAuth = await StoreService.get(StoreKeys.ACCESS_TOKEN);
    await this.updateFileSizes();
    this.filterVersions();
  }

  async updateFileSizes() {
    if (!this.currentDocument || !this.currentDocument.document.id) {
      return;
    }

    const documentId = this.currentDocument.document.id;
    const versionsDir = await join(this.projectPath, '.orion', 'versions', documentId);

    this.versions = await Promise.all(this.versions.map(async (version) => {
      let filePathToCheck: string;
      if (version.version_number === 0) {
        // Локальная версия
        filePathToCheck = this.filePath;
      } else {
        // Другие версии
        const versionFileName = `v${version.version_number}_${this.fileName}`;
        filePathToCheck = await join(versionsDir, versionFileName);
      }

      try {
        const stats = await stat(filePathToCheck);
        const size = this.formatFileSize(stats.size);
        return { ...version, fileSize: size };
      } catch (e) {
        console.error(`Ошибка при получении размера файла для версии ${version.version_number}:`, e);
        return { ...version, fileSize: 'N/A' };
      }
    }));

    this.filterVersions();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  async openLoginPage(){
    await this.windowService.openLoginWindow();
  }

  selectVersion(versionId: string): void {
    this.versionSelected.emit(versionId);
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.collapseToggled.emit(this.isCollapsed);
  }

  createNewVersion(): void {
    this.newVersion.emit();
  }

  deleteVersion(): void {
    this.delVersion.emit();
  }

  hasActiveVersion(): boolean {
    return this.versions.some(v => v.is_active);
  }

  filterVersions(): void {
    if (!this.searchQuery) {
      this.filteredVersions = [...this.versions];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredVersions = this.versions.filter(version =>
          // version.fileName.toLowerCase().includes(query) ||
          version.version_number.toString().toLowerCase().includes(query) ||
          version.created_at.toLowerCase().includes(query)
      );
    }
  }

  protected readonly getFileIcon = getFileIcon;
  protected readonly NetworkService = NetworkService;
  protected readonly success = success;
}
